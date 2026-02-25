// requires: resource_world

/** @type {typeof import("java.lang.Long").$Long } */
let $Long  = Java.loadClass("java.lang.Long")
/** @type {typeof import("net.minecraft.world.damagesource.DamageType").$DamageType } */
let $DamageType  = Java.loadClass("net.minecraft.world.damagesource.DamageType")

/** @type {typeof import("net.neoforged.neoforge.event.entity.player.CanContinueSleepingEvent").$CanContinueSleepingEvent } */
let $CanContinueSleepingEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.player.CanContinueSleepingEvent")
/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerSetSpawnEvent").$PlayerSetSpawnEvent } */
let $PlayerSetSpawnEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerSetSpawnEvent")

/**
 * @import {$MinecraftServer} from "net.minecraft.server.MinecraftServer"
 */

const DreamDimension = {
	PATH: "dream_dimension",
	NAMESPACE: "resource_world",
	ID: "resource_world:dream_dimension",
	SLEEP_WAIT_TIME: 2 * SEC,
	EXPIRATION_WARNING_OFFSET: 10 * MIN,
	IDEAL_TO_PREPARE_AVERAGE_TICK_TIME_NANOS: 5000000,
	A_MIMIR_URL: "https://tenor.com/view/a-mimir-gif-26093646",
	A_MIMIR_MP4_URL: "https://media.tenor.com/8UWUBWR-ww0AAAPo/a-mimir-meme.mp4",
	DREAM_JOURNAL: Item.of("minecraft:written_book", {
		"minecraft:written_book_content": {
			title: `Dream Journal`,
			author: "Micky",
			pages: [
				`["",{"color":"dark_purple","text":"Dream Journal\n\n"},
				"If you're finding yourself here, you're either in bliss or completely wasted.\n\n\n\n\n",
				{"italic":true,"text":"","extra":[{"color":"dark_gray","text":"TL:DR: Find a "},
				{"color":"dark_red","text":"Bed"},{"color":"dark_gray","text":" or "},
				{"color":"dark_red","text":"Raid Den Crystal"},
				{"color":"dark_gray","text":" to get out safely. You are timed."}]}]`
			]
		}
	}),
	/** @param {import("net.minecraft.world.item.Item").$Item$$Original} item */
	is_dream_journal(item) {
		const written_book_content = item.getComponents().get("minecraft:written_book_content")
		return Boolean(written_book_content) && written_book_content.author() == "Micky"
	},

	attempting_reset: false,

	server: /** @type {$MinecraftServer} */ (null),

	/** @param {$Player} player */
	try_to_enter(player) {
		const dream_dimension = this.get_or_create()
		if (!dream_dimension) {
			player.setStatusMessage(`Cannot get into ${this.ID} for some reason`)
			return
		}
		const spawn_point = dream_dimension.getSharedSpawnPos()
		const spawn_angle = dream_dimension.getSharedSpawnAngle()

		player.level.spawnParticles("minecraft:dust_color_transition{from_color:[1.0, 0.2, 0.5], to_color:[0.2, 0.9, 1.0], scale: 3.0}", false,
			player.x, player.y, player.z,
			player.getBbWidth() * 2, player.getBbHeight(), player.getBbWidth() * 2, 50, 1.0
		)
		player.addEffect(MobEffectUtil.of("minecraft:slow_falling", 30 * SEC))
		player.addEffect(MobEffectUtil.of("minecraft:speed", 30 * SEC, 3))
		player.teleportTo(this.ID, spawn_point.x, dream_dimension.getMaxBuildHeight(), spawn_point.z, spawn_angle, 0)
		// if (Platform.isLoaded("watervision"))
		// 	server.runCommandSilent(`playoverlay "${this.A_MIMIR_MP4_URL}" ${player.uuid}`)
		// else {
		player.tell(Text.of(`A mimir 🛏💤`).clickOpenUrl(this.A_MIMIR_URL).blue().underlined())
		// }
		player.giveInHand(DreamDimension.DREAM_JOURNAL)
		player.removeEffect("brewinandchewin:tipsy")

		// Should not be necessary, but just in case.
		if (this.get_expiration_time() == $Long.MAX_VALUE) {
			this.refresh_expiration_time()
		}
	},

	/** @param {$Player} player */
	can_enter(player) {
		return player.level.isOverworld()
		&& !player.isFakePlayer()
		&& player.getSleepTimer() >= this.SLEEP_WAIT_TIME
		&&
		(
			(player.isCreative() && player.isHolding("minecraft:stick"))
			|| (player.hasEffect("brewinandchewin:tipsy") && !player.hasEffect("via_romana:travellers_fatigue"))
		)
		&& !this.attempting_reset
	},

	/** @param {$Player} player */
	exit(player) {
		if (Platform.isLoaded("carryon")) {
			// I do not want people to be able to carry across.
			// FIXME: This does not work.
			// player.server.runCommand(`carryon place ${player.uuid}`)
			// player.getCarryOnData().clear()
		}

		if (!player) {
			console.warn(`Can no longer get a reference to the player as it travels between dimensions. I don't know why. Waiting one tick.`)
		}
		// Teleport surrounding item entities out, as well. Just to be sure.
		const nearby_entites = player.level.getEntitiesWithin(AABB.CUBE.move(player.x, player.y, player.z).inflate(10))
		const nearby_item_entities = Utils.newList()
		nearby_entites.forEach(e => {
			if (e.type == "minecraft:item") {
				nearby_item_entities.add(e)
			}
		})

		global.begone_effect(player)

		player.getInventory().clear(DreamDimension.is_dream_journal)
		player.server.scheduleInTicks(1, () => {
			nearby_item_entities.forEach(e => {
				e.teleportTo(player.level.dimension, player.x, player.y, player.z, e.yaw, e.pitch)
			})
		})
	},

	get_or_create() {
		let dream_dimension = this.server.getLevel(this.ID)
		if (dream_dimension) {
			return dream_dimension
		}

		console.log(`Creating new dream dimension`)
		this.server.runCommand(`resourceworld create ${this.PATH} minecraft:overworld`)
		dream_dimension = this.server.getLevel(this.ID)
		if (!dream_dimension) {
			console.error(`${this.ID} is not ready yet, cannot proceed with setup. This shouldn't happen, and I should wait for it, but I can't be bothered right now.`)
			return null
		}

		this.setup(dream_dimension)
		return dream_dimension
	},

	delete() {
		if (this.attempting_reset) {
			return
		}
		this.attempting_reset = true

		const dream_dimension = this.server.getLevel(this.ID)
		if (!dream_dimension) {
			console.error(`Cannot delete ${this.ID}, as it doesn't exist!`)
			return
		}

		// There should never be any players while this is happening, but just in case.
		dream_dimension.players.forEach(player => {
			this.exit(player)
		})

		// Bit of a buffer just to be sure.
		this.server.scheduleInTicks(5 * SEC, () => {
			console.log(`Deleting ${this.ID}`)
			this.setup(dream_dimension) // HACK: Nasty way to reset persistent values, as it's not always guaranteed setup is called.
			this.server.runCommand(`resourceworld delete ${this.PATH}`)
			this.server.runCommand(`resourceworld delete ${this.PATH}`) // It's needed for confirmation.
			if (Platform.isLoaded("chunky")) {
				this.server.runCommandSilent(`chunky cancel ${this.ID}`)
				this.server.runCommandSilent(`chunky confirm`)
			}
			this.attempting_reset = false
		})
		// Let's also already create another dream dimension for later.
		this.server.scheduleInTicks(15 * SEC, () => {
			this.get_or_create()
		})
	},

	/** @param {$Level} level */
	setup(level) {
		level.runCommandSilent(`resourceworld enable ${this.PATH}`)
		level.runCommandSilent(`resourceworld settings ${this.PATH} cooldown set 2`)
		level.runCommandSilent(`resourceworld settings ${this.PATH} allowHomeCommand set false`)
		level.runCommandSilent(`gamerule spawnChunkRadius 0`)
		level.runCommandSilent(`gamerule playersSleepingPercentage 0`)
		level.getPersistentData().put("expiration_time", $Long.MAX_VALUE)
		level.getPersistentData().put("chunky_size", 32)
		if (Platform.isLoaded("enhancedcelestials")) {
			level.runCommandSilent("enhancedcelestials lunarForecast recompute")
		}
	},

	refresh_expiration_time() {
		const new_expiration_time = this.server.getOverworld().time + this.server.getGameRules().getInt(global.GAME_RULES.DREAM_DURATION)
		const dream_dimension = this.server.getLevel(this.ID)
		dream_dimension.getPersistentData().put("expiration_time", new_expiration_time)
		console.log(`Refreshed expiration time of ${this.ID} to ${new_expiration_time}`)
	},

	get_expiration_time() {
		const dream_dimension = this.server.getLevel(this.ID)
		const expiration_time = dream_dimension.getPersistentData().getLong("expiration_time")
		if (expiration_time == 0) {
			return $Long.MAX_VALUE
		}
		return expiration_time
	},

	get_time_left() {
		return this.get_expiration_time(this.server) - this.server.getOverworld().time
	},

	/** @param {number} time_left */
	format_time(time_left) {
		const seconds = Math.floor(time_left / SEC) % 60
		if (time_left < 0) {
			return Text.of(`OVERTIME`).darkRed().bold()
		}
		if (time_left < 59 * SEC) {
			return Text.of(`${seconds.toFixed()}.${(time_left % SEC / 0.2).toFixed().padEnd(2, "0")}`).red()
		}

		const minutes = Math.floor(time_left / MIN) % 60
		const formatted_seconds = seconds.toFixed().padStart(2, "0")
		const formatted_minutes = minutes.toFixed().padStart(2, "0")

		const formatted_clock = Text.of(`${formatted_minutes}:${formatted_seconds}`)
		if (time_left < 1 * MIN) {
			return Text.of(formatted_clock).yellow()
		}

		return formatted_clock
	},

	/** @param {number} time_left */
	get_update_frequency(time_left) {
		if (time_left < 0) {
			return 4 * SEC
		}
		if (time_left < 59 * SEC) {
			return 2
		}
		if (time_left > DreamDimension.EXPIRATION_WARNING_OFFSET) {
			return 2.5 * MIN
		}

		return SEC
	},

	TIME_WITHER_BEGINS: 21 * SEC,
	TIME_WITHER_TRULY_BEGINS: 0 * SEC,
	/** @param {$Level} level */
	wither_players_try_starting(level) {
		if (DreamDimension.wither_players_scheduled) {
			return
		}
		console.log(`Trying to wither players out of ${this.ID}`)

		let is_other_beat = false
		DreamDimension.wither_players_scheduled = this.server.scheduleRepeatingInTicks(36, () => {
			if (level.getPlayers().isEmpty()) {
				DreamDimension.wither_players_stop()
				return
			}

			const time_left_sec = DreamDimension.get_time_left() / SEC
			const damage_amount = Math.abs(time_left_sec * 0.01)
			const effect_strength = Math.abs(time_left_sec * 0.05)
			const effect_duration = 5 * SEC

			level.getPlayers().forEach(/** @param {$ServerPlayer} player */ player => {
				player.attack(new DamageSource("kubejs:dream_wither"), damage_amount)
				player.addEffect(MobEffectUtil.of("brewinandchewin:intoxication", effect_duration))
				player.addEffect(MobEffectUtil.of("minecraft:haste", effect_duration, effect_strength))
				player.addEffect(MobEffectUtil.of("minecraft:speed", effect_duration, effect_strength, false, false, false))
				player.addEffect(MobEffectUtil.of("minecraft:luck", effect_duration, effect_strength, true, false, false))
				player.addEffect(MobEffectUtil.of("brewinandchewin:raging", effect_duration, effect_strength, true, false, false))
				player.addEffect(MobEffectUtil.of("xaerominimap:no_minimap_harmful", effect_duration, 0, false, false, false))
				player.addEffect(MobEffectUtil.of("xaeroworldmap:no_world_map_harmful", effect_duration, 0, false, false, false))

				if (player.onGround()) {
					let block_state_on = player.getBlockStateOn()
					if (block_state_on.hasTag("minecraft:moss_replaceable")) {
						player.block.getDown().set("biomesoplenty:anomaly", {type: "stable"})
					}
				}
				// let a = player.getBoundingBox().inflate(8, 4, 8)
				// level.runCommand(`fillbiome ${a.minX} ${a.minY} ${a.minZ} ${a.maxX} ${a.maxY} ${a.maxZ} biomeswevegone:pale_bog`)
				let biome_to_fill = is_other_beat ? "biomeswevegone:pale_bog" : "minecraft:end_barrens"
				this.server.runCommandSilent(`execute at ${player.uuid} in ${this.ID} run fillbiome ~-8 ~-4 ~-8 ~8 ~4 ~8 ${biome_to_fill}`)
			})
			is_other_beat = !is_other_beat
		})
	},
	wither_players_scheduled: /** @type {$ScheduledEvents$ScheduledEvent?} */ (null),
	wither_players_stop() {
		this.wither_players_scheduled.clear()
		delete this.wither_players_scheduled
	},
	/** @param {$Level} level */
	explode_around_try_starting(level) {
		if (DreamDimension.explode_around_scheduled) {
			return
		}
		console.log(`Trying to cause explosions around in ${this.ID}`)

		const min_height = level.getMinBuildHeight()
		const max_height = level.getMaxBuildHeight()
		const range_inner = 16
		const range_outer = 96

		// The music should be in beat. Using specific numbers for pitch and frequency here.
		// level.getMcPlayers().forEach(player => {
		play_sound_globally(level, Vec3d(0, 1000, 0), "minecraft:music_disc.precipice", "music", level.worldBorder.absoluteMaxSize, 0.9866)
		// })
		DreamDimension.explode_around_scheduled = this.server.scheduleRepeatingInTicks(18, callback => {
			if (level.getPlayers().isEmpty() || DreamDimension.explode_around_scheduled != callback) {
				this.explode_around_stop()
				return
			}

			const time_left = DreamDimension.get_time_left()
			if (time_left <= DreamDimension.TIME_WITHER_TRULY_BEGINS) {
				DreamDimension.explode_around_scheduled.timer = 9
			}

			const explosion_strength = Math.min(Math.abs(time_left / SEC * 0.2), 12)

			level.getPlayers().forEach(/** @param {$ServerPlayer} player */ player => {
				let level_block = player.level.getBlock(
					player.getBlockX() + player.getRandom().nextInt(-range_outer, range_outer),
					JavaMath.clamp(player.getBlockY() + player.getRandom().nextInt(-1, 5), min_height, max_height),
					player.getBlockZ() + player.getRandom().nextInt(-range_outer, range_outer),
				)

				// Burrow the explosion down.
				let i = 0
				while (i < 8 && level_block.getUp().getBlockState().isAir()) {
					level_block = level_block.getDown()
					i += 1
				}

				const block_pos = level_block.getPos()
				const block_center = block_pos.getCenter()
				if (player.position().distanceTo(block_center) >= range_inner) {
					level_block.explode({
						mode: "block",
						damageSource: new DamageSource("minecraft:explosion"),
						strength: explosion_strength,
					})

					let afflicted_aabb = AABB.CUBE.move(block_center.x(), block_center.y(), block_center.z()).inflate(explosion_strength)
					let nearby_entites = level.getEntitiesWithin(afflicted_aabb)
					nearby_entites.forEach(e => {
						if (e.type == "minecraft:item") {
							e.kill()
						}
					})
					this.server.runCommandSilent(`execute positioned ${block_pos.getX()} ${block_pos.getY()} ${block_pos.getZ()} in ${this.ID} run fillbiome ~-8 ~-4 ~-8 ~8 ~4 ~8 biomeswevegone:pale_bog`)
				} else {
					// Don't hurt too close.
					level_block.explode({
						mode: "block",
						strength: explosion_strength * 0.25,
					})
				}

				// level.spawnParticles("create:cube{r:1,g:0.5,b:1,scale:1,avg_age:10,hot:false}", true,
				// 	block_center.x(), block_center.y(), block_center.z(),
				// 	0, 0, 0, 4, 1
				// )
				// level.spawnParticles(`create:cube{r:1,g:0.75,b:1,scale:1,avg_age:20,hot:false}`, true,

				BlockPos.randomInCube(level.getRandom(), explosion_strength * 2, level_block, explosion_strength).forEach(pos => {
					let block = level.getBlock(pos)
					let chosen_block = level.getBlock(block.getBlockState().isAir() ? level.getHeightmapPos("motion_blocking", pos).below() : block)
					if (chosen_block.getBlockState().getFluidState().isEmpty()) {
						chosen_block.set("biomesoplenty:anomaly", {type: "stable"})
					} else {
						chosen_block.set("biomesoplenty:liquid_null")
					}

					let r = 0.4 + 0.6 * Math.random()
					let g = 0.2 + 0.2 * Math.random()
					let b = 0.4 + 0.6 * Math.random()
					if (Math.random() > 0.5) {
						r *= 0.01
						g *= 0.01
						b *= 0.01
					}
					let x_speed = 4 - 8 * Math.random()
					let z_speed = 4 - 8 * Math.random()
					const cube_particle = `create:cube{r:${r},g:${g},b:${b},scale:1,avg_age:40,hot:false}`
					level.spawnParticles(cube_particle, true,
						chosen_block.getCenterX(), chosen_block.getCenterY(), chosen_block.getCenterZ(),
						x_speed, 10, z_speed, 0, 0.02 + 0.05 * Math.random()
					)
				})

				// play_sound_globally(level, block_center.add(0, 10, 0), "relics:ability_locked", "blocks", 100, 0.85 + 0.1 * Math.random())
				// play_sound_globally(level, block_center, "create:schematicannon_finish", "blocks", 96, 2 + 0.5 * Math.random())
				play_sound_globally(level, block_center, "create:packager", "blocks", 128, 1.75 + 0.25 * Math.random())
				play_sound_globally(level, block_center, "create:crushing_1", "blocks", 96, 0.65 + 0.1 * Math.random())

				player.addEffect(MobEffectUtil.of("minecraft:slowness", 2, 0, true, false, false))
			})
		})
	},
	explode_around_scheduled: /** @type {$ScheduledEvents$ScheduledEvent?} */ (null),
	explode_around_stop() {
		this.explode_around_scheduled.clear()
		delete this.explode_around_scheduled
	},

	// The callback may be useful later.
	/**  @param {$ScheduledEvents$ScheduledEvent?} _callback */
	try_preparing(_callback) {
		// console.log(`Checking if it's reasonable to prepare ${this.ID}`)
		const dream_dimension = this.get_or_create()
		if (!dream_dimension) {
			return
		}
		if (this.get_time_left() <= 5 * MIN || this.attempting_reset) {
			return
		}

		if (
			((this.server.isDedicated() && this.server.getPlayerCount() == 0)
			|| this.server.averageTickTimeNanos < this.IDEAL_TO_PREPARE_AVERAGE_TICK_TIME_NANOS)
		) {
			this.prepare_chunks()
		}
	},
	prepare_chunks() {
		if (!Platform.isLoaded("chunky")) {
			return
		}
		const dream_dimension = this.get_or_create()
		let data = dream_dimension.getPersistentData()

		let chunky_size = data.getInt("chunky_size")
		if (chunky_size >= 1024) {
			return
		}
		chunky_size = JavaMath.clamp(chunky_size + 64, 64, 1024)
		data.putInt("chunky_size", chunky_size)
		this.server.runCommandSilent(`chunky cancel ${this.ID}`)
		this.server.runCommandSilent(`chunky confirm`)
		this.server.runCommandSilent(`chunky start ${this.ID} square 0 0 ${chunky_size} ${chunky_size}`)
		this.server.runCommandSilent(`chunky confirm`)
		console.log(`Preparing ${chunky_size}x${chunky_size} area in ${this.ID}`)
	}
}

