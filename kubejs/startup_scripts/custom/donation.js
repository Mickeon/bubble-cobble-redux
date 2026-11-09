
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


const DonationManager = global.DonationManager = exports.DonationManager = {
	/** @param {$Player} player @param {$ItemStack} item_stack  */
	can_donate: function(player, item_stack) {
		if (item_stack.isEmpty()) {
			return false
		}

		let id = this.get_entry_id_for_item(item_stack)
		return this.get_remaining_amount_to_donate(player, id) > 0
	},

	/** @param {$Player} player @param {string} id @returns {number} */
	get_remaining_amount_to_donate: function(player, id) {
		return player.getPersistentData().getCompound("donations_left").contains(id)
				? player.getPersistentData().getCompound("donations_left").getInt(id)
				: this.get_donation_requirement(id)
	},
	/** @param {string} id @returns {number=} */
	get_donation_requirement: function(id) {
		return this.donation_entries[id]?.quantity || 0
	},


	item_to_donation_table: Utils.lazy(() => {
		let table = /** @type {Record<string, string>} */ ({})
		for (let id in DonationManager.donation_entries) {
			let entry = DonationManager.donation_entries[id]
			for (let unlock of entry.unlocks) {
				let item_id = unlock.item?.id || unlock.item
				table[item_id] = id
			}
		}

		return table
	}),
	/** @param {$ItemStack} item_stack @returns {string} */
	get_entry_id_for_item: function(item_stack) {
		return this.item_to_donation_table.get()[item_stack.id] || ""
	},
	get_donatable_item_ids: function() {
		return Object.keys(this.item_to_donation_table.get())
	},

	donation_entries: {
		"red_dye": {
			unlocks: [{item: {id: "minecraft:red_dye", count: 32}, price: 32}],
			quantity: 16,
		},
		"encased_fan":  {
			unlocks: [{item: {id: "create:encased_fan", count: 4}, price: 32}],
			quantity: 8,
		},
		"tuff":  {
			unlocks: [
				{item: "minecraft:tuff", price: 64},
				{item: "minecraft:tuff_bricks", price: 64},
				{item: "minecraft:polished_tuff", price: 64},
				{item: "minecraft:chiseled_tuff", price: 64},
				{item: "minecraft:chiseled_tuff_bricks", price: 64},
				{item: "create:cut_tuff", price: 96},
				{item: "create:polished_cut_tuff", price: 96},
				{item: "create:cut_tuff_bricks", price: 96},
				{item: "create:small_tuff_bricks", price: 96},
				{item: "create:layered_tuff", price: 96},
				{item: "create:tuff_pillar", price: 96},
				{item: "bits_n_bobs:tuff_tiles", price: 96}
			],
			// price: 64,
			quantity: 16,
		},
	},

	get_donation_ids: function() {
		return Object.keys(this.donation_entries)
	},
}

// global.donation_entries = exports.donation_entries = donation_entries
// ClientEvents.menuScreenRegistry()
