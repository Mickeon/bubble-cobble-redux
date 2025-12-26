// priority: 100
// Run before solonion_tooltip.

/** @import {$MutableComponent} from "net.minecraft.network.chat.MutableComponent" */

const MASCOT_COLOR = "#83BED9"
const MASCOT_COLOR_DARK = "#537B8D"
const SHIFT_INFO_COLOR = "#7CB3D6"

const PLACEABLE_TOOLTIP = Text.of("Placeable").color(MASCOT_COLOR_DARK).italic()

ItemEvents.modifyTooltips(event => {
	event.add(["cobblemon:ice_stone"], Text.of("Emanates a blue mascot cat scent...").color(MASCOT_COLOR))

	if (Platform.isLoaded("handcrafted")) {
		// Remove their SHIFT info in favour of ours.
		const HAMMER_TOOLTIP = Text.of("Can be changed with the Handcrafter's Hammer").color(MASCOT_COLOR_DARK).italic()
		const HANDCRAFTED_ITEMS_WITH_SHIFT_INFO = [
			"#handcrafted:cushions",
			"#handcrafted:sheets",
			"#handcrafted:benches",
			"#handcrafted:couches",
			"#handcrafted:chairs",
			"#handcrafted:tables",
			"#handcrafted:side_tables",
			"#handcrafted:desks",
			"#handcrafted:nightstands",
			"#handcrafted:tables",
			"#handcrafted:fancy_beds",
			"#handcrafted:counters",
			"#handcrafted:cupboards",
			"#handcrafted:drawers",
			"#handcrafted:shelves",
			"#handcrafted:trims"
		]
		event.modify(HANDCRAFTED_ITEMS_WITH_SHIFT_INFO, text => {
			text.removeText(Text.translate("tooltip.handcrafted.shift_description"))
		})
		event.modify(HANDCRAFTED_ITEMS_WITH_SHIFT_INFO, {shift: true}, text => {
			// They probably run this through a text splitter, so removing by looking up
			// the translation Text component does not actually work. Cool jank.
			/** @type {String[]} */
			// const whole_translated_strings = [
			// 	Text.translate("tooltip.handcrafted.bed_pillow").string,
			// 	Text.translate("tooltip.handcrafted.bed_sheet").string,
			// 	Text.translate("tooltip.handcrafted.counter").string,
			// 	Text.translate("tooltip.handcrafted.cushion").string,
			// 	Text.translate("tooltip.handcrafted.hammer_use_look").string,
			// 	Text.translate("tooltip.handcrafted.hammer_use_look_shift").string,
			// 	Text.translate("tooltip.handcrafted.hammer_use_shape").string,
			// 	Text.translate("tooltip.handcrafted.place_on_furniture").string,
			// 	Text.translate("tooltip.handcrafted.sheet").string,
			// ]
			// // FIXME: This doesn't always work
			// for (let whole_string of whole_translated_strings) {
			// 	let word_wrapped_string = whole_string.match(/(.{1,40}(\s|$))\s*/g)
			// 	for (let string of word_wrapped_string) {
			// 		console.log(string.trim())
			// 		text.removeText(string.trim())
			// 	}
			// }

			// Quite horrid hack to be honest.
			text.removeText("Right-click with a cushion to change the")
			text.removeText("Right-click with a sheet to change the")
			text.removeText("Right-click with a hammer to change the")
			text.removeText("Right-click with wood or stone to")
			text.removeText("Right-click with wood or stone to")
			text.removeText("Shift-right-click with a hammer to")
			text.removeText("change the block's look.")
			text.removeText("change the counter surface.")
			text.removeText("block's look.")
			text.removeText("block's shape.")
			text.removeText("bed's pillow color.")
			text.removeText("bedsheets.")
		})
		event.add(["#handcrafted:cushions", ], PLACEABLE_TOOLTIP)
		event.add(["#handcrafted:counters", "#handcrafted:cupboards", "#handcrafted:drawers", "#handcrafted:shelves", "#handcrafted:trims"], HAMMER_TOOLTIP)
		add_shift_info(event, "#handcrafted:sheets", ["§rCan be put on:", "  §r- §bTables", "  §r- §bSide Tables", "  §r- §bDesks", "  §r- §bNightstands", "  §r- §bFancy Beds"])
		add_shift_info(event, "#handcrafted:cushions", ["§rCan be put on:", "  §r- §bCouches", "  §r- §bBenches", "  §r- §bChairs", "  §r- §bFancy Beds"])
		add_shift_info(event, "#handcrafted:counters", [
				"With a §bcalcite§r counter top. Use these blocks to change its appearance!",
				"    §bOak§r, §bBirch§r, §bSpruce§r, §bJungle,",
				"    §bDark Oak§r, §bAcacia§r, §bWarped§r, §bCrimson,",
				"    §bMangrove§r, §bCherry§r, §bBamboo§r, §bQuartz,",
				"    §bStone§r, §bAndesite§r, §bGranite§r, §bDiorite,",
				"    §bBricks§r, §bBlackstone§r, §bSmooth Stone§r, §bDeepslate,",
				"    §bDripstone§r, §bCalcite.",
		])

		event.add(["#handcrafted:fancy_beds"],
				"§rTry putting on a §bCushion §ror §bSheet§r for some extra colour!")
		event.add(["#handcrafted:tables", "#handcrafted:side_tables", "#handcrafted:desks", "#handcrafted:nightstands"],
				"§rTry putting any §bSheet§r for some extra colour!")
		event.add(["#handcrafted:couches", "#handcrafted:benches", "#handcrafted:chairs"],
				"§rTry putting any §bCushion§r for some extra colour!")

		add_shift_info(event, "handcrafted:hammer", [
				"§rAllows you to change the shape of",
				"§r§bCounters§r, §bCupboards§r, §bDrawers§r, §bShelves§r, §bTrims§r"])
	}

	add_shift_info(event, "minecraft:big_dripleaf", [
			[Text.of("It's a bit "), Text.aqua("tipsy"), Text.of("...")],
			"Woooaaah §2 it's going down §9 holy cow"])


	add_shift_info(event, "supplementaries:flute", [
		"Turns anyone into a blocky virtuoso,",
		"attracting all of your pets right where you're standing.",
		"",
		"Right-click on some friends to bind the Flute.",
		"A bound friend will teleport to you, no matter what!",
	])
	add_shift_info(event, "supplementaries:blackboard", [
		"Express your paltry creativity.",
		"Try painting with any Dye, Coal,",
		"Redstone, Apricorns... erm, Chocolate?",
		"",
		"Right-click to open the GUI if you fancy painting programs.",
	])
	add_shift_info(event, "supplementaries:bellows", [
		"Emits wind gusts when powered by redstone.",
		"The stronger the power, the faster the push frequency.",
		"When next to a Bellow:",
		"  - Furnaces burn faster",
		"  - Fire is kept alive",
		"  - Copper ages faster",
	])
	add_shift_info(event, "supplementaries:redstone_illuminator", [
		"Gives off light that is inversely",
		"proportional to its redstone power."
	])
	add_shift_info(event, "supplementaries:cog_block", [
		"Propagates its redstone power to adjacent",
		"Cog Blocks, even vertically. Nifty!"
	])
	add_shift_info(event, "supplementaries:crystal_display", [
		"Displays crystal. Well, a number",
		"or symbol when powered by redstone.",
		"Suitable for haters of the Clock Block.",
	])
	add_shift_info(event, "supplementaries:antique_ink", [
		"Can be used on any Sign, Map, Written Book or Globe",
		"to make it a tad more old-school. Antique, even.",
	])
	add_shift_info(event, "supplementaries:turn_table", [
		"Rotates blocks and entities when powered by redstone.",
		"The stronger the power, the faster the rotation.",
		"Right-click on the side to change the spinning direction.",
		"... And please do not rotate your cat.",
	])
	add_shift_info(event, ["supplementaries:bamboo_spikes", "supplementaries:bamboo_spikes_tipped"], [
		"Slow and damage all entities walking on them.",
		"Can be infused with Lingering Potions.",
	])
	add_shift_info(event, "supplementaries:faucet", [
		"An extremely powerful wonder of hydraulics.",
		"Can be attached to any fluid or item container",
		"to pour its contents below it.",
		"Works with waterlogged blocks, Cauldrons",
		"Brewing Stands, even Beehives, and more.",
	])
	add_shift_info(event, "supplementaries:hourglass", [
		"Can be filled with any sand, dust,",
		"even honey, or anything similar.",
		"Right-click with an empty hand to to spin the hourglass around.",
	])
	add_shift_info(event, "#supplementaries:awnings", [
		"The latest of dainty, overhanging technology.",
		"",
		"Hold Shift while on top to fall through.",
	])
	add_shift_info(event, "supplementaries:cannon", [
		"Can shoot projectiles and blocks,",
		"at the cost of Gunpowder.",
		"Right-click to open the Cannon's interface.",
		"When manually controlling the cannon:",
		"  - Left-click to fire",
		"  - Right-click to toggle the trajectory guide",
		"  - Mouse wheel to change power level",
		"  - Space Bar to change aiming mode",
		"  - Shift, E, or Esc to exit",
	])
	add_shift_info(event, "supplementaries:wrench", [
		"Allows you to rotate blocks and some entities around.",
		"Not for repairing. And most definitely not for machinery!",
		"",
		"Right-click to rotate clockwise.",
		"Shift-right-click to rotate counter-clockwise.",
	])
	add_shift_info(event, "supplementaries:lunch_basket", [
		"Consume food without worrying much about what food it is!.",
		"More nifty than a Foodbag. Can be dragged in your inventory",
		"like a Bundle.",
		"",
		"When the Basket is closed:",
		"    Hold right-click to select the food.",
		"    Mouse movement, scroll wheel and slot keys are supported.",
		"When the Basket is open:",
		"    Right-click to eat the chosen food.",
	])
	event.add("supplementaries:lunch_basket", PLACEABLE_TOOLTIP)

	event.modify(["solonion:lunchbag", "solonion:lunchbox", "solonion:golden_lunchbox"], text => text.removeText(Text.translate("item.solonion.container.open", Text.keybind("key.sneak"), Text.keybind("key.use"))))
	add_shift_info(event, ["solonion:lunchbag", "solonion:lunchbox", "solonion:golden_lunchbox"], [
		"Consume food without worrying much about what food it is!",
		"More awkward than a Food Basket, but simpler.",
		"",
		"Right-click to begin eating.",
		"Shift-right-click to open the food container.",
	])

	/** @param {string | $MutableComponent} text @returns {$MutableComponent} */
	function subtle(text) {
		return Text.of(text).color(MASCOT_COLOR_DARK).italic()
	}

	event.add(["supplementaries:sconce_lever"], subtle("Not so cunning when you can read this, huh?"))
	event.add(["supplementaries:feather_block"], subtle("Negates all fall damage."))
	event.add(["supplementaries:goblet"], subtle("Can hold and display any liquid."))
	event.add(["supplementaries:sugar_cube"], subtle("Dissolves when touching water."))
	event.add(["supplementaries:soap_block"], subtle("Quite slippery when stepped on!"))
	event.add(["supplementaries:enderman_head"], subtle("Emits redstone power the more you look at it."))
	event.add(["supplementaries:flint_block"], [subtle("Scraped against Iron lights a ").append(Text.gold("spark")).append("...")])
	event.add(["supplementaries:doormat"], [subtle("Could there be ").append(Text.gold("something")).append(" underneath it?")])
	event.add(["supplementaries:confetti_popper"], [subtle("Makes for a nice ").append(Text.gold("hat")).append(". Creepers like it too!")])
	event.add(["supplementaries:bunting"], [subtle("Can be placed on ").append(Text.gold("Ropes"))])
	event.add(["supplementaries:gravel_bricks"], [subtle("It's frail under your feet")])
	event.add(["supplementaries:lumisene_bucket"], [subtle("Bewildering, perhaps ").append(Text.gold("flammable")).append("?")])


	// Lmao even.
	// event.addAdvanced("minecraft:splash_potion", (itemstack, advanced, text) => {
	// 	if (itemstack.getNbt().getString("Potion") == "gohome:recall_potion") {
	// 		// text.add(2, Text.gray("Sue-be-gone!"))
	// 		text.remove(0)
	// 		text.add(0, Text.lightPurple("Sue-be-gone Potion"))
	// 	}
	// })

	event.add("#c:foods/edible_when_placed", PLACEABLE_TOOLTIP)

	event.modify("kubejs:banana_mayo_sandwich", text => {
		text.dynamic("sue_banana_mayo_sandwich")
	})
	event.modify(["create:chocolate_bucket", "create:honey_bucket", "create_bic_bit:mayonnaise_bucket", "create_bic_bit:ketchup_bucket"], text => {
		text.dynamic("add_pelad")
	})

	event.add("#constructionstick:construction_sticks", Text.translate("Press %s to to open the GUI", [Text.keybind("key.constructionstick.open_gui").white()]).color(MASCOT_COLOR_DARK))
	event.add(["ribbits:umbrella_leaf"], [subtle("Weee!")])

	// Fix Sophisticated Backpack's Inventory Interaction Upgrades descriptions being misleading.
	// They say "sneak right clicked inventory" but it's actually a keybind.
	event.modify(["sophisticatedbackpacks:deposit_upgrade", "sophisticatedbackpacks:advanced_deposit_upgrade"], text => {
		text.removeLine(1)
		text.insert(1, Text.translate("Deposits items from backpack when pressing %s on an inventory", [
			Text.keybind("keybind.sophisticatedbackpacks.inventory_interaction").white()]).color(MASCOT_COLOR_DARK)
		)
	})
	event.modify(["sophisticatedbackpacks:restock_upgrade", "sophisticatedbackpacks:advanced_restock_upgrade"], text => {
		text.removeLine(1)
		text.insert(1, Text.translate("Restocks items from backpack when pressing %s on an inventory", [
			Text.keybind("keybind.sophisticatedbackpacks.inventory_interaction").white()]).color(MASCOT_COLOR_DARK)
		)
	})

	// let recipe_manager = Client.player.level.recipeManager
	// recipe_manager.byType("create:sequenced_assembly").forEach((id, sequenced_assembly) => {
	// 	add_sequence_info(event, sequenced_assembly)
	// })
})

