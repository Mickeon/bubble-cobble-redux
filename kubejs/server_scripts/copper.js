
ServerEvents.recipes(event => {
	const copper_tool_keys = {C: "minecraft:copper_ingot", S: "minecraft:stick"}
	event.shaped("minecraft:copper_shovel", ["C", "S", "S"], copper_tool_keys).equipmentCategory()
	event.shaped("minecraft:copper_pickaxe", ["CCC", " S ", " S "], copper_tool_keys).equipmentCategory()
	event.shaped("minecraft:copper_axe", ["CC", "CS", " S"], copper_tool_keys).equipmentCategory()
	event.shaped("minecraft:copper_hoe", ["CC", " S", " S"], copper_tool_keys).equipmentCategory()
	event.shaped("minecraft:copper_sword", ["C", "C", "S"], copper_tool_keys).equipmentCategory()

	const copper_armor_keys = {C: "minecraft:copper_ingot"}
	event.shaped("minecraft:copper_helmet", ["CCC", "C C"], copper_armor_keys).equipmentCategory()
	event.shaped("minecraft:copper_chestplate", ["C C", "CCC", "CCC"], copper_armor_keys).equipmentCategory()
	event.shaped("minecraft:copper_leggings", ["CCC", "C C", "C C"], copper_armor_keys).equipmentCategory()
	event.shaped("minecraft:copper_boots", ["C C", "C C"], copper_armor_keys).equipmentCategory()

	event.smelting("minecraft:copper_nugget", Ingredient.of([
		"minecraft:copper_shovel", "minecraft:copper_pickaxe", "minecraft:copper_axe", "minecraft:copper_hoe", "minecraft:copper_sword",
		"minecraft:copper_helmet", "minecraft:copper_chestplate", "minecraft:copper_leggings", "minecraft:copper_boots"
	]), 0.1).category("misc")
	event.blasting("minecraft:copper_nugget", Ingredient.of([
		"minecraft:copper_shovel", "minecraft:copper_pickaxe", "minecraft:copper_axe", "minecraft:copper_hoe", "minecraft:copper_sword",
		"minecraft:copper_helmet", "minecraft:copper_chestplate", "minecraft:copper_leggings", "minecraft:copper_boots"
	]), 0.1).category("misc")
})