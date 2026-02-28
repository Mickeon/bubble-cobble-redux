// requires: create
// requires: biomesoplenty
// requires: farmersdelight
// requires: supplementaries

// DO NOT USE the { output: } filter unless Brewin' and Chewin' recipes are filtered out, because on a dedicated server the script fails with this:
// UnknownKubeRecipe.java#64: Error in 'ServerEvents.recipes': java.lang.NullPointerException:
// Cannot invoke "umpaz.brewinandchewin.common.BnCConfiguration$Common.keg()"
// because the return value of "house.greenhouse.greenhouseconfig.api.GreenhouseConfigHolder.get()" is null
// `/reload` "fixes" it but I'd rather not have to reload Datapacks every server reboot.
// event.remove({ output: "create:gearbox" }) // Big no-no, indeed.

const MINECRAFT_WOOD_TYPES = ["oak", "birch", "spruce", "jungle", "dark_oak", "acacia", "warped", "crimson", "mangrove", "cherry", "bamboo"]

ServerEvents.tags("item", event => {
	event.add("bubble_cobble:diamond_tools",
		"minecraft:diamond_sword", "minecraft:diamond_shovel", "minecraft:diamond_pickaxe",
		"minecraft:diamond_axe", "minecraft:diamond_hoe", "farmersdelight:diamond_knife",
		"constructionstick:diamond_stick", "yo_hooks:diamond_grappling_hook"
	)
	event.add("bubble_cobble:diamond_armor",
		"minecraft:diamond_helmet", "minecraft:diamond_chestplate",
		"minecraft:diamond_leggings", "minecraft:diamond_boots",
	)
	event.add("bubble_cobble:cattails", "biomesoplenty:cattail", "biomeswevegone:cattail_sprout")
})

