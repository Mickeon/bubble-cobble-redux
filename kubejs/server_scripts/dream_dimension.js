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
 * @import {$ServerLevel} from "net.minecraft.server.level.ServerLevel"
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
	/** @param {$ItemStack} item */
	is_dream_journal(item) {
		const written_book_content = item.get("minecraft:written_book_content")
		return Boolean(written_book_content) && written_book_content.author() == "Micky"
	},

	attempting_reset: false,

	server: /** @type {$MinecraftServer} */ (null),

	/** @param {$Player} player */
	let_in(player) {
		const level = this.get_or_create()
		if (!level) {
			player.setStatusMessage(`Cannot get into ${this.ID} for some reason`)
			return
		}
		const spawn_point = level.getSharedSpawnPos()
		const spawn_angle = level.getSharedSpawnAngle()
		// const spawn_height = this.server.worldData.isFlatWorld() ? spawn_point.y : level.getMaxBuildHeight()

		player.level.spawnParticles("minecraft:dust_color_transition{from_color:[1.0, 0.2, 0.5], to_color:[0.2, 0.9, 1.0], scale: 3.0}", false,
			player.x, player.y, player.z,
			player.getBbWidth() * 2, player.getBbHeight(), player.getBbWidth() * 2, 50, 1.0
		)
		player.addEffect(MobEffectUtil.of("minecraft:slow_falling", 30 * SEC))
		player.addEffect(MobEffectUtil.of("minecraft:speed", 30 * SEC, 3))
		player.teleportTo(this.ID, spawn_point.x, spawn_point.y, spawn_point.z, spawn_angle, 0)
		// if (Platform.isLoaded("watervision"))
		// 	server.runCommandSilent(`playoverlay "${this.A_MIMIR_MP4_URL}" ${player.uuid}`)
		// else {
		player.tell(Text.of(`A mimir 🛏💤`).clickOpenUrl(this.A_MIMIR_URL).blue().underlined())
		// }
		player.giveInHand(DreamDimension.DREAM_JOURNAL)
		player.removeEffect("brewinandchewin:tipsy")

		// Should not be necessary, but just in case.
		if (!this.is_expiring()) {
			this.refresh_expiration_time()
		}

		// DreamDimension.show_clock_to_players()
	},

	/** @param {$Player} player */
	can_let_in(player) {
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
	let_out(player) {
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

	get() {
		return this.server.getLevel(this.ID)
	},

	get_or_create() {
		let level = this.get()
		if (!level) {
			console.log(`Creating new dream dimension`)
			this.server.runCommand(`resourceworld create ${this.PATH} minecraft:overworld`)
			level = this.get()
			if (!level) {
				console.error(`${this.ID} is not ready yet, cannot proceed with setup. This shouldn't happen, and I should wait for it, but I can't be bothered right now.`)
				return null
			}

			this.setup(level)
		}

		return level
	},

	reset() {
		if (this.attempting_reset) {
			return
		}
		this.attempting_reset = true

		const level = this.get()
		if (!level) {
			console.error(`Cannot delete ${this.ID}, as it doesn't exist!`)
			return
		}

		// There should never be any players while this is happening, but just in case.
		level.players.forEach(player => {
			this.let_out(player)
		})

		// Bit of a buffer just to be sure.
		this.server.scheduleInTicks(5 * SEC, () => {
			console.log(`Deleting ${this.ID}`)
			this.setup(level) // HACK: Nasty way to reset persistent values, as it's not always guaranteed setup is called.
			this.server.runCommand(`resourceworld delete ${this.PATH}`)
			this.server.runCommand(`resourceworld delete ${this.PATH}`) // It's needed for confirmation.
			if (Platform.isLoaded("chunky")) {
				this.server.runCommandSilent(`chunky cancel ${this.ID}`)
				this.server.runCommandSilent(`chunky confirm`)
			}
			this.attempting_reset = false
		})
		// Let's also already create another dream dimension for later.
		this.server.scheduleInTicks(10 * SEC, () => {
			this.get_or_create()
		})
	},

	setup(level) {
		level.runCommandSilent(`resourceworld enable ${this.PATH}`)
		level.runCommandSilent(`resourceworld settings ${this.PATH} cooldown set 2`)
		level.runCommandSilent(`resourceworld settings ${this.PATH} allowHomeCommand set false`)
		level.runCommandSilent(`gamerule spawnChunkRadius 0`)
		level.runCommandSilent(`gamerule playersSleepingPercentage 0`)
		level.getPersistentData().putLong("expiration_time", $Long.MAX_VALUE)
		level.getPersistentData().putInt("chunky_size", 32)
	},

	refresh_expiration_time() {
		const level = this.get()
		if (!level) {
			console.error(`Tried to refresh expiration time but there's no dream dimension yet`).
			return
		}
		const new_expiration_time = this.server.getOverworld().time + this.server.getGameRules().getInt(global.GAME_RULES.DREAM_DURATION)
		level.getPersistentData().putLong("expiration_time", new_expiration_time)
		console.log(`Refreshed expiration time of ${this.ID} to ${new_expiration_time}`)
	},

	get_expiration_time() {
		const level = this.get()
		return (level && level.getPersistentData().getLong("expiration_time")) || $Long.MAX_VALUE
	},

	is_expiring() {
		return this.get_expiration_time() != $Long.MAX_VALUE
	},

	// Mostly for testing.
	/** @param {number} amount */
	increase_expiration_time(amount) {
		const level = this.get()
		if (!level) {
			console.error(`Tried to change expiration time but there's no dream dimension yet`).
			return
		}
		level.getPersistentData().putLong("expiration_time", level.getPersistentData().getLong("expiration_time") + amount)
	},

	get_time_left() {
		return this.get_expiration_time() - this.server.getOverworld().time
	},

	show_clock_to_players() {
		const formatted_time = this.format_time(this.get_time_left())
		this.get().getPlayers().forEach(p => p.setStatusMessage(formatted_time))
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

		if (time_left < 59 * MIN) {
			return Text.of(`${formatted_minutes}:${formatted_seconds}`)
		}
		if (time_left < 24 * 60 * MIN) {
			const hours = Math.floor(time_left / 60 * MIN) % 24
			const formatted_hours = hours.toFixed().padStart(2, "0")
			return Text.of(`${formatted_hours}:${formatted_minutes}:${formatted_seconds}`)
		}

		return Text.of(`You feel like this dream will last for quite a while`)
	},

	get_clock_frequency() {
		const time_left = this.get_time_left()
		if (time_left < 0) {
			return 4 * SEC
		}
		if (time_left < 59 * SEC) {
			return 2
		}
		if (time_left < DreamDimension.EXPIRATION_WARNING_OFFSET) {
			return SEC
		}
		if (time_left < 59 * MIN) {
			return 1 * MIN
		}

		return 5 * MIN
	},

	TIME_WITHER_BEGINS: 21 * SEC,
	TIME_WITHER_TRULY_BEGINS: 0 * SEC,
	wither_players_try_starting() {
		if (DreamDimension.wither_players_scheduled) {
			return
		}
		console.log(`Trying to wither players out of ${this.ID}`)

		const level = this.get()

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
				const biome_to_fill = is_other_beat ? "biomeswevegone:pale_bog" : "minecraft:end_barrens"
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
	explode_around_try_starting() {
		if (DreamDimension.explode_around_scheduled) {
			return
		}
		console.log(`Trying to cause explosions around in ${this.ID}`)

		const level = this.get()
		const min_height = level.getMinBuildHeight()
		const max_height = level.getMaxBuildHeight()
		const range_inner = 16
		const range_outer = 96
		let pokemon_spawned = false

		level.tell(Text.gray("It chases people and Pokémon from its territory...").italic())

		// The music should be in beat. Using specific numbers for pitch and frequency here.
		play_sound_globally(level, new Vec3d(0, 1000, 0), "minecraft:music_disc.precipice", "music", level.worldBorder.absoluteMaxSize, 0.9866)
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

					let nearby_entites = level.getEntitiesWithin(AABB.CUBE.move(block_center.x(), block_center.y(), block_center.z()).inflate(explosion_strength))
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

				BlockPos.randomInCube(level.getRandom(), explosion_strength * 2, level_block, explosion_strength).forEach(pos => {
					let block = level.getBlock(pos)
					let corrupted_block = level.getBlock(block.getBlockState().isAir() ? level.getHeightmapPos("motion_blocking", pos).below() : block)
					if (corrupted_block.getBlockState().getFluidState().isEmpty()) {
						corrupted_block.set("biomesoplenty:anomaly", {type: "stable"})
					} else {
						corrupted_block.set("biomesoplenty:liquid_null")
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
						corrupted_block.getCenterX(), corrupted_block.getCenterY(), corrupted_block.getCenterZ(),
						x_speed, 10, z_speed, 0, 0.02 + 0.05 * Math.random()
					)
				})

				play_sound_globally(level, block_center, "create:packager", "blocks", 128, 1.75 + 0.25 * Math.random())
				play_sound_globally(level, block_center, "create:crushing_1", "blocks", 96, 0.65 + 0.1 * Math.random())

				player.addEffect(MobEffectUtil.of("minecraft:slowness", 2, 0, true, false, false))

				if (!pokemon_spawned && time_left <= DreamDimension.TIME_WITHER_TRULY_BEGINS && block_center.distanceTo(player.position()) <= 40) {
					pokemon_spawned = true

					this.spawn_darkrai(level, block_center.add(0, 2, 0))
					level.tell(Text.gray("...by causing them to experience deep, nightmarish slumbers.").italic())
				}
			})
		})
	},
	explode_around_scheduled: /** @type {$ScheduledEvents$ScheduledEvent?} */ (null),
	explode_around_stop() {
		this.explode_around_scheduled.clear()
		delete this.explode_around_scheduled
	},

	/** @param {$ServerLevel} level @param {$Vec3} position  */
	spawn_darkrai(level, position) {
		/** @type {typeof import("com.cobblemon.mod.common.entity.pokemon.PokemonEntity").$PokemonEntity } */
		let $PokemonEntity  = Java.loadClass("com.cobblemon.mod.common.entity.pokemon.PokemonEntity")
		/** @type {typeof import("com.cobblemon.mod.common.api.pokemon.PokemonSpecies").$PokemonSpecies } */
		let $PokemonSpecies  = Java.loadClass("com.cobblemon.mod.common.api.pokemon.PokemonSpecies")
		/** @type {typeof import("com.cobblemon.mod.common.api.moves.Moves").$Moves } */
		let $Moves  = Java.loadClass("com.cobblemon.mod.common.api.moves.Moves")
		/** @type {typeof import("com.cobblemon.mod.common.api.pokemon.stats.Stats").$Stats } */
		let $Stats  = Java.loadClass("com.cobblemon.mod.common.api.pokemon.stats.Stats")

		level.spawnEntity("cobblemon:pokemon", entity => {
			const pokemon_entity = /** @type {$PokemonEntity} */ (entity)
			const pokemon = pokemon_entity.pokemon
			pokemon.species = $PokemonSpecies.getByName("darkrai")
			pokemon.level = 75
			pokemon.scaleModifier = 2.0
			pokemon.setEV($Stats.HP, 4)
			pokemon.setEV($Stats.SPECIAL_ATTACK, 252)
			pokemon.setEV($Stats.SPEED, 252)
			const moveset = pokemon.getMoveSet()
			moveset.setMove(0, $Moves.getByName("hypnosis").create())
			moveset.setMove(1, $Moves.getByName("nightmare").create())
			moveset.setMove(2, $Moves.getByName("nastyplot").create())
			moveset.setMove(3, $Moves.getByName("thunder").create())

			pokemon_entity.cry()
			pokemon_entity.addEffect(MobEffectUtil.of("minecraft:glowing", 2 * MIN))
			pokemon_entity.setPos(position)
			pokemon_entity.setInvulnerable(true)
			level.server.scheduleRepeatingInTicks(1, callback => {
				if (pokemon_entity.getAttributeBaseValue("minecraft:generic.scale") >= 5) {
					callback.clear()
					return
				}
				pokemon_entity.setAttributeBaseValue("minecraft:generic.scale", Math.min(pokemon_entity.getAttributeBaseValue("minecraft:generic.scale") + 0.05, 5))
			})
		})
		console.log("Spawning Pokemon in Dream Dimension")
		// this.server.runCommand(`execute in ${this.ID} run spawnpokemonat ${block_center.x()} ${block_center.y()} ${block_center.z()} darkrai hp_ev=4 special_attack_ev=252 speed_ev=252 moves=hypnosis,nightmare,nastyplot,thunder level=75 scale_modifier=5.0`)
		// Its cry doesn't exist anyway, don't bother.
		play_sound_globally(level, position, "cobblemon:impact.ghost", "hostile", 10000, 0.5)
		play_sound_globally(level, position, "cobblemon:impact.dark", "hostile", 10000, 0.5)
	},

	// The callback may be useful later.
	/**  @param {$ScheduledEvents$ScheduledEvent?} _callback */
	try_preparing(_callback) {
		// console.log(`Checking if it's reasonable to prepare ${this.ID}`)
		const level = this.get_or_create()
		if (!level) {
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

		const level = this.get_or_create()
		if (!level) {
			return
		}
		let data = level.getPersistentData()

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
	},
}

