// priority: 100
// Run before solonion_tooltip.
let $Move = Java.loadClass("com.cobblemon.mod.common.api.moves.Move")
let $Moves = Java.loadClass("com.cobblemon.mod.common.api.moves.Moves")

/** @import {$MutableComponent} from "@package/net/minecraft/network/chat" */

const MASCOT_COLOR = "#83BED9"
const MASCOT_COLOR_DARK = "#537B8D"
const SHIFT_INFO_COLOR = "#7CB3D6"

const PLACEABLE_TOOLTIP = Text.of(`Placeable`).color(MASCOT_COLOR_DARK)
const PLACEABLE_SNEAKING_TOOLTIP = PLACEABLE_TOOLTIP.copy().append([" while", Text.of(` sneaking`).color(MASCOT_COLOR)])

ItemEvents.modifyTooltips(event => {
	if (Platform.isLoaded("sophisticatedcore")) {
		// Fix Sophisticated Backpack's Inventory Interaction Upgrades descriptions being misleading.
		// They say "sneak right clicked inventory" but it's actually a keybind.
		event.modify(["sophisticatedbackpacks:deposit_upgrade", "sophisticatedbackpacks:advanced_deposit_upgrade"], text => {
			text.removeLine(1)
			text.insert(1, Text.translate("Deposits items from backpack when pressing %s on an inventory", [
				Text.keybind("key.sophisticatedbackpacks.inventory_interaction").white()]).color(MASCOT_COLOR_DARK)
			)
		})
		event.modify(["sophisticatedbackpacks:restock_upgrade", "sophisticatedbackpacks:advanced_restock_upgrade"], text => {
			text.removeLine(1)
			text.insert(1, Text.translate("Restocks items from backpack when pressing %s on an inventory", [
				Text.keybind("key.sophisticatedbackpacks.inventory_interaction").white()]).color(MASCOT_COLOR_DARK)
			)
		})
		// Mitigate confusion between Sophisticated Backpack and Storage upgrades.
		event.modify([
			"#sophisticatedbackpacks:upgrade",
			"#sophisticatedstorage:upgrade",
			/sophisticated.*upgrade/, // Catch all.
		], text => {
			text.dynamic("add_sophisticated_marker")
		})
	}

	if (!Platform.isLoaded("cleanertooltips")) {
		event.modifyAll({advanced: false}, text => {
			text.dynamic("show_tool_durability")
		})
	}

	event.modify([
		"#c:foods/edible_when_placed",
		"minecraft:pumpkin_pie", // Odd edge-case. It can also be placed on Display Delight's Food Plates.
	], text => {
		text.removeText(Text.translate("tooltip.farmersdelight.placeable")) // If it exists, replace with our tooltip. TODO: Report this. Can it be a config?
		text.insert(1, PLACEABLE_TOOLTIP)
	})

	event.add("#cobblemon:item_blocks", PLACEABLE_TOOLTIP)

	event.add(["farmersdelight:tree_bark"], [subtle("Use on stripped wood to defy logic")])

	if (Platform.isLoaded("sleep_tight")) {
		event.add(["#sleep_tight:hammocks"], [Text.of([`Placeable between `, Text.of(`3 blocks`).color(MASCOT_COLOR), ` or `, Text.of(`2 fences`).color(MASCOT_COLOR)]).color(MASCOT_COLOR_DARK)])
		event.add(["sleep_tight:dreamer_essence"], [subtle("Keeps Bedbugs at bay, attracts Phantoms,"), subtle("    and is rather soothing...")])
		event.add(["sleep_tight:bedbug_eggs"], subtle("Use on a bed to infest it."))
	}

	if (Platform.isLoaded("urban_decor")) {
		event.modify(["urban_decor:steel_pipe"], text => {
			text.insert(1, PLACEABLE_TOOLTIP)
		})
		event.modify("urban_decor:toolbox", text => {
			text.insert(1, PLACEABLE_SNEAKING_TOOLTIP)
		})
		// There is a tooltip for each wrappable block, and there's many more of them.
		// Is this even necessary anymore?
		event.modify("#urban_decor:wraps", text => {
			text.insert(1, [
				PLACEABLE_TOOLTIP.copy().append(" on:"),
				Text.of(["• ", Text.translate("block.urban_decor.porcelain_table").color(MASCOT_COLOR)]).color(MASCOT_COLOR_DARK),
				Text.of(["• ", Text.translate("block.urban_decor.fridge").color(MASCOT_COLOR)]).color(MASCOT_COLOR_DARK),
				Text.of(["• Any ", Text.of(`wooden box`).color(MASCOT_COLOR)]).color(MASCOT_COLOR_DARK),
				Text.of(["• and so much more!"]).color(MASCOT_COLOR_DARK)
			])
		})
		event.add(["urban_decor:towel_bar"], [subtle("Can contain").append(Text.gold(" any towel"))])
	}

	if (Platform.isLoaded("connectiblechains")) {
		event.modify("#connectiblechains:catenary_items", {shift: false}, text => {
			text.removeText(Text.translate("message.connectiblechains.connectible_chain"))
			text.insert(1, Text.join(
				`Catenary`,
				Text.of(` ℹ`).darkGray(),
			).color(MASCOT_COLOR_DARK))
		})
		event.modify("#connectiblechains:catenary_items", {shift: true}, text => {
			text.removeText(Text.translate("message.connectiblechains.connectible_chain_detailed"))
			text.insert(1, Text.join(
				Text.of(`Use`).color(MASCOT_COLOR),
				` on fences, walls, or bars to create a `,
				Text.of(`catenary`).color(MASCOT_COLOR),
				`!`
			).color(MASCOT_COLOR_DARK))
		})
		event.modify("#connectiblechains:hangable_items", {shift: false}, text => {
			text.insert(1, Text.join(`Hangable on catenary`).color(MASCOT_COLOR_DARK))
		})
	}

	//#region These mostly existed as tests, but they're relatively innocuous.
	event.modify("minecraft:skeleton_skull", text => {
		text.dynamic("skeleton_skull")
	})
	event.modify("minecraft:player_head", text => {
		text.dynamic("show_player_head_owner")
	})

	event.modify("minecraft:beacon", { shift: false }, text => {
		text.add(Text.gold("Hold ").append(Text.yellow("Shift ")).append("to see more info"))
	})

	event.modify("minecraft:beacon", { shift: true }, text => {
		text.insert(1, Text.green("Gives positive effects to players in a range").bold(true))
		text.insert(2, Text.red("Requires a base built out of precious metals or gems to function!"))
		text.insert(3,
			Text.white("Iron, ").append(
			Text.aqua("Diamonds, ")).append(
			Text.gold("Gold ")).append(
			Text.white("or even ")).append(
			Text.green("Emeralds ")).append(
			Text.white("are valid base blocks!"))
		)
	})
	add_shift_info(event, "minecraft:big_dripleaf", [
			[Text.of(`It's a bit `), Text.aqua("tipsy"), Text.of(`...`)],
			"Woooaaah §2 it's going down §9 holy cow"])
	//#endregion

	event.add(Ingredient.of("@immersive_furniture").or("@sleep_tight").or("@crittersandcompanions"), [
		Text.yellow("Experimental").append(Text.of(` 🧊`).white()),
	])

	event.modifyAll({ alt: true, ctrl: true, advanced: true }, text => {
		text.dynamic("show_modpack_debug_stuff")
	})
})

