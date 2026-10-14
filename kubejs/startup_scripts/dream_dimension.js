// requires: resource_world

let $GameRules = Java.loadClass("net.minecraft.world.level.GameRules")
let $GameRules$IntegerValue = Java.loadClass("net.minecraft.world.level.GameRules$IntegerValue")

/**
 * @import {$MinecraftServer} from "@package/net/minecraft/server"
 * @import {$ServerLevel} from "@package/net/minecraft/server/level"
 * @import {$CompoundTag} from "@package/net/minecraft/nbt"
 */

StartupEvents.init(event => {
	global.GAME_RULES = {}
	global.GAME_RULES.DREAM_DURATION = $GameRules.register("dream_duration", "misc", $GameRules$IntegerValue.create(60 * MIN))
})

/**
 * I can't seem to make generics work here.
 * @typedef {ReturnType<typeof CompoundTagWrapperBuilder>} CompoundTagWrapper
 * @param {$CompoundTag} compound_tag @param {string} id @param {any} initial_value
 */
// global.CompoundTagWrapperBuilder = exports.CompoundTagWrapperBuilder = function(compound_tag, id, initial_value) {
// 	compound_tag.put(id, initial_value)
// 	return {
// 		set: function(value) {
// 			let newly_put_tag = compound_tag.put(id, value)
// 			console.log(newly_put_tag.getType().getName())
// 		},
// 		get: function() {
// 			return compound_tag.get(id)
// 		},
// 	}
// }

if (!global.persistent) {
	global.persistent = exports.persistent = {
		server: /** @type {$MinecraftServer} */ (null),
		// test_variable: /** @type {CompoundTagWrapper} */ (null),
	}
}
