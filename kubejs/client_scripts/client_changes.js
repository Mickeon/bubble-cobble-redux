//#region More imports than you will ever know what to do with.
/** @type {typeof import("net.neoforged.neoforge.common.DataMapHooks").$DataMapHooks } */
let $DataMapHooks  = Java.loadClass("net.neoforged.neoforge.common.DataMapHooks")
/** @type {typeof import("net.neoforged.neoforge.client.event.ClientPauseChangeEvent$Post").$ClientPauseChangeEvent$Post } */
let $ClientPauseChangeEvent$Post  = Java.loadClass("net.neoforged.neoforge.client.event.ClientPauseChangeEvent$Post")
/** @type {typeof import("net.neoforged.neoforge.client.event.ScreenEvent$Init$Post").$ScreenEvent$Init$Post } */
let $ScreenEvent$Init$Post  = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$Init$Post")
/** @type {typeof import("net.minecraft.client.gui.components.Tooltip").$Tooltip } */
let $Tooltip  = Java.loadClass("net.minecraft.client.gui.components.Tooltip")
/** @type {typeof import("net.minecraft.client.gui.screens.PauseScreen").$PauseScreen } */
let $PauseScreen  = Java.loadClass("net.minecraft.client.gui.screens.PauseScreen")
/** @type {typeof import("net.minecraft.client.gui.screens.TitleScreen").$TitleScreen } */
let $TitleScreen  = Java.loadClass("net.minecraft.client.gui.screens.TitleScreen")
/** @type {typeof import("net.minecraft.client.gui.components.Button").$Button } */
let $Button  = Java.loadClass("net.minecraft.client.gui.components.Button")
/** @type {typeof import("net.minecraft.client.gui.components.Button$Builder").$Button$Builder } */
let $Button$Builder  = Java.loadClass("net.minecraft.client.gui.components.Button$Builder")
/** @type {typeof import("net.neoforged.neoforge.client.gui.widget.ModsButton").$ModsButton } */
let $ModsButton  = Java.loadClass("net.neoforged.neoforge.client.gui.widget.ModsButton")
//#endregion

// Avoid accidentally placing lanterns when held in offhand.
// There's similar server-side code in server_changes.js.
BlockEvents.rightClicked(event => {
	if (event.hand == "OFF_HAND" && event.item.hasTag("bubble_cobble:lanterns") && !event.player.shiftKeyDown) {
		event.player.playNotifySound("bubble_cobble:buzz", "players", 0.5, 1.0)
		event.cancel()
	}
})

// Add easily-accessible Mod Sets button.
if (Platform.isLoaded("mod_sets")) {
// https://github.com/SettingDust/ModSets/blob/main/src/common/game/main/java/settingdust/mod_sets/game/ModSetsConfigScreenGenerator.java
/** @type {typeof import("settingdust.mod_sets.game.ModSetsConfigScreenGenerator").$ModSetsConfigScreenGenerator} */
let $ModSetsConfigScreenGenerator = Java.loadClass("settingdust.mod_sets.game.ModSetsConfigScreenGenerator")
NativeEvents.onEvent($ScreenEvent$Init$Post, event => {
	if (!(event.screen instanceof $PauseScreen || event.screen instanceof $TitleScreen)) {
		return
	}
	const screen = event.screen
	// HACK: Genuinely horrid way to find the Mods/Links Button.
	/** @type {import("net.minecraft.client.gui.components.Button").$Button$$Type} */
	let mods_button
	screen.children().forEach(existing_button => {
		if (!mods_button && existing_button instanceof $Button) {
			let message_string = existing_button.getMessage().getString()
			if (message_string == "Mods" || message_string == "Server Links...") {
				mods_button = existing_button
			}
		}
	})

	if (!mods_button) {
		console.warn("Could not find Mods button?")
		return
	}

	const modsets_button = new $Button$Builder(Text.translatableWithFallback("", "Sets"), button => {
			Client.forceSetScreen($ModSetsConfigScreenGenerator.generateScreen(Client.currentScreen))
		})
		// .pos(screen.width * 0.5 + 104, screen.height * 0.5 - 24)
		.pos(mods_button.right, mods_button.getY())
		.width(32)
		.tooltip($Tooltip.create(Text.translatableWithFallback("", "Turn off the few\nmods you HATE")))
		.build()

	screen.addRenderableWidget(modsets_button)
})
}


