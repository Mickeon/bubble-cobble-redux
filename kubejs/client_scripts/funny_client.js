/** @type {typeof import("net.minecraft.client.KeyMapping").$KeyMapping } */
let $KeyMapping  = Java.loadClass("net.minecraft.client.KeyMapping")

ClientEvents.tick(event => {
	// console.log(global.DASH_KEY)
	// console.log(Client.options.keyMappings.find(key_mapping => key_mapping.name == "keybinds.bettercombat.feint"))
	// if (DASH_KEY.consumeClick()) {
	if (global.DASH_KEY.down) {
		const angle = event.player.lookAngle
		event.player.sendData("kubejs:dash", {
			angle: {
				x: angle.x(),
				y: angle.y(),
				z: angle.z(),
			},
			forward_back: event.player.input.forwardImpulse
		})
	}
})

ClientEvents.lang("en_us", event => {
	event.add("advancement.create.hand_crank_000", "Cranking it")
	event.add("item.minecraft.rabbit_stew", "Mimiga Stew")
	event.add("item.minersdelight.rabbit_stew_cup", "Mimiga Stew Cup")
	event.add("item.minecraft.lead", "Leash")
	event.add("entity.minecraft.wandering_trader", "Free Leash Guy")
	event.add("haventrowel", "item.haventrowel.trowel", "Trowel at Home")
})

// KeyBindEvents.pressed("key.use", event => {
// 	event.client.statusMessage = "Potato"
// })