ItemEvents.dynamicTooltips("add_sophisticated_marker", event => {
	event.lines[0] = Text.of(event.lines[0]).append(event.item.mod == "sophisticatedbackpacks" ? " 🎒" : " 📦")
})

ItemEvents.dynamicTooltips("show_tool_durability", event => {
	const item = event.item
	if (!item.damaged) {
		return
	}

	const durability = (item.maxDamage - item.damageValue)
	const durability_ratio = durability / item.maxDamage
	let damage_color = Color.GRAY

	if (durability_ratio <= 0.1) {
		damage_color = Color.DARK_RED
	}
	else if (durability_ratio <= 0.3) {
		damage_color = Color.RED
	}
	else if (durability_ratio <= 0.5) {
		damage_color = Color.GOLD
	}

	event.add([
		Text.translatableWithFallback("", "Durability: %s / %s", [
			Text.of(durability.toFixed(0)).color(damage_color),
			Text.of(item.maxDamage).gray()
		]).darkGray()
	])
})

ItemEvents.dynamicTooltips("skeleton_skull", event => {
	event.add(Text.gray("Could this have been ").append(Client.player.name).append("'s head?"))
})


ItemEvents.dynamicTooltips("show_player_head_owner", event => {
	/** @import {$ResolvableProfile} from "@package/net/minecraft/world/item/component"*/
	const profile = /** @type {$ResolvableProfile?} */ (event.item.components.get("minecraft:profile"))
	const player_name = profile && profile.isResolved() && profile.name().get()
	if (player_name) {
		event.lines.add(1, Text.translateWithFallback("", "Looks like %s's head...", [Text.aqua(player_name)]).darkGray())
	}
})

