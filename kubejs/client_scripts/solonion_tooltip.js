// requires: solonion

/** @type {typeof import("team.creative.solonion.api.SOLOnionAPI").$SOLOnionAPI } */
const SOLOnionAPI = Java.loadClass("team.creative.solonion.api.SOLOnionAPI")
/** @type {typeof import("team.creative.solonion.common.SOLOnion").$SOLOnion } */
const SOLOnion = Java.loadClass("team.creative.solonion.common.SOLOnion")


ItemEvents.modifyTooltips(event => {
    event.modifyAll(text => {
        text.dynamic("imitate_spice_of_life")
	})
})

// Imitate Spice of Life's tooltips.
// They are disabled in the config, because the "Diversity" tooltip alone is very overbearing.
ItemEvents.dynamicTooltips("imitate_spice_of_life", event => {
	const stack = event.item
	if (!stack.components.has("minecraft:food")) {
		return
	}

	try { // Keeping in check. This crashed before so just in case.
		let player = Client.player
		let foodCapability = SOLOnionAPI.getFoodCapability(Client.player)

		let last_eaten = foodCapability.getLastEaten(Client.player, stack)
		if (last_eaten != -1) {
			let last_eaten_path = last_eaten == 1 ? "last_eaten_singular" : "last_eaten"
			event.add(Text.translatable("gui.solonion.tooltip." + last_eaten_path, last_eaten.toString()).darkGray());
		}
		if (event.shift) {
			let diversity = foodCapability.simulateEat(player, stack)
			let diversity_text = diversity.toFixed(2)
			event.add(
				Text.translatable("gui.solonion.tooltip.diversity").darkGray()
				.append(": " + SOLOnion.CONFIG.getDiversity(player, stack).toFixed(2))
				.append(" (")
				.append(diversity > 0 ? Text.green(diversity_text) : Text.red(diversity_text))
				.append(")"));
		}
	} catch (error) {
		console.error(error)
	}
})