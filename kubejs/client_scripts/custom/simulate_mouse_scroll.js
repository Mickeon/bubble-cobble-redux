
KeyBindEvents.tick("bubble_cobble.mouse_wheel_up", event => {
	simulate_mouse_scroll(event, 1)
})

KeyBindEvents.tick("bubble_cobble.mouse_wheel_down", event => {
	simulate_mouse_scroll(event, -1)
})

/**
 * @param {import("@package/dev/latvian/mods/kubejs/client").$KubeJSKeybinds$TickingKeyEvent} event
 * @param {number} delta
 * */
function simulate_mouse_scroll(event, delta) {
	const ticks = event.getTicks()
	if (ticks > 0 && ticks < 10) {
		return // Simulate echoing key press.
	}
	if (ticks > 30) {
		delta *= 2
	}

	const client = event.client
	const current_screen = client.getCurrentScreen()
	if (!current_screen) {
		let $CreateClient = Java.tryLoadClass("com.simibubi.create.CreateClient")
		if ($CreateClient) {
			$CreateClient.SCHEMATIC_HANDLER.mouseScrolled(delta)
		}
		return
	}

	const mouse_x = client.mouseHandler.getMouseX() / client.options.guiScale().get()
	const mouse_y = client.mouseHandler.getMouseY() / client.options.guiScale().get()

	let $EmiScreenManager = Java.tryLoadClass("dev.emi.emi.screen.EmiScreenManager")
	if ($EmiScreenManager && $EmiScreenManager.mouseScrolled(mouse_x, mouse_y, delta)) {
		return // EMI has priority.
	}

	current_screen.mouseScrolled(mouse_x, mouse_y, 0, delta)

	// Doesn't really work for anything.
	// let $ScreenEvent$MouseScrolled$Pre = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$MouseScrolled$Pre")
	// let new_event = new $ScreenEvent$MouseScrolled$Pre(current_screen, mouse_x, mouse_y, 0, delta)
	// $NeoForge.EVENT_BUS.post(new_event)
	// let $InputEvent$MouseScrollingEvent = Java.loadClass("net.neoforged.neoforge.client.event.InputEvent$MouseScrollingEvent")
	// let new_event = new $InputEvent$MouseScrollingEvent(0, 1, false, false, false, event.client.mouseHandler.getMouseX(), event.client.mouseHandler.getMouseY())
	// $NeoForge.EVENT_BUS.post(new_event)
}
