// requires: displaydelight

ItemEvents.modifyTooltips(event => {
	event.modify("#displaydelight:displayable", text => {
		text.insert(1, PLACEABLE_SNEAKING_TOOLTIP)
	})

	const plate_displayable = Ingredient.of("#displaydelight:plate_displayable")
	const small_plate_displayable = Ingredient.of("#displaydelight:small_plate_displayable")

	event.modify(plate_displayable.or(small_plate_displayable), text => {
		// text.insert(1, PLACEABLE_TOOLTIP.copy().append(" on:"))
		// They're also placeable this way with my server-side edits.
		text.insert(1, PLACEABLE_SNEAKING_TOOLTIP)
		// text.insert(1, PLACEABLE_SNEAKING_TOOLTIP.copy().append(" and on:"))
		// text.insert(1, PLACEABLE_TOOLTIP.copy().append(":"))
		// text.insert(2, Text.join("• while", Text.of(` sneaking`).color(MASCOT_COLOR)).color(MASCOT_COLOR_DARK))

	})
	event.modify(small_plate_displayable, text => {
		text.insert(2, Text.join("• ", Text.translate("block.displaydelight.small_food_plate").color(MASCOT_COLOR)).color(MASCOT_COLOR_DARK))
	})
	event.modify(plate_displayable, text => {
		text.insert(2, Text.join("• ", Text.translate("block.displaydelight.food_plate").color(MASCOT_COLOR)).color(MASCOT_COLOR_DARK))
	})
})
