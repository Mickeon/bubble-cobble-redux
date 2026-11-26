// requires: fieldguide
/**
 * @import {$MinecraftServer} from "@package/net/minecraft/server"
 * @import {$KubeBlockEntity, $InventoryAttachment$Wrapped} from "@package/dev/latvian/mods/kubejs/block/entity"
 */

StartupEvents.registry("block", event => {
	event.create("bubble_cobble:newspaper_station")
	// event.create("bubble_cobble:magazine_station")
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
			.rightClick(callback => global.magazine_station_on_right_click(callback))
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

StartupEvents.registry("item", event => {
	event.create("bubble_cobble:magazine")
			.displayName("Bubble Cobble™ Nature Magazine")
			.rarity("uncommon")
			.maxStackSize(16)
			.use((level, player, interaction_hand) => true)
			.finishUsing((item_stack, level, living_entity) => global.finish_using_magazine(item_stack, level, living_entity))
})

/** @type {import("@package/dev/latvian/mods/kubejs/item").$ItemBehavior$FinishUsingCallback_} */
global.finish_using_magazine = function(item_stack, level, living_entity) {
	if (level.isClientSide()) {
		return item_stack
	}

	let player = /** @type {$Player} */ (living_entity)

	let data = level.server.persistentData
	let pages = NBT.wrapCompound(data.get("pages"))
	if (pages.isEmpty()) {
		player.statusMessage = "EMPTY"
		return item_stack
	}

	let chosen_pages = NBT.wrapListTag(data.get("chosen_pages"))
	if (chosen_pages.isEmpty()) {
		player.statusMessage = "NO PAGES AVAILABLE"
		return item_stack
	}

	for (let tag of chosen_pages) {
		let key = tag.getAsString()
		let author = key.split("-")[0]
		let entry_id = key.split("-")[1]
		let value = pages.getCompound(key)

		let page = Item.of("fieldguide:page", {
			"fieldguide:author": author,
			"fieldguide:entry_id": entry_id,
		})
		let name = value.get("name")
		if (name) {
			page.set("fieldguide:entry_name", Text.ofTag(name))
		}
		let description = value.getString("description")
		if (description) {
			page.set("fieldguide:custom_description", description)
		}

		player.give(page)
	}

	if (!player.isCreative()) {
		item_stack.shrink(1)
		player.addItemCooldown("bubble_cobble:magazine", 5 * SEC)
	}

	return item_stack
}

/** @param {import("@package/dev/latvian/mods/kubejs/block").$BlockRightClickedKubeEvent} */
global.magazine_station_on_right_click = function(event) {
	let {player, item, level, server} = event

	if (player.cooldowns.isOnCooldown("fieldguide:page")) {
		return
	}

	let data = server.persistentData
	if (!data.contains("pages")) {
		data.put("pages", {})
	}
	let pages = NBT.wrapCompound(data.get("pages"))

	function give_magazine() {
		player.give("bubble_cobble:magazine")
		play_sound_globally(level, event.block.pos.center, "create:stock_ticker_trade", "players")
		player.addItemCooldown("fieldguide:page", SEC * 0.5)
	}

	function single_worth(item) {
		switch (item.id) {
			case "numismatics:spur": {
				return 1
			} break;
			case "numismatics:bevel": {
				return 8
			} break;
		}
	}

	function try_deducting_coins(price) {
		if (player.isCreative()) {
			return true
		}

		// What a mess.
		// Check if it's even possible to pay.
		let coins = []
		let inventory_worth = 0
		for (let item of player.inventory.getAllItems()) {
			if (item.id == "numismatics:spur") {
				coins.push(item)
				inventory_worth += item.getCount()
			}
			if (item.id == "numismatics:bevel") {
				coins.push(item)
				inventory_worth += item.getCount() * 8
			}
		}
		if (inventory_worth < price) {
			return false
		}
		coins.sort((a, b) => single_worth(b) - single_worth(a))
		for (let coin of coins) {
			// I do not feel like being smart about it today.
			if (coin.id == "numismatics:spur") {
				let deduction = Math.min(price, coin.getCount())
				coin.shrink(deduction)
				price -= deduction
			}
			if (coin.id == "numismatics:bevel") {
				let deduction = Math.min(price / 8, coin.getCount())
				coin.shrink(deduction)
				price -= deduction * 8
			}
			if (price <= 0) {
				break
			}
		}

		return true
	}

	if (item.id == "fieldguide:page") {
		if (pages.size() >= 256) {
			player.statusMessage = "FULL"
			return
		}

		// Entries with same author and id should be overridden.
		let key = `${item.get("fieldguide:author")}-${item.get("fieldguide:entry_id")}`
		pages.put(key, {
			name: item.get("fieldguide:entry_name"),
			description: item.get("fieldguide:custom_description"),
		})

		if (!player.isCreative()) {
			item.shrink(1)
		}
		player.swing(event.hand, true)
		play_sound_globally(level, event.block.pos.center, "create:package_pop", "players")
		player.addItemCooldown("fieldguide:page", SEC * 0.5)
	} else if (item.isEmpty()) {
		if (is_dev()) {
			if (player.isShiftKeyDown()) {
				pages.getAllKeys().forEach(key => pages.remove(key))
				player.statusMessage = "Cleared everything"
				return
			}
			if (!player.onGround()) {
				global.magazine_shuffle(event.server)
				player.statusMessage = "Shuffled the daily magazine"
				return
			}
		}
		if (try_deducting_coins(8)) {
			give_magazine()
		}
	}
}

/** @param {$MinecraftServer} */
global.magazine_shuffle = function(server) {
	let pages = server.persistentData.getCompound("pages")
	if (pages.isEmpty()) {
		return
	}

	let page_keys = Utils.newList()
	page_keys.addAll(pages.getAllKeys())

	let chosen_pages = []
	for (let _ = 0; _ < 3; _ += 1) {
		if (page_keys.isEmpty()) {
			break
		}
		let index = Utils.random.nextInt(page_keys.size())
		let key = page_keys.remove(index)
		chosen_pages.push(key)
	}
	server.persistentData.put("chosen_pages", chosen_pages)
}


// What a mess of reverse-engineering. I'd rather just store the name as it comes.
// let entry_namespace = ID.namespace(entry_id)
// let entry_path = ID.path(entry_id)
// let description = newspapers.getString(key)
// console.log(`${author} ${entry_id} ${description}`)
// let lang_key = ""

// if (entry_id.startsWith("fieldguide:cobblemon/")) {
// 	let species_and_form = entry_path.substring("cobblemon/".length)
// 	let underscore_index = species_and_form.lastIndexOf("_")
// 	if (underscore_index != -1) {
// 		species_and_form = species_and_form.substring(0, underscore_index)
// 	}
// 	lang_key = `cobblemon.species.${species_and_form}.name`
// } else if (Item.exists(entry_id)) {
// 	lang_key = Item.getItem(entry_id).getDescriptionId()
// } else if (Block.getBlock(entry_id) != Blocks.AIR) {
// 	lang_key = Block.getBlock(entry_id).getDescriptionId()
// } else if (Registry.of("minecraft:entity_type").contains(entry_id)) {
// 	lang_key = `entity_type.${entry_namespace}.${entry_path}`
// } else {
// 	lang_key = `fieldguide.name.${entry_namespace}.${entry_path}`
// }
