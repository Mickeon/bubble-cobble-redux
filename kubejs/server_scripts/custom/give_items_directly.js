/** @import {$LivingEntity} from "@package/net/minecraft/world/entity" */

// Give items to other players directly!
ItemEvents.dropped(event => {
	const item = event.item
	const dropper = event.player
	const item_entity = event.itemEntity

	const result = dropper.rayTrace(dropper.entityInteractionRange() + 1)
	let target = result.entity

	/** @param {$LivingEntity} target */
	const can_receive_dropped_item = (target) => {
		return target && target != dropper && (target.isPlayer() || target.type == "minecraft:armor_stand") && target.isAlive()
	}

	if (!target) {
		// Let's try a more generous check.
		let range = dropper.entityInteractionRange()
		let starting_pos = dropper.eyePosition
		let ending_pos = result.hit
		for (let progress = 0.0; progress < range; progress += 1.0) {
			let box_extent = 1 + 0.1 * progress
			let box = AABB.ofSize(starting_pos.add(dropper.getForward().scale(progress)), box_extent, 1, box_extent)
			// event.level.sendParticles(dropper, `supplementaries:air_burst`, true,
			// 	box.getCenter().x(), box.getCenter().y(), box.getCenter().z(),
			// 	0, 0.0, 0.0, 0.0, 4.0
			// )
			let found_entities = event.level.getEntitiesWithin(box).filter(can_receive_dropped_item)
			if (!found_entities.isEmpty()) {
				target = found_entities.getFirst()
				break
			}
		}
	}
	if (can_receive_dropped_item(target)) {
		// Getting these now, as the item may be copied and cleared later.
		let item_count = item.count
		let item_display_name = item.displayName
		if (target.isPlayer()) {
			target.give(item.copyAndClear())
		} else {
			let armor_stand = /** @type {$LivingEntity} */ (target)
			if (armor_stand.mainHandItem.isEmpty()) {
				armor_stand.mainHandItem = item.copyAndClear()
			} else {
				item_entity.teleportTo(target.level.dimension, target.x, target.y, target.z, 0, 0)
				item_entity.pickUpDelay = 0
			}
		}
		// For some reason "remove" with "Owner" tag specifically does not work.
		// So we can't do this, as it'd be impossible to grab the item back up by other players.
		// item_entity.mergeNbt({Owner: target.nbt.get("UUID")})

		play_sound_at_entity(dropper, "minecraft:entity.glow_item_frame.remove_item", "players", 0.2, remap(item_count, 1, 64, 1.1, 0.5))
		dropper.statusMessage = Text.translateWithFallback("", "Gave %s to %s", [item_display_name, target.displayName]).gray()
		play_sound_at_entity(target, "minecraft:item.armor.equip_generic", "players")
		target.statusMessage = Text.translateWithFallback("", "Received %s from %s", [item_display_name, dropper.displayName]).gray()
	}
})
