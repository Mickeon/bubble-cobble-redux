// requires: lootjs
// Note: This script should wait for custom biome tags.

// const GENERAL_FURNITURE = Ingredient.of("@handcrafted").itemStacks
const GENERAL_FURNITURE = "minecraft:waxed_copper_block"



LootJS.lootTables(event => {
	event.getLootTable("supplementaries:loot/urn_loot/common")
		.firstPool()
		.addEntry(LootEntry.of("minecraft:waxed_copper_block")
			.withWeight(1000)
			.setCount(1, 4))
})


LootJS.modifiers(event => {
	const every_furniture = LootEntry
		.of(GENERAL_FURNITURE)
		.when(c => c.randomChance(0.25))

	// const taiga_furniture = LootEntry
	// 	.of(GENERAL_FURNITURE.and(/.*spruce.*/))
	// 	.when(c => c.biome("#minecraft:is_taiga") && c.randomChance(0.5))

	// const jungle_furniture = LootEntry
	// 	.of(GENERAL_FURNITURE.and(/.*(jungle|bamboo).*/))
	// 	.when(c => c.biome("#minecraft:is_jungle") && c.randomChance(0.5))

	// const badlands_furniture = LootEntry
	// 	.of(GENERAL_FURNITURE.and(/.*acacia.*/))
	// 	.when(c => (c.biome("#minecraft:is_badlands") || c.biome("#minecraft:is_savanna")) && c.randomChance(0.5))

	// const floral_furniture = LootEntry
	// 	.of(GENERAL_FURNITURE.and(/.*cherry.*/))
	// 	.when(c => (c.biome("#c:floral") || c.biome("#kubejs:is_cherry")) && c.randomChance(0.5))

	// const swamp_furniture = LootEntry
	// 	.of(GENERAL_FURNITURE.and(/.*mangrove.*/))
	// 	.when(c => c.biome("#c:is_swamp") && c.randomChance(0.5))

	// const plains_furniture = LootEntry
	// 	.of(GENERAL_FURNITURE.and(/.*(birch|oak|spruce).*/))
	// 	.when(c => c.biome("#c:is_plains") && c.randomChance(0.25))

	// const create_seats = LootEntry
	// 	.of(Ingredient.of("#create:seats"))
	// 	.when(c => c.randomChance(0.2))

	// const nether_furniture = LootEntry
	// 	.of(GENERAL_FURNITURE.and(/.*(warped|crimson).*/))
	// 	.when(c => c.biome("#c:in_nether") && c.randomChance(0.5))

	event.addTableModifier(LootType.CHEST)
		.addAlternativesLoot(
			// badlands_furniture,
			// nether_furniture,
			// jungle_furniture,
			// floral_furniture,
			// swamp_furniture,
			// taiga_furniture,
			// plains_furniture,
			// create_seats,
			every_furniture,
		)

	// Make Sniffers more accessible in a multiplayer setting.
	event.addTableModifier("minecraft:chests/underwater_ruin_small", "minecraft:chests/underwater_ruin_big")
		.randomChance(0.25)
		.addLoot("minecraft:sniffer_egg")


	// event.addTableModifier("supplementaries:loot/urn_loot/common")
	// 	.addLoot("minecraft:waxed_copper_block")
	// event.addTableModifier("supplementaries:loot/urn_loot/uncommon")
	// 	.addLoot(LootEntry.of("create:zinc_nugget").withWeight(1000).apply(functions => {functions.setCount([8, 32])}))
	// 	.addLoot(LootEntry.of("minecraft:copper_nugget").withWeight(1000).apply(functions => {functions.setCount([8, 32])}))

	// event.addTableModifier("supplementaries:loot/urn_loot/rare")
	// event.addTableModifier("supplementaries:loot/urn_loot/epic")
})


