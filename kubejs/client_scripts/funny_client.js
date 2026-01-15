
KeyBindEvents.tick("bubble_cobble.dash", event => {
	const angle = event.player.lookAngle
	event.player.sendData("kubejs:dash", {
		angle: {
			x: angle.x(),
			y: angle.y(),
			z: angle.z(),
		},
		forward_back: event.player.input.forwardImpulse
	})
})


ClientEvents.lang("en_us", event => {
	event.add("advancement.create.hand_crank_000", "Cranking it")
	event.add("item.minecraft.rabbit_stew", "Mimiga Stew")
	event.add("item.minersdelight.rabbit_stew_cup", "Mimiga Stew Cup")
	event.add("item.minecraft.lead", "Leash")
	event.add("entity.minecraft.wandering_trader", "Free Leash Guy")
	event.add("enhancedcelestials", "enhancedcelestials.notification.blue_moon.rise", "The \"Blue Moon\" rises... You feel lucky!")
	event.add("enhancedcelestials", "enhancedcelestials.notification.blue_moon.rise", "The \"Super Blue Moon\" rises... You feel very lucky! But joke's on you, dumbass! The shinies have ghosts too!",)
	event.add("item.minecraft.potion.effect.girl_power", "Potion of Girl Power",)
	event.add("item.minecraft.splash_potion.effect.girl_power", "Splash Potion of Girl Power",)
	event.add("item.minecraft.lingering_potion.effect.girl_power", "Lingering Potion of Girl Power",)
	event.add("effect.kubejs.girl_power.description", "Gives access to the affectionately-nicknamed \"Trans dash\" by pressing a keybind in mid-air (Mouse 4 by default)")
	event.add("effect.kubejs.begone.description", "Teleports players to their spawn point",)
	event.add("key.kubejs.bubble_cobble.dash", "Girl Power Dash",)
})