ItemEvents.dynamicTooltips("sue_banana_mayo_sandwich", event => {
	if (Client.player.username == "SueTheMimiga") {
		event.lines[0] = Text.of("Banana Mayo Delicacy 😳") // Funny :)
	}
})

ItemEvents.dynamicTooltips("add_pelad", event => {
	if (Client.player.username == "AceNil_" || Client.player.username == "SniperZee") {
		event.lines[0] = Text.of(event.lines[0]).append(" 😳")
	}
})

/**
 * @import {$TextActionBuilder} from "dev.latvian.mods.kubejs.text.action.TextActionBuilder"
 * @import {$ModifyItemTooltipsKubeEvent} from "dev.latvian.mods.kubejs.item.ModifyItemTooltipsKubeEvent"
 * @import {$Ingredient} from "net.minecraft.world.item.crafting.Ingredient"
 * */

/**
 * @param {$ModifyItemTooltipsKubeEvent} event
 * @param {$Ingredient} item
 * @param {String[] | String} info
 */
function add_shift_info(event, item, info) {
	event.modify(item, { shift: false }, /** @param {$TextActionBuilder} text */ text => {
		text.insert(1, Text.darkGray("Hold [").append(Text.white("Shift")).append("] for Summary"))
	})
	event.modify(item, { shift: true }, /** @param {$TextActionBuilder} text */ text => {
		text.insert(1, Text.darkGray("Hold [").append(Text.gray("Shift")).append("] for Summary"))

		text.insert(2, Text.empty())

		if (!Array.isArray(info)) {
			info = [info]
		}
		info = info.map(line => {
			return Text.of(line).color(SHIFT_INFO_COLOR)
		})

		text.insert(3, info)
	})
}

