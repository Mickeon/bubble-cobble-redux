
const SOULBOUND_ENCHANTMENT = ID.mc("bubble_cobble:soulbound")

// Keep certain items between deaths.
EntityEvents.death("minecraft:player", event => {
	const player = /** @type {$ServerPlayer} */ (event.player)
	const inventory = player.getInventory()
	const kept_slots = save_kept_inventory(player)
	for (let slot of kept_slots) {
		// Prevent the chosen items from also dropping on death and duplicating.
		inventory.setItem(slot, Item.empty)
	}
})

// Without this, the items would rightfully disappear from the dead player's hotbar.
EntityEvents.drops("minecraft:player", event => {
	restore_kept_inventory(event.player)
})

PlayerEvents.cloned(event => {
	if (event.keepData) {
		return // Not a death.
	}

	const player = /** @param {$ServerPlayer} player */ (event.player)
	const kept_slots = restore_kept_inventory(player)
	apply_damage_to_kept_inventory(player, kept_slots)
})

/** @param {$ServerPlayer} player */
function save_kept_inventory(player) {
	const inventory = player.getInventory()
	const keep = /** @type {Array<import("@package/net/minecraft/nbt").$CompoundTag>} */ ([])
	const kept_slots = []
	for (let i = 0; i < inventory.getSlots(); i += 1) {
		let item = inventory.getStackInSlot(i)
		if (is_kept_after_death(item)) {
			let nbt = item.toNBT()
			nbt.putInt("Slot", i)
			keep.push(nbt)

			kept_slots.push(i)
		}
	}
	player.getPersistentData().put("keep", keep)
	return kept_slots
}

/** @param {$ServerPlayer} player */
function restore_kept_inventory(player) {
	let kept_slots = /** @type {Array<number>} */ ([])
	for (let nbt of player.getPersistentData().get("keep")) {
		let slot = nbt.getInt("Slot")
		player.getInventory().add(slot, Item.of(NBT.fromTag(nbt)))

		kept_slots.push(slot)
	}
	return kept_slots
}

/** @param {$ServerPlayer} player @param {Array<number>} kept_slots  */
function apply_damage_to_kept_inventory(player, kept_slots) {
	for (let slot of kept_slots) {
		let item = player.inventory.getStackInSlot(slot)
		if (!player.isCreative() && item.isDamageableItem()) {
			let ratio = item.getEnchantmentLevel(SOULBOUND_ENCHANTMENT) == 0 ? 0.25 : 0.1
			item.setDamageValue(Math.min(
				item.getDamageValue() + item.getMaxDamage() * ratio,
				item.getMaxDamage() - 1
			))
		}
	}
	return kept_slots
}

// Debugging.
// PlayerEvents.inventoryOpened(event => {
// 	const player = /** @type {$ServerPlayer} */ (event.player)
// 	const inventory = player.getInventory()
// 	const kept = save_kept_inventory(player)
// 	console.log(player.getPersistentData().get("keep"))
// })

