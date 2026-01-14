// requires: cobblemon
// requires: create
/** @type {typeof import("net.minecraft.world.entity.player.Player").$Player } */
let $Player  = Java.loadClass("net.minecraft.world.entity.player.Player")
/** @type {typeof import("dev.latvian.mods.kubejs.item.FoodBuilder").$FoodBuilder } */
let $FoodBuilder  = Java.loadClass("dev.latvian.mods.kubejs.item.FoodBuilder")
/** @type {typeof import("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added").$MobEffectEvent$Added } */
let $MobEffectEvent$Added  = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added")
/** @type {typeof import("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Expired").$MobEffectEvent$Expired } */
let $MobEffectEvent$Expired  = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Expired")
/** @type {typeof import("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove").$MobEffectEvent$Remove } */
let $MobEffectEvent$Remove  = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove")

ServerEvents.recipes(event => {
	console.log("Changing recipes in funny_server.js")
	event.recipes.create.mechanical_crafting(
		Item.of("kubejs:blue_mascot_cat", {"minecraft:custom_data": {crafted: true}}), [
			" AAA ",
			"APCPA",
			"AISIA",
			"APWPA",
			" AAA "
		], {
			A: "minecraft:ice",
			P: "minecraft:blue_ice",
			I: "cobblemon:ice_stone",
			C: "brewinandchewin:flaxen_cheese_wedge",
			W: "minecraft:blue_wool",
			S: "minecraft:diamond",
		},
	)
	event.recipes.create.crushing([
			CreateItem.of(Item.of("minecraft:light_blue_dye", 2)),
			CreateItem.of(Item.of("minecraft:light_blue_dye", 2), 0.5)
		],
		"kubejs:blue_mascot_cat"
	)
	event.recipes.create.milling([
			CreateItem.of(Item.of("minecraft:light_blue_dye", 2)),
			CreateItem.of(Item.of("minecraft:light_blue_dye", 2), 0.5)
		],
		"kubejs:blue_mascot_cat"
	)

	event.shapeless("kubejs:banana_mayo_sandwich", ["#cobblemon:berries/colour/yellow", "create_bic_bit:mayonnaise_bottle", "minecraft:bread"])
	event.shapeless(Item.of("kubejs:doublemint_gum", 2), ["#cobblemon:mints", "#c:slime_balls", "#cobblemon:mints", "minecraft:paper"])

	const cooked_lucky_egg = Item.of("farmersdelight:fried_egg", {"minecraft:custom_data": {was_lucky_egg: true}, "minecraft:rarity": "uncommon"})
	event.smelting(cooked_lucky_egg, "cobblemon:lucky_egg", 5)
	event.smoking(cooked_lucky_egg, "cobblemon:lucky_egg", 2.5)
	event.campfireCooking(cooked_lucky_egg, "cobblemon:lucky_egg", 5)

	event.shaped("kubejs:super_ghostbusters", [" T ", "TMT", " T "], {T: "mega_showdown:ghost_tera_shard", M: "cobblemon:moon_stone"})
})

ItemEvents.foodEaten("cobblemon:ice_stone", event => {
	if (event.level.isClientSide()) {
		return
	}
	event.entity.setTicksFrozen(300)
})

ItemEvents.foodEaten("kubejs:banana_mayo_sandwich", event => {
	if (event.level.isClientSide()) {
		return
	}
	const entity = event.entity
	if (entity.username == "SueTheMimiga") {
		entity.potionEffects.add("farmersdelight:comfort", 600, 1)
	} else {
		entity.potionEffects.add("minecraft:nausea", 200, 1)
	}
})
ItemEvents.foodEaten(["biomesoplenty:cattail", "biomeswevegone:cattail_sprout", "biomeswevegone:fluorescent_cattail_sprout"], event => {
	if (event.level.isClientSide()) {
		return
	}
	const entity = event.entity
	const particle_point = entity.eyePosition.add(entity.forward.scale(0.5))
	entity.level.spawnParticles("minecraft:dust_color_transition{from_color:[1.0, 1.0, 1.0], to_color:[1.0, 0.9, 0.5], scale: 4.0}", false,
		particle_point.x, particle_point.y, particle_point.z,
		0.75, 0.5, 0.75, 50, 0.25
	)
	entity.attack(new DamageSource("biomeswevegone:cattail_explosion", particle_point), 1.0)
	entity.level.runCommandSilent(`execute as ${entity.uuid} at ${entity.uuid} run playsound minecraft:entity.llama.spit player @a ~ ~ ~ 1.0`)

	if (event.player && event.item.id == "biomeswevegone:fluorescent_cattail_sprout") {
		event.player.addEffect(MobEffectUtil.of("minecraft:glowing", 3 * SEC))
		event.player.drop("minecraft:glowstone_dust", false)
	}
})
ItemEvents.foodEaten("kubejs:super_ghostbusters", event => {
	event.player?.playNotifySound("supplementaries:block.jar.break", "players", 1, 0.5)
	event.level.runCommandSilent(`enhancedcelestials setLunarEvent bubble_cobble:ghostbusters`)
})

