// requires: yo_hooks
// requires: constructionstick
// requires: gag

ServerEvents.recipes(event => {
	// New recipe for Gadgets Against Grind's Escape Rope.
	event.remove({id: "gag:escape_rope"})
	event.shapeless("gag:escape_rope", ["yo_hooks:iron_hook_head", Ingredient.of("#c:ropes").withCount(3)])
})

ServerEvents.tags("item", event => {
	event.add("c:tools", "#constructionstick:construction_sticks", "#yo_hooks:hooks")
	event.add("supplementaries:statue_tools", "#constructionstick:construction_sticks", "#yo_hooks:hooks")
	event.add("bubble_cobble:diamond_tools", "constructionstick:diamond_stick", "yo_hooks:diamond_grappling_hook")

	// Some items don't abide by the Mending Reworked balance. Let's have them to, albeit jankily.
	event.add("bubble_cobble:netherite_diamond_repairable", "constructionstick:netherite_stick")

	// Funny.
	event.add("supplementaries:causes_lightning_when_held", "constructionstick:copper_stick")

	// Make Construction sticks enchantable with Mending and Unbreaking.
	event.add("minecraft:enchantable/durability", "#constructionstick:construction_sticks")

	// Allow Netherite Grappling Hook to be repaired with Diamond and Netherite Scrap
	// This is part of the Mending Rework rebalance.
	event.add("yo_hooks:netherite_repairable", "minecraft:diamond", "minecraft:netherite_scrap")
})

let $AnvilUpdateEvent  = Java.loadClass("net.neoforged.neoforge.event.AnvilUpdateEvent")
NativeEvents.onEvent($AnvilUpdateEvent, event => {
	const { left, right } = event

	// Use Rope to repair Escape Rope.
	if (left.id == "gag:escape_rope" && right.hasTag("c:ropes")) {
		const repair_per_material = left.maxDamage * 0.5
		const repair_amount = Math.min(repair_per_material * right.count, left.maxDamage)
		const new_damage = Math.max(left.damageValue - repair_amount, 0)
		event.cost = 1
		event.materialCost = Math.ceil(repair_amount / repair_per_material)
		event.output = left.copy()
		event.output.damageValue = new_damage
		return
	}

	// Use Diamonds instead of Netherite Ingots to repair Netherite tools.
	if (left.hasTag("bubble_cobble:netherite_diamond_repairable") && right.id == "minecraft:netherite_ingot") {
		event.setCanceled(true)
	}

	if (left.hasTag("bubble_cobble:netherite_diamond_repairable") &&
		(right.id == "minecraft:diamond"
		|| right.id == "minecraft:netherite_scrap")
	) {
		if (left.damageValue <= 0) {
			event.setCanceled(true)
		}
		const output = left.copy()
		const repair_amount = Math.floor(output.maxDamage * 0.33)
		const new_damage = Math.max(output.damageValue - repair_amount, 0)
		output.damageValue = new_damage
		event.cost = 1
		event.materialCost = 1
		event.output = output
	}
})