// Move EMI buttons away from the bottom-right.
// Currently disabled as there's no reason to be doing this.
// /** @import {$AbstractWidget} from "net.minecraft.client.gui.components.AbstractWidget" */
// // https://github.com/emilyploszaj/emi/blob/1.21/xplat/src/main/java/dev/emi/emi/screen/EmiScreenManager.java
// let $EmiScreenManager = Java.loadClass("dev.emi.emi.screen.EmiScreenManager")
// /** @type {typeof import("net.minecraft.client.gui.screens.inventory.AbstractContainerScreen").$AbstractContainerScreen } */
// let $AbstractContainerScreen  = Java.loadClass("net.minecraft.client.gui.screens.inventory.AbstractContainerScreen")
// NativeEvents.onEvent("highest", $ScreenEvent$Render$Pre, event => {
// 	console.log(event.screen.getMenu)
// 	if (!event.screen instanceof $AbstractContainerScreen) {
// 		return
// 	}

// 	console.log(event.screen)

// 	const PADDING = 2
// 	const screen = event.screen

// 	const /** @type {$AbstractWidget} */ emi_config = $EmiScreenManager.emi
// 	const /** @type {$AbstractWidget} */ emi_search = $EmiScreenManager.search
// 	const /** @type {$AbstractWidget} */ emi_tree = $EmiScreenManager.tree
// 	try {
// 		// Debugging.
// 		// let widget = emi_search
// 		// console.log(`pos  x: ${widget.getX()}\ty: ${widget.getY()}`)
// 		// console.log(`base x: ${widget.baseX()}\ty: ${widget.baseY()}`)
// 		// console.log(`size x: ${widget.getWidth()}\ty: ${widget.getHeight()}`)
// 		// console.log(`rectangle ${widget.rectangle}`)

// 		emi_config.setX(emi_search.getX() - emi_config.getWidth() - PADDING)
// 		emi_tree.setX(emi_config.getX() - emi_tree.getWidth() - PADDING)
// 	} catch (error) {
// 		console.error(error)
// 	}
// })

/** @param {Special.Item} item_id @private Shorthand for "item_id_to_texture" */
const txr = (item_id) => {
	return ID.namespace(item_id) + ":item/" + ID.path(item_id)
}

/**
 * @typedef {Object} TagDisplayData
 * @property {Special.ItemTag} tag
 * @property {string=} name
 * @property {"split" | "stacked"=} model_type
 * @property {Array<string>=} textures
 */