// Funny Sopping Wet Thing thing.
ItemEvents.entityInteracted("create:wrench",  event => {
	const target = event.target
	const player = event.entity
	if (target.type != "minecraft:player" || target.username != "Mickeon" || !player.shiftKeyDown) {
		return
	}
	player.addItemCooldown(event.item.getItem(), 120 * SEC)
	player.give("kubejs:blue_mascot_cat")
	const spawn_position = player.server.getOverworld().sharedSpawnPos
	player.teleportTo("minecraft:overworld", spawn_position.x, spawn_position.y, spawn_position.y, player.yaw, player.pitch)
})

// Some of us can eat the inedible, even by pure accident.
ItemEvents.firstRightClicked(["create:chocolate_bucket", "create:honey_bucket", "create_bic_bit:mayonnaise_bucket", "create_bic_bit:ketchup_bucket"], event => {
	const player = event.player
	if (player
	&& (player.username == "AceNil_" || player.username == "SniperZee")
	&& player.foodData.needsFood()
	&& !player.crouching
	) { // AceNil_
		const item_stack = event.item
		player.eat(player.level, item_stack, new $FoodBuilder().nutrition(5).build())
		player.give("minecraft:bucket")
		player.tell("hungi")
	}
})

ItemEvents.firstRightClicked(["minecraft:raw_copper"], event => {
	const player = event.player
	if (player
	&& player.username == "CantieLabs"
	&& !player.crouching
	) { // CantieLabs
		const item_stack = event.item
		item_stack.food = new $FoodBuilder().nutrition(3).alwaysEdible().build()
		item_stack.lore = Text.of("Yummy!")
	}
})

// #region Bearded Dragon Logic
const BEARDED_QUOTES = [
	"you can do it!",
	"am ok! ❤",
	"yippie!",
	"oh!",
	"hehe",
	"wow...",
	"yip!",
	"am soup",
	"love you!",
]
const BEARDED_GREETING_QUOTES = [
	"helo!",
	"good morning!",
]
const BEARDED_GOODBYE_QUOTES = [
	"goo bye",
	"weee!",
]
if (Item.exists("kubejs:bearded_dragon_bowl")) {
	ItemEvents.rightClicked("kubejs:bearded_dragon_bowl", event => {
		const player = event.player
		const level = event.level
		const item_stack = event.item
		if (!event.player || event.level.isClientSide()) {
			return
		}

		const chosen_quote = pick_random(BEARDED_QUOTES)
		bearded_dragon_speak(player, item_stack.displayName, chosen_quote)

		// Usual server jank because playSound doesn't want to work with players.
		level.runCommandSilent(`execute as ${player.uuid} at ${player.uuid} run playsound kubejs:item.bearded_dragon_chirp player @a ~ ~ ~ 1.0 ${1.25 + 0.25 * Math.random()}`)
		// player.playSound("kubejs:item.bearded_dragon_chirp", 1.0, 1.25 + 0.25 * Math.random())
		player.addItemCooldown(item_stack.item, 10)
		player.potionEffects.add("farmersdelight:comfort", 20, 1)
	})

	ItemEvents.pickedUp("kubejs:bearded_dragon_bowl", event => {
		if (!event.entity.player) { return }
		bearded_dragon_speak(event.entity, event.item.displayName, pick_random(BEARDED_GREETING_QUOTES))
	})

	ItemEvents.dropped("kubejs:bearded_dragon_bowl", event => {
		if (!event.entity.player) { return }
		bearded_dragon_speak(event.entity, event.item.displayName, pick_random(BEARDED_GOODBYE_QUOTES))

		const item_entity = event.itemEntity
		event.entity.server.scheduleRepeatingInTicks(40, callback => {
			if (item_entity.isRemoved()) {
				callback.clear()
				return
			}
			item_entity.playSound("kubejs:item.bearded_dragon_chirp", 0.5, 1.25 + 0.25 * Math.random())
			callback.timer = 40 + 40 * Math.random()
		})
	})
}

