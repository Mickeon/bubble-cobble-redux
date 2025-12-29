
// DO NOT USE the { output: } filter unless Brewin' and Chewin' recipes are filtered out, because on a dedicated server the script fails with this:
// UnknownKubeRecipe.java#64: Error in 'ServerEvents.recipes': java.lang.NullPointerException:
// Cannot invoke "umpaz.brewinandchewin.common.BnCConfiguration$Common.keg()"
// because the return value of "house.greenhouse.greenhouseconfig.api.GreenhouseConfigHolder.get()" is null
// `/reload` "fixes" it but I'd rather not have to reload Datapacks every server reboot.
// event.remove({ output: "create:gearbox" }) // Big no-no, indeed.
// replaceOutput() also seems to be causing problems?

ServerEvents.recipes(event => {
	console.log("Changing recipes in out_of_mind.js")
	// event.remove({input: global.DISABLED_ITEMS}) // Doesn't seem to do much of anything?
	event.remove({output: global.DISABLED_ITEMS, not: {type: "brewinandchewin:fermenting"}})

	// Gotta do this manually I guess.
	event.remove({id: "create_bic_bit:mixing/curdled_milk" })
	event.remove({id: "create:crafting/materials/copper_ingot"}) // Duplicate because of Minecraft's own recipe.
	event.replaceInput({input: "create:copper_nugget"}, "create:copper_nugget", "minecraft:copper_nugget" )
	event.replaceOutput({output: "create:copper_nugget", not: {type: "brewinandchewin:fermenting"}}, "create:copper_nugget", "minecraft:copper_nugget")
})

ServerEvents.tags("item", event => {
	event.removeAllTagsFrom(global.DISABLED_ITEMS)
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
		"haventrowel:advancement/trowel",
		"haventrowel:advancement/recipes/misc/craft/trowel",
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