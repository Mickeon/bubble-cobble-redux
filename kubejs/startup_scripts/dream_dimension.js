let $ServerAboutToStartEvent = Java.loadClass("net.neoforged.neoforge.event.server.ServerAboutToStartEvent")
let $ServerStoppedEvent = Java.loadClass("net.neoforged.neoforge.event.server.ServerStoppedEvent")
let $GameRules = Java.loadClass("net.minecraft.world.level.GameRules")
let $GameRules$IntegerValue = Java.loadClass("net.minecraft.world.level.GameRules$IntegerValue")

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