function bearded_dragon_speak(to_player, display_name, quote) {
	const name = display_name.getString().replace("[", "").replace("]", "")
	to_player.tell([Text.yellow(name + " : "), quote])
}
// #endregion

// Pipi easter egg.
ItemEvents.entityInteracted("minecraft:name_tag", event => {
	const target = event.target
	if (target.type == "minecraft:cat" && event.item.displayName.getString().toLowerCase().includes("pipi")) {
		target.setVariant("kubejs:pipi")
	}
})

ServerEvents.tags("block", event => {
	event.add("bubble_cobble:quicksand", "biomeswevegone:quicksand", "undergroundworlds:quicksand", "biomeswevegone:red_quicksand")
})

// Pokemon greeting easter egg.
// Also help whoever is in quicksand with thumbs up.
PlayerEvents.decorateChat(event => {
	const speaker = event.player
	/** @type {String} */
	const message = event.message
	if (message.toLowerCase() == "hi") {
		// const nearby_pokemon = speaker.level.getEntitiesWithin(AABB.CUBE.inflate(4).move(speaker.x, speaker.y, speaker.z)).filterSelector("@n[type=cobblemon:pokemon, nbt={Pokemon:{PokemonOriginalTrainerType:NONE}}]").first
		const traced = speaker.rayTrace()
		/** @type {import("com.cobblemon.mod.common.entity.pokemon.PokemonEntity").$PokemonEntity$$Type} */
		const attacker = traced.entity
		if (attacker?.type == "cobblemon:pokemon" && attacker?.nbt.getCompound("Pokemon").get("PokemonOriginalTrainerType") == "NONE") {
			attacker.cry()
			attacker.lookAt("eyes", speaker.eyePosition)
			speaker.attack(new DamageSource("kubejs:pokemon_greeting", attacker, null), 15)
		}
	}
	else if (message.includes("👍")) {
		let server = event.server
		server.getPlayers().forEach(/** @param {$ServerPlayer} victim */ victim => {
			if ((victim != speaker || server.isSingleplayer()) && victim.inBlockState.hasTag("bubble_cobble:quicksand") && victim.isAdvancementDone("kubejs:step_in_quicksand")) {
				victim.motionY = 5
				victim.hurtMarked = true
				victim.addEffect(MobEffectUtil.of("minecraft:levitation", 2 * SEC))
				victim.addEffect(MobEffectUtil.of("minecraft:slow_falling", 30 * SEC))
				server.scheduleInTicks(3 * MIN, callback => {
					victim.revokeAdvancement("kubejs:step_in_quicksand")
				})
			}
		})
	}
})

ServerEvents.basicPublicCommand("suebegone", event => {
	const invoker = event.entity
	const invoker_pos = invoker.position()
	const bounds = AABB.CUBE.move(invoker_pos.x(), invoker_pos.y(), invoker_pos.z()).inflate(5)
	const nearby_entities = event.level.getEntitiesWithin(bounds)
	nearby_entities.forEach(player => {
		if (player.username != "Mickeon") { // SueTheMimiga
			return
		}

		let push_center = invoker.position()
		if (invoker == player) {
			player.statusMessage = Text.of("\"Hmm... Today I will banish myself.\" 😏")
			player.server.schedule(4 * SECOND, callback => {
				player.statusMessage = Text.of(["↓ ", Text.of("Clueless").gray(), " ↓"]).italic().bold().darkGray()
			})
			for (let i = 0; i < 32; i++) {
				player.server.schedule(8 * SECOND + i * 0.1 * SECOND, callback => {
					player.level.spawnEntity("minecraft:lightning_bolt", entity => {
						entity.setCause(player)
						entity.setPosition(player.block)
						entity.setDamage(0.1)
					})
				})
			}
			return
		}
		const propel_angle = push_center.vectorTo(player.position()).normalize()
		player.addMotion(
			propel_angle.x * 2,
			propel_angle.y * 0.5 + 0.5,
			propel_angle.z * 2
		)
		player.hurtMarked = true
		player.statusMessage = "What"
	})
})

