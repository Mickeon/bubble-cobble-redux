// requires: handcrafted

const HAMMER_TOOLTIP = Text.of(`Can be changed with the Handcrafter's Hammer`).color(MASCOT_COLOR_DARK)
const HANDCRAFTED_ITEMS_WITH_SHIFT_INFO = [
	"#handcrafted:cushions",
	"#handcrafted:sheets",
	"#handcrafted:benches",
	"#handcrafted:couches",
	"#handcrafted:chairs",
	"#handcrafted:tables",
	"#handcrafted:side_tables",
	"#handcrafted:desks",
	"#handcrafted:nightstands",
	"#handcrafted:tables",
	"#handcrafted:fancy_beds",
	"#handcrafted:counters",
	"#handcrafted:cupboards",
	"#handcrafted:drawers",
	"#handcrafted:shelves",
	"#handcrafted:trims",
	"handcrafted:hammer"
]

ClientEvents.lang("en_us", event => {
	event.add("item.handcrafted.hammer", "Handcrafter's Hammer")
})

ItemEvents.modifyTooltips(event => {
	// Remove their SHIFT info in favour of ours.
	event.modify(HANDCRAFTED_ITEMS_WITH_SHIFT_INFO, text => {
		text.removeText(Text.translate("tooltip.handcrafted.shift_description"))
	})
	event.modify(HANDCRAFTED_ITEMS_WITH_SHIFT_INFO, {shift: true}, text => {
		// They probably run this through a text splitter, so removing by looking up
		// the translation Text component does not actually work. Cool jank.
		/** @type {Array<String>} */
		// const whole_translated_strings = [
		// 	Text.translate("tooltip.handcrafted.bed_pillow").string,
		// 	Text.translate("tooltip.handcrafted.bed_sheet").string,
		// 	Text.translate("tooltip.handcrafted.counter").string,
		// 	Text.translate("tooltip.handcrafted.cushion").string,
		// 	Text.translate("tooltip.handcrafted.hammer_use_look").string,
		// 	Text.translate("tooltip.handcrafted.hammer_use_look_shift").string,
		// 	Text.translate("tooltip.handcrafted.hammer_use_shape").string,
		// 	Text.translate("tooltip.handcrafted.place_on_furniture").string,
		// 	Text.translate("tooltip.handcrafted.sheet").string,
		// ]
		// // FIXME: This doesn't always work
		// for (let whole_string of whole_translated_strings) {
		// 	let word_wrapped_string = whole_string.match(/(.{1,40}(\s|$))\s*/g)
		// 	for (let string of word_wrapped_string) {
		// 		console.log(string.trim())
		// 		text.removeText(string.trim())
		// 	}
		// }

		// Quite horrid hack to be honest.
		text.removeText("Right-click with a cushion to change the")
		text.removeText("Right-click with a sheet to change the")
		text.removeText("Right-click with a hammer to change the")
		text.removeText("Right-click with wood or stone to")
		text.removeText("Right-click with wood or stone to")
		text.removeText("Shift-right-click with a hammer to")
		text.removeText("change the block's look.")
		text.removeText("change the counter surface.")
		text.removeText("block's look.")
		text.removeText("block's shape.")
		text.removeText("bed's pillow color.")
		text.removeText("bedsheets.")
		text.removeText("Changes the look of blocks.")
	})
	event.add(["#handcrafted:cushions", ], PLACEABLE_TOOLTIP)
	event.add(["#handcrafted:counters", "#handcrafted:cupboards", "#handcrafted:drawers", "#handcrafted:shelves", "#handcrafted:trims"], HAMMER_TOOLTIP)
	add_shift_info(event, "#handcrafted:sheets", ["§9Can be put on:", "  §9- §bTables", "  §9- §bSide Tables", "  §9- §bDesks", "  §9- §bNightstands", "  §9- §bFancy Beds"])
	add_shift_info(event, "#handcrafted:cushions", ["§9Can be put on:", "  §9- §bCouches", "  §9- §bBenches", "  §9- §bChairs", "  §9- §bFancy Beds"])
	add_shift_info(event, "#handcrafted:counters", [
			"§9With a §bcalcite§9 counter top. Use these blocks to change its appearance!",
			"    §bOak§9, §bBirch§9, §bSpruce§9, §bJungle,",
			"    §bDark Oak§9, §bAcacia§9, §bWarped§9, §bCrimson,",
			"    §bMangrove§9, §bCherry§9, §bBamboo§9, §bQuartz,",
			"    §bStone§9, §bAndesite§9, §bGranite§9, §bDiorite,",
			"    §bBricks§9, §bBlackstone§9, §bSmooth Stone§9, §bDeepslate,",
			"    §bDripstone§9, §bCalcite.",
	])

	event.add(["#handcrafted:fancy_beds"],
			"§9Try putting on a §bCushion §9or §bSheet§9 for some extra colour!")
	event.add(["#handcrafted:tables", "#handcrafted:side_tables", "#handcrafted:desks", "#handcrafted:nightstands"],
			"§9Try putting any §bSheet§9 for some extra colour!")
	event.add(["#handcrafted:couches", "#handcrafted:benches", "#handcrafted:chairs"],
			"§9Try putting any §bCushion§9 for some extra colour!")

	add_shift_info(event, "handcrafted:hammer", [
			"§9Allows you to change the shape of",
			"§bCounters§9, §bCupboards§9, §bDrawers§9, §bShelves§9, §bTrims§9"])
})