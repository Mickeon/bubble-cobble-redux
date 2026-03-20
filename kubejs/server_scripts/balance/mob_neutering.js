// requires: pehkui

/** @type {typeof import("virtuoel.pehkui.api.ScaleTypes").$ScaleTypes } */
let $ScaleTypes  = Java.loadClass("virtuoel.pehkui.api.ScaleTypes")
// https://github.com/Virtuoel/Pehkui/blob/neoforge/1.21/src/main/java/virtuoel/pehkui/api/ScaleEasings.java
/** @type {typeof import("virtuoel.pehkui.api.ScaleEasings").$ScaleEasings } */
let $ScaleEasings  = Java.loadClass("virtuoel.pehkui.api.ScaleEasings")

// Creepers explode without destroying blocks. Sometimes they explode in confetti, too!
LevelEvents.beforeExplosion(event => {
	const { exploder } = event
	if (!exploder) {
		return
	}
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
	const { exploder } = event
	if (!exploder) {
		return
	}
	if (exploder.type != "minecraft:creeper" && exploder.type != "undergroundworlds:icy_creeper") {
		return
	}
	event.getAffectedEntities().forEach(entity => {
		if (exploder.type != "minecraft:creeper" && exploder.type != "undergroundworlds:icy_creeper") {
			return
		}
		entity.mergeNbt({Fuse: 10, ignited: true})
	})
})


// Teleport players hit by the Warden to their spawn point.
/** @type {typeof import("net.minecraft.world.level.portal.DimensionTransition").$DimensionTransition } */
let $DimensionTransition  = Java.loadClass("net.minecraft.world.level.portal.DimensionTransition")
EntityEvents.beforeHurt("minecraft:player", event => {
	if (event.source.getActual()?.type == "minecraft:warden") {
		const player = /** @type {$ServerPlayer} */ (event.player)
		const spawn_angle = event.level.sharedSpawnAngle

		const dimension_transition = player.findRespawnPositionAndUseSpawnBlock(false, $DimensionTransition.DO_NOTHING)
		const spawn_pos = dimension_transition.pos()
		player.playNotifySound("minecraft:entity.enderman.teleport", "players", 1.0, 1.0)
		player.teleportTo(dimension_transition.newLevel().dimension, spawn_pos.x(), spawn_pos.y(), spawn_pos.z(), spawn_angle, player.pitch)
		player.playNotifySound("minecraft:enchant.thorns.hit", "players", 0.5, 1.0)
		player.addEffect(MobEffectUtil.of("minecraft:darkness", 5 * SEC, 200))
		player.giveExperienceLevels(-5)
		if (!player.isAdvancementDone("kubejs:bad_dream")) {
			player.unlockAdvancement("kubejs:bad_dream")
		}

		/** @type {import("net.minecraft.world.entity.monster.warden.Warden").$Warden$$Type} */
		const warden = event.source.getActual()
		warden.clearAnger(player)
		event.cancel()
		return
	}
})

// Make ghasts less dangerous.
/** @type {typeof import("net.neoforged.neoforge.event.entity.ProjectileImpactEvent").$ProjectileImpactEvent } */
let $ProjectileImpactEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.ProjectileImpactEvent")
NativeEvents.onEvent($ProjectileImpactEvent, event => {
	if (event.projectile.type != "minecraft:fireball" || event.projectile.owner?.type != "minecraft:ghast") {
		return
	}
	/** @type {import("net.minecraft.world.entity.projectile.Fireball").$Fireball$$Type} */
	const fireball = event.projectile

	if (event.rayTraceResult.type == "entity") {
		let first_collided_player = /** @type {$Player} */ (fireball.level.getEntitiesWithin(AABB.ofBlock(event.rayTraceResult.location)).filterPlayers().first)
		if (first_collided_player) {
			first_collided_player.attack(new DamageSource("minecraft:fireball", fireball, fireball.owner), 4)
			first_collided_player.setRemainingFireTicks(SEC * 3)
			fireball.playSound("cobblemon:item.berry.eat.full", 1.0, 1.0)
			first_collided_player.give("minecraft:fire_charge")
			if (Math.random() < 0.25) {
				fireball.playSound("kubejs:advancement.mint_chewed", 1.0, 1.0)
			}
		}

	} else {
		fireball.playsound("create:chiff player", 1.0, 0.9 + Math.random() * 0.2)
		fireball.block.explode({
			source: fireball,
			causesFire: true,
			mode: "none",
			strength: 1,
			damageSource: new DamageSource("minecraft:fireball", fireball, fireball.owner)
		})
		fireball.level.spawnParticles("amendments:fireball_explosion", false,
			fireball.x, fireball.y, fireball.z,
			1, 1, 1, 10, 1
		)
	}

	fireball.discard()
	event.canceled = true
})

const ENDERMAN_CRACKING_INTERVAL = 15 * SEC

// Endermen suffer from Osteoporosis when trying to pick up blocks.
/** @type {typeof import("net.neoforged.neoforge.event.entity.EntityMobGriefingEvent").$EntityMobGriefingEvent } */
let $EntityMobGriefingEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.EntityMobGriefingEvent")
NativeEvents.onEvent($EntityMobGriefingEvent, event => {
	if (event.entity.type != "minecraft:enderman") {
		return
	}

	event.setCanGrief(false)

	/** @type {import("net.minecraft.world.entity.monster.EnderMan").$EnderMan$$Type} */
	const enderman = event.entity

	// Endermen check for this basically every tick. The paralysis isn't just for fun.
	if (!enderman.isAngry() && enderman.tickCount % (ENDERMAN_CRACKING_INTERVAL) < 5) {
		// Long-winded way to check if the Enderman can truly pick up anything around him (such as Dirt).
		if (!enderman.level.getBlockStates(AABB.ofBlock(enderman.getBlock().getPos()).inflate(0.5)).anyMatch(block_state => block_state.hasTag("minecraft:enderman_holdable"))) {
			return
		}

		// Crack bones only with players around.
		if (!enderman.level.hasNearbyAlivePlayer(enderman.x, enderman.y, enderman.z, 16)) {
			return
		}

		enderman.addEffect(MobEffectUtil.of("relics:paralysis", 2 * SEC))
		enderman.addEffect(MobEffectUtil.of("minecraft:weakness", 4 * SEC, 3))
		enderman.setAttributeBaseValue("minecraft:generic.max_health",
			Math.max(enderman.getAttributeBaseValue("minecraft:generic.max_health") - 1, 8)
		)
		enderman.playSound("kubejs:entity.enderman.bones_cracking", 1.0, 1.0)
		enderman.carriedBlock = "minecraft:cave_air"

		let height_scale_data = enderman.pehkui_getScaleData($ScaleTypes.MODEL_HEIGHT)
		height_scale_data.setEasing($ScaleEasings.ELASTIC_OUT)
		height_scale_data.setTargetScale(0.75)
		height_scale_data.setScaleTickDelay(2 * SEC)

		enderman.server.scheduleInTicks(5 * SEC, () => {
			if (!enderman || enderman.isRemoved()) {
				return
			}
			enderman.carriedBlock = "minecraft:air"
			height_scale_data.setTargetScale(1.0)
			height_scale_data.setScaleTickDelay(1 * SEC)
		})
	}
})