ServerEvents.recipes(event => {
	/** @param {import("dev.latvian.mods.kubejs.recipe.filter.RecipeFilter").RecipeFilterObject} filter @param {number} new_count  */
	function change_result_count(filter, new_count) {
		event.forEachRecipe(filter, recipe => {
			const json = JSON.parse(recipe.json)
			const type_id = recipe.typeKey
			if (type_id == "minecraft:crafting_shaped") {
				json.result.count = new_count
			} else if (type_id == "create:sequenced_assembly") {
				json.results[0].count = new_count
			} else {
				console.warn(`Unsupported recipe type to change result's count for: ${type_id}`)
				return
			}
			event.custom(json).id(recipe.getId())
		})
	}

	console.log("Changing recipes in misc.js")
	// Lower overall cost of Gearbox.
	event.shapeless(Item.of("create:gearbox"), ["create:andesite_casing", Item.of("create:large_cogwheel", 2)]).id("create:crafting/kinetics/gearbox")

	// Recycle diamond tools & armor.
	event.recipes.create.crushing([
			CreateItem.of(Item.of("create:experience_nugget", 3)),
			CreateItem.of(Item.of( "create:experience_nugget", 1), 0.20),
			CreateItem.of(Item.of( "minecraft:diamond", 1), 0.1),
			CreateItem.of(Item.of( "minecraft:stick", 1), 0.1),
		],
		Ingredient.of("#bubble_cobble:diamond_tools"),
		10 * SEC
	)
	event.recipes.create.crushing([
			CreateItem.of(Item.of("create:experience_nugget", 4)),
			CreateItem.of(Item.of("create:experience_nugget", 2), 0.75),
			CreateItem.of(Item.of("minecraft:diamond", 1), 0.1),
		],
		Ingredient.of("#bubble_cobble:diamond_armor"),
		15 * SEC
	)

	// Make Precision Mechanisms and basically every other similar recipe guaranteed.
	// The loop is kinda redudant right now, as the only non-guaranteed recipe is the Precision Mechanism.
	// event.forEachRecipe({type: "create:sequenced_assembly"}, recipe => {
	event.forEachRecipe({id: "create:sequenced_assembly/precision_mechanism"}, recipe => {
		const json = JSON.parse(recipe.json)
		json.results = [json.results[0]]
		event.custom(json).id(recipe.getId())
	})

	// Remove Prismarine Crystals from Lapis haunting.
	// Add haunting Glowstone dust to Prismarine Shards.
	// event.remove({id: "create:haunting/lapis_recycling"})
	// event.recipes.create.haunting("minecraft:prismarine_shard", "minecraft:lapis_lazuli")
	// event.recipes.create.haunting("minecraft:prismarine_crystals", "minecraft:glowstone_dust")

	// Nether Rose Quartz (Biomes 'o Plenty) to Rose Quartz.
	// Nerf to be less immediate.
	event.recipes.create.sandpaper_polishing("create:polished_rose_quartz", "create:rose_quartz").id("create:sandpaper_polishing/rose_quartz")
	event.recipes.create.sandpaper_polishing("create:rose_quartz", "biomesoplenty:rose_quartz_chunk")
	event.recipes.create.crushing([
			CreateItem.of(Item.of("biomesoplenty:rose_quartz_chunk", 3)),
			CreateItem.of(Item.of("biomesoplenty:rose_quartz_chunk", 1), 0.5)
		],
		"biomesoplenty:rose_quartz_block"
	)

	// Sequenced assembly for Ability Patch.
	const incomplete_thing = "create:incomplete_precision_mechanism"
	event.recipes.create.sequenced_assembly([
			Item.of("cobblemon:ability_patch"),
		],
		Ingredient.of("farmersdelight:canvas"),
		[
			event.recipes.create.deploying(incomplete_thing, [incomplete_thing, "create:golden_sheet"]),
			event.recipes.create.deploying(incomplete_thing, [incomplete_thing, "minecraft:diamond_block"]),
			event.recipes.create.filling(incomplete_thing, [incomplete_thing, Fluid.sizedIngredientOf("#c:honey", 250)]),
			event.recipes.create.pressing(incomplete_thing, [incomplete_thing])
		]
	).transitionalItem(incomplete_thing).loops(1)

	// Add Cutting Board stripping recipes to modded logs.
	for (const wood_log of Ingredient.of("#minecraft:logs").and(/^((?!minecraft|stripped).)*(log|wood)/).itemIds) {
		let stripped_wood_log = wood_log.replace(":", ":stripped_")
		// event.recipes.farmersdelight.cutting([stripped_wood_log, "farmersdelight:tree_bark"], wood_log, { type: "farmersdelight:tool_action", action: "axe_strip" })
		// event.recipes.farmersdelight.cutting(wood_log, "#minecraft:axes", [stripped_wood_log, "farmersdelight:tree_bark"])
		// The above no longer exists some reason. We do it manually.
		if (!Item.exists(stripped_wood_log)) {
			continue
		}
		event.custom({
			type: "farmersdelight:cutting",
			ingredients: [{ item: wood_log }],
			result: [{ item: Item.of(stripped_wood_log)}, { item: Item.of( "farmersdelight:tree_bark")}],
			sound: { sound_id: "minecraft:item.axe.strip" },
			tool: { type: "farmersdelight:item_ability", action: "axe_strip" },
		}).id(`kubejs:${stripped_wood_log.replace(":", "/")}_from_cutting`)
	}

	// Make Ash easier to obtain. Note that fire does not destroy blocks in the modpack (due to Fire Spread Tweaks).
	event.smelting("supplementaries:ash", "minecraft:rotten_flesh")

	// Crush Auspicious Armor and Malicious Armor.
	event.recipes.create.crushing([
			CreateItem.of(Item.of( "minecraft:leather", 1)),
			CreateItem.of(Item.of( "minecraft:gold_nugget", 8)),
			CreateItem.of(Item.of( "create:brass_nugget", 8)),
			CreateItem.of(Item.of( "minecraft:ancient_debris", 1), 0.1)
		],
		"cobblemon:auspicious_armor"
	)
	event.recipes.create.crushing([
			CreateItem.of(Item.of("minecraft:string", 3)),
			CreateItem.of(Item.of( "minecraft:iron_nugget", 8)),
			CreateItem.of(Item.of( "minecraft:obsidian", 4)),
			CreateItem.of(Item.of( "minecraft:netherite_scrap", 1), 0.1)
		],
		"cobblemon:malicious_armor"
	)

	// Overpowered, due to Create Deco's Industrial Iron Ingots. Their recipe is costly,
	// but by crafting the Industrial Iron Block, it can be converted back into ingots, skipping the entire process.
	// event.remove({id: "create:industrial_iron_block_from_ingots_iron_stonecutting"})

	// Make Create Deco's industrial Iron compatible with Create: Dreams & Desires's.
	// We don't even have the mod anymore, but this is innocuous.
	event.replaceInput({mod: "createdeco"}, "createdeco:industrial_iron_nugget", "#c:nuggets/industrial_iron")
	event.replaceInput({mod: "createdeco"}, "createdeco:industrial_iron_ingot", "#c:ingots/industrial_iron")
	// event.replaceInput({mod: "createdeco"}, "create:industrial_iron_block", "#c:storage_blocks/industrial_iron")


	// Haunt all seafood for Zinc nuggets.
	event.recipes.create.haunting([
			CreateItem.of(Item.of("create:zinc_nugget", 3)),
			CreateItem.of(Item.of("create:zinc_nugget", 3), 0.75),
		],
		[Ingredient.of("#c:foods/raw_fish")]
	)

	// Make Candle Holders less expensive.
	event.forEachRecipe({mod: "supplementaries", id: /candle_holders/}, recipe => {
		const recipe_id = recipe.getId()
		if (recipe_id.endsWith("dye")) {
			return
		}
		const json = JSON.parse(recipe.json)
		json.pattern = [
			"ACA",
			" N "
		],
		json.key.A = Ingredient.of("minecraft:iron_nugget")

		event.custom(json).id(recipe_id)
	})

	// Backport Lodestone recipe from 25w02a (1.21.5).
	event.replaceInput({id: "minecraft:lodestone"}, "minecraft:netherite_ingot", "minecraft:iron_ingot")
	// Backport Saddle recipe from 25w20a (1.21.6).
	event.shaped("minecraft:saddle", [" L ", "LIL"], {L: "minecraft:leather", I: "minecraft:iron_ingot"})

	// Allow any rope to be used for Safety Net.
	event.replaceInput({id: "farmersdelight:safety_net"}, "farmersdelight:rope", "#c:ropes")

	// Make Straw (and Canvas) considerably more accessible.
	event.smoking("farmersdelight:straw", "supplementaries:flax")
	event.smoking("farmersdelight:straw_bale", "supplementaries:flax_block")
	event.shaped("farmersdelight:canvas", [
		" S ",
		"SWS",
		" S "
	], {
		S: "minecraft:string",
		W: "#minecraft:wool",
	})

	// Remove common Sack recipe with Flax, in favour of always needing Canvas. Also make that recipe slightly cheaper.
	event.remove({id: "supplementaries:sack"})
	event.shaped({id: "supplementaries:sack"}, [" S ", "C C", "CCC",], {S: "minecraft:string", C: "farmersdelight:canvas"}).id("supplementaries:sack_3")

	// Use Canvas for more.
	event.replaceInput({id: "create:crafting/appliances/clipboard"}, "minecraft:paper", "farmersdelight:canvas")
	event.replaceInput({id: "solonion:lunchbag"}, "minecraft:paper", "farmersdelight:canvas")
	event.replaceInput({id: "supplementaries:lunch_basket"}, "minecraft:bamboo", "farmersdelight:canvas")
	event.replaceInput({id: /^create:crafting.*filter$/}, "minecraft:white_wool", "farmersdelight:canvas")
	event.replaceInput({id: /^mega_showdown:tera_pouch/}, "minecraft:leather", "farmersdelight:canvas")
	// event.replaceInput({id: "minecraft:item_frame"}, "minecraft:leather", "farmersdelight:canvas") // Conflicts with alternative Painting recipe.
	event.remove({id: "minecraft:painting"}) // In favour of Farmer's Delight's which requires Canvas.
	event.remove({id: "immersive_paintings:painting"})
	event.shaped(Item.of("immersive_paintings:painting", 2), ["SDS","DCD", "SDS"], {S: "minecraft:stick", D: "#c:dyes", C: "farmersdelight:canvas"})
	event.shaped("minecraft:bundle", ["SS", "CC"], {S: "minecraft:string", C: "farmersdelight:canvas"})
	change_result_count({id: "immersive_paintings:graffiti"}, 4)

	// Double output for Train Tracks recipe.
	change_result_count({id: "create:sequenced_assembly/track"}, 2)

	// See https://modrinth.com/mod/create-copper-zinc.
	event.recipes.create.mixing(CreateItem.of("create:asurine"), [
		Item.of("minecraft:clay_ball", 3),
		Item.of("minecraft:flint", 1),
		Fluid.sizedIngredientOf("#minecraft:water", 250)
	])
	event.recipes.create.mixing(CreateItem.of("create:veridium"), [
		Item.of("minecraft:clay_ball", 3),
		Item.of("minecraft:flint", 1),
		Fluid.sizedIngredientOf("#minecraft:lava", 250)
	])

	// Allow all eggs to be fried.
	event.replaceInput({id: "farmersdelight:fried_egg", input: "minecraft:egg"}, "minecraft:egg", "#c:eggs")
	event.replaceInput({id: "farmersdelight:fried_egg_from_smoker", input: "minecraft:egg"}, "minecraft:egg", "#c:eggs")
	event.replaceInput({id: "farmersdelight:fried_egg_from_campfire_cooking", input: "minecraft:egg"}, "minecraft:egg", "#c:eggs")

	// Make Rails considerably cheaper. See also https://modrinth.com/datapack/rail-recipe-rebalance.
	event.replaceInput({id: "minecraft:rail" }, "minecraft:iron_ingot", "minecraft:iron_nugget")
	event.replaceInput({id: "minecraft:detector_rail" }, "minecraft:iron_ingot", "minecraft:iron_nugget")
	event.replaceInput({id: "minecraft:activator_rail" }, "minecraft:iron_ingot", "minecraft:iron_nugget")
	event.replaceInput({id: "minecraft:powered_rail" }, "minecraft:gold_ingot", "minecraft:gold_nugget")
	change_result_count({id: "minecraft:powered_rail" }, 8)

	// Merge Biomes o' Plenty and Biomes We've Gone's Cattail.
	event.replaceInput({input: "biomesoplenty:cattail"}, "biomesoplenty:cattail", "#bubble_cobble:cattails")
	event.replaceInput({input: "biomeswevegone:cattail_sprout"}, "biomeswevegone:cattail_sprout", "#bubble_cobble:cattails")

	// Remove Mega Showdown's recipes for these two. These recipes are too relatively cheap and boring.
	event.remove({id: "mega_showdown:ability_patch"})
	event.remove({id: "mega_showdown:ability_capsule"})

	// Make held item recipes more integrated.
	event.replaceInput({id: "cobblemon:binding_band"}, "minecraft:string", "#c:ropes")
	event.replaceInput({id: "cobblemon:luminous_moss"}, "minecraft:glow_berries", "mowziesmobs:glowing_jelly")

	// Waigee's request. Pale Oak Shelf from Jacaranda wood.
	event.shaped(Item.of("minecraft:pale_oak_shelf", 6), ["SSS", "   ", "SSS"], {S: "biomesoplenty:stripped_jacaranda_log"})

	// Use our own recipes for more reasonable hammers.
	event.remove({mod: "justhammers"})
	event.shaped(Item.of("justhammers:stone_hammer"), [" II", " SI", "S  "], {I: "minecraft:stone", S: "minecraft:stick"})
	event.shaped(Item.of("justhammers:stone_reinforced_hammer"), ["III", " SI", "S I"], {I: "minecraft:stone", S: "minecraft:stick"})
	event.shaped(Item.of("justhammers:iron_hammer"), [" II", " SI", "S  "], {I: "minecraft:iron_block", S: "minecraft:stick"})
	event.shaped(Item.of("justhammers:iron_reinforced_hammer"), ["III", " SI", "S I"], {I: "minecraft:iron_block", S: "minecraft:stick"})

	// New recipe for Gadgets Against Grind's Escape Rope.
	// event.remove({mod: "gag"})
	event.remove({id: "gag:escape_rope"})
	event.shapeless("gag:escape_rope", ["yo_hooks:iron_hook_head", Ingredient.of("#c:ropes").withCount(3)])

	// Recipes for normally-unobtainable Applin evolution items.
	event.shaped(Item.of("cobblemon:sweet_apple"), ["SSS", "SAS", "SSS"], {A: "minecraft:apple", S: "minecraft:sweet_berries"})
	event.shaped(Item.of("cobblemon:tart_apple"), ["SSS", "SAS", "SSS"], {A: "minecraft:apple", S: "biomeswevegone:blueberries"})
	event.shaped(Item.of("cobblemon:syrupy_apple"), ["SSS", "SAS", "SSS"], {A: "minecraft:apple", S: "minecraft:glow_berries"})
	event.shaped(Item.of("cobblemon:metal_alloy"), ["ZAZ", "ANA", "ZAZ"], {Z: "create:zinc_nugget", A: "create:andesite_alloy", N: "minecraft:netherite_scrap"})

	// Make Lanterns craftable with Zinc Nuggets, too.
	event.replaceInput({id: "minecraft:lantern"},  "minecraft:iron_nugget", ["minecraft:iron_nugget", "create:zinc_nugget"])

	// Crush Honeycomb Block to get a few Honeycombs.
	event.recipes.create.crushing([
			CreateItem.of(Item.of("minecraft:honeycomb", 2)),
			CreateItem.of(Item.of("minecraft:honeycomb", 1), 0.5),
			CreateItem.of(Item.of("minecraft:honeycomb", 1), 0.5)
		],
		"minecraft:honeycomb_block"
	)

	if (Platform.isLoaded("waterframes")) {
		event.remove({mod: "waterframes"})
		let copper_bulbs = Ingredient.of(/minecraft:.*copper_bulb/)
		event.shaped("waterframes:remote", ["ZCZ", "ZTZ", "BBB"], {Z: "createdeco:zinc_sheet", C: "minecraft:copper_block", T: "create:transmitter", B: "#minecraft:stone_buttons"})
		event.shaped("waterframes:frame", ["ZCZ", "STS", "ZRZ"], {Z: "createdeco:zinc_sheet", C: copper_bulbs, T: "minecraft:tinted_glass", S: "supplementaries:speaker_block", R: "waterframes:remote"})
		event.shaped("waterframes:projector", ["ZZA", "SCS", "ZRZ"], {Z: "create:zinc_block", C: copper_bulbs, A: "minecraft:amethyst_shard", S: "supplementaries:speaker_block", R: "waterframes:remote"})
		event.shaped("waterframes:tv", ["ZTZ", "SCS", "ZRZ"], {Z: "create:zinc_ingot", C: copper_bulbs, T: "minecraft:tinted_glass", S: "supplementaries:speaker_block", R: "waterframes:remote"})
		event.shaped("waterframes:big_tv", [" T ", "TRT", " T "], {T: "minecraft:tinted_glass", R: "waterframes:tv"})
		event.shapeless("waterframes:tv_box", [Ingredient.of("minecraft:note_block").or("create:cardboard_block"), "waterframes:frame"])
	}

	// All of the other types require differently colored torches, because Copper Torches didn't exist.
	event.replaceInput({id: /createdeco:green_.*lamp/}, "minecraft:glow_berries", "minecraft:copper_torch")

	event.shaped("mega_showdown:sparkling_stone_light", ["AAA", "ASA", "AAA"], {A: "minecraft:white_dye", S: "mega_showdown:sparkling_stone_dark"})
	event.shaped("mega_showdown:sparkling_stone_dark", ["AAA", "ASA", "AAA"], {A: "minecraft:black_dye", S: "mega_showdown:sparkling_stone_light"})

	event.recipes.create.compacting("minecraft:tuff", Ingredient.of("supplementaries:ash").withCount(8)).heated()

	// All any Crafting Table type to be used for recipes, not just vanilla.
	event.replaceInput({input: "minecraft:crafting_table"}, "minecraft:crafting_table", "#c:player_workstations/crafting_tables")
	event.replaceInput({id: "minecraft:lectern"}, "minecraft:bookshelf", "#c:bookshelves")

	// Part of the "Candle rebalancing act".
	event.remove({id: "biomeswevegone:white_sand"}) // This recipe uses dye, which is somewhat gamebreaking for what we're going to do with this item.
	event.recipes.create.milling(CreateItem.of(Item.of("biomeswevegone:white_sand")), Ingredient.of("minecraft:calcite"), 10 * SEC)
	event.recipes.create.splashing([
			CreateItem.of(Item.of("create:zinc_nugget"), 0.12),
			CreateItem.of(Item.of("biomesoplenty:dead_branch"), 0.05)
		],
		Ingredient.of("biomeswevegone:white_sand").or("biomesoplenty:white_sand")
	)
	event.recipes.create.milling(CreateItem.of(Item.of("biomesoplenty:orange_sand")), Ingredient.of("arts_and_crafts:gypsum"), 10 * SEC)
	event.recipes.create.splashing([
			CreateItem.of(Item.of("minecraft:copper_nugget"), 0.12),
			CreateItem.of(Item.of("biomesoplenty:dead_branch"), 0.05)
		],
		Ingredient.of("biomesoplenty:orange_sand")
	)
	event.recipes.create.milling(CreateItem.of(Item.of("biomesoplenty:black_sand")), Ingredient.of("minecraft:blackstone"), 10 * SEC)
	event.recipes.create.splashing([
			CreateItem.of(Item.of("minecraft:gold_nugget"), 0.12),
			CreateItem.of(Item.of("biomesoplenty:dead_branch"), 0.05)
		],
		Ingredient.of("biomesoplenty:black_sand")
	)

	if (Platform.isLoaded("immersive_furniture")) {
		event.replaceInput({id: "immersive_furniture:crafting_material"}, "minecraft:iron_ingot", "create:zinc_ingot")
	}

	if (Platform.isLoaded("urban_decor")) {
		event.replaceInput({id: "urban_decor:chromite"}, "urban_decor:stainless_steel_nugget", "minecraft:iron_nugget")
		event.replaceInput({id: "urban_decor:chromite"}, "minecraft:andesite", Ingredient.of("minecraft:prismarine").or("create:veridium").or("create:asurine"))
	}

	// Require a Slingshot for Cannon, and require Cannon for Schematicannon.
	event.remove({id: "supplementaries:cannon"})
	event.shaped("create:schematicannon", [" I ", "LCL", "SSS"], {I: "minecraft:iron_block", L: "#minecraft:logs", S: "minecraft:smooth_stone", C: "supplementaries:cannon"}).id("create:crafting/schematics/schematicannon")

	// Require Iron Ingots and Iron Ball for Cannon Balls? Makes them notably cheaper, too.
	event.shaped(Item.of("supplementaries:cannonball", 4), [" I ", "IBI", " I "], {I: "minecraft:iron_ingot", B: "cobblemon:iron_ball"}).id("supplementaries:cannonball")

	// Flourescent Cattail into Glowstone.
	event.recipes.create.milling(CreateItem.of(Item.of("minecraft:glowstone_dust"), 0.75), Ingredient.of("biomeswevegone:fluorescent_cattail_sprout"), 10 * SEC)

	// Luminous Jelly from Glowberries and and berries.
	event.recipes.create.mixing(CreateItem.of(Item.of("mowziesmobs:glowing_jelly")), [Ingredient.of("minecraft:glow_berries"), Ingredient.of("#c:foods/berry").except("minecraft:glow_berries"), Ingredient.of("minecraft:sugar")]).heated()

	// Soap also craftable from Bleachdew, which is more convenient.
	event.shapeless(Item.of("supplementaries:soap", 6), [Ingredient.of("minecraft:water_bucket"), Ingredient.of("arts_and_crafts:bleachdew", 3)])
	event.recipes.create.mixing(CreateItem.of(Item.of("supplementaries:soap", 6)), [Fluid.sizedIngredientOf("#c:water", 500), Ingredient.of("arts_and_crafts:bleachdew", 3)])

	// Just kinda makes sense.
	event.remove({id: "handcrafted:berry_jam_jar"})
	event.shapeless(Item.of("handcrafted:berry_jam_jar"), Ingredient.of("brewinandchewin:sweet_berry_jam"))
	event.shapeless(Item.of("brewinandchewin:sweet_berry_jam"), Ingredient.of("handcrafted:berry_jam_jar"))

	// TODO: Add recipes for (this modpack's) Pale Jacaranda and Redder Wood.
	// event.shaped("biomesoplenty:stripped_jacaranda_log", ["DAD", "ADA", "DAD"], {D: "minecraft:white_dye", A: "biomeswevegone:stripped_jacaranda_log"})
	// event.shaped("biomesoplenty:stripped_redwood_log", ["DAD", "ADA", "DAD"], {D: "minecraft:red_dye", A: "biomeswevegone:stripped_redwood_log"})

	// TODO: Add recipes for all Music Discs whose method of obtaining them is genuinely obtuse.
	// event.shaped("minecraft:music_disc_blocks", ["DAD", "AMA", "DAD"], {M: "minecraft:music_disc_13", A: "minecraft:copper_ingot", D: "create:sturdy_sheet"})

	// Cooking recipe schema test.
	// event.recipes.farmersdelight.cooking("kubejs:blue_mascot_cat", ["cobblemon:red_apricorn", "cobblemon:blue_apricorn"], "minecraft:bowl")
})

