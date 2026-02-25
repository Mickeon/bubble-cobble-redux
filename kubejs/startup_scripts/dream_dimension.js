/** @type {typeof import("net.neoforged.neoforge.event.server.ServerAboutToStartEvent").$ServerAboutToStartEvent } */
let $ServerAboutToStartEvent  = Java.loadClass("net.neoforged.neoforge.event.server.ServerAboutToStartEvent")
/** @type {typeof import("net.neoforged.neoforge.event.server.ServerStoppedEvent").$ServerStoppedEvent } */
let $ServerStoppedEvent  = Java.loadClass("net.neoforged.neoforge.event.server.ServerStoppedEvent")
/** @type {typeof import("net.minecraft.world.level.GameRules").$GameRules } */
let $GameRules  = Java.loadClass("net.minecraft.world.level.GameRules")
/** @type {typeof import("net.minecraft.world.level.GameRules$IntegerValue").$GameRules$IntegerValue } */
let $GameRules$IntegerValue  = Java.loadClass("net.minecraft.world.level.GameRules$IntegerValue")

StartupEvents.init(event => {
	global.GAME_RULES = {}
	global.GAME_RULES.DREAM_DURATION = $GameRules.register("dream_duration", "misc", $GameRules$IntegerValue.create(60 * MIN))
})

// NativeEvents.onEvent($ServerAboutToStartEvent, event => {
// 	global.server = event.server
// })

// NativeEvents.onEvent($ServerStoppedEvent, event => {
// 	delete global.server
// })