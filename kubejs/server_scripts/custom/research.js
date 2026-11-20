// requires: fieldguide
// requires: society_trading
// requires: numismatics

let $OnDatapackSyncEvent = Java.loadClass("net.neoforged.neoforge.event.OnDatapackSyncEvent")
let $ItemParticleOption = Java.loadClass("net.minecraft.core.particles.ItemParticleOption")
let $UseOnContext = Java.loadClass("net.minecraft.world.item.context.UseOnContext")

/**
 * @import {$LevelBlock} from "@package/dev/latvian/mods/kubejs/level"
 * @import {$KubeJSMenu, $InventoryKJSSlot} from "@package/dev/latvian/mods/kubejs/gui"
 * @import {$KubeBlockEntity, $InventoryAttachment$Wrapped} from "@package/dev/latvian/mods/kubejs/block/entity"
 */

/** @import {ResearchManager} from "../../startup_scripts/custom/research" */
this.ResearchManager = global.ResearchManager

PlayerEvents.loggedIn(event => {
	event.player.sendData("bubble_cobble:update_donation_progress", event.player.getPersistentData().getCompound("donations_left"))
	// event.player.sendData("bubble_cobble:update_research_entries", NBT.compoundTag(ResearchManager.research_entries))
})

NativeEvents.onEvent($OnDatapackSyncEvent, event => {
	event.getRelevantPlayers().forEach(player => {
		player.sendData("bubble_cobble:update_research_entries", NBT.toTag(ResearchManager.research_entries))
	})
})

NetworkEvents.dataReceived("bubble_cobble:donate", event => {
	let player = event.player
	let station = ResearchManager.Station.get_accessed_by(player)
	if (!station) {
		return
	}
	let block_pos = station.blockPos
	if (player.isCreative()) {
		let slot = /** @type {$InventoryKJSSlot} */ (player.containerMenu.getSlot(0))
		let item_stack = slot.getItem()
		let copied_stack = item_stack.copy() // Hack: Copy item stack. It may become empty after successful donate().
		if (ResearchManager.donate(player, item_stack)) {
			play_sound_globally(event.level, block_pos.center, "bubble_cobble:crash.fruit_got", "blocks", 0.5)
			play_sound_globally(event.level, block_pos.center, "minecraft:entity.allay.item_thrown", "blocks", 0.5)
			ResearchManager.update_donation_progress(player, copied_stack, block_pos)
		} else {
			play_sound_globally(event.level, block_pos.center, "bubble_cobble:ui.buzz", "blocks", 0.25)
		}
		return
	}

	station.persistentData.putUUID("activator", player.uuid)
	station.block.setBlockState(Block.withProperties(station.getBlockState(), {lit: true}))
	play_sound_globally(event.level, block_pos.center, "create:confirm", "blocks", 0.75, 0.2)
})

NetworkEvents.dataReceived("bubble_cobble:open_research_shop", event => {
	let player = event.player
	let station = ResearchManager.Station.get_accessed_by(player)
	if (!station) {
		return
	}
	ResearchManager.open_research_shop(player)
})


BlockEvents.blockEntityTick("bubble_cobble:research_station", event => {
	const block_entity = /** @type {$KubeBlockEntity} */ (event.block.getEntity())
	if (!block_entity.persistentData.hasUUID("activator")) {
		return
	}
	const player = /** @type {$Player} */ (event.server.getEntityByUUID(block_entity.persistentData.getUUID("activator")))
	if (!player) {
		play_sound_globally(event.level, block_pos.center, "bubble_cobble:ui.buzz", "blocks", 0.25)
		return
	}
	const block_pos = block_entity.blockPos
	const facing = block_entity.getBlockState().getValue(BlockProperties.HORIZONTAL_FACING)
	const spawn_pos = block_pos.center.relative(facing, 0.55)

	const inventory = /** @type {$InventoryAttachment$Wrapped} */ (block_entity.attachments.get("inventory"))
	const item_stack = inventory.getStackInSlot(0)
	const copied_stack = item_stack.copy() // Hack: Copy item stack. It may become empty after successful donate().
	if (ResearchManager.donate(player, item_stack, 1)) {
		ResearchManager.update_donation_progress(player, copied_stack, block_pos)

		let id = ResearchManager.get_entry_id_for_item(item_stack)
		let pitch = remap(ResearchManager.get_remaining_amount(player, id), 0, ResearchManager.get_required_amount(id), 2.0, 0.75)
		play_sound_globally(event.level, block_pos.center, "create:crushing_1", "blocks", 0.75, 1.0)
		play_sound_globally(event.level, block_pos.center, "bubble_cobble:crash.fruit_got", "blocks", 0.15, pitch)

		block_entity.level.spawnParticles(new $ItemParticleOption("minecraft:item", copied_stack), false,
			spawn_pos.x(), spawn_pos.y(), spawn_pos.z(),
			facing.getX() * 0.2, 0.2, facing.getZ() * 0.2,
			10, 0.1
		)

		let random = block_entity.level.getRandom()
		event.level.spawnEntity("supplementaries:brick_projectile", /** @param {import("@package/net/minecraft/world/entity/projectile").$ThrowableItemProjectile} */ brick => {
			brick.setItem(copied_stack)
			brick.setPos(spawn_pos)
			let motion = Vec3d.ZERO.relative(facing, 0.05).yRot(random.nextGaussian() * 0.5)
			brick.setMotion(motion.x(), random.nextFloat() * 0.1, motion.z())
			brick.setOwner(player)
			brick.setSilent(true)
		})
		let orb_chance = random.nextFloat()
		if (orb_chance > 0.666) {
			event.level.spawnEntity("minecraft:experience_orb", /** @param {import("@package/net/minecraft/world/entity").$ExperienceOrb} */ orb => {
				orb.setPos(block_pos.center.relative(facing, 0.6))
				let motion = Vec3d.ZERO.relative(facing, 0.05).yRot(random.nextGaussian() * 0.5)
				orb.addMotion(motion.x(), -0.5, motion.z())
				orb.value = 1
			})
		}
	} else {
		block_entity.persistentData.remove("activator")
		block_entity.block.setBlockState(Block.withProperties(block_entity.getBlockState(), {lit: false}))
		block_entity.level.spawnParticles(`minecraft:dust_plume`, false,
			spawn_pos.x(), spawn_pos.y(), spawn_pos.z(),
			facing.getX() * 0.1, 0.2, facing.getZ() * 0.1,
			10, 0.1
		)
		play_sound_globally(event.level, block_pos.center, "create:chiff", "blocks", 0.25, 0.5)
	}
})

