// priority: 10

const COPPER_BUTTONS = [
	"copperagebackport:copper_button", "copperagebackport:exposed_copper_button", "copperagebackport:oxidized_copper_button", "copperagebackport:weathered_copper_button",
	"copperagebackport:waxed_copper_button", "copperagebackport:waxed_exposed_copper_button", "copperagebackport:waxed_oxidized_copper_button",  "copperagebackport:waxed_weathered_copper_button"
]
const COPPER_CHAINS = [
	"minecraft:copper_chain", "minecraft:exposed_copper_chain", "minecraft:weathered_copper_chain", "minecraft:oxidized_copper_chain",
	"minecraft:waxed_copper_chain", "minecraft:waxed_exposed_copper_chain", "minecraft:waxed_weathered_copper_chain", "minecraft:waxed_oxidized_copper_chain"
]
const COPPER_CHESTS = [
	"minecraft:copper_chest", "minecraft:exposed_copper_chest", "minecraft:weathered_copper_chest", "minecraft:oxidized_copper_chest",
	"minecraft:waxed_copper_chest", "minecraft:waxed_exposed_copper_chest", "minecraft:waxed_oxidized_copper_chest", "minecraft:waxed_weathered_copper_chest",
]

const PLACARDS = [
	"create:placard",
	"createdeco:black_placard",
	"createdeco:blue_placard",
	"createdeco:brown_placard",
	"createdeco:cyan_placard",
	"createdeco:gray_placard",
	"createdeco:green_placard",
	"createdeco:light_blue_placard",
	"createdeco:light_gray_placard",
	"createdeco:lime_placard",
	"createdeco:magenta_placard",
	"createdeco:orange_placard",
	"createdeco:pink_placard",
	"createdeco:purple_placard",
	"createdeco:red_placard",
	"createdeco:yellow_placard"
]

