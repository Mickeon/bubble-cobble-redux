// NOTE: Sounds's block definitions refresh after a full restart.

ServerEvents.tags("block", event => {
	// These sound like coins shattering.
	event.add("bubble_cobble:raw_gold_block_sounds", /^createdeco:.*coinstack$/)
	event.add("bubble_cobble:sandstone_sounds", "#c:sandstone/blocks") // Mutes Presence Footsteps for some reason.

	for (const wood_type of ["birch", "spruce", "jungle", "acacia", "mangrove"]) {
		event.add(`bubble_cobble:${wood_type}_planks_sounds`,
			`farmersdelight:${wood_type}_cabinet`,
			`sophisticatedstorage:${wood_type}_storage_connector`,
			`supplementaries:way_sign_${wood_type}`,
		)
		event.add(`bubble_cobble:${wood_type}_object_sounds`,
			`handcrafted:${wood_type}_bench`,
			`handcrafted:${wood_type}_chair`,
			`handcrafted:${wood_type}_corner_trim`,
			`handcrafted:${wood_type}_couch`,
			`handcrafted:${wood_type}_counter`,
			`handcrafted:${wood_type}_cupboard`,
			`handcrafted:${wood_type}_desk`,
			`handcrafted:${wood_type}_dining_bench`,
			`handcrafted:${wood_type}_drawer`,
			`handcrafted:${wood_type}_fancy_bed`,
			`handcrafted:${wood_type}_nightstand`,
			`handcrafted:${wood_type}_pillar_trim`,
			`handcrafted:${wood_type}_shelf`,
			`handcrafted:${wood_type}_side_table`,
			`handcrafted:${wood_type}_table`,
			`minecraft:${wood_type}_shelf`,
		)
	}
	// A bit arbitrary.
	event.add("bubble_cobble:clay_bricks_sounds", /^createdeco:.*brick/, "supplementaries:gravel_bricks", "supplementaries:suspicious_gravel_bricks")
	event.add("bubble_cobble:end_stone_bricks_sounds", /^create:.*brick/, "supplementaries:ash_bricks", "supplementaries:ash_bricks_stairs", "supplementaries:ash_bricks_slab", "supplementaries:ash_bricks_wall")

	event.add("minecraft:combination_step_sound_blocks", "yungscavebiomes:ice_sheet", "#snowyspirit:gumdrops")
	// event.add("minecraft:inside_step_sound_blocks", "")

	// All of the ones below are defined in `sounds/blocks` instead.
	// event.add("bubble_cobble:bookshelf_sounds", "#c:bookshelves")
	// event.add("bubble_cobble:glass_sounds", "")
	// This sounds like a very sturdy metal, with a bit of a high-pitched "pling".
	// event.add("bubble_cobble:gold_sounds", "")
	// event.add("bubble_cobble:sand_sounds", "#minecraft:sand")
	// event.add("bubble_cobble:barrel_sounds", "#c:barrels/wooden", /^sophisticatedstorage:.*barrel/)
	// event.add("bubble_cobble:chest_sounds", /^sophisticatedstorage:.*chest/)
	// These sound like sturdy stone with a pitch of coin shattering.
	// event.add("bubble_cobble:gold_ore_sounds", "#minecraft:gold_ores") // No point.
})

ServerEvents.tags("item", event => {
	event.add("bubble_cobble:pokenavs", "#cobblenav:pokenav", "cobblenav:pokenav_item_gholdengo", "cobblenav:pokenav_item_wanderer")
	event.add("bubble_cobble:pokefinders", /^cobblenav:pokefinder_item/)
	event.add("more_sounds:plates", "create:schedule")
	event.add("more_sounds:papers", "via_romana:charting_map", "wanderer_ribbit:ribbit_map", "cobblemon:blunder_policy", "cobblemon:cleanse_tag", "cobblemon:red_card", "cobblemon:spell_tag", "cobblemon:weakness_policy")
})