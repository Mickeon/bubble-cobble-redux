/** @import {get_disabled_ingredient, DISABLED_FLUIDS} from "../startup_scripts/disable_content" */
this.get_disabled_ingredient = global.get_disabled_ingredient
this.DISABLED_FLUIDS = global.DISABLED_FLUIDS

RecipeViewerEvents.removeEntriesCompletely("fluid", event => {
	for (const fluid of DISABLED_FLUIDS) {
		event.remove(fluid)
	}
})

ItemEvents.modifyTooltips(event => {
	try {
	event.add(get_disabled_ingredient(), [
		Text.of(`This is supposed to be disabled...`).color("red_dye"),
		Text.of(`How are you seeing this!?`).color("red"),
	])
	} catch (error) {
	console.error(error)
	}
})
