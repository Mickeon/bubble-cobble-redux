// requires: supplementaries

ItemEvents.modifyTooltips(event => {
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
		"Consume food comfortably in the palm of your hand!.",
		"More nifty than a Foodbag, but you gotta choose.",
		"Can be dragged in your inventory like a Bundle.",
		"",
		"When the Basket is closed:",
		"    Hold right-click to select the food.",
		"    Mouse movement, scroll wheel and slot keys are supported.",
		"When the Basket is open:",
		"    Right-click to eat the chosen food.",
	])

	event.add(["supplementaries:sconce_lever"], subtle("Not so cunning when you can read this, huh?"))
	event.add(["supplementaries:feather_block"], subtle("Negates all fall damage."))
	event.add(["supplementaries:goblet"], subtle("Can hold and display any liquid."))
	event.add(["supplementaries:sugar_cube"], subtle("Dissolves when touching water."))
	event.add(["supplementaries:soap_block"], subtle("Quite slippery when stepped on!"))
	event.add(["supplementaries:enderman_head"], subtle("Emits redstone power the more you look at it."))
	event.add(["supplementaries:flint_block"], [subtle("Scraped against Iron lights a ").append(Text.gold("spark")).append("...")])
	event.add(["supplementaries:doormat"], [subtle("Could there be ").append(Text.gold("something")).append(" underneath it?")])
	event.add(["supplementaries:confetti_popper"], [subtle("Makes for a nice ").append(Text.gold("hat")).append(". Creepers like it too!")])
	// event.add(["#supplementaries:buntings"], [subtle("Can be placed on ").append(Text.gold("Ropes"))]) // Redundant, the mod has its own tooltip.
	event.add(["supplementaries:gravel_bricks"], [subtle("It's frail under your feet")])
	event.add(["supplementaries:lumisene_bucket"], [subtle("Bewildering, perhaps ").append(Text.gold("flammable")).append("?")])
	event.add(["supplementaries:sack"], [subtle("This can store stuff, by the way")])
	event.add(["supplementaries:flower_box"], [subtle("Can only contain ").append(Text.gold("tall flowers"))])
	event.add(["supplementaries:pulley_block"], [subtle("").append(Text.gold("Ropes")).append(" and ").append(Text.gold("chains")).append(" in here!")])

	event.modify(["supplementaries:lunch_basket", "supplementaries:cannonball"], text => {
		text.insert(1, PLACEABLE_TOOLTIP)
	})
})