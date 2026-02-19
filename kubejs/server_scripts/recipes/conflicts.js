

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

	// Recipe conflict between Create's Sand Paper and craftable Suspicious Sand from... I'm not sure what mod?
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

	// Recipe conflict between Display Delight's Food Plate and Handcrafted's Wood Cup.
	event.shaped(Item.of("handcrafted:wood_cup", 5), ["S S", "SSS"], {S: "#minecraft:wooden_slabs"}).id("handcrafted:wood_cup")
})