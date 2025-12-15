// priority: 5
// requires: create
// requires: biomesoplenty
// requires: farmersdelight
// Lower priority means this script loads first!

const MINECRAFT_WOOD_TYPES = ["oak", "birch", "spruce", "jungle", "dark_oak", "acacia", "warped", "crimson", "mangrove", "cherry", "bamboo"]

ServerEvents.tags("item", event => {
	event.add("sophisticatedbackpacks:upgrades", /^sophisticatedbackpacks:.*_(upgrade|downgrade)/)

	event.add("kubejs:diamond_tools",
		"minecraft:diamond_sword", "minecraft:diamond_shovel", "minecraft:diamond_pickaxe",
		"minecraft:diamond_axe", "minecraft:diamond_hoe", "farmersdelight:diamond_knife",
	)
	event.add("kubejs:diamond_armor",
		"minecraft:diamond_helmet", "minecraft:diamond_chestplate",
		"minecraft:diamond_leggings", "minecraft:diamond_boots",
	)
})

ServerEvents.recipes(event => {
	// Lower overall cost of Gearbox.
	event.remove({ output: "create:gearbox" })
	event.shapeless(Item.of("create:gearbox"), ["create:andesite_casing", "2x create:large_cogwheel"])

	// Turn TRs into blank TRs with Soap.
	// event.custom({
	// 	type: "minecraft:crafting_shapeless",
	// 	ingredients: [
	// 		{ item: "wherearemytms:blank_hm" },
	// 		{ item: "supplementaries:soap" }
	// 	],
	// 	result: { item: "wherearemytms:blank_hm", count: 1 },
	// 	conditions: [
	// 		{ type: "supplementaries:flag", flag: "soap" },
	// 		{ type: "c:mod_loaded", modid: "wherearemytms" }
	// 	]
	// })

	// Recycle diamond tools & armor.
	event.recipes.create.crushing([
			CreateItem.of("3x " + "create:experience_nugget"),
			CreateItem.of("1x " + "create:experience_nugget", 0.20),
			CreateItem.of("1x " + "minecraft:diamond", 0.1),
			CreateItem.of("1x " + "minecraft:stick", 0.1),
		],
		Ingredient.of("#kubejs:diamond_tools"),
		10 * 20
	)
	event.recipes.create.crushing([
			CreateItem.of("4x " +"create:experience_nugget"),
			CreateItem.of("2x " +"create:experience_nugget", 0.75),
			CreateItem.of("1x " + "minecraft:diamond", 0.1),
		],
		Ingredient.of("#kubejs:diamond_armor"),
		15 * 20
	)

	// Make Precision Mechanisms and basically every other similar recipe guaranteed.
	// event.forEachRecipe({type: "create:sequenced_assembly"}, /** @param {import("com.simibubi.create.content.processing.sequenced.SequencedAssemblyRecipe").$SequencedAssemblyRecipe$$Type} recipe */ recipe => {
	// 	if (recipe.hasOutput(Ingredient.all) && recipe.outputValues().length >= 2) {
	// 		recipe.results([recipe.getOriginalRecipeResult()])
	// 	}
	// })

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
			CreateItem.of("3x " + "biomesoplenty:rose_quartz_chunk"),
			CreateItem.of("1x " + "biomesoplenty:rose_quartz_chunk", 0.5)
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
			CreateItem.of("1x " + "minecraft:leather"),
			CreateItem.of("8x " + "minecraft:gold_nugget"),
			CreateItem.of("8x " + "create:brass_nugget"),
			CreateItem.of("1x " + "minecraft:ancient_debris", 0.1)
		],
		"cobblemon:auspicious_armor"
	)
	event.recipes.create.crushing([
			CreateItem.of("3x " +"minecraft:string"),
			CreateItem.of("8x " + "minecraft:iron_nugget"),
			CreateItem.of("4x " + "minecraft:obsidian"),
			CreateItem.of("1x " + "minecraft:netherite_scrap", 0.1)
		],
		"cobblemon:malicious_armor"
	)

	// Overpowered, due to Create Deco's Industrial Iron Ingots. Their recipe is costly,
	// but by crafting the Industrial Iron Block, it can be converted back into ingots, skipping the entire process.
	// event.remove({id: "create:industrial_iron_block_from_ingots_iron_stonecutting"})

	// Recycle Blank TM.
	// event.recipes.create.crushing([
	// 		Item.of("minecraft:copper_ingot", 2),
	// 		Item.of("minecraft:copper_ingot", 2).withChance(0.75),
	// 		Item.of("minecraft:diamond").withChance(0.1),
	// 	],
	// 	Ingredient.of("wherearemytms:blank_tm"),
	// 	10 * 20
	// )

	// Make Create Deco's industrial Iron compatible with Create: Dreams & Desires's.
	// Dreams & Desires removed Industrial Iron, and we don't even have the mod, but this is innocuous.
	event.replaceInput({mod: "createdeco"}, "createdeco:industrial_iron_nugget", "#c:nuggets/industrial_iron")
	event.replaceInput({mod: "createdeco"}, "createdeco:industrial_iron_ingot", "#c:ingots/industrial_iron")
	// event.replaceInput({mod: "createdeco"}, "create:industrial_iron_block", "#c:storage_blocks/industrial_iron")


	// Haunt all seafood for Zinc nuggets.
	event.recipes.create.haunting([
			CreateItem.of("3x " + "create:zinc_nugget"),
			CreateItem.of("3x " + "create:zinc_nugget", 0.75),
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

	// Remove common Sack recipe with Flax, in favour of always needing Canvas.
	event.remove({id: "supplementaries:sack"})

	// Use Canvas for more.
	event.replaceInput({id: "create:crafting/appliances/clipboard"}, "minecraft:paper", "farmersdelight:canvas")

	// Double output for Train Tracks recipe.
	event.forEachRecipe({id: "create:sequenced_assembly/track"}, recipe => {
		const json = JSON.parse(recipe.json)
		json.results[0].count = 2
		event.custom(json).id(recipe.getId())
	})

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

	// Make Rails considerably cheaper. See also https://modrinth.com/datapack/rail-recipe-rebalance
	event.replaceInput({id: "minecraft:rail" }, "minecraft:iron_ingot", "minecraft:iron_nugget")
	event.replaceInput({id: "minecraft:detector_rail" }, "minecraft:iron_ingot", "minecraft:iron_nugget")
	event.replaceOutput({id: "minecraft:detector_rail" }, "*", Item.of("minecraft:detector_rail", 6) )
	event.replaceInput({id: "minecraft:activator_rail" }, "minecraft:iron_ingot", "minecraft:iron_nugget")
	event.replaceOutput({id: "minecraft:activator_rail" }, "*", Item.of("minecraft:activator_rail", 6) )
	event.replaceInput({id: "minecraft:powered_rail" }, "minecraft:gold_ingot", "minecraft:gold_nugget")
	event.replaceOutput({id: "minecraft:powered_rail" }, "*", Item.of("minecraft:powered_rail", 8) )

	// TODO: Add recipes for Bottle Caps. They should be VERY costly.
})

