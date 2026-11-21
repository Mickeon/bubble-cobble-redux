/**
 * @import {$KubeJSMenu, $InventoryKJSSlot} from "@package/dev/latvian/mods/kubejs/gui"
 * @import {$KubeBlockEntity, $InventoryAttachment$Wrapped} from "@package/dev/latvian/mods/kubejs/block/entity"
 */

StartupEvents.registry("block", event => {
	event.create("bubble_cobble:research_station")
			.property(BlockProperties.HORIZONTAL_FACING)
			.property(BlockProperties.OPEN)
			.property(BlockProperties.LIT)
			.soundType(SoundType.NETHERITE_BLOCK)
			.hardness(5)
			.defaultState(callback => {
				callback.set(BlockProperties.OPEN, false)
				callback.set(BlockProperties.LIT, false)
			})
			.placementState(callback => {
				callback.set(BlockProperties.HORIZONTAL_FACING, callback.getHorizontalDirection().getOpposite())
			})
			.blockEntity(info => {
				info.inventory("inventory", ["up", "east", "north", "south", "west"], 1, 1, /** @param {$ItemStack} item */ (item) => item.hasTag("bubble_cobble:researchable"))
				// info.rightClickOpensInventory("inventory")
				info.ticking()
				info.serverTicking()
				info.tickFrequency(SEC)
			})
			.rightClick(callback => global.research_station_on_right_click(callback))
			.tagBlock([
				"minecraft:mineable/pickaxe",
			])
			.item(item => {
				item.unstackable()
				item.fireResistant()
				item.tag([
					"supplementaries:overencumbering"
				])
			})
})

StartupEvents.registry("sound_event", event => {
	event.create("bubble_cobble:block.research_station.open")
	event.create("bubble_cobble:block.research_station.close")
	event.create("bubble_cobble:ui.research_complete")
})

/** @param {import("@package/dev/latvian/mods/kubejs/block").$BlockRightClickedKubeEvent} */
global.research_station_on_right_click = function(event) {
	let player = event.player

	if (player.isShiftKeyDown()) {
		let result = event.item.useOn(new $UseOnContext(player, event.hand, event.hitResult))
		if (result.indicateItemUse()) {
			return
		}
		ResearchManager.open_research_shop(player)
		return
	}
	ResearchManager.Station.open(player, event.block.entity)
}

