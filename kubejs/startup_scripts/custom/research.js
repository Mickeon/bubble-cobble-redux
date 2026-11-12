
StartupEvents.registry("block", event => {
	event.create("bubble_cobble:research_station")
			.property(BlockProperties.HORIZONTAL_FACING)
			.property(BlockProperties.OPEN)
			.property(BlockProperties.LIT)
			.soundType(SoundType.NETHERITE_BLOCK)
			.hardness(5)
			.placementState(callback => {
				callback.set(BlockProperties.HORIZONTAL_FACING, callback.getHorizontalDirection().getOpposite())
				callback.set(BlockProperties.OPEN, false)
				callback.set(BlockProperties.LIT, false)
			})
			.blockEntity(info => {
				info.inventory("inventory", ["up", "east", "north", "south", "west"], 1, 1, /** @param {$ItemStack} item */ (item) => item.hasTag("bubble_cobble:researchable"))
				// info.rightClickOpensInventory("inventory")
				info.ticking()
				info.serverTicking()
				info.tickFrequency(SEC)
			})
			.tagBlock([
				"minecraft:mineable/pickaxe",
			])
})

StartupEvents.registry("sound_event", event => {
	event.create("bubble_cobble:ui.research_complete")
})


const ResearchManager = global.ResearchManager = exports.ResearchManager = {
	/** @param {$Player} player @param {$ItemStack} item_stack  */
	can_donate: function(player, item_stack) {
		if (item_stack.isEmpty()) {
			return false
		}

		let id = this.get_entry_id_for_item(item_stack)
		return this.get_remaining_amount(player, id) > 0
	},

	/** @param {$Player} player @param {$ItemStack} item_stack @param {number} limit */
	donate: function(player, item_stack, limit) {
		if (!this.can_donate(player, item_stack)) {
			return false
		}

		limit = limit || 99
		let data = player.getPersistentData()
		if (!data.contains("donations_left")) {
			data.put("donations_left", {})
		}
		let id = ResearchManager.get_entry_id_for_item(item_stack)
		let donating_amount_left = ResearchManager.get_remaining_amount(player, id)
		let donating_amount = Math.min(item_stack.getCount(), donating_amount_left, limit)
		data.getCompound("donations_left").putInt(id, donating_amount_left - donating_amount)

		item_stack.shrink(donating_amount)
		return true
	},

	/** @param {$Player} player @param {string} id @returns {number} */
	get_remaining_amount: function(player, id) {
		return player.getPersistentData().getCompound("donations_left").contains(id)
				? player.getPersistentData().getCompound("donations_left").getInt(id)
				: this.get_required_amount(id)
	},
	/** @param {string} id @returns {number=} */
	get_required_amount: function(id) {
		return this.research_entries[id]?.required || 0
	},


	item_to_research_table: Utils.lazy(() => {
		let table = /** @type {Record<string, string>} */ ({})
		for (let id in ResearchManager.research_entries) {
			let entry = ResearchManager.research_entries[id]
			for (let unlock of entry.unlocks) {
				let item_id = unlock.item?.id || unlock.item
				table[item_id] = id
			}
		}

		return table
	}),
	/** @param {$ItemStack} item_stack @returns {string} */
	get_entry_id_for_item: function(item_stack) {
		return this.item_to_research_table.get()[item_stack.id] || ""
	},
	get_researchable_item_ids: function() {
		return Object.keys(this.item_to_research_table.get())
	},

	/**
	 * @typedef Unlock
	 * @property {import("@package/net/minecraft/world/item").$ItemStack_ | {components: import("@package/net/minecraft/core/component").$DataComponentMap_}} item
	 * @property {number=} price In Numismatics's Spurs.
	 *
	 * @typedef ResearchEntry
	 * @property {Array<Unlock>} unlocks
	 * @property {number} required
	 * @property {string=} name As it appears in the Field Guide.
	 * @property {string=} description As it appears in the Field Guide.
	 * @property {number=} default_count If not further specified by an unlock's item.
	 * @property {number=} default_price If not further specified by an unlock.
	 */
	/** @type {Record<string, ResearchEntry>} */
	research_entries: {
		"red_dye": {
			unlocks: [{item: {id: "minecraft:red_dye", count: 32}, price: 32}],
			required: 16,
		},
		"encased_fan":  {
			unlocks: [{item: {id: "create:encased_fan", count: 4}, price: 32}],
			required: 8,
		},
		"tuff":  {
			unlocks: [
				{item: "minecraft:tuff"},
				{item: "minecraft:tuff_bricks"},
				{item: "minecraft:polished_tuff"},
				{item: "minecraft:chiseled_tuff"},
				{item: "minecraft:chiseled_tuff_bricks"},
				{item: "create:cut_tuff", price: 96},
				{item: "create:polished_cut_tuff", price: 96},
				{item: "create:cut_tuff_bricks", price: 96},
				{item: "create:small_tuff_bricks", price: 96},
				{item: "create:layered_tuff", price: 96},
				{item: "create:tuff_pillar", price: 96},
				{item: "bits_n_bobs:tuff_tiles", price: 96}
			],
			default_count: 32,
			default_price: 64,
			required: 16,
		},
		"netherrack":  {
			unlocks: [
				{item: "minecraft:netherrack", price: 8},
				{item: "minecraft:nether_brick", price: 16},
				{item: "minecraft:nether_bricks", price: 64},
				{item: "minecraft:chiseled_nether_bricks", price: 64},
				{item: "minecraft:cracked_nether_bricks", price: 64},
				{item: "minecraft:red_nether_bricks", price: 64},
			],
			default_count: 32,
			default_price: 64,
			required: 128,
		},
		"clay_bricks":  {
			unlocks: [
				// {item: "minecraft:brick", price: 16},
				{item: "minecraft:bricks", price: 64},
			],
			default_count: 32,
			required: 16,
		},
		"bleachdew":  {
			unlocks: [
				{item: {id: "arts_and_crafts:bleachdew", count: 32}, price: 40},
			],
			required: 64,
		},
	},

	get_research_ids: function() {
		return Object.keys(this.research_entries)
	},

	stage_for: function(id) {
		return "researched." + id
	},

	field_for: function(id) {
		return "bubble_cobble:research/" + id
	},

	hack_field_for: function(id) {
		// HACK: Lets the Toast notification appear when this ID is used for unlocking/revoking.
		return "block:bubble_cobble/research/" + id
	},

	make_render_for_field_composites: function(entry) {
		if (entry.render) {
			return entry.render // In case it's personalized.
		}
		let block_ids = []
		for (let unlock of entry.unlocks) {
			let block = Item.of(unlock.item).block
			if (!block) {
				continue // Not a BlockItem, can't render this one as a block.
			}
			block_ids.push(block.id)
		}

		if (block_ids.length <= 1) {
			return // Render for a single block is way too zoomed in. With no blocks it's useless.
		}

		// Reference:
		// "render": [
		// 	"0,0,0|minecraft:tuff",
		// 	"0,1,0|minecraft:tuff_bricks",
		// 	"0,2,0|minecraft:polished_tuff",
		// 	"-1,0,0|minecraft:chiseled_tuff",
		// 	"-1,1,0|minecraft:chiseled_tuff_bricks",
		// 	"-1,2,0|create:cut_tuff",
		// 	"-2,0,0|create:polished_cut_tuff",
		// 	"-2,1,0|create:cut_tuff_bricks",
		// 	"-2,2,0|create:small_tuff_bricks",
		// 	"-3,0,0|create:layered_tuff",
		// 	"-3,1,0|create:tuff_pillar",
		// 	"-3,2,0|bits_n_bobs:tuff_tiles"
		// ]

		let x = 0
		let y = 0
		let render = []
		for (let i in block_ids) {
			let id = block_ids[i]
			x = Math.ceil(i / -3)
			y = i % 3

			render.push(`${x.toFixed()},${y.toFixed()},0|${id}`)
		}
		return render
	},

	/** @param {$Player} player */
	open_research_shop: function(player) {
		player.server.runCommandSilent(`execute as ${player.uuid} run openshop @s research_rewarder`)
	},

	/** @param {$Player} player */
	reset_donations: function(player) {
		player.getPersistentData().remove("donations_left")
		this.update_donation_progress(player)
	},

	/** @param {$Player} player @param {$ItemStack=} specific_item @param {import("@package/net/minecraft/core").$BlockPos=} station_block_pos  */
	update_donation_progress: function(player, specific_item, station_block_pos) {
		let what_to_update = specific_item ? [this.get_entry_id_for_item(specific_item)] : this.get_research_ids()
		for (let id of what_to_update) {
			// let field_guide_id = "bubble_cobble:" + id
			let field_guide_id = this.hack_field_for(id)
			let stage = this.stage_for(id)
			if (this.get_remaining_amount(player, id) <= 0) {
				if (station_block_pos) {
					player.level.spawnFireworks(station_block_pos.center.x(), station_block_pos.center.y(), station_block_pos.center.z(), {
						flightDuration: 2,
						explosions: [
							{shape: "small_ball", colors: [Color.AQUA.getFireworkRGB()]}
						]}, 2
					)
				}
				FieldGuide.unlock(player, field_guide_id)
				player.stages.add(stage)
				player.playNotifySound("bubble_cobble:ui.research_complete", "records", 1.0, 1.0)
			} else {
				FieldGuide.revoke(player, field_guide_id)
				player.stages.remove(stage)
			}
		}
		player.sendData("bubble_cobble:update_donation_progress", player.getPersistentData().getCompound("donations_left"))
	},
}

// ClientEvents.menuScreenRegistry()
