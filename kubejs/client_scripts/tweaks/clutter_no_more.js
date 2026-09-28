// requires: clutternomore

/**
 * @import {$Item} from "@package/net/minecraft/world/item"
 * @import {$List} from "@package/java/util"
 */

// https://github.com/Alchemists-Of-Yore/ClutterNoMore/blob/0a5832a75ccfb65c999b207134cf0f43d369ab96/src/main/java/dev/tazer/clutternomore/common/shape_map/ShapeMap.java
let $ShapeMap = Java.loadClass("dev.tazer.clutternomore.common.shape_map.ShapeMap")

let shapes = /** @type {$List<$Item>?} */ (null)
let cached_item = /** @type {$Item?} */ (null)

const KEYBIND_TOOLTIP = Text.translate("Hold %s to change shape", [Text.keybind("key.clutternomore.change_block_shape").color(MASCOT_COLOR)]).color(MASCOT_COLOR_DARK)
const SCROLL_TOOLTIP = Text.translate("%s the Mouse Wheel", [Text.of(`Scroll`).color(MASCOT_COLOR)]).color(MASCOT_COLOR_DARK)

ItemEvents.modifyTooltips(event => {
	event.modifyAll(text => {
		text.dynamic("show_available_shapes")
	})
})

ItemEvents.dynamicTooltips("show_available_shapes", event => {
	if (!$ShapeMap.contains(event.item)) {
		return
	}

	let hovered_slot = /** @type {import("@package/net/minecraft/world/inventory").$Slot} */ (Client.getCurrentScreen()?.hoveredSlot)
	if (!(hovered_slot) || hovered_slot.isFake() || !hovered_slot.allowModification(Client.player)) {
		return
	}

	let selecting_shape = Client.isKeyMappingDown(global.CHANGE_BLOCK_SHAPE_KEY) // FIXME: There is one frame of delay by doing this.
	if (selecting_shape) {
		event.lines.add(1, SCROLL_TOOLTIP)
	} else {
		// The list doesn't really convince me anymore...
		/*
		let new_lines = Utils.newList()
		let stack = event.item

		const $CustomCreativeSlot = Java.loadClass("net.minecraft.client.gui.screens.inventory.CreativeModeInventoryScreen$CustomCreativeSlot")
		let no_fancy_selector = !(hovered_slot instanceof $CustomCreativeSlot)
		if (no_fancy_selector) {
			// No point re-getting the list every frame.
			if (stack.item != cached_item) {
				cached_item = stack.item
				shapes = Utils.newList()
				// shapes.add($ShapeMap.getParent(stack))
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
				new_lines.add(Text.of(`• `).append(shape.description).color("dark_gray"))
			})
		}
		new_lines.add(KEYBIND_TOOLTIP)
		event.lines.addAll(1, new_lines)
		*/

		event.lines.add(1, KEYBIND_TOOLTIP)
	}

})


// With this very ungodly hack, I prevent the "Change Shape" key (usually TAB) from triggering other menu actions.
// This artificially skips any mixin logic and triggers the KeyPressed.Post event directly.
// No More Clutter executes its block-changing logic there.

let $NeoForge = Java.loadClass("net.neoforged.neoforge.common.NeoForge")
let $AbstractContainerScreen = Java.loadClass("net.minecraft.client.gui.screens.inventory.AbstractContainerScreen")
let $ScreenEvent$KeyPressed$Pre = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$KeyPressed$Pre")
let $ScreenEvent$KeyPressed$Post = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$KeyPressed$Post")

NativeEvents.onEvent($ScreenEvent$KeyPressed$Pre, event => {
	if (global.CHANGE_BLOCK_SHAPE_KEY.getKey().getValue() != event.getKeyCode()) {
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