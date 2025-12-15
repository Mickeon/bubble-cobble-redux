
// requires:brewinandchewin
/** @type {typeof import("net.minecraft.client.resources.sounds.SoundInstance").$SoundInstance } */
let $SoundInstance  = Java.loadClass("net.minecraft.client.resources.sounds.SoundInstance")
/** @type {typeof import("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Expired").$MobEffectEvent$Expired } */
let $MobEffectEvent$Expired  = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Expired")
/** @type {typeof import("net.minecraft.world.entity.player.Player").$Player } */
let $Player  = Java.loadClass("net.minecraft.world.entity.player.Player")
/** @type {typeof import("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove").$MobEffectEvent$Remove } */
let $MobEffectEvent$Remove  = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove")
/** @type {typeof import("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added").$MobEffectEvent$Added } */
let $MobEffectEvent$Added  = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added")

ItemEvents.modifyTooltips(event => {
	event.add("kubejs:sweet_berry_wine", Text.gray("Huh? Are these grapes?"))
	event.add("kubejs:honey_liqueur", Text.gray("Unusually bitter?"))
	event.add("kubejs:spumante", Text.gray("Bubbly with a pinch of cobbly."))
	event.add("kubejs:sparkling_rose", Text.gray("See the light with this."))
})

ClientEvents.lang("en_us", event => {
	event.add("item.kubejs.sparkling_rose", "Sparkling Rosé")
})


// /** @type {import("net.minecraft.client.resources.sounds.SoundInstance").$SoundInstance$$Type} */
// NativeEvents.onEvent($MobEffectEvent$Added, event => {
// 	const player = event.entity
// 	if (player instanceof $Player
// 	&& player.username == Client.player.username // Hack to see if this is the local player.
// 	&& event.effectInstance.effect.getRegisteredName() == "brewinandchewin:tipsy"
// 	&& !event.oldEffectInstance
// 	) {
// 		player.playNotifySound("minecraft:music_disc.cat", "master", 10000, 1)
// 		// const sound_manager = Client.soundManager
// 	}
// })

// for (const mob_effect_event of [$MobEffectEvent$Expired, $MobEffectEvent$Remove]) {
// 	NativeEvents.onEvent(mob_effect_event, event => {
// 		const player = event.entity
// 		if (player instanceof $Player
// 		&& player.username == Client.player.username // Hack to see if this is the local player.
// 		) {
// 			Client.soundManager.stop("minecraft:music_disc.cat", "master")
// 		}
// 	})
// }
