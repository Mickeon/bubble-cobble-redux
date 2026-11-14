
let $KubeJSScreen = Java.loadClass("dev.latvian.mods.kubejs.gui.KubeJSScreen");
let $Button$Builder = Java.loadClass("net.minecraft.client.gui.components.Button$Builder")
let $Tooltip = Java.loadClass("net.minecraft.client.gui.components.Tooltip")
let $ScreenEvent$Init$Post = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$Init$Post")

/**
 * @import {$KubeJSMenu, $InventoryKJSSlot} from "@package/dev/latvian/mods/kubejs/gui"
 */

/** @import {ResearchManager} from "../../startup_scripts/custom/research" */
this.ResearchManager = global.ResearchManager


NativeEvents.onEvent($ScreenEvent$Init$Post, event => {
	if (!(event.screen instanceof $KubeJSScreen)) {
		return
	}

	let screen = event.screen
	let menu = event.screen.getMenu()
	let slot = /** @type {$InventoryKJSSlot} */ (menu.getSlot(0))
	let item_stack = Item.getEmpty()
	slot.setBackground("minecraft:textures/atlas/blocks.png", "minecraft:item/empty_slot_quartz")

	const research_button = new $Button$Builder(Text.translateWithFallback("", "Research"), button => {
			Client.player.sendData("bubble_cobble:donate")
			item_stack = Item.getEmpty() // Refresh cache.
		})
		.pos(screen.x + slot.x + 24, screen.y + slot.y - 2)
		.width(56)
		.build()
	event.addListener(research_button)
	const open_shop_button = new $Button$Builder(Text.translateWithFallback("", "Shop"), button => {
			Client.player.sendData("bubble_cobble:open_research_shop")
		})
		// .tooltip($Tooltip.create(Text.translateWithFallback("", "").color(MASCOT_COLOR_DARK)))
		.pos(screen.x + slot.x - 64, screen.y + slot.y - 2)
		.width(56)
		.build()
	event.addListener(open_shop_button)

	// Without proper tracking of opened stations on clients, this is currently buggy.
	// const field_guide_button = new $Button$Builder(Text.translatableWithFallback("", "g"), button => {
	// 		let $FieldGuideCategoryScreen = Java.tryLoadClass("com.evandev.fieldguide.client.gui.screens.FieldGuideCategoryScreen")
	// 		if ($FieldGuideCategoryScreen) {
	// 			Client.setScreen(new $FieldGuideCategoryScreen("research", screen))
	// 		}
	// 	})
	// 	.pos(screen.x + slot.x + 64, screen.y + slot.y - 2)
	// 	.width(24)
	// 	.build()
	// event.addListener(field_guide_button)

	function update_menu() {
		if (item_stack.isEmpty()) {
			research_button.active = false
			research_button.setTooltip($Tooltip.create(Text.translateWithFallback("", "Put items in the %s and click here to begin researching them.\nOnce fully researched, you may enjoy your rewards in the %s.", Text.of("Research Station").color(MASCOT_COLOR), Text.of("Shop").color(MASCOT_COLOR)).color(MASCOT_COLOR_DARK)))
			return
		}

		let id = ResearchManager.get_entry_id_for_item(item_stack)
		if (!id) {
			research_button.active = false
			research_button.setTooltip($Tooltip.create(Text.translateWithFallback("", "You cannot research this.").color(MASCOT_COLOR_DARK)))
			return
		}
		let amount_left = ResearchManager.get_remaining_amount(Client.player, id)
		let amount_required = ResearchManager.get_required_amount(id)

		research_button.active = ResearchManager.can_donate(Client.player, item_stack)
		research_button.setTooltip($Tooltip.create(research_button.active
			? Text.translateWithFallback("", `%s/%s to go!`, Text.of((amount_required - amount_left).toFixed()).color(MASCOT_COLOR), amount_required.toFixed()).color(MASCOT_COLOR_DARK)
			: Text.translateWithFallback("", `You researched plenty.\nEnjoy your rewards in the %s!`, Text.of("Shop").color(MASCOT_COLOR)).color(MASCOT_COLOR_DARK)
		))
	}
	update_menu()

	Client.scheduleRepeatingInTicks(1, callback => {
		if (Client.screen != screen) {
			callback.clear()
			return
		}

		if (item_stack.areItemsEqual(slot.getItem()) && item_stack.getCount() == slot.getItem().getCount()) {
			return // Bit of an optimization.
		}
		item_stack = slot.getItem().copy() // Item reference is cleared when grabbed out of the slot.
		update_menu()
		// research_button.setX(research_button.getX() + 1)
	})
})

NetworkEvents.dataReceived("bubble_cobble:update_donation_progress", event => {
	let player = event.player
	let data = player.getPersistentData()
	let updated_donations_left = event.data
	// TODO: Allow updating individual entries in pieces rather than always overriding.
	data.put("donations_left", updated_donations_left)
	// console.log(updated_donations_left)

	// let $Language = Java.loadClass("net.minecraft.locale.Language")
	// $Language.getInstance().getLanguageData().clear() This actually works. Keep it in mind for debugging purposes.
})

NetworkEvents.dataReceived("bubble_cobble:update_research_entries", event => {
	ResearchManager.research_entries = JSON.parse(NBT.toJson(event.data))
	ResearchManager.item_to_research_table.forget()
})

ClientEvents.lang("en_us", event => {
	event.addAll("society_trading", {
		"gui.society_trading.price": "%s \u00a4 ",
		"gui.society_trading.hover_price_one": "Price: %s\u00a4",
		"gui.society_trading.balance": "%f \uf014",
		"jei.society_trading.price": "%s\u00a4"
	})

	for (let id in ResearchManager.research_entries) {
		let entry = ResearchManager.research_entries[id]
		let lang_id = ResearchManager.field_lang_for(id)
		event.add(`fieldguide.${lang_id}.hint`, `Research §3${entry.required}§r of these items for more.`)
		if (entry.name) {
			event.add(`fieldguide.name.${lang_id}`, entry.name)
		}
		if (entry.description) {
			event.add(`fieldguide.${lang_id}.description`, entry.description)
		}
	}
})
