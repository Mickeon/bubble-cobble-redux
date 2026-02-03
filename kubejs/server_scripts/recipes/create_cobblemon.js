// requires: create
// requires: cobblemon
// requires: createmonballsoverhaul

const APRICORN_COLORS = ["red", "yellow", "green", "blue", "pink", "black", "white"]
// const BALL_BASES = ["copper_ball_base", "iron_ball_base", "brass_ball_base", "sturdy_ball_base"]

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

	// Don't let any Create Cobblemon crossover nerf the base recipe.
	event.forEachRecipe({mod: "cobblemon", id: /ball$/, type: "minecraft:crafting_shaped"}, recipe => {
		const json = JSON.parse(recipe.json)
		if (json.result.count == 2) {
			json.result.count = 4
			event.custom(json).id(recipe.getId())
		}
	})

	// Instead, buff the Create version's output.
	change_result_count({mod: "createmonballsoverhaul", id: /sequenced_assembly\/balls/}, 2)

	for (const color of APRICORN_COLORS) {
		// Crush Apricorns into Bits.
		event.recipes.create.crushing(
			CreateItem.of(Item.of(`createmonballsoverhaul:${color}_apricorn_bits`, 2)),
			Ingredient.of(`cobblemon:${color}_apricorn`)
		)
		event.recipes.create.milling(
			CreateItem.of(Item.of(`createmonballsoverhaul:${color}_apricorn_bits`, 2)),
			Ingredient.of(`cobblemon:${color}_apricorn`)
		)

		// Then allow them to be pressed into Lids.
		event.recipes.create.pressing(
			CreateItem.of(`createmonballsoverhaul:${color}_ball_lid`),
			Ingredient.of(`createmonballsoverhaul:${color}_apricorn_bits`)
		)

		event.recipes.create.splashing(
			CreateItem.of(`minecraft:${color}_dye`),
			Ingredient.of(`createmonballsoverhaul:${color}_apricorn_bits`)
		)

		// With all of the above, no need for Apricorn Halves anymore.
		event.remove({id: `createmonballsoverhaul:splashing/${color}_ball_lid`})
	}

	// Blank Ball Lid requires blasting lids, for some reason. I can only speculate it was done to not repeat the "splashing" twice.
	event.remove({id: "createmonballsoverhaul:blasting/blank_ball_lid" })
	event.recipes.create.splashing(
		CreateItem.of("createmonballsoverhaul:blank_ball_lid"),
		Ingredient.of("#createmonballsoverhaul:blastable_ball_lids")
	)

	// Output the Ball Base here, instead of a Stamped Nugget.
	event.replaceOutput({id: "createmonballsoverhaul:deploying/stamping/copper_nugget_lid_stamping"}, "*", Item.of("createmonballsoverhaul:copper_ball_base"))
	event.replaceOutput({id: "createmonballsoverhaul:deploying/stamping/iron_nugget_lid_stamping"}, "*", Item.of("createmonballsoverhaul:iron_ball_base"))
	event.replaceOutput({id: "createmonballsoverhaul:deploying/stamping/brass_nugget_lid_stamping"}, "*", Item.of("createmonballsoverhaul:brass_ball_base"))
	event.replaceOutput({id: "createmonballsoverhaul:deploying/stamping/sturdy_sheet_lid_stamping"}, "*", Item.of("createmonballsoverhaul:sturdy_ball_base"))
	// No more need to press a "Stamped Nugget" to get a Base later.
	event.remove({mod: "createmonballsoverhaul", id: /pressing\/.*_base/})

	// Remove the "Deploy Shaft" middle step from Ball Mechanism recipe.
	event.forEachRecipe({mod: "createmonballsoverhaul", id: /sequenced_assembly\/mechanism/}, recipe => {
		const json = JSON.parse(recipe.json)
		// /** @type {Array} */
		json.sequence = json.sequence.filter(step => {
			const deployed_ingredients = step.ingredients[1]
			if (deployed_ingredients) {
				return deployed_ingredients[0].item != "create:shaft"
			}
			return true
		})
		event.custom(json).id(recipe.getId())
	})

})


// event.remove({id: "createmonballsoverhaul:sequenced_assembly/ball_lids/ultra_ball_lid"})
// const incomplete_ultra_ball_lid = "createmonballsoverhaul:unfinished_ultra_ball_lid"
// event.recipes.create.sequenced_assembly(
// 	[CreateItem.of("createmonballsoverhaul:ultra_ball_lid")],
// 	Ingredient.of("createmonballsoverhaul:black_ball_lid"), [
// 		event.recipes.create.deploying(incomplete_ultra_ball_lid, [incomplete_ultra_ball_lid, "createmonballsoverhaul:yellow_ball_lid"]),
// 	],
// 	incomplete_ultra_ball_lid
// )