NativeEvents.onEvent($CanContinueSleepingEvent, event => {
	const entity = event.getEntity()
	if (!entity.isPlayer() || !event.mayContinueSleeping() || !DreamDimension.can_enter(entity)) {
		return
	}

	DreamDimension.try_to_enter(entity)
})

NativeEvents.onEvent($PlayerSetSpawnEvent, event => {
	if (event.getSpawnLevel().getNamespace() != DreamDimension.NAMESPACE) {
		return
	}
	event.setCanceled(true)
	const entity = event.getEntity()
	entity.server.scheduleInTicks(1, () => {
		// For some reason, the scheduling is required here. Otherwise,
		// the dimension changes correctly, but the player's coordinates remain the same.
		DreamDimension.exit(entity)
	})
})

EntityEvents.death("minecraft:player", event => {
	const player = event.player
	if (player.level.dimension.getNamespace() != DreamDimension.NAMESPACE) {
		return
	}

	if (player.isCreative()) {
		player.setHealth(player.getMaxHealth())
	} else {
		player.setHealth(1)
		player.setFoodLevel(6)
		player.experienceLevel *= 0.75

		/** @param {import("net.minecraft.world.effect.MobEffectInstance").$MobEffectInstance$$Type} effect_instance */
		let incurable = function(effect_instance) {
			effect_instance.getCures().clear()
			return effect_instance
		}
		player.addEffect(incurable(MobEffectUtil.of("via_romana:travellers_fatigue", 3 * MIN)))
		player.addEffect(incurable(MobEffectUtil.of("brewinandchewin:intoxication", 1 * MIN)))
		player.addEffect(incurable(MobEffectUtil.of("brewinandchewin:tipsy", 30 * SEC, 4)))
		player.addEffect(incurable(MobEffectUtil.of("xaerominimap:no_minimap_harmful", 30 * SEC)))
		player.addEffect(incurable(MobEffectUtil.of("xaeroworldmap:no_world_map_harmful", 30 * SEC)))
	}
	player.level.tell(Text.of(["In a bad dream, ", event.getSource().getLocalizedDeathMessage(player)]).gray())
	DreamDimension.exit(player)
	event.cancel()
})

