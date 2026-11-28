// requires: numismatics
let $GameRules = Java.loadClass("net.minecraft.world.level.GameRules")

/**
 * @import {$KubeBlockEntity, $InventoryAttachment$Wrapped} from "@package/dev/latvian/mods/kubejs/block/entity"
 */

/** @import {SellingManager} from "../../startup_scripts/custom/capitalism" */
this.SellingManager = global.SellingManager

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
		"cobblemon:galarica_nut_bush",
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

	event.add("bubble_cobble:shops/dummy", "minecraft:orange_glazed_terracotta")
	event.add("bubble_cobble:shops/gourmand", "minecraft:red_glazed_terracotta")
	event.add("bubble_cobble:shops/gadgeter", "minecraft:yellow_glazed_terracotta")
	event.add("bubble_cobble:shops/carpenter", "minecraft:brown_glazed_terracotta")
	event.add("bubble_cobble:shops/botanist", "minecraft:green_glazed_terracotta")
	event.add("bubble_cobble:shops/lightner", "minecraft:white_glazed_terracotta")
})

ServerEvents.tags("item", event => {
	event.add("bubble_cobble:sellable", Object.keys(SellingManager.item_prices))
})

ServerEvents.recipes(event => {
	event.shaped("bubble_cobble:shipping_bin", ["T", "C"], {T: "#minecraft:trapdoors", C: "#c:chests/wooden"})
})

PlayerEvents.inventoryOpened("kubejs:menu", event => {
	if (!event.inventoryContainer.slots.get(1).container.isEmpty()) {
		return // Hack to not catch the Research Station, since that once only has one slot.
	}

	// For some reason the container for non-player slots is empty. It should be the block's. KubeJS be damned.
	let any_money = event.inventoryContainer.slots.stream().anyMatch(s => s.container.isEmpty() && s.item.hasTag("numismatics:coins"))
	if (any_money) {
		event.player.playNotifySound("bubble_cobble:block.shipping_bin.open_money", "blocks", 1.0, 1.0)
	} else {
		event.player.playNotifySound("bubble_cobble:block.shipping_bin.open_nothing", "blocks", 1.0, 1.0)
	}
})

BlockEvents.blockEntityTick("bubble_cobble:shipping_bin", event => {
	const shipping_bin = /** @type {$KubeBlockEntity} */ (event.block.entity)
	if (!event.level.gameRules.getBoolean($GameRules.RULE_DAYLIGHT)) {
		shipping_bin.info.tickFrequency(SEC * 5) // Mostly for debugging purposes.
	}
	const inventory = /** @type {$InventoryAttachment$Wrapped} */ (shipping_bin.attachments.get("inventory"))
	let total_price = 0
	for (let item_stack of inventory.getAllItems()) {
		let price = SellingManager.get_price(item_stack)
		if (price == 0) {
			continue
		}
		// console.log(`${item_stack} ---> ${price}$`)
		total_price += price
		item_stack.shrink(99)
	}
	if (total_price == 0) {
		return // Optimization.
	}

	let coins = Currency.create_coins_from_value(total_price, [])
	for (let coin of coins) {
		inventory.insertItem(Item.of(coin), false)
	}
	if (coins.length == 0) {
		console.error(`No coins came out from ${shipping_bin}. This should never happen.`)
		play_sound_globally(event.level, event.block.pos.center, "minecraft:block.lava.pop", "blocks", 0.5)
		return
	}

	play_sound_globally(event.level, event.block.pos.center, "bubble_cobble:block.shipping_bin.sell", "blocks")
})

//#region Anhilate Bone Meal's functionality for the most part.
const $DispenserBlock = Java.loadClass("net.minecraft.world.level.block.DispenserBlock");
$DispenserBlock.registerBehavior(Items.BONE_MEAL, new Java.loadClass("net.minecraft.core.dispenser.DefaultDispenseItemBehavior")());

BlockEvents.rightClicked(event => {
	if (event.item.item != Items.BONE_MEAL || !event.block.hasTag("bubble_cobble:cannot_bonemeal") || event.player.isCreative()) {
		return
	}
	event.player.playNotifySound("bubble_cobble:ui.buzz", "players", 0.5, 1.0)
	event.cancel()
})

//#endregion
