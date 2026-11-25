// requires: fieldguide
/**
 * @import {$KubeBlockEntity, $InventoryAttachment$Wrapped} from "@package/dev/latvian/mods/kubejs/block/entity"
 */

StartupEvents.registry("block", event => {
	event.create("bubble_cobble:newspaper_station")
			.property(BlockProperties.HORIZONTAL_FACING)
			.soundType(SoundType.BAMBOO_WOOD)
			.hardness(3)
			.parentModel("minecraft:block/cube_all")
			.textures({
				all: "biomesoplenty:block/mahogany_log_top"
			})
			.placementState(callback => {
				callback.set(BlockProperties.HORIZONTAL_FACING, callback.getHorizontalDirection().getOpposite())
			})
			.rightClick(callback => global.newspaper_station_on_right_click(callback))
			.tagBlock([
				"minecraft:mineable/axe",
			])
			.item(item => {
				item.tooltip(Text.translateWithFallback("", "Use with Field Guide page to donate it.\nUse empty-handed to get a random page.").darkGray())
				item.tag([
					"more_sounds:wooden"
				])
			})
})

/** @param {import("@package/dev/latvian/mods/kubejs/block").$BlockRightClickedKubeEvent} */
global.newspaper_station_on_right_click = function(event) {
	let {player, item, level, server} = event

	if (player.cooldowns.isOnCooldown("fieldguide:page")) {
		return
	}

	let data = server.persistentData
	if (!data.contains("newspapers")) {
		data.put("newspapers", [])
	}

	let newspapers = NBT.wrapListTag(data.get("newspapers"))
	if (item.id == "fieldguide:page") {
		if (newspapers.size() >= 64) {
			player.statusMessage = "FULL"
			return
		}
		let stored_newspaper = item.copyWithCount(1)
		stored_newspaper.remove("fieldguide:entry_name")
		stored_newspaper.remove("fieldguide:discovery_game_time")
		stored_newspaper.remove("fieldguide:discovery_time")
		newspapers.add(0, stored_newspaper.toNBT())
		item.shrink(1)
		player.swing(event.hand, true)
		play_sound_globally(level, event.block.pos.center, "create:package_pop", "players")
	} else if (item.isEmpty()) {
		if (newspapers.size() == 0) {
			player.statusMessage = "EMPTY"
			return
		}

		// if (player.isCreative() && player.isShiftKeyDown()) {
		// 	return // TODO: Shuffle?
		// }

		let index = level.random.nextInt(newspapers.size())
		let newspaper = Item.of(NBT.fromTag(newspapers.remove(index)))
		if (newspaper.isEmpty()) {
			player.statusMessage = "Could not fetch newspaper"
			return
		}
		player.give(newspaper)
	}
	player.addItemCooldown("fieldguide:page", SEC * 0.5)
}
