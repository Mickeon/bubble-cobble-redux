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

// KeyBindEvents.pressed("key.use", event => {
// 	event.client.statusMessage = "Potato"
// })

