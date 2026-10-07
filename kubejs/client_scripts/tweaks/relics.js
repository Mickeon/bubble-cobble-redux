// requires: relics

let $RenderTooltipEvent$Color = Java.loadClass("net.neoforged.neoforge.client.event.RenderTooltipEvent$Color")
let $MovementInputUpdateEvent = Java.loadClass("net.neoforged.neoforge.client.event.MovementInputUpdateEvent")
let $AbstractContainerScreen = Java.loadClass("net.minecraft.client.gui.screens.inventory.AbstractContainerScreen")

ItemEvents.modifyTooltips(event => {
	event.add("relics:ring_of_the_seven_deadly_sins", {shift: false}, [
		Text.red("IRREMOVABLE").bold().underlined()
	])
	event.add("relics:ring_of_the_seven_deadly_sins", {shift: true}, [
		Text.red("YOU CANNOT TAKE THIS RING OFF.").bold(),
		Text.red("PARENTAL DISCRETION IS ADVISED.").bold().underlined()
	])
	event.modify(["#relics:relic", "#reliquified_artifacts:mimificable"], text => {
		// Does not work for some reason.
		// text.removeText(Text.translate("relics.description.researching.info", Text.keybind("key.relics.research_relic")))
		text.dynamic("relic")
	})
})

// Allow "Research Relic Under Cursor" to also use W instead of Shift, like Create.
// Because of InvMove, this would normally have you walk forward. We prevent it.

// let research_relic_keymapping = Client.options.keyMappings.find(k => k.getName() == "key.relics.research_relic")
let hovering_over_relic = false
ItemEvents.dynamicTooltips("relic", event => {
	if (!event.item.has("relics:data")) {
		console.error(`Trying to parse Relics dynamic tooltip for ${event.item} which likely doesn't have one`)
		return
	}

	hovering_over_relic = true
	Client.scheduleInTicks(1, () => hovering_over_relic = false)

	// Remove most of Relics's own tooltip in favour of ours to make it consistent with Create Ponder.
	event.lines.removeIf(c => c.string.startsWith(" "))
	let found_idx = -1
	for (const idx in event.lines) {
		if (event.lines.get(idx).string.endsWith("to research...")) {
			found_idx = idx
			break
		}
	}
	if (found_idx != -1) {
		if (is_researching_relic()) {
			event.lines.removeIf(c => c.string.endsWith("to research..."))
		} else {
			event.lines.set(found_idx, Text.translateWithFallback(
				"", "Hold [%s] to research                        ",
				Text.keybind("key.relics.research_relic").gray()
			).darkGray()) // "Hold [%1$s] to research..."
			event.lines.removeIf(c => c.string.startsWith("|")) // Loading bar.
		}
	}
})

function is_researching_relic() {
	return Client.player.input.up && is_hovered_slot_real()
}

function is_hovered_slot_real() {
	const screen = Client.getCurrentScreen()
	return (screen instanceof $AbstractContainerScreen) && screen.hoveredSlot && !screen.hoveredSlot.isFake()
}


NativeEvents.onEvent($MovementInputUpdateEvent, event => {
	// I'm concerned on the current screen being checked essentially every tick for this
	// very specific interaction. So we check on the tooltip event.
	if (hovering_over_relic && event.input.up) {
		event.input.forwardImpulse = 0
	}
})

/*
NativeEvents.onEvent($RenderTooltipEvent$Color, event => {
	if (!event.itemStack.has("relics:data") || !Client.player.input.up) {
		return
	}

	const screen = Client.getCurrentScreen()
	if (!(screen instanceof $AbstractContainerScreen) || !screen.hoveredSlot || screen.hoveredSlot.isFake()) {
		return
	}

	// Decent, but doesn't fully stop movement.
	// Client.player.setMotionX(Client.player.getMotionX() * 0.01)
	// Client.player.setMotionZ(Client.player.getMotionZ() * 0.01)
	Client.player.input.shiftKeyDown = true

	researching_relic = true
	Client.scheduleInTicks(1, () => researching_relic = false)
})
*/
