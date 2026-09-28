let $BlockRightClickedKubeEvent = Java.loadClass("dev.latvian.mods.kubejs.block.BlockRightClickedKubeEvent")
let $UseOnContext = Java.loadClass("net.minecraft.world.item.context.UseOnContext")
let $BlockHitResult = Java.loadClass("net.minecraft.world.phys.BlockHitResult")
let $SlabBlock = Java.loadClass("net.minecraft.world.level.block.SlabBlock")
let $StairBlock = Java.loadClass("net.minecraft.world.level.block.StairBlock")

ServerEvents.tags("item", event => {
	event.add("bubble_cobble:do_not_replace_when_in_offhand", [
		"#bubble_cobble:lanterns",
		"#minecraft:candles",
		"#supplementaries:candle_holders"
	])
})

// Replace destroyed blocks with the blocks in your offhand.
function BlockReplaceData() {
	this.last_action_tick = 0
	this.place_delay = 0
}
/** @param {$UUID} uuid @returns {BlockReplaceData} */
BlockReplaceData.get_or_create = function(uuid) {
	if (!players_block_replace_data[uuid]) {
		players_block_replace_data[uuid] = new BlockReplaceData()
	}
	return players_block_replace_data[uuid]
}
const players_block_replace_data = {}
BlockEvents.broken(event => {
	const player = /** @type {$ServerPlayer} */ (event.player)
	if (!player) {
		console.warn("No player for BlockEvents.broken(). This should never normally happen.")
		return
	}

	const level = event.level
	const held_item = player.offHandItem
	const held_block = held_item.block
	if (!held_block && held_item.id != "kubejs:trowel") {
		return
	}

	const broken_level_block = event.block // "Instance" of the block in the world.
	const broken_block = broken_level_block.getBlock()
	if (held_item.id == broken_block?.item?.id) {
		return // Don't replace the block I just destroyed with the same block I am holding.
	}
	// TODO: Special case: We don't want the Trowel to replace blocks we're trying to get rid of.

	const broken_state = broken_level_block.getBlockState()
	const broken_pos = broken_level_block.getPos().immutable() // Without immutable(), broken_pos may change in between schedules.
	if (broken_state.getDestroySpeed(level, broken_pos) <= 0.1) {
		// Don't replace blocks that break instantaneously.
		// These usually include grass, torches, etc., or blocks whose destruction may be accidental.
		return
	}

	if (held_block && held_block.defaultBlockState().getDestroySpeed(level, broken_pos) <= 0.1) {
		// And don't let any block that would be broken instantly do the replacing.
		// These usually include grass, torches, etc., or blocks whose placement may be accidental.
		return
	}
	if (held_item.hasTag("bubble_cobble:do_not_replace_when_in_offhand")) {
		return
	}

	// Allow queueing the placement of multiple blocks at once, which will happen one tick after another.
	const block_replace = BlockReplaceData.get_or_create(player.uuid)
	if (player.tickCount > block_replace.last_action_tick) {
		block_replace.last_action_tick = player.tickCount
		block_replace.place_delay = 0
	}
	block_replace.place_delay += 0.5

	if (block_replace.place_delay >= 1.0) {
		event.level.spawnParticles("minecraft:wax_off", false,
			broken_pos.getCenter().x(), broken_pos.getCenter().y(), broken_pos.getCenter().z(),
			0, 0, 0,
			1, 2
		)

		// let r = 0.3 + block_replace.place_delay * 0.025
		// let g = 0.3 + block_replace.place_delay * 0.025
		// let b = 0.5 + block_replace.place_delay * 0.025
		// let scale = 0.15// + block_replace.place_delay * 0.01

		// event.level.spawnParticles(`create:cube{r:${r},g:${g},b:${b},scale:${scale},avg_age:${block_replace.place_delay * 0.25},hot:false}`, false,
		// 	broken_pos.getCenter().x(), broken_pos.getCenter().y(), broken_pos.getCenter().z(),
		// 	0, 0, 0,
		// 	0, 0
		// )
	}

	// By the time this function is called, place_delay will have inevitably been increased. Storing for freezing it.
	const current_place_delay = block_replace.place_delay
	const try_placing_down = () => {
		// Failsafe to not place blocks accidentally in front/back.
		 // Rough approximation but still.
		if (broken_pos.distManhattan(player.blockPosition()) > player.blockInteractionRange() * 2.5) {
			player.setStatusMessage("You are way too far to replace this block.")
			return false
		}

		if (!level.getBlockState(broken_pos).isAir()) {
			return false
		}

		let block_hit_result = new $BlockHitResult(player.eyePosition, player.facing, broken_pos, false)
		if (held_item.id == "kubejs:trowel") {
			// Annoying special case. I don't know why the RightClickedEvent isn't fired in useOn().
			return global.use_trowel_on_block(new $BlockRightClickedKubeEvent(
				held_item, player, "off_hand", broken_pos, player.facing, block_hit_result
			))
		}

		let interaction_result = held_item.useOn(new $UseOnContext(
			level, player, "off_hand", held_item, block_hit_result
		))

		if (interaction_result == "fail") {
			return false
		}
		if (held_block) {
			if (interaction_result.indicateItemUse()) {
				let sound_type = held_block.getSoundType(held_block.defaultBlockState(), level, broken_pos, player)
				play_sound_globally(level, broken_pos.getCenter(), sound_type.placeSound, "blocks", 1.0, Math.min(0.75 + current_place_delay * 0.1, 2.0))
			}
		}
		if (interaction_result.shouldSwing()) {
			level.server.scheduleInTicks(3, () => {
				player.swing("off_hand", true)
			})
		}

		let placed_block = level.getBlock(broken_pos).getBlock()
		if ((placed_block instanceof $SlabBlock && broken_block instanceof $SlabBlock)
			|| (placed_block instanceof $StairBlock && broken_block instanceof $StairBlock)
		) {
			// Quite annoying that I depend on broken_level_block for this, because of the getProperties() Map.
			level.setBlock(broken_pos, Block.withProperties(placed_block, broken_level_block.getProperties()), 2)
		}
		return true

	}

	level.server.scheduleInTicks(block_replace.place_delay, () => {
		if (try_placing_down()) {
			event.level.spawnParticles("supplementaries:bomb_explosion", false,
				broken_pos.getCenter().x(), broken_pos.getCenter().y(), broken_pos.getCenter().z(),
				0, 0, 0,
				1, 0
			)
		} else {
			if (!player.cooldowns.isOnCooldown(held_item)) {
				// Hacky earrape prevention.
				player.addItemCooldown(held_item, 5)
				player.playNotifySound("bubble_cobble:buzz", "players", 1.0, 1.0)
			}
		}
	})
})
