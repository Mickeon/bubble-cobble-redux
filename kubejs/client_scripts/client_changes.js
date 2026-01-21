//#region More imports than you will ever know what to do with.
// https://github.com/SettingDust/ModSets/blob/main/src/common/game/main/java/settingdust/mod_sets/game/ModSetsConfigScreenGenerator.java
let $ModSetsConfigScreenGenerator = Java.loadClass("settingdust.mod_sets.game.ModSetsConfigScreenGenerator")
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
/** @type {typeof import("net.neoforged.neoforge.client.gui.widget.ModsButton").$PauseScreen } */
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
NativeEvents.onEvent($ScreenEvent$Init$Post, event => {
	if (!(event.screen instanceof $PauseScreen || event.screen instanceof $TitleScreen)) {
		return
	}
	const screen = event.screen
	// HACK: Nasty way to find the Mods Button.
	/** @type {import("net.minecraft.client.gui.components.Button").$Button$$Type} */
	let mods_button
	screen.children().forEach(existing_button => {
		if (existing_button instanceof $Button) {
			// console.log(Text.of(existing_button.getMessage()))
			if (existing_button.getMessage().getString() == "Mods") {
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

// KeyBindEvents.pressed("key.use", event => {
// 	event.client.statusMessage = "Potato"
// })


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


const QUARTER_ITEM_MODEL = {
	"gui_light": "front",
	"elements": [
		{
			"from": [0, 8, 0],
			"to": [8, 16, 16],
			"faces": {
				"south": {
					"texture": "#first",
					"cullface": "south"
				}
			}
		},
		{
			"from": [8, 8, 0],
			"to": [16, 16, 16],
			"faces": {
				"south": {
					"texture": "#second",
					"cullface": "south"
				}
			}
		},
		{
			"from": [0, 0, 0],
			"to": [8, 16, 8],
			"faces": {
				"south": {
					"texture": "#third",
					"cullface": "south"
				}
			}
		},
		{
			"from": [8, 0, 0],
			"to": [16, 16, 8],
			"faces": {
				"south": {
					"texture": "#fourth",
					"cullface": "south"
				}
			}
		}
	]
}

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

	split_model("cobblemon:apricorns", ["cobblemon:item/green_apricorn", "cobblemon:item/white_apricorn", "cobblemon:item/red_apricorn"])
	split_model("simpletms:tm_items", ["simpletms:item/tm/fire", "simpletms:item/tm/dragon", "simpletms:item/tm/fairy", "simpletms:item/tm/grass"])
	split_model("simpletms:tr_items", ["simpletms:item/tr/fire", "simpletms:item/tr/dragon", "simpletms:item/tr/fairy", "simpletms:item/tr/grass"])

	stacked_model("bubble_cobble:cattails", ["biomeswevegone:item/cattails", "biomesoplenty:item/cattail"])
	stacked_model("c:ropes", ["supplementaries:item/rope", "farmersdelight:item/rope"])
	stacked_model("c:foods/safe_raw_fish", ["minecraft:item/cod", "farmersdelight:item/cod_slice", "minersdelight:item/tentacles"])
	split_model("c:foods/dough", ["farmersdelight:item/wheat_dough", "farmersdelight:item/wheat_dough", "mynethersdelight:item/ghast_dough", "create:item/dough"])
	stacked_model("c:crops/cabbage", ["farmersdelight:item/cabbage", "farmersdelight:item/cabbage_leaf"])
	stacked_model("c:crops/rice", ["farmersdelight:item/rice", "cobblemon:item/hearty_grains"])
	stacked_model("c:crops/grain", ["minecraft:item/wheat", "farmersdelight:item/rice"])
	stacked_model("c:drinks/milk", ["farmersdelight:item/milk_bottle", "minecraft:item/milk_bucket"])
	stacked_model("c:foods/pasta", ["farmersdelight:item/raw_pasta", "mynethersdelight:item/ghasta"])
	stacked_model("c:foods/vegetable", ["minecraft:item/carrot", "cobblemon:item/medicine/medicinal_leek", "farmersdelight:item/tomato"])
	stacked_model("c:foods/raw_beef", ["minecraft:item/beef", "farmersdelight:item/minced_beef"])
	stacked_model("c:foods/raw_chicken", ["minecraft:item/chicken", "farmersdelight:item/chicken_cuts"])
	stacked_model("c:foods/raw_meat", ["minecraft:item/beef", "farmersdelight:item/chicken_cuts", "farmersdelight:item/minced_beef", "cobblemon:item/food/tasty_tail"])
	stacked_model("c:slime_balls", ["minecraft:item/slime_ball", "mowziesmobs:item/glowing_jelly"])
	stacked_model("brewinandchewin:foods/cheese_wedge", ["brewinandchewin:item/flaxen_cheese_wedge", "brewinandchewin:item/scarlet_cheese_wedge"])
	stacked_model("brewinandchewin:cheese_wheels/ripe", ["brewinandchewin:item/flaxen_cheese_wheel", "brewinandchewin:item/scarlet_cheese_wheel"])
	stacked_model("brewinandchewin:cheese_wheels/unripe", ["brewinandchewin:item/unripe_flaxen_cheese_wheel", "brewinandchewin:item/unripe_scarlet_cheese_wheel"])
	stacked_model("create:pulpifiable", ["minecraft:item/bamboo", "cobblemon:item/medicine/medicinal_leek", "minecraft:item/sugar_cane", "minecraft:block/oak_sapling"])
	stacked_model("cobblemon:berries", ["cobblemon:item/berries/cheri_berry", "cobblemon:item/berries/oran_berry", "cobblemon:item/berries/persim_berry"])
	stacked_model("farmersdelight:cabbage_roll_ingredients", ["minecraft:item/carrot", "farmersdelight:item/cod_slice", "minecraft:block/brown_mushroom", "farmersdelight:item/chicken_cuts"])
})