// #region Dashing power.
PlayerEvents.loggedIn(event => {
	if (DASH_STARTERS.includes(event.player.username)) {
		event.player.setAttributeBaseValue("kubejs:dash_jump_count", 1)
	}
	// I know the consequences of this. If the server restarts, you will lose the leniency.
	// But I can't be bothered storing dash data on disk.
	event.player.removeAttribute("minecraft:generic.safe_fall_distance", "kubejs:dash_leniency")
	event.player.removeAttribute("minecraft:generic.safe_fall_distance", "kubejs:powder_snow_leniency")
	event.player.removeAttribute("minecraft:generic.gravity", "kubejs:powder_snow_pause")
})

// https://discord.com/channels/303440391124942858/303440391124942858/1450918369342521548
function DashData() {
	this.last_tick_used = 0
	this.air_time_ticks = 0
	this.jump_count = 0
	this.strength_multiplier = 1.0
	this.restoration = DASH_BASE_RESTORATION
	this.check_landed = null
	this.lower_tiredness = null
}

const DASH_FORCE = 1.0
const DASH_COOLDOWN_TICKS = 10
const DASH_BASE_RESTORATION = 0.0125
const players_dash_data = {}
NetworkEvents.dataReceived("kubejs:dash", event => {
	const player = event.player

	if (!players_dash_data[player.uuid]) {
		players_dash_data[player.uuid] = new DashData()
	}

	/** @type {DashData} */
	const dash = players_dash_data[player.uuid]

	if (player.isSwimming()
	|| player.onGround()
	|| !player.canSprint()
	|| dash.jump_count >= player.getAttributeTotalValue("kubejs:dash_jump_count")
	|| dash.last_tick_used + DASH_COOLDOWN_TICKS > event.server.tickCount
	) {
		return
	}

	const look_angle_compound = event.data.getCompound("angle")
	const look_angle = new Vec3d(
		look_angle_compound.getDouble("x"),
		look_angle_compound.getDouble("y"),
		look_angle_compound.getDouble("z")
	).normalize()

	let forward_back = Math.sign(event.data.getFloat("forward_back"))
	if (forward_back == 0) {
		forward_back = 1
	}

	const dash_strength = DASH_FORCE * dash.strength_multiplier
	player.addDeltaMovement(look_angle.scale(dash_strength * forward_back))
	player.hurtMarked = true
	player.addExhaustion(1.5)
	player.playNotifySound("bubble_cobble:dash", "players",
		remap(dash_strength, 1.0, 0.0, 0.75, 0.1),
		remap(dash_strength, 1.0, 0.0, 1.0, 0.5)
	)
	player.level.spawnParticles("minecraft:white_smoke", false,
		player.x, player.y, player.z,
		0.1, 0.1, 0.1, 10, 0.05
	)
	player.modifyAttribute("minecraft:generic.safe_fall_distance", "kubejs:dash_leniency", 3, "add_value")

	dash.last_tick_used = event.server.tickCount
	dash.jump_count += 1

	if (!dash.check_landed) {
		dash.check_landed = event.server.scheduleRepeatingInTicks(1, () => {
			if (dash.air_time_ticks < 10) {
				player.level.spawnParticles("minecraft:dust_color_transition{from_color:[1.0, 1.0, 1.0], to_color:[1.0, 0.0, 1.0], scale: 2.0}", false,
					player.x, player.y, player.z,
					0.1, 0.1, 0.1, 2, 0.5
				)
				player.resetFallDistance()
			}
			dash.air_time_ticks += 1

			// When fall distance is 0.0, that's the tick after fall damage is processed.
			if (player.fallDistance <= 0.0 && (player.onGround() || player.isSwimming())) {
				dash.jump_count = 0
				dash.air_time_ticks = 0
				player.removeAttribute("minecraft:generic.safe_fall_distance", "kubejs:dash_leniency")

				dash.check_landed.clear()
				delete dash.check_landed
				return
			}
		})
	}

	dash.restoration = DASH_BASE_RESTORATION
	dash.strength_multiplier = Math.max(dash.strength_multiplier - 0.1, 0.25)

	if (!dash.lower_tiredness) {
		dash.lower_tiredness = event.server.scheduleRepeatingInTicks(5, () => {
			if (dash.strength_multiplier >= 1.0) {
				player.playNotifySound("bubble_cobble:recharged", "players", 0.25, 1.0)
				dash.bonus_restoration = 0.0

				dash.lower_tiredness.clear()
				delete dash.lower_tiredness
				return
			}

			if (dash.jump_count <= 0) {
				dash.restoration += 0.0025
				dash.strength_multiplier = Math.min(
					dash.strength_multiplier += dash.restoration,
					1.0
				)
			}
		})
	}
})
// #endregion

