// requires: fieldguide

/**
 * @import {$LevelBlock} from "@package/dev/latvian/mods/kubejs/level"
 * @import {$KubeJSMenu, $InventoryKJSSlot} from "@package/dev/latvian/mods/kubejs/gui"
 * @import {$KubeBlockEntity, $InventoryAttachment$Wrapped} from "@package/dev/latvian/mods/kubejs/block/entity"
 */

/** @import {DonationManager} from "../../startup_scripts/custom/donation" */
this.DonationManager = global.DonationManager

// There's no other way, I need to know which players are interacting with what station.
//#region Acknowledging interacted stations.
let opened_donation_station_blocks = /** @type {Record<string, $LevelBlock>} */ ({})
BlockEvents.rightClicked("bubble_cobble:donation_station", event => {
	// if (!event.item.isEmpty() && event.player.mayUseItemAt(event.block.pos, event.facing, event.item)) {
	// 	return
	// }
	// FIXME: Right-clicking to place a block on the side also triggers this.
	let uuid = event.player.getStringUuid()
	let level_block = event.block
	// let player = /** @type {$ServerPlayer} */ (event.player)

	if (!Object.values(opened_donation_station_blocks).includes(level_block)) {
		// First player accessing the station.
		level_block.setBlockState(Block.withProperties(level_block.getBlockState(), {open: true}))
		play_sound_globally(level_block.level, level_block.pos.center, "farmersdelight:block.cabinet.open", "blocks", 0.5)
	}
	opened_donation_station_blocks[uuid] = level_block

})

PlayerEvents.inventoryClosed("kubejs:menu", event => {
	let uuid = event.player.getStringUuid()
	let level_block = opened_donation_station_blocks[uuid]
	delete opened_donation_station_blocks[uuid]
	if (!Object.values(opened_donation_station_blocks).includes(level_block)) {
		// No one else is accessing the station.
		level_block.setBlockState(Block.withProperties(level_block.getBlockState(), {open: false}))
		play_sound_globally(level_block.level, level_block.pos.center, "farmersdelight:block.cabinet.close", "blocks", 0.5)
	}
})
//#endregion

NetworkEvents.dataReceived("bubble_cobble:donate", event => {
	let player = event.player
	let block_pos = opened_donation_station_blocks[player.getStringUuid()]?.pos
	if (!block_pos || event.level.getBlockState(block_pos).id != "bubble_cobble:donation_station") {
		console.warn(`No Donation Station at ${block_pos}, aborting.`)
		return // Just in case.
	}

	let slot = /** @type {$InventoryKJSSlot} */ (player.containerMenu.getSlot(0))
	let item_stack = slot.getItem()
	if (DonationManager.can_donate(player, item_stack)) {
		let copied_stack = item_stack.copy() // Hack: Copy item stack. It may have become empty in donate().
		donate(player, item_stack)
		play_sound_globally(event.level, block_pos.center, "bubble_cobble:crash.fruit_got", "blocks", 0.5)
		play_sound_globally(event.level, block_pos.center, "minecraft:entity.allay.item_thrown", "blocks", 0.5)
		update_donation_progress(player, copied_stack, block_pos)
	} else {
		play_sound_globally(event.level, block_pos.center, "bubble_cobble:ui.buzz", "blocks", 0.25)
	}
})

/** @param {$Player} player @param {$ItemStack} item_stack  */
function donate(player, item_stack) {
	let data = player.getPersistentData()
	if (!data.contains("donations_left")) {
		data.put("donations_left", {})
	}
	let id = DonationManager.get_entry_id_for_item(item_stack)
	let donating_amount_left = DonationManager.get_remaining_amount_to_donate(player, id)
	let donating_amount = Math.min(item_stack.getCount(), donating_amount_left)
	data.getCompound("donations_left").putInt(id, donating_amount_left - donating_amount)

	item_stack.shrink(donating_amount)
}

function reset_donations(player) {
	player.getPersistentData().remove("donations_left")
	update_donation_progress(player)
}

/** @param {$Player} player @param {$ItemStack=} specific_item @param {import("@package/net/minecraft/core").$BlockPos=} station_block_pos  */
function update_donation_progress(player, specific_item, station_block_pos) {
	let what_to_update = specific_item ? [DonationManager.get_entry_id_for_item(specific_item)] : DonationManager.get_donation_ids()
	for (let id of what_to_update) {
		// let field_guide_id = "bubble_cobble:" + id
		let field_guide_id = "block:bubble_cobble/" + id // TL:DR: Prefixing "block" lets the Toast notification appear.
		let stage = "donated." + id
		if (DonationManager.get_remaining_amount_to_donate(player, id) <= 0) {
			if (station_block_pos) {
				player.level.spawnFireworks(station_block_pos.center.x(), station_block_pos.center.y(), station_block_pos.center.z(), {
					flightDuration: 2,
					explosions: [
						{shape: "small_ball", colors: [Color.AQUA.getFireworkRGB()]}
					]}, 2
				)
			}
			FieldGuide.unlock(player, field_guide_id)
			player.stages.add(stage)
		} else {
			FieldGuide.revoke(player, field_guide_id)
			player.stages.remove(stage)
		}
	}
	player.sendData("bubble_cobble:update_donation_progress", player.getPersistentData().getCompound("donations_left"))
}

//#region Debugging.
if (is_dev()) {
	BlockEvents.leftClicked("bubble_cobble:donation_station", event => {
		const player = event.player
		const block_entity = /** @type {$KubeBlockEntity} */ (event.block.getEntity())
		const inventory = /** @type {$InventoryAttachment$Wrapped} */ (block_entity.attachments.get("inventory"))

		event.block.setBlockState(Block.withProperties(event.block.getBlockState(), {lit: !inventory.isEmpty()}))

		// console.log(`${player.swinging} ${player.getCurrentSwingDuration()} ${player.swingTime}`)
		let click_released = player.swinging
		if (click_released && player.isShiftKeyDown()) {
			reset_donations(player)
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

// BlockEvents.blockEntityTick("bubble_cobble:donation_station", event => {
// 	const block_entity = /** @type {$KubeBlockEntity} */ (event.block.getEntity())
// 	const inventory = /** @type {$InventoryAttachment$Wrapped} */ (block_entity.attachments.get("inventory"))

// 	event.block.setBlockState(Block.withProperties(event.block.getBlockState(), {
// 		facing: inventory.isEmpty() ? "east" : "west"
// 	}))

// })

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
