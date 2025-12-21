
ServerEvents.recipes(event => {
	// event.remove({input: global.DISABLED_ITEMS_INGREDIENTS})
	event.remove({output: global.DISABLED_ITEMS})

	// Gotta do this manually I guess.
	event.remove({id: "create_bic_bit:mixing/curdled_milk" })
	event.remove({id: "create:crafting/materials/copper_ingot"}) // Duplicate because of Minecraft's own recipe.
	event.replaceInput({input: "create:copper_nugget"}, "create:copper_nugget", "minecraft:copper_nugget" )
	event.replaceOutput({output: "create:copper_nugget"}, "create:copper_nugget", "minecraft:copper_nugget")
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