PlayerEvents.cloned(event => {
	if (event.level.dimension == DreamDimension.ID) {
		if (DreamDimension.get_expiration_time() == $Long.MAX_VALUE) {
			DreamDimension.refresh_expiration_time()
		}
	} else {
		// FIXME: Doesn't seem to do anything when moving out from the Dream Dimension.
		event.player.getInventory().clear(DreamDimension.is_dream_journal)
	}
})

LevelEvents.tick(DreamDimension.ID, event => {
	DreamDimension.server = event.server
	const server = event.server
	const level = event.level
	const time_left = DreamDimension.get_time_left()
	if (time_left % DreamDimension.get_update_frequency(time_left) == 0) {
		let formatted_time = DreamDimension.format_time(time_left)
		level.getPlayers().forEach(p => p.setStatusMessage(formatted_time))
	}
	if (time_left <= DreamDimension.TIME_WITHER_TRULY_BEGINS) {
		DreamDimension.wither_players_try_starting(level)
		if (level.getPlayers().isEmpty()) {
			DreamDimension.delete()
			return
		}
	}
	if (time_left <= DreamDimension.TIME_WITHER_BEGINS) {
		DreamDimension.explode_around_try_starting(level)
	}

	// server.getPlayers().forEach(p => {
	// 	p.setStatusMessage(
	// 		`time left: ${DreamDimension.get_time_left()} | attempting reset: ${DreamDimension.attempting_reset}`
	// 	)
	// })
})