//#region Debugging.
if (is_dev()) {
	BlockEvents.leftClicked("bubble_cobble:research_station", event => {
		const player = event.player
		const block_entity = /** @type {$KubeBlockEntity} */ (event.block.getEntity())
		const inventory = /** @type {$InventoryAttachment$Wrapped} */ (block_entity.attachments.get("inventory"))

		// event.block.setBlockState(Block.withProperties(event.block.getBlockState(), {lit: !inventory.isEmpty()}))

		// console.log(`${player.swinging} ${player.getCurrentSwingDuration()} ${player.swingTime}`)
		let click_released = player.swinging
		if (click_released) {
			if (player.isShiftKeyDown()) {
				if (inventory.isEmpty()) {
					ResearchManager.reset_donations(player)
					player.statusMessage = "Reset all research progress for you."
				}
			} else {
				player.sendData("bubble_cobble:update_research_entries", NBT.toTag(ResearchManager.research_entries))
				// console.log(JSON.stringify(ResearchManager.make_render_for_field_composites(ResearchManager.research_entries["tuff"]), null, "\t"))
			}
		}

		// if (!inventory.isEmpty()) {
		//     return
		// }
		// let item_stack = inventory.getStackInSlot(0)
	})
	// BlockEvents.rightClicked("minecraft:grass_block", event => {
	// 	const player = event.player

	// 	if (player.isCrouching()) {
	// 		// FieldGuide.unlock(player, "bubble_cobble:red_dye")
	// 		FieldGuide.unlock(player, "block:bubble_cobble/red_dye")
	// 	} else {
	// 		// FieldGuide.revoke(player, "bubble_cobble:red_dye")
	// 		FieldGuide.revoke(player, "block:bubble_cobble/red_dye")
	// 	}
	// 	player.statusMessage = FieldGuide.getCanonicalEntryId("block:bubble_cobble/red_dye")
	// })
}
//#endregion

ServerEvents.tags("item", event => {
	event.add("bubble_cobble:researchable", ResearchManager.get_researchable_item_ids())
})

ServerEvents.recipes(event => {
	event.shaped("bubble_cobble:research_station", ["LBL", "RAR", "OGO"], {L: "#minecraft:logs", B: "minecraft:writable_book", R: "minecraft:cobbled_deepslate", A: "minecraft:lectern", O: "#c:obsidians", G: "create:millstone"})
})

