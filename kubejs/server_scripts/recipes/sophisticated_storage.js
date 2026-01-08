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

	// Require Basic Tier Upgrade for all storage, instead of Redstone Torch.
	event.replaceInput({mod: "sophisticatedstorage"}, "minecraft:redstone_torch", "sophisticatedstorage:basic_tier_upgrade")
	// Replacing doesn't work here with the usual function. We do it manually.
	event.forEachRecipe({type: "sophisticatedstorage:generic_wood_storage"}, recipe => {
		const json = JSON.parse(recipe.json)
		json.key.R = Ingredient.of("sophisticatedstorage:basic_tier_upgrade")
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
	event.replaceInput({id: /^sophisticated.*upgrade/}, "minecraft:leather", "farmersdelight:canvas")
	event.replaceInput({id: /^sophisticated.*upgrade/}, "minecraft:iron_ingot", "create:zinc_ingot")
	// Use Create's List Filter for Filter Upgrades.
	event.replaceInput({id: /^sophisticated.*filter_upgrade/}, "minecraft:string", "create:filter")
	// Use Cobblemon's Magnet for Magnet Upgrades.
	// Too expensive. Needs more complex replacement.
	// event.replaceInput({id: /^sophisticated.*magnet_upgrade$/}, "minecraft:iron_ingot", "cobblemon:magnet")
})