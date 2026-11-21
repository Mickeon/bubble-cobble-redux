// requires: numismatics

StartupEvents.registry("block", event => {
	event.create("bubble_cobble:selling_bin")
			.property(BlockProperties.HORIZONTAL_FACING)
			.soundType(SoundType.BAMBOO_WOOD)
			.hardness(3)
			.parentModel("minecraft:block/cube_all")
			.textures({
				all: "bubble_cobble:block/chiseled_mud_bricks"
			})
			.placementState(callback => {
				callback.set(BlockProperties.HORIZONTAL_FACING, callback.getHorizontalDirection().getOpposite())
			})
			.blockEntity(info => {
				info.inventory("inventory", ["up", "down", "east", "north", "south", "west"], 9, 4, /** @param {$ItemStack} item */ (item) => item.hasTag("bubble_cobble:sellable") || item.hasTag("numismatics:coins"))
				info.rightClickOpensInventory("inventory")
				info.serverTicking()
				info.tickOffset(SEC * 0.5)
				info.tickFrequency(SEC * 30)
			})
			.tagBlock([
				"minecraft:guarded_by_piglins",
				"minecraft:mineable/axe",
			])
			.item(item => {
				item.tooltip(Text.translateWithFallback("", "Sells everyday at %s", Text.of(`6:00 am`).aqua()).darkGray())
				item.tag([
					"more_sounds:wooden"
				])
			})
})

