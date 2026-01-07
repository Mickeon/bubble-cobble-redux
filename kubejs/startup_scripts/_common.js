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
	// If it exists, we are NOT on a dedicated server.
	/** @type {typeof import("net.minecraft.client.KeyMapping").$KeyMapping } */
	let $KeyMapping  = Java.loadClass("net.minecraft.client.KeyMapping")
	StartupEvents.postInit(event => {
		global.DASH_KEY = Client.options.keyMappings.find(key_mapping => key_mapping.name == "keybinds.bettercombat.feint")
		global.CHANGE_BLOCK_SHAPE_KEY = Client.options.keyMappings.find(key_mapping => key_mapping.name == "key.clutternomore.change_block_shape")
		global.PLACE_BLOCK_KEY = Client.options.keyUse
	})
}
