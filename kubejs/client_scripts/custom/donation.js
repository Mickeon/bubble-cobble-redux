
let $KubeJSScreen = Java.loadClass("dev.latvian.mods.kubejs.gui.KubeJSScreen");
let $Button$Builder = Java.loadClass("net.minecraft.client.gui.components.Button$Builder")
let $Tooltip = Java.loadClass("net.minecraft.client.gui.components.Tooltip")
let $ScreenEvent$Init$Post = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$Init$Post")

/**
 * @import {$KubeJSMenu, $InventoryKJSSlot} from "@package/dev/latvian/mods/kubejs/gui"
 */

/** @import {DonationManager} from "../../startup_scripts/custom/donation" */
this.DonationManager = global.DonationManager


NativeEvents.onEvent($ScreenEvent$Init$Post, event => {
	if (!(event.screen instanceof $KubeJSScreen)) {
		return
	}

	let screen = event.screen
	let menu = event.screen.getMenu()
	let slot = /** @type {$InventoryKJSSlot} */ (menu.getSlot(0))
	// slot.setBackground("accessories:gui/slot/cape", "accessories:gui/slot/charm")

	const donate_button = new $Button$Builder(Text.translatableWithFallback("", "Donate"), button => {
			Client.player.sendData("bubble_cobble:donate")
			item_stack = null // Refresh cache.
		})
		.pos(screen.x + slot.x + 18, screen.y + slot.y - 2)
		.width(48)
		.tooltip($Tooltip.create(Text.translatableWithFallback("", "Meow")))
		.build()
	event.addListener(donate_button)

	let item_stack = null
	Client.scheduleRepeatingInTicks(1, callback => {
		if (Client.screen != screen) {
			callback.clear()
			return
		}

		if (item_stack == slot.getItem()) {
			return // Bit of an optimization.
		}
		item_stack = slot.getItem().copy() // Item reference is cleared when grabbed out of the slot.

		let id = DonationManager.get_entry_id_for_item(item_stack)
		let donating_amount_left = DonationManager.get_remaining_amount_to_donate(Client.player, id)
		let donating_amount_required = DonationManager.get_donation_requirement(id)

		donate_button.active = DonationManager.can_donate(Client.player, item_stack)
		donate_button.setTooltip($Tooltip.create(donate_button.active
			? Text.translateWithFallback("", `%s/%s to go!`, (donating_amount_required - donating_amount_left).toFixed(), donating_amount_required.toFixed())
			: Text.of(`You cannot donate this.`)
		))

		// donate_button.setX(donate_button.getX() + 1)
	})
})

NetworkEvents.dataReceived("bubble_cobble:update_donation_progress", event => {
	let player = event.player
	let data = player.getPersistentData()
	let updated_donations_left = event.data
	// TODO: Allow updating individual entries in pieces rather than always overriding.
	data.put("donations_left", updated_donations_left)
	console.log(updated_donations_left)
})
