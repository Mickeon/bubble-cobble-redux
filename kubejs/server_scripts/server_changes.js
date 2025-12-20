// priority: 10
// requires:cobblemon
// requires:create

// The End check.
EntityEvents.spawned("minecraft:player", event => {
	const player = event.player
	const server = player.server
	if (player.level.dimension == "minecraft:the_end") {
		server.scheduleRepeatingInTicks(10, callback => {
			if (player.isRemoved() || player.level.dimension != "minecraft:the_end") {
				callback.clear()
				return
			}
			if (player.y <= -32) {
				player.level.runCommandSilent(`execute at ${player.username} in minecraft:overworld run tp ~ 400 ~`)
			}
		})
	}
})

// Creepers explode without destroying blocks. Sometimes they explode in confetti, too!
LevelEvents.beforeExplosion(event => {
	const { exploder } = event
	if ((exploder.type != "minecraft:creeper" && exploder.type != "undergroundworlds:icy_creeper") || exploder.tags.contains("kubejs.exploding_safely")) {
		return
	}
	exploder.addTag("kubejs.exploding_safely")

	const { x, y, z, level, size } = event;
	const eye_y = exploder.eyeY
	level.explode(x, y, z, {
		source: exploder,
		mode: "none",
		strength: size * 0.5,
		particles: false,
		// smallParticles: "minecraft:firework",
		// largeParticles: "minecraft:firework",
	}),
	exploder.playSound("minecraft:entity.firework_rocket.blast", 1, 0.75)

	event.server.scheduleInTicks(0.5, c => {
		level.runCommandSilent(`execute positioned ${x} ${eye_y} ${z} run stopsound @a[distance=0..64] * minecraft:entity.generic.explode`)
	})
	level.spawnParticles("minecraft:firework", false, x, eye_y, z, 0.1, 0.1, 0.1, 60, 0.25)

	// exploder.kill()
	// exploder.remove("discarded")
	event.cancel()
})
// Creeper chain reaction.
LevelEvents.afterExplosion(event => {
	if (event.exploder.type != "minecraft:creeper" && event.exploder.type != "undergroundworlds:icy_creeper") {
		return
	}
	event.getAffectedEntities().filter(["minecraft:creeper", "undergroundworlds:icy_creeper"]).forEach(entity => entity.mergeNbt({Fuse: 10, ignited: true}))
})

// PlayerEvents.chat(event => {
// 	let {player, message, server, component} = event
// 	server.tell([player.displayName, Text.darkGray(" » "), component])
// 	event.cancel()
// })

// Give items to other players directly!
ItemEvents.dropped(event => {
	const item = event.item
	const entity = event.entity
	const item_entity = event.itemEntity

	const result = entity.rayTrace()
	if (result.distance > entity.blockReach ?? 1) {
		return
	}
	const target = result.entity
	if (target && (target.isPlayer() || target.type == "minecraft:armor_stand")) {
		if (target.isPlayer()) {
			target.give(item)
			item_entity.remove(0)
		} else {
			item_entity.teleportTo(target.level.dimension, target.x, target.y, target.z, 0, 0)
			item_entity.pickUpDelay = 0
		}
		// For some reason "remove" with "Owner" tag specifically does not work.
		// So we can't do this, as it'd be impossible to grab the item back up by other players.
		// item_entity.mergeNbt({Owner: target.nbt.get("UUID")})

		entity.level.runCommandSilent(`playsound minecraft:entity.glow_item_frame.remove_item player @a ${entity.x} ${entity.y} ${entity.z} 0.2 ${remap(item.count, 1, 64, 1.1, 0.5)}`)
		entity.server.runCommandSilent(`title ${entity.username} actionbar ${
			Text.gray(["Gave ", item.displayName, " to ", target.displayName]).toJson()
		}`)
		target.level.runCommandSilent(`playsound minecraft:item.armor.equip_generic player @a ${target.x} ${target.y} ${target.z}`)
		target.server.runCommandSilent(`title ${target.username} actionbar ${
			Text.gray(["Received ", item.displayName, " from ", entity.displayName]).toJson()
		}`)
	}
})

// Nasty way to prevent mobs from spawning because it's nighttime.
// EntityEvents.spawned(event => {
// 	if (event.level.isOverworld()
// 	&& event.entity.isMonster()
// 	// && event.entity.nbt.get("neoforge:spawn_type") == "NATURAL"
// 	) {
// 		if (event.level.canSeeSky(event.entity.blockPosition())) {
// 			console.log(`Tried to spawn a ${event.entity.type} (${event.entity.nbt.get("neoforge:spawn_type")}) but nuh-uh`)
// 			event.entity.remove("unloaded_with_player")
// 			event.cancel()
// 			return
// 		}
// 	}
// })

// Nerf players carrying heavy storage considerably.
ServerEvents.tags("block", event => {
	event.add("bubble_cobble:no_fast_travel_when_carrying",
		/sophisticatedstorage:.*(chest|barrel)/,
		/lootr:/,
		"gravestone:gravestone"
	)
})

ServerEvents.tick(event => {
	event.server.mcPlayers.forEach(player => {
		if (!player.carryOnData.carrying) {
			return
		}

		if (player.carryOnData.block.hasTag("bubble_cobble:no_fast_travel_when_carrying")) {
			player.addEffect(MobEffectUtil.of("via_romana:travellers_fatigue", 20, 0, true, true))
			player.addEffect(MobEffectUtil.of("supplementaries:overencumbered", 20, 5, true, true))
			player.unRide()
			player.modifyAttribute("minecraft:generic.jump_strength", "bubble_cobble:carrying", -2, "add_multiplied_total")
			player.server.scheduleInTicks(1, callback => {
				if (!player.carryOnData.carrying) {
					player.removeAttribute("minecraft:generic.jump_strength", "bubble_cobble:carrying")
				}
			})
		}
	})
})

// As food takes less time to eat on average, add a cooldown to prevent misclicks.
const MINECRAFT_EAT_TIME_TICKS = 32
ItemEvents.foodEaten(event => {
	if (!event.player) {
		return
	}

	const player = event.player
	const stack = event.item
	const eat_time_ticks = stack.getFoodProperties(player).eatDurationTicks()
	// player.statusMessage = eat_time_ticks

	player.addItemCooldown(stack, MINECRAFT_EAT_TIME_TICKS - eat_time_ticks)
})

// Custom sound when opening HandCrafted shelves. TODO: Expand to include more containers.
PlayerEvents.chestOpened("minecraft:generic_9x3", event => {
	if (event.block && event.block.hasTag("handcrafted:shelves")) {
		// event.player.playNotifySound("relics:ability_locked", "players", 1, 1)
		event.player.playNotifySound("create:blaze_munch", "players", 0.25, 2.0)
	}
})