ServerEvents.loaded(event => {
	DreamDimension.server = event.server
	event.server.scheduleRepeatingInTicks(10 * MIN, callback => DreamDimension.try_preparing(event.server, callback))
})

ServerEvents.registry("damage_type", event => {
	event.createCustom("kubejs:dream_wither", () => new $DamageType("wither", "never", 0.5, "drowning", "default"))
})

ServerEvents.tags("damage_type", event => {
	event.add("minecraft:bypasses_armor", "kubejs:dream_wither")
	event.add("minecraft:bypasses_cooldown", "kubejs:dream_wither")
	event.add("minecraft:bypasses_resistance", "kubejs:dream_wither")
	event.add("minecraft:panic_environmental_causes", "kubejs:dream_wither")
	event.add("minecraft:no_impact", "kubejs:dream_wither")
	event.add("minecraft:no_knockback", "kubejs:dream_wither")
	event.add("neoforge:is_environment", "kubejs:dream_wither")
	event.add("neoforge:no_flinch", "kubejs:dream_wither")
})

BlockEvents.rightClicked("cobblemonraiddens:raid_crystal_block", event => {
	if (event.level.dimension == DreamDimension.ID) {
		DreamDimension.exit(event.player)
		event.cancel()
	}
})


// if (Platform.isLoaded("via_romana")) {
// 	/** @type {typeof import("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove").$MobEffectEvent$Remove } */
// 	let $MobEffectEvent$Remove  = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove")
// 	NativeEvents.onEvent($MobEffectEvent$Remove, event => {
// 		if (event.getCure().name() == "milk" && event.effect.is("via_romana:travellers_fatigue")) {
// 			event.setCanceled(true)
// 		}
// 	})
// }

