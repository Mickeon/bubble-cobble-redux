
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

	event.create("ruler")
			.unstackable()
			.tooltip(Text.of(`Right-click on a block to begin measuring`).gray())
			.component("minecraft:attribute_modifiers", new $ItemAttributeModifiers([
				modifier("minecraft:player.block_interaction_range", 2, "add_value", "kubejs:ruler", "hand"),
			], true))
			.burnTime(50)
			.parentModel("minecraft:item/handheld")
			.tag("c:tools")
})

StartupEvents.modifyCreativeTab("minecraft:tools_and_utilities", event => {
	event.add("kubejs:ruler")
})
