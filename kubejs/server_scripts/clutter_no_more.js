// requires: clutternomore
// requires: lootjs
// Fix Clutter No More duplication exploit using Slabs.

/** @import {$SimpleLootEntry} from "com.almostreliable.lootjs.core.entry.SimpleLootEntry" */

LootJS.lootTables(event => {
	// This causes a sea of
	// [LootJS/]: Failed to transform entry java.lang.ClassCastException:
	// class dev.latvian.mods.rhino.Undefined cannot be cast to class com.almostreliable.lootjs.core.entry.LootEntry
	// Unless you return the entry itself in the callback. So watch out.
	event.modifyLootTables(/.*blocks.*_slab.*/).modifyEntry(/** @param {$SimpleLootEntry} entry */ entry => {
		entry.getFunctions().remove("minecraft:set_count")
		return entry
	})
})

ServerEvents.recipes(event => {
	event.forEachRecipe({type: "create:cutting", id: /.*slab$/}, recipe => {
		const json = JSON.parse(recipe.json)
		json.results[0].count = 1
		event.custom(json).id(recipe.getId())
	})
})

