// priority: 1000

Platform.setModName("kubejs", "Bubble Cobble")
Platform.setModName("bubble_cobble", "Bubble Cobble")

/** @type {typeof import("net.minecraft.world.entity.player.Player").$Player } */
let $Player  = Java.loadClass("net.minecraft.world.entity.player.Player")
/** @type {typeof import("dev.latvian.mods.kubejs.item.FoodBuilder").$FoodBuilder } */
let $FoodBuilder  = Java.loadClass("dev.latvian.mods.kubejs.item.FoodBuilder")
/** @type {typeof import("net.minecraft.world.item.component.ItemAttributeModifiers").$ItemAttributeModifiers } */
let $ItemAttributeModifiers  = Java.loadClass("net.minecraft.world.item.component.ItemAttributeModifiers")

/**
 * @import {$List} from "java.util.List"
 * @import {$ItemStack} from "net.minecraft.world.item.ItemStack"
 * @import {$Item} from "net.minecraft.world.item.Item"
 * @import {$Player} from "net.minecraft.world.entity.player.Player"
 * @import {$LivingEntity} from "net.minecraft.world.entity.LivingEntity"
 *
 * @typedef {import("dev.latvian.mods.kubejs.item.ItemModificationKubeEvent$ItemModifications").$ItemModificationKubeEvent$ItemModifications$$Original} $ItemModifications
 */

const SEC = 20
const MIN = SEC * 60

/** @param {number} value @param {number} min1 @param {number} max1 @param {number} min2 @param {number} max2 */
function remap(value, min1, max1, min2, max2) {
	let value_norm = (value - min1) / (max1 - min1) // Inverse linear interpolation function.
	return min2 + (max2 - min2) * value_norm // Linear interpolation function.
}

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
