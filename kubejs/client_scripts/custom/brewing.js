
// requires:brewinandchewin
// let $SoundInstance  = Java.loadClass("net.minecraft.client.resources.sounds.SoundInstance")
// let $MobEffectEvent$Expired  = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Expired")
// let $Player  = Java.loadClass("net.minecraft.world.entity.player.Player")
// let $MobEffectEvent$Remove  = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove")
// let $MobEffectEvent$Added  = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added")

const WINES = ["kubejs:sweet_berry_wine", "kubejs:honey_liqueur", "kubejs:spumante", "kubejs:sparkling_rose", "kubejs:berry_juice_soda", "kubejs:firebomb_whiskey"]

ItemEvents.modifyTooltips(event => {
	event.add("kubejs:sweet_berry_wine", Text.gray("Huh? Are these grapes?"))
	event.add("kubejs:honey_liqueur", Text.gray("Unusually bitter?"))
	event.add("kubejs:spumante", Text.gray("Bubbly with a pinch of cobbly."))
	event.add("kubejs:sparkling_rose", Text.gray("See the light with this."))
})

ClientEvents.lang("en_us", event => {
	event.add("item.kubejs.sparkling_rose", "Sparkling Rosé")
})

// Generate icons to be displayed inside the Keg in the Pouring and Fermenting recipes.
ClientEvents.generateAssets("after_mods", event => {
	// The key is the fluid ID, and the value is a corresponding item ID, or similar. In our case they are the same ID.
	const fluid_item_display = {
		// Let's also display the honey liquid with a bucket, instead of bottles.
		// Otherwise, it displays incorrectly because of the #c:honey tag... for some reason.
		"#c:honey": "create:honey_bucket"
	}
	for (const wine of WINES) {
		fluid_item_display[wine] = wine
	}
	event.json(`bubble_cobble:brewinandchewin/fluid_item_displays/wines`, fluid_item_display)
})


// /** @type {import("@package/net/minecraft/client/resources/sounds").$SoundInstance} */
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


// Can't even press buttons right while drunk. Shaking my head.
const $ScreenEvent$MouseButtonPressed$Pre = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$MouseButtonPressed$Pre")
NativeEvents.onEvent($ScreenEvent$MouseButtonPressed$Pre, event => {
	if (!(event.screen instanceof $PauseScreen)
	|| event.getButton() != 0
	|| !Client.player.hasEffect("brewinandchewin:tipsy")
	|| !Utils.random.nextBoolean()
	) {
		return
	}

	const button = event.screen.getChildAt(
		Client.mouseHandler.getMouseX() / Client.options.guiScale().get(),
		Client.mouseHandler.getMouseY() / Client.options.guiScale().get()
	).orElseGet(() => null)

	if (button instanceof $Button) {
		button.setX(button.getX() + Utils.random.nextInt(-64, 64))
		button.setY(button.getY() + Utils.random.nextInt(-64, 64))
		Client.player.playNotifySound("artifacts:item.whoopee_cushion.fart", "master", 0.025, 0.05 + Utils.random.nextFloat() * 0.05)

		Client.scheduleInTicks(Client.isPaused() ? 0 : 10, () => {
			Client.player.playNotifySound("minecraft:entity.player.burp", "players", 0.025, 0.25 + Utils.random.nextFloat() * 0.75)
		})
		event.setCanceled(true)
	}
})