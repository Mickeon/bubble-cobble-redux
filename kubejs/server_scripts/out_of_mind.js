
// DO NOT USE the { output: } filter unless Brewin' and Chewin' recipes are filtered out, because on a dedicated server the script fails with this:
// UnknownKubeRecipe.java#64: Error in 'ServerEvents.recipes': java.lang.NullPointerException:
// Cannot invoke "umpaz.brewinandchewin.common.BnCConfiguration$Common.keg()"
// because the return value of "house.greenhouse.greenhouseconfig.api.GreenhouseConfigHolder.get()" is null
// `/reload` "fixes" it but I'd rather not have to reload Datapacks every server reboot.
// event.remove({ output: "create:gearbox" }) // Big no-no, indeed.
// replaceOutput() also seems to be causing problems?

ServerEvents.recipes(event => {
	console.log("Changing recipes in out_of_mind.js")

	// Gotta do this manually I guess.
	event.remove({id: "create_bic_bit:mixing/curdled_milk" })
	event.remove({id: "create:crafting/materials/copper_ingot"}) // Duplicate because of Minecraft's own recipe.
	event.replaceInput({input: "create:copper_nugget"}, "create:copper_nugget", "minecraft:copper_nugget" )
	event.replaceOutput({output: "create:copper_nugget", not: {type: "brewinandchewin:fermenting"}}, "create:copper_nugget", "minecraft:copper_nugget")

	event.remove({input: global.get_disabled_ingredient().stackArray, not: {type: "brewinandchewin:fermenting"}}) // Doesn't seem to do much of anything?
	event.remove({output: global.get_disabled_ingredient().stackArray, not: {type: "brewinandchewin:fermenting"}})
})

ServerEvents.tags("item", event => {
	event.removeAllTagsFrom(global.get_disabled_ingredient().itemIds)
	event.add("c:hidden_from_recipe_viewers", global.get_disabled_ingredient().itemIds)
})

// Hide advancements.
ServerEvents.generateData("after_mods", event => {
	for (const advancement_id of [
		"constructionstick:advancement/template_angel",
		"constructionstick:advancement/template_battery",
		"constructionstick:advancement/template_destruction",
		"constructionstick:advancement/template_replacement",
		"constructionstick:advancement/template_unbreakable",
		"constructionstick:advancement/recipes/misc/template_angel",
		"constructionstick:advancement/recipes/misc/template_battery",
		"constructionstick:advancement/recipes/misc/template_destruction",
		"constructionstick:advancement/recipes/misc/template_replacement",
		"constructionstick:advancement/recipes/misc/template_unbreakable",
		"luistercorp:advancement/troncos/tiendas",
		"luistercorp:advancement/troncos/troncos",
	]) {
		event.json(advancement_id, {
			criteria: {
				impossible: {
					trigger: "minecraft:impossible"
				}
			}
		})
	}
})

ServerEvents.generateData("last", event => {
	// I've been trying so hard to do it more automatically in LootJS, to no avail. Fine.
	console.log("Removing disabled artifacts from loot tables")
	for (const loot_table_id of [
		"artifacts:loot_table/items/eternal_steak",
		"artifacts:loot_table/items/everlasting_beef",
		"artifacts:loot_table/items/aqua_dashers",
		"artifacts:loot_table/items/strider_shoes",
		"artifacts:loot_table/items/umbrella",
		"artifacts:loot_table/items/villager_hat",
		"artifacts:loot_table/items/night_vision_goggles",
		"artifacts:loot_table/items/scarf_of_invisibility",
	]) {
		event.json(loot_table_id, {
			type: "minecraft:chest",
			pools: []
		})
	}
})

LootJS.lootTables(event => {
	console.log("Removing disabled items from loot tables")
	event.modifyLootTables(/.*chest.*/).removeItem(global.get_disabled_ingredient())

	// I swear I've tried this in many different ways. These Artifacts are RESILIENT.
	// event.modifyLootTables(/.*artifact.*/).forEach(table => {
	// 	console.log(table.location)
	// 	table.replaceItem("artifacts:villager_hat", "kubejs:blue_mascot_cat")
	// })
})

// Even if currently impossible, just for fun.
ItemEvents.foodEaten(["artifacts:everlasting_beef", "artifacts:eternal_steak", "relics:infinity_ham"], event => {
	const player = event.player
	if (!player) {
		return
	}
	player.addEffect(MobEffectUtil.of("minecraft:hunger", 5 * SEC, 255))
})
