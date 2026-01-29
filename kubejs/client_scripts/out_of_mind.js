
RecipeViewerEvents.removeEntriesCompletely("item", event => {
	// event.remove(global.get_disabled_ingredient())
})

RecipeViewerEvents.removeEntriesCompletely("fluid", event => {
	for (const fluid of global.DISABLED_FLUIDS) {
		event.remove(fluid)
	}
})

ItemEvents.modifyTooltips(event => {
	try {
	event.add(global.get_disabled_ingredient(), [
		Text.of(`This is supposed to be disabled...`).color("red_dye"),
		Text.of(`How are you seeing this!?`).color("red"),
	])
	} catch (error) {
	console.error(error)
	}
})
