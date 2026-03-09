// requires: lootjs

const GENERAL_FURNITURE = Ingredient.of("@handcrafted").except(/trim/)
		.or("#farmersdelight:cabinets")
		.or("#minecraft:wooden_shelves")
		.or("@shutterup")
		.or(/urban_decor:.*(box|calendar|piano|grandfather_clock)/)
		.or(/create:.*window/)

ServerEvents.tags("item", event => {
	for (const wood_type of ["oak", "birch", "spruce", "jungle", "dark_oak", "bamboo", "acacia", "cherry", "mangrove", "warped", "crimson"]) {
		event.add(
			`bubble_cobble:${wood_type}_furniture`,
			GENERAL_FURNITURE.and(RegExp(`.*:${wood_type}.*`)).itemIds
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
			.addEntry(LootEntry.of("gag:escape_rope").withWeight(10).setCount([1, 2]))
			.addEntry(LootEntry.of("cobblemon:ancient_gigaton_ball").withWeight(7).setCount([3, 4]))
			.addEntry(LootEntry.tag("simpletms:type_ground_tr", true).withWeight(5))
			.addEntry(LootEntry.of("kubejs:doublemint_gum").withWeight(1).setCount([1, 2]))

		event.getLootTable("supplementaries:loot/urn_loot/epic").firstPool()
			.addEntry(LootEntry.of("minersdelight:nutritional_bar").withWeight(10).setCount([2, 6]))
			.addEntry(LootEntry.tag("simpletms:type_ground_tm", true).withWeight(10))
			.addEntry(LootEntry.of("simpletms:tm_blank").withWeight(2))
			.addEntry(LootEntry.of("cobblemon:ability_patch").withWeight(2))
	}

	// Make Sniffers more accessible in a multiplayer setting.
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
			LootEntry.tag("bubble_cobble:spruce_furniture", true).withWeight(10)
			.matchBiome("#minecraft:is_taiga"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:bamboo_furniture", true).withWeight(10)
			.matchBiome("#minecraft:is_jungle"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:jungle_furniture", true).withWeight(10)
			.matchBiome("#minecraft:is_jungle"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:dark_oak_furniture", true).withWeight(10)
			.matchBiome("#c:is_dark_forest"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:acacia_furniture", true).withWeight(10)
			.matchAnyOf(
				LootCondition.matchBiome("#minecraft:is_savanna"),
				LootCondition.matchBiome("#minecraft:is_badlands")
			)
		)

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:cherry_furniture", true).withWeight(10)
			.matchAnyOf(
				LootCondition.matchBiome("#c:is_floral"),
				LootCondition.matchBiome("#cobblemon:is_cherry_blossom")
			)
		)

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:mangrove_furniture", true).withWeight(10)
			.matchBiome("#c:is_swamp"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:oak_furniture", true).withWeight(2)
			.matchBiome("#c:is_plains"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:birch_furniture", true).withWeight(2)
			.matchBiome("#c:is_plains"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:warped_furniture", true).withWeight(5)
			.matchBiome("#c:in_nether"))

		furniture_pool.addEntry(
			LootEntry.tag("bubble_cobble:crimson_furniture", true).withWeight(5)
			.matchBiome("#c:in_nether"))

		furniture_pool.addEntry(
			LootEntry.tag("handcrafted:crockery", true).withWeight(10)
			.matchDimension("minecraft:overworld")
			.matchStructure("#minecraft:village")
		)

		furniture_pool.addEntry(
			LootEntry.tag("handcrafted:cushions", true).withWeight(5)
			.matchDimension("minecraft:overworld")
			.matchStructure("#minecraft:village")
		)

		furniture_pool.addEntry(
			LootEntry.tag("urban_decor:has_toolbox_variants", true).withWeight(10)
			.matchDimension("minecraft:overworld")
		)
		furniture_pool.addEntry(
			LootEntry.tag("bits_n_bobs:chairs", true).withWeight(5)
			.matchDimension("minecraft:overworld")
		)
		furniture_pool.addEntry(
			LootEntry.tag("handcrafted:pots", true).withWeight(2)
			.matchDimension("minecraft:overworld")
		)

		furniture_pool.addEntry(
			LootEntry.tag("handcrafted:trophies", true).withWeight(1)
			.matchDimension("minecraft:overworld")
		)
		furniture_pool.addEntry(
			LootEntry.ofIngredient(/tatami/)
			.matchDimension("minecraft:overworld")
		)

		furniture_pool.addEntry(LootEntry.empty().withWeight(200))

		event.forEachTable(/.*chest.*/, table => {
			// event.forEachTable(/supplementaries:loot\/galleon\/chest/, table => {
			// console.log(`${table.lootType} |\t\t ${table.location}`)
			if (table.lootType == "BLOCK") {
				return // Otherwise, Chests would drop furniture at random when destroyed.
			}
			table.createPool().rolls(1).bonusRolls(1).addEntry(
				LootEntry.reference("kubejs:furniture")
					.matchLocation({position: {y: Range.atLeast(50)}})
					.randomChance(0.1)
			)
		})
	}

	// Doohickey time. Arbitary mod check, I just want something to fold.
	if (Platform.isLoaded("supplementaries")) {
		/** @param {Special.ItemTag} tag  */
		let loot_table_from_tag = function(tag) {
			const name = "kubejs:doohickey/" + tag.replace(":", "/")
			event.create(name, "chest").createPool().addEntry(LootEntry.tag(tag, true))
			return LootEntry.reference(name)
		}

		let doohickey_table = event.create("kubejs:doohickey", "chest")
		let doohickey_pool = doohickey_table.createPool()

		doohickey_pool.addEntry(
			LootEntry.group([
				LootEntry.of("bits_n_bobs:headlamp").withWeight(10).setCount([1, 2]),
				LootEntry.of("bits_n_bobs:lightbulb").withWeight(8).setCount([1, 3]),
				LootEntry.of("supplementaries:redstone_illuminator").withWeight(6).setCount([1, 2]),
				loot_table_from_tag("supplementaries:candle_holders").withWeight(6).setCount([1, 3]),
				LootEntry.of("supplementaries:crystal_display").withWeight(4).setCount([1, 3]),
				LootEntry.of("create:nixie_tube").withWeight(3).setCount([2, 4]),
				LootEntry.of("bits_n_bobs:nixie_board").withWeight(3).setCount([2, 4]).limitCount(2, 4),
				LootEntry.of("bits_n_bobs:large_nixie_tube").withWeight(3).setCount([2, 4]),
				LootEntry.of("create:rose_quartz_lamp").withWeight(2).setCount([1, 3]),
				loot_table_from_tag("bubble_cobble:lanterns").withWeight(2).setCount([1, 4]),
				loot_table_from_tag("snowyspirit:glow_lights").withWeight(2).setCount([2, 4]),
				LootEntry.of("bits_n_bobs:brass_lamp").withWeight(1),
			])
		)
		let flute_names = [
			"Amongus Drip", "Cara Mia Addio", "Carol", "Despacito",	"Fallen Kingdom",
			"Lava Chicken", "Megalovania", "Shooting Stars", "Sweden",
			"Revenge", "Revenge Full", "Wet Hands",
		]

		event.create("kubejs:doohickey/flutes", "chest").createPool().addEntry(
			LootEntry.group(flute_names.map(
				name => LootEntry.ofItem("supplementaries:flute").setName(name)
			))
		)

		doohickey_pool.addEntry(
			LootEntry.group([
				LootEntry.of("supplementaries:cog_block").withWeight(20).setCount([1, 3]),
				loot_table_from_tag("supplementaries:awnings").withWeight(20).setCount([1, 3]),
				loot_table_from_tag("supplementaries:buntings").withWeight(20).setCount([2, 4]),
				LootEntry.of("brewinandchewin:coaster").withWeight(20).setCount([1, 3]),
				LootEntry.of("supplementaries:soap").withWeight(10).setCount([1, 3]),
				LootEntry.of("supplementaries:bamboo_spikes").withWeight(10).setCount([2, 4]),
				LootEntry.of("supplementaries:turn_table").withWeight(10).setCount([1, 2]),
				LootEntry.of("supplementaries:crank").withWeight(10).setCount([1, 2]),
				LootEntry.of("supplementaries:bubble_blower").withWeight(8),
				LootEntry.reference("kubejs:doohickey/flutes").withWeight(8),
				loot_table_from_tag("arts_and_crafts:chalk_sticks").withWeight(8).setCount([1, 2]),
				loot_table_from_tag("arts_and_crafts:paintbrushes").withWeight(8),
				LootEntry.of("supplementaries:jar").withWeight(6),
				LootEntry.of("supplementaries:spring_launcher").withWeight(6).setCount([1, 2]),
				LootEntry.of("supplementaries:bellows").withWeight(6).setCount([1, 3]),
				LootEntry.of("supplementaries:timber_frame").withWeight(6).setCount([1, 4]),
				LootEntry.of("supplementaries:timber_brace").withWeight(6).setCount([1, 4]),
				LootEntry.of("supplementaries:timber_cross_brace").withWeight(6).setCount([1, 4]),
				LootEntry.of("supplementaries:relayer").withWeight(4).setCount([2, 6]),
				LootEntry.of("supplementaries:faucet").withWeight(4).setCount([1, 2]),
				LootEntry.of("supplementaries:doormat").withWeight(4).setCount([1, 2]),
				LootEntry.of("supplementaries:hourglass").withWeight(4),
				LootEntry.of("supplementaries:clock_block").withWeight(4),
				LootEntry.of("supplementaries:pulley_block").withWeight(4),
				LootEntry.of("supplementaries:goblet").withWeight(4),
				LootEntry.of("supplementaries:altimeter").withWeight(4),
				loot_table_from_tag("supplementaries:presents").withWeight(4).setCount([1, 2]),
				loot_table_from_tag("arts_and_crafts:decorated_pots").withWeight(4),
				LootEntry.of("supplementaries:slingshot").withWeight(2),
				LootEntry.of("immersive_paintings:graffiti").withWeight(2).setCount([1, 2]),
				LootEntry.of("immersive_paintings:glow_graffiti").withWeight(2).setCount([1, 2]),
				LootEntry.of("supplementaries:cannon").withWeight(1),
			])
		)

		doohickey_pool.addEntry(
			LootEntry.group([
				LootEntry.of("create:hand_crank").withWeight(10).setCount([1, 2]),
				loot_table_from_tag("create:dyed_table_cloths").withWeight(10).setCount([2, 4]),
				loot_table_from_tag("create:valve_handles").withWeight(6),
				LootEntry.of("create:desk_bell").withWeight(6),
				LootEntry.of("create:placard").withWeight(4),
				loot_table_from_tag("create:postboxes").withWeight(4).setCount([1, 2]),
				loot_table_from_tag("create:toolboxes").withWeight(2),
				LootEntry.of("copycats:copycat_light_weighted_pressure_plate").withWeight(2),
				LootEntry.of("copycats:copycat_heavy_weighted_pressure_plate").withWeight(2),
				LootEntry.of("create:peculiar_bell").withWeight(1),
			])
		)

		event.forEachTable(/.*chest.*/, table => {
			if (table.lootType == "BLOCK") {
				return
			}

			table.firstPool().addEntry(LootEntry.reference("kubejs:doohickey").withWeight(10).randomChance(0.2))
			table.createPool().rolls([2, 5]).bonusRolls(3).addEntry(
				LootEntry.reference("kubejs:doohickey").withWeight(1)
			).addEntry(
				LootEntry.empty().withWeight(6)
			)
		})

		event.getLootTable("minecraft:gameplay/fishing/junk").firstPool().addEntry(
			LootEntry.reference("kubejs:doohickey")
				.applyEnchantmentBonus([1, 2])
				.randomChance(0.1)
		)
	}

	// Let Headhunter work with Wither Skeletons.
	if (Platform.isLoaded("cnc")) {
		event.getEntityTable("minecraft:wither_skeleton").createPool()
			.when(c => c.killedByPlayer() && c.randomChanceWithEnchantment("cnc:headhunter", [0.0, 0.15]))
			.addEntry("minecraft:wither_skeleton_skull")
	}

	// This block normally requires Vanilla Backport to be dropped.
	if (Item.exists("minecraft:pale_oak_shelf")) {
		event.create("minecraft:blocks/pale_oak_shelf", "block").createPool().when(c => c.survivesExplosion()).addEntry("minecraft:pale_oak_shelf")
	}

	// Make these flowers accessible in existing worlds (although right now this is merely a workaround).
	if (Platform.isLoaded("urban_decor")) {
		event.getLootTable("minecraft:gameplay/sniffer_digging").firstPool().addEntry(LootEntry.tag("urban_decor:polyanthous", true))
	}

	// let log = (table) => {
	// 	if (table.lootType == LootType.CHEST) {
	// 		console.log(table.location)
	// 	}
	// }
	// console.log("What")
	// event.forEachTable(/.*[\w]+:chests\/[\w_\/]*(nether|infern|hell|chasm|lava|magma|m[eo]lt|fire|flame|blaze|ember|pyre)[\w_\/].*/, log)
	// event.forEachTable("minecraft:chests/ruined_portal", log)

	// console.log(Ingredient.of("#bits_n_bobs:chairs").getItemIds().toArray())
})

// The crap we have to go through to show Farmer's Delight's loot modifiers.
// TODO: Can it even be an ounce of automatable? I currently have to do a lot of copy-pasting and manual work here.
// Perhaps if I play my cards right, that won't be necessary.
ServerEvents.generateData("last", event => {
	function straw_harvesting(block, properties, chance) {
		const conditions = [
			{
				condition: "minecraft:match_tool",
				predicate: {
					items: "#farmersdelight:straw_harvesters"
				}
			}
		]
		if (properties) {
			conditions.push({
				condition: "minecraft:block_state_property",
				block: block,
				properties: properties
			})
		}
		if (chance) {
			conditions.push({
				condition: "minecraft:random_chance",
				chance: chance
			})
		}

		event.json(`${ID.namespace(block)}:direct_drops/blocks/${ID.path(block)}`, {
			type: "minecraft:block",
			pools: [{
				rolls: 1,
				conditions: conditions,
				entries: [{
					type: "minecraft:item",
					name: "farmersdelight:straw"
				}],
			}]
		})
	}

	straw_harvesting("minecraft:short_grass", null, 0.2)
	straw_harvesting("minecraft:tall_grass", null, 0.2)
	straw_harvesting("farmersdelight:sandy_shrub", null, 0.3)
	straw_harvesting("farmersdelight:rice_panicles", {age: "3"})
	straw_harvesting("minecraft:wheat", {age: "7"})

	function pastry_slicing(block, item, count) {
		event.json(`${ID.namespace(block)}:direct_drops/blocks/${ID.path(block)}`, {
			type: "minecraft:block",
			pools: [{
				rolls: 1,
				conditions: [{
					condition: "minecraft:match_tool",
					predicate: {
						items: "#farmersdelight:tools/knives"
					}
				}],
				entries: [{
					type: "minecraft:item",
					name: item,
					functions: [{
						function: "minecraft:set_count",
						count: count,
					}],
				}],
			}]
		})
	}

	// TODO: For each type of Candle Cake. See RegEx stuff in https://github.com/fzzyhmstrs/EMI_loot/wiki/Direct-Drops.
	pastry_slicing("minecraft:cake", "farmersdelight:cake_slice", 7)
	pastry_slicing("minecraft:candle_cake", "farmersdelight:cake_slice", 7)
	pastry_slicing("farmersdelight:chocolate_pie", "farmersdelight:chocolate_pie_slice", 4)
	pastry_slicing("farmersdelight:apple_pie", "farmersdelight:apple_pie_slice", 4)
	pastry_slicing("farmersdelight:sweet_berry_cheesecake", "farmersdelight:sweet_berry_cheesecake_slice", 4)

	function scavenging_meat(entity, item, chance_based) {
		const conditions = [{
			condition: "minecraft:match_tool",
			predicate: {
				items: "#farmersdelight:tools/knives"
			}
		}]
		if (chance_based) {
			conditions = {
				condition: "minecraft:random_chance_with_enchanted_bonus",
				enchantment: "minecraft:looting",
				unenchanted_chance: 0.5,
				enchanted_chance: {
					type: "minecraft:linear",
					base: 0.6,
					per_level_above_first: 0.1
				}
			}
		}

		event.json(`${ID.namespace(entity)}:direct_drops/entities/${ID.path(entity)}`, {
			type: "minecraft:entity",
			pools: [{
				rolls: 1,
				conditions: conditions,
				entries: [{
					type: "minecraft:item",
					name: item,
					functions: [{
						conditions: [{
							condition: "minecraft:entity_properties",
							entity: "this",
							predicate: {
								flags: {
									is_on_fire: true
								}
							}
						}],
						function: "minecraft:furnace_smelt"
					}]
				}],
			}]
		})
	}

	// Rather rudimentary.
	scavenging_meat("minecraft:pig", "farmersdelight:ham", true)
	scavenging_meat("minecraft:hoglin", "farmersdelight:ham")
})