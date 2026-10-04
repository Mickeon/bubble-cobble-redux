// requires: displaydelight

StartupEvents.modifyCreativeTab("displaydelight:displaydelight", event => {
	event.removeFromParent("#c:hidden_from_recipe_viewers") // See server side.

	// Show the original food items that can be placed down, for consistency.
	let plated_cookie = Item.of("displaydelight:plated_cookie")
	Ingredient.of("#displaydelight:displayable").getStackArray().sort().forEach(item => {
		event.addBefore(plated_cookie, item, "parent_tab_only")
	})
	// Does not work for some reason.
	// event.add(Ingredient.of("#displaydelight:displayable").getStackArray().sort(), "parent_tab_only")
})
