
let $Tool = Java.loadClass("net.minecraft.world.item.component.Tool")
let $Random = Java.loadClass("java.util.Random")
let $UseOnContext = Java.loadClass("net.minecraft.world.item.context.UseOnContext")
let $BlockPlaceContext = Java.loadClass("net.minecraft.world.item.context.BlockPlaceContext")
let $BlockHitResult = Java.loadClass("net.minecraft.world.phys.BlockHitResult")
let $DiggerItemBuilder = Java.loadClass("dev.latvian.mods.kubejs.item.custom.DiggerItemBuilder")
let $DiggerItem = Java.loadClass("net.minecraft.world.item.DiggerItem")

StartupEvents.registry("item", event => {
	/**
	 * @param {import("@package/net/minecraft/world/entity/ai/attributes").$Attribute_} attribute
	 * @param {string} id
	 * @param {number} amount
	 * @param {import("@package/net/minecraft/world/entity/ai/attributes").$AttributeModifier$Operation_} operation
	 * @param {import("@package/net/minecraft/world/entity").$EquipmentSlotGroup_} slot
	 * @returns {import("@package/net/minecraft/world/item/component").$ItemAttributeModifiers$Entry_}
	 */
	function modifier(attribute, amount, operation, id, slot) {
		return {attribute: attribute, slot: slot, modifier: {amount: amount, id: id, operation: operation}}
	}
	event.add("minecraft:item", new $DiggerItemBuilder(
				"bubble_cobble:trowel", 0, 0,
				(tier, properties) => new $DiggerItem(tier, "minecraft:dirt", properties)
			)
			// .maxDamage(250)
			.tier("minecraft:iron")
			.attackDamageBaseline(1)
			.attackDamageBonus(0)
			.tooltip(Text.of(`Randomly places blocks from your hotbar`).gray())
			.component("minecraft:attribute_modifiers", new $ItemAttributeModifiers([
				modifier("minecraft:generic.attack_speed", -2, "add_value", "minecraft:base_attack_speed", "mainhand"),
				modifier("minecraft:player.block_interaction_range", 2, "add_value", "bubble_cobble:trowel", "hand"),
				modifier("minecraft:generic.attack_knockback", 5, "add_value", "bubble_cobble:trowel", "mainhand"),
				modifier("minecraft:player.mining_efficiency", 0.5, "add_value", "bubble_cobble:trowel", "mainhand"),
			], true))
			// .component("minecraft:tool", new $Tool([
			// 		{ blocks: "#minecraft:incorrect_for_iron_tool", correct_for_drops: false },
			// 		{ blocks: "#minecraft:mineable/shovel", correct_for_drops: true, speed: 4.0 }
			// 	], 1.5, 1)
			// )
			.parentModel("minecraft:item/handheld")
			.tag("minecraft:enchantable/durability")
			.tag("c:tools")
			.tag("nova_structures:enchantable/metal")
	)
})

StartupEvents.modifyCreativeTab("minecraft:tools_and_utilities", event => {
	event.add("bubble_cobble:trowel")
})

// TODO: Should be called on both clients and servers, ideally. Currently only on server.
/** @param {import("@package/dev/latvian/mods/kubejs/block").$BlockRightClickedKubeEvent} event */
global.use_trowel_on_block = function (event) {
	const player = event.player
	const level = event.level
	const hand = event.hand

	const chosen_item = /** @type {$ItemStack?} */ (global.get_chosen_item_for_trowel(player, event.item, event.block.getPos()))
	if (!chosen_item) {
		return false
	}

	const block_place_context = new $BlockPlaceContext(
		player, hand, chosen_item, new $BlockHitResult(
			event.hitResult.location, event.facing, event.block.getPos(), false
		)
	)
	const chosen_block = chosen_item.block // Item stack may be gone after use.
	const interaction_result = chosen_item.useOn(block_place_context)
	if (interaction_result == "fail") {
		player.playNotifySound("bubble_cobble:ui.buzz", "blocks", 0.5, 1.0)
		return false
	}
	if (interaction_result.consumesAction()) {
		event.item.hurtAndBreak(1, player, $Player.getSlotForHand(event.hand))
	}
	if (interaction_result.indicateItemUse()) {
		let sound_type = chosen_block.getSoundType(chosen_block.defaultBlockState(), level, event.block.getPos(), player)
		let placed_block_center = event.block.getPos().relative(event.facing).getCenter()
		play_sound_globally(level, placed_block_center, sound_type.placeSound, "blocks")
		player.swing(hand, true)
		if (event.item.getEnchantmentLevel("bubble_cobble:sequence") > 0) {
			let c = event.item.getCustomData()
			c.putInt("next_slot", Math.abs(c.getInt("next_slot") + 1) % 362880) // Reliable wrapping for 1 to 9 candidate item stacks.
			event.item.setCustomData(c)
		}
	}
	return true
}

/** @param {$Player} player @param {$ItemStack} trowel @param {import("@package/net/minecraft/core").$BlockPos} block_pos @returns {<$ItemStack>} */
global.get_chosen_item_for_trowel = function(player, trowel, block_pos) {
	const candidate_items = /** @type {$List<$ItemStack>} */ (global.get_eligible_items_for_trowel(player))
	if (candidate_items.isEmpty()) {
		return null
	}

	if (trowel.getEnchantmentLevel("bubble_cobble:pattern") > 0) {
		// Places blocks in a consistent sequence.
		let idx = Math.abs(block_pos.getX() + block_pos.getY() + block_pos.getZ()) % candidate_items.size()
		return candidate_items.get(idx)
	}

	if (trowel.getEnchantmentLevel("bubble_cobble:sequence") > 0) {
		// return candidate_items.get(trowel.getDamageValue() % candidate_items.size())
		let next_slot = trowel.getCustomData().getInt("next_slot")
		return candidate_items.get(next_slot % candidate_items.size())
	}

	return Utils.randomOf(player.getRandom(), candidate_items)
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
