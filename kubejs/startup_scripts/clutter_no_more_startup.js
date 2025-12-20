// requires: clutternomore
// https://aldak.netlify.app/javadoc/1.21.1-21.1.x/net/minecraft/client/gui/guigraphics
/** @type {typeof import("net.neoforged.neoforge.client.event.RenderGuiLayerEvent$Post").$RenderGuiLayerEvent$Post } */
let $RenderGuiLayerEvent$Post  = Java.loadClass("net.neoforged.neoforge.client.event.RenderGuiLayerEvent$Post")
// https://github.com/Alchemists-Of-Yore/ClutterNoMore/blob/0a5832a75ccfb65c999b207134cf0f43d369ab96/src/main/java/dev/tazer/clutternomore/common/shape_map/ShapeMap.java
/** @type {typeof import("dev.tazer.clutternomore.common.shape_map.ShapeMap").$ShapeMap } */
let $ShapeMap = Java.loadClass("dev.tazer.clutternomore.common.shape_map.ShapeMap")
/** @type {typeof import("net.minecraft.client.KeyMapping").$KeyMapping } */
let $KeyMapping  = Java.loadClass("net.minecraft.client.KeyMapping")
// https://discord.com/channels/303440391124942858/1421136321824424059/1421862264654401608
// /** @type {typeof import("net.neoforged.neoforge.client.event.RegisterGuiLayersEvent").$RegisterGuiLayersEvent } */
// let $RegisterGuiLayersEvent  = Java.loadClass("net.neoforged.neoforge.client.event.RegisterGuiLayersEvent")
// NativeEvents.onEvent($RegisterGuiLayersEvent, event => {
// 	event.registerAbove(
// 		"crosshair",
// 		ID.kjs("custom_screen_overlay"),
// 		(gui, delta) => global.draw_custom_screen_overlay(gui, delta)
// 	)
// })

NativeEvents.onEvent($RenderGuiLayerEvent$Post, event => {
	if (event.getName() != ID.mc("crosshair")) {
		return
	}

	global.draw_custom_screen_overlay(event.guiGraphics, event.partialTick)
})

const CHANGE_BLOCK_SHAPE_KEY = Utils.lazy(() => $KeyMapping.getALL().get("key.clutternomore.change_block_shape"))
const PLACE_BLOCK_KEY = Utils.lazy(() => $KeyMapping.getALL().get("key.use"))
const TEXT_APPEAR_TIME = 80.0 // 80.0
let elapsed_time = 0.0
/**
 * @param {import("net.minecraft.client.gui.GuiGraphics").$GuiGraphics$$Type} gui_graphics
 * @param {import("net.minecraft.client.DeltaTracker").$DeltaTracker$$Type} delta_tracker
 */
global.draw_custom_screen_overlay = (gui_graphics, delta_tracker) => {
	if (!Client.player || Client.options.hideGui || Client.isPaused()) {
		return
	}

	// Client.statusMessage = Client.isKeyBindDown("key.clutternomore.change_block_shape")
	const held_stack = Client.player.mainHandItem
	if (held_stack.isEmpty()
	|| !held_stack.block
	|| !$ShapeMap.contains(held_stack)
	|| CHANGE_BLOCK_SHAPE_KEY.get().down
	|| PLACE_BLOCK_KEY.get().down) {
		elapsed_time = 0.0
		return
	}

	elapsed_time += delta_tracker.getRealtimeDeltaTicks()

	const pos_x = gui_graphics.guiWidth() / 2
	const pos_y = gui_graphics.guiHeight() / 2

	const flash_progress = Math.abs(Math.sin(elapsed_time * 0.05))
	// let color_r = 0.5 - flash_progress * 0.1
	// let color_b = 0.3 - flash_progress * 0.4
	// let color_g = 0.9 - flash_progress * 0.1
	// let color_a = 0.25 - flash_progress * 0.1
	let color_r = 0.5 + flash_progress * 0.1
	let color_b = 0.3 + flash_progress * 0.4
	let color_g = 0.9 + flash_progress * 0.1
	let color_a = 0.25 - flash_progress * 0.1

	if (elapsed_time < 30.0) {
		const multiplier = elapsed_time / 30.0
		color_r *= multiplier
		color_g *= multiplier
		color_b *= multiplier
		color_a *= multiplier
		// color_a = Math.max(color_a, 0.15)
	}

	// Text.of("Press Tab to change shape").color("white")
	// gui_graphics.drawCenteredString(Client.font, text, pos_x + 96, gui_graphics.guiHeight() - 16, 0xFFFFFF)
	gui_graphics.setColor(color_r, color_b, color_g, color_a)
	gui_graphics.blitSprite("kubejs:hud/crosshair_multishape", pos_x - 10.5, pos_y - 8.5, 0, 21, 17)

	if (elapsed_time > TEXT_APPEAR_TIME) {
		// let text_pos_x = pos_x + 64 + Math.sin(0.1 * elapsed_time) * 32
		let text_pos_x = pos_x + 62 + Math.min((elapsed_time - TEXT_APPEAR_TIME) * 4, 32)
		let text_pos_y = gui_graphics.guiHeight() - 14

		const text = Text.keybind("key.clutternomore.change_block_shape")
		const text_color = (color_a * 255 << 24) + (255 << 16) + (255 << 8) + 255
		gui_graphics.drawString(Client.font, text, text_pos_x, text_pos_y, text_color)

		let i = 0
		const shapes = $ShapeMap.getShapes(Client.player.mainHandItem).reversed()
		const shape_count = shapes.length - 1
		for (const shape of shapes) {
			gui_graphics.renderFakeItem(Item.of(shape), text_pos_x + shape_count * 12 - i, text_pos_y - 20)
			i += 12
		}
	}
}
