/** @import {} from "../startup_scripts/_common" */
this.is_eligible_for_easter_egg = global.is_eligible_for_easter_egg

KeyBindEvents.tick("bubble_cobble.dash", event => {
	const angle = event.player.lookAngle
	event.player.sendData("bubble_cobble:dash", {
		angle: {
			x: angle.x(),
			y: angle.y(),
			z: angle.z(),
		},
		forward_back: event.player.input.forwardImpulse
	})
})

ItemEvents.modifyTooltips(event => {
	event.add(["cobblemon:ice_stone"], Text.of(`Emanates a blue mascot cat scent...`).color(MASCOT_COLOR))
	event.add(["farmersdelight:skillet"], [subtle("Right-click in inventory to equip")])
	event.modify([
		"create:chocolate_bucket",
		"create:honey_bucket",
		"create_bic_bit:mayonnaise_bucket",
		"create_bic_bit:ketchup_bucket",
		"create:bound_cardboard_block",
		"sophisticatedbackpacks:advanced_feeding_upgrade",
		"sophisticatedbackpacks:feeding_upgrade",
		"sophisticatedstorage:advanced_feeding_upgrade",
		"sophisticatedstorage:feeding_upgrade",
	], text => {
		text.dynamic("add_pelad")
	})
})

const GOURMANDS = ["AceNil_", "SniperZee", "CantieLabs", "SueTheMimiga", "ButteryInkling"]
ItemEvents.dynamicTooltips("add_pelad", event => {
	if (is_eligible_for_easter_egg(Client.player, GOURMANDS)) {
		event.lines[0] = Text.of(event.lines[0]).append(Utils.getSystemTime() % 3000 > 1000 ? " 😳" : " 🥺")
	}
})

ClientEvents.lang("en_us", event => {
	event.addAll({
		"advancement.create.hand_crank_000": "Cranking it",
		"item.minecraft.rabbit_stew": "Mimiga Stew",
		"item.minersdelight.rabbit_stew_cup": "Mimiga Stew Cup",
		"entity.minecraft.wandering_trader": "Free Leash Guy",
		"key.kubejs.bubble_cobble.dash": "Girl Power Dash",
	})
	event.addAll("enhancedcelestials2defaultlunarevents", {
		"enhancedcelestials2defaultlunarevents.notification.blood_moon.rise": "The \"Blood Moon\" rises... Distant sounds of the undead can be heard...\nAnd that really pisses you off. WHY IS THE SKY RED",
		"enhancedcelestials2defaultlunarevents.notification.blood_moon.set": "The \"Blood Moon\" sets... The undead begin to burn...",
		"enhancedcelestials2defaultlunarevents.notification.super_blood_moon.rise": "The \"Super Blood Moon\" rises... Distant sounds of the undead can be heard...\n...\nThis is how Wario must've felt on the Virtual Boy",
		"enhancedcelestials2defaultlunarevents.notification.super_blood_moon.set": "The \"Super Blood Moon\" sets... The undead begin to burn..."
	})
	event.add("brewinandchewin", "item.brewinandchewin.egg_grog", "§3@Grog§r Is This True?")
})