//#region Data generation.
ServerEvents.generateData("after_mods", event => {
	let time_start = Utils.getSystemTime()

	let field_guide_category = {
		icon: "bubble_cobble:textures/item/blue_mascot_cat.png",
		contents: [],
	}
	let field_guide_composites = {
		values: [],
	}

	let society_trading_shop = {
		shop_id: "research_rewarder",
		name: ["",
			{"color":"#73A8FF","text":"R"},
			{"color":"#75AAFF","text":"e"},
			{"color":"#77ABFF","text":"s"},
			{"color":"#79ADFF","text":"e"},
			{"color":"#6EA2F7","text":"a"},
			{"color":"#6498EF","text":"r"},
			{"color":"#598DE7","text":"c"},
			{"color":"#5079E5","text":"h"},
			{"color":"#4866E2","text":"e"},
			{"color":"#3F52E0","text":"s"}
		],
		display_type: "default",
		texture: "bubble_cobble:textures/item/blue_mascot_cat",
		trades: []
	}

	let i = 0
	for (let id in ResearchManager.research_entries) {
		let entry = ResearchManager.research_entries[id]
		let item_ids = entry.unlocks.map(u => u.item?.id || u.item)
		let first_item_id = item_ids[0]
		let field_entry_id = ResearchManager.field_for(id)

		let new_field_entry = {
			// Unfortunately, it needs to be a virtual entry with with no blocks in new_composites,
			// Otherwise it could be unlocked by scanning the blocks, which we don't want.
			type: "virtual_entry",
			id: field_entry_id,
			virtual_type: "tutorial",
			unlock: {
				// An impossible goal so this cannot be unlocked, ever.
				prerequisites: ["entity:minecraft/area_effect_cloud"],
				trigger: ["eat"]
			}
		}
		let new_composites = {
			id: field_entry_id,
			display: first_item_id,
			components: [field_entry_id],
			render: ResearchManager.make_render_for_field_composites(entry)
		}
		if (!new_composites.render) {
			delete new_composites.render
			// The crap I have to do to make non-placeable items unlockable.
			// And most of what it does is make these entries unlockable by scanning them,
			// Which we absolutely don't want. I will have to fix this someday.
			// new_field_entry = {
			// 	type: "entry",
			// 	id: `item:${ID.namespace(first_item_id)}/${ID.path(first_item_id)}`
			// }
			// new_composites.components = item_ids
			// new_field_entry.icon = `item:${ID.namespace(first_item_id)}/${ID.path(first_item_id)}`
			// new_composites.display = `item:${ID.namespace(first_item_id)}/${ID.path(first_item_id)}`
			// new_composites.render = ["minecraft:dirt"] // I don't know why this works for items but okay.
			// With this, e.g. Windmill Bearing can be unlocked by scanning, but Red Dye can't be unlocked by obtaining.
			new_field_entry = {
				type: "entry",
				id: first_item_id,
				unlock: {
					prerequisites: ["entity:minecraft/area_effect_cloud"],
					trigger: ["eat"]
				}
			}
			new_composites.components = item_ids
		}

		field_guide_category.contents.push(new_field_entry)
		field_guide_composites.values.push(new_composites)

		let stage = ResearchManager.stage_for(id)
		for (let unlock of entry.unlocks) {
			// This is notably faster than instantiating an ItemStack just for this step.
			let item = {
				id: unlock.item.id || unlock.item,
				count: unlock.item.count || entry.default_count,
			}
			if (unlock.item.components) {
				item.components = unlock.item.components
			}

			let price = unlock.price || entry.default_price
			let coins = create_coins_from_value(price, [])
			let trade = {
				offer: item,
				request: coins[0],
				numismatics_cost: price,
				stage_required: stage,
				trade_id: "research/" + item.id
			}
			if (coins[1]) {
				trade.second_request = coins[1]
			}
			if (coins.length > 2) {
				console.warn(`Price for ${trade.trade_id} cannot be represented by only 2 coin stacks. The item will be cheaper to purchase with the coins in hand.`)
			}

			society_trading_shop.trades.push(trade)
		}
		i += 1
	}

	// console.log(JSON.stringify(field_guide_category, null, "\t"))
	event.json("bubble_cobble:fieldguide/categories/researches", field_guide_category)

	// console.log(JSON.stringify(field_guide_composites, null, "\t"))
	event.json("bubble_cobble:fieldguide/composites/researches", field_guide_composites)

	// console.log(JSON.stringify(society_trading_shop, null, "\t"))
	event.json("society_trading:shops/research_rewarder", society_trading_shop)

	console.log(`Generated auxiliary research data for ${i} entries in ${((Utils.getSystemTime() - time_start) / 1000).toFixed(3)} s`)
})

const COIN_MAP = [
	{coin: "numismatics:sun", value: 4096},
	{coin: "numismatics:crown", value: 512},
	{coin: "numismatics:cog", value: 64},
	{coin: "numismatics:sprocket", value: 16},
	{coin: "numismatics:bevel", value: 8},
	{coin: "numismatics:spur", value: 1},
]

/** @param {number} price @param {Array<{id: string, count: number}} result */
function create_coins_from_value(price, result) {
	// Recursive function that goes through every coin in smaller decrements.
	for (let i in COIN_MAP) {
		let {coin, value} = COIN_MAP[i]
		if (value <= price) {
			if (price % value == 0) {
				result.push({id: coin, count: price / value})
				return result
			} else {
				result.push({id: coin, count: Math.floor(price / value)})
				create_coins_from_value(price % value, result)
			}
			return result
		}
	}
}
//#endregion

// PlayerEvents.inventoryOpened("kubejs:menu", event => {
	// const player = event.player
	// const container = /** @type {$KubeJSMenu} */ (event.inventoryContainer)

	// console.log(container)
	// const block_entity = event.block.getEntity()
	// container.addSlotListener({
	// 	dataChanged: (container_menu, data_slot_index, value) => {
	// 		global.donation_station_data_changed(container_menu, data_slot_index, value)
	// 	},
	// 	slotChanged: (container_to_send, data_slot_index, stack) => {
	// 		global.donation_station_slot_changed(container_menu, data_slot_index, stack)
	// 	}
	// })
// })
