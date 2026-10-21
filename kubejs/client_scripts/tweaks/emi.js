// requires: emi

/** @param {RegistryTypes.Item} item_id @private Shorthand for "item_id_to_texture" */
const txr = (item_id) => {
	return ID.namespace(item_id) + ":item/" + ID.path(item_id)
}

/**
 * @typedef {Object} TagDisplayData
 * @property {RegistryTypes.ItemTag} tag
 * @property {string=} name
 * @property {"split" | "stacked"=} model_type
 * @property {Array<string>=} textures
 */
/** @type {Array<TagDisplayData>} */
const ITEM_TAG_DISPLAY_INFO = [
	{tag: "amendments:goes_in_tripwire_hook", name: "Goes in Tripwire Hook"},
	{tag: "amendments:non_stackable_heads", name: "Heads that cannot be piled up"},
	{tag: "amendments:sets_on_fire", name: "Sets on fire when attacking"},
	{tag: "arts_and_crafts:chalk_sticks", name: "Chalk Sticks"},
	{tag: "arts_and_crafts:paintbrushes", name: "Paintbrushes", textures: [txr("arts_and_crafts:red_paintbrush"), txr("arts_and_crafts:blue_paintbrush")]},
	{tag: "brewinandchewin:foods/cheese_wedge", textures: ["brewinandchewin:item/flaxen_cheese_wedge", "brewinandchewin:item/scarlet_cheese_wedge"]},
	{tag: "brewinandchewin:foods/jerky_meat", textures: ["minecraft:item/rotten_flesh", "farmersdelight:item/bacon", "minecraft:item/chicken"]},
	{tag: "brewinandchewin:cheese_wheels/ripe", textures: ["brewinandchewin:item/flaxen_cheese_wheel", "brewinandchewin:item/scarlet_cheese_wheel"]},
	{tag: "brewinandchewin:cheese_wheels/unripe", textures: ["brewinandchewin:item/unripe_flaxen_cheese_wheel", "brewinandchewin:item/unripe_scarlet_cheese_wheel"]},
	{tag: "bubble_cobble:cattails", name: "Cattails", textures: ["biomeswevegone:item/cattails", "biomesoplenty:item/cattail"]},
	{tag: "c:crops/cabbage", textures: ["farmersdelight:item/cabbage", "farmersdelight:item/cabbage_leaf"]},
	{tag: "c:crops/grain", textures: ["minecraft:item/wheat", "farmersdelight:item/rice"]},
	{tag: "c:crops/rice", textures: ["farmersdelight:item/rice", "cobblemon:item/hearty_grains"]},
	{tag: "c:drinks/tea", name: "Tea"},
	{tag: "c:drinks/milk", textures: ["farmersdelight:item/milk_bottle", "minecraft:item/milk_bucket"]},
	{tag: "c:foods/bat_wing", name: "Any Bat Wing"},
	{tag: "c:foods/berry", textures: ["minecraft:item/sweet_berries", "biomeswevegone:item/blueberries"]},
	{tag: "c:foods/bread", textures: ["minecraft:item/bread", "mynethersdelight:item/slices_of_bread"]},
	{tag: "c:foods/cooked_beef", name: "Any Cooked Beef"},
	{tag: "c:foods/cooked_chicken", name: "Any Cooked Chicken", textures: ["minecraft:item/cooked_chicken", "farmersdelight:item/cooked_chicken_cuts"]},
	{tag: "c:foods/cooked_cod", name: "Any Cooked Cod",  textures: ["minecraft:item/cooked_cod", "farmersdelight:item/cooked_cod_slice"]},
	{tag: "c:foods/cooked_egg", name: "Any Cooked Egg", textures: ["farmersdelight:item/fried_egg", "mynethersdelight:item/boiled_egg"]},
	{tag: "c:foods/cooked_hoglin", name: "Any Cooked Hoglin", textures: ["mynethersdelight:item/cooked_loin", "mynethersdelight:item/roasted_sausage"]},
	{tag: "c:foods/cooked_meat", textures: ["minecraft:item/cooked_beef", "farmersdelight:item/cooked_chicken_cuts", "minecraft:item/cooked_rabbit"]},
	{tag: "c:foods/cooked_mutton", name: "Any Cooked Mutton", textures: ["minecraft:item/cooked_mutton", "farmersdelight:item/cooked_mutton_chops"]},
	{tag: "c:foods/cooked_pork", name: "Any Cooked Pork", textures: ["minecraft:item/cooked_porkchop", "mynethersdelight:item/roasted_sausage", "farmersdelight:item/cooked_bacon"]},
	{tag: "c:foods/cooked_salmon", name: "Any Cooked Salmon", textures: ["minecraft:item/cooked_salmon", "farmersdelight:item/cooked_salmon_slice"]},
	{tag: "c:foods/dough", name: "Dough", model_type: "split", textures: ["farmersdelight:item/wheat_dough", "farmersdelight:item/wheat_dough", "mynethersdelight:item/ghast_dough", "create:item/dough"]},
	{tag: "c:foods/magma_cube", name: "Mmmm magma cubes yummy"},
	{tag: "c:foods/pasta", name: "Pasta", textures: ["farmersdelight:item/raw_pasta", "mynethersdelight:item/ghasta"]},
	{tag: "c:foods/raw_beef", name: "Any Raw Beef", textures: ["minecraft:item/beef", "farmersdelight:item/minced_beef"]},
	{tag: "c:foods/raw_chicken", name: "Any Raw Chicken", textures: ["minecraft:item/chicken", "farmersdelight:item/chicken_cuts"]},
	{tag: "c:foods/raw_cod", name: "Any Raw Cod", textures: ["minecraft:item/cod", "farmersdelight:item/cod_slice"]},
	{tag: "c:foods/raw_ghast", name: "Any Raw Ghast", textures: ["mynethersdelight:item/ghasta", "mynethersdelight:item/ghasmati"]},
	{tag: "c:foods/raw_hoglin", name: "Any Raw Hoglin", textures: ["mynethersdelight:item/loin", "mynethersdelight:item/sausage"]},
	{tag: "c:foods/raw_meat", name: "Any Raw Meat", textures: ["minecraft:item/beef", "farmersdelight:item/chicken_cuts", "farmersdelight:item/minced_beef", "cobblemon:item/food/tasty_tail"]},
	{tag: "c:foods/raw_mutton", name: "Any Raw Mutton", textures: ["minecraft:item/mutton", "farmersdelight:item/mutton_chops"]},
	{tag: "c:foods/raw_pork", name: "Any Raw Pork", textures: ["minecraft:item/porkchop", "mynethersdelight:item/sausage", "farmersdelight:item/bacon"]},
	{tag: "c:foods/raw_salmon", name: "Any Raw Salmon",  textures: ["minecraft:item/salmon", "farmersdelight:item/salmon_slice"]},
	{tag: "c:foods/raw_squid", name: "Any Raw Squid", textures: ["minersdelight:item/squid", "minersdelight:item/tentacles"]},
	{tag: "c:foods/raw_strider", name: "Any Raw Strider", textures: ["mynethersdelight:item/strider", "mynethersdelight:item/minced_strider"]},
	{tag: "c:foods/safe_raw_fish", name: "Any Safe Raw Fishes", textures: ["minecraft:item/cod", "farmersdelight:item/cod_slice", "minersdelight:item/tentacles"]},
	{tag: "c:foods/squid", name: "Any Squid", textures: ["minersdelight:item/squid", "minersdelight:item/baked_squid"]},
	{tag: "c:foods/tentacles", name: "Any Tentacles", textures: ["minersdelight:item/tentacles", "minersdelight:item/baked_tentacles"]},
	{tag: "c:foods/vegetable", textures: ["minecraft:item/carrot", "cobblemon:item/medicine/medicinal_leek", "farmersdelight:item/tomato"]},
	{tag: "c:mushrooms", textures: ["minecraft:block/brown_mushroom", "biomesoplenty:block/glowshroom"]},
	{tag: "c:ropes", textures: ["supplementaries:item/rope", "farmersdelight:item/rope"]},
	{tag: "c:slime_balls", textures: ["minecraft:item/slime_ball", "mowziesmobs:item/glowing_jelly"]},
	{tag: "cobblemon:apricorns", model_type: "split", textures: ["cobblemon:item/green_apricorn", "cobblemon:item/white_apricorn", "cobblemon:item/red_apricorn"]},
	{tag: "cobblemon:berries", textures: ["cobblemon:item/berries/cheri_berry", "cobblemon:item/berries/oran_berry", "cobblemon:item/berries/persim_berry"]},
	{tag: "cobblemon:evolution_stones", textures: ["cobblemon:item/evolution/dawn_stone", "cobblemon:item/evolution/shiny_stone"]},
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
	{tag: "createdeco:placards", name: "Placards"},
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
	{tag: "enhancedcelestials2defaultlunarevents:harvest_moon_crops", name: "Crops enhanced by the Harvest Moon"},
	{tag: "bubble_cobble:wines", name: "Wines"},
	{tag: "mega_showdown:mega_bracelet", name: "Mega Bracelets"},
	{tag: "mega_showdown:mega_stone", name: "Mega Stones"},
	{tag: "mega_showdown:rotom_appliances", name: "Rotom Appliances"},
	{tag: "mega_showdown:tera_shard", name: "Tera Shards", model_type: "split", textures: ["mega_showdown:item/normal_tera_shard", "mega_showdown:item/fairy_tera_shard", "mega_showdown:item/ghost_tera_shard"]},
	{tag: "mega_showdown:z_crystal", name: "Z-Crystals"},
	{tag: "mega_showdown:z_ring", name: "Z-Rings"},
	{tag: "minersdelight:baked_cave_carrot", name: "Any Baked Cave Carrot", textures: ["minersdelight:item/baked_cave_carrot", "minersdelight:item/vegan_patty"]},
	{tag: "minersdelight:cooked_insect_meat", name: "Any Cooked Insect Meat", textures: ["minersdelight:item/baked_spider_leg", "minersdelight:item/crunchy_bar"]},
	{tag: "minersdelight:raw_insect_meat", name: "Any Raw Insect Meat", textures: ["minersdelight:item/spider_leg", "minersdelight:item/arthropod"]},
	{tag: "mynethersdelight:hot_spice", name: "Hot Spice", textures: ["mynethersdelight:item/bullet_pepper", "mynethersdelight:item/pepper_powder"]},
	{tag: "mynethersdelight:stove_fire_fuel", name: "Stove Fire Fuel"},
	{tag: "mynethersdelight:stuffed_hoglin_items", name: "Pieces of Stuffed Hoglin"},
	{tag: "reliquified_artifacts:mimic_loot", name: "Released from Mimic"},

	{tag: "sophisticatedbackpacks:upgrade", name: "Backpack Upgrades"},
	{tag: "sophisticatedstorage:all_storage", name: "All Storage"},
	{tag: "sophisticatedstorage:base_tier_wooden_storage", name: "Base Tier Wooden Storage"},
	{tag: "bubble_cobble:enchantable/soulbound", name: "Enchantable with Soulbound"},

	{tag: "urban_decor:polyanthous", name: "Any Polyanthous Flower", model_type: "split", textures: ["urban_decor:item/daffodil_polyanthous", "urban_decor:item/spring_polyanthous", "urban_decor:item/mint_polyanthous"]},
	{tag: "urban_decor:porcelain", name: "Any Porcelain", model_type: "split", textures: ["urban_decor:item/porcelain", "urban_decor:item/dark_porcelain"]},
	{tag: "urban_decor:towels", name: "Any Towel"},
	{tag: "urban_decor:wraps", name: "Wraps"},
]

