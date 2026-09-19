// @ts-check-
// requires: probejs
// requires: cobblemon
// requires: emi

if (global.is_dev()) {

ServerEvents.basicCommand("datagen", event => {
	// Using EMI Stacks and PokemonItem directly is way more verbose and inefficient,
	// But hey, it's more robust, and I could reuse this knowledge.
	const $EmiStack = Java.loadClass("dev.emi.emi.api.stack.EmiStack")
	const $EmiIngredient = Java.loadClass("dev.emi.emi.api.stack.EmiIngredient")
	const $EmiIngredientSerializer = Java.loadClass("dev.emi.emi.api.stack.serializer.EmiIngredientSerializer")

	const $CobblemonCosmeticItems = Java.loadClass("com.cobblemon.mod.common.CobblemonCosmeticItems")
	const $PokemonSpecies = Java.loadClass("com.cobblemon.mod.common.api.pokemon.PokemonSpecies")
	const $PokemonItem = Java.loadClass("com.cobblemon.mod.common.item.PokemonItem")

	const ITEM_REGISTRY = Registry.of("minecraft:item").registry()
	const PATH = "kubejs/assets/emi/recipe/additions/pokemon_cosmetics"
	const CONSUMED_ITEM_TOOLTIP = Text.green("Change cosmetic item").italic(false)

	function to_emi_stack(item) {
		/** @type {import("@package/dev/emi/emi/api/stack").$EmiStack} */
		const emi_stack = $EmiStack["of(net.minecraft.world.item.ItemStack)"](item)
		// if (intact) {
		// 	emi_stack.setRemainder(emi_stack.copy())
		// }
		return $EmiIngredientSerializer.getSerialized(emi_stack)
	}

	$CobblemonCosmeticItems.cosmeticItems.forEach(assignment => {
		// This will always be the first defined aspect, which may be okay.
		// I don't want to show all of the different dyes/color variations, just acknowledge that they exist.
		// Also the aspects List keeps getting parsed wrong by PokemonItem for some reason.
		const aspect = assignment.getCosmeticItems().getFirst().getAspects().getFirst()

		const consumed_items = []
		for (const definition of assignment.getCosmeticItems()) {
			// Yes, there is no direct way to fetch what items are being stored. It must be brute-forced.
			// Brutally loop through every item in the game.
			consumed_items.push(
				Item.getList().stream().filter(
					item_stack => definition.getConsumedItem().fits(item_stack.item, ITEM_REGISTRY)
				).findFirst().get()
			)
		}

		// if (consumed_items[0] != Item.of("minecraft:white_wool")) {return} // Testing purposes.
		const recipe = {
			__comment: "Generated data. Do not edit manually.",
			type: "emi:world_interaction",
			left: [],
			right: {
				type: "list",
				ingredients: []
			},
			output: []
		}

		const pokemon_list = assignment.getPokemon()
		for (const pokemon of pokemon_list) {
			let species_name = pokemon.getSpecies()
			if (!species_name) {
				console.warn(`One of the species' name for cosmetic "${assignment.getId()}" is empty. Someone made a typo...`)
				continue
			}
			let species = $PokemonSpecies.getByName(species_name)
			recipe.left.push(to_emi_stack($PokemonItem.from(species)))
			recipe.output.push(to_emi_stack($PokemonItem.from(species, aspect)))
			console.log($PokemonItem.from(species, aspect).get("cobblemon:pokemon_item"))
			// recipe.output.push(to_emi_stack(Item.of("cobblemon:pokemon_model", {"cobblemon:pokemon_item": {species: "cobblemon:" + pokemon.getSpecies(), aspects: aspects}})))
			// recipe.output.push(`item:cobblemon:pokemon_model{'cobblemon:pokemon_item': {species: 'cobblemon:${species}', aspects: ['${aspect}']}}`)
		}

		for (const item of consumed_items) {
			recipe.right.ingredients.push(to_emi_stack(item.withLore(CONSUMED_ITEM_TOOLTIP)))
			// recipe.right.push(`item:${id}{lore: ['{text:\"Change cosmetic item\", color: \"green\", italic: false}']}`)
		}

		JsonIO.write(`${PATH}/${assignment.getId().getPath()}.json`, recipe)
		// console.log(JSON.stringify(recipe, null, "\t"))
	})
})

}