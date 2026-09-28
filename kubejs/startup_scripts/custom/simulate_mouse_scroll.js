
if (Platform.isClientEnvironment()) {
	// Keybinds are not available in a dedicated server.
	KeyBindEvents.registry(event => {
		event.register("bubble_cobble.mouse_wheel_up", "KEY_PAGE_UP").inputType("keysym").category("Bubble Cobble")
		event.register("bubble_cobble.mouse_wheel_down", "KEY_PAGE_DOWN").inputType("keysym").category("Bubble Cobble")
	})
}