/** @type {Array<TagDisplayData>} */
const ITEM_TAG_DISPLAY_INFO = [
	{tag: "amendments.goes_in_tripwire_hook", name: "Goes in Tripwire Hook"},
	{tag: "amendments.non_stackable_heads", name: "Heads that cannot be piled up"},
	{tag: "amendments.sets_on_fire", name: "Sets on fire when attacking"},
	{tag: "arts_and_crafts.chalk_sticks", name: "Chalk Sticks"},
	{tag: "arts_and_crafts:paintbrushes", name: "Paintbrushes", textures: [txr("arts_and_crafts:red_paintbrush"), txr("arts_and_crafts:blue_paintbrush")]},
	{tag: "brewinandchewin:foods/cheese_wedge", textures: ["brewinandchewin:item/flaxen_cheese_wedge", "brewinandchewin:item/scarlet_cheese_wedge"]},
	{tag: "brewinandchewin:foods/jerky_meat", textures: ["minecraft:item/rotten_flesh", "farmersdelight:item/bacon", "minecraft:item/chicken"]},
	{tag: "brewinandchewin:cheese_wheels/ripe", textures: ["brewinandchewin:item/flaxen_cheese_wheel", "brewinandchewin:item/scarlet_cheese_wheel"]},
	{tag: "brewinandchewin:cheese_wheels/unripe", textures: ["brewinandchewin:item/unripe_flaxen_cheese_wheel", "brewinandchewin:item/unripe_scarlet_cheese_wheel"]},
	{tag: "bubble_cobble:cattails", name: "Cattails", textures: ["biomeswevegone:item/cattails", "biomesoplenty:item/cattail"]},
	{tag: "c:chains", textures: ["minecraft:item/chain", "minecraft:item/copper_chain"]},
	{tag: "c:crops/cabbage", name: "Cabbage", textures: ["farmersdelight:item/cabbage", "farmersdelight:item/cabbage_leaf"]},
	{tag: "c:crops/grain", name: "Grain", textures: ["minecraft:item/wheat", "farmersdelight:item/rice"]},
	{tag: "c:crops/rice", name: "Rice", textures: ["farmersdelight:item/rice", "cobblemon:item/hearty_grains"]},
	{tag: "c:drinks/tea", name: "Tea"},
	{tag: "c:drinks/milk", textures: ["farmersdelight:item/milk_bottle", "minecraft:item/milk_bucket"]},
	{tag: "c:foods/bat_wing", name: "Any Bat Wing"},
	{tag: "c:foods/berry", textures: ["minecraft:item/sweet_berries", "biomeswevegone:item/blueberries"]},
	{tag: "c:foods/bread", textures: ["minecraft:item/bread", "mynethersdelight:item/slices_of_bread"]},
	{tag: "c:foods/cooked_beef", name: "Any Cooked Beef"},
	{tag: "c:foods/cooked_chicken", name: "Any Cooked Chicken", textures: ["minecraft:item/cooked_chicken", "farmersdelight:item/cooked_chicken_cuts"]},
	{tag: "c:foods/cooked_cod", name: "Any Cooked Cod"},
	{tag: "c:foods/cooked_egg", name: "Any Cooked Egg", textures: ["farmersdelight:item/fried_egg", "mynethersdelight:item/boiled_egg"]},
	{tag: "c:foods/cooked_hoglin", name: "Any Cooked Hoglin"},
	{tag: "c:foods/cooked_meat", textures: ["minecraft:item/cooked_beef", "farmersdelight:item/cooked_chicken_cuts", "minecraft:item/cooked_rabbit"]},
	{tag: "c:foods/cooked_mutton", name: "Any Cooked Mutton", textures: ["minecraft:item/cooked_mutton", "farmersdelight:item/cooked_mutton_chops"]},
	{tag: "c:foods/cooked_pork", name: "Any Cooked Pork"},
	{tag: "c:foods/cooked_salmon", name: "Any Cooked Salmon"},
	{tag: "c:foods/cooked_sausage", name: "Any Cooked Sausage"},
	{tag: "c:foods/dough", name: "Dough", model_type: "split", textures: ["farmersdelight:item/wheat_dough", "farmersdelight:item/wheat_dough", "mynethersdelight:item/ghast_dough", "create:item/dough"]},
	{tag: "c:foods/magma_cube", name: "Mmmm magma cubes yummy"},
	{tag: "c:foods/pasta", name: "Pasta", textures: ["farmersdelight:item/raw_pasta", "mynethersdelight:item/ghasta"]},
	{tag: "c:foods/raw_beef", name: "Any Raw Beef", textures: ["minecraft:item/beef", "farmersdelight:item/minced_beef"]},
	{tag: "c:foods/raw_chicken", name: "Any Raw Chicken", textures: ["minecraft:item/chicken", "farmersdelight:item/chicken_cuts"]},
	{tag: "c:foods/raw_ghast", name: "Any Raw Ghast", textures: ["mynethersdelight:item/ghasta", "mynethersdelight:item/ghasmati"]},
	{tag: "c:foods/raw_hoglin", name: "Any Raw Hoglin", textures: ["mynethersdelight:item/loin", "mynethersdelight:item/sausage"]},
	{tag: "c:foods/raw_meat", name: "Any Raw Mutton", textures: ["minecraft:item/beef", "farmersdelight:item/chicken_cuts", "farmersdelight:item/minced_beef", "cobblemon:item/food/tasty_tail"]},
	{tag: "c:foods/raw_pork", name: "Any Raw Pork"},
	{tag: "c:foods/raw_salmon", name: "Any Raw Salmon"},
	{tag: "c:foods/raw_squid", name: "Any Raw Squid"},
	{tag: "c:foods/raw_strider", name: "Any Raw Strider", textures: ["mynethersdelight:item/strider", "mynethersdelight:item/minced_strider"]},
	{tag: "c:foods/safe_raw_fish", name: "Safe Raw Fish", textures: ["minecraft:item/cod", "farmersdelight:item/cod_slice", "minersdelight:item/tentacles"]},
	{tag: "c:foods/squid", name: "Any Squid"},
	{tag: "c:foods/tentacles", name: "Any Tentacles"},
	{tag: "c:foods/vegetable", textures: ["minecraft:item/carrot", "cobblemon:item/medicine/medicinal_leek", "farmersdelight:item/tomato"]},
	{tag: "c:ropes", textures: ["supplementaries:item/rope", "farmersdelight:item/rope"]},
	{tag: "c:slime_balls", textures: ["minecraft:item/slime_ball", "mowziesmobs:item/glowing_jelly"]},
	{tag: "c:tools/knife", name: "Knives"},
	{tag: "cnc:antlers", textures: ["cnc:item/white_tailed_deer_antler", "cnc:item/caribou_antler"]},
	{tag: "cobblemon:apricorns", model_type: "split", textures: ["cobblemon:item/green_apricorn", "cobblemon:item/white_apricorn", "cobblemon:item/red_apricorn"]},
	{tag: "cobblemon:berries", textures: ["cobblemon:item/berries/cheri_berry", "cobblemon:item/berries/oran_berry", "cobblemon:item/berries/persim_berry"]},
	{tag: "cobblemon:pokedex_screen", textures: ["minecraft:item/glow_ink_sac", "cobblemon:item/held_items/bright_powder"]},
	{tag: "cobblemon:remedy_berries", textures: ["minecraft:item/sweet_berries", "cobblemon:item/galarica_nuts"]},
	{tag: "cobblemon:tumblestones", textures: ["cobblemon:item/tumblestone", "cobblemon:item/sky_tumblestone", "cobblemon:item/black_tumblestone"]},
	{tag: "cobblemon:type_gems", model_type: "split", textures: ["cobblemon:item/type_gem/normal_gem", "cobblemon:item/type_gem/fairy_gem", "cobblemon:item/type_gem/ice_gem"]},
	{tag: "cobblemonraiddens:cheers", name: "Cheers", textures: ["cobblemonraiddens:item/cheer_attack", "cobblemonraiddens:item/cheer_heal", "cobblemonraiddens:item/cheer_defense"]},
	{tag: "cobblenav:pokenav", model_type: "split", textures: ["cobblenav:item/pokenav_item_base", "cobblenav:item/pokenav_item_orange", "cobblenav:item/pokenav_item_red"]},
	{tag: "conforts:hammocks", name: "Hammocks"},
	{tag: "conforts:sleeping_bags", name: "Sleeping Bags"},
	{tag: "constructionstick:construction_sticks", name: "Construction Sticks", textures: ["constructionstick:item/wooden_stick", "constructionstick:item/copper_stick", "constructionstick:item/diamond_stick", "constructionstick:item/netherite_stick"]},
	{tag: "create:pulpifiable", textures: ["minecraft:item/bamboo", "cobblemon:item/medicine/medicinal_leek", "minecraft:item/sugar_cane", "minecraft:block/oak_sapling"]},
	{tag: "create_bic_bit:snacks", name: "Snacks"},
	{tag: "create_bic_bit:snacks_deepfried", name: "Deepfried Snacks"},
	{tag: "create_bic_bit:tulip", name: "Tulips"},
	{tag: "create_bic_bit:wrapped_snacks", name: "Wrapped Snacks"},
	{tag: "curios:back", name: "Fits in Curios's Back slot"},
	{tag: "curios:belt", name: "Fits in Curios's Belt slot"},
	{tag: "curios:charm", name: "Fits in Curios's Charm slot"},
	{tag: "curios:feet", name: "Fits in Curios's Feet slot"},
	{tag: "curios:head", name: "Fits in Curios's Head slot"},
	{tag: "curios:necklace", name: "Fits in Curios' Necklace slot"},
	{tag: "enhancedcelestials:harvest_moon_crops", name: "Crops enhanced by the Harvest Moon"},
	{tag: "farmersdelight:knives", name: "Knives"},
	{tag: "farmersdelight:straw_harvesters", name: "Straw Harvesters"},
	{tag: "kubejs:wines", name: "Wines"},
	{tag: "farmersdelight:cabbage_roll_ingredients", name: "Cabbage Roll Ingredients", textures: ["minecraft:item/carrot", "farmersdelight:item/cod_slice", "minecraft:block/brown_mushroom", "farmersdelight:item/chicken_cuts"]},
	{tag: "mega_showdown:mega_bracelets", name: "Mega Bracelets"},
	{tag: "mega_showdown:mega_stone", name: "Mega Stones"},
	{tag: "mega_showdown:rotom_appliances", name: "Rotom Appliances"},
	{tag: "mega_showdown:tera_shard", name: "Tera Shards", model_type: "split", textures: ["mega_showdown:item/normal_tera_shard", "mega_showdown:item/fairy_tera_shard", "mega_showdown:item/ghost_tera_shard"]},
	{tag: "mega_showdown:z_crystal", name: "Z-Crystals"},
	{tag: "mega_showdown:z_ring", name: "Z-Rings"},
	{tag: "minersdelight:baked_cave_carrot", name: "Any Baked Cave Carrot", textures: ["minersdelight:item/baked_cave_carrot", "minersdelight:item/vegan_patty"]},
	{tag: "minersdelight:cooked_insect_meat", name: "Any Cooked Insect Meat"},
	{tag: "minersdelight:insect_meat", name: "Any Insect Meat"},
	{tag: "mynethersdelight:hot_spice", name: "Hot Spice", textures: ["mynethersdelight:item/bullet_pepper", "mynethersdelight:item/pepper_powder"]},
	{tag: "mynethersdelight:stove_fire_fuel", name: "Stove Fire Fuel"},
	{tag: "mynethersdelight:stuffed_hoglin_items", name: "Pieces of Stuffed Hoglin"},
	{tag: "simpletms:category_physical_tm", name: "Physical TMs"},
	{tag: "simpletms:category_physical_tr", name: "Physical TRs"},
	{tag: "simpletms:category_special_tm", name: "Special TMs"},
	{tag: "simpletms:category_special_tr", name: "Special TRs"},
	{tag: "simpletms:category_status_tm", name: "Status TMs"},
	{tag: "simpletms:category_status_tr", name: "Status TRs"},
	{tag: "simpletms:tm_items", name: "TMs", model_type: "split", textures: ["simpletms:item/tm/fire", "simpletms:item/tm/dragon", "simpletms:item/tm/fairy", "simpletms:item/tm/grass"]},
	{tag: "simpletms:tr_items", name: "TRs", model_type: "split", textures: ["simpletms:item/tr/fire", "simpletms:item/tr/dragon", "simpletms:item/tr/fairy", "simpletms:item/tr/grass"]},

	// https://github.com/MehVahdJukaar/SnowySpirit/pull/123
	{tag: "snowyspirit.gumdrops", name: "Gumdrops"},
	{tag: "snowyspirit.sleds", name: "Sleds"},

	{tag: "sophisticatedbackpacks.upgrade", name: "Backpack Upgrades"},
	{tag: "sophisticatedstorage.all_storage", name: "All Storage"},
	{tag: "sophisticatedstorage.base_tier_wooden_storage", name: "Base Tier Wooden Storage"},
	{tag: "soulbound.enchantable", name: "Enchantable with Soulbound"},

	{tag: "urban_decor:polyanthous", name: "Any Polyanthous Flower", model_type: "split", textures: ["urban_decor:item/daffodil_polyanthous", "urban_decor:item/spring_polyanthous", "urban_decor:item/mint_polyanthous"]},
	{tag: "urban_decor:porcelain", name: "Any Porcelain", model_type: "split", textures: ["urban_decor:item/porcelain", "urban_decor:item/dark_porcelain"]},
	{tag: "urban_decor:towels", name: "Any Towel"},
	{tag: "urban_decor:wraps", name: "Wraps"},
]

