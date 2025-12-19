// requires:cobblemon
// requires:create
// /** @type {typeof import("dev.latvian.mods.kubejs.script.data.GeneratedDataStage").$GeneratedDataStage } */
// let $GeneratedDataStage  = Java.loadClass("dev.latvian.mods.kubejs.script.data.GeneratedDataStage")
/** @type {typeof import("net.minecraft.world.entity.player.Player").$Player } */
let $Player  = Java.loadClass("net.minecraft.world.entity.player.Player")
/** @type {typeof import("dev.latvian.mods.kubejs.item.FoodBuilder").$FoodBuilder } */
let $FoodBuilder  = Java.loadClass("dev.latvian.mods.kubejs.item.FoodBuilder")

ServerEvents.recipes(event => {
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
			CreateItem.of("2x " + "minecraft:light_blue_dye"),
			CreateItem.of("2x " + "minecraft:light_blue_dye", 0.5)
		],
		"kubejs:blue_mascot_cat"
	)
	event.recipes.create.milling([
			CreateItem.of("2x " + "minecraft:light_blue_dye"),
			CreateItem.of("2x " + "minecraft:light_blue_dye", 0.5)
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

// Funny Sopping Wet Thing thing.
ItemEvents.entityInteracted("create:wrench",  event => {
	const target = event.target
	const player = event.entity
	if (target.type != "minecraft:player" || target.username != "Mickeon" || !player.shiftKeyDown) {
		return
	}
	player.addItemCooldown(event.item.getItem(), 120 * 20)
	player.give("kubejs:blue_mascot_cat")
	const spawn_position = player.server.getOverworld().sharedSpawnPos
	player.teleportTo("minecraft:overworld", spawn_position.x, spawn_position.y, spawn_position.y, player.yaw, player.pitch)
})

ItemEvents.firstRightClicked("create_bic_bit:mayonnaise_bucket", event => {
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

ItemEvents.firstRightClicked("minecraft:raw_copper", event => {
	const player = event.player
	if (player
	&& player.username == "CantieLabs"
	&& !player.crouching
	) { // CantieLabs
		const item_stack = event.item
		item_stack.food = new $FoodBuilder().nutrition(1).alwaysEdible().build()
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
		if (!event.player || event.level.clientSide) {
			return
		}

		const chosen_quote = pick_random(BEARDED_QUOTES)
		bearded_dragon_speak(player, item_stack.displayName, chosen_quote)

		// Usual server jank because playNotifySound doesn't want to work with the bubble_cobble sounds.
		level.runCommandSilent(`execute as ${player.uuid} at ${player.uuid} run playsound kubejs:item.bearded_dragon_chirp player @a ~ ~ ~ 1.0 ${1.25 + 0.25 * Math.random()}`)
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
		event.entity.server.scheduleRepeatingInTicks(20, callback => {
			if (item_entity.isRemoved()) {
				callback.clear()
				return
			}
			// Utils.server.tell(item_entity)
			item_entity.server.runCommandSilent(`execute as ${item_entity.uuid} at ${item_entity.uuid} run playsound kubejs:item.bearded_dragon_chirp player @a ~ ~ ~ 0.1 ${1.25 + 0.25 * Math.random()}`)
			callback.timer = 40 + 40 * Math.random()
		})
	})
}

function bearded_dragon_speak(to_player, display_name, quote) {
	const name = display_name.getString().replace("[", "").replace("]", "")
	to_player.tell(Text.empty().append(Text.yellow(name + " : ")).append(quote))
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
	let {player, message, server, component} = event
	if (message.trim().toLowerCase() == "hi") {
		player.runCommandSilent("damage @s 20 kubejs:pokemon_greeting by @n[type=cobblemon:pokemon, nbt={Pokemon:{PokemonOriginalTrainerType:NONE}}, distance=..4]")
	}
})

ServerEvents.basicPublicCommand("suebegone", event => {
	const invoker = event.entity
	const bounds = AABB.CUBE.move(invoker.x, invoker.y, invoker.z).inflate(5)
	const nearby_entities = event.level.getEntitiesWithin(bounds)
	nearby_entities.forEach(player => {
		if (!(player instanceof $Player || player.username == "Mickeon")) { // SueTheMimiga
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

const DASH_FORCE = 1.0
const DASH_JUMP_LIMIT = 2
const DASH_COOLDOWN_TICKS = 10
const dash_data = {}
NetworkEvents.dataReceived("kubejs:trans_dash", event => {
	const player = event.player

	if (!dash_data[player.uuid]) {
		dash_data[player.uuid] = {
			last_tick_used: 0,
			strength_multiplier: 1.0,
			remaining: DASH_JUMP_LIMIT
		}
	}
	const dash = dash_data[player.uuid]

	if (player.isSwimming()
	|| player.onGround()
	|| player.foodLevel <= 6
	|| !dash.remaining > 0
	|| dash.last_tick_used + DASH_COOLDOWN_TICKS > event.server.tickCount
	) {
		// player.playNotifySound("supplementaries:block.crank", "players", 1.0, 1.0)
		return
	}
	// player.statusMessage = dash?.lower_tiredness

	const look_angle_compound = event.data.getCompound("angle")
	const look_angle = new Vec3d(
		look_angle_compound.getDouble("x"),
		look_angle_compound.getDouble("y"),
		look_angle_compound.getDouble("z")
	).normalize()

	const dash_strength = DASH_FORCE * dash.strength_multiplier
	player.addDeltaMovement(look_angle.scale(dash_strength))
	player.hurtMarked = true
	player.addExhaustion(2.5)
	// player.playNotifySound("supplementaries:block.present.fall", "players", 1.0, 1.0)
	player.playNotifySound("bubble_cobble:dash", "players",
		remap(dash_strength, 1.0, 0.0, 0.75, 0.1),
		remap(dash_strength, 1.0, 0.0, 1.0, 0.5)
	)
	player.level.spawnParticles("minecraft:white_smoke",
	// player.level.spawnParticles("minecraft:dust_color_transition{from_color:[1.0, 1.0, 1.0], to_color:[1.0, 0.0, 1.0], scale: 2.0}",
		false, player.x, player.y, player.z,
		0.1, 0.1, 0.1, 10, 0.05)

	dash.last_tick_used = event.server.tickCount

	dash.remaining -= 1
	if (!dash.check_landed) {
		dash.check_landed = event.server.scheduleRepeatingInTicks(1, () => {
			player.level.spawnParticles("minecraft:dust_color_transition{from_color:[1.0, 1.0, 1.0], to_color:[1.0, 0.0, 1.0], scale: 2.0}",
				false, player.x, player.y, player.z,
				0.1, 0.1, 0.1, 2, 0.5)
			if (player.onGround() || player.isSwimming()) {
				dash.remaining = DASH_JUMP_LIMIT

				dash.check_landed.clear()
				delete dash.check_landed
				return
			}
		})
	}

	dash.strength_multiplier *= 0.75
	if (!dash.lower_tiredness) {
		dash.lower_tiredness = event.server.scheduleRepeatingInTicks(5, () => {
			if (dash.strength_multiplier >= 1.0) {
				player.playNotifySound("minecraft:block.bubble_column.bubble_pop", "players", 1.0, 1.0)

				dash.lower_tiredness.clear()
				delete dash.lower_tiredness
				return
			}

			if (player.onGround() || player.isSwimming()) {
				dash.strength_multiplier = Math.min(
					dash.strength_multiplier * 1.025,
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
// 		// player.statusMessage = dash_data[player.uuid]?.lower_tiredness.endTime
// 		player.statusMessage = dash_data[player.uuid]?.strength_multiplier
// 	})
// })

function remap(value, min1, max1, min2, max2) {
	let value_norm = (value - min1) / (max1 - min1) // Inverse linear interpolation function.
	return min2 + (max2-min2) * value_norm // Linear interpolation function.
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max)
}

/** @param {Array} array @returns {string} */
function pick_random(array) {
	return array[Math.floor(Math.random() * array.length)]
}
