// priority: 1000

/** @type {typeof import("net.minecraft.world.entity.player.Player").$Player } */
let $Player  = Java.loadClass("net.minecraft.world.entity.player.Player")
/** @type {typeof import("dev.latvian.mods.kubejs.item.FoodBuilder").$FoodBuilder } */
let $FoodBuilder  = Java.loadClass("dev.latvian.mods.kubejs.item.FoodBuilder")

/**
 * @import {$ItemStack} from "net.minecraft.world.item.ItemStack"
 */

const SEC = 20
const MIN = SEC * 60

// TODO: Make a distinction between dev-only and whatnot.
const DISABLED_KEY_IDS = new Set([
	"chunksfadein.keybinds.toggleMod",
	// "iris.keybind.wireframe",
	// "key.modernfix.config",
	"gui.xaero_toggle_pac_chunk_claims",
	// "treechop.key.toggle_chopping",
	// "treechop.key.cycle_sneak_behavior",
	// "treechop.key.open_settings_overlay",
	"placebo.toggleTrails",
	"placebo.toggleWings",
	"key.jade.config",
	"key.craftpresence.config_keycode.name",
	"keybind.invmove.toggleMove",
	"key.entityculling.toggle",
	"key.cpm.qa_5",
	"key.cpm.qa_6",
	"key.cpm.qa_7",
	"key.cpm.qa_8",
	"key.cpm.qa_9",
	"key.cpm.qa_10",
	"key.cpm.qa_11",
	"key.cpm.qa_12",
	"key.cpm.qa_13",
	"key.cpm.qa_14",
	"key.cpm.qa_15",
	"key.cpm.qa_16",
	"key.sophisticatedsorter.sort",
	"key.sophisticatedsorter.disable",
])

if (Platform.isClientEnvironment()) {
	// Keybinds are not available in a dedicated server.
	KeyBindEvents.registry(event => {
		event.register("bubble_cobble.dash", "MOUSE_BUTTON_4").inputType("mouse").inGame().category("Bubble Cobble")
	})

	StartupEvents.postInit(event => {
		global.CHANGE_BLOCK_SHAPE_KEY = Client.options.keyMappings.find(key_mapping => key_mapping.name == "key.clutternomore.change_block_shape")
		global.PLACE_BLOCK_KEY = Client.options.keyUse

		Client.options.keyMappings = Client.options.keyMappings.filter(key_mapping => {
			return !DISABLED_KEY_IDS.has(String(key_mapping.getName())) // `getName()` returns a String object, not primitive. JavaScript beware...
		})
		// Client.options.keyMappings.forEach(key_mapping => {
		// 	console.log(`${key_mapping.getName()} | ${key_mapping.saveString()}}`)
		// })
	})
}
