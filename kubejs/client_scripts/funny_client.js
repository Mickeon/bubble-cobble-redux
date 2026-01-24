
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
	event.addAll({
		"advancement.create.hand_crank_000": "Cranking it",
		"item.minecraft.rabbit_stew": "Mimiga Stew",
		"item.minecraft.lead": "Leash",
		"item.minecraft.lingering_potion.effect.begone": "Lingering Potion of Begone",
		"item.minecraft.lingering_potion.effect.girl_power": "Lingering Potion of Girl Power",
		"item.minecraft.potion.effect.begone": "Potion of Begone",
		"item.minecraft.potion.effect.girl_power": "Potion of Girl Power",
		"item.minecraft.splash_potion.effect.begone": "Splash Potion of Begone",
		"item.minecraft.splash_potion.effect.girl_power": "Splash Potion of Girl Power",
		"item.minecraft.tipped_arrow.effect.begone": "Arrow of Begone",
		"item.minecraft.tipped_arrow.effect.girl_power": "Arrow of Girl Power",
		"item.minersdelight.rabbit_stew_cup": "Mimiga Stew Cup",
		"effect.kubejs.begone.description": "Teleports players to their spawn point",
		"effect.kubejs.girl_power.description": "Gives access to the \"Girl Power Dash\" by pressing a keybind in mid-air (Mouse Button 4 by default)",
		"entity.minecraft.wandering_trader": "Free Leash Guy",
		"key.kubejs.bubble_cobble.dash": "Girl Power Dash"
	})
	event.addAll("enhancedcelestials", {
		"enhancedcelestials.notification.blood_moon.rise": "The \"Blood Moon\" rises... Distant sounds of the undead can be heard...\nAnd that really pisses you off. WHY IS THE SKY RED",
		"enhancedcelestials.notification.blood_moon.set": "The \"Blood Moon\" sets... The undead begin to burn...",
		"enhancedcelestials.notification.super_blood_moon.rise": "The \"Super Blood Moon\" rises... Distant sounds of the undead can be heard...\n...\nThis is how Wario must've felt on the Virtual Boy",
		"enhancedcelestials.notification.super_blood_moon.set": "The \"Super Blood Moon\" sets... The undead begin to burn..."
	})
})
