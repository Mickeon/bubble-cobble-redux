// requires: lootjs
// Note: This script should wait for custom biome tags.

const GENERAL_FURNITURE = Ingredient.of("@handcrafted").except(/trim/).or(/^farmersdelight:.*_cabinet$/)
// const GENERAL_FURNITURE = Ingredient.of("@handcrafted").and(/drawer/)

ServerEvents.tags("item", event => {
	for (const wood_type of ["oak", "birch", "spruce", "jungle", "bamboo", "acacia", "cherry", "mangrove", "warped", "crimson"]) {
		event.add(
			`bubble_cobble:${wood_type}_furniture`,
			GENERAL_FURNITURE.and(RegExp(`.*${wood_type}.*`)).itemIds
		)
	}
})


LootJS.lootTables(event => {
	if (Item.exists("supplementaries:urn")) {
		event.modifyLootTables(["supplementaries:loot/urn_loot/common", "supplementaries:loot/urn_loot/uncommon", "supplementaries:loot/urn_loot/rare"])
			.removeItem("supplementaries:flax_seeds")
			.removeItem("minecraft:emerald")

		event.getLootTable("supplementaries:loot/urn_loot/common").firstPool()
			.addEntry(LootEntry.of("farmersdelight:straw").withWeight(20).setCount([1, 2]))
			.addEntry(LootEntry.of("farmersdelight:canvas").withWeight(15).setCount([1, 2]))
			.addEntry(LootEntry.of("minersdelight:bat_wing").withWeight(10).setCount([1, 2]))
			.addEntry(LootEntry.of("supplementaries:rope").withWeight(10).setCount([2, 4]))
			.addEntry(LootEntry.of("cobblemon:slate_ball").withWeight(7).setCount([2, 4]))
			.addEntry(LootEntry.of("cobblemon:potion").withWeight(2).setCount([1, 4]))

		event.getLootTable("supplementaries:loot/urn_loot/uncommon").firstPool()
			.addEntry(LootEntry.of("create:zinc_nugget").withWeight(10).setCount([8, 32]))
			.addEntry(LootEntry.of("minecraft:copper_nugget").withWeight(10).setCount([8, 32]))
			.addEntry(LootEntry.of("supplementaries:rope").withWeight(10).setCount([3, 6]))
			.addEntry(LootEntry.of("farmersdelight:canvas").withWeight(10).setCount([2, 4]))
			.addEntry(LootEntry.of("farmersdelight:straw").withWeight(10).setCount([2, 4]))
			.addEntry(LootEntry.of("cobblemon:ancient_slate_ball").withWeight(8).setCount([2, 5]))
			.addEntry(LootEntry.of("cobblemon:ancient_heavy_ball").withWeight(8).setCount([3, 5]))
			.addEntry(LootEntry.of("cobblemon:ancient_leaden_ball").withWeight(5).setCount([3, 5]))
			.addEntry(LootEntry.of("cobblemon:dusk_ball").withWeight(5).setCount([1, 2]))
			.addEntry(LootEntry.of("cobblemon:super_potion").withWeight(5).setCount([1, 4]))
			.addEntry(LootEntry.of("cobblemon:revive").withWeight(5))
			.addEntry(LootEntry.of("minersdelight:cave_carrot").withWeight(8).setCount([1, 5]))
			.addEntry(LootEntry.of("minersdelight:smoked_bat_wing").withWeight(5).setCount([1, 4]))
			.addEntry(LootEntry.of("minersdelight:baked_cave_carrot").withWeight(5).setCount([1, 4]))
			.addEntry(LootEntry.of("minersdelight:silverfish_eggs").withWeight(2).setCount([1, 3]))
			.addEntry(LootEntry.of("brewinandchewin:flaxen_cheese_wedge").withWeight(2).setCount([2, 4]))

		event.getLootTable("supplementaries:loot/urn_loot/rare").firstPool()
			.addEntry(LootEntry.of("minersdelight:bat_cookie").withWeight(15).setCount([2, 6]))
			.addEntry(LootEntry.of("minersdelight:bat_soup_cup").withWeight(15).setCount([1, 2]))
			.addEntry(LootEntry.of("minersdelight:rabbit_stew_cup").withWeight(10).setCount([1, 2]))
			.addEntry(LootEntry.of("minersdelight:cave_soup_cup").withWeight(10).setCount([1, 2]))
			.addEntry(LootEntry.of("minersdelight:bat_rolls").withWeight(10).setCount([1, 2]))
			.addEntry(LootEntry.of("cnc:wishbone").withWeight(10).setCount([1, 4]))
			.addEntry(LootEntry.of("create:raw_zinc").withWeight(10).setCount([3, 8]))
			.addEntry(LootEntry.of("cobblemon:ancient_gigaton_ball").withWeight(7).setCount([3, 4]))
			.addEntry(LootEntry.tag("simpletms:type_ground_tr", true).withWeight(5))
			.addEntry(LootEntry.of("kubejs:doublemint_gum").withWeight(1).setCount([1, 2]))

		event.getLootTable("supplementaries:loot/urn_loot/epic").firstPool()
			.addEntry(LootEntry.of("minersdelight:nutritional_bar").withWeight(10).setCount([2, 6]))
			.addEntry(LootEntry.tag("simpletms:type_ground_tm", true).withWeight(10))
			.addEntry(LootEntry.of("simpletms:tm_blank").withWeight(2))
			.addEntry(LootEntry.of("cobblemon:ability_patch").withWeight(2))
	}

	//	Make Sniffers more accessible in a multiplayer setting.
	for (let table_id of ["minecraft:chests/underwater_ruin_small", "minecraft:chests/underwater_ruin_big"]) {
		event.getLootTable(table_id).firstPool()
			.addEntry("minecraft:sniffer_egg")
	}

	event.modifyLootTables(/.*chest.*/)
		.removeItem("minecraft:wheat_seeds")
		.removeItem("minecraft:beetroot_seeds")
		.replaceItem("supplementaries:flax_seeds", "farmersdelight:straw")
		.replaceItem("farmersdelight:rope", "supplementaries:rope")

	// Furniture time.
	if (Platform.isLoaded("handcrafted")) {
		let furniture_pool = event.create("kubejs:furniture", "chest").createPool()

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:spruce_furniture", true).withWeight("10")
			.matchBiome("#minecraft:is_taiga"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:bamboo_furniture", true).withWeight("10")
			.matchBiome("#minecraft:is_jungle"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:jungle_furniture", true).withWeight("10")
			.matchBiome("#minecraft:is_jungle"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:acacia_furniture", true).withWeight("10")
			.matchAnyOf(
				LootCondition.matchBiome("#minecraft:is_savanna"),
				LootCondition.matchBiome("#minecraft:is_badlands")
			)
		)

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:cherry_furniture", true).withWeight("10")
			.matchAnyOf(
				LootCondition.matchBiome("#c:is_floral"),
				LootCondition.matchBiome("#cobblemon:is_cherry_blossom")
			)
		)

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:mangrove_furniture", true).withWeight("10")
			.matchBiome("#c:is_swamp"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:oak_furniture", true).withWeight("10")
			.matchBiome("#c:is_plains"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:birch_furniture", true).withWeight("10")
			.matchBiome("#c:is_plains"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:warped_furniture", true).withWeight("5")
			.matchBiome("#c:in_nether"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:crimson_furniture", true).withWeight("5")
			.matchBiome("#c:in_nether"))

		furniture_pool.addEntry(
			LootEntry.tag("handcrafted:crockery", true).withWeight("5")
			.matchDimension("minecraft:overworld")
			.matchStructure("#minecraft:village")
		)

		furniture_pool.addEntry(
			LootEntry.tag("handcrafted:cushions", true).withWeight("2")
			.matchDimension("minecraft:overworld")
			.matchStructure("#minecraft:village")
		)

		furniture_pool.addEntry(
			LootEntry.tag("handcrafted:pots", true).withWeight("2")
			.matchDimension("minecraft:overworld")
		)

		furniture_pool.addEntry(
			LootEntry.tag("handcrafted:trophies", true).withWeight("1")
			.matchDimension("minecraft:overworld")
		)

		furniture_pool.addEntry(LootEntry.empty().withWeight(50))

		event.forEachTable(/.*chest.*/, table => {
			// event.forEachTable(/supplementaries:loot\/galleon\/chest/, table => {
			// console.log(`${table.lootType} |\t\t ${table.location}`)
			if (table.lootType == "BLOCK") {
				return // Otherwise, Chests would drop furniture at random when destroyed.
			}
			table.createPool().rolls(1).addEntry(
				LootEntry.reference("kubejs:furniture")
				// .matchLocation({position: {y: Range.atLeast(50)}})
				.randomChance(0.5)
			)
		})
	}

})
