ServerEvents.recipes(event => {
	event.shaped("kubejs:trowel", ["II", "SI"], {I: "minecraft:iron_ingot", S: "minecraft:stick"})
})
BlockEvents.rightClicked(event => {
	if (event.item.id == "kubejs:trowel") {
		if (global.use_trowel_on_block(event)) {
			event.cancel()
		}
	}
})