ServerEvents.tags("item", event => {
	// Accidental omissions from the mod creators.
	// Some of these mods add them in the block tags, but not the item tags.
	event.add("minecraft:rails", "create:controller_rail") // Reported: https://github.com/Creators-of-Create/Create/pull/9684
	event.add("minecraft:fishes", "create_bic_bit:raw_herring", "create_bic_bit:cooked_herring")
	event.add("c:foods/raw_fish", "create_bic_bit:raw_herring", "minersdelight:squid", "minersdelight:glow_squid", "minersdelight:tentacles") // We only really use this ourselves for haunting Zinc. Perhaps these definitions should be removed.
	event.add("c:foods/safe_raw_fish", "create_bic_bit:raw_herring")
	event.add("c:foods/cooked_fish", "create_bic_bit:cooked_herring")
	event.add("c:foods/food_poisoning", "minersdelight:copper_carrot", "minersdelight:bat_wing", "minersdelight:arthropod", "minersdelight:squid", "mynethersdelight:ghasta", "mynethersdelight:ghast_dough")
	event.add("c:foods/edible_when_placed", "#farmersdelight:feasts") // Reported and fixed. Remove next mod update: https://github.com/vectorwing/FarmersDelight/issues/1234. Stuffed Squid & co. missing. For our case we can just assume every Feast counts.
	event.add("c:paper", "create_bic_bit:dirty_paper")
	event.add("c:buckets", "sliceanddice:fertilizer_bucket", "create_bic_bit:ketchup_bucket", "create_bic_bit:mayonnaise_bucket", "create_bic_bit:frying_oil_bucket", "biomesoplenty:blood_bucket", "undergroundworlds:quicksand_bucket", "biomesoplenty:liquid_null_bucket", "sophisticatedcore:xp_bucket") // TODO: Report this.
	event.add("c:buckets/entity_water", "create_bic_bit:herring_bucket") // Reported: https://discord.com/channels/1141667941935501442/1448294211542716550/1448294211542716550
	event.add("c:drinks", "#c:drinks/tea", "create_bic_bit:ketchup_bottle", "create_bic_bit:mayonnaise_bottle", "create_bic_bit:frying_oil_bottle") // Reported: https://discord.com/channels/1141667941935501442/1448294211542716550/1448294211542716550
	event.add("c:drinks/tea", "herbalbrews:green_tea", "herbalbrews:black_tea", "herbalbrews:hibiscus_tea", "herbalbrews:lavender_tea", "herbalbrews:rooibos_tea", "herbalbrews:oolong_tea", "herbalbrews:yerba_mate_tea") // TODO: Report this.
	event.add("c:drinks/juice", "kubejs:berry_juice_soda", "biomeswevegone:aloe_vera_juice")
	event.add("supplementaries:statue_swords", "#minecraft:swords", "#minecraft:spears")
	event.add("cobblemon:water_stone_ores", "mega_showdown:mega_meteorid_water_ore") // Reported: https://github.com/yajatkaul/CobblemonMegaShowdown/issues/144
	event.add("cobblemon:dawn_stone_ores", "mega_showdown:mega_meteorid_dawn_ore")
	event.add("cobblemon:dusk_stone_ores", "mega_showdown:mega_meteorid_dusk_ore")
	event.add("cobblemon:fire_stone_ores", "mega_showdown:mega_meteorid_fire_ore")
	event.add("cobblemon:ice_stone_ores", "mega_showdown:mega_meteorid_ice_ore")
	event.add("cobblemon:leaf_stone_ores", "mega_showdown:mega_meteorid_leaf_ore")
	event.add("cobblemon:moon_stone_ores", "mega_showdown:mega_meteorid_moon_ore")
	event.add("cobblemon:shiny_stone_ores", "mega_showdown:mega_meteorid_shiny_ore")
	event.add("cobblemon:sun_stone_ores", "mega_showdown:mega_meteorid_sun_ore")
	event.add("cobblemon:thunder_stone_ores", "mega_showdown:mega_meteorid_thunder_ore")
	event.add("c:nuggets", "minecraft:copper_nugget", "#c:nuggets/industrial_iron", "#c:nuggets/netherite") // Reported: https://github.com/talrey/CreateDeco/issues/234 , but not the copper nuggets.
	event.add("c:plates", "#c:plates/industrial_iron")
	event.add("c:ingots", "#c:ingots/industrial_iron")
	event.add("c:tools/spear", "#minecraft:spears")
	event.add("c:storage_blocks", "#c:storage_blocks/industrial_iron")
	event.add("c:storage_blocks/industrial_iron", "create:industrial_iron_block")
	event.add("minecraft:piglin_loved", "solonion:golden_lunchbox", "handcrafted:golden_thin_pot", "handcrafted:golden_thick_pot", "handcrafted:golden_wide_pot", "handcrafted:golden_medium_pot") //Reported: https://github.com/terrarium-earth/Handcrafted/issues/152
	event.add("minecraft:horse_food", "biomeswevegone:green_apple") // TODO: Report this.
	event.add("c:music_discs", "cnc:music_disc_slough_choir", "cnc:music_disc_wreck_of_the_old_97", "cnc:music_disc_hills")
	event.removeAll("minecraft:music_discs") // This tag doesn't exist anymore.
	event.add("minecraft:pickaxes", "undergroundworlds:temple_pickaxe", "undergroundworlds:freezing_pickaxe") // Reported: https://codeberg.org/HexagonNico/UndergroundWorlds/issues/3
	event.add("minecraft:axes", "undergroundworlds:temple_axe", "undergroundworlds:freezing_axe", "undergroundworlds:axe_of_regrowth")
	event.add("minecraft:hoes", "undergroundworlds:temple_hoe", "undergroundworlds:freezing_hoe")
	event.add("minecraft:shovels", "undergroundworlds:temple_shovel", "undergroundworlds:freezing_shovel")
	event.add("minecraft:swords", "undergroundworlds:temple_sword", "undergroundworlds:freezing_sword", "undergroundworlds:blade_of_the_jungle")
	event.add("minecraft:buttons", COPPER_BUTTONS)
	event.remove("create:chain_rideable", COPPER_CHAINS) // They didn't realise this was plainly wrong.
	event.add("c:chests", COPPER_CHESTS) // TODO: Report this. They have the block tag, but not the item tag.

	// More compatibility.
	event.add("cobblemon:held/leaves_leftover", "create:honeyed_apple", "biomeswevegone:green_apple")
	event.add("brewinandchewin:raw_meats", "#c:foods/raw_meat")
	event.add("c:cheese", "#brewinandchewin:foods/cheese_wedge") // Required because we disabled Bitterballen's cheese.
	event.add("c:drinks/milk", "minersdelight:milk_cup")
	event.add("c:foods/milk", "minersdelight:milk_cup", "cobblemon:moomoo_milk") // Deprecated tag.
	event.add("cobblemon:pokedex_screen", "mowziesmobs:glowing_jelly")
	event.add("supplementaries:pedestal_downright", "#c:tools/spear")
	event.add("supplementaries:pedestal_upright", "#c:tools/knives", "mega_showdown:rusted_sword")
	event.add("supplementaries:statue_tools", "#yo_hooks:hooks", "#constructionstick:construction_sticks", "minecraft:mace", "kubejs:trowel", "kubejs:ruler")

	// Makes sense.
	event.add("c:tools", "#constructionstick:construction_sticks", "#yo_hooks:hooks")
	event.add("c:bones", "cnc:wishbone", "cnc:lucky_wishbone", "cnc:unlucky_wishbone", "#cnc:antlers")
	event.add("c:eggs", "undergroundworlds:spider_egg", "sleep_tight:bedbug_eggs")
	event.add("c:mushrooms", "ribbits:toadstool") // No, it doesn't make sense?
	event.add("create:pulpifiable", "biomeswevegone:shrub", "biomeswevegone:firecracker_flower_bush", "cobblemon:medicinal_leek")
	event.add("create_bic_bit:tulip", "#biomeswevegone:flowers/tulips")
	event.add("soulbound:enchantable", "#c:tools")
	event.add("create:blaze_burner_fuel/regular", "#simpletms:type_fire_tr", "cobblemon:charcoal_stick", "cobblemon:fire_stone", "mega_showdown:fire_tera_shard", "mynethersdelight:bullet_pepper", "mynethersdelight:pepper_powder" )
	event.add("create:blaze_burner_fuel/special", "#simpletms:type_fire_tm", "cobblemon:fire_gem", "cobblemon:fire_stone_block", "mega_showdown:firium_z", "kubejs:firebomb_whiskey",
		"mynethersdelight:chilidog", "mynethersdelight:hot_cream", "mynethersdelight:hot_cream_cone",
		"mynethersdelight:spicy_hoglin_stew", "mynethersdelight:hot_wings", "mynethersdelight:hot_wings_bucket",
		"mynethersdelight:spicy_curry", "mynethersdelight:rock_soup", "minersdelight:rock_soup_cup",
		"minersdelight:spicy_hoglin_stew_cup", "minersdelight:spicy_noodle_soup_cup", "mynethersdelight:fried_hoglin_chop",
		"mynethersdelight:spicy_noodle_soup", "mynethersdelight:plate_of_ghasta_with_cream",
		"mynethersdelight:magma_cake_slice", "mynethersdelight:magma_cake_block",
	)
	event.add("amendments:sets_on_fire", "#create:blaze_burner_fuel/special",
		"minecraft:campfire", "minecraft:soul_campfire", "minecraft:lava_bucket", "supplementaries:fire_pit",
		"biomesoplenty:burning_blossom", "cobblemon:fire_stone", "mega_showdown:fire_tera_shard",
		"mynethersdelight:bullet_pepper", "mynethersdelight:pepper_powder", "mynethersdelight:powdery_torch"
	)

	// Shared in a bunch of places.
	event.add("bubble_cobble:coinstacks", /^createdeco:.*coinstack$/)

	event.add("bubble_cobble:emi/chest_loot_icon","minecraft:chest", "minecraft:barrel", "lootr:lootr_barrel", "lootr:lootr_chest", "lootr:lootr_shulker", "lootr:decorated_pot", "lootrmon:gilded_chest", "cobblemonraiddens:raid_pouch")
	event.add("bubble_cobble:emi/block_drops_icon", "#c:ore_rates/singular")

	// Why not? It's fun.
	event.add("supplementaries:blackboard_white",      "minecraft:sugar", "cobblemon:white_apricorn", "cobblemon:white_mint_leaf", "arts_and_crafts:white_paintbrush", "arts_and_crafts:white_chalk_stick")
	event.add("supplementaries:blackboard_light_gray", "minecraft:iron_ingot", "minecraft:clay_ball", "arts_and_crafts:light_gray_paintbrush", "arts_and_crafts:light_gray_chalk_stick")
	event.add("supplementaries:blackboard_gray",       "supplementaries:ash", "supplementaries:ash_brick", "arts_and_crafts:gray_paintbrush", "arts_and_crafts:gray_chalk_stick")
	event.add("supplementaries:blackboard_black",      "minecraft:ink_sac", "minecraft:flint", "minecraft:netherite_ingot", "cobblemon:black_apricorn", "arts_and_crafts:black_paintbrush", "arts_and_crafts:black_chalk_stick")
	event.add("supplementaries:blackboard_brown",      "create:bar_of_chocolate", "arts_and_crafts:brown_paintbrush", "arts_and_crafts:brown_chalk_stick")
	event.add("supplementaries:blackboard_red",        "minecraft:redstone", "minecraft:beetroot", "minecraft:nether_wart", "minecraft:brick", "cobblemon:red_apricorn", "cobblemon:red_mint_leaf", "biomeswevegone:red_glowcane_powder", "arts_and_crafts:red_paintbrush", "arts_and_crafts:red_chalk_stick")
	event.add("supplementaries:blackboard_orange",     "minecraft:copper_ingot", "arts_and_crafts:orange_paintbrush", "arts_and_crafts:orange_chalk_stick")
	event.add("supplementaries:blackboard_yellow",     "minecraft:gold_ingot", "cobblemon:yellow_apricorn", "biomeswevegone:yellow_glowcane_powder", "arts_and_crafts:yellow_paintbrush", "arts_and_crafts:yellow_chalk_stick")
	event.add("supplementaries:blackboard_lime",       "minecraft:emerald", "cobblemon:green_mint_leaf", "biomeswevegone:green_glowcane_powder", "arts_and_crafts:lime_paintbrush", "arts_and_crafts:lime_chalk_stick")
	event.add("supplementaries:blackboard_green",      "minecraft:moss_block", "minecraft:moss_carpet", "minersdelight:moss", "cobblemon:green_apricorn", "arts_and_crafts:green_paintbrush", "arts_and_crafts:green_chalk_stick")
	event.add("supplementaries:blackboard_cyan",       "minecraft:prismarine_shard", "cobblemon:cyan_mint_leaf", "arts_and_crafts:cyan_paintbrush", "arts_and_crafts:cyan_chalk_stick")
	event.add("supplementaries:blackboard_light_blue", "minecraft:diamond", "biomesoplenty:glowworm_silk", "biomeswevegone:blue_glowcane_powder", "arts_and_crafts:light_blue_paintbrush", "arts_and_crafts:light_blue_chalk_stick")
	event.add("supplementaries:blackboard_blue",       "minecraft:lapis_lazuli", "cobblemon:blue_apricorn", "cobblemon:blue_mint_leaf", "biomeswevegone:blueberries", "arts_and_crafts:blue_paintbrush", "arts_and_crafts:blue_chalk_stick")
	event.add("supplementaries:blackboard_purple",     "minecraft:amethyst_shard", "arts_and_crafts:purple_paintbrush", "arts_and_crafts:purple_chalk_stick")
	event.add("supplementaries:blackboard_magenta",    "arts_and_crafts:magenta_paintbrush", "arts_and_crafts:magenta_chalk_stick")
	event.add("supplementaries:blackboard_pink",       "cobblemon:pink_apricorn", "arts_and_crafts:pink_paintbrush", "arts_and_crafts:pink_chalk_stick")

	event.add("supplementaries:hourglass_dusts",
		"#biomeswevegone:glowcane_powder",
		"#cobblemon:remedies",
		"create:powdered_obsidian",
		"createmonballsoverhaul:black_tumblestone_dust",
		"createmonballsoverhaul:sky_tumblestone_dust",
		"createmonballsoverhaul:tumblestone_dust",
		"cobblemon:bright_powder",
		"cobblemon:metal_powder",
		"cobblemon:quick_powder",
		"cobblemon:silver_powder",
		"cobblemon:soft_sand",
		"mynethersdelight:pepper_powder",
		"rarcompat:mimi_dust",
	)
	event.add("supplementaries:pancake_syrup", "create:chocolate_bucket")
	event.add("supplementaries:causes_lightning_when_held", "constructionstick:copper_stick", "minecraft:copper_sword", "minecraft:copper_axe") // Funny.
	event.add("supplementaries:overencumbering", "#create:toolboxes", "#create:packages", /sophisticatedstorage:.*shulker_box/)

	// Make Construction sticks enchantable with Mending and Unbreaking.
	event.add("minecraft:enchantable/durability", "#constructionstick:construction_sticks")

	// Allow Netherite Grappling Hook to be repaired with Diamond and Netherite Scrap
	// This is part of the Mending Rework rebalance.
	event.add("yo_hooks:netherite_repairable", "minecraft:diamond", "minecraft:netherite_scrap")

	// We reserve Accessories for Mega Showdown, and use Curios for Backpacks/Artifacts.
	event.removeAll("accessories:back")
	event.removeAll("accessories:hat")
	event.removeAll("accessories:necklace")
	event.removeAll("accessories:hand")
	event.removeAll("accessories:belt")
	event.removeAll("accessories:shoes")

	event.add("curios:back", "#supplementaries:sacks")

	// Allow more tools to ride Chain Conveyors, as not everyone has a Wrench in hand.
	event.add("create:chain_rideable", "#minecraft:pickaxes", "#minecraft:hoes")

	// Allow some swords to harvest Straw.
	// Currently can't do, as no durability is removed from non-knife tools.
	// event.add("farmersdelight:straw_harvesters", "minecraft:stone_sword", "minecraft:copper_sword", "mowziesmobs:naga_fang_dagger")

	// Bugged.
	event.add("supplementaries:cannon_blacklist", "#comforts:sleeping_bags")

	// Entirely redundant and confusing.
	event.removeAll("c:foods/cooked_meats") // Deprecated version of `c:foods/cooked_meat`
	event.removeAll("c:foods/fruits") // Deprecated version of `c:foods/fruit`
	event.removeAll("c:foods/soups") // Deprecated version of `c:foods/soup`
	event.removeAll("c:foods/cooked_fishes") // Deprecated version of `c:foods/cooked_fish`
	event.removeAll("c:tools/spears") // Deprecated version of `c:tools/spear`

	// Note that these also require specific definitions in the `seasonings` data folder.
	event.add("cobblemon:recipe_filters/tea_seasoning",
		"arts_and_crafts:bleachdew",
		"create:builders_tea",
		"farmersdelight:hot_cocoa",
		"farmersdelight:milk_bottle",
		"kubejs:blue_mascot_cat",
		"minersdelight:milk_cup",
		"supplementaries:soap",
	)
	event.add("cobblemon:recipe_filters/nutrition_seasoning",
		"arts_and_crafts:bleachdew",
		"supplementaries:soap",
		"brewinandchewin:apple_jelly",
		"brewinandchewin:glow_berry_marmalade",
		"brewinandchewin:sweet_berry_jam",
	)
})

