

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

	event.add("key.kubejs.bubble_cobble.mouse_wheel_up", "Simulate Mouse Wheel Up")
	event.add("key.kubejs.bubble_cobble.mouse_wheel_down", "Simulate Mouse Wheel Down")

	// Generated with the code below after a reload.
	// console.log(`event.addAll("biomesoplenty", {`)
	// function log_rename_item(item_id, new_name) {
	// 	// console.log(`event.add("${ID.namespace(item_id)}", "${Item.of(item_id).descriptionId}", "${new_name}")`)
	// 	console.log(`\t"${Item.of(item_id).descriptionId}": "${new_name}",`)
	// }
	// Ingredient.of(/biomesoplenty.*redwood/).itemIds.forEach(item_id =>
	// 	log_rename_item(item_id, Text.translate(Item.of(item_id).descriptionId).string.replace("Redwood", "Redderwood"))
	// )
	// Ingredient.of(/biomesoplenty.*jacaranda/).itemIds.forEach(item_id =>
	// 	log_rename_item(item_id, Text.translate(Item.of(item_id).descriptionId).string.replace("Jacaranda", "Pale Jacaranda"))
	// )
	// console.log("})")
	// Both Biomes o' Plenty and Biomes We've Gone have Redwood wood.
	// Both Biomes o' Plenty and Biomes We've Gone have Jacaranda wood.
	event.addAll("biomesoplenty", {
		"block.biomesoplenty.potted_redwood_sapling": "Potted Redderwood Sapling",
		"block.biomesoplenty.redwood_button": "Redderwood Button",
		"block.biomesoplenty.redwood_door": "Redderwood Door",
		"block.biomesoplenty.redwood_fence": "Redderwood Fence",
		"block.biomesoplenty.redwood_fence_gate": "Redderwood Fence Gate",
		"block.biomesoplenty.redwood_hanging_sign": "Redderwood Hanging Sign",
		"block.biomesoplenty.redwood_leaves": "Redderwood Leaves",
		"block.biomesoplenty.redwood_log": "Redderwood Log",
		"block.biomesoplenty.redwood_planks": "Redderwood Planks",
		"block.biomesoplenty.redwood_pressure_plate": "Redderwood Pressure Plate",
		"block.biomesoplenty.redwood_sapling": "Redderwood Sapling",
		"block.biomesoplenty.redwood_sign": "Redderwood Sign",
		"block.biomesoplenty.redwood_stairs": "Redderwood Stairs",
		"block.biomesoplenty.redwood_trapdoor": "Redderwood Trapdoor",
		"block.biomesoplenty.redwood_wood": "Redderwood Wood",
		"block.biomesoplenty.stripped_redwood_log": "Stripped Redderwood Log",
		"block.biomesoplenty.stripped_redwood_wood": "Stripped Redderwood Wood",
		"item.biomesoplenty.redwood_boat": "Redderwood Boat",
		"item.biomesoplenty.redwood_chest_boat": "Redderwood Boat with Chest",
		"item.snowyspirit.biomesoplenty.sled_redwood": "Redderwood Sled",
		"item.supplementaries.biomesoplenty.cannon_boat_redwood": "Redderwood Boat with Cannon",
		"item.supplementaries.biomesoplenty.way_sign_redwood": "Redderwood Way Sign",

		"block.biomesoplenty.jacaranda_button": "Pale Jacaranda Button",
		"block.biomesoplenty.jacaranda_door": "Pale Jacaranda Door",
		"block.biomesoplenty.jacaranda_fence": "Pale Jacaranda Fence",
		"block.biomesoplenty.jacaranda_fence_gate": "Pale Jacaranda Fence Gate",
		"block.biomesoplenty.jacaranda_hanging_sign": "Pale Jacaranda Hanging Sign",
		"block.biomesoplenty.jacaranda_leaves": "Pale Jacaranda Leaves",
		"block.biomesoplenty.jacaranda_log": "Pale Jacaranda Log",
		"block.biomesoplenty.jacaranda_planks": "Pale Jacaranda Planks",
		"block.biomesoplenty.jacaranda_pressure_plate": "Pale Jacaranda Pressure Plate",
		"block.biomesoplenty.jacaranda_sapling": "Pale Jacaranda Sapling",
		"block.biomesoplenty.jacaranda_sign": "Pale Jacaranda Sign",
		"block.biomesoplenty.jacaranda_slab": "Pale Jacaranda Slab",
		"block.biomesoplenty.jacaranda_stairs": "Pale Jacaranda Stairs",
		"block.biomesoplenty.jacaranda_trapdoor": "Pale Jacaranda Trapdoor",
		"block.biomesoplenty.jacaranda_wood": "Pale Jacaranda Wood",
		"block.biomesoplenty.potted_jacaranda_sapling": "Potted Pale Jacaranda Sapling",
		"block.biomesoplenty.stripped_jacaranda_log": "Stripped Pale Jacaranda Log",
		"block.biomesoplenty.stripped_jacaranda_wood": "Stripped Pale Jacaranda Wood",
		"item.biomesoplenty.jacaranda_boat": "Pale Jacaranda Boat",
		"item.biomesoplenty.jacaranda_chest_boat": "Pale Jacaranda Boat with Chest",
		"item.snowyspirit.biomesoplenty.sled_jacaranda": "Pale Jacaranda Sled",
		"item.supplementaries.biomesoplenty.cannon_boat_jacaranda": "Pale Jacaranda Boat with Cannon",
		"item.supplementaries.biomesoplenty.way_sign_jacaranda": "Pale Jacaranda Way Sign",
	})
	// Both Biomes o' Plenty and Biomes We've Gone have Cattail.
	event.add("block.biomesoplenty.cattail", "Stupidly Ugly Cattail")

	// Both Biomes o' Plenty and Biomes We've Gone have Roses.
	event.add("block.biomesoplenty.rose", "Beta Rose")

	// Both Supplementaries and Mega Showdown have Pedestals.
	event.add("mega_showdown", "block.mega_showdown.pedestal", "Small Pedestal")

	// Both Biomes We've Gone and and Snowy Spirit have Wreaths.
	event.add("snowyspirit", "block.snowyspirit.wreath", "Jolly Wreath")

	// As Dog Food now works on Pokemon, too.
	event.add("farmersdelight", "item.farmersdelight.dog_food", "Pet Food")
	event.add("farmersdelight", "farmersdelight.tooltip.dog_food.when_feeding", "When fed to a tamed pet:")

	// These are accidentally unnamed, which...
	// TODO: Should probably be reported.
	event.addAll("createmonballsoverhaul", {
		"block.createmonballsoverhaul.dense_tumblestone_coating_block": "Dense Tumblestone Coating",
		"block.createmonballsoverhaul.light_tumblestone_coating_block": "Light Tumblestone Coating",
		"block.createmonballsoverhaul.standard_tumblestone_coating_block": "Standard Tumblestone Coating",
	})

	event.addAll("sophisticatedstorage", {
		"wood_name.sophisticatedstorage.biomeswevegone:zelkova": "Zelkova",
		"wood_name.sophisticatedstorage.biomesoplenty:jacaranda": "Pale Jacaranda",
	})

	event.addAll("effectdescriptions", {
		"effect.cnc.sobbing.desc": "Makes you cry uncontrollably, fully covering your vision with tears",
		"effect.cobblemon.cleanse_all.desc": "Removes all current effects",
		"effect.cobblemon.cleanse_negative.desc": "Removes all current negative effects",
		"effect.cobblemon.mental_restoration.desc": "Delays the player's Insomnia",
		"effect.create_bic_bit.oiled_up.desc": "Cover yourself in oil to float on the surface of water and outside in the rain. Also makes you quite slippery.",
	})

	// For loot tables shown in EMI Loot.
	event.addAll("emi_loot", {
		// TODO: These are too many and it's not exhaustive. There's got to be a programmatic way to do it.
		"emi_loot.archaeology.cobblemon:ruins/rare/automaton_armor_trim_smithing_template": "§bRare§r Armor Trim in Ruins",
		"emi_loot.archaeology.cobblemon:ruins/rare/black_tumblestone": "§bRare§r Black Tumblestone in Ruins",
		"emi_loot.archaeology.cobblemon:ruins/rare/sky_tumblestone": "§bRare§r Sky Tumblestone in Ruins",
		"emi_loot.archaeology.cobblemon:ruins/rare/tumblestone": "§bRare§r Tumblestone in Ruins",
		"emi_loot.archaeology.cobblemon:fossils/common/prehistoric_birch_tree": "Common in Prehistoric Birch Tree",
		"emi_loot.archaeology.cobblemon:fossils/uncommon/prehistoric_birch_tree": "§eUncommon§r in Prehistoric Birch Tree",

		"emi_loot.chest.cobblemon:ruins/gilded_chests/base": "Gilded Chest in Ruins's Base",
		"emi_loot.chest.cobblemon:ruins/gilded_chests/ruins": "Gilded Chest in Ruins",
		"emi_loot.chest.cobblemon:ruins/pots/ruins": "Pot in Ruins",
		"emi_loot.chest.cobblemon:shipwreck_coves/fishing_boats/fishing_boat": "Fishing Boat Shipwreck Cove",
		"emi_loot.chest.cobblemon:shipwreck_coves/gilded_chests/big_treasure": "Big Treasure in Shipwreck Cove",
		"emi_loot.chest.cobblemon:shipwreck_coves/gilded_chests/lesser_treasure": "Lesser Treasure in Shipwreck Cove",
		"emi_loot.chest.cobblemon:shipwreck_coves/spawners/extra_normal": "(Extra) Normal spawners in Shipwreck Cove",
		"emi_loot.chest.cobblemon:shipwreck_coves/spawners/extra_ominous": "(Extra) Ominous spawners in Shipwreck Cove",
		"emi_loot.chest.cobblemon:shipwreck_coves/spawners/normal": "Normal spawners in Shipwreck Cove",
		"emi_loot.chest.cobblemon:shipwreck_coves/spawners/ominous": "Ominous spawners in Shipwreck Cove",
		"emi_loot.chest.cobblemon:shipwreck_coves/vanilla_chests/cove1_barrel": "Barrel in Shipwreck Cove (1)",
		"emi_loot.chest.cobblemon:shipwreck_coves/vanilla_chests/cove1_chest": "Chest in Shipwreck Cove (1)",
		"emi_loot.chest.cobblemon:shipwreck_coves/vanilla_chests/cove2_barrel": "Barrel in Shipwreck Cove (2)",
		"emi_loot.chest.cobblemon:villages/village_pokecenters": "Village Pokécenter",
		"emi_loot.chest.cobblemonraiddens:raid/tier/tier_one": "Tier 1 Raid§8 ⭐",
		"emi_loot.chest.cobblemonraiddens:raid/tier/tier_two": "Tier 2 Raid§8 ⭐⭐",
		"emi_loot.chest.cobblemonraiddens:raid/tier/tier_three": "Tier 3 Raid§8 ⭐⭐⭐",
		"emi_loot.chest.cobblemonraiddens:raid/tier/tier_four": "Tier 4 Raid§8 ⭐⭐⭐⭐",
		"emi_loot.chest.cobblemonraiddens:raid/tier/tier_five": "Tier 5 Raid§8 ⭐⭐⭐⭐⭐",
		"emi_loot.chest.cobblemonraiddens:raid/tier/tier_six": "Tier §4§n6§r Raid§4 ⭐⭐⭐⭐⭐⭐",
		"emi_loot.chest.cobblemonraiddens:raid/tier/tier_seven": "Tier §c§n7§r Raid§c ⭐⭐⭐⭐⭐⭐⭐",
		"emi_loot.chest.lootr:reward/trophy": "Open 100 Lootr containers!",
		"emi_loot.chest.ribbits:chests/fisherman_main": "🐸 Fisherman Main Chest",
		"emi_loot.chest.ribbits:chests/fisherman_storage": "🐸 Fisherman Storage Chest",
		"emi_loot.chest.ribbits:chests/gardener": "🐸 Gardener Chest",
		"emi_loot.chest.ribbits:chests/merchant": "🐸 Merchant Chest",
		"emi_loot.chest.ribbits:chests/nitwit": "🐸 Nitwit Chest",
		"emi_loot.chest.ribbits:chests/sorcerer": "🐸 Sorcerer Chest",
		"emi_loot.chest.undergroundbunker:chests/underground_bunker/underground_bunker_normal": "Normal Loot in Underground Bunker",
		"emi_loot.chest.undergroundbunker:chests/underground_bunker/underground_bunker_supply": "Supply Loot in Underground Bunker",
		"emi_loot.chest.undergroundbunker:chests/underground_bunker/underground_bunker_treasure": "Treasure Loot in Underground Bunker",

		"emi_loot.gameplay.cobblemon:fishing/pokerod": "Pokerod Fishing Drops",
		"emi_loot.gameplay.cobblemon:fishing/pokerod_treasure": "Pokerod Fishing Treasure Drops",
		"emi_loot.gameplay.mynethersdelight:gameplay/mnd_piglin_bartering": "Piglin Bantering (Delight)",

		"emi_loot.function.copy_name.BLOCK_ENTITY": "the destroyed block", // https://github.com/fzzyhmstrs/EMI_loot/issues/154.
		"emi_loot.function.copy_state": "The destroyed block's properties are copied to this item",
		"emi_loot.item_predicate.enchant.list": "%s",
		"emi_loot.item_predicate.enchant.levels_3": "§8(at least %s§8)§r",
		"emi_loot.item_predicate.enchant.levels_4": "§8(at most %s§8)§r",
	})
})

// This doesn't work for the first load.
// The renames are failing because they rely on the original translations, which are not loaded yet.
// To do it nicely, we would either have to cache them for the first time on launch, or... give up and do it manually.
// Both Biomes o' Plenty and Biomes We've Gone have Redwood wood.
// Ingredient.of(/biomesoplenty.*redwood/).itemIds.forEach(item_id => {
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