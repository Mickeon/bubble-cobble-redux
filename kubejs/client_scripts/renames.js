

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
	event.add("sophisticatedstorage", "item.sophisticatedstorage.paintbrush", "Storage Paintbrush")

	// Accounting for Mending Rework.
	event.add("enchdesc", "enchantment.minecraft.mending.desc", "When repaired, restores more durability and never damages the Anvil.")

	// Generated with the code below after a reload.
	// console.log(`event.addAll("biomesoplenty", {`)
	// function log_rename_item(item_id, new_name) {
	// 	// console.log(`event.add("${ID.namespace(item_id)}", "${Item.of(item_id).descriptionId}", "${new_name}")`)
	// 	console.log(`\t"${Item.of(item_id).descriptionId}": "${new_name}",`)
	// }
	// Ingredient.of(/^biomesoplenty:.*redwood/).itemIds.forEach(item_id =>
	// 	log_rename_item(item_id, Text.translate(Item.of(item_id).descriptionId).string.replace("Redwood", "Redderwood"))
	// )
	// Ingredient.of(/^biomesoplenty:.*jacaranda/).itemIds.forEach(item_id =>
	// 	log_rename_item(item_id, Text.translate(Item.of(item_id).descriptionId).string.replace("Jacaranda", "Pale Jacaranda"))
	// )
	// console.log("})")
	// Both Biomes o' Plenty and Biomes We've Gone have Redwood wood.
	// Both Biomes o' Plenty and Biomes We've Gone have Jacaranda wood.
	event.addAll("biomesoplenty", {
		"block.biomesoplenty.redwood_stairs": "Redderwood Stairs",
		"block.biomesoplenty.redwood_pressure_plate": "Redderwood Pressure Plate",
		"item.biomesoplenty.redwood_chest_boat": "Redderwood Boat with Chest",
		"block.biomesoplenty.redwood_wood": "Redderwood Wood",
		"block.biomesoplenty.redwood_slab": "Redderwood Slab",
		"block.biomesoplenty.redwood_sign": "Redderwood Sign",
		"item.biomesoplenty.redwood_boat": "Redderwood Boat",
		"block.biomesoplenty.redwood_trapdoor": "Redderwood Trapdoor",
		"block.biomesoplenty.stripped_redwood_wood": "Stripped Redderwood Wood",
		"block.biomesoplenty.redwood_fence_gate": "Redderwood Fence Gate",
		"block.biomesoplenty.redwood_log": "Redderwood Log",
		"block.biomesoplenty.redwood_leaves": "Redderwood Leaves",
		"block.biomesoplenty.redwood_hanging_sign": "Redderwood Hanging Sign",
		"block.biomesoplenty.redwood_sapling": "Redderwood Sapling",
		"block.biomesoplenty.redwood_button": "Redderwood Button",
		"block.biomesoplenty.redwood_planks": "Redderwood Planks",
		"block.biomesoplenty.potted_redwood_sapling": "Potted Redderwood Sapling",
		"block.biomesoplenty.redwood_door": "Redderwood Door",
		"block.biomesoplenty.redwood_fence": "Redderwood Fence",
		"block.biomesoplenty.stripped_redwood_log": "Stripped Redderwood Log",
		"block.biomesoplenty.jacaranda_planks": "Pale Jacaranda Planks",
		"block.biomesoplenty.stripped_jacaranda_log": "Stripped Pale Jacaranda Log",
		"item.biomesoplenty.jacaranda_chest_boat": "Pale Jacaranda Boat with Chest",
		"block.biomesoplenty.jacaranda_hanging_sign": "Pale Jacaranda Hanging Sign",
		"block.biomesoplenty.jacaranda_door": "Pale Jacaranda Door",
		"block.biomesoplenty.jacaranda_fence": "Pale Jacaranda Fence",
		"block.biomesoplenty.potted_jacaranda_sapling": "Potted Pale Jacaranda Sapling",
		"block.biomesoplenty.jacaranda_sapling": "Pale Jacaranda Sapling",
		"block.biomesoplenty.jacaranda_trapdoor": "Pale Jacaranda Trapdoor",
		"block.biomesoplenty.stripped_jacaranda_wood": "Stripped Pale Jacaranda Wood",
		"block.biomesoplenty.jacaranda_wood": "Pale Jacaranda Wood",
		"block.biomesoplenty.jacaranda_slab": "Pale Jacaranda Slab",
		"block.biomesoplenty.jacaranda_pressure_plate": "Pale Jacaranda Pressure Plate",
		"block.biomesoplenty.jacaranda_button": "Pale Jacaranda Button",
		"block.biomesoplenty.jacaranda_fence_gate": "Pale Jacaranda Fence Gate",
		"block.biomesoplenty.jacaranda_sign": "Pale Jacaranda Sign",
		"item.biomesoplenty.jacaranda_boat": "Pale Jacaranda Boat",
		"block.biomesoplenty.jacaranda_leaves": "Pale Jacaranda Leaves",
		"block.biomesoplenty.jacaranda_log": "Pale Jacaranda Log",
	})
	// Both Biomes o' Plenty and Biomes We've Gone have Cattail.
	event.add("block.biomesoplenty.cattail", "Stupidly Ugly Cattail")

	// Both Biomes o' Plenty and Biomes We've Gone have Roses.
	event.add("block.biomesoplenty.rose", "Beta Rose")

	// These are accidentally unnamed, which...
	// TODO: Should probably be reported.
	event.addAll("createmonballsoverhaul", {
		"block.createmonballsoverhaul.dense_tumblestone_coating_block": "Dense Tumblestone Coating",
		"block.createmonballsoverhaul.light_tumblestone_coating_block": "Light Tumblestone Coating",
		"block.createmonballsoverhaul.standard_tumblestone_coating_block": "Standard Tumblestone Coating",
	})
	event.add("tmtcobfarm", "block.tmtcobfarm.stove_campfire", "Stove with Campfire Pot")

	event.addAll("sophisticatedstorage", {
		"wood_name.sophisticatedstorage.biomeswevegone:zelkova": "Zelkova",
		"wood_name.sophisticatedstorage.biomesoplenty:jacaranda": "Pale Jacaranda",
	})
})

