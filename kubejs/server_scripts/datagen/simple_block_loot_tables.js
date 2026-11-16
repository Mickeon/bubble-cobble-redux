// requires: probejs
// requires: lootjs
// requires: emi_loot

// By "simple blocks" we should include any block that:
// - Drops only one item.
// - Drops the exact item representation of itself.
// - Does not require any specific tool or enchantment.
global.datagen.functions.simple_block_loot_tables = function() {
	let $MutableLootTable = Java.loadClass("com.almostreliable.lootjs.loot.table.MutableLootTable")

	const RELOADABLE_REGISTRIES = Client.singleplayerServer.reloadableRegistries()
	const PATH = "kubejs/data/bubble_cobble/emi_loot_data/no_simple_block_tables.json"
	const SURVIVES_EXPLOSION_CONDITION_TYPE = LootCondition.survivesExplosion().getType()

	/** @param {import("@package/com/almostreliable/lootjs/loot").$LootConditionList} conditions  */
	function has_any_complex_condition(conditions) {
		for (let condition of conditions) {
			let condition_type = condition.getType()
			if (condition_type == SURVIVES_EXPLOSION_CONDITION_TYPE) {
				continue
			}
			// if (condition_type == "minecraft:match_tool") {
			// 	continue
			// }
			return true
		}
		return false
	}

	const result = {
		__comment: "Generated data. Do not edit manually.",
		exclusions: Utils.newList()
	}

	let loot_table_ids = RELOADABLE_REGISTRIES.getKeys("minecraft:loot_table")
	loot_table_ids.forEach(id => {
		let table = new $MutableLootTable(RELOADABLE_REGISTRIES.getLootTable(id))

		if (table.getLootType() != LootType.BLOCK) {
			return
		}
		if (/_(slab|stairs|wall)$/.test(table.location.path)) {
			return
		}

		if (table.getPools().size() != 1) {
			return
		}
		const pool = table.firstPool()
		if (pool.getEntries().size() != 1) {
			return
		}
		if (pool.getConditions().size() > 0) {
			// console.log(`Checking pool conditions for ${table.location}`)
			if (has_any_complex_condition(pool.getConditions())) {
				// console.log(`Complex condition found!`)
				return
			}
		}

		const entry = pool.getEntries().get(0)
		// if (entry.isComposite()) {
		// 	return
		// 	// let composite_entry = /** @type {import("@package/com/almostreliable/lootjs/core/entry").$CompositeLootEntry} */ (entry)
		// 	// composite_entry.getEntries()
		// }
		// if (entry.getConditions().size() > 0) {
		// 	return
		// }
		if (!entry.isItem()) {
			return
		}
		const item_entry = /** @type {import("@package/com/almostreliable/lootjs/core/entry").$ItemLootEntry} */ (entry)
		// The Block's ID must be the same as the Item id that comes out.
		if (item_entry.getItem().mod != table.location.namespace || item_entry.getItem().idLocation.path != table.location.path.replace("blocks/", "") ) {
			return
		}
		// Just to be on the extra-safe side.
		if (item_entry.getFunctions().size() > 0) {
			return
		}

		// table.print()
		result.exclusions.add(table.location.toString())
	})

	result.exclusions = result.exclusions.stream().sorted().toList() // Stupid inefficient but gets around Rhino ambiguity.

	JsonIO.write(PATH, result)
	// console.log(JSON.stringify(result, null, "\t"))

	console.log(`There are ${result.exclusions.size()} simple block loot tables`)
}
