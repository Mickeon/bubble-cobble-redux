

ClientEvents.lang("en_us", event => {
	event.add("item.handcrafted.hammer", "Handcrafter's Hammer")
	event.add("item.supplementaries.wrench", "Rotation Wrench")
	event.add("block.supplementaries.crank", "Redstone Crank")

	event.add("block.biomesoplenty.rose_quartz_block", "Block of Nether Rose Quartz")
	event.add("block.biomesoplenty.rose_quartz_cluster", "Nether Rose Quartz Cluster")
	event.add("block.biomesoplenty.large_rose_quartz_bud", "Large Nether Rose Quartz Bud")
	event.add("block.biomesoplenty.medium_rose_quartz_bud", "Medium Nether Rose Quartz Bud")
	event.add("block.biomesoplenty.small_rose_quartz_bud", "Small Nether Rose Quartz Bud")
	event.add("item.biomesoplenty.rose_quartz_chunk", "Nether Rose Quartz Chunk")

	event.add("farmersdelight", "block.farmersdelight.rope", "Straw Rope")
	event.add("cobblemon", "block.cobblemon.tatami_block", "Hearty Tatami Block")
	event.add("cobblemon", "block.cobblemon.tatami_mat", "Hearty Tatami Mat")

	// Accounting for Mending Rework.
	event.add("enchdesc", "enchantment.minecraft.mending.desc", "When repaired, restores more durability and never damages the Anvil.")

	// Tee-hee.
	event.add("advancement.create.hand_crank_000", "Cranking it")
	event.add("item.minecraft.rabbit_stew", "Mimiga Stew")
	event.add("item.minersdelight.rabbit_stew_cup", "Mimiga Stew Cup")
	event.add("item.minecraft.lead", "Leash")
	event.add("entity.minecraft.wandering_trader", "Free Leash Guy")

	// Both Biomes o0 Plenty and Biomes We've Gone have Redwood wood.
	Ingredient.of(/^biomesoplenty:.*redwood/).itemIds.forEach(item_id => {
		const item_name = Item.of(item_id).hoverName.getString().replace("Redwood", "Redderwood")
		event.renameItem(item_id, item_name)
	})
	// Both Biomes o' Plenty and Biomes We've Gone have Jacaranda wood.
	Ingredient.of(/^biomesoplenty:.*jacaranda/).itemIds.forEach(item_id => {
		const item_name = Item.of(item_id).hoverName.getString().replace("Jacaranda", "Pale Jacaranda")
		if (item_name.includes("Pale Pale")) {
			return // Horrid hack to avoid renaming twice when reloading.
		}
		event.renameItem(item_id, item_name)
	})
	// Both Biomes o' Plenty and Biomes We've Gone have Cattail.
	event.add("block.biomesoplenty.cattail", "Stupidly Ugly Cattail")
})
