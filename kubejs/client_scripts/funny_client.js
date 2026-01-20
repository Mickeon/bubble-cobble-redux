
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
	event.add("enhancedcelestials", "enhancedcelestials.notification.blood_moon.rise", "The \"Blood Moon\" rises... Distant sounds of the undead can be heard...\nAnd that really pisses you off. WHY IS THE SKY RED")
	event.add("enhancedcelestials", "enhancedcelestials.notification.super_blood_moon.rise", "The \"Super Blood Moon\" rises... Distant sounds of the undead can be heard...\n...\nThis is how Wario must've felt on the Virtual Boy")
	event.add("enhancedcelestials", "enhancedcelestials.notification.blood_moon.set", "The \"Blood Moon\" sets... The undead begin to burn...",)
	event.add("enhancedcelestials", "enhancedcelestials.notification.super_blood_moon.set", "The \"Super Blood Moon\" sets... The undead begin to burn...",)
	event.add("item.minecraft.potion.effect.girl_power", "Potion of Girl Power",)
	event.add("item.minecraft.splash_potion.effect.girl_power", "Splash Potion of Girl Power",)
	event.add("item.minecraft.lingering_potion.effect.girl_power", "Lingering Potion of Girl Power",)
	event.add("effect.kubejs.girl_power.description", "Gives access to the \"Girl Power Dash\" by pressing a keybind in mid-air (Mouse Button 4 by default)")
	event.add("effect.kubejs.begone.description", "Teleports players to their spawn point",)
	event.add("key.kubejs.bubble_cobble.dash", "Girl Power Dash",)
})
