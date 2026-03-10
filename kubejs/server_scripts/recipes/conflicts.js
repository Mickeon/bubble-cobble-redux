

ServerEvents.recipes(event => {
	// Recipe conflict between Supplementaries's Item Shelf and Handcrafted's Wood Plate.
	event.remove({ id: "handcrafted:wood_plate"})
	event.shaped(
		Item.of("handcrafted:wood_plate"), [
			"ABA",
		], {
			A: "#minecraft:wooden_slabs",
			B: "#minecraft:planks"
		}
	)

	// Recipe conflict between Sleeping Bags & Handcrafted Sheets.
	//  https://github.com/terrarium-earth/Handcrafted/issues/147.
	const DYE_COLORS = ["white", "light_gray", "gray", "black", "brown", "red", "orange", "yellow", "lime", "green", "cyan", "light_blue", "blue", "purple", "magenta", "pink"]
	for (const color of DYE_COLORS) {
		event.replaceInput({id: `handcrafted:${color}_sheet`}, `minecraft:${color}_wool`, `minecraft:${color}_carpet`)
	}

	// Recipe conflict between Minecraft's Copper Trapdoor and Minecraft's Copper Bars.
	// Use the same recipe as 1.21.9.
	event.shaped("minecraft:copper_trapdoor", [
		"CC",
		"CC",
	], {
		C: "minecraft:copper_ingot"
	}).id("minecraft:copper_trapdoor")

	// Recipe conflict between Create's Sand Paper and craftable Suspicious Sand from Supplementaries.
	// While at it, make the recipe way more generous.
	event.shapeless("create:sand_paper", [
		Ingredient.of("#c:sands").except("#c:sands/red"),
		Ingredient.of("paper", 2)
	]).id("create:crafting/materials/sand_paper")
	event.shapeless("create:red_sand_paper", [
		Ingredient.of("#c:sands/red"),
		Ingredient.of("paper", 2)
	]).id("create:crafting/materials/red_sand_paper")

	// Recipe conflict between Minecraft's Crafting Table and Biomes We've Gone's Crafting Table variations.
	event.replaceInput({id: "minecraft:crafting_table"}, "*", Ingredient.of("#minecraft:planks").except("@biomeswevegone"))

	// Recipe conflict between Minecraft's Bookshelf and Biomes We've Gone's Bookshelf variations.
	event.replaceInput({id: "minecraft:bookshelf"}, Ingredient.of("#minecraft:planks"), Ingredient.of("#minecraft:planks").except("@biomeswevegone"))

	// Recipe conflict between Display Delight's Food Plate and Handcrafted's Wood Cup.
	event.shaped(Item.of("handcrafted:wood_cup", 5), ["S S", "SSS"], {S: "#minecraft:wooden_slabs"}).id("handcrafted:wood_cup")

	// Recipe conflict between Biomes We've Gone's Wreath and Snowy Spirit's Wreath.
	event.shaped("snowyspirit:wreath", [
		" G ",
		"GWG",
		" G "
	], {
		W: "biomeswevegone:wreath",
		G: "snowyspirit:ginger_flower"
	}).id("snowyspirit:wreath")

	// Recipe Conflict between Arts & Crafts's Terracotta Shingles and Handcrafted's Terracotta Thin Pot.
	event.shaped(Item.of("handcrafted:terracotta_thin_pot", 3), ["T", "T", "T"], {T: "minecraft:terracotta"}).id("handcrafted:terracotta_thin_pot")

	// Recipe conflict between Minecraft's spears and Construction Stick's construction sticks.
	// Put Leather in the bottom-left.
	event.forEachRecipe({id: /constructionstick:.*_stick$/}, recipe => {
		const json = JSON.parse(recipe.json)
		json.pattern[2] = "L  "
		json.key.L = Ingredient.of("minecraft:leather")
		event.custom(json).id(recipe.getId())
	})

	// Recipe conflict between Minecraft's Chiseled Bookshelf and Urban Decor's calendars.
	// Put a Clock in the middle.
	if (Platform.isLoaded("urban_decor")) {
		let replace_char_at = (str, index, char) => {
			return str.substring(0, index) + char + str.substring(index + 1)
		}
		event.forEachRecipe({id: /urban_decor:.*_calendar/}, recipe => {
			const json = JSON.parse(recipe.json)
			json.pattern[1] = replace_char_at(json.pattern[1], 1, "C")
			json.key.C = Ingredient.of("minecraft:clock")
			event.custom(json).id(recipe.getId())
		})
	}
})