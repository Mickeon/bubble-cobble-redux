// requires: sophisticatedstorage
// requires: sophisticatedbackpacks
// requires: create
// requires: farmersdelight
// requires: supplementaries

ServerEvents.recipes(event => {
	// Make Storage Controller, Link, and IO considerably more expensive.
	event.replaceInput({id: "sophisticatedstorage:controller" }, "minecraft:stone", "minecraft:andesite" )
	event.replaceInput({id: "sophisticatedstorage:controller" }, "minecraft:oak_planks", "create:zinc_block" )
	event.replaceInput({id: "sophisticatedstorage:storage_link" }, "minecraft:stone", "minecraft:andesite" )
	event.replaceInput({id: /sophisticatedstorage:storage_(i|o|io)/  }, "minecraft:stone", "minecraft:andesite" )
	event.replaceInput({id: /sophisticatedstorage:storage_(i|o|io)/  }, "minecraft:oak_planks", "create:zinc_block" )
	event.replaceInput({id: /sophisticatedstorage:storage_(i|o|io)/ }, "minecraft:gold_ingot", "minecraft:diamond" )

	// Make Basic Tier Upgrade require Zinc nuggets.
	event.shaped("sophisticatedstorage:basic_tier_upgrade", [
		"ZSZ",
		"SRS",
		"ZSZ",
	], {
		Z: "create:zinc_nugget",
		S: "minecraft:stick",
		R: "minecraft:redstone_torch",
	}).id("sophisticatedstorage:basic_tier_upgrade")

	// Require Basic Tier Upgrade for all storage, instead of Lever.
	event.replaceInput({mod: "sophisticatedstorage"}, "minecraft:lever", "sophisticatedstorage:basic_tier_upgrade")
	// Replacing doesn't work here with the usual function. We do it manually.
	event.forEachRecipe({type: "sophisticatedstorage:generic_wood_storage"}, recipe => {
		const json = JSON.parse(recipe.json)
		json.key.L = Ingredient.of("sophisticatedstorage:basic_tier_upgrade")
		event.custom(json).id(recipe.getId())
	})
	event.forEachRecipe({type: "sophisticatedstorage:shulker_box_from_vanilla_shapeless"}, recipe => {
		const json = JSON.parse(recipe.json)
		json.ingredients[1] = Ingredient.of("sophisticatedstorage:basic_tier_upgrade")
		event.custom(json).id(recipe.getId())
	})

	// Require Straw for Packing Tape, instead of Paper.
	event.replaceInput({id: "sophisticatedstorage:packing_tape"}, "minecraft:paper", "farmersdelight:canvas")

	// Require Sack for Backpack, instead of any chest.
	// Replacing doesn't work here with the usual function. We do it manually.
	event.forEachRecipe({id: "sophisticatedbackpacks:backpack"}, recipe => {
		const json = JSON.parse(recipe.json)
		json.key.C = Ingredient.of("supplementaries:sack")
		event.custom(json).id(recipe.getId())
	})

	// Require more interesting stuff for all Backpack tiers.
	event.forEachRecipe({id: "sophisticatedbackpacks:copper_backpack"}, recipe => {
		const json = JSON.parse(recipe.json)
		json.pattern = [
			"ACA",
			"CBC",
			"ACA",
		]
		json.key = {
			A: Ingredient.of("#cobblemon:apricorns").or("supplementaries:bomb"),
			C: Ingredient.of("minecraft:copper_ingot"),
			B: Ingredient.of("sophisticatedbackpacks:backpack"),
		}
		event.custom(json).id(recipe.getId())
	})

	// In particular, require Copper Backpack for Iron Backpack upgrade.
	event.remove({id: "sophisticatedbackpacks:iron_backpack_from_copper"})
	event.forEachRecipe({id: "sophisticatedbackpacks:iron_backpack"}, recipe => {
		const json = JSON.parse(recipe.json)
		json.pattern = [
			"ZIZ",
			"IBI",
			"ZIZ",
		]
		json.key = {
			Z: Ingredient.of("create:zinc_ingot"),
			I: Ingredient.of("minecraft:iron_ingot"),
			B: Ingredient.of("sophisticatedbackpacks:copper_backpack"),
		}
		event.custom(json).id(recipe.getId())
	})

	event.forEachRecipe({id: "sophisticatedbackpacks:gold_backpack"}, recipe => {
		const json = JSON.parse(recipe.json)
		json.pattern = [
			"CGE",
			"GBG",
			"EGC",
		]
		json.key = {
			C: Ingredient.of("#cobblemon:gilded_chests"),
			E: Ingredient.of("#cobblemon:evolution_stones"),
			G: Ingredient.of("create:golden_sheet"),
			B: Ingredient.of("sophisticatedbackpacks:iron_backpack"),
		}
		event.custom(json).id(recipe.getId())
	})

	event.forEachRecipe({id: "sophisticatedbackpacks:diamond_backpack"}, recipe => {
		const json = JSON.parse(recipe.json)
		json.pattern = [
			"TDS",
			"DBD",
			"SDT",
		]
		json.key = {
			T: Ingredient.of("#cobblemon:tumblestones"),
			S: Ingredient.of("create:sturdy_sheet"),
			D: Ingredient.of("minecraft:diamond"),
			B: Ingredient.of("sophisticatedbackpacks:gold_backpack"),
		}
		event.custom(json).id(recipe.getId())
	})

	// Use Canvas as base for Backpack Upgrade Templates, as well as Zinc.
	event.replaceInput({id: /^sophisticated.*upgrade_base/}, "minecraft:leather", "farmersdelight:canvas")
	event.replaceInput({id: /^sophisticated.*upgrade_base/}, "minecraft:iron_ingot", "create:zinc_ingot")
	// Use Create's List Filter for Filter Upgrades.
	event.replaceInput({id: /^sophisticated.*filter_upgrade/}, "minecraft:string", "create:filter")
	// Use Cobblemon's Magnet for Magnet Upgrades.
	// Too expensive. Needs more complex replacement.
	// event.replaceInput({id: /^sophisticated.*magnet_upgrade$/}, "minecraft:iron_ingot", "cobblemon:magnet")

	add_sophisticated_storage_recipes_for_modded_wood_types(event)
})

