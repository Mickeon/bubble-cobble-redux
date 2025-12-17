// priority: 100
// Run before solonion_tooltip.

const MASCOT_COLOR = "#83BED9"
const MASCOT_COLOR_DARK = "#537B8D"
const SHIFT_INFO_COLOR = "#7CB3D6"

const PLACEABLE_TOOLTIP = Text.of("Placeable").color(MASCOT_COLOR_DARK).italic()
const HAMMER_TOOLTIP = Text.of("Can be changed with the Handcrafter's Hammer").color(MASCOT_COLOR_DARK).italic()

ItemEvents.modifyTooltips(event => {
	event.add(["cobblemon:ice_stone"], Text.of("Emanates a blue mascot cat scent...").color(MASCOT_COLOR))

	// Handcrafted Quality-of-Life.
	event.add(["#handcrafted:cushions"], PLACEABLE_TOOLTIP)
	event.add(["#handcrafted:counters", "#handcrafted:counters", "#handcrafted:cupboards", "#handcrafted:drawers", "#handcrafted:shelves", "#handcrafted:trims"], HAMMER_TOOLTIP)
	add_shift_info(event, "#handcrafted:sheets", ["§9Can be put on:", "  §9- §bTables", "  §9- §bSide Tables", "  §9- §bDesks", "  §9- §bNightstands", "  §9- §bFancy Beds"])
	add_shift_info(event, "#handcrafted:cushions", ["§9Can be put on:", "  §9- §bCouches", "  §9- §bBenches", "  §9- §bChairs", "  §9- §bFancy Beds"])
	add_shift_info(event, "#handcrafted:counters", [
			"§9With a §bcalcite§9 counter top. Use these blocks to change its appearance!",
			"    §bOak§9, §bBirch§9, §bSpruce§9, §bJungle,",
			"    §bDark Oak§9, §bAcacia§9, §bWarped§9, §bCrimson,",
			"    §bMangrove§9, §bCherry§9, §bBamboo§9, §bQuartz,",
			"    §bStone§9, §bAndesite§9, §bGranite§9, §bDiorite,",
			"    §bBricks§9, §bBlackstone§9, §bSmooth Stone§9, §bDeepslate,",
			"    §bDripstone§9, §bCalcite.",
	])

	event.add(["#handcrafted:fancy_beds"],
			"§9Try putting on a §bCushion or §bSheet§9 for some extra colour!")
	event.add(["#handcrafted:tables", "#handcrafted:side_tables", "#handcrafted:desks", "#handcrafted:nightstands"],
			"§9Try putting any §bSheet§9 for some extra colour!")
	event.add(["#handcrafted:couches", "#handcrafted:benches", "#handcrafted:chairs"],
			"§9Try putting any §bCushion§9 for some extra colour!")

	add_shift_info(event, "minecraft:big_dripleaf", [
			[Text.of("It's a bit "), Text.aqua("tipsy"), Text.of("...")],
			"Woooaaah §2 it's going down §9 holy cow"])

	add_shift_info(event, "handcrafted:hammer", [
			"§9Allows you to change the shape of",
			"§9§bCounters§9, §bCupboards§9, §bDrawers§9, §bShelves§9, §bTrims§9"])

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

	/** @import {$MutableComponent} from "net.minecraft.network.chat.MutableComponent" */
	/** @param {string | $MutableComponent} text @returns {$MutableComponent} */
	function subtle(text) {
		return Text.of(text).color(MASCOT_COLOR_DARK).italic()
	}
	// event.add(["quark:trowel"], Text.gray("Places a random block from your hotbar.").italic())
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

/**
 * @import {$TextActionBuilder} from "dev.latvian.mods.kubejs.text.action.TextActionBuilder"
 * @import {$ModifyItemTooltipsKubeEvent} from "dev.latvian.mods.kubejs.item.ModifyItemTooltipsKubeEvent"
 * */

/**
 * @param {$ModifyItemTooltipsKubeEvent} event
 * @param {Special.Item} item
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
