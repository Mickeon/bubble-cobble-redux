
/**
 * @param {Special.CreativeModeTab} tab_id
 * @param {Internal.MutableComponent} to
 * @param {Special.Item} icon_item_id
 */
function rename_tab(tab_id, to, icon_item_id) {
	StartupEvents.modifyCreativeTab(tab_id, event => {
		event.setDisplayName(to)
		if (icon_item_id) {
			event.setIcon(Item.of(icon_item_id))
		}
	})
}
/** @param {Special.CreativeModeTab} tab_id */
function remove_tab(tab_id) {
	StartupEvents.modifyCreativeTab(tab_id, event => {
		event.remove("*")
	})
}

/**
 * @param {Special.CreativeModeTab} from_id
 * @param {Special.CreativeModeTab} to_id
 * @param {Special.Item[]} items
 */
function remove_and_merge_into_tab(from_id, to_id, items) {
	StartupEvents.modifyCreativeTab(from_id, event => {
		event.remove(items)
	})

	StartupEvents.modifyCreativeTab(to_id, event => {
		event.add(items)
	})
}

// rename_tab("kubejs:tab", Text.of("Bubble Cobble").color("#83BED9"))//, "kubejs:blue_mascot_cat")

rename_tab("create:base",                          " §6Create ")
rename_tab("create:palettes",                      " §6Create§r's Building Blocks ")
rename_tab("copycats:main",                        " §6Create: §rCopycats+ ")
rename_tab("copycats:functional",                  " §6Create: §rCopycats+ | Functional ")
rename_tab("createdeco:bricks_tab",                " §6Create: §rDeco's Bricks ")
rename_tab("createdeco:props_tab",                 " §6Create: §rDeco's Props ")
rename_tab("create_deepfried:base",                " §6Create: §rDeepfried ")
rename_tab("create_bic_bit:base",                  " §6Create: §r§rBitterballen ")

rename_tab("cobblemon:agriculture",    " §cCobblemon: §rAgriculture ",     "cobblemon:red_apricorn")
rename_tab("cobblemon:archaeology",    " §cCobblemon: §rArchaeology ")
rename_tab("cobblemon:blocks",         " §cCobblemon: §rBlocks ",          "cobblemon:healing_machine")
rename_tab("cobblemon:consumables",    " §cCobblemon: §rConsumables ",     "cobblemon:potion")
rename_tab("cobblemon:evolution_item", " §cCobblemon: §rEvolution Items ", "cobblemon:sun_stone")
rename_tab("cobblemon:held_item",      " §cCobblemon: §rHeld Items ")
rename_tab("cobblemon:pokeball",       " §cCobblemon: §rPoké Balls ")
rename_tab("cobblemon:utility_item",   " §cCobblemon: §rUtility ")

rename_tab("mega_showdown:key_tab",     " §cCobblemon: §r§9Mega Showdown ")
// rename_tab("mega_showdown:compi_tab",   " §cCobblemon: §r§9Mega Showdown §rCompetitive Items ")
// rename_tab("mega_showdown:dynamax_tab", " §cCobblemon: §r§9Mega Showdown §rDynamax ")
rename_tab("mega_showdown:mega_tab",    " §cCobblemon: §r§9Mega Showdown §rEvolution ")
rename_tab("mega_showdown:form_tab",    " §cCobblemon: §r§9Mega Showdown §rForm-changing ")
// rename_tab("mega_showdown:tera_tab",    " §cCobblemon: §r§9Mega Showdown §rTerastallization ")
rename_tab("mega_showdown:z_tab",       " §cCobblemon: §r§9Mega Showdown §rZ-Power ")

// rename_tab("cobblemonraiddens:raid_den_tab", " §cCobblemon: §rRaid Dens ")
// rename_tab("cobblenav:cobblenav",            " §cCobblemon: §rPokenav ")
// rename_tab("rctmod:creative_tab",            " §cCobblemon: §rRadical Trainers ")

rename_tab("farmersdelight:farmersdelight",   " §eFarmer's Delight ")
rename_tab("brewinandchewin:brewinandchewin", " §eFarmer's Delight: §rBrewin' and Chewin' ")
rename_tab("minersdelight:minersdelight",     " §eFarmer's Delight: §rMiner's Delight ")
rename_tab("mynethersdelight:main",           " §eFarmer's Delight: §rMy Nether's Delight ")

remove_tab("constructionstick:tab") // Items also exist in Tools & Utilities tab.
remove_tab("sophisticatedcore:main") // Only contains "sophisticatedcore:xp_bucket".
remove_tab("leafscopperbackport:leafs_copper_backport") // Items also exist in Tools & Utilities.
remove_tab("lootr:lootr") // Only contains "lootr:trophy".


