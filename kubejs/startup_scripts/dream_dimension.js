/** @type {typeof import("net.minecraft.world.level.GameRules").$GameRules } */
let $GameRules  = Java.loadClass("net.minecraft.world.level.GameRules")
/** @type {typeof import("net.minecraft.world.level.GameRules$IntegerValue").$GameRules$IntegerValue } */
let $GameRules$IntegerValue  = Java.loadClass("net.minecraft.world.level.GameRules$IntegerValue")

global.GAME_RULES = {}
StartupEvents.init(event => {
	global.GAME_RULES.DREAM_DURATION = $GameRules.register("dream_duration", "misc", $GameRules$IntegerValue.create(60 * MIN))
})