ServerEvents.tags("block", event => {
	// Accidental omissions from the mod creators.
	event.add("c:ropes", "farmersdelight:rope") // Reported and fixed. Remove next mod update: https://github.com/vectorwing/FarmersDelight/issues/1233
	event.add("c:chests", "#minecraft:copper_chests", "undergroundworlds:ice_chest", "undergroundworlds:temple_chest", "undergroundworlds:web_covered_chest") // Reported: https://codeberg.org/HexagonNico/UndergroundWorlds/issues/2
	event.add("minecraft:all_signs", "supplementaries:way_sign_wall") // https://github.com/MehVahdJukaar/Supplementaries/pull/1921
	event.add("minecraft:wither_summon_base_blocks", "mynethersdelight:resurgent_soil") // https://github.com/SoyTutta/MyNethersDelight/issues/121
	event.add("minecraft:hoglin_repellents", "mynethersdelight:warped_fungus_colony") // https://github.com/SoyTutta/MyNethersDelight/issues/121
	event.add("minecraft:enchantment_power_provider", "#handcrafted:shelves") // https://github.com/terrarium-earth/Handcrafted/issues/136
	event.add("minecraft:guarded_by_piglins", "handcrafted:golden_thin_pot", "handcrafted:golden_thick_pot", "handcrafted:golden_wide_pot", "handcrafted:golden_medium_pot") // Reported: https://github.com/terrarium-earth/Handcrafted/issues/152
	event.add("cobblemon:machines", "simpletms:machine_tm")
	// event.add("create:single_block_inventories", "supplementaries:sack", "supplementaries:safe", "supplementaries:pulley_block") // TODO: Report this. // Commenting out as a test.
	event.add("minecraft:buttons", COPPER_BUTTONS)
	event.add("minecraft:mineable/pickaxe", COPPER_BUTTONS)
	event.add("createdeco:placards", PLACARDS)
	event.add("farmersdelight:mineable/knife", "#c:ropes") // Just to include Supplementaries's rope. Probably should be reported.
	// Reported a bunch: https://github.com/MehVahdJukaar/Supplementaries/pull/1922, https://gitlab.com/cable-mc/cobblemon/-/merge_requests/2174.
	event.add("minecraft:combination_step_sound_blocks",
		"#bubble_cobble:coinstacks",
		"#snowyspirit:gumdrops",
		"brewinandchewin:coaster", // Reported: https://github.com/ChrysanthCow/BrewinAndChewin/pull/110
		"cobblemon:tatami_mat",
		"farmersdelight:basket", "farmersdelight:canvas_rug", "farmersdelight:cutting_board", "farmersdelight:full_tatami_mat", "farmersdelight:half_tatami_mat", // Reported: https://github.com/vectorwing/FarmersDelight/pull/1252
		"supplementaries:bamboo_spikes", "supplementaries:crank", "supplementaries:doormat", "supplementaries:pancake", // Reported: https://github.com/MehVahdJukaar/Supplementaries/pull/1932
		"yungscavebiomes:ice_sheet"
	)
	event.add("create:brittle", // Allows these blocks to be assembled/unassembled in contraptions without destroying themselves.
		"#brewinandchewin:cheese_wheels/unripe", "#brewinandchewin:cheese_wheels/ripe", "brewinandchewin:coaster", "brewinandchewin:pizza", "brewinandchewin:quiche",
		"#supplementaries:candle_holders", "#supplementaries:sconces", "#supplementaries:buntings", "supplementaries:sconce_lever", "supplementaries:pancake", "supplementaries:barnacles", "supplementaries:crank", "supplementaries:item_shelf", "supplementaries:doormat", "supplementaries:ash", "supplementaries:gunpowder", // Reported and partially fixed for next time https://github.com/MehVahdJukaar/Supplementaries/pull/1933.
		"#snowyspirit:gumdrops", "snowyspirit:wreath",
		// Unfortunately manual. Also somewhat reported: https://github.com/vectorwing/FarmersDelight/issues/1255.
		"farmersdelight:apple_pie", "farmersdelight:chocolate_pie", "farmersdelight:sweet_berry_cheesecake", "farmersdelight:honey_glazed_ham_block", "farmersdelight:shepherds_pie_block", "farmersdelight:rice_roll_medley_block",
		"minersdelight:fake_meatloaf", "minersdelight:glazed_arachnid_limbs", "minersdelight:stuffed_squid",
		"mynethersdelight:stuffed_hoglin", "mynethersdelight:striderloaf_block", "mynethersdelight:cold_striderloaf_block", "mynethersdelight:ghasta_with_cream_block", "mynethersdelight:bread_loaf_block", "mynethersdelight:magma_cake_block",
	)
	event.add("create:movable_empty_collider", "#supplementaries:timber_frames", ) // Reported and fixed for next time: https://github.com/MehVahdJukaar/Supplementaries/pull/1935
	event.add("minecraft:doors", "copycats:copycat_iron_door") // TODO: Report this. Also missing for item tag.
	event.add("minecraft:trapdoors", "copycats:copycat_trapdoor", "copycats:copycat_iron_trapdoor") // TODO: Report this. Also missing for item tag.

	// Other omissions that make sense.
	event.add("create:windmill_sails", "#supplementaries:flags")
	event.add("create:fan_transparent",	"farmersdelight:safety_net", "#supplementaries:buntings", "supplementaries:wind_vane", /^minecraft:.*copper_(bars|trapdoor)$/, /ladder$/, "cobblemon:water_stone_block", "cobblemon:fire_stone_block") // Fun. // Reported: https://github.com/vectorwing/FarmersDelight/discussions/1250
	event.add("create:fan_processing_catalysts/splashing", "cobblemon:water_stone_block")
	event.add("create:fan_processing_catalysts/smoking", "cobblemon:campfire")
	event.add("create:fan_processing_catalysts/blasting", "mynethersdelight:magma_cake_block", "cobblemon:fire_stone_block")
	event.add("create:wrench_pickup", "supplementaries:bellows", "supplementaries:crank", "supplementaries:cog_block", "supplementaries:crystal_display", "supplementaries:faucet", "supplementaries:gunpowder", "supplementaries:relayer", "supplementaries:redstone_illuminator", "create:turntable", "supplementaries:spring_launcher", "supplementaries:gunpowder", "supplementaries:sconce_lever") // TODO: Report this.
	event.add("supplementaries:water_holder", "minersdelight:sticky_basket") // TODO: Report this? Supplementaries can't account for everyone, can it?
	event.add("minecraft:mineable/shear", "farmersdelight:rope")
	event.add("herbalbrews:allows_cooking", "mynethersdelight:nether_stove")
	event.add("amendments:stairs_carpets", "#bubble_cobble:coinstacks", "biomesoplenty:glowing_moss_carpet", "cobblemon:tatami_mat", "minecraft:snow", "supplementaries:ash") // https://github.com/MehVahdJukaar/amendments/pull/403.

	// Shared in a bunch of places.
	event.add("bubble_cobble:coinstacks", /^createdeco:.*coinstack$/)

	// Bugged. See also https://github.com/terrarium-earth/Handcrafted/issues/132.
	event.add("c:relocation_not_supported",	"#handcrafted:nightstands", "#handcrafted:desks", "#handcrafted:counters", "#handcrafted:tables", "#handcrafted:benches", "#handcrafted:couches")

	// Weird, and bugged.
	event.add("supplementaries:un_rotatable", "#c:relocation_not_supported", "#lootr:containers")

	event.add("bubble_cobble:very_hot", "#farmersdelight:heat_sources")
	event.add("supplementaries:lights_gunpowder", "#bubble_cobble:very_hot") // This has weird consequences (e.g. Campfire lights up Gunpowder)
	event.add("create:passive_boiler_heaters", "#bubble_cobble:very_hot")
	event.add("minecraft:strider_warm_blocks", "#bubble_cobble:very_hot")
	event.add("bubble_cobble:very_cold",  "cobblemon:ice_stone_block", "yungscavebiomes:rare_ice", /undergroundworlds:ice_/)
	event.add("brewinandchewin:freeze_sources", "#bubble_cobble:very_cold")

	// Normally these can't be chopped, yet they essentially make up some trees.
	event.add("treechop:leaves_like", "#c:storage_blocks/allium")

	// Makes the items that drop from these fall straight instead of scattering.
	event.add("drizzleproof:static_blocks", "#c:ropes")

	// Allow Gravestones to replace way more blocks than defined normally.
	event.add("gravestone:grave_replaceable", "#minecraft:replaceable", "#minecraft:replaceable_by_trees", "#c:ropes")

	event.add("create:copycat_allow", "minecraft:beehive", "minecraft:bee_nest", "supplementaries:speaker_block", "supplementaries:notice_board", "supplementaries:turn_table")

	if (Platform.isLoaded("connectiblechains")) {
		event.add("connectiblechains:chain_connectible", /_bars$/, "#minecraft:lightning_rods")
	}

	if (Platform.isLoaded("urban_decor")) {
		event.add("amendments:stairs_carpets", /^urban_decor:.*_towel$/)
		event.add("create:brittle", /^urban_decor:.*(piano|grandfather_clock|picture_frame|plastic_lights)/ )
		event.add("minecraft:combination_step_sound_blocks", /^urban_decor:.*_towel$/) // Reported: https://github.com/Yirmiri/Urban-Decor/issues/6
		event.add("minecraft:doors", "urban_decor:stainless_steel_door") // TODO: Report this. Also missing for item tag.
		event.add("minecraft:trapdoors", "urban_decor:stainless_steel_trapdoor") // TODO: Report this. Also missing for item tag.
	}
})

