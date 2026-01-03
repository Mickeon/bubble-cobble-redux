// requires: cobblemon
// requires: create
// /** @type {typeof import("dev.latvian.mods.kubejs.script.data.GeneratedDataStage").$GeneratedDataStage } */
// let $GeneratedDataStage  = Java.loadClass("dev.latvian.mods.kubejs.script.data.GeneratedDataStage")
/** @type {typeof import("net.minecraft.world.entity.player.Player").$Player } */
let $Player  = Java.loadClass("net.minecraft.world.entity.player.Player")
/** @type {typeof import("dev.latvian.mods.kubejs.item.FoodBuilder").$FoodBuilder } */
let $FoodBuilder  = Java.loadClass("dev.latvian.mods.kubejs.item.FoodBuilder")

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
	&& player.username == "AceNil_"
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

PlayerEvents.decorateChat(event => {
	const {player, message} = event
	if (message.trim().toLowerCase() == "hi") {
		// const nearby_pokemon = player.level.getEntitiesWithin(AABB.CUBE.inflate(4).move(player.x, player.y, player.z)).filterSelector("@n[type=cobblemon:pokemon, nbt={Pokemon:{PokemonOriginalTrainerType:NONE}}]").first
		/** @type {import("com.cobblemon.mod.common.entity.pokemon.PokemonEntity").$PokemonEntity$$Type} */
		const traced = player.rayTrace()
		const attacker = traced.entity
		if (attacker?.type == "cobblemon:pokemon" && attacker?.nbt.getCompound("Pokemon").get("PokemonOriginalTrainerType") == "NONE") {
			attacker.cry()
			attacker.lookAt("eyes", player.eyePosition)
			player.attack(new DamageSource("kubejs:pokemon_greeting", attacker, null), 15)
		}
	}
})

ServerEvents.basicPublicCommand("suebegone", event => {
	const invoker = event.entity
	const bounds = AABB.CUBE.move(invoker.position()).inflate(5)
	const nearby_entities = event.level.getEntitiesWithin(bounds)
	nearby_entities.forEach(player => {
		if (!(player instanceof $Player || player.username == "SueTheMimiga")) { // SueTheMimiga
			return
		}

		let push_center = invoker.position()
		if (invoker == player) {
			let nearby_armor_stand = nearby_entities.filterType("minecraft:armor_stand").first
			if (nearby_armor_stand) {
				push_center = nearby_armor_stand.position()
			} else {
				player.statusMessage = Text.of("\"Hmm... Today I will banish myself.\" 😏")
				player.server.schedule(4 * SECOND, callback => {
					player.statusMessage = Text.of(["↓ ", Text.of("Clueless").gray(), " ↓"]).italic().bold().darkGray()
				})
				player.server.schedule(8 * SECOND, callback => {
					player.level.spawnEntity("minecraft:lightning_bolt", entity => {
						entity.setPosition(player.block)
					})
				})
				return
			}
		}
		const propel_angle = push_center.vectorTo(player.position()).normalize()
		player.addMotion(
			propel_angle.x * 2,
			propel_angle.y * 0.5,
			propel_angle.z * 2
		)
		player.hurtMarked = true
		player.statusMessage = "What"
	})
})

PlayerEvents.loggedIn(event => {
	if (DASH_STARTERS.includes(event.player.username)) {
		event.player.setAttributeBaseValue("kubejs:dash_jump_count", 1)
	}
	// I know the consequences of this. If the server restarts, you will lose the leniency.
	// But I can't be bothered storing dash data on disk.
	event.player.removeAttribute("minecraft:generic.safe_fall_distance", "kubejs:dash_leniency")
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
	|| player.foodLevel <= 6
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
				player.playNotifySound("bubble_cobble:recharged", "players", 1.0, 1.0)
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