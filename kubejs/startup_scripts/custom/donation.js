
StartupEvents.registry("block", event => {
	event.create("bubble_cobble:donation_station")
			// .copyPropertiesFrom(Blocks.FURNACE)
			.property(BlockProperties.HORIZONTAL_FACING)
			.property(BlockProperties.OPEN)
			.soundType(SoundType.NETHERITE_BLOCK)
			.hardness(5)
			.placementState(callback => {
				callback.set(BlockProperties.HORIZONTAL_FACING, callback.getHorizontalDirection().getOpposite())
			})
			.blockEntity(info => {
				info.inventory("inventory", ["up", "east", "north", "south", "west"], 1, 1)
				info.rightClickOpensInventory("inventory")
			})
			.tagBlock([
				"minecraft:mineable/pickaxe",
			])
})

/** @param {$Player} player @param {$ItemStack} item_stack  */
global.can_donate = exports.can_donate = function(player, item_stack) {
	if (item_stack.isEmpty()) {
		return false
	}

	if (!global.get_donation_requirement(item_stack)) {
		return false
	}

	return global.get_remaining_amount_to_donate(player, item_stack) > 0
}

/** @param {$Player} player @param {$ItemStack} item_stack @returns {number} */
global.get_remaining_amount_to_donate = exports.get_remaining_amount_to_donate = function(player, item_stack) {
	if (!global.get_donation_requirement(item_stack)) {
		// Cannot be donated. Prrrroobably fine.
		// console.errorf("Item %s cannot be donated! This shouldn't happen.", item_stack.id)
		return 0
	}

	return player.getPersistentData().getCompound("donations_left").contains(item_stack.id)
			? player.getPersistentData().getCompound("donations_left").getInt(item_stack.id)
			: global.get_donation_requirement(item_stack)
}

/** @param {$ItemStack} item_stack @returns {number=} */
global.get_donation_requirement = exports.get_donation_requirement = function(item_stack) {
	return ALL_THAT_CAN_BE_DONATED[item_stack.id]
}

global.get_donation_ids = exports.get_donation_ids = function() {
	return Object.keys(ALL_THAT_CAN_BE_DONATED)
}


const ALL_THAT_CAN_BE_DONATED = {
	"minecraft:red_dye": 16,
	"create:mechanical_press": 8,
	"create:mechanical_mixer": 8,
	"create:encased_fan": 8,
	"minecraft:tuff": 16
}
// global.ALL_THAT_CAN_BE_DONATED = exports.ALL_THAT_CAN_BE_DONATED = ALL_THAT_CAN_BE_DONATED
// ClientEvents.menuScreenRegistry()
