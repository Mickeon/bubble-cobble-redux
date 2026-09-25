
if (!Platform.isLoaded("copperagebackport")) {

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

} else {

const COPPER_BUTTONS = [
	"copperagebackport:copper_button", "copperagebackport:exposed_copper_button", "copperagebackport:oxidized_copper_button", "copperagebackport:weathered_copper_button",
	"copperagebackport:waxed_copper_button", "copperagebackport:waxed_exposed_copper_button", "copperagebackport:waxed_oxidized_copper_button",  "copperagebackport:waxed_weathered_copper_button"
]
const COPPER_CHAINS = [
	"minecraft:copper_chain", "minecraft:exposed_copper_chain", "minecraft:weathered_copper_chain", "minecraft:oxidized_copper_chain",
	"minecraft:waxed_copper_chain", "minecraft:waxed_exposed_copper_chain", "minecraft:waxed_weathered_copper_chain", "minecraft:waxed_oxidized_copper_chain"
]
const COPPER_CHESTS = [
	"minecraft:copper_chest", "minecraft:exposed_copper_chest", "minecraft:weathered_copper_chest", "minecraft:oxidized_copper_chest",
	"minecraft:waxed_copper_chest", "minecraft:waxed_exposed_copper_chest", "minecraft:waxed_oxidized_copper_chest", "minecraft:waxed_weathered_copper_chest",
]

ServerEvents.tags("item", event => {
	event.add("c:nuggets", "minecraft:copper_nugget")
	event.add("minecraft:buttons", COPPER_BUTTONS)
	event.remove("create:chain_rideable", COPPER_CHAINS) // They didn't realise this was plainly wrong. Reported: https://github.com/Smallinger/Copper-Age-Backport/issues/87.
	event.add("c:chests", COPPER_CHESTS) // Reported: https://github.com/Smallinger/Copper-Age-Backport/issues/86.
})

ServerEvents.tags("block", event => {
	event.add("c:chests", "#minecraft:copper_chests")
	event.add("minecraft:buttons", COPPER_BUTTONS)
	event.add("minecraft:mineable/pickaxe", COPPER_BUTTONS)
	event.add("create:fan_transparent", /^minecraft:.*copper_(bars|trapdoor)$/, /ladder$/)
})

ServerEvents.tags("entity_type", event => {
	// Tee-hee.
	event.add("supplementaries:cage_catchable", "minecraft:copper_golem")
	event.add("supplementaries:flute_pet", "minecraft:copper_golem")
})

}