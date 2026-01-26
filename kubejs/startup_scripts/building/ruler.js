
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