// Debugging.
// ServerEvents.tick(event => {
// 	const server = event.server
// 	server.getPlayers().forEach(p => {
// // 		// const nearby_entites = p.level.getEntitiesWithin(AABB.CUBE.move(p.x, p.y, p.z).inflate(10))
// // 		// const nearby_item_entities = Utils.newList()
// // 		// nearby_entites.forEach(e => {
// // 		// 	if (e.type == "minecraft:item") {
// // 		// 		nearby_item_entities.add(e)
// // 		// 	}
// // 		// })
// 		p.setStatusMessage(
// // 			// `Game time: ${server.overworld().time} | tick count: ${server.getTickCount()}`
// // 			// `time left: ${DreamDimension.get_time_left()} | attempting reset: ${DreamDimension.attempting_reset}`
// // 			// `Nearby item entities: ${nearby_item_entities.size()}`
// 			// (server.getAverageTickTimeNanos() / 1000000).toFixed(3)
// 			// server.getAverageTickTimeNanos()
// 			event.server.scheduledEvents.events.size()
// 		)
// 	})
// })

// More debugging.
BlockEvents.rightClicked("minecraft:crying_obsidian", event => {
	DreamDimension.server = event.server
	const player = /** @type {$ServerPlayer} */ (event.player)
	if (player.isOp() && !player.swinging) {
		// DreamDimension.try_preparing(event.server, null)
		if (event.getItem().id == "minecraft:stick") {
			if (player.isCrouching()) {
				player.getInventory().clear(DreamDimension.is_dream_journal)
			} else {
				player.giveInHand(DreamDimension.DREAM_JOURNAL)
			}
			player.swing(event.getHand(), true)
		}
		// console.log(`DreamDimension.server is ${DreamDimension.server} | Global server reference is ${global.server}`)
		// console.log(`global.GAME_RULES.DREAM_DURATION is ${global.GAME_RULES.DREAM_DURATION}`)
	}
})