NativeEvents.onEvent($CanContinueSleepingEvent, event => {
	const entity = event.getEntity()
	if (!entity.isPlayer() || !event.mayContinueSleeping() || !DreamDimension.can_let_in(entity)) {
		return
	}

	DreamDimension.let_in(entity)
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
		DreamDimension.let_out(entity)
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
	DreamDimension.let_out(player)
	event.cancel()
})

PlayerEvents.cloned(event => {
	if (event.level.dimension == DreamDimension.ID) {
		if (!DreamDimension.is_expiring()) {
			DreamDimension.refresh_expiration_time()
		}
	} else {
		// FIXME: The whole event isn't called when moving out from the Dream Dimension.
		event.player.getInventory().clear(DreamDimension.is_dream_journal)
	}
})

LevelEvents.tick(DreamDimension.ID, event => {
	DreamDimension.server = event.server
	const time_left = DreamDimension.get_time_left()
	if (time_left % DreamDimension.get_clock_frequency(time_left) == 0) {
		DreamDimension.show_clock_to_players()
	}
	if (DreamDimension.attempting_reset) {
		return
	}
	if (time_left <= DreamDimension.TIME_WITHER_TRULY_BEGINS) {
		DreamDimension.wither_players_try_starting()
		if (event.level.getPlayers().isEmpty()) {
			DreamDimension.reset()
			return
		}
	}
	if (time_left <= DreamDimension.TIME_WITHER_BEGINS) {
		DreamDimension.explode_around_try_starting()
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

ServerEvents.tick(event => {
	DreamDimension.server = event.server // This really exists just to be safe while debugging and reloading scripts.
	// event.server.getPlayers().forEach(p => p.setStatusMessage(`${DreamDimension.is_expiring()} ${DreamDimension.get_expiration_time()}`))
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
		DreamDimension.let_out(event.player)
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
		const item = event.item
		if (item.id == "minecraft:stick") {
			if (player.isCrouching()) {
				player.getInventory().clear(DreamDimension.is_dream_journal)
			} else {
				player.giveInHand(DreamDimension.DREAM_JOURNAL)
			}
			player.swing(event.getHand(), true)
		} else if (item.id == "minecraft:blaze_powder") {
			if (!DreamDimension.is_expiring()) {
				return
			}

			if (player.isCrouching()) {
				DreamDimension.increase_expiration_time(-1 * MIN)
			} else {
				DreamDimension.increase_expiration_time(1 * MIN)
			}
			player.setStatusMessage(DreamDimension.format_time(DreamDimension.get_time_left()))
			player.swing(event.getHand(), true)
		}
		// console.log(`DreamDimension.server is ${DreamDimension.server} | Global server reference is ${global.server}`)
		// console.log(`global.GAME_RULES.DREAM_DURATION is ${global.GAME_RULES.DREAM_DURATION}`)
	}
})