ItemEvents.entityInteracted("minecraft:glass_bottle", event => {
	if (event.player && event.target.entityType.hasTag("farmersdelight:horse_feed_users")) {
		if (!event.player.isCreative()) {
			event.item.shrink(1)
		}
		event.player.give("kubejs:horse_urine_bottle")
	}
})

const GIRL_POWER_EFFECT = Registry.of("mob_effect").get("kubejs:girl_power")
if (GIRL_POWER_EFFECT) {
	NativeEvents.onEvent($MobEffectEvent$Added, event => {
		if (event.effectInstance.is(GIRL_POWER_EFFECT)) {
			event.entity.modifyAttribute("kubejs:dash_jump_count", "kubejs:girl_power_effect", event.effectInstance.amplifier + 1, "add_value")
		}
	})

	NativeEvents.onEvent($MobEffectEvent$Expired, event => {
		if (event.effectInstance.is(GIRL_POWER_EFFECT)) {
			event.entity.removeAttribute("kubejs:dash_jump_count", "kubejs:girl_power_effect")
		}
	})

	NativeEvents.onEvent($MobEffectEvent$Remove, event => {
		if (event.effectInstance.is(GIRL_POWER_EFFECT)) {
			event.entity.removeAttribute("kubejs:dash_jump_count", "kubejs:girl_power_effect")
		}
	})
}

function PowderSnowData() {
	this.combo = 0
	this.snow_balls_stored = 0
	this.last_tick_jumped = 0
	this.check_landed = null
	this.delayed_jump = null
	this.reward_loop = null
}
const players_powder_snow_data = {}
PlayerEvents.tick(event => {
	/** @type {$ServerPlayer} */
	const player = event.player
	// if (player.blockStateOn.block != Blocks.POWDER_SNOW) {
	if (!player.isInPowderSnow || player.crouching) {
		return
	}

	if (!players_powder_snow_data[player.uuid]) {
		players_powder_snow_data[player.uuid] = new PowderSnowData()
	}
	/** @type {PowderSnowData} */
	let powder_snow = players_powder_snow_data[player.uuid]
	if (powder_snow.last_tick_jumped + 6 > event.server.tickCount) {
		return
	}

	const level = event.level
	const bounding_box_min = player.boundingBox.minPosition
	const bounding_box_max = player.boundingBox.maxPosition
	const block_pos_around_head = BlockPos.betweenClosed(bounding_box_min.with("y", player.eyeY), bounding_box_max.with("y", player.eyeY + 0.5)).iterator()
	while (block_pos_around_head.hasNext()) {
		let block_pos = block_pos_around_head.next()
		if (level.getBlockState(block_pos).block == Blocks.POWDER_SNOW) {
			return
		}
	}

	BlockPos.betweenClosed(bounding_box_min, bounding_box_max).forEach(block_pos => {
		const block = level.getBlockState(block_pos)
		if (block.block != Blocks.POWDER_SNOW) {
			return
		}

		level.setBlockAndUpdate(block_pos, Blocks.AIR)
		level.spawnEntity("minecraft:falling_block", /** @param {import("net.minecraft.world.entity.item.FallingBlockEntity").$FallingBlockEntity$$Type} falling_block */ falling_block => {
			falling_block.setBlockState(block)
			falling_block.setPos(block_pos.center)
			falling_block.addMotion(0, 0.25, 0)
			falling_block.cancelDrop = true
			level.playLocalSound(block_pos, falling_block.blockState.soundType.fallSound, "blocks", 1.0, 1.0, false)
		})
		powder_snow.snow_balls_stored += 1
	})

	player.setIsInPowderSnow(false)
	player.modifyAttribute("minecraft:generic.gravity", "kubejs:powder_snow_pause", -player.getAttributeValue("minecraft:generic.gravity"), "add_multiplied_base")
	player.motionX = 0.0
	player.motionZ = 0.0
	player.motionY = 0.25
	player.hurtMarked = true

	powder_snow.last_tick_jumped = event.server.tickCount
	powder_snow.combo += 1
	if (!powder_snow.delayed_jump) {
		powder_snow.delayed_jump = level.server.scheduleInTicks(2, () => {
			player.playNotifySound("bubble_cobble:crate_jump", "players", 1.0, 0.75 + powder_snow.combo * 0.05)
			player.removeAttribute("minecraft:generic.gravity", "kubejs:powder_snow_pause")
			player.modifyAttribute("minecraft:generic.safe_fall_distance", "kubejs:powder_snow_leniency", 5, "add_value")
			player.motionY = 1.0
			player.hurtMarked = true
			delete powder_snow.delayed_jump

			if (!powder_snow.reward_loop) {
				powder_snow.reward_loop = level.server.scheduleRepeatingInTicks(3, () => {
					if (powder_snow.snow_balls_stored <= 0) {
						powder_snow.reward_loop.clear()
						delete powder_snow.reward_loop
						return
					}
					powder_snow.snow_balls_stored -= 1
					let snow_ball = Item.of("minecraft:snowball", 1, {max_stack_size: 99})
					let maxed_out_snow_balls_slot = player.inventory.find(/** @param {$ItemStack} item */ item => {
						return item.count == 99 && item.areComponentsEqual(snow_ball)
					})

					if (maxed_out_snow_balls_slot != -1) {
						player.inventory.getStackInSlot(maxed_out_snow_balls_slot).shrink(99)
						player.give("minecraft:totem_of_undying")
						player.playNotifySound("bubble_cobble:life_got", "players", 0.2, 1.0)
					} else {
						player.give(snow_ball)
						player.playNotifySound("bubble_cobble:fruit_collected", "players", 0.2, 1.0)
					}
				})
			}
		})
	}
	if (!powder_snow.check_landed) {
		// Extremely lazy check, it's not that serious.
		powder_snow.check_landed = level.server.scheduleRepeatingInTicks(40, () => {
			if (player.onGround() && player.blockStateOn.block != Blocks.POWDER_SNOW) {
				player.removeAttribute("minecraft:generic.safe_fall_distance", "kubejs:powder_snow_leniency")
				powder_snow.combo = 0
				powder_snow.check_landed.clear()
				delete powder_snow.check_landed
				return
			}
		})
	}
})