// Add models for EMI (the recipe viewer) to display when tags are referenced.
// We could use resource packs for this,
// but that would massively bloat the folders around the place.
ClientEvents.generateAssets("after_mods", event => {
	/** @param {RegistryTypes.ItemTag} item_tag @param {Array<string>} texture_paths */
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

	/** @param {RegistryTypes.ItemTag} item_tag @param {Array<string>} texture_paths */
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

// Add preview of stack group's contents when hovered on.
if (Platform.isLoaded("remi")) {
let COLUMNS = 8
let ROWS = 3
let MAX_ITEMS = 24
let SLOT_WIDTH = 14
let SLOT_HEIGHT = 16
let PADDING = 4
let $EmiApi = Java.loadClass("dev.emi.emi.api.EmiApi")
let $EmiGroupStack = Java.loadClass("com.evandev.remi.feature.stackgroup.EmiGroupStack")
let $RenderTooltipEvent$Pre = Java.loadClass("net.neoforged.neoforge.client.event.RenderTooltipEvent$Pre")
NativeEvents.onEvent($RenderTooltipEvent$Pre, event => {
	let emi_stack = $EmiApi.getHoveredStack(true).getStack()
	// emi_stack.render(event.getGraphics(), event.getX(), event.getY() + 20, 0)
	if (!(emi_stack instanceof $EmiGroupStack)) {
		return
	}

	let items = /** @type {$List} */ (emi_stack.getItems())
	let tooltip_width = Math.min(items.size(), COLUMNS) * SLOT_WIDTH
	let tooltip_height = Math.min(Math.ceil(items.size() / COLUMNS), 3) * SLOT_HEIGHT

	let position = event.getTooltipPositioner().positionTooltip(
		event.getScreenWidth(), event.getScreenHeight(), event.getX(), event.getY(), tooltip_width, tooltip_height
	)

	let x = position.x()
	let y = position.y() + 25
	let end_x = x + tooltip_width
	let end_y = y + tooltip_height
	let graphics = event.getGraphics()
	graphics.push().translate(0, 0, 1000)
	graphics.fillGradient(x - PADDING, y - PADDING, end_x + PADDING, end_y + PADDING, 0, Color.rgba(16, 0, 17, 1.0).getArgb(), Color.rgba(9, 8, 36, 0.8).getArgb())
	graphics.renderOutline(x - PADDING + 1, y - PADDING + 1, tooltip_width + PADDING * 2 - 2, tooltip_height + PADDING * 2 - 2, Color.rgba(24, 1, 52, 1.0).getArgb())
	items.stream().limit(MAX_ITEMS).forEach(stack => {
		stack.render(graphics, x, y, 0)
		x += SLOT_WIDTH
		if (x >= end_x) {
			x = position.x()
			y += SLOT_HEIGHT
		}
	})
	graphics.pop()
})
}


// Move EMI buttons away from the bottom-right.
// Currently disabled as there's no reason to be doing this.
// /** @import {$AbstractWidget} from "@package/net/minecraft/client/gui/components" */
// // https://github.com/emilyploszaj/emi/blob/1.21/xplat/src/main/java/dev/emi/emi/screen/EmiScreenManager.java
// let $EmiScreenManager = Java.loadClass("dev.emi.emi.screen.EmiScreenManager")
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
