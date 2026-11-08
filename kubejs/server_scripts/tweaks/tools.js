// requires: yo_hooks
// requires: constructionstick
// requires: gag

ServerEvents.recipes(event => {
	// New recipe for Gadgets Against Grind's Escape Rope.
	event.remove({ id: "gag:escape_rope" })
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

	// Escape Rope is single-use here, no need for Mending and Unbreaking.
	event.remove("minecraft:enchantable/durability", "gag:escape_rope")
})

let $AnvilUpdateEvent = Java.loadClass("net.neoforged.neoforge.event.AnvilUpdateEvent")
NativeEvents.onEvent($AnvilUpdateEvent, event => {
	const { left, right } = event

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

// The Escape Rope has been single-use via datapack stuff. Advancement and mcfunction combo.

// This event do not trigger for advancements that are not displayed.
// The NeoForge docs say nothing on the matter, which leads me to believe some mod is doing this.
// PlayerEvents.advancement(event => {
// 	console.log("MEOW", event.player, event.advancement.id)
// })
// PlayerEvents.advancement("bubble_cobble:custom/escape_with_escape_rope", event => {
// 	const player = /** @type {$ServerPlayer} */ (event.player)
// 	player.revokeAdvancement("bubble_cobble:custom/escape_with_escape_rope")
// 	const item_stack = player.getItemInHand("main_hand")
// 	if (item_stack.id == "gag:escape_rope") {
// 		item_stack.hurtAndBreak(item_stack.getMaxDamage(), player, "mainhand")
// 	}
// })

// Desperate measure, although checking for every item finishing being used is quite daunting to me.
// let $LivingEntityUseItemEvent$Finish = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Finish");
// NativeEvents.onEvent($LivingEntityUseItemEvent$Finish, event => {
// 	if (!event.entity.isPlayer() || event.item.id != "gag:escape_rope") {
// 		return
// 	}
// 	// console.log("Hi")
// 	// if (event.item.isDamaged()) {
// 	// 	event.entity.tell("Escape rope finished!")
// 	// }
// 	const item_before = event.getItem()
// 	const item_after = event.getResultStack()
// 	const drained = !item_after.isEmpty() && item_after.getDamageValue() > item_before.getDamageValue()
// 	if (!drained) {
// 		return
// 	}
// 	item_after.hurtAndBreak(item_after.getMaxDamage(), event.entity, event.hand == "main_hand" ? "mainhand" : "offhand")
// 	// event.setResultStack(Item.empty)
// })
