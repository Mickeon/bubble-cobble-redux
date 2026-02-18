
/** @import {$MutableComponent} from "net.minecraft.network.chat.MutableComponent" */

/**
 * @param {Special.CreativeModeTab} tab_id
 * @param {$MutableComponent} to
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
rename_tab("createmonballsoverhaul:create_cobblemon_balls_overhaul_items_tab", " §cCobblemon: §6Create §rBalls Overhaul ")

rename_tab("farmersdelight:farmersdelight",   " §eFarmer's Delight ")
rename_tab("brewinandchewin:brewinandchewin", " §eFarmer's Delight: §rBrewin' and Chewin' ")
rename_tab("minersdelight:minersdelight",     " §eFarmer's Delight: §rMiner's Delight ")
rename_tab("mynethersdelight:main",           " §eFarmer's Delight: §rMy Nether's Delight ")

remove_tab("constructionstick:tab") // Items also exist in Tools & Utilities tab.
remove_tab("sophisticatedcore:main") // Only contains "sophisticatedcore:xp_bucket".
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
	"mega_showdown:custom_tera_shard",
	"mega_showdown:tera_orb",
	"mega_showdown:likos_pendant",
	"mega_showdown:dormant_crystal",
	"mega_showdown:tera_pouch_white",
	"mega_showdown:tera_pouch_orange",
	"mega_showdown:tera_pouch_magenta",
	"mega_showdown:tera_pouch_light_blue",
	"mega_showdown:tera_pouch_yellow",
	"mega_showdown:tera_pouch_lime",
	"mega_showdown:tera_pouch_pink",
	"mega_showdown:tera_pouch_gray",
	"mega_showdown:tera_pouch_light_gray",
	"mega_showdown:tera_pouch_cyan",
	"mega_showdown:tera_pouch_purple",
	"mega_showdown:tera_pouch_blue",
	"mega_showdown:tera_pouch_brown",
	"mega_showdown:tera_pouch_green",
	"mega_showdown:tera_pouch_red",
	"mega_showdown:tera_pouch_black",
])

remove_and_merge_into_tab("zamega:zamega_tab", "mega_showdown:mega_tab", [
	"zamega:absolitez",
	"zamega:barbaracite",
	"zamega:baxcalibrite",
	"zamega:chandelurite",
	"zamega:chesnaughtite",
	"zamega:chimechoite",
	"zamega:clefablite",
	"zamega:crabominite",
	"zamega:darkranite",
	"zamega:delphoxite",
	"zamega:dragalgite",
	"zamega:dragoninite",
	"zamega:drampanite",
	"zamega:eelektrossite",
	"zamega:emboarite",
	"zamega:excadrite",
	"zamega:falinksite",
	"zamega:feraligite",
	"zamega:floettite",
	"zamega:froslassite",
	"zamega:garchompitez",
	"zamega:glimmoranite",
	"zamega:golisopite",
	"zamega:golurkite",
	"zamega:greninjite",
	"zamega:hawluchanite",
	"zamega:heatranite",
	"zamega:lucarionitez",
	"zamega:magearnite",
	"zamega:malamarite",
	"zamega:meganiumite",
	"zamega:meowsticite",
	"zamega:pyroarite",
	"zamega:raichunitex",
	"zamega:raichunitey",
	"zamega:scolipite",
	"zamega:scovillainite",
	"zamega:scraftinite",
	"zamega:skarmorite",
	"zamega:staraptite",
	"zamega:starminite",
	"zamega:tatsugirinite",
	"zamega:victreebelite",
	"zamega:zeraorite",
	"zamega:zygardite",
	"zamega:ange",
])

remove_and_merge_into_tab("simpletms:tm_storage_items", "cobblemon:utility_item", [
	"simpletms:case_tm",
	"simpletms:case_tr",
	"simpletms:machine_tm",
])

remove_and_merge_into_tab("createmonballsoverhaul:create_cobblemon_balls_overhaul_lids_tab",
	"createmonballsoverhaul:create_cobblemon_balls_overhaul_items_tab", [
		"createmonballsoverhaul:red_ball_lid",
		"createmonballsoverhaul:yellow_ball_lid",
		"createmonballsoverhaul:green_ball_lid",
		"createmonballsoverhaul:blue_ball_lid",
		"createmonballsoverhaul:pink_ball_lid",
		"createmonballsoverhaul:black_ball_lid",
		"createmonballsoverhaul:white_ball_lid",
		"createmonballsoverhaul:great_ball_lid",
		"createmonballsoverhaul:ultra_ball_lid",
		"createmonballsoverhaul:safari_ball_lid",
		"createmonballsoverhaul:level_ball_lid",
		"createmonballsoverhaul:heavy_ball_lid",
		"createmonballsoverhaul:love_ball_lid",
		"createmonballsoverhaul:friend_ball_lid",
		"createmonballsoverhaul:moon_ball_lid",
		"createmonballsoverhaul:fast_ball_lid",
		"createmonballsoverhaul:lure_ball_lid",
		"createmonballsoverhaul:sport_ball_lid",
		"createmonballsoverhaul:park_ball_lid",
		"createmonballsoverhaul:net_ball_lid",
		"createmonballsoverhaul:dive_ball_lid",
		"createmonballsoverhaul:nest_ball_lid",
		"createmonballsoverhaul:repeat_ball_lid",
		"createmonballsoverhaul:timer_ball_lid",
		"createmonballsoverhaul:luxury_ball_lid",
		"createmonballsoverhaul:dusk_ball_lid",
		"createmonballsoverhaul:heal_ball_lid",
		"createmonballsoverhaul:quick_ball_lid",
		"createmonballsoverhaul:dream_ball_lid",
		"createmonballsoverhaul:beast_ball_lid",
		"createmonballsoverhaul:master_ball_lid",
		"createmonballsoverhaul:cherish_ball_lid",
		"createmonballsoverhaul:coated_red_ball_lid",
		"createmonballsoverhaul:coated_yellow_ball_lid",
		"createmonballsoverhaul:coated_green_ball_lid",
		"createmonballsoverhaul:coated_blue_ball_lid",
		"createmonballsoverhaul:coated_pink_ball_lid",
		"createmonballsoverhaul:coated_black_ball_lid",
		"createmonballsoverhaul:coated_white_ball_lid",
		"createmonballsoverhaul:light_coated_blue_ball_lid",
		"createmonballsoverhaul:dense_coated_black_ball_lid",
		"createmonballsoverhaul:ancient_great_ball_lid",
		"createmonballsoverhaul:ancient_ultra_ball_lid",
		"createmonballsoverhaul:ancient_feather_ball_lid",
		"createmonballsoverhaul:ancient_wing_ball_lid",
		"createmonballsoverhaul:ancient_jet_ball_lid",
		"createmonballsoverhaul:ancient_heavy_ball_lid",
		"createmonballsoverhaul:ancient_leaden_ball_lid",
		"createmonballsoverhaul:ancient_gigaton_ball_lid",
		"createmonballsoverhaul:ancient_origin_ball_lid",
		"createmonballsoverhaul:apricorn_ball_lid",
		"createmonballsoverhaul:blank_ball_lid",
])

remove_and_merge_into_tab("immersive_paintings:paintings", "minecraft:functional_blocks", [
	"immersive_paintings:painting",
	"immersive_paintings:glow_painting",
	"immersive_paintings:graffiti",
	"immersive_paintings:glow_graffiti",
])

StartupEvents.modifyCreativeTab("ribbits:general", event => {
	event.add("wanderer_ribbit:wanderer_ribbit_spawn_egg")
	event.addAfter("ribbits:maraca", ["wanderer_ribbit:umbrellaleaf", "wanderer_ribbit:ribbit_map"])
})
StartupEvents.modifyCreativeTab("minecraft:tools_and_utilities", event => {
	event.remove("minecraft:bundle") // In case its experimental datapack is enabled.
	event.add("minecraft:bundle")
	// event.removeFromParent(Ingredient.of("#minecraft:boats").except(/oak/))
	// event.removeFromParent(Ingredient.of(/^snowyspirit:.*sled/))
})
StartupEvents.modifyCreativeTab("minecraft:redstone_blocks", event => {
	event.removeFromParent("@copperagebackport")
})

remove_tab("artifacts:main") // Items also exist in "Relics" tab. Well, except the mimic.
StartupEvents.modifyCreativeTab("relics:relics", event => {
	event.add("artifacts:mimic_spawn_egg")
})

if (Platform.isLoaded("displaydelight")) {
	// https://github.com/jkvin114/display-delight-neoforge/blob/main/src/main/java/com/jkvin114/displaydelight/init/BlockAssociations.java
	/** @type {typeof import("com.jkvin114.displaydelight.init.BlockAssociations").$BlockAssociations } */
	let $BlockAssociations  = Java.loadClass("com.jkvin114.displaydelight.init.BlockAssociations")
	let $AbstractItemBlock  = Java.loadClass("com.jkvin114.displaydelight.block.AbstractItemBlock")

	StartupEvents.modifyCreativeTab("displaydelight:displaydelight", event => {
		event.remove(item => {
			if (item.block instanceof $AbstractItemBlock) {
				if (item.block.getStackFor().isEmpty()) {
					// The display item's original food item does not exist in the modpack.
					return true
				}

				if ($BlockAssociations.getItemFor(item.block) != Items.AIR) {
					// The display item has an exact food item corresponding to it.
					// Showing it is redundant because the item can easily be placed and is properly documented.
					return true
				}
			}
			return false
		})

		// Show the original food items that can be placed down, for consistency.
		let plated_cookie = Item.of("displaydelight:plated_cookie")
		Ingredient.of("#displaydelight:displayable").stackArray.sort().forEach(item => {
			event.addBefore(plated_cookie, item, "parent_tab_only")
		})
	})
}

// Remove all non-max level Enchanted Books from searches, which is more than whatever mod is doing this already.
// Commenting out for now, as it fails on startup for some reason.
// StartupEvents.modifyCreativeTab("minecraft:ingredients", event => {
// 	/** @import {$Enchantment} from "net.minecraft.world.item.enchantment.Enchantment" */
// 	Registry.of("enchantment").getValueMap().forEach(/** @param {$Enchantment} enchantment */ (key, enchantment) => {
// 		const max_level = enchantment.maxLevel
// 		for (let level = 1; level < max_level; level += 1) {
// 			event.remove(Item.of(`minecraft:enchanted_book[minecraft:stored_enchantments={"levels":{"${key}":${level}}}]`))
// 			// console.log(`Removed book with ${key} (${level}) from recipe viewer`)
// 		}
// 	})
// })