/**
 * @param {Internal.ItemTooltipEventJS} event
 * @param {Internal.SequencedAssemblyRecipe} sequenced_assembly
 */
function add_sequence_info(event, sequenced_assembly) {
	event.addAdvanced(sequenced_assembly.resultPool[0].stack, (itemstack, advanced, text) => {
		if (!event.shift) {
			text.add([Text.darkGray("Hold ["), Text.gray("Shift"), Text.darkGray("] for Assembly")])
			return
		}

		const input_name = sequenced_assembly.ingredient.first.hoverName.aqua()

		// All of this jank is because the "Pokeball Catch rate" tooltip is hardcoded in a specific spot.
		let i = 1
		text.add(i, Text.empty())
		text.add(i, Text.gray("Starting from ").append(input_name).append(":"))
		i += 1;

		for (const sequenced_recipe of sequenced_assembly.getSequence()) {
			/** @type {Internal.ProcessingRecipe} */
			let recipe = sequenced_recipe.recipe

			let ingredient_names = Text.gold("")
			recipe.ingredients.forEach(ingredient => {
				if (ingredient.test(sequenced_assembly.transitionalItem)) {
					return
				}
				ingredient_names.append(ingredient.first.hoverName.gold())
			})

			let line = Text.darkGray("- ")
			switch (recipe.type) {
				case "create:deploying": {
					line.append(Text.translate(`create.recipe.assembly.deploying_item`, [ingredient_names]).white())
				} break;
				case "create:filling": {
					line.append(Text.translate(`create.recipe.assembly.spout_filling_fluid`, [recipe.fluidIngredients.get(0).getMatchingFluidStacks().get(0).displayName.gold()]).white())
				} break;
				default: {
					line.append(Text.translate(`create.recipe.assembly.${recipe.type.path}`, [ingredient_names]).white())
				} break;
			}
			text.add(i, line)
			i += 1;
		}

		const loop_count = sequenced_assembly.getLoops()
		if (loop_count > 1) {
			text.add(i, Text.gray("Repeat ").append(Text.white(loop_count.toFixed())).append(" times."))
		}
	})
}