// Add models for EMI (the recipe viewer) to display when tags are referenced.
// We could use resource packs for this,
// but that would massively bloat the folders around the place.
ClientEvents.generateAssets("before_mods", event => {
	/** @param {Special.ItemTag} item_tag @param {Array<string>} texture_paths */
	function split_model(item_tag, texture_paths) {
		const [first, second, third, fourth] = texture_paths
		const textures = {
			first: first
		}
		const new_model = {
			textures: textures
		}
		if (second) {
			new_model.parent = "emi:item/half_item"
			textures.second = second
		}
		if (third) {
			new_model.parent = "emi:item/third_item"
			textures.third = third
		}
		if (fourth) {
			// I hate the way the EMI model does the split.
			new_model.parent = "kubejs:item/tag/quarter_item"
			textures.fourth = fourth
		}
		event.json(`${ID.namespace(item_tag)}:models/tag/item/${ID.path(item_tag)}`, new_model)
	}

	/** @param {Special.ItemTag} item_tag @param {Array<string>} texture_paths */
	function stacked_model(item_tag, texture_paths) {
		const new_model = {
			parent: "kubejs:item/tag/stacked_two_item",
			textures: {
				first: texture_paths[0],
				second: texture_paths[1]
			}
		}
		if (texture_paths.length >= 3) {
			new_model.parent = "kubejs:item/tag/stacked_three_item"
			new_model.textures.third = texture_paths[2]
		}
		if (texture_paths.length >= 4) {
			new_model.parent = "kubejs:item/tag/stacked_four_item"
			new_model.textures.fourth = texture_paths[3]
		}
		// console.log(new_model)
		event.json(`${ID.namespace(item_tag)}:models/tag/item/${ID.path(item_tag)}`, new_model)
	}

	for (const info of ITEM_TAG_DISPLAY_INFO) {
		let textures = info.textures
		if (!textures) {
			continue
		}
		if (info.model_type == "split") {
			split_model(info.tag, textures)
		} else {
			stacked_model(info.tag, textures)
		}
	}
	// event.json("c:models/tag/item/chests", {parent: "item/chest"}) // Does not work, chests have a special rendering method.
})