const SellingManager = global.SellingManager = exports.SellingManager = {
	/** @param {$ItemStack} */
	get_price(item_stack) {
		return this.get_individual_price(item_stack) * item_stack.getCount()
	},

	/** @param {$ItemStack} @returns {number} */
	get_individual_price(item_stack) {
		return this.item_prices[item_stack.id] || 0
	},

	/** @type {Record<RegistryTypes.Item, number>} */
	item_prices: {
		// Everybody say "Thanks Sunlit Valley" for a starting point of reference.
		// Raw materials.
		"minecraft:raw_copper": 4,
		"minecraft:raw_copper_block": 36,
		"minecraft:raw_iron": 8,
		"minecraft:raw_iron_block": 72,
		"minecraft:coal": 8,
		"minecraft:coal_block": 72,
		"minecraft:raw_gold": 16,
		"minecraft:raw_gold_block": 144,
		"create:raw_zinc": 8,
		"create:raw_zinc_block": 72,
		"minecraft:redstone": 8,
		"minecraft:redstone_block": 72,
		"minecraft:emerald": 32,
		"minecraft:emerald_block": 288,
		"minecraft:amethyst_shard": 8,
		"minecraft:amethyst_block": 32,
		"minecraft:quartz": 8,
		"minecraft:quartz_block": 32,
		"minecraft:diamond": 256,
		"minecraft:diamond_block": 2304,
		"minecraft:netherite_scrap": 1024,

		// Herbal Brews.
		"herbalbrews:coffee": 48,
		"herbalbrews:hazelnut_coffee": 90,
		"herbalbrews:cinnamon_coffee": 138,
		"herbalbrews:milk_coffee": 112,
		"herbalbrews:yerba_mate_tea": 12,
		"herbalbrews:hibiscus_tea": 16,
		"herbalbrews:rooibos_tea": 20,
		"herbalbrews:lavender_tea": 16,
		"herbalbrews:green_tea": 144,
		"herbalbrews:black_tea": 1296,
		"herbalbrews:chai_tea": 2643,
		"herbalbrews:oolong_tea": 3840,
		"herbalbrews:dried_green_tea": 120,
		"herbalbrews:dried_black_tea": 1080,
		"herbalbrews:dried_oolong_tea": 3200,

		// === Culinary.
		// Crafting Table
		"create:chocolate_glazed_berries": 34 * 1.4,
		"create:bar_of_chocolate": 30 * 1.4,
		"create:sweet_roll": 64 * 1.4,
		"create:builders_tea": 352 * 1.4,
		"create:honeyed_apple": 32 * 1.4,
		"farmersdelight:grilled_salmon": 111 * 1.4,
		"farmersdelight:roasted_mutton_chops": 134 * 1.4,
		"farmersdelight:sweet_berry_cheesecake": 454 * 1.4,
		"farmersdelight:sweet_berry_cheesecake_slice": 114 * 1.4,
		"farmersdelight:nether_salad": 288 * 1.4,
		"farmersdelight:melon_popsicle": 52 * 1.4,
		"farmersdelight:salmon_roll": 36 * 1.4,
		"farmersdelight:cod_roll": 56 * 1.4,
		"farmersdelight:fruit_salad": 164 * 1.4,
		"farmersdelight:mixed_salad": 74 * 1.4,
		"farmersdelight:kelp_roll": 73 * 1.4,
		"farmersdelight:kelp_roll_slice": 26 * 1.4,
		"farmersdelight:cabbage_rolls": 102 * 1.4,
		"farmersdelight:hamburger": 153 * 1.4,
		"farmersdelight:chicken_sandwich": 114 * 1.4,
		"farmersdelight:bacon_sandwich": 171 * 1.4,
		"farmersdelight:mutton_wrap": 114 * 1.4,
		"farmersdelight:stuffed_potato": 92 * 1.4,
		"farmersdelight:barbecue_stick": 58 * 1.4,
		"farmersdelight:egg_sandwich": 28 * 1.4,
		"farmersdelight:steak_and_potatoes": 144 * 1.4,
		"farmersdelight:chocolate_pie": 660 * 1.4,
		"farmersdelight:chocolate_pie_slice": 165 * 1.4,
		"farmersdelight:honey_glazed_ham_block": 240 * 1.4,
		"farmersdelight:honey_glazed_ham": 60 * 1.4,
		"farmersdelight:shepherds_pie_block": 261 * 1.4,
		"farmersdelight:shepherds_pie": 65 * 1.4,
		"farmersdelight:rice_roll_medley_block": 290 * 1.4,
		"farmersdelight:apple_pie": 597 * 1.4,
		"farmersdelight:apple_pie_slice": 150 * 1.4,
		"farmersdelight:cake_slice": 64 * 1.4,
		"farmersdelight:melon_juice": 213 * 1.4,
		"farmersdelight:roast_chicken_block": 243 * 1.4,
		"farmersdelight:roast_chicken": 60 * 1.4,
		"farmersdelight:honey_cookie": 64 * 1.4,
		"farmersdelight:sweet_berry_cookie": 8 * 1.4,
		"minecraft:cookie": 12 * 1.4,
		"minecraft:bread": 16 * 1.4,
		"minecraft:pumpkin_pie": 87 * 1.4,
		"minecraft:mushroom_stew": 16 * 1.4,
		"minecraft:cake": 318 * 1.4,
		"minecraft:rabbit_stew": 239 * 1.4,
		"snowyspirit:candy_cane": 4 * 1.4,
		"snowyspirit:eggnog": 44 * 1.4,
		"snowyspirit:gingerbread_cookie": 8 * 1.4,
		"supplementaries:candy": 24 * 1.4,
		// Furnace.
		"farmersdelight:smoked_ham": 64 * 1.5,
		"minecraft:cooked_beef": 16 * 1.5,
		"minecraft:baked_potato": 24 * 1.5,
		"minecraft:cooked_porkchop": 32 * 1.5,
		"minecraft:cooked_rabbit": 64 * 1.5,
		"minecraft:cooked_mutton": 16 * 1.5,
		"minecraft:cooked_chicken": 8 * 1.5,
		"minecraft:cooked_salmon": 24 * 1.5,
		"minecraft:cooked_cod": 16 * 1.5,
		"minecraft:popped_chorus_fruit": 16 * 1.5,
		// Cooking Pot.
		"farmersdelight:pasta_with_meatballs": 84 * 2.0,
		"farmersdelight:mushroom_rice": 72 * 2.0,
		"farmersdelight:squid_ink_pasta": 165 * 2.0,
		"farmersdelight:beef_stew": 64 * 2.0,
		"farmersdelight:apple_cider": 179 * 2.0,
		"farmersdelight:chicken_soup": 120 * 2.0,
		"farmersdelight:glow_berry_custard": 215 * 2.0,
		"farmersdelight:ratatouille": 129 * 2.0,
		"farmersdelight:cooked_rice": 16 * 2.0,
		"farmersdelight:vegetable_soup": 144 * 2.0,
		"farmersdelight:fried_rice": 84 * 2.0,
		"farmersdelight:noodle_soup": 87 * 2.0,
		"farmersdelight:vegetable_noodles": 136 * 2.0,
		"farmersdelight:fish_stew": 154 * 2.0,
		"farmersdelight:pasta_with_mutton_chop": 110 * 2.0,
		"farmersdelight:tomato_sauce": 52 * 2.0,
		"farmersdelight:hot_cocoa": 27 * 2.0,
		"farmersdelight:pumpkin_soup": 140 * 2.0,
		"farmersdelight:stuffed_pumpkin_block": 300 * 2.0,
		"farmersdelight:stuffed_pumpkin": 75 * 2.0,
		"farmersdelight:dumplings": 102 * 2.0,
		"minecraft:beetroot_soup": 72 * 2.0,

		// Fish!
		"minecraft:pufferfish": 16,
		"minecraft:salmon": 24,
		"minecraft:cod": 16,
		"minecraft:tropical_fish": 72,
		"crittersandcompanions:koi_fish": 340,

		// Miscellaneous.
		"create:experience_nugget": 2,
		"create:experience_block": 18,
		"crittersandcompanions:clam": 512,
		"crittersandcompanions:silk": 128,
		"minecraft:leather": 8,
		"minecraft:rabbit_hide": 12,
		"minecraft:rabbit_foot": 12,
		"minecraft:feather": 16,
		"minecraft:golden_apple": 128,
		"minecraft:enchanted_golden_apple": 4096,
		"minecraft:dragon_breath": 4,
		"minecraft:experience_bottle": 8,
		"minecraft:echo_shard": 192,
		"minecraft:heart_of_the_sea": 256,
		"minecraft:nether_star": 2048,
		"minecraft:dragon_egg": 3072,
		"minecraft:angler_pottery_sherd": 192,
		"minecraft:snort_pottery_sherd": 192,
		"minecraft:shelter_pottery_sherd": 192,
		"minecraft:archer_pottery_sherd": 80,
		"minecraft:skull_pottery_sherd": 80,
		"minecraft:miner_pottery_sherd": 80,
		"minecraft:prize_pottery_sherd": 80,
		"minecraft:brewer_pottery_sherd": 128,
		"minecraft:arms_up_pottery_sherd": 128,
		"minecraft:explorer_pottery_sherd": 192,
		"minecraft:blade_pottery_sherd": 192,
		"minecraft:mourner_pottery_sherd": 192,
		"minecraft:plenty_pottery_sherd": 192,
		"minecraft:sheaf_pottery_sherd": 80,
		"minecraft:burn_pottery_sherd": 80,
		"minecraft:danger_pottery_sherd": 80,
		"minecraft:friend_pottery_sherd": 80,
		"minecraft:heart_pottery_sherd": 80,
		"minecraft:heartbreak_pottery_sherd": 80,
		"minecraft:howl_pottery_sherd": 80,
		"minecraft:totem_of_undying": 448,
		"minecraft:dragon_head": 4608,
		"minecraft:goat_horn": 512,
		"farmersdelight:straw": 3,
		"farmersdelight:straw_bale": 27,
		"farmersdelight:canvas": 12,
	},
}
