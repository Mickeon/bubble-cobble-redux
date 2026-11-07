// requires: yo_hooks
// requires: constructionstick
// requires: gag

ItemEvents.modification(event => {
	// The config settings for changing the Grappling Hooks' values has been removed. So we must do it this way.
	// This is technically no longer necessary, see config/yo_hooks/overlaps.json
	function change_hook_values(item, max_damage, length) {
		event.modify(item, modified => {
			const hook_definition = modified.item().hookDefinition
			if (!hook_definition) {
				console.error(`Hook definition not found for ${modified.item().id}. Aborting.`)
				return
			}
			if (max_damage) {
				hook_definition.durability = max_damage
				modified.maxDamage = hook_definition.durability
			}
			if (length) {
				hook_definition.length = length
			}
		})
	}
	change_hook_values("yo_hooks:gold_grappling_hook", 36, 30)
	change_hook_values("yo_hooks:diamond_grappling_hook", 144, 21)
	change_hook_values("yo_hooks:netherite_grappling_hook", 216, 26)

	if (Platform.isLoaded("crittersandcompanions")) {
		// Bring it in line with the other grappling hooks.
		event.modify(["crittersandcompanions:grappling_hook"], modified => {
			modified.maxDamage = 96 // Defaults to 256.
		})
	}

	event.modify("gag:escape_rope", modified => {
		// Interestingly, `finishUsing`, `use`, and `useAnimation`, do not work. `releaseUsing` works.
		// https://github.com/MaxNeedsSnacks/gag/blob/1.21.1/src/main/java/ky/someone/mods/gag/item/EscapeRopeItem.java
		// Those methods happen to have been overridden in the Escape Rope class, is that why?
		modified.barColor(item_stack => global.bar_color_escape_rope(item_stack))
		modified.barWidth(item_stack => global.bar_width_escape_rope(item_stack))
	})
})

StartupEvents.modifyCreativeTab("kubejs:tab", event => {
	event.add(Item.of("constructionstick:netherite_stick", {
		"constructionstick:lock": "nolock",
		"constructionstick:direction": "target",
		"constructionstick:destruction": true,
		"constructionstick:angel": true,
		"constructionstick:replacement": true,
		"constructionstick:unbreakable": true,
		"constructionstick:selected": "constructionstick:default",
		"minecraft:unbreakable": {show_in_tooltip: false},
		"minecraft:item_name": Text.of(`God Stick`),
		"minecraft:rarity": "epic",
		"minecraft:lore": Text.of(`Only available in Creative Mode`).lightPurple()
	}))
})

remove_tab("constructionstick:tab") // Items also exist in Tools & Utilities tab.

remove_tab("yo_hooks:grappling_hooks") // Rather small and redundant tab.
StartupEvents.modifyCreativeTab("minecraft:tools_and_utilities", event => {
	event.addAfter("minecraft:iron_hoe", "yo_hooks:iron_grappling_hook")
	event.addAfter("minecraft:golden_hoe", "yo_hooks:gold_grappling_hook")
	event.addAfter("minecraft:diamond_hoe", "yo_hooks:diamond_grappling_hook")
	event.addAfter("minecraft:netherite_hoe", "yo_hooks:netherite_grappling_hook")
})
StartupEvents.modifyCreativeTab("minecraft:ingredients", event => {
	event.add([
		"yo_hooks:iron_hook_head",
		"yo_hooks:gold_hook_head",
		"yo_hooks:diamond_hook_head",
		"yo_hooks:netherite_hook_head"
	])
})

remove_tab("gag:gag") // A lot of the items here go unused in this modpack.
StartupEvents.modifyCreativeTab("minecraft:tools_and_utilities", event => {
	event.add([
		"gag:time_sand_pouch",
		"gag:escape_rope"
	])
})

/** @param {$ItemStack} item_stack */
global.bar_color_escape_rope = function(item_stack) {
	if (Client.player && Client.player.getUseItem() == item_stack) {
		let $Mth = Java.loadClass("net.minecraft.util.Mth")
		let value = remap(Client.player.getUseItemRemainingTicks(), 0, item_stack.getUseDuration(Client.player), 0.25, 1.0)
		return Color.wrap($Mth.hsvToRgb(0.6, 0.73, value))
	}

	return Color.BROWN_DYE
}

/** @param {$ItemStack} item_stack @returns {number} */
global.bar_width_escape_rope = function(item_stack) {
	if (Client.player && Client.player.getUseItem() == item_stack) {
		return remap(Client.player.getUseItemRemainingTicks(), 0, item_stack.getUseDuration(Client.player), 0, 13)
	}

	return 13 // No bar at all.
}