// This doesn't work for the first load.
// The renames are failing because they rely on the original translations, which are not loaded yet.
// To do it nicely, we would either have to cache them for the first time on launch, or... give up and do it manually.
// Both Biomes o' Plenty and Biomes We've Gone have Redwood wood.
// Ingredient.of(/^biomesoplenty:.*redwood/).itemIds.forEach(item_id => {
// 	const item_name = Item.of(item_id).hoverName.getString().replace("Redwood", "Redderwood")
// 	console.log(Text.translate(Item.of(item_id).descriptionId).string)
// 	if (item_name == Item.of(item_id).descriptionId) {
// 		console.log(`Could not fetch hover name for ${item_id}. Skipping`)
// 		return
// 	}
// 	event.renameItem(item_id, item_name)
// 	console.log(`Rename ${item_id} to "${item_name}"`)
// })

// Add somewhat-dummy textures for our music discs for spinning on a Jukebox.
// ClientEvents.generateAssets("after_mods", event => {
// 	Object.keys(MUSIC_LIST).forEach((key) => {
// 		let loaded_texture = event.loadTexture(`kubejs:item/music_disc_${key}`)
// 		event.texture(
// 			`amendments:block/music_discs/kubejs/music_disc_${key}`,
// 			loaded_texture
// 		)
// 	})
// 	// let loaded_texture = event.loadTexture("kubejs:item/music_disc_fool")
// 	// event.texture(
// 	// 	"amendments:block/music_discs/kubejs/music_disc_fool",
// 	// 	loaded_texture
// 	// )
// })