// requires: cobblemon
// requires: create
/** @type {typeof import("net.minecraft.world.entity.ai.targeting.TargetingConditions").$TargetingConditions } */
let $TargetingConditions  = Java.loadClass("net.minecraft.world.entity.ai.targeting.TargetingConditions")
/** @type {typeof import("virtuoel.pehkui.api.ScaleTypes").$ScaleTypes } */
let $ScaleTypes  = Java.loadClass("virtuoel.pehkui.api.ScaleTypes")
// https://github.com/Virtuoel/Pehkui/blob/neoforge/1.21/src/main/java/virtuoel/pehkui/api/ScaleEasings.java
/** @type {typeof import("virtuoel.pehkui.api.ScaleEasings").$ScaleEasings } */
let $ScaleEasings  = Java.loadClass("virtuoel.pehkui.api.ScaleEasings")
/** @type {typeof import("net.neoforged.neoforge.event.entity.EntityMobGriefingEvent").$EntityMobGriefingEvent } */
let $EntityMobGriefingEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.EntityMobGriefingEvent")
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
	const cooked_pokemon_egg = Item.of("farmersdelight:fried_egg", {"minecraft:custom_data": {was_pokemon_egg: true}, "minecraft:rarity": "uncommon"})
	event.smelting(cooked_pokemon_egg, "cobbreeding:pokemon_egg", 5)
	event.smoking(cooked_pokemon_egg, "cobbreeding:pokemon_egg", 2.5)
	event.campfireCooking(cooked_pokemon_egg, "cobbreeding:pokemon_egg", 5)

	event.shaped("kubejs:super_ghostbusters", [" T ", "TMT", " T "], {T: "mega_showdown:ghost_tera_shard", M: "cobblemon:moon_stone"})
	event.shaped(Item.of("biomeswevegone:rose", 16), ["RR", "RR"], {R: "minecraft:rose_bush"})
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
	play_sound_at_entity(entity, "minecraft:entity.llama.spit", "players")

	const player = event.player
	if (player && event.item.id == "biomeswevegone:fluorescent_cattail_sprout") {
		player.addEffect(MobEffectUtil.of("minecraft:glowing", 3 * SEC))
		player.drop("minecraft:glowstone_dust", false)
	}
})
ItemEvents.foodEaten("kubejs:super_ghostbusters", event => {
	event.level.runCommandSilent(`enhancedcelestials setLunarEvent bubble_cobble:ghostbusters`)
	event.player.playNotifySound("supplementaries:block.jar.break", "players", 1, 0.5)
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

ItemEvents.firstRightClicked(["minecraft:raw_copper"], event => {
	const player = event.player
	if (player
	&& player.username == "CantieLabs"
	&& !player.crouching
	) { // CantieLabs
		const item_stack = event.item
		item_stack.food = new $FoodBuilder().nutrition(3).alwaysEdible().build()
		item_stack.lore = Text.of(`Yummy!`)
	}
})

// #region Bearded Dragon Logic.
if (Item.exists("kubejs:bearded_dragon_bowl")) {
	/** @readonly */ let BeardedDragon = {
		Quotes: {
			USE: [
				"you can do it!",
				"am ok! ❤",
				"yippie!",
				"oh!",
				"hehe",
				"wow...",
				"yip!",
				"am soup",
				"love you!",
			],
			GREETING: [
				"helo!",
				"good morning!",
			],
			GOODBYE: [
				"goo bye",
				"weee!",
			],
		},
		speak: function(to_player, display_name, quote) {
			const name = display_name.getString().replace("[", "").replace("]", "")
			to_player.tell([Text.yellow(name + " : "), quote])
		}
	}
	ItemEvents.rightClicked("kubejs:bearded_dragon_bowl", event => {
		const player = event.player
		const level = event.level
		const item_stack = event.item
		if (!event.player || event.level.isClientSide()) {
			return
		}

		const chosen_quote = pick_random(BeardedDragon.Quotes.USE)
		BeardedDragon.speak(player, item_stack.displayName, chosen_quote)

		play_sound_at_entity(player, "kubejs:item.bearded_dragon_chirp", "players", 1.0, 1.25 + 0.25 * Math.random())
		player.addItemCooldown(item_stack.item, 10)
		player.potionEffects.add("farmersdelight:comfort", 20, 1)
	})

	ItemEvents.pickedUp("kubejs:bearded_dragon_bowl", event => {
		if (!event.entity.isPlayer()) {
			return
		}
		BeardedDragon.speak(event.entity, event.item.displayName, pick_random(BeardedDragon.Quotes.GREETING))
	})

	ItemEvents.dropped("kubejs:bearded_dragon_bowl", event => {
		if (!event.entity.isPlayer()) {
			return
		}
		BeardedDragon.speak(event.entity, event.item.displayName, pick_random(BeardedDragon.Quotes.GOODBYE))

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
	/** @type {string} */
	const message = event.message
	if (message.toLowerCase() == "hi") {
		// const nearby_pokemon = speaker.level.getEntitiesWithin(AABB.CUBE.inflate(4).move(speaker.x, speaker.y, speaker.z)).filterSelector("@n[type=cobblemon:pokemon, nbt={Pokemon:{PokemonOriginalTrainerType:NONE}}]").first
		let traced = speaker.rayTrace()
		/** @type {import("com.cobblemon.mod.common.entity.pokemon.PokemonEntity").$PokemonEntity$$Type} */
		let attacker = traced.entity
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
				speaker.unlockAdvancement("kubejs:help_for_quicksand")
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
	const nearby_entities = event.level.getEntitiesWithin(bounds).oneFilter(e => e.username == "SueTheMimiga")
	nearby_entities.forEach(player => {
		const push_center = invoker.position()
		if (invoker == player) {
			player.statusMessage = Text.of(`"Hmm... Today I will banish myself." 😏`)
			player.server.schedule(4 * SECOND, callback => {
				player.statusMessage = Text.of(["↓ ", Text.of(`Clueless`).gray(), " ↓"]).italic().bold().darkGray()
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
	const player = /** @type {$ServerPlayer} */ (event.player)
	if (DASH_STARTERS.includes(player.username)) {
		player.setAttributeBaseValue("kubejs:dash_jump_count", 1)
	}
	// I know the consequences of this. If the server restarts, you will lose the leniency.
	// But I can't be bothered storing dash data on disk.
	player.removeAttribute("minecraft:generic.safe_fall_distance", "kubejs:dash_leniency")
	player.removeAttribute("minecraft:generic.safe_fall_distance", "kubejs:powder_snow_leniency")
	player.removeAttribute("minecraft:generic.gravity", "kubejs:powder_snow_pause")

	player.revokeAdvancement("kubejs:step_in_quicksand")
})

// https://discord.com/channels/303440391124942858/303440391124942858/1450918369342521548
function DashData() {
	this.last_tick_used = 0
	this.air_time_ticks = 0
	this.jump_count = 0
	this.strength_multiplier = 1.0
	this.restoration = DASH_BASE_RESTORATION
	this.check_landed = /** @type {$ScheduledEvents$ScheduledEvent?} */ (null)
	this.lower_tiredness = /** @type {$ScheduledEvents$ScheduledEvent?} */ (null)
}

const DASH_FORCE = 1.0
const DASH_COOLDOWN_TICKS = 10
const DASH_BASE_RESTORATION = 0.0125
/** @param {$UUID} uuid @returns {DashData} */
DashData.get_or_create = function(uuid) {
	if (!players_dash_data[uuid]) {
		players_dash_data[uuid] = new DashData()
	}
	return players_dash_data[uuid]
}
const players_dash_data = {}
NetworkEvents.dataReceived("kubejs:dash", event => {
	const player = event.player
	const dash = DashData.get_or_create(player.uuid)

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
	play_sound_at_entity(player, "bubble_cobble:dash", "players",
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
		if (event.effectInstance && event.effectInstance.is(GIRL_POWER_EFFECT)) {
			event.entity.modifyAttribute("kubejs:dash_jump_count", "kubejs:girl_power_effect", event.effectInstance.amplifier + 1, "add_value")
		}
	})

	NativeEvents.onEvent($MobEffectEvent$Expired, event => {
		if (event.effectInstance && event.effectInstance.is(GIRL_POWER_EFFECT)) {
			event.entity.removeAttribute("kubejs:dash_jump_count", "kubejs:girl_power_effect")
		}
	})

	NativeEvents.onEvent($MobEffectEvent$Remove, event => {
		if (event.effectInstance && event.effectInstance.is(GIRL_POWER_EFFECT)) {
			event.entity.removeAttribute("kubejs:dash_jump_count", "kubejs:girl_power_effect")
		}
	})

	/**
	 * @import {$PokemonEntity} from "com.cobblemon.mod.common.entity.pokemon.PokemonEntity"
	 */

	ItemEvents.entityInteracted("minecraft:potion", event => {
		if (event.target.type != "cobblemon:pokemon") {
			return
		}

		const pokemon_entity = /** @type {$PokemonEntity} */ (event.target)
		const pokemon = pokemon_entity.pokemon
		const item = event.item
		const player = event.entity

		const current_contents = /** @type {$PotionContents} */ (item.getComponents().get("minecraft:potion_contents"))
		if (!current_contents.is("kubejs:girl_power")) {
			return
		}

		// Try to change gender.
		const previous_gender = pokemon.gender
		pokemon.gender = pokemon.gender == "female" ? "male" : "female"
		if (pokemon.gender == previous_gender) {
			// Either genderless or limited. Either way, nothing changed.
			player.playNotifySound("bubble_cobble:buzz", "players", 1.0, 1.0)
			return
		}

		if (!player.isCreative()) {
			item.consume(1, pokemon_entity)
		}

		pokemon_entity.playSound("bubble_cobble:life_got", 0.25, 1.0)
		pokemon_entity.playAmbientSound()

		const is_male_to_female = pokemon.gender == "female"
		const from_color = is_male_to_female ? "[0.8, 0.8, 1.0]" : "[1.0, 0.8, 1.0]"
		const to_color = is_male_to_female ? "[1.0, 0.0, 1.0]" : "[0.0, 0.1, 1.0]"
		const particle_box = pokemon_entity.boundingBox.deflate(0.5)
		pokemon_entity.level.spawnParticles(`minecraft:dust_color_transition{from_color:${from_color}, to_color:${to_color}, scale: 3.0}`, false,
			particle_box.center.x(), particle_box.center.y(), particle_box.center.z(),
			particle_box.xsize, particle_box.ysize, particle_box.zsize, 40, 0.5
		)

		event.success()
	})
}

function PowderSnowData() {
	this.combo = 0
	this.snow_balls_stored = 0
	this.last_tick_jumped = 0
	this.check_landed = /** @type {$ScheduledEvents$ScheduledEvent?} */ (null)
	this.delayed_jump = /** @type {$ScheduledEvents$ScheduledEvent?} */ (null)
	this.reward_loop = /** @type {$ScheduledEvents$ScheduledEvent?} */ (null)
}
/** @param {$UUID} uuid @returns {PowderSnowData} */
PowderSnowData.get_or_create = function(uuid) {
	if (!players_powder_snow_data[uuid]) {
		players_powder_snow_data[uuid] = new PowderSnowData()
	}
	return players_powder_snow_data[uuid]
}
const players_powder_snow_data = {}
PlayerEvents.tick(event => {
	const player = /** @type {$ServerPlayer} */ (event.player)
	// if (player.blockStateOn.block != Blocks.POWDER_SNOW) {
	if (!player.isInPowderSnow || player.crouching) {
		return
	}

	const powder_snow = PowderSnowData.get_or_create(player.uuid)
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
			play_sound_at_entity(player, "bubble_cobble:crate_jump", "players", 1.0, 0.75 + powder_snow.combo * 0.05)
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
					let maxed_out_snow_balls_slot = player.inventory.find(item => {
						return item.count == 99 && item.areComponentsEqual(snow_ball)
					})

					if (maxed_out_snow_balls_slot != -1) {
						player.inventory.getStackInSlot(maxed_out_snow_balls_slot).shrink(99)
						player.give("minecraft:totem_of_undying")
						player.playNotifySound("bubble_cobble:life_got", "players", 0.2, 1.0)
					} else {
						player.give(snow_ball)
						player.playNotifySound("bubble_cobble:fruit_collected", "blocks", 0.2, 1.0)
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

// Craftable Roses from Rose Bushes, but... owch.
/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerEvent$ItemCraftedEvent").$PlayerEvent$ItemCraftedEvent } */
let $PlayerEvent$ItemCraftedEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerEvent$ItemCraftedEvent")
NativeEvents.onEvent($PlayerEvent$ItemCraftedEvent, event => {
	if (event.crafting.id == "biomeswevegone:rose" && event.inventory.countItem("minecraft:rose_bush")) {
		let entity = event.entity
		entity.attack(new DamageSource("biomesoplenty:bramble", entity, entity, entity.position().add(entity.forward)), 1)
		entity.addMotion(0, 0.1, 0)
		entity.hurtMarked = true
		entity.statusMessage = "Ow my hand"
	}
})
