// requires: justhammers

/**
 * @import {$Tool} from "net.minecraft.world.item.component.Tool"
 * @import {$Tool$Rule} from "net.minecraft.world.item.component.Tool$Rule"
 */

ItemEvents.modification(event => {
	// Make hammers... break more stuff.
	event.modify(["justhammers:stone_hammer", "justhammers:stone_reinforced_hammer", "justhammers:iron_hammer", "justhammers:iron_reinforced_hammer"], /** @param {$ItemModifications} modified */ modified => {
		const item_path = modified.item().idLocation.getPath()
		const is_stone = item_path.startsWith("stone")

		const axe_breaking_speed = is_stone ? 3.0 : 5.0
		const ore_breaking_speed = is_stone ? 2.0 : 4.0
		/** @type {$Tool} */
		const tool = modified.componentMap.get("minecraft:tool")
		/** @type {$List<$Tool$Rule>} */
		const rules = Utils.newList()
		rules.addAll(tool.rules())
		rules.add({speed: axe_breaking_speed, blocks: "#minecraft:mineable/axe", correctForDrops: true})
		rules.add({speed: axe_breaking_speed, blocks: "#c:glass_blocks", correctForDrops: false})
		modified.tool = {
			damagePerBlock: tool.damagePerBlock(),
			defaultMiningSpeed: tool.defaultMiningSpeed(),
			rules: rules
		}

		// Reinforced Hammers lasts disproportionately too much.
		if (item_path.includes("reinforced")) {
			let damage = modified.componentMap.get("minecraft:max_damage")
			modified.maxDamage = damage / (is_stone ? 6 : 3)
		}
	})
})

// We are basically going to use only 4 Hammers from this.
StartupEvents.modifyCreativeTab("justhammers:creative_tab", event => event.remove("*"))
StartupEvents.modifyCreativeTab("minecraft:tools_and_utilities", event => {
	event.addAfter("minecraft:iron_axe", ["justhammers:iron_reinforced_hammer", "justhammers:iron_hammer"])
	event.addAfter("minecraft:stone_axe", ["justhammers:stone_reinforced_hammer", "justhammers:stone_hammer"])
})