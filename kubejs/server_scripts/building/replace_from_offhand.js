/** @type {typeof import("dev.latvian.mods.kubejs.block.BlockRightClickedKubeEvent").$BlockRightClickedKubeEvent } */
let $BlockRightClickedKubeEvent  = Java.loadClass("dev.latvian.mods.kubejs.block.BlockRightClickedKubeEvent")
/** @type {typeof import("net.minecraft.world.item.context.UseOnContext").$UseOnContext } */
let $UseOnContext  = Java.loadClass("net.minecraft.world.item.context.UseOnContext")
/** @type {typeof import("net.minecraft.world.phys.BlockHitResult").$BlockHitResult } */
let $BlockHitResult  = Java.loadClass("net.minecraft.world.phys.BlockHitResult")
/** @type {typeof import("net.minecraft.world.level.block.SlabBlock").$SlabBlock } */
let $SlabBlock  = Java.loadClass("net.minecraft.world.level.block.SlabBlock")
/** @type {typeof import("net.minecraft.world.level.block.StairBlock").$StairBlock } */
let $StairBlock  = Java.loadClass("net.minecraft.world.level.block.StairBlock")

ServerEvents.tags("item", event => {
	event.add("bubble_cobble:lanterns", "minecraft:lantern", "#minecraft:lanterns", "ribbits:swamp_lantern")
	event.add("bubble_cobble:do_not_replace_when_in_offhand", [
		"#bubble_cobble:lanterns",
		"#minecraft:candles",
		"#supplementaries:candle_holders"
	])
})