// I need to do this to have the items appear in a proper order. Annoyingly manual.
remove_and_merge_into_tab("cobblenav:cobblenav", "cobblemon:utility_item", [
	"cobblenav:pokenav_item_base",
	"cobblenav:pokenav_item_white",
	"cobblenav:pokenav_item_light_gray",
	"cobblenav:pokenav_item_gray",
	"cobblenav:pokenav_item_black",
	"cobblenav:pokenav_item_brown",
	"cobblenav:pokenav_item_red",
	"cobblenav:pokenav_item_orange",
	"cobblenav:pokenav_item_yellow",
	"cobblenav:pokenav_item_lime",
	"cobblenav:pokenav_item_green",
	"cobblenav:pokenav_item_cyan",
	"cobblenav:pokenav_item_light_blue",
	"cobblenav:pokenav_item_blue",
	"cobblenav:pokenav_item_purple",
	"cobblenav:pokenav_item_magenta",
	"cobblenav:pokenav_item_pink",
	"cobblenav:pokenav_item_gholdengo",
	"cobblenav:pokenav_item_old",
	"cobblenav:pokenav_item_wanderer",
	"cobblenav:pokefinder_item_black",
	"cobblenav:pokefinder_item_blue",
	"cobblenav:pokefinder_item_green",
	"cobblenav:pokefinder_item_pink",
	"cobblenav:pokefinder_item_red",
	"cobblenav:pokefinder_item_white",
	"cobblenav:pokefinder_item_yellow",
	"cobblenav:fishingnav_item",
])

remove_and_merge_into_tab("cobblemonraiddens:raid_den_tab", "cobblemon:utility_item", [
	"cobblemonraiddens:raid_crystal_block",
	"cobblemonraiddens:raid_pouch",
	"cobblemonraiddens:cheer_attack",
	"cobblemonraiddens:cheer_defense",
	"cobblemonraiddens:cheer_heal",
])

remove_and_merge_into_tab("rctmod:creative_tab", "cobblemon:utility_item", [
	"rctmod:trainer_card",
	"rctmod:trainer_spawner",
	"rctmod:trainer_repel_rod",
])


remove_and_merge_into_tab("mega_showdown:compi_tab", "mega_showdown:key_tab", [
	"mega_showdown:booster_energy",
	"mega_showdown:legend_plate",
	"mega_showdown:adamant_orb",
	"mega_showdown:griseous_orb",
	"mega_showdown:lustrous_orb",
	"mega_showdown:adrenaline_orb",
	"mega_showdown:soul_dew",
])

remove_and_merge_into_tab("mega_showdown:dynamax_tab", "mega_showdown:key_tab", [
	"mega_showdown:dynamax_band",
	"mega_showdown:dynamax_candy",
	"mega_showdown:max_soup",
	"mega_showdown:sweet_max_soup",
	"mega_showdown:wishing_star",
	"mega_showdown:power_spot",
	"mega_showdown:max_mushroom",
	"mega_showdown:wishing_star_crystal",
])

remove_and_merge_into_tab("mega_showdown:tera_tab", "mega_showdown:key_tab", [
	"mega_showdown:normal_tera_shard",
	"mega_showdown:fire_tera_shard",
	"mega_showdown:water_tera_shard",
	"mega_showdown:electric_tera_shard",
	"mega_showdown:grass_tera_shard",
	"mega_showdown:ice_tera_shard",
	"mega_showdown:fighting_tera_shard",
	"mega_showdown:poison_tera_shard",
	"mega_showdown:ground_tera_shard",
	"mega_showdown:flying_tera_shard",
	"mega_showdown:psychic_tera_shard",
	"mega_showdown:bug_tera_shard",
	"mega_showdown:rock_tera_shard",
	"mega_showdown:ghost_tera_shard",
	"mega_showdown:dragon_tera_shard",
	"mega_showdown:dark_tera_shard",
	"mega_showdown:steel_tera_shard",
	"mega_showdown:fairy_tera_shard",
	"mega_showdown:stellar_tera_shard",
	"mega_showdown:tera_orb",
	"mega_showdown:likos_pendant",
	"mega_showdown:dormant_crystal",
])

remove_tab("haventrowel:haventrowel_tab")
remove_tab("sereneseasons:main")
StartupEvents.modifyCreativeTab("minecraft:redstone_blocks", event => {
	event.add("sereneseasons:season_sensor")
})
StartupEvents.modifyCreativeTab("minecraft:tools_and_utilities", event => {
	event.add("sereneseasons:calendar")
	event.add("haventrowel:trowel")
})
