// requires: create
// requires: cobblemon
// requires: createmonballsoverhaul

const APRICORN_COLORS = ["red", "yellow", "green", "blue", "pink", "black", "white"]
// const BALL_BASES = ["copper_ball_base", "iron_ball_base", "brass_ball_base", "sturdy_ball_base"]

ServerEvents.recipes(event => {
	// Don't let any Create Cobblemon crossover nerf the base recipe.
	event.forEachRecipe({mod: "cobblemon", id: /ball$/, type: "minecraft:crafting_shaped"}, recipe => {
		const json = JSON.parse(recipe.json)
		if (json.result.count == 2) {
			json.result.count = 4
			event.custom(json).id(recipe.getId())
		}
	})

	for (const color of APRICORN_COLORS) {
		let lid = `createmonballsoverhaul:${color}_ball_lid`
		let apricorn = `cobblemon:${color}_apricorn`
		let bits = `createmonballsoverhaul:${color}_apricorn_bits`

		// Cut Apricorns to the lids with their respective colors. Some pulp comes out, too.
		event.recipes.create.cutting([
			CreateItem.of(Item.of(lid, 2)),
			CreateItem.of(Item.of(bits, 2))
		], Ingredient.of(apricorn)
		)

		// Alternatively, you may Crush Apricorns into Bits.
		event.recipes.create.crushing([
			CreateItem.of(Item.of(bits, 2)),
			CreateItem.of(Item.of(bits, 1), 0.5),
			CreateItem.of(Item.of(bits, 1), 0.5),
		], Ingredient.of(apricorn)
		)
		event.recipes.create.milling([
			CreateItem.of(Item.of(bits, 2)),
			CreateItem.of(Item.of(bits, 1), 0.5),
			CreateItem.of(Item.of(bits, 1), 0.5),
		], Ingredient.of(apricorn)
		)

		// And get some dye out of them.
		event.recipes.create.splashing(
			CreateItem.of(`minecraft:${color}_dye`, 0.5),
			Ingredient.of(bits)
		)

		// With all of the above, no need for Apricorn Halves anymore.
		event.remove({id: `createmonballsoverhaul:cutting/half_${color}_apricorn`})
		event.remove({id: `createmonballsoverhaul:splashing/${color}_ball_lid`})
		// Or the original recipe for Apricorn Bits.
		event.remove({id: `createmonballsoverhaul:cutting/${color}_apricorn_bits`})
		// Or the ability to dye Blank Ball Lids.
		event.remove({id: `createmonballsoverhaul:deploying/dye_${color}_ball_lid`})
	}

	// Replace the need for Blank Ball Lid outright, in favour of just a White Lid.
	event.remove({id: "createmonballsoverhaul:blasting/blank_ball_lid" })
	event.remove({mod: "createmonballsoverhaul", id: /dye_.*_lid/ })
	event.forEachRecipe({mod: "createmonballsoverhaul", id: /sequenced_assembly\/balls/}, recipe => {
		/** @type {{sequence: Array}} */
		const json = JSON.parse(recipe.json)
		json.sequence.forEach(step => {
			let deployed_ingredients = step.ingredients[1]
			if (deployed_ingredients[0].item == "createmonballsoverhaul:blank_ball_lid") {
				deployed_ingredients[0].item = "createmonballsoverhaul:white_ball_lid"
			}
		})
		event.custom(json).id(recipe.getId())
	})

	// Skip the whole "Base Ball" recipe entirely.
	event.remove({mod: "createmonballsoverhaul", id: /sequenced_assembly\/mechanism/})
	event.stonecutting(Item.of("createmonballsoverhaul:copper_ball_mechanism", 4), "minecraft:copper_ingot")
	event.stonecutting(Item.of("createmonballsoverhaul:iron_ball_mechanism", 4), "minecraft:iron_ingot")
	event.stonecutting(Item.of("createmonballsoverhaul:brass_ball_mechanism", 4), "create:brass_ingot")
	event.stonecutting(Item.of("createmonballsoverhaul:sturdy_ball_mechanism", 4), "create:sturdy_sheet")
	// This is an oversimplification, and may be changed in the future.
	event.recipes.create.deploying("createmonballsoverhaul:copper_ancient_ball_mechanism", [Ingredient.of("createmonballsoverhaul:copper_ball_mechanism"), "create:andesite_alloy"])
	event.recipes.create.deploying("createmonballsoverhaul:iron_ancient_ball_mechanism", [Ingredient.of("createmonballsoverhaul:iron_ball_mechanism"), "create:andesite_alloy"])
	event.recipes.create.deploying("createmonballsoverhaul:brass_ancient_ball_mechanism", [Ingredient.of("createmonballsoverhaul:brass_ball_mechanism"), "create:andesite_alloy"])
	event.recipes.create.deploying("createmonballsoverhaul:sturdy_ancient_ball_mechanism", [Ingredient.of("createmonballsoverhaul:sturdy_ball_mechanism"), "create:andesite_alloy"])

	// No more Rubber Stamps for lids.
	// Note that the result of this recipe is randomly chosen between Apricorn Planks, which is fine because the result can be enforced.
	event.replaceInput({id: "createmonballsoverhaul:cutting/apricorn_ball_lid"}, "*", Ingredient.of("cobblemon:stripped_apricorn_log").or("cobblemon:stripped_apricorn_wood"))

	// And with the above, no more need for Rubber Stamp Lid, Ball Bases.
	event.remove({mod: "createmonballsoverhaul", id:/deploying\/stamping/})
	event.remove({mod: "createmonballsoverhaul", id: /pressing\/.*ball_base/})
	event.remove({mod: "createmonballsoverhaul", id: /crafting/})
})

