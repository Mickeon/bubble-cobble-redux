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
	event.add("bubble_cobble:sounds/raw_gold_block", "#bubble_cobble:coinstacks")
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
})

ServerEvents.tags("item", event => {
	event.add("more_sounds:plates", "create:schedule")
	event.add("more_sounds:papers", "via_romana:charting_map", "wanderer_ribbit:ribbit_map", "cobblemon:blunder_policy", "cobblemon:cleanse_tag", "cobblemon:red_card", "cobblemon:spell_tag", "cobblemon:weakness_policy")

	// For the Sounds mod, using a single tag is currently considerably more performance-efficient, especially for so many individual item entries.
	event.add("bubble_cobble:sounds/sticky_sturdy",
		"#brewinandchewin:foods/cheese_wedge",
		"#c:foods/fruit",
		"#farmersdelight:snacks",
		"#mynethersdelight:stuffed_hoglin_items",
		"brewinandchewin:cheesy_pasta",
		"brewinandchewin:cocoa_fudge",
		"brewinandchewin:horror_lasagna",
		"brewinandchewin:jerky",
		"brewinandchewin:kimchi",
		"brewinandchewin:kippers",
		"brewinandchewin:scarlet_pierogi",
		"brewinandchewin:pickled_pickles",
		"brewinandchewin:pizza",
		"brewinandchewin:pizza_slice",
		"brewinandchewin:quiche",
		"brewinandchewin:quiche_slice",
		"brewinandchewin:vegetable_omelet",
		"biomeswevegone:green_apple_pie",
		"biomeswevegone:blueberry_pie",
		"create:blaze_cake",
		"create:blaze_cake_base",
		"create:bar_of_chocolate",
		"create:chocolate_glazed_berries",
		"create_bic_bit:chocolate_glazed_stroopwafel",
		"create_bic_bit:churros",
		"create_bic_bit:coated_churros",
		"create_bic_bit:wrapped_chocolate_glazed_stroopwafel",
		"create_bic_bit:wrapped_churros",
		"create_bic_bit:wrapped_coated_churros",
		"create_bic_bit:raw_fries",
		"create_bic_bit:raw_churros",
		"create_deepfried:blooming_onion",
		"create_deepfried:chicken_nuggets",
		"create_deepfried:chocolate_filled_berliner",
		"create_deepfried:coated_chocolate_berliner",
		"create_deepfried:coated_honey_berliner",
		"create_deepfried:deepfried_chocolate_bar",
		"create_deepfried:glow_berry_chocolate_glazed_donut",
		"create_deepfried:glow_berry_honey_glazed_donut",
		"create_deepfried:honey_filled_berliner",
		"create_deepfried:honey_glazed_donut",
		"create_deepfried:lava_chicken",
		"create_deepfried:onion_rings",
		"create_deepfried:raw_chicken_nuggets",
		"create_deepfried:raw_onion_rings",
		"create_deepfried:raw_springroll",
		"create_deepfried:raw_tempura",
		"create_deepfried:sweet_berry_chocolate_glazed_donut",
		"create_deepfried:sweet_berry_honey_glazed_donut",
		"farmersdelight:apple_pie",
		"farmersdelight:apple_pie_slice",
		"farmersdelight:cake_slice",
		"farmersdelight:chocolate_pie",
		"farmersdelight:chocolate_pie_slice",
		"farmersdelight:dog_food",
		"farmersdelight:ham",
		"farmersdelight:honey_glazed_ham",
		"farmersdelight:honey_glazed_ham_block",
		"farmersdelight:pie_crust",
		"farmersdelight:shepherds_pie_block",
		"farmersdelight:shepherds_pie",
		"farmersdelight:smoked_ham",
		"farmersdelight:sweet_berry_cheesecake",
		"farmersdelight:sweet_berry_cheesecake_slice",
		"farmersdelight:raw_pasta",
		"farmersdelight:roast_chicken",
		"minecraft:honeycomb",
		"minecraft:honeycomb_block",
		"minecraft:pumpkin_pie",
		"minersdelight:baked_squid",
		"minersdelight:baked_tentacles",
		"minersdelight:bat_wing",
		"minersdelight:bat_rolls",
		"minersdelight:bowl_of_stuffed_squid",
		"minersdelight:glow_ink_pasta",
		"minersdelight:golden_nutritional_bar",
		"minersdelight:improvised_barbecue_stick",
		"minersdelight:nutritional_bar",
		"minersdelight:pasta_with_veggieballs",
		"minersdelight:plate_of_fake_meatloaf",
		"minersdelight:plate_of_glazed_arachnid_limbs",
		"minersdelight:smoked_bat_wing",
		"minersdelight:squid_sandwich",
		"minersdelight:takoyaki",
		"minersdelight:tentacles_on_a_stick",
		"minersdelight:vegan_steak_and_potatoes",
		"minersdelight:vegan_wrap",
		"mynethersdelight:bacon-wrapped_sausage_on_a_stick",
		"mynethersdelight:bleeding_tartar",
		"mynethersdelight:breakfast_sampler",
		"mynethersdelight:crimson_stroganoff",
		"mynethersdelight:giant_takoyaki",
		"mynethersdelight:hotdog",
		"mynethersdelight:hotdog_with_mixed_salad",
		"mynethersdelight:hotdog_with_nether_salad",
		"mynethersdelight:sausage_and_potatoes",
		"mynethersdelight:scotch_eggs",
		"mynethersdelight:strider_with_grilled_fungus",
		"mynethersdelight:raw_stuffed_hoglin",
		"mynethersdelight:red_loin_on_a_stick",
    	"supplementaries:soap",
	)
	event.add("bubble_cobble:sounds/sticky_crunchy",
		"arts_and_crafts:lotus_pistils",
		"farmersdelight:canvas",
		"farmersdelight:cooked_rice",
		"farmersdelight:fried_rice",
		"farmersdelight:fried_egg",
		"farmersdelight:horse_feed",
		"farmersdelight:mushroom_rice",
		"farmersdelight:rotten_tomato",
		"farmersdelight:tree_bark",
		"herbalbrews:dried_black_tea",
		"herbalbrews:dried_green_tea",
		"herbalbrews:dried_oolong_tea",
	)
	event.add("bubble_cobble:sounds/glass_frozen",
		"brewinandchewin:apple_jelly",
		"brewinandchewin:glow_berry_marmalade",
		"brewinandchewin:sweet_berry_jam",
		"cobblemon:never_melt_ice",
		"farmersdelight:glow_berry_custard",
		"farmersdelight:melon_popsicle",
		"mynethersdelight:tear_popsicle",
	)
	event.add("bubble_cobble:sounds/spicy_food",
		"minersdelight:rock_soup_cup",
		"minersdelight:spicy_hoglin_stew_cup",
		"minersdelight:spicy_noodle_soup_cup",
		"mynethersdelight:bullet_pepper",
		"mynethersdelight:burnt_roll",
		"mynethersdelight:chilidog",
		"mynethersdelight:deviled_egg",
		"mynethersdelight:fried_hoglin_chop",
		"mynethersdelight:hot_wings",
		"mynethersdelight:hot_cream_cone",
		"mynethersdelight:magma_cake_slice",
		"mynethersdelight:sizzling_pudding",
		"mynethersdelight:spicy_curry",
		"mynethersdelight:spicy_hoglin_stew",
		"mynethersdelight:spicy_noodle_soup",
		"mynethersdelight:stuffed_pepper",
		"mynethersdelight:spicy_skewer",
		"mynethersdelight:plate_of_ghasta_with_cream",
		"mynethersdelight:rock_soup"
	)
})