// requires: yo_hooks
// requires: constructionstick
// requires: gag

ItemEvents.modifyTooltips(event => {
	event.add("#constructionstick:construction_sticks", Text.translate("Press %s to to open the GUI", [Text.keybind("key.constructionstick.open_gui").white()]).color(MASCOT_COLOR_DARK))
})

// Imitate what it does here on the JEI side, but not EMI's for some reaosn.
// https://github.com/Mrbysco/ConstructionSticks/blob/main/src/main/java/mrbysco/constructionstick/integrations/jei/ConstructionStickJeiPlugin.java
RecipeViewerEvents.addInformation("item", event => {
	const COMMON_DESCRIPTION =
`Open the configuration screen with %s.
§5§nUNDO§0§r
Hold %s while looking at blocks to highlight the last blocks placed with the stick. Press %s while looking at them to undo the operation, returning the blocks in your inventory.

§5§nRESTRICTIONS§0§r
Press %s to limit the axes blocks will be placed into (only horizontally, vertically, etc.).

§5§nOFFHAND PRIORITY§0§r
Having blocks in the offhand will place those with the stick, instead of the block being looking at.

§5§nCONTAINERS§0§r
Shulker boxes, bundles, and many containers from other mods can provide building blocks for the stick.`

	/** @param {SpecialTypes.TranslationKey} lang_key  */
	function key_format(lang_key) {
		return Text.of([
			"[", Text.keybind(lang_key).blue(), "] ",
			"(", Text.translatable(lang_key), ")"
		]).darkBlue()
	}

	event.add("#constructionstick:construction_sticks", Text.translatable(COMMON_DESCRIPTION, [
		key_format("key.constructionstick.open_gui"),
		key_format("key.constructionstick.show_previous"),
		key_format("key.constructionstick.undo"),
		key_format("key.constructionstick.change_restriction"),
	]))
})