const STORAGE_WOOD_TYPES = [
	{
		id: "biomeswevegone:zelkova",
		name: "zelkova",
		planks: "biomeswevegone:zelkova_planks",
		slabs: "biomeswevegone:zelkova_slab",
		main_color: -4166102,
		accent_color: -10011877,
	},
	{
		id: "biomesoplenty:jacaranda",
		name: "pale_jacaranda",
		planks: "biomesoplenty:jacaranda_planks",
		slabs: "biomesoplenty:jacaranda_slab",
		main_color: Color.wrap("#FFF9FFFE").getArgb(),
		accent_color: Color.wrap("#FFEBCEFB").getArgb(),
	}
]

const Patterns = {
	CHEST: ["PPP", "PRP", "PPP"],
	BARREL: ["PSP", "PRP", "PSP"],
	LIMITED_BARREL_1: ["PSP", "PRP", "PPP"],
	LIMITED_BARREL_2: ["PPP", "SRS", "PPP"],
	LIMITED_BARREL_3: ["PSP", "PRP", "SPS"],
	LIMITED_BARREL_4: ["SPS", "PRP", "SPS"],
}

/**
 * @param {import("dev.latvian.mods.kubejs.recipe.RecipesKubeEvent").$RecipesKubeEvent$$Original} event
 */
function add_sophisticated_storage_recipes_for_modded_wood_types(event) {
	for (const type of STORAGE_WOOD_TYPES) {
		let {id, name, planks, slabs, main_color, accent_color} = type

		let components = {
			"sophisticatedstorage:wood_type": id,
			"sophisticatedcore:main_color": main_color,
			"sophisticatedcore:accent_color": accent_color,
		}
		event.shaped(Item.of("sophisticatedstorage:chest", components),
			Patterns.CHEST,
			{
				P: planks,
				R: "sophisticatedstorage:basic_tier_upgrade"
			}
		).id(`kubejs:sophisticatedstorage/${name}_chest`)

		let barrel_keys = {
			P: planks,
			S: slabs,
			R: "sophisticatedstorage:basic_tier_upgrade"
		}
		event.shaped(Item.of("sophisticatedstorage:barrel", components), Patterns.BARREL, barrel_keys)
				.id(`kubejs:sophisticatedstorage/${name}_barrel`)

		event.shaped(Item.of("sophisticatedstorage:limited_barrel_1", components), Patterns.LIMITED_BARREL_1, barrel_keys)
				.id(`kubejs:sophisticatedstorage/${name}_limited_barrel_1`)

		event.shaped(Item.of("sophisticatedstorage:limited_barrel_2", components), Patterns.LIMITED_BARREL_2, barrel_keys)
				.id(`kubejs:sophisticatedstorage/${name}_limited_barrel_2`)

		event.shaped(Item.of("sophisticatedstorage:limited_barrel_3", components), Patterns.LIMITED_BARREL_3, barrel_keys)
				.id(`kubejs:sophisticatedstorage/${name}_limited_barrel_3`)

		event.shaped(Item.of("sophisticatedstorage:limited_barrel_4", components), Patterns.LIMITED_BARREL_4, barrel_keys)
				.id(`kubejs:sophisticatedstorage/${name}_limited_barrel_4`)
	}
}