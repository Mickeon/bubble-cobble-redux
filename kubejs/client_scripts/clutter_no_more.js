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