ServerEvents.tags("fluid", event => {
	event.add("create:bottomless/allow", "biomesoplenty:blood")
	event.add("create:fan_processing_catalysts/smoking", "supplementaries:lumisene")
	event.add("create:fan_processing_catalysts/haunting", "biomesoplenty:liquid_null", "biomesoplenty:flowing_liquid_null")
})

ServerEvents.tags("entity_type", event => {
	event.add("supplementaries:urn_spawn", "minecraft:tropical_fish", "minecraft:rabbit", "cnc:mouse") // Funny.
	// event.add("supplementaries:ash_blacklist", "minecraft:allay", "") // TODO: Report this. No mob seems to drop ash for some reason?
	// Tee-hee.
	event.add("supplementaries:cage_catchable", "minecraft:copper_golem")
	event.add("supplementaries:flute_pet", "minecraft:copper_golem", "minecraft:iron_golem", "minecraft:snow_golem", "minecraft:player", "minecraft:turtle")
	event.add("artifacts:creepers", "undergroundworlds:icy_creeper")
	event.add("create:ignore_seat", "minecraft:bee")
})

ServerEvents.tags("damage_type", event => {
	event.add("minecraft:bypasses_cooldown",
		"minecraft:starve",
		"minecraft:fall", // Fixes being able to avoid fall damage by taking any amount of damage.
		"#minecraft:is_projectile", // Make multi-shot way more powerful, and projectile mobs way more dangerous.
		"#minecraft:is_explosion",
	)
})