ServerEvents.tags("item", event => {
	event.add("c:hidden_from_recipe_viewers",
		/createmonballsoverhaul:half/,
		/createmonballsoverhaul:.*ball_base/,
		/createmonballsoverhaul:stamped/,
		"createmonballsoverhaul:rubber_stamp_lid"
	)
})


// Remove the "Deploy Shaft" middle step from Ball Mechanism recipe.
// event.forEachRecipe({mod: "createmonballsoverhaul", id: /sequenced_assembly\/mechanism/}, recipe => {
// 	/** @type {{sequence: Array}} */
// 	const json = JSON.parse(recipe.json)
// 	json.sequence = (json.sequence.filter(step => {
// 		const deployed_ingredients = step.ingredients[1]
// 		if (deployed_ingredients) {
// 			return deployed_ingredients[0].item != "create:shaft"
// 		}
// 		return true
// 	}))
// 	event.custom(json).id(recipe.getId())
// })

// event.remove({id: "createmonballsoverhaul:sequenced_assembly/ball_lids/ultra_ball_lid"})
// const incomplete_ultra_ball_lid = "createmonballsoverhaul:unfinished_ultra_ball_lid"
// event.recipes.create.sequenced_assembly(
// 	[CreateItem.of("createmonballsoverhaul:ultra_ball_lid")],
// 	Ingredient.of("createmonballsoverhaul:black_ball_lid"), [
// 		event.recipes.create.deploying(incomplete_ultra_ball_lid, [incomplete_ultra_ball_lid, "createmonballsoverhaul:yellow_ball_lid"]),
// 	],
// 	incomplete_ultra_ball_lid
// )

// Blank Ball Lid requires blasting lids, for some reason. I can only speculate it was done to not repeat the "splashing" twice.
// event.recipes.create.splashing(
// 	CreateItem.of("createmonballsoverhaul:blank_ball_lid"),
// 	Ingredient.of("#createmonballsoverhaul:blastable_ball_lids")
// )

// Output the Ball Base here, instead of a Stamped Nugget.
// event.replaceOutput({id: "createmonballsoverhaul:deploying/stamping/copper_nugget_lid_stamping"}, "*", Item.of("createmonballsoverhaul:copper_ball_base"))
// event.replaceOutput({id: "createmonballsoverhaul:deploying/stamping/iron_nugget_lid_stamping"}, "*", Item.of("createmonballsoverhaul:iron_ball_base"))
// event.replaceOutput({id: "createmonballsoverhaul:deploying/stamping/brass_nugget_lid_stamping"}, "*", Item.of("createmonballsoverhaul:brass_ball_base"))
// event.replaceOutput({id: "createmonballsoverhaul:deploying/stamping/sturdy_sheet_lid_stamping"}, "*", Item.of("createmonballsoverhaul:sturdy_ball_base"))
// No more need to press a "Stamped Nugget" to get a Base later.
// event.remove({mod: "createmonballsoverhaul", id: /pressing\/.*_base/})
