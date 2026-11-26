// priority: -1
// Loads last, keeps the price tooltip right below item name, above other tooltip additions.
/** @import {SellingManager} from "../../startup_scripts/custom/capitalism" */
this.SellingManager = global.SellingManager

let $KubeJSScreen = Java.loadClass("dev.latvian.mods.kubejs.gui.KubeJSScreen");
// let $ScreenEvent$Init$Post = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$Init$Post")


// NativeEvents.onEvent($ScreenEvent$Init$Post, event => {
// 	if (!(event.screen instanceof $KubeJSScreen) || event.screen.getTitle().getString() != "Selling Bin") {
// 		return
// 	}
// })

ItemEvents.modifyTooltips(event => {
	event.modify("#bubble_cobble:sellable", text => text.dynamic("price"))
})

ItemEvents.dynamicTooltips("price", event => {
	if ((!(Client.screen instanceof $KubeJSScreen) || Client.screen.getTitle().getString() != "Selling Bin") && !event.advanced) {
		return
	}

	let price = event.shift ? SellingManager.get_individual_price(event.item) : SellingManager.get_price(event.item)
	let label = event.shift ? "Worth %s\u00a4 each" : "Worth %s\u00a4"
	let price_as_string = Math.floor(price) == price ? price.toFixed(0) : price.toFixed(1)

	event.lines.add(1, Text.translateWithFallback("", label, Text.of(price_as_string).color(MASCOT_COLOR)).color(MASCOT_COLOR_DARK))
})