// Make ghasts less dangerous.
/** @type {typeof import("net.neoforged.neoforge.event.entity.ProjectileImpactEvent").$ProjectileImpactEvent } */
let $ProjectileImpactEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.ProjectileImpactEvent")
NativeEvents.onEvent($ProjectileImpactEvent, event => {
	if (event.projectile.type != "minecraft:fireball") {
		return
	}
	/** @type {import("net.minecraft.world.entity.projectile.Fireball").$Fireball$$Type} */
	const fireball = event.projectile
	if (fireball.owner.type != "minecraft:ghast") {
		return
	}

	if (event.rayTraceResult.type == "entity") {
		/** @type {$Player} */
		let first_collided_player = fireball.level.getEntitiesWithin(AABB.at(event.rayTraceResult.location)).filterPlayers().first
		if (first_collided_player) {
			first_collided_player.attack(new DamageSource("minecraft:fireball", fireball, fireball.owner), 4)
			first_collided_player.setRemainingFireTicks(60)
			fireball.level.runCommandSilent(`playsound cobblemon:item.berry.eat.full player @a ${fireball.x} ${fireball.y} ${fireball.z} 1.0 1`)
			first_collided_player.give("minecraft:fire_charge")
			if (Math.random() < 0.25) {
				fireball.level.runCommandSilent(`playsound kubejs:advancement.mint_chewed player @a ${fireball.x} ${fireball.y} ${fireball.z} 1.0 1`)
			}
		}

	} else {
		fireball.level.runCommandSilent(`playsound create:chiff player @a ${fireball.x} ${fireball.y} ${fireball.z} 1.0 ${0.9 + Math.random() * 0.2}`)
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

// Debug.
// ServerEvents.tick(event => {
// 	event.server.mcPlayers.forEach(player => {
// 		// if (player.mainHandItem) {
// 		// 	player.statusMessage = player.mainHandItem.getUseDuration(player)
// 		// }
// 		// player.statusMessage = dash_data[player.uuid]?.strength_multiplier
// 		player.statusMessage = dash_data[player.uuid]?.jump_count
// 	})
// })

///** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerEvent$ItemCraftedEvent").$PlayerEvent$ItemCraftedEvent } */
//let $PlayerEvent$ItemCraftedEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerEvent$ItemCraftedEvent")
// NativeEvents.onEvent($PlayerEvent$ItemCraftedEvent, event => {
// 	if (event.getCrafting().id == "minecraft:crafting_table") {
// 		event.entity.statusMessage = "What"
// 		event.entity.addMotion(0, 5, 0)
// 		event.entity.hurtMarked = true
// 	}
// })