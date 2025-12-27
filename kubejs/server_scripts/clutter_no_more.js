// requires: clutternomore
// requires: lootjs
// Fix Clutter No More duplication exploit using Slabs.

LootJS.lootTables(event => {
	/** @import {$SimpleLootEntry} from "com.almostreliable.lootjs.core.entry.SimpleLootEntry" */
	// event.getLootTable("minecraft:blocks/birch_slab").modifyEntry(/** @param {$SimpleLootEntry} entry */ entry => {
	// 	entry.getFunctions().remove("minecraft:set_count")
	// })
	event.modifyLootTables(/.*blocks.*_slab.*/).modifyEntry(/** @param {$SimpleLootEntry} entry */ entry => {
		entry.getFunctions().remove("minecraft:set_count")
	})
})

ServerEvents.recipes(event => {
	event.forEachRecipe({type: "create:cutting", id: /.*slab$/}, recipe => {
		const json = JSON.parse(recipe.json)
		json.results[0].count = 1
		event.custom(json).id(recipe.getId())
	})
})

