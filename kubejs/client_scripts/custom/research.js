
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

	const research_button = new $Button$Builder(Text.translatableWithFallback("", "Research"), button => {
			Client.player.sendData("bubble_cobble:donate")
			item_stack = Item.getEmpty() // Refresh cache.
		})
		.pos(screen.x + slot.x + 24, screen.y + slot.y - 2)
		.width(56)
		.build()
	event.addListener(research_button)
	const open_shop_button = new $Button$Builder(Text.translatableWithFallback("", "Shop"), button => {
			Client.player.sendData("bubble_cobble:open_research_shop")
		})
		.pos(screen.x + slot.x - 64, screen.y + slot.y - 2)
		.width(56)
		.build()
	event.addListener(open_shop_button)

	function update_menu() {
		if (item_stack.isEmpty()) {
			research_button.active = false
			research_button.setTooltip($Tooltip.create(Text.of(`Put enough items here and purchase them later if you got credit.`)))
			return
		}

		let id = ResearchManager.get_entry_id_for_item(item_stack)
		if (!id) {
			research_button.active = false
			research_button.setTooltip($Tooltip.create(Text.of(`You cannot research this.`)))
			return
		}
		let amount_left = ResearchManager.get_remaining_amount(Client.player, id)
		let amount_required = ResearchManager.get_required_amount(id)

		research_button.active = ResearchManager.can_donate(Client.player, item_stack)
		research_button.setTooltip($Tooltip.create(research_button.active
			? Text.translateWithFallback("", `%s/%s to go!`, (amount_required - amount_left).toFixed(), amount_required.toFixed())
			: Text.translatableWithFallback("", `You researched plenty.\nEnjoy your reward at the %s!`, Text.aqua("Shop"))
		))
	}
	update_menu()

	Client.scheduleRepeatingInTicks(1, callback => {
		if (Client.screen != screen) {
			callback.clear()
			return
		}

		if (item_stack == slot.getItem()) {
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
		"gui.society_trading.balance": "\uf014 %f",
		"jei.society_trading.price": "%s\u00a4"
	})

	for (let id in ResearchManager.research_entries) {
		let entry = ResearchManager.research_entries[id]
		event.add(`fieldguide.${ResearchManager.field_for(id).replace(":", ".")}.hint`, `Research ${entry.required} of this item for more.`)
	}
})