ServerEvents.tags("worldgen/biome", event => {
// 	event.add("kubejs:is_cherry", "minecraft:cherry_grove", "biomesoplenty:snowblossom_grove")
// 	event.add("kubejs:is_snowy_forest", "biomesoplenty:auroral_garden", "biomesoplenty:muskeg", "biomesoplenty:snowy_maple_woods") // Akin to "#cobblemon:is_snowy_forest".
// 	event.add("kubejs:is_snowy_taiga", "minecraft:grove", "minecraft:snowy_taiga", "biomesoplenty:snowy_coniferous_forest", "biomesoplenty:snowy_fir_clearing", "biomesoplenty:snowy_maple_woods") // Akin to "#cobblemon:is_snowy_taiga".
// 	event.add("kubejs:is_meadow", "minecraft:meadow", "biomesoplenty:field", "biomesoplenty:highland", "biomesoplenty:highland_moor", "biomesoplenty:rocky_shrubland", "biomesoplenty:clover_patch") // Akin to "#repurposed_structures:collections/meadows".
// 	event.add("kubejs:is_regular_forest", "minecraft:forest", "biomesoplenty:cherry_blossom_grove", "biomesoplenty:orchard", "biomesoplenty:seasonal_forest", "biomesoplenty:woodland", "old_growth_woodland") // Akin to "#repurposed_structures:collections/regular_forests".

	// Reported: https://gitlab.com/cable-mc/cobblemon/-/issues/1790
	event.add("cobblemon:is_forest", "biomesoplenty:jacaranda_glade", "biomesoplenty:aspen_glade")
	event.add("cobblemon:is_floral", "biomesoplenty:jacaranda_glade")
	event.add("cobblemon:is_cold", "biomesoplenty:aspen_glade")
	event.add("cobblemon:is_plains", "biomesoplenty:overgrown_greens")
	event.add("cobblemon:is_magical", "biomesoplenty:aspen_glade")

	event.add("cobblemon:is_cherry_blossom", "biomesoplenty:snowblossom_grove")
	event.add("cobblemon:nether/is_forest", "#c:is_nether_forest") // For some reason the Cobblemon tag is empty normally.

	event.add("c:is_floral", "biomesoplenty:lavender_field", "biomesoplenty:orchard", "biomesoplenty:lush_savanna")
	event.add("c:is_spooky", "biomeswevegone:pale_bog")
	event.add("c:is_dead", "biomeswevegone:pale_bog")

	event.add("mss:has_structure/cherry_biomes", "biomesoplenty:snowblossom_grove")
	event.add("c:primary_wood_type/cherry", "biomesoplenty:snowblossom_grove") // Used by MVS.

	event.add("mss:has_structure/ocean_biomes", "#minecraft:is_ocean") // The original tag only includes vanilla and #c:is_water/overworld?

	event.add("yungsextras:has_structure/desert_decorations", "#c:is_desert")
	event.add("yungsextras:has_structure/swamp_structures", "#c:is_swamp")
	event.add("yungsextras:has_structure/vanilla_desert_well", "#c:is_desert")

	event.add("repurposed_structures:collections/caves", "#c:is_cave") // TODO: Report this. Possible typo. The tag contains #c:is_caves on its own.
	event.add("repurposed_structures:collections/taigas", "#biomeswevegone:taiga") // Maybe not using minecraft:is_taiga is intentional, as it's too encompassing?

	event.add("nova_structures:collections/cherry_forests", "biomesoplenty:snowblossom_grove")
	event.add("nova_structures:collections/caves", "#c:is_cave") // TODO: Report this?
	event.add("nova_structures:collections/floral", "#c:is_floral") // TODO: Report this?
	event.add("nova_structures:collections/snowy_structures", "biomesoplenty:snowblossom_grove")
	event.add("nova_structures:collections/taiga", "#minecraft:is_taiga")
	event.add("nova_structures:collections/snowy_plains", "#c:is_snowy_plains") // TODO: Report this? Accidentally includes non-existent "c:snowy_plains". Doesn't change anything for us.

	// TODO: Fill Awesome Dungeon's tags. They're really brief and don't encompass anything.
	// event.add("awesomedungeon:has_structure/abandoned_oak_palace_biomes", "")
	// event.add("variantsandventures:collections/deserts")
	// event.add("undergroundworlds:has_structure/chillager_outpost")


	event.add("supplementaries:has_basalt_ash", "biomesoplenty:volcanic_plains", "biomesoplenty:volcano")
	event.add("snowyspirit:has_gingerbread_house", "#c:is_snowy") // TODO: Report this.

	// This does not work. Specific biomes would have to be removed more thoroughly because of the c:is_swamp tag.
	// event.remove("cnc:blackbear_spawning", "biomeswevegone:pale_bog") // I don't know if this even works.
	// event.remove("cnc:goose_spawning", "biomeswevegone:pale_bog") // I don't know if this even works.

	// There's got to be a bunch of biomes to fill here...
	// event.add("nova_structures:collections/giant_trees", "")
	// event.add("nova_structures:collections/meadows", "")
	// event.add("nova_structures:collections/regular_forests", "")
	// event.add("nova_structures:collections/rocky_mountains", "")

	// 	event.add("idas:collections/idasblack_deserts", "biomesoplenty:volcanic_plains", "biomesoplenty:volcano")
	// 	event.add("idas:collections/idasfloral", "#forge:floral")
	// 	event.add("idas:collections/idasflower_forests", "#forge:floral", "biomesoplenty:lavender_forest", "biomesoplenty:mystic_grove")
	// 	event.add("idas:collections/idasplains", "#forge:is_plains")
	// 	event.add("idas:collections/snowy_plains", "#kubejs:is_snowy_forest")

	if (Platform.isLoaded("urban_decor")) {
		event.add("urban_decor:azure_polyanthous_generates_in", "#minecraft:is_jungle", "#c:is_snowy", "#c:is_flower_forest")
		event.add("urban_decor:cherry_polyanthous_generates_in", "#minecraft:is_jungle", "#minecraft:is_forest", "#c:is_flower_forest")
		event.add("urban_decor:daffodil_polyanthous_generates_in", "#c:is_plains", "#c:is_birch_forest", "#c:is_flower_forest")
		event.add("urban_decor:mint_polyanthous_generates_in", "#minecraft:is_taiga", "#c:is_old_growth", "#c:is_mountain/peak", "#c:is_flower_forest")
		event.add("urban_decor:ruby_polyanthous_generates_in", "biomesoplenty:snowblossom_grove", "#c:is_flower_forest")
		event.add("urban_decor:spring_polyanthous_generates_in", "#c:is_dark_forest", "#c:is_flower_forest")
	}
})

ServerEvents.tags("worldgen/structure", event => {
	// For advancement.
	event.add("bubble_cobble:ships",
		"supplementaries:galleon",
		"awesomedungeonocean:frigate_medium",
		"awesomedungeonocean:frigate_large",
	)
})