ItemEvents.dynamicTooltips("show_modpack_debug_stuff", event => {
	event.add(Text.gray(["🏴 ", Text.darkGray(event.item.getDescriptionId() ?? "none")]))

	if (Platform.isLoaded("sounds")) {
		/** @type {import {"@package/imb11/sounds/sound/context"}.$ItemStackSoundContext} */
		let $ItemStackSoundContext = Java.tryLoadClass("dev.imb11.sounds.sound.context.ItemStackSoundContext")
		if ($ItemStackSoundContext) {
			let sound_context = new $ItemStackSoundContext()
			/** @type {import("@package/net/minecraft/client/resources/sounds").$SoundInstance} */
			let sound_instance = sound_context.handleContext(event.item, ID.of("minecraft:intentionally_empty", false), 1.0, 1.0)
			event.add(Text.gray("🔊 ").append(Text.darkGray(sound_instance.getLocation())))
		}
	}

	const block = event.item.block
	if (block) {
		let sound_type = block.invokeGetSoundType(block.defaultBlockState())
		event.add(Text.gray("⏹ ").append(Text.darkGray(sound_type.placeSound.getLocation())))
	}
})


let $RenderTooltipEvent$Color = Java.loadClass("net.neoforged.neoforge.client.event.RenderTooltipEvent$Color")
NativeEvents.onEvent("highest", $RenderTooltipEvent$Color, event => {
	event.setBorderStart(Color.rgba(26, 108, 184, 1).getArgb())

	const item_stack = event.getItemStack()
	if (item_stack.isEmpty()) {
		return
	}
	const graphics = event.getGraphics()

	switch (item_stack.mod) {
		case "kubejs":
		case "bubble_cobble": {
			graphics.renderFakeItem("bubble_cobble:blue_mascot_cat", event.x, event.y - 8)
			if (item_stack.id == "bubble_cobble:chiseled_mud_bricks") {
				let tooltip_stretch = 1 + Math.abs(Math.sin(Utils.getSystemTime() * 0.005)) * 0.01
				let limit = Math.min(item_stack.count, 10)
				graphics.scale(1.0, tooltip_stretch, 1.0).push()
				for (let i = 0; i < limit; i++) {
					let fake_item_offset = Math.abs(Math.sin(Utils.getSystemTime() * 0.005 + i * 1.2)) * -20
					graphics.renderFakeItem(item_stack,
						event.x + i * 10,
						event.y - 10 + fake_item_offset
					)
				}
				graphics.pop()
			}
		} break;
		case "cobblemon":
		case "cobbreeding":
		case "cobblenav":
		case "cobblemonraiddens": {
			let rarity = item_stack.getRarity()
			if (rarity == "epic") {
				graphics.renderFakeItem("cobblemon:master_ball", event.x, event.y - 10)
				event.setBorderStart(Color.rgba(184, 26, 176, 1).getArgb())
			} else if (rarity == "rare") {
				graphics.renderFakeItem("cobblemon:beast_ball", event.x, event.y - 10)
				event.setBorderStart(Color.rgba(60, 148, 170, 1).getArgb())
			} else {
				graphics.renderFakeItem("cobblemon:poke_ball", event.x, event.y - 10)
				event.setBorderStart(Color.rgba(151, 36, 28, 1).getArgb())
			}
			if (item_stack.id == "cobblemon:technical_machine") {
				let move_name = item_stack.get("cobblemon:tm_move")?.moveName
				if (move_name) {
					let move = $Moves.getByNameOrDummy(move_name)
					let type_hue = move.elementalType.hue
					let vec = new Vec3f(
						type_hue % 0x1000000 / 0x10000,
						type_hue % 0x10000 / 0x100,
						type_hue % 0x100
					)
					let progress = Math.abs(Math.sin(Utils.getSystemTime() * 0.001))
					vec = vec.lerp(new Vec3f(255, 255, 255), progress)

					event.setBorderStart(Color.rgba(vec.x(), vec.y(), vec.z(), 1).getArgb())
				}
			}

		} break;
		case "mega_showdown":
		case "zamega": {
			graphics.renderFakeItem(item_stack.mod == "mega_showdown"
					? "mega_showdown:swampertite"
					: "mega_showdown:absolite_z",
				event.x,
				event.y - 10
			)
			if (item_stack.hasTag("mega_showdown:mega_stone")) {
				let progress = Math.abs(Math.sin(Utils.getSystemTime() * 0.0025))
				let r = progress * 100
				let g = progress * 100
				let b = progress * 80
				event.setBorderStart(Color.rgba(85 + r, 101 + g, 114 + b, 1).getArgb())
				event.setBorderEnd(Color.rgba(30, 50, 87, 1).getArgb())
			} else if (item_stack.id == "mega_showdown:mega_stone"
				|| item_stack.id == "mega_showdown:mega_stone_crystal"
			) {
				event.setBorderStart(Color.rgba(195, 202, 216, 1).getArgb())
				event.setBorderEnd(Color.rgba(30, 50, 87, 1).getArgb())
			} else if (item_stack.id == "mega_showdown:keystone"
				|| item_stack.id == "mega_showdown:keystone_block"
				|| item_stack.id == "mega_showdown:keystone_ore"
			) {
				event.setBorderStart(Color.rgba(
					180 + Math.sin(Utils.getSystemTime() * 0.0025) * 60,
					180 + Math.sin(Utils.getSystemTime() * 0.001) * 60,
					180 + Math.sin(Utils.getSystemTime() * 0.005) * 60,
					1
				).getArgb())
				event.setBorderEnd(Color.rgba(30, 50, 87, 1).getArgb())
			} else {
				event.setBorderStart(Color.rgba(60, 99, 170, 1).getArgb())
			}
		} break;
		case "create":
		case "createdeco":
		case "create_deepfried":
		case "create_bic_bit":
		case "bits_n_bobs": {
			event.setBorderStart(item_stack.getRarity() == "epic"
				? Color.rgba(184, 26, 176, 1).getArgb()
				: Color.rgba(138, 90, 19, 1).getArgb()
				// : Color.rgba(184, 121, 26, 1).getArgb()
			)
		} break;
		case "copycats": {
			let progress = Math.abs(Math.sin(Utils.getSystemTime() * 0.001))
			let r = progress * 100
			let g = progress * 20
			let b = progress * -80
			event.setBorderStart(Color.rgba(85 + r, 101 + g, 114 + b, 1).getArgb())
			event.setBorderEnd(Color.rgba(32, 38, 44, 1).getArgb())
			// event.setBackgroundStart(Color.rgba(18, 21, 27, 1).getArgb())
		} break;
		case "farmersdelight": {
			if (item_stack.id == "farmersdelight:hamburger") {
				graphics.translate(event.getX() * -1.5, 0, 0).scale(2.5, 1, 1)
			}
		}
		case "arts_and_crafts": {
			if (item_stack.hasTag("arts_and_crafts:paintbrushes")) {
				// Jank jank jank.
				let color_name = item_stack.idLocation.getPath().split("_paintbrush")[0] + "_dye"
				event.setBorderStart(Color.wrap(color_name).getArgb())
			} else if (item_stack.id == "arts_and_crafts:bleachdew") {
				event.setBorderStart(Color.wrap("bleachdew_dye").getArgb())
			}
		}
		case "urban_decor": {
			event.setBorderStart(Color.wrap("gray_dye").getArgb())
		}
	}
	// event.setBackground(Color.rgba(8, 21, 95, 1).getArgb())
	// event.setBackgroundStart(Color.rgba(26, 50, 184, 1).getArgb())
})

/** @param {string | $MutableComponent} text @returns {$MutableComponent} */
function subtle(text) {
	return Text.of(text).color(MASCOT_COLOR_DARK).italic()
}

/**
 * @import {$TextActionBuilder} from "@package/dev/latvian/mods/kubejs/text/action"
 * @import {$ModifyItemTooltipsKubeEvent} from "@package/dev/latvian/mods/kubejs/item"
 * @import {$Ingredient} from "@package/net/minecraft/world/item/crafting"
 */

/**
 * @param {$ModifyItemTooltipsKubeEvent} event
 * @param {$Ingredient} item
 * @param {Array<string> | string} info
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