// Replace destroyed blocks with the blocks in your offhand.
BlockEvents.broken(event => {
	const player = event.player
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
	const broken_pos = broken_level_block.getPos()
	// console.log(broken_state.getDestroySpeed(level, broken_pos))
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

	level.server.scheduleInTicks(0, callback => {
		if (!level.getBlock(broken_pos).hasTag("minecraft:air")) {
			// Failsafe to not place blocks accidentally in front/back.
			player.playNotifySound("bubble_cobble:buzz", "players", 1.0, 1.0)
			return
		}

		// Annoying special case. I don't know why the RightClickedEvent isn't fired in useOn().
		if (held_item.id == "kubejs:trowel") {
			global.use_trowel_on_block(new $BlockRightClickedKubeEvent(
				held_item, player, "off_hand", broken_pos, player.facing, new $BlockHitResult(
					player.eyePosition, player.facing, broken_pos, false
				)
			))
			return
		}

		let interaction_result = held_item.useOn(new $UseOnContext(
			level, player, "off_hand", held_item, new $BlockHitResult(
					player.eyePosition, player.facing, broken_pos, false
			)
		))

		if (interaction_result == "fail") {
			return
		}
		if (held_block) {
			if (interaction_result.indicateItemUse()) {
				let sound_type = held_block.getSoundType(held_block.defaultBlockState(), level, broken_pos, player)
				// level.playSound(player, broken_pos, sound_type.placeSound, "blocks")
				player.playNotifySound(sound_type.placeSound, "blocks", 1.0, 1.0)
			}
		}
		if (interaction_result.shouldSwing()) {
			level.server.scheduleInTicks(3, callback => {
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
	})
})


// Avoid accidentally placing lanterns when held in offhand.
// There's similar client-side code in client_changes.js.
BlockEvents.rightClicked(event => {
	if (event.hand == "OFF_HAND" && event.item.hasTag("bubble_cobble:lanterns") && !event.player.shiftKeyDown) {
		event.cancel()
	}
})

// Right-click with empty hand on fences to disconnect/reconnect them from solid faces.
/** @import {$FenceBlock} from "net.minecraft.world.level.block.FenceBlock" */
const FENCES = [
	"biomesoplenty:dead_fence",
	"biomesoplenty:empyreal_fence",
	"biomesoplenty:fir_fence",
	"biomesoplenty:hellbark_fence",
	"biomesoplenty:jacaranda_fence",
	"biomesoplenty:magic_fence",
	"biomesoplenty:mahogany_fence",
	"biomesoplenty:maple_fence",
	"biomesoplenty:palm_fence",
	"biomesoplenty:pine_fence",
	"biomesoplenty:redwood_fence",
	"biomesoplenty:umbran_fence",
	"biomesoplenty:willow_fence",
	"biomeswevegone:aspen_fence",
	"biomeswevegone:baobab_fence",
	"biomeswevegone:blue_enchanted_fence",
	"biomeswevegone:cika_fence",
	"biomeswevegone:cypress_fence",
	"biomeswevegone:ebony_fence",
	"biomeswevegone:fir_fence",
	"biomeswevegone:florus_fence",
	"biomeswevegone:green_enchanted_fence",
	"biomeswevegone:holly_fence",
	"biomeswevegone:ironwood_fence",
	"biomeswevegone:jacaranda_fence",
	"biomeswevegone:mahogany_fence",
	"biomeswevegone:maple_fence",
	"biomeswevegone:palm_fence",
	"biomeswevegone:pine_fence",
	"biomeswevegone:rainbow_eucalyptus_fence",
	"biomeswevegone:redwood_fence",
	"biomeswevegone:sakura_fence",
	"biomeswevegone:skyris_fence",
	"biomeswevegone:spirit_fence",
	"biomeswevegone:white_mangrove_fence",
	"biomeswevegone:willow_fence",
	"biomeswevegone:witch_hazel_fence",
	"biomeswevegone:zelkova_fence",
	"cobblemon:apricorn_fence",
	"cobblemon:saccharine_fence",
	"copycats:copycat_fence",
	"createdeco:andesite_mesh_fence",
	"createdeco:brass_mesh_fence",
	"createdeco:copper_mesh_fence",
	"createdeco:industrial_iron_mesh_fence",
	"createdeco:iron_mesh_fence",
	"createdeco:zinc_mesh_fence",
	"minecraft:acacia_fence",
	"minecraft:bamboo_fence",
	"minecraft:birch_fence",
	"minecraft:cherry_fence",
	"minecraft:crimson_fence",
	"minecraft:dark_oak_fence",
	"minecraft:jungle_fence",
	"minecraft:mangrove_fence",
	"minecraft:nether_brick_fence",
	"minecraft:oak_fence",
	"minecraft:spruce_fence",
	"minecraft:warped_fence",
	"mynethersdelight:powdery_fence",
	"ribbits:mossy_oak_planks_fence"
]
for (const fence of FENCES) {
	BlockEvents.rightClicked(fence, event => {
		const player = event.player
		if (!player.mainHandItem.isEmpty() || !player.offhandItem.isEmpty() || player.swinging) {
			return
		}

		const level = event.level
		const level_block = event.block

		/** @type {$FenceBlock} */
		const block = level_block.getBlock()
		const pos = level_block.getPos()

		const state_north = level_block.getNorth().getBlockState()
		const state_south = level_block.getSouth().getBlockState()
		const state_east = level_block.getEast().getBlockState()
		const state_west = level_block.getWest().getBlockState()
		const is_north_face_sturdy = state_north.isFaceSturdy(level, pos, Direction.NORTH.opposite, "full")
		const is_south_face_sturdy = state_south.isFaceSturdy(level, pos, Direction.SOUTH.opposite, "full")
		const is_east_face_sturdy = state_east.isFaceSturdy(level, pos, Direction.EAST.opposite, "full")
		const is_west_face_sturdy = state_west.isFaceSturdy(level, pos, Direction.WEST.opposite, "full")
		if (!is_north_face_sturdy && !is_south_face_sturdy && !is_east_face_sturdy && !is_west_face_sturdy) {
			player.swing("main_hand")
			level.runCommandSilent(`execute positioned ${pos.x} ${pos.y} ${pos.z} align xyz run playsound bubble_cobble:buzz player @a ~ ~ ~ 0.25`)
			return // Nothing to do, there's only fences here, maybe.
		}

		const states = level_block.getProperties()
		const is_fence_disconnected_from_sturdy_faces = (
			(states.get("north") == "false" || !is_north_face_sturdy)
			&& (states.get("south") == "false" || !is_south_face_sturdy)
			&& (states.get("east") == "false" || !is_east_face_sturdy)
			&& (states.get("west") == "false" || !is_west_face_sturdy)
		)

		const block_set_flags = 2 | 16 // Send update to clients, do not update neighbors.
		if (is_fence_disconnected_from_sturdy_faces) {
			level.setBlock(pos, Block.withProperties(
				level_block.getBlockState(), {
					north: block.connectsTo(state_north, is_north_face_sturdy, Direction.NORTH),
					south: block.connectsTo(state_south, is_south_face_sturdy, Direction.SOUTH),
					east: block.connectsTo(state_east, is_east_face_sturdy, Direction.EAST),
					west: block.connectsTo(state_west, is_west_face_sturdy, Direction.WEST),
				}),
				block_set_flags
			)
			level.runCommandSilent(`execute positioned ${pos.x} ${pos.y} ${pos.z} align xyz run playsound minecraft:block.wooden_trapdoor.open block @a ~ ~ ~ 1.0`)
			// if (state_north.properties.contains("south")) {
			//	 level_block.getNorth().setBlockState(Block.withProperties(state_north, {south: patch.north}))
			// }
		} else {
			level.setBlock(pos, Block.withProperties(
				level_block.getBlockState(), {
					north: state_north.hasTag("minecraft:fences"),
					south: state_south.hasTag("minecraft:fences"),
					west: state_west.hasTag("minecraft:fences"),
					east: state_east.hasTag("minecraft:fences"),
				}),
				block_set_flags
			)
			level.runCommandSilent(`execute positioned ${pos.x} ${pos.y} ${pos.z} align xyz run playsound minecraft:block.wooden_trapdoor.close block @a ~ ~ ~ 1.0`)
			// if (block.getNorth().getProperties().get("north") == "true") {
			// 	block.getNorth().setBlockState(Block.withProperties(block.getNorth().getBlockState(), {north: false}), 2 | 16)
			// }
		}

		level.runCommandSilent(`execute at ${player.uuid} run playsound minecraft:entity.item_frame.remove_item player @a ~ ~ ~ 0.5`)
		player.swing("main_hand", true)
	})
}
