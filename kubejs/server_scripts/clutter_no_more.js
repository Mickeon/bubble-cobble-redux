// ignored: true
// requires: clutternomore

// FIXME: With `recipe_fixes` enabled (See config\clutternomore\startup.toml),
// all recipes that output shapes (slabs, stairs, etc.) are removed.
// However, this setting also replaces all shape ingredients with the "parent" shape,
// which causes many, many recipe conflicts. Either:
// - Disable `recipe_fixes` and do the removal it manually (painful).
// - Keep `recipe_fixes` and address the conflicts manually (reasonable).
// - Suggest a separate setting for ignoring ingredients to the devs (ideal).

ServerEvents.recipes(event => {
	event.forEachRecipe({type: "create:cutting", id: /slab$/}, recipe => {
		const json = JSON.parse(recipe.json)
		json.results[0].count = 1
		event.custom(json).id(recipe.getId())
	})

	// Remove Slabs & Co. recipes manually.
	let shapes_regex = /_(slab|stairs|wall)/
	event.remove({type: "minecraft:crafting_shaped", id: shapes_regex})
	event.remove({type: "minecraft:stonecutting", id: shapes_regex})
	// Can't be done, several block items are not tagged properly.
	// let shapes = Ingredient.of("#minecraft:slabs").or("#minecraft:stairs").or("#minecraft:walls")
})
