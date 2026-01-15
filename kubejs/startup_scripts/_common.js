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

if (Platform.isClientEnvironment()) {
	// Keybinds are not available in a dedicated server.
	KeyBindEvents.registry(event => {
		event.register("bubble_cobble.dash", "MOUSE_BUTTON_4").inputType("mouse").inGame().category("Bubble Cobble")
	})

	StartupEvents.postInit(event => {
		global.CHANGE_BLOCK_SHAPE_KEY = Client.options.keyMappings.find(key_mapping => key_mapping.name == "key.clutternomore.change_block_shape")
		global.PLACE_BLOCK_KEY = Client.options.keyUse

		// console.log(Client.options.keyMappings.filter(key_mapping => {
		// 	return !key_mapping.getName().includes("qa")
		// }).map(key_mapping => {
		// 	return `${key_mapping.getName()} | ${key_mapping.getCategory()}}`
		// }))
	})
}
