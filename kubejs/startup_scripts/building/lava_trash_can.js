/** @type {typeof import("net.neoforged.neoforge.event.ItemStackedOnOtherEvent").$ItemStackedOnOtherEvent } */
let $ItemStackedOnOtherEvent  = Java.loadClass("net.neoforged.neoforge.event.ItemStackedOnOtherEvent")

NativeEvents.onEvent($ItemStackedOnOtherEvent, event => {
	if (event.clickAction == "SECONDARY") {
		const item_to_destroy = get_item_to_destroy(event.carriedItem, event.stackedOnItem)
		if (item_to_destroy) {
			if (Platform.isClientEnvironment()) {
				Client.player.playNotifySound("minecraft:block.lava.extinguish", "master", 0.1, 1.0)
			}
			if (!item_to_destroy.getComponents().has("minecraft:fire_resistant")) {
				item_to_destroy.shrink(99)
			}
			event.setCanceled(true)
		}
	}
})

if (Platform.isClientEnvironment()) {
	/** @type {typeof import("net.neoforged.neoforge.client.event.ContainerScreenEvent$Render$Foreground").$ContainerScreenEvent$Render$Foreground } */
	let $ContainerScreenEvent$Render$Foreground  = Java.loadClass("net.neoforged.neoforge.client.event.ContainerScreenEvent$Render$Foreground")
	NativeEvents.onEvent($ContainerScreenEvent$Render$Foreground, event => {
		if (event.containerScreen.menu?.carried.isEmpty()) {
			return
		}
		const container_screen = event.containerScreen
		const focused_slot = container_screen.focusedSlot
		if (!focused_slot) {
			return
		}

		const item_to_destroy = get_item_to_destroy(Client.player.containerMenu.carried, container_screen.focusedSlot.item)
		if (item_to_destroy) {
			event.guiGraphics["renderTooltip(net.minecraft.client.gui.Font,net.minecraft.network.chat.Component,int,int)"](
				Client.font, Text.translateWithFallback("", "%s to delete", [Text.translateWithFallback("", "Right-click").aqua()]).red(), event.mouseX - container_screen.x, event.mouseY - container_screen.y
			)
			event.guiGraphics.fill(focused_slot.x, focused_slot.y, focused_slot.x + 16, focused_slot.y + 16, 100, Color.ORANGE_DYE.getArgb())
		}
	})
}