// Proper localization strings to some tags shown in EMI, including the above.
// TODO: Some more programmatic way to handle it. You can see the repetition.
ClientEvents.lang("en_us", event => {
	// let time_start = Utils.getSystemTime()

	const tag_lang_keys = {}
	for (const info of ITEM_TAG_DISPLAY_INFO) {
		// let name = info.name || StringUtils.snakeCaseToTitleCase(ID.path(tag))
		let name = info.name
		if (!name) {
			continue
		}
		let lang_key = `tag.item.${info.tag.replace(/[\/\:]/g, ".")}`
		tag_lang_keys[lang_key] = name
		// console.log(lang_key, name)
	}
	// console.log(Utils.getSystemTime() - time_start, " ms")
	event.addAll(tag_lang_keys)
})


RecipeViewerEvents.addEntries("item", event => {
	event.add(Item.of("cobblemon:pokemon_model", {
		"minecraft:item_name": Text.of(`Pokémon`),
		"minecraft:lore": [
			Text.of(`A stand-in you can right-click on`),
			Text.of(`to view interactions in the recipe viewer`)
		],
		"minecraft:rarity": "epic",
		"cobblemon:pokemon_item": {
			species: "cobblemon:glaceon",
			aspects: [""]
		},
	}))
})

// Add Cobblemon cosmetic items to EMI.
ClientEvents.generateAssets("after_mods", event => {
	// This, unfortunately, can only be partially automated as the features are server-side.
	const COSMETIC_SETS = {
		white_wool: {
			item: "minecraft:white_wool",
			aspect: "cosmetic_item-white_wool",
			pokemon: [
				"arctozolt",
				"gogoat",
				"dedenne",
				"vulpix",
				"ninetales",
				"raichu",
				"dracozolt",
				"trapinch",
				"cyndaquil",
				"quilava",
				"typhlosion",
				"vibrava",
				"flygon",
				"fennekin",
				"braixen",
				"delphox",
				"litten",
				"fuecoco",
				"tinkaton",
				"chikorita",
				"liligant", // File-accurate typo indeed.
				"chansey",
				"cutiefly",
				"chandelure",
				"noibat",
				"gardevoir",
				"goodra",
				"rowlet",
				"tropius",
				"salamence",
				"mew",
				"arbok",
				"meowscrada", // File-accurate typo indeed.
				"floragato",
				"sprigatito",
				"milotic",
				"minccino",
				"whimsicott",
				"swablu",
				"altaria",
				"sylveon",
				"snivy",
				"kirlia",
				"inteleon",
				"mawile"
			],
		},
		black_wool: {
			item: "minecraft:black_wool",
			aspect: "cosmetic_item-black_wool",
			pokemon: [
				"vulpix",
				"raichu",
				"typhlosion",
				"ninetales"
			],
		},
		gold_nugget: {
			item: "minecraft:gold_nugget",
			aspect: "cosmetic_item-gold_nugget",
			pokemon: [
				"latios",
				"latias",
				"spheal",
				"deino",
				"eevee",
				"zweilous",
				"marill",
				"rayquaza",
				"rapidash",
				"zebstrika",
				"ponyta",
				"espeon",
				"scolipede"
			],
		},
		jukebox: {
			item: "minecraft:jukebox",
			aspect: "cosmetic_item-jukebox",
			pokemon: [
				"eevee",
				"sylveon",
				"espeon",
				"flareon",
				"jolteon",
				"umbreon",
				"glaceon",
				"leafeon",
				"vaporeon"
			],
		},
		aniversary: {
			item: "cobblemon:star_sweet",
			aspect: "aniversary",
			pokemon: [
				"ogerpon",
			],
		},
		art: {
			item: "minecraft:paper",
			aspect: "art",
			pokemon: [
				"hooh",
			],
		},
		mega_pin: {
			item: "mega_showdown:gardevoirite",
			aspect: "pin",
			pokemon: [
				"gardevoir",
			],
		},
		ot: {
			item: "cobblemon:relic_coin",
			aspect: "ot",
			pokemon: [
				"gengar",
			],
		},
		summer: {
			item: "minecraft:white_dye",
			aspect: "summer",
			pokemon: [
				"glaceon",
			],
		},
		world: {
			item: "cobblemon:star_sweet",
			aspect: "world",
			pokemon: [
				"pikachu",
			],
		},
	}

	Object.keys(COSMETIC_SETS).forEach(key => {
		const cosmetic_set = COSMETIC_SETS[key]
		const consumed_item = `item:${cosmetic_set.item}{lore: ['{text:\"Change cosmetic item\", color: \"green\", italic: false}']}`
		const aspect = cosmetic_set.aspect
		for (let pokemon of cosmetic_set.pokemon) {
			event.json(`emi:recipe/additions/pokemon_cosmetics/${aspect}/${pokemon}`, {
				type: "emi:world_interaction",
				left: `item:cobblemon:pokemon_model{'cobblemon:pokemon_item': {species: 'cobblemon:${pokemon}', aspects: ['']}}`,
				right: consumed_item,
				output: `item:cobblemon:pokemon_model{'cobblemon:pokemon_item': {species: 'cobblemon:${pokemon}', aspects: ['${aspect}']}}`
			})
		}
	})
})


