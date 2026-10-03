// requires: displaydelight

// I want these to only show up when looking them up in the Creative Tabs.
ServerEvents.tags("item", event => {
	let $BlockAssociations = Java.loadClass("com.jkvin114.displaydelight.init.BlockAssociations")
	let $AbstractItemBlock = Java.loadClass("com.jkvin114.displaydelight.block.AbstractItemBlock")

	Ingredient.of("@displaydelight").getItemStream().forEach(item => {
		if (item.block instanceof $AbstractItemBlock
		&& (item.block.getStackFor().isEmpty() || $BlockAssociations.getItemFor(item.block) == Items.AIR)) {
			event.add("c:hidden_from_recipe_viewers", item)
		}
	})
})