const ResearchManager = global.ResearchManager = exports.ResearchManager = {
	Station: {
		// There's no other way, I need to know which players are interacting with what station.
		/** @type {import("@package/java/util").$Map<$Player, $KubeBlockEntity>} */
		player_to_station_table: Utils.newMap(),

		/** @param {$Player} @returns {$KubeBlockEntity?} */
		get_accessed_by: function(player) {
			let station = this.player_to_station_table.get(player)
			if (!station || station.isRemoved()) {
				console.warn(`Attempted to access non-existent Research Station at ${station?.blockPos} for ${player.username}`)
				return null
			}
			return station
		},

		/** @param {$Player} player @param {$KubeBlockEntity} station */
		open: function(player, station) {
			let inventory = /** @type {$InventoryAttachment$Wrapped} */ (station.attachments.get("inventory"))
			player.openInventoryGUI(inventory, station.block.block.name)
			let menu = /** @type {$KubeJSMenu} */ (player.containerMenu)

			if (!this.player_to_station_table.containsValue(station)) {
				// First player accessing the station.
				station.block.setBlockState(Block.withProperties(station.getBlockState(), {open: true}))
				play_sound_globally(station.level, station.blockPos.center, "bubble_cobble:block.research_station.open", "blocks", 0.5)
			}
			this.player_to_station_table.putIfAbsent(player, station)

			player.server.scheduleRepeatingInTicks(1, callback => {
				if (!player || !this.player_to_station_table.containsKey(player)) {
					callback.clear()
					return
				}

				if (player.isRemoved()
				|| station.isRemoved()
				|| player.containerMenu != menu
				|| player.distanceToBlock(station.blockPos) > player.blockInteractionRange() * 1.5
				) {
					this.close(player, station, menu)
					callback.clear()
					return
				}
			})
		},

		/** @param {$Player} player @param {$KubeBlockEntity} station @param {$KubeJSMenu} menu */
		close: function(player, station, menu) {
			this.player_to_station_table.remove(player)

			if (player.containerMenu == menu) {
				player.closeMenu()
			}

			if (!this.player_to_station_table.containsValue(station) && !station.isRemoved()) {
				// No one else is accessing the station.
				station.block.setBlockState(Block.withProperties(station.getBlockState(), {open: false}))
				play_sound_globally(station.level, station.blockPos.center, "bubble_cobble:block.research_station.close", "blocks", 0.5)
			}
		},
	},

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
		// "tuff": {
		// 	unlocks: [
		// 		{item: "minecraft:tuff", price: 64},
		// 		{item: "minecraft:tuff_bricks", price: 64},
		// 		{item: "minecraft:polished_tuff", price: 64},
		// 		{item: "minecraft:chiseled_tuff", price: 64},
		// 		{item: "minecraft:chiseled_tuff_bricks", price: 64},
		// 		{item: "create:cut_tuff"},
		// 		{item: "create:polished_cut_tuff"},
		// 		{item: "create:cut_tuff_bricks"},
		// 		{item: "create:small_tuff_bricks"},
		// 		{item: "create:layered_tuff"},
		// 		{item: "create:tuff_pillar"},
		// 		{item: "bits_n_bobs:tuff_tiles"}
		// 	],
		// 	default_count: 32,
		// 	default_price: 72,
		// 	required: 16,
		// 	description: "You gotta say it like you're chewing on a big, scrumptious apple.",
		// },
		"veridium": {
			unlocks: [
				{item: "create:veridium", price: 64},
				{item: "create:veridium_pillar"},
				{item: "create:cut_veridium"},
				{item: "create:cut_veridium_bricks"},
				{item: "create:small_veridium_bricks"},
				{item: "create:layered_veridium"},
				{item: "create:polished_cut_veridium"},
				{item: "bits_n_bobs:veridium_tiles"},
			],
			default_count: 32,
			default_price: 72,
			required: 32,
			description: "I've seen a random wiki page claiming that Veridium is \"likely named after the Spanish word \"verde\"\". No. Etymology, my baby. It's from the Latin word \"viridis\"",
		},
		"asurine": {
			unlocks: [
				{item: "create:asurine", price: 64},
				{item: "create:asurine_pillar"},
				{item: "create:cut_asurine"},
				{item: "create:cut_asurine_bricks"},
				{item: "create:small_asurine_bricks"},
				{item: "create:layered_asurine"},
				{item: "create:polished_cut_asurine"},
				{item: "bits_n_bobs:asurine_tiles"},
			],
			default_count: 32,
			default_price: 72,
			required: 32,
		},
		"ochrum": {
			unlocks: [
				{item: "create:ochrum", price: 64},
				{item: "create:ochrum_pillar"},
				{item: "create:cut_ochrum"},
				{item: "create:cut_ochrum_bricks"},
				{item: "create:small_ochrum_bricks"},
				{item: "create:layered_ochrum"},
				{item: "create:polished_cut_ochrum"},
				{item: "bits_n_bobs:ochrum_tiles"},
			],
			default_count: 32,
			default_price: 72,
			required: 32,
		},
		"crimsite": {
			unlocks: [
				{item: "create:crimsite", price: 64},
				{item: "create:crimsite_pillar"},
				{item: "create:cut_crimsite"},
				{item: "create:cut_crimsite_bricks"},
				{item: "create:small_crimsite_bricks"},
				{item: "create:layered_crimsite"},
				{item: "create:polished_cut_crimsite"},
				{item: "bits_n_bobs:crimsite_tiles"},
			],
			default_count: 32,
			default_price: 72,
			required: 32,
		},
		"limestone": {
			unlocks: [
				{item: "create:limestone", price: 64},
				{item: "create:limestone_pillar"},
				{item: "create:cut_limestone"},
				{item: "create:cut_limestone_bricks"},
				{item: "create:small_limestone_bricks"},
				{item: "create:layered_limestone"},
				{item: "create:polished_cut_limestone"},
				{item: "bits_n_bobs:limestone_tiles"},
			],
			default_count: 32,
			default_price: 72,
			required: 32,
			description: "\"Candle?\"\n\"hi\"\n\"Completely unrelated, I discovered that in the modpack there's like... 3 Limestones\"\n\"that sucks. get rid of them.\"\n\n\"Ah-AH-EEH. EHM-!? 😖💥\""
		},
		"scoria": {
			unlocks: [
				{item: "create:scoria", price: 64},
				{item: "create:scoria_pillar"},
				{item: "create:cut_scoria"},
				{item: "create:cut_scoria_bricks"},
				{item: "create:small_scoria_bricks"},
				{item: "create:layered_scoria"},
				{item: "create:polished_cut_scoria"},
				{item: "bits_n_bobs:scoria_tiles"},
			],
			default_count: 32,
			default_price: 72,
			required: 32,
		},
		"scorchia": {
			unlocks: [
				{item: "create:scorchia", price: 64},
				{item: "create:scorchia_pillar"},
				{item: "create:cut_scorchia"},
				{item: "create:cut_scorchia_bricks"},
				{item: "create:small_scorchia_bricks"},
				{item: "create:layered_scorchia"},
				{item: "create:polished_cut_scorchia"},
				{item: "bits_n_bobs:scorchia_tiles"},
			],
			default_count: 32,
			default_price: 72,
			required: 32,
		},
		"clay_bricks": {
			unlocks: [
				{item: "minecraft:bricks"},
				{item: "createdeco:short_red_bricks"},
				{item: "createdeco:tiled_red_bricks"},
				{item: "createdeco:long_red_bricks"},
				{item: "createdeco:corner_red_bricks"},
				{item: "createdeco:cracked_red_bricks"},
				{item: "createdeco:mossy_red_bricks"},
			],
			default_count: 32,
			default_price: 64,
			required: 16,
			description: "I know it makes sense, but why does it take 4 Bricks for... 1 Bricks? You know what I am saying? This roof is gonna take so long, damn it!",
			name: "Clay Bricks",
		},
		"verdant_bricks": {
			unlocks: [
				{item: "createdeco:verdant_bricks"},
				{item: "createdeco:short_verdant_bricks"},
				{item: "createdeco:tiled_verdant_bricks"},
				{item: "createdeco:long_verdant_bricks"},
				{item: "createdeco:corner_verdant_bricks"},
				{item: "createdeco:cracked_verdant_bricks"},
				{item: "createdeco:mossy_verdant_bricks"},
			],
			default_count: 32,
			default_price: 80,
			required: 16,
			description: "I've seen a random wiki page claiming that Veridium is \"likely named after the Spanish word \"verde\"\". No. Etymology, my baby. It's from the Latin word \"viridis\"",
		},
		"scarlet_bricks": {
			unlocks: [
				{item: "createdeco:scarlet_bricks"},
				{item: "createdeco:short_scarlet_bricks"},
				{item: "createdeco:tiled_scarlet_bricks"},
				{item: "createdeco:long_scarlet_bricks"},
				{item: "createdeco:corner_scarlet_bricks"},
				{item: "createdeco:cracked_scarlet_bricks"},
				{item: "createdeco:mossy_scarlet_bricks"},
			],
			default_count: 32,
			default_price: 80,
			required: 16,
			description: "Make from Crimsite, but they're really not *that* \"Crimson\". A bit unusual, really. In fact, they resemble the saturated clay Bricks from all the way back in Classic.",
		},
		"blue_bricks": {
			unlocks: [
				{item: "createdeco:blue_bricks"},
				{item: "createdeco:short_blue_bricks"},
				{item: "createdeco:tiled_blue_bricks"},
				{item: "createdeco:long_blue_bricks"},
				{item: "createdeco:corner_blue_bricks"},
				{item: "createdeco:cracked_blue_bricks"},
				{item: "createdeco:mossy_blue_bricks"},
			],
			default_count: 32,
			default_price: 80,
			required: 16,
			description: "When the people in charge of BLU's side can't be bothered and decide to copy RED's homework.",
		},
		"pearl_bricks": {
			unlocks: [
				{item: "createdeco:pearl_bricks"},
				{item: "createdeco:short_pearl_bricks"},
				{item: "createdeco:tiled_pearl_bricks"},
				{item: "createdeco:long_pearl_bricks"},
				{item: "createdeco:corner_pearl_bricks"},
				{item: "createdeco:cracked_pearl_bricks"},
				{item: "createdeco:mossy_pearl_bricks"},
			],
			default_count: 32,
			default_price: 80,
			required: 16,
			description: "So many white bricks it's enough to withstand at least 2 spicy peppers.",
		},
		// "netherrack": {
		// 	unlocks: [
		// 		{item: "minecraft:netherrack", price: 8},
		// 		{item: "minecraft:nether_brick", price: 16},
		// 		{item: "minecraft:nether_bricks", price: 64},
		// 		{item: "minecraft:chiseled_nether_bricks", price: 64},
		// 		{item: "minecraft:cracked_nether_bricks", price: 64},
		// 		{item: "minecraft:red_nether_bricks", price: 64},
		// 	],
		// 	default_count: 32,
		// 	default_price: 64,
		// 	required: 128,
		// 	description: "I spent 5 minutes researching red bean rock from Hell and all I got is this lousy shirt.",
		// },
		"white_dye": {
			unlocks: [{item: {id: "minecraft:white_dye", count: 32}, price: 32}],
			required: 32,
			description: "I cannot make up what it's saying here? Oh no, wait, it's on black ink. We're good.",
		},
		"gray_dye": {
			unlocks: [{item: {id: "minecraft:gray_dye", count: 32}, price: 32}],
			required: 32,
			description: "Ten times the dye wasn't strong enough.",
		},
		"red_dye": {
			unlocks: [{item: {id: "minecraft:red_dye", count: 32}, price: 32}],
			required: 32,
			description: "They should make a new color that's, like, not bad.",
		},
		"orange_dye": {
			unlocks: [{item: {id: "minecraft:orange_dye", count: 32}, price: 32}],
			required: 32,
			description: "The fruit came before.",
		},
		"green_dye": {
			unlocks: [{item: {id: "minecraft:green_dye", count: 32}, price: 32}],
			required: 32,
			description: "Sniffer? The Rift? What are you talking about? Come back to your senses, give me all of your Cactus Green and go punch some Sheep.",
		},
		"bleachdew": {
			unlocks: [{item: {id: "arts_and_crafts:bleachdew", count: 32}, price: 40}],
			required: 64,
			description: "Highly sought-after dye, popped from plants the ancients kept cramming in their mouths. Pppprobably why they all went exinct!",
		},
		"encased_fan": {
			unlocks: [{item: {id: "create:encased_fan", count: 4}, price: 64}],
			required: 4,
		},
		"mechanical_press": {
			unlocks: [{item: {id: "create:mechanical_press", count: 4}, price: 64}],
			required: 4,
		},
		"mechanical_mixer": {
			unlocks: [{item: {id: "create:mechanical_mixer", count: 4}, price: 64}],
			required: 4,
		},
		"windmill_bearing": {
			unlocks: [{item: {id: "create:windmill_bearing", count: 4}, price: 32}],
			required: 4,
			description: "Our project was: Holland! There we were reading: \"My Friend Hands, from Holland.\". And we made... windmills! And stuck blue strips of paper onto white strips of paper. They were... \"canals\". And we kept talking about \"tulips\" and \"cheese\". In the end I thought they... grew cheese, and ate tulips."
		},
		"blaze_cake": {
			unlocks: [{item: "create:blaze_cake", price: 64}],
			required: 16,
		},
		"table_cloth": {
			unlocks: [
				{item: "create:red_table_cloth"}, // TODO: Absolutely a way to parse a whole tag. create:dyed_table_cloths.
				{item: "create:andesite_table_cloth", price: 128},
				{item: "create:copper_table_cloth", price: 128},
				{item: "create:brass_table_cloth", price: 256},
			],
			default_count: 32,
			default_price: 64,
			required: 8,
			description: "Where does the Andesite go? Does it hold the whole thing in place?",
		},
		"flywheel": {
			unlocks: [{item: {id: "create:flywheel", count: 1}, price: 1024}],
			required: 1,
			description: "It's a giant, spinning wheel. Why did you research this? What else do you want to know?",
		},
		"industrial_iron": {
			unlocks: [
				{item: "create:industrial_iron_block"},
				{item: "createdeco:industrial_iron_sheet_metal", default_price: 96}
			],
			default_count: 32,
			default_price: 64,
			required: 32,
			description:  "It's... Iron? The way it's meant to be. Unlike Minecraft's own idealized standards, this one is meant to look pretty and that's it.",
		},
		"towel_block": {
			unlocks: [
				{item: "urban_decor:red_towel_block"}, // TODO: A way to parse a regex.
			],
			default_count: 32,
			default_price: 64,
			required: 32,
			description: "I am not sure how exactly you're capable of compressing flimsy sheets into relatively sturdy matter with your bare hands. I commend you.",
		},
		"porcelain": {
			unlocks: [
				{item: "urban_decor:porcelain_block"},
				{item: "urban_decor:porcelain_bricks"},
				{item: "urban_decor:porcelain_tiles"},
			],
			default_count: 32,
			default_price: 64,
			required: 16,
			description: "Ceramic, clay, same thing... No, not really. Not to be confused with Clay, either. This one is fine china.",
		},
		"dark_porcelain": {
			unlocks: [
				{item: "urban_decor:dark_porcelain_block"},
				{item: "urban_decor:dark_porcelain_bricks"},
				{item: "urban_decor:dark_porcelain_tiles"},
				{item: "urban_decor:checkered_porcelain_tiles"}, // Ideally should unlock when having both porcelain and dark_porcelain.
			],
			default_count: 32,
			default_price: 64,
			required: 16,
			description: "Ceramic, clay, same thing... No, not really. Not to be confused with Clay, either. This one is fine china.",
		},
		"cherry_porcelain": {
			unlocks: [
				{item: "urban_decor:cherry_wrapped_porcelain_block"},
				{item: "urban_decor:cherry_wrapped_porcelain_bricks"},
				{item: "urban_decor:cherry_wrapped_porcelain_tiles"},
			],
			default_count: 32,
			default_price: 96,
			required: 16,
			description: "No cherries were harmed in the making of this research. Mostly because I couldn't find any. Trust me, I uprooted all the sakura trees I could find, just to make sure",
		},
		"azure_porcelain": {
			unlocks: [
				{item: "urban_decor:azure_wrapped_porcelain_block"},
				{item: "urban_decor:azure_wrapped_porcelain_bricks"},
				{item: "urban_decor:azure_wrapped_porcelain_tiles"},
			],
			default_count: 32,
			default_price: 96,
			required: 16,
			description: "No cherries were harmed in the making of this research project. Mostly because there aren't any.",
		},
		"tatami": {
			unlocks: [
				{item: {id: "farmersdelight:tatami", count: 32}, price: 64},
				{item: {id: "farmersdelight:half_tatami_mat", count: 32}, price: 32},
				{item: {id: "farmersdelight:full_tatami_mat", count: 32}, price: 16},
			],
			required: 32,
			description: "Ah, they connect if you place them on the sides. That's neat.\nCan I get my straw back?",
			render: [
				"0,0,0|farmersdelight:tatami",
				"1,0,0|farmersdelight:half_tatami_mat",
				"0,0,-1|farmersdelight:full_tatami_mat|facing=east,part=foot",
				"1,0,-1|farmersdelight:full_tatami_mat|facing=east,part=head",
			]
		},
		"hearthy_tatami": {
			unlocks: [
				{item: {id: "cobblemon:tatami_block", count: 32}, price: 64},
				{item: {id: "cobblemon:tatami_mat", count: 32}, price: 22},
			],
			required: 32,
			description: "Sir, a second Tatami Mat has hit the modpack.\nThey loosely connect, too, if you spin them around.",
			render: [
				"0,0,0|cobblemon:tatami_block|facing=east",
				"1,0,0|cobblemon:tatami_block|facing=west",
				"0,0,-1|cobblemon:tatami_mat|facing=east",
				"1,0,-1|cobblemon:tatami_mat|facing=west",
			]
		}
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

	field_lang_for: function(id) {
		return "bubble_cobble.research/" + id
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

		let height = block_ids.length > 4 ? 3 : 2 // Try forming a square with few blocks.
		let x = 0
		let y = 0
		let render = []
		for (let i in block_ids) {
			let id = block_ids[i]
			x = Math.ceil(i / -height)
			y = i % height

			render.push(`${x.toFixed()},${y.toFixed()},0|${id}`)
		}
		return render
	},

	/** @param {$Player} player */
	open_research_shop: function(player) {
		player.server.runCommandSilent(`execute as ${player.uuid} run openshop @s research_rewarder`)
		play_sound_globally(player.level, player.position(), "create:stock_ticker_request", "blocks", 0.25, 1.8)
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
			let field_guide_id = this.field_for(id)
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
