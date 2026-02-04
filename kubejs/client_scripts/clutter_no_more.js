// requires: clutternomore

/**
 * @import {$Item} from "net.minecraft.world.item.Item"
 * @import {$List} from "java.util.List"
 */

// https://aldak.netlify.app/javadoc/1.21.1-21.1.x/net/minecraft/client/gui/guigraphics
// https://github.com/Alchemists-Of-Yore/ClutterNoMore/blob/0a5832a75ccfb65c999b207134cf0f43d369ab96/src/main/java/dev/tazer/clutternomore/common/shape_map/ShapeMap.java
/** @type {typeof import("dev.tazer.clutternomore.common.shape_map.ShapeMap").$ShapeMap } */
let $ShapeMap = Java.loadClass("dev.tazer.clutternomore.common.shape_map.ShapeMap")

/** @type {$List<$Item>} */
let shapes
/** @type {$Item} */
let cached_item

ItemEvents.modifyTooltips(event => {
	event.modifyAll(text => {
		text.dynamic("show_available_shapes")
	})
})

ItemEvents.dynamicTooltips("show_available_shapes", event => {
	if (!$ShapeMap.contains(event.item)) {
		return
	}

	let new_lines = Utils.newList()
	// Quite the nasty hack because I can't fetch the keybind press from here.
	let selecting_shape = event.lines.getFirst().getString().endsWith("[+]")
	if (selecting_shape) {
		let stack = event.item

		// No point re-getting the list every frame.
		if (stack.item != cached_item) {
			cached_item = stack.item
			shapes = Utils.newList()
			shapes.add($ShapeMap.getParent(stack))
			shapes.addAll($ShapeMap.getShapes(stack))

			// Make the list appear like it's scrolling smoothly.
			let base_scroll_index = shapes.indexOf(stack.item)
			for (let i = 0; i < base_scroll_index; i++) {
				shapes.addLast(shapes.removeFirst())
			}
		}

		shapes.forEach(shape => {
			if (stack.item.id == shape.id) {
				return
			}
			new_lines.add(Text.of("• ").append(shape.description).color("dark_gray"))
		})

		new_lines.add(Text.translate("Hold %s to change shape", [Text.keybind("key.clutternomore.change_block_shape").color(MASCOT_COLOR)]).color(MASCOT_COLOR_DARK))
	} else {
		new_lines.add(Text.translate("Scroll the %s", [Text.of("Mouse Wheel").color(MASCOT_COLOR)]).color(MASCOT_COLOR_DARK))
	}

	event.lines.addAll(1, new_lines)
})


// With this very ungodly hack, I prevent the "Change Shape" key (usually TAB) from triggering other menu actions.
// This artificially skips any mixin logic and triggers the KeyPressed.Post event directly.
// No More Clutter executes its block-changing logic there.

/** @type {typeof import("net.neoforged.neoforge.common.NeoForge").$NeoForge } */
let $NeoForge = Java.loadClass("net.neoforged.neoforge.common.NeoForge")
/** @type {typeof import("net.minecraft.client.gui.screens.inventory.AbstractContainerScreen").$AbstractContainerScreen } */
let $AbstractContainerScreen = Java.loadClass("net.minecraft.client.gui.screens.inventory.AbstractContainerScreen")
/** @type {typeof import("net.neoforged.neoforge.client.event.ScreenEvent$KeyPressed$Pre").$ScreenEvent$KeyPressed$Pre } */
let $ScreenEvent$KeyPressed$Pre = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$KeyPressed$Pre")
/** @type {typeof import("net.neoforged.neoforge.client.event.ScreenEvent$KeyPressed$Post").$ScreenEvent$KeyPressed$Post } */
let $ScreenEvent$KeyPressed$Post = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$KeyPressed$Post")

/** @type {import("net.minecraft.client.KeyMapping").$KeyMapping$$Original} */
const CHANGE_BLOCK_SHAPE_KEY = global.CHANGE_BLOCK_SHAPE_KEY = Client.options.keyMappings.find(key_mapping => key_mapping.name == "key.clutternomore.change_block_shape")
NativeEvents.onEvent($ScreenEvent$KeyPressed$Pre, event => {
	if (CHANGE_BLOCK_SHAPE_KEY.getKey().getValue() != event.getKeyCode()) {
		return
	}

	const screen = event.screen
	if (!(screen instanceof $AbstractContainerScreen)) {
		return
	}
	const item = screen.hoveredSlot?.item?.item
	if (item && $ShapeMap.contains(item)) {
		event.setCanceled(true)
		let new_event = new $ScreenEvent$KeyPressed$Post(event.screen, event.getKeyCode(), event.getScanCode(), event.getModifiers())
		$NeoForge.EVENT_BUS.post(new_event)
	}
})