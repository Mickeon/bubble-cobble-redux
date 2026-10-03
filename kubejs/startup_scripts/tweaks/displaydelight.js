// requires: displaydelight

StartupEvents.modifyCreativeTab("displaydelight:displaydelight", event => {
	// https://github.com/jkvin114/display-delight-neoforge/blob/main/src/main/java/com/jkvin114/displaydelight/init/BlockAssociations.java
	let $BlockAssociations = Java.loadClass("com.jkvin114.displaydelight.init.BlockAssociations")
	let $AbstractItemBlock = Java.loadClass("com.jkvin114.displaydelight.block.AbstractItemBlock")

	event.removeFromParent(item => {
		let block = item.block
		if (block instanceof $AbstractItemBlock) {
			if (block.getStackFor().isEmpty()) {
				// The display item's original food item does not exist in the modpack.
				return true
			}

			if ($BlockAssociations.getItemFor(block) != Items.AIR) {
				// The display item has an exact food item corresponding to it.
				// Showing it is redundant because the item can easily be placed and is properly documented.
				return true
			}
		}
		return false
	})

	// Show the original food items that can be placed down, for consistency.
	let plated_cookie = Item.of("displaydelight:plated_cookie")
	// Does not work for some reason.
	// event.add(Ingredient.of("#displaydelight:displayable").getStackArray().sort(), "parent_tab_only")
	Ingredient.of("#displaydelight:displayable").getStackArray().sort().forEach(item => {
		event.addBefore(plated_cookie, item, "parent_tab_only")
	})
})