if (Platform.isLoaded("constructionstick")) {
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

		/** @param {Special.LangKey} lang_key  */
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
}

// Highlight nearby waxed blocks.
ClientEvents.highlight(event => {
	const player = event.player
	if (!player.isHolding("minecraft:honeycomb") || Client.isPaused()) {
		return
	}

	const level = player.level
	const eye_position = player.getEyePosition()
	const area = AABB.ofSize(eye_position, 16, 8, 16)
	BlockPos.betweenClosedStream(area).forEach(pos => {
		const block = level.getBlock(pos).getBlock()
		const is_waxed = $DataMapHooks.getBlockUnwaxed(block)
		const can_be_waxed = $DataMapHooks.getBlockWaxed(block)
		if (is_waxed || can_be_waxed) {
			// let direction = Direction.UP
			// let normal = new Vec3d(direction.normal.x, direction.normal.y, direction.normal.z)
			// let particle_pos = pos.getCenter().add(normal).offsetRandom(Utils.getRandom(), 1)
			// let particle_vel = Vec3d.atLowerCornerOf(normal).scale(1)
			// if (can_be_waxed) {
			// 	event.addBlock(pos, "white_dye")
			// }

			if (Utils.getRandom().nextFloat() > (is_waxed ? 0.2 : 0.5)) {
				return // Reduce the amount of particles.
			}

			let particle_pos = pos.getCenter().offsetRandom(Utils.getRandom(), 1.25)
			let vec_to_center = particle_pos.vectorTo(pos.getCenter())
			let particle_vel = vec_to_center.scale(vec_to_center.lengthSqr() * 2.0 - 1.0)
			event.level.addParticle(is_waxed ? "minecraft:wax_on" : "minecraft:wax_off", false,
				particle_pos.x(), particle_pos.y(), particle_pos.z(),
				particle_vel.x(), particle_vel.y(), particle_vel.z()
			)

			// const result = level.clip(new $ClipContext(player.getEyePosition(), pos.getCenter(), "visual", "none", player))
			// event.addBlock(result.getBlockPos(), "yellow_dye")
		}
	})

	if ($DataMapHooks.getBlockWaxed(event.targetBlock.getBlock())) {
		event.addTargetBlock("gray_dye")
	}
})