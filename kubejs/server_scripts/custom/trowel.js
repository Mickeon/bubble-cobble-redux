
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

ServerEvents.tags("enchantment", event => {
	event.add("bubble_cobble:exclusive_set/trowel", "bubble_cobble:sequence", "bubble_cobble:pattern")
	event.add("minecraft:in_enchanting_table", "#bubble_cobble:exclusive_set/trowel")
	event.add("minecraft:on_random_loot", "#bubble_cobble:exclusive_set/trowel")
})
