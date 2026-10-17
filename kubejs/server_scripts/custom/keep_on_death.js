
ServerEvents.tags("item", event => {
	event.add("bubble_cobble:always_keep_on_death", "#c:tools")
})

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
		// Soulbound does its own reduction.
		if (!player.isCreative() && item.isDamageableItem() && item.getEnchantmentLevel(SOULBOUND_ENCHANTMENT) == 0) {
			item.setDamageValue(Math.min(
				item.getDamageValue() + item.getMaxDamage() * 0.25,
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

const SOULBOUND_ENCHANTMENT = ID.mc("soulbound:soulbound")
/** @param {$ItemStack} item */
function is_kept_after_death(item) {
	if (item.isEmpty()) {
		return false
	}

	return item.hasTag("bubble_cobble:always_keep_on_death")
		// || item.getMaxDamage() > 0
		|| item.isEnchanted()
		|| item.getEnchantmentLevel(SOULBOUND_ENCHANTMENT) > 0
}
