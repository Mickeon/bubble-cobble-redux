
ServerEvents.recipes(event => {
	event.shaped("bubble_cobble:trowel", ["II", "SI"], {I: "minecraft:iron_ingot", S: "minecraft:stick"})
})
BlockEvents.rightClicked(event => {
	if (event.item.id == "bubble_cobble:trowel") {
		if (global.use_trowel_on_block(event)) {
			event.cancel()
		}
	}
})
