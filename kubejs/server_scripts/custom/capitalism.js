
//#region Anhilate Bone Meal's functionality for the most part.
const $DispenserBlock = Java.loadClass("net.minecraft.world.level.block.DispenserBlock");
$DispenserBlock.registerBehavior(Items.BONE_MEAL, new Java.loadClass("net.minecraft.core.dispenser.DefaultDispenseItemBehavior")());

ServerEvents.tags("block", event => {
	// FIXME: This makes Flowering Azalea and Azalea Leaves non-renewable.
	event.add("bubble_cobble:cannot_bonemeal",
		"#cobblemon:plants",
		"#minecraft:crops",
		"#minecraft:saplings",
		"#mynethersdelight:powdery_cane",
		"arts_and_crafts:lotus_flower",
		"biomeswevegone:apple_fruit",
		"biomeswevegone:blueberry_bush",
		"biomeswevegone:green_apple_fruit",
		"cobblemon:galarica_nuts",
		"cobblemon:hearty_grains",
		"create_bic_bit:sunflower_seeds",
		"farmersdelight:rice",
		"minecraft:bamboo",
		"minecraft:bamboo_sapling",
		"minecraft:cocoa",
		"minecraft:sweet_berry_bush",
		"undergroundworlds:jungle_vines",
		"undergroundworlds:jungle_vines_plant",
	)
})

BlockEvents.rightClicked(event => {
	if (event.item.item != Items.BONE_MEAL || !event.block.hasTag("bubble_cobble:cannot_bonemeal") || event.player.isCreative()) {
		return
	}
	event.player.playNotifySound("bubble_cobble:ui.buzz", "players", 0.5, 1.0)
	event.cancel()
})

//#endregion

