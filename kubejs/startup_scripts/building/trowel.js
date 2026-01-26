
/** @type {typeof import("net.minecraft.world.item.component.Tool").$Tool } */
let $Tool  = Java.loadClass("net.minecraft.world.item.component.Tool")
/** @type {typeof import("java.util.Random").$Random } */
let $Random  = Java.loadClass("java.util.Random")
/** @type {typeof import("net.minecraft.world.item.context.UseOnContext").$UseOnContext } */
let $UseOnContext  = Java.loadClass("net.minecraft.world.item.context.UseOnContext")
/** @type {typeof import("net.minecraft.world.item.context.BlockPlaceContext").$BlockPlaceContext } */
let $BlockPlaceContext  = Java.loadClass("net.minecraft.world.item.context.BlockPlaceContext")
/** @type {typeof import("net.minecraft.world.phys.BlockHitResult").$BlockHitResult } */
let $BlockHitResult  = Java.loadClass("net.minecraft.world.phys.BlockHitResult")

StartupEvents.registry("item", event => {
	/**
	 * @param {import("net.minecraft.world.entity.ai.attributes.Attribute").$Attribute$$Type} attribute
	 * @param {string} id
	 * @param {number} amount
	 * @param {import("net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation").$AttributeModifier$Operation$$Type} operation
	 * @param {import("net.minecraft.world.entity.EquipmentSlotGroup").$EquipmentSlotGroup$$Type} slot
	 * @returns {import("net.minecraft.world.item.component.ItemAttributeModifiers$Entry").$ItemAttributeModifiers$Entry$$Type}
	 */
	function modifier(attribute, amount, operation, id, slot) {
		return {attribute: attribute, slot: slot, modifier: {amount: amount, id: id, operation: operation}}
	}

	event.create("trowel")
			.unstackable()
			.maxDamage(250)
			.tooltip(Text.of(`Randomly places blocks from your hotbar`).gray())
			.component("minecraft:attribute_modifiers", new $ItemAttributeModifiers([
				modifier("minecraft:generic.attack_speed", -2, "add_value", "minecraft:base_attack_speed", "mainhand"),
				modifier("minecraft:player.block_interaction_range", 2, "add_value", "kubejs:trowel", "hand"),
				modifier("minecraft:generic.attack_knockback", 5, "add_value", "kubejs:trowel", "mainhand"),
			], true))
			.component("minecraft:tool", new $Tool([
					{ blocks: "#minecraft:incorrect_for_iron_tool", correct_for_drops: false },
					{ blocks: "#minecraft:mineable/shovel", correct_for_drops: true, speed: 4.0 }
				], 1.5, 1)
			)
			.parentModel("minecraft:item/handheld")
			.tag("minecraft:enchantable/durability")
			.tag("c:tools")
			.tag("nova_structures:enchantable/metal")
})

StartupEvents.modifyCreativeTab("minecraft:tools_and_utilities", event => {
	event.add("kubejs:trowel")
})

// Called on both clients and servers, ideally.
/** @param {import("dev.latvian.mods.kubejs.block.BlockRightClickedKubeEvent").$BlockRightClickedKubeEvent$$Type} event */
global.use_trowel_on_block = function (event) {
	const player = event.player
	const level = event.level
	const hand = event.hand

	const candidate_items = global.get_eligible_items_for_trowel(player)
	if (candidate_items.isEmpty()) {
		return false
	}
	/** @type {$ItemStack} */
	const chosen_item = Utils.randomOf($Random.from($Random.getDefault()), candidate_items)

	const block_place_context = new $BlockPlaceContext(
		player, hand, chosen_item, new $BlockHitResult(
			event.hitResult.location, event.facing, event.block.getPos(), false
		)
	)
	const interaction_result = chosen_item.useOn(block_place_context)
	if (interaction_result == "fail") {
		player.playNotifySound("bubble_cobble:buzz", "blocks", 0.5, 1.0)
		return false
	}
	if (interaction_result.consumesAction()) {
		event.item.hurtAndBreak(1, player, $Player.getSlotForHand(event.hand))
	}
	if (interaction_result.indicateItemUse()) {
		let sound_type = chosen_item.block.getSoundType(chosen_item.block.defaultBlockState(), level, event.block.getPos(), player)
		player.playNotifySound(sound_type.placeSound, "blocks", 1.0, 1.0)
		player.swing(hand, true)
	}
	return true
}

/** @param {$Player} player @returns {$List<$ItemStack>} */
global.get_eligible_items_for_trowel = function(player) {
	let candidate_items = Utils.newList()
	for (let i = 0; i < 9; i++) {
		let item = player.inventory.getItem(i) // From the hotbar.
		if (item.block) {
			candidate_items.add(item)
		}
	}
	return candidate_items
}