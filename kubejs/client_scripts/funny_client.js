/** @type {typeof import("net.minecraft.client.KeyMapping").$KeyMapping } */
let $KeyMapping  = Java.loadClass("net.minecraft.client.KeyMapping")

const DASH_KEY = Utils.lazy(() => $KeyMapping.getALL().get("keybinds.bettercombat.feint"))

ClientEvents.tick(event => {
	// if (DASH_KEY.consumeClick()) {
	if (DASH_KEY.get().down) {
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

