
RecipeViewerEvents.removeEntriesCompletely("item", event => {
	event.remove(global.DISABLED_ITEMS)
    // event.remove(Ingredient.of("minecraft:chest[container_loot={loot_table:\"minecraft:chests/abandoned_mineshaft\"}]"))
})

RecipeViewerEvents.removeEntriesCompletely("fluid", event => {
    for (const fluid of global.DISABLED_FLUIDS) {
        event.remove(fluid)
    }
})

ItemEvents.modifyTooltips(event => {
    event.add(global.DISABLED_ITEMS, [
        Text.of("This is supposed to be disabled...").color("red_dye"),
        Text.of("How are you seeing this!?").color("red"),
    ])
})

