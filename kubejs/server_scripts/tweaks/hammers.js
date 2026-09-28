// requires: justhammers

ServerEvents.recipes(event => {
	// Use our own recipes for more reasonable hammers.
	event.remove({mod: "justhammers"})
	event.shaped(Item.of("justhammers:stone_hammer"), [" II", " SI", "S  "], {I: "minecraft:stone", S: "minecraft:stick"})
	event.shaped(Item.of("justhammers:stone_reinforced_hammer"), ["III", " SI", "S I"], {I: "minecraft:stone", S: "minecraft:stick"})
	event.shaped(Item.of("justhammers:iron_hammer"), [" II", " SI", "S  "], {I: "minecraft:iron_block", S: "minecraft:stick"})
	event.shaped(Item.of("justhammers:iron_reinforced_hammer"), ["III", " SI", "S I"], {I: "minecraft:iron_block", S: "minecraft:stick"})
})

ServerEvents.tags("item", event => {
	// Tidy up the way Hammers are tagged.
	// Without the code below "create:chain_rideable" would also include Hammers.
	// However, it currently comes at the cost of showing all hammers scrolling through
	// in Farmer's Delight's cutting recipes that require pickaxes.
	event.remove("minecraft:pickaxes", Ingredient.of("@justhammers").itemIds)
	event.add("c:tools/mining_tool", "#justhammers:hammer")
})