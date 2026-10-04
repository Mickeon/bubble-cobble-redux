// requires: displaydelight

let $BlockAssociations = Java.loadClass("com.jkvin114.displaydelight.init.BlockAssociations")
let $AbstractItemBlock = Java.loadClass("com.jkvin114.displaydelight.block.AbstractItemBlock")

// I want these to only show up when looking them up in the Creative Tabs.
ServerEvents.tags("item", event => {
	Ingredient.of("@displaydelight").getItemStream().forEach(item => {
		const block = item.block
		if (block instanceof $AbstractItemBlock) {
			if (block.getStackFor().isEmpty()) {
				// The display item's original food item does not exist in the modpack.
				event.add("c:hidden_from_recipe_viewers", item)
			}

			if ($BlockAssociations.getItemFor(block) != Items.AIR) {
				// The display item has an exact food item corresponding to it.
				// Showing it is redundant because the item can easily be placed and is properly documented.
				event.add("c:hidden_from_recipe_viewers", item)
			}
		}
	})
})

ServerEvents.tags("block", event => {
	event.add("displaydelight:support_exceptions",
		/^urban_decor:.*?(bathtub|piano|grandfather_clock)/,
		"#createdeco:support_wedges",
		"create:copycat_panel",
		"copycats:copycat_vertical_step",
		"copycats:copycat_ghost_block",
		"copycats:copycat_byte",
		"copycats:copycat_vertical_slope",
		"supplementaries:blackboard",
		"supplementaries:crystal_display",
	)
})

// Allow placing all food with corresponding display items down while sneaking,
// Just without the plates.
BlockEvents.rightClicked(event => {
	if (!event.player.isShiftKeyDown()
	|| !(event.item.hasTag("displaydelight:plate_displayable") || event.item.hasTag("displaydelight:small_plate_displayable"))
	) {
		return
	}
	const {item, player, hand, level} = event
	const display_block = (item.hasTag("displaydelight:plate_displayable")
		? $BlockAssociations.getPlateBlockFor(item)
		: $BlockAssociations.getSmallPlateBlockFor(item))
	if (display_block == Blocks.AIR) {
		return
	}
	// console.log(`${item} has a corresponding display block: ${display_block}`)

	const interaction_result = display_block.asItem().useOn(new $UseOnContext(player, hand, event.hitResult))
	if (interaction_result == "consume") {
		let placed_level_block = event.block.offset(event.facing)
		if (placed_level_block.block != display_block) {
			console.error(`Somehow the block placed down does not correspond to ${display_block}. Abort.`)
			return
		}
		placed_level_block.setBlockState(Block.withProperties(
			placed_level_block.getBlockState(),
			{plate_hidden: true, stacks: "1"}
		))
		play_sound_globally(level, placed_level_block.getPos().getCenter(), display_block.getSoundType().getPlaceSound(), "blocks", 1.0, 1.25)
		// item.consume(1, player) // useOn() does the consumption.
		player.swing(hand, true)
		event.success()
	}
})