/*
let $PlayerDeathEvent = Java.loadClass("de.maxhenkel.gravestone.corelib.death.PlayerDeathEvent")
NativeEvents.onEvent("highest", $PlayerDeathEvent, event => {
try {
	let death = event.getDeath()
	let dead_player = event.player
	let death_main_inventory_items = death.getMainInventory()
	for (let i in death_main_inventory_items) {
		let item = death_main_inventory_items.get(i)
		if (is_kept_after_death(item)) {
			dead_player.getInventory().add(i, item)
			death_main_inventory_items.set(i, Item.empty)
		}
	}
	let death_offhand_items = death.getOffHandInventory()
	if (is_kept_after_death(death_offhand_items.getFirst())) {
		dead_player.setOffHandItem(death_offhand_items.getFirst())
		death_offhand_items.set(0, Item.empty)
	}
	let death_armor_inventory_items = death.getArmorInventory()
	for (let i in death_armor_inventory_items) {
		let item = death_armor_inventory_items.get(i)
		if (is_kept_after_death(item)) {
			if (i == 0) {
				dead_player.setFeetArmorItem(item)
			} else if (i == 1) {
				dead_player.setLegsArmorItem(item)
			} else if (i == 2) {
				dead_player.setChestArmorItem(item)
			} else if (i == 3) {
				dead_player.setHeadArmorItem(item)
			}
		}
	}
} catch (e) {
	console.error(e)
}
})

PlayerEvents.cloned(event => {
	if (event.keepData || !event.oldPlayer) {
		return // Not a death.
	}

	const player = event.player
	const inventory = event.player.getInventory()
	const old_inventory = event.oldPlayer.getInventory()
	for (let i = 0; i < old_inventory.getSlots(); i += 1) {
		let item = old_inventory.getStackInSlot(i)
		if (is_kept_after_death(item)) {
			// Soulbound does its own reduction.
			if (!player.isCreative() && item.isDamageableItem() && item.getEnchantmentLevel(SOULBOUND_ENCHANTMENT) == 0) {
				item.setDamageValue(Math.min(
					item.getDamageValue() + item.getMaxDamage() * 0.25,
					item.getMaxDamage() - 1
				))
			}
			inventory.add(i, item)
		}
	}
})
*/

/** @param {$ItemStack} item */
function is_kept_after_death(item) {
	if (item.isEmpty() || item.getEnchantmentLevel("minecraft:vanishing_curse") > 0) {
		return false
	}

	return item.hasTag("bubble_cobble:always_keep_on_death")
		// || item.getMaxDamage() > 0
		|| item.isEnchanted()
		// || item.getEnchantmentLevel(SOULBOUND_ENCHANTMENT) > 0
}

ServerEvents.tags("item", event => {
	event.add("bubble_cobble:always_keep_on_death",
		"#c:shulker_boxes",
		// "#c:tools",
		"#c:buckets/lava",
		"#c:buckets/water",
		"#create:pressurized_air_sources", // Backtanks.
		"#minecraft:beds",
		"#minecraft:boats",
		/minecart/,
		"bubble_cobble:blue_mascot_cat",
		"cobblemonraiddens:raid_pouch",
		"create:goggles",
		"create:linked_controller",
		"create:schematic",
		"create:schematic_and_quill",
		"create:super_glue",
		"gag:escape_rope",
		"gag:time_sand_pouch",
		"minecraft:bundle",
		"minecraft:compass",
		"minecraft:lead",
		"minecraft:recovery_compass",
		"minecraft:saddle",
		"minecraft:wind_charge",
		"supplementaries:key",
		"supplementaries:lunch_basket",
		"supplementaries:quiver",
	)
	// Roughly matching the prior enchantment's list, plus several more.
	event.add("bubble_cobble:enchantable/soulbound",
		"#bubble_cobble:pokenavs",
		"#c:armors",
		"#c:music_discs",
		"#c:tools",
		"#cobblemon:pokedex",
		"#cobblenav:pokefinder",
		"#minecraft:enchantable/durability",
		"#reliquified_artifacts:mimificable",
		/^sophisticatedbackpacks:.*backpack$/,
		"cobblenav:fishingnav_item",
		"create:wand_of_symmetry",
		"minecraft:goat_horn",
		"minecraft:totem_of_undying",
		"mowziesmobs:earthrend_gauntlet",
		"mowziesmobs:sand_rake",
		"mowziesmobs:sculptor_staff",
	)
})

ServerEvents.tags("enchantment", event => {
	event.add("bubble_cobble:exclusive_set/soulbound", "minecraft:vanishing_curse", "minecraft:binding_curse")
	event.add("minecraft:in_enchanting_table", "bubble_cobble:soulbound")
	event.add("minecraft:on_random_loot", "bubble_cobble:soulbound")
	event.add("minecraft:on_traded_equipment", "bubble_cobble:soulbound")
	event.add("minecraft:tradeable", "bubble_cobble:soulbound")
	event.add("minecraft:treasure", "bubble_cobble:soulbound")
})
