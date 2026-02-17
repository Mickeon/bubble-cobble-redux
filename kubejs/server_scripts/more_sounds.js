// NOTE: Sounds's block definitions refresh after a full restart.

ServerEvents.tags("block", event => {
	/**
	 * @param {Special.Mod} namespace
	 * @param {string} wood_type
	 * @param {"birch" | "spruce" | "jungle" | "acacia" | "mangrove"} sound_type
	 */
	function associate_wood_type_with_sound(namespace, wood_type, sound_type) {
		const combined_prefix = `${namespace}:${wood_type}`
		const combined_stripped_prefix = `${namespace}:stripped_${wood_type}`

		event.add(`bubble_cobble:sounds/${sound_type}_leaves`,
			`${combined_prefix}_leaves`,
			`${combined_prefix}_sapling`,
		)
		event.add(`bubble_cobble:sounds/${sound_type}_log`,
			`${combined_prefix}_log`,
			`${combined_prefix}_wood`,
		)
		event.add(`bubble_cobble:sounds/${sound_type}_planks`,
			`${combined_stripped_prefix}_log`,
			`${combined_stripped_prefix}_wood`,
			`${combined_prefix}_planks`,
			`${combined_prefix}_slab`,
			`${combined_prefix}_stairs`,
		)
		event.add(`bubble_cobble:sounds/${sound_type}_object`,
			`${combined_prefix}_button`,
			`${combined_prefix}_door`,
			`${combined_prefix}_fence`,
			`${combined_prefix}_fence_gate`,
			`${combined_prefix}_pressure_plate`,
			`${combined_prefix}_sign`,
			`${combined_prefix}_wall_sign`,
			`${combined_prefix}_trapdoor`,
		)

		const wood_crafting_table_id = `${combined_prefix}_crafting_table`
		if (Block.getBlock(wood_crafting_table_id)) {
			event.add(`bubble_cobble:sounds/${sound_type}_planks`, wood_crafting_table_id)
		}
	}

	// TODO: Cherry sound for Sakura wood type.
	associate_wood_type_with_sound("biomeswevegone", "aspen", "birch")
	associate_wood_type_with_sound("biomeswevegone", "baobab", "birch")
	associate_wood_type_with_sound("biomeswevegone", "cika", "jungle")
	associate_wood_type_with_sound("biomeswevegone", "cypress", "mangrove")
	associate_wood_type_with_sound("biomeswevegone", "ebony", "spruce")
	associate_wood_type_with_sound("biomeswevegone", "fir", "jungle")
	associate_wood_type_with_sound("biomeswevegone", "holly", "birch")
	associate_wood_type_with_sound("biomeswevegone", "ironwood", "birch")
	associate_wood_type_with_sound("biomeswevegone", "jacaranda", "birch")
	associate_wood_type_with_sound("biomeswevegone", "mahogany", "jungle")
	associate_wood_type_with_sound("biomeswevegone", "maple", "jungle")
	associate_wood_type_with_sound("biomeswevegone", "palm", "birch")
	associate_wood_type_with_sound("biomeswevegone", "pine", "spruce")
	associate_wood_type_with_sound("biomeswevegone", "redwood", "spruce")
	associate_wood_type_with_sound("biomeswevegone", "skyris", "acacia")
	associate_wood_type_with_sound("biomeswevegone", "spirit", "mangrove")
	associate_wood_type_with_sound("biomeswevegone", "white_mangrove", "mangrove")
	associate_wood_type_with_sound("biomeswevegone", "willow", "spruce")
	associate_wood_type_with_sound("biomeswevegone", "witch_hazel", "jungle")
	associate_wood_type_with_sound("biomeswevegone", "zelkova", "acacia")

	// Many sounds are also defined in their respective sounds/blocks files. This script is for the more programmatic ones.
	// These sound like coins shattering.
	event.add("bubble_cobble:sounds/raw_gold_block", /^createdeco:.*coinstack$/)
	event.add("bubble_cobble:sounds/sandstone", "#c:sandstone/blocks") // Mutes Presence Footsteps for some reason.

	for (const wood_type of ["birch", "spruce", "jungle", "acacia", "mangrove"]) {
		event.add(`bubble_cobble:sounds/${wood_type}_planks`,
			`farmersdelight:${wood_type}_cabinet`,
			`sophisticatedstorage:${wood_type}_storage_connector`,
		)
		event.add(`bubble_cobble:sounds/${wood_type}_object`,
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
	event.add("bubble_cobble:sounds/clay_bricks", /^createdeco:.*brick/, "supplementaries:gravel_bricks", "supplementaries:suspicious_gravel_bricks")
	event.add("bubble_cobble:sounds/end_stone_bricks", /^create:.*brick/, "supplementaries:ash_bricks", "supplementaries:ash_bricks_stairs", "supplementaries:ash_bricks_slab", "supplementaries:ash_bricks_wall")

	event.add("minecraft:combination_step_sound_blocks", "yungscavebiomes:ice_sheet", "#snowyspirit:gumdrops")
	// event.add("minecraft:inside_step_sound_blocks", "")
})

ServerEvents.tags("item", event => {
	event.add("bubble_cobble:pokenavs", "#cobblenav:pokenav", "cobblenav:pokenav_item_gholdengo", "cobblenav:pokenav_item_wanderer")
	event.add("bubble_cobble:pokefinders", /^cobblenav:pokefinder_item/)
	event.add("more_sounds:plates", "create:schedule")
	event.add("more_sounds:papers", "via_romana:charting_map", "wanderer_ribbit:ribbit_map", "cobblemon:blunder_policy", "cobblemon:cleanse_tag", "cobblemon:red_card", "cobblemon:spell_tag", "cobblemon:weakness_policy")
})