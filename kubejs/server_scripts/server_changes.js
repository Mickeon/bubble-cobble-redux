// priority: 10
// requires: create
// requires: monsterplus

// The End check.
EntityEvents.spawned("minecraft:player", event => {
	const { player, server } = event
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

// Nerf players carrying heavy storage considerably.
ServerEvents.tags("block", event => {
	event.add("bubble_cobble:no_fast_travel_when_carrying",
		/sophisticatedstorage:.*(chest|barrel)/,
		"#lootr:containers",
		"gravestone:gravestone"
	)
	// This is for later, container sounds.
	event.add("bubble_cobble:handcrafted_containers",
		"#handcrafted:cupboards",
		"#handcrafted:drawers",
		"#handcrafted:desks",
		"#handcrafted:side_tables",
		"#handcrafted:nightstands" ,
		"#handcrafted:counters",
		"#handcrafted:shelves",
	)
})

ServerEvents.tick(event => {
	event.server.mcPlayers.forEach(player => {
		if (!player.carryOnData.carrying) {
			return
		}

		// CarryOn really does not like it when we check the `block` property without carrying a block.
		// So we check it like this.
		if (player.carryOnData.nbt.getString("type") != "BLOCK") {
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
	const food_properties = stack.getFoodProperties(player)
	if (!food_properties) {
		return // Forced to eat something inedible?
	}
	const eat_time_ticks = food_properties.eatDurationTicks()
	// player.statusMessage = eat_time_ticks

	player.addItemCooldown(stack, MINECRAFT_EAT_TIME_TICKS - eat_time_ticks)
})


if (Item.exists("herbalbrews:flask")) {
	/** @type {typeof import("net.minecraft.world.item.alchemy.PotionContents").$PotionContents } */
	let $PotionContents  = Java.loadClass("net.minecraft.world.item.alchemy.PotionContents")

	// Fix HerbalBrews Flask's potion effects duration being wrong. It should be 20 times the duration.
	// Does not fix the tooltip, which will show an absurd duration. Rectify that with a stupid hack.
	ItemEvents.rightClicked("herbalbrews:flask", event => {
		if (!event.item.customData.getBoolean("kubejs:fixed")) {
			event.item.customData.putBoolean("kubejs:fixed", true)
			event.item.setLore([
				Text.of("You probably tried drinking this.").darkGray(),
				Text.of("It doesn't last as long as it says,").darkGray(),
				Text.of("but it still is a lot. Forgive me").darkGray()
			])

			/** @type {import("net.minecraft.world.item.alchemy.PotionContents").$PotionContents$$Original} */
			let current_contents = event.item.getComponentMap().get("minecraft:potion_contents")
			let modified_effects = Utils.newList()
			current_contents.customEffects().forEach(effect => {
				modified_effects.add(MobEffectUtil.of(effect.effect, effect.duration * 20))
			})

			let new_contents = new $PotionContents(current_contents.potion(), current_contents.customColor(), modified_effects)
			event.item.setPotionContents(new_contents)
		}
	})
}

// Custom sound when opening HandCrafted's containers.
// TODO: Expand to include more generic containers?
PlayerEvents.chestOpened("minecraft:generic_9x3", event => {
	if (event.block && event.block.hasTag("bubble_cobble:handcrafted_containers")) {
		// event.player.playNotifySound("relics:ability_locked", "players", 1, 1)
		event.player.playNotifySound("create:blaze_munch", "players", 0.25, 2.0)
	}
})


// Do not ever spawn Slimes or Bats naturally in Flat World.
const NO_FLAT_WORLD_MOBS = ["minecraft:slime", "minecraft:bat"]
NO_FLAT_WORLD_MOBS.forEach(entity_type => {
	EntityEvents.checkSpawn(entity_type, event => {
		if (event.server.worldData.isFlatWorld() && event.type != "SPAWN_EGG") {
			event.cancel()
		}
	})
})

/** @type {Special.EntityType[]} */
const NO_NIGHT_LIGHT_MOBS = [
	// Basically all undead.
	"cnc:wechuge",
	"cnc:wendigo",
	"minecraft:bogged",
	"minecraft:drowned",
	"minecraft:husk",
	"minecraft:phantom",
	"minecraft:skeleton",
	"minecraft:skeleton_horse",
	"minecraft:stray",
	"minecraft:wither",
	"minecraft:wither_skeleton",
	"minecraft:zoglin",
	"minecraft:zombie",
	"minecraft:zombie_horse",
	"minecraft:zombie_villager",
	"minecraft:zombified_piglin",
	"monsterplus:ancient_hero",
	"monsterplus:ancient_hero_skull",
	"monsterplus:crystal_zombie",
	"monsterplus:demon_eye",
	"monsterplus:glow_skeleton",
	"monsterplus:opalescent_eye",
	"monsterplus:spectral_skeleton",
	"monsterplus:spectral_skull",
	"monsterplus:swamp_zombie",
	"monsterplus:overgrown_skeleton",
	// Among others.
	"minecraft:creeper",
	"minecraft:witch",
	"monsterplus:abyssologer",
]
NO_NIGHT_LIGHT_MOBS.forEach(entity_type => {
	EntityEvents.checkSpawn(entity_type, event => {
		if (event.block.getSkyLight() >= 1 && event.type == "NATURAL") {
			// console.log(`Trying to spawn ${event.entity.type}, but can't under the moon light!`)
			event.cancel()
		}
	})
})

// After the above changes, a lot of Endermen spawn on the surface. Rectify that.
const FEWER_NIGHT_LIGHT_MOBS = ["minecraft:enderman", "minecraft:spider", "monsterplus:ender_eye", "monsterplus:wisp"]
FEWER_NIGHT_LIGHT_MOBS.forEach(entity_type => {
	EntityEvents.checkSpawn(entity_type, event => {
		if (event.block.getSkyLight() >= 1 && event.type == "NATURAL" && Utils.getRandom().nextFloat() > 0.5) {
			// console.log(`Trying to spawn ${event.entity.type}, but chance said no!`)
			event.cancel()
		}
	})
})

// No baby zombies, unless Chicken Jockey?
EntityEvents.checkSpawn("minecraft:zombie", event => {
	/** @type {import("net.minecraft.world.entity.monster.Zombie").$Zombie$$Type} */
	const zombie = event.entity
	if (zombie.baby && zombie.controlledVehicle?.id != "minecraft:chicken" && event.type != "SPAWN_EGG") {
		event.cancel()
	}
})

// Turn links in chat into embedded ones, as far as the Discord Chat integration is concerned.
// https://email-files.fangamer.com/list_48/campaign_15/queen_shimmying-tOYeHM9diwN8AaSH.gif
PlayerEvents.decorateChat(event => {
	const message = event.message

	// EXTREMELY rudimentary.
	if (message.includes("http") && !message.includes("(http")) {
		const regex = /https?:\/\/\S+/g

		event.component = String(message).replace(regex, "[Image]($&)")
	}
})


// Some items don't abide by the Mending Reworked balance. Let's have them to, albeit jankily.
// Use Diamonds instead of Netherite Ingots to repair Netherite tools.
ServerEvents.tags("item", event => {
	event.add("bubble_cobble:netherite_diamond_repairable",
		"constructionstick:netherite_stick",
		"yo_hooks:netherite_grappling_hook",
	)
})

/** @type {typeof import("net.neoforged.neoforge.event.AnvilUpdateEvent").$AnvilUpdateEvent } */
let $AnvilUpdateEvent  = Java.loadClass("net.neoforged.neoforge.event.AnvilUpdateEvent")
NativeEvents.onEvent($AnvilUpdateEvent, event => {
	const { left, right } = event

	if (left.hasTag("bubble_cobble:netherite_diamond_repairable") && right.id == "minecraft:netherite_ingot") {
		event.setCanceled(true)
	}

	if (left.hasTag("bubble_cobble:netherite_diamond_repairable") &&
		(right.id == "minecraft:diamond"
		|| right.id == "minecraft:netherite_scrap")
	) {
		if (left.damageValue <= 0) {
			event.setCanceled(true)
		}
		const output = left.copy()
		const repair_amount = Math.floor(output.maxDamage * 0.33)
		const new_damage = Math.max(output.damageValue - repair_amount, 0)
		output.damageValue = new_damage
		event.cost = 1
		event.materialCost = 1
		event.output = output
	}
})


ServerEvents.tags("item", event => {
	event.add("bubble_cobble:lanterns", "minecraft:lantern", "#minecraft:lanterns", "ribbits:swamp_lantern")
	event.add("bubble_cobble:do_not_replace_when_in_offhand", [
		"#bubble_cobble:lanterns",
		"#minecraft:candles",
		"#supplementaries:candle_holders"
	])
})

// Replace destroyed blocks with the blocks in your offhand
/** @type {typeof import("net.minecraft.world.item.context.UseOnContext").$UseOnContext } */
let $UseOnContext  = Java.loadClass("net.minecraft.world.item.context.UseOnContext")
/** @type {typeof import("net.minecraft.world.phys.BlockHitResult").$BlockHitResult } */
let $BlockHitResult  = Java.loadClass("net.minecraft.world.phys.BlockHitResult")
BlockEvents.broken(event => {
	const player = event.player
	if (!player) {
		console.warn("No player for BlockEvents.broken(). This should never normally happer.")
		return
	}
	const held_item = player.offHandItem
	const held_block = held_item.block
	if (!held_block) {
		return
	}

	const level = event.level
	const broken_block = event.block.getBlock()
	if (held_item.id == broken_block?.item?.id) {
		return // Don't replace the block I just destroyed with the same block I am holding.
	}

	const broken_block_state = event.block.getBlockState()
	const broken_block_pos = event.block.getPos()
	// console.log(broken_block_state.getDestroySpeed(level, broken_block_pos))
	if (broken_block_state.getDestroySpeed(level, broken_block_pos) <= 0.1) {
		// Don't replace blocks that break instantaneously.
		// These usually include grass, torches, etc., or blocks whose destruction may be accidental.
		return
	}
	if (held_block.defaultBlockState().getDestroySpeed(level, broken_block_pos) <= 0.1) {
		// And don't let any block that would be broken instantly do the replacing.
		// These usually include grass, torches, etc., or blocks whose placement may be accidental.
		return
	}
	if (held_item.hasTag("bubble_cobble:do_not_replace_when_in_offhand")) {
		return
	}

	level.server.scheduleInTicks(0, callback => {
		if (!level.getBlock(broken_block_pos).hasTag("minecraft:air")) {
			// Failsafe to not place blocks accidentally in front/back.
			player.playNotifySound("bubble_cobble:buzz", "players", 1.0, 1.0)
			return
		}

		let interaction_result = held_item.useOn(new $UseOnContext(
			level, player, "off_hand", held_item, new $BlockHitResult(
					player.position(), player.facing, broken_block_pos, false
			)
		))
		if (held_block) {
			let sound_type = held_block.getSoundType(held_block.defaultBlockState(), level, broken_block_pos, player)
			// level.playSound(player, broken_block_pos, sound_type.placeSound, "blocks")

			if (interaction_result.indicateItemUse()) {
				player.playNotifySound(sound_type.placeSound, "blocks", 1.0, 1.0)
			}
		} else {
			console.warn(`Somehow held block for item ${held_item.id} is null. Investigate?`)
		}
		if (interaction_result.shouldSwing()) {
			level.server.scheduleInTicks(3, callback => {
				player.swing("off_hand", true)
			})
		}
		// player.swing("off_hand", true)
		// Block.getBlock().stateDefinition.
		// held_item.block.invokeGetSoundType("handcrafted:acacia_bench").placeSound
	})
	// event.level.setBlock()

})


// Teleport players hit by the Warden to their spawn point.
/** @type {typeof import("net.minecraft.world.level.portal.DimensionTransition").$DimensionTransition } */
let $DimensionTransition  = Java.loadClass("net.minecraft.world.level.portal.DimensionTransition")
EntityEvents.beforeHurt("minecraft:player", event => {
	if (event.source.getActual()?.type == "minecraft:warden") {
		/** @type {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Type} */
		const player = event.player
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

// Right-click with empty hand on fences to disconnect/reconnect them from solid faces.
/** @import {$FenceBlock} from "net.minecraft.world.level.block.FenceBlock" */
const FENCES = [
	"biomesoplenty:dead_fence",
	"biomesoplenty:empyreal_fence",
	"biomesoplenty:fir_fence",
	"biomesoplenty:hellbark_fence",
	"biomesoplenty:jacaranda_fence",
	"biomesoplenty:magic_fence",
	"biomesoplenty:mahogany_fence",
	"biomesoplenty:maple_fence",
	"biomesoplenty:palm_fence",
	"biomesoplenty:pine_fence",
	"biomesoplenty:redwood_fence",
	"biomesoplenty:umbran_fence",
	"biomesoplenty:willow_fence",
	"biomeswevegone:aspen_fence",
	"biomeswevegone:baobab_fence",
	"biomeswevegone:blue_enchanted_fence",
	"biomeswevegone:cika_fence",
	"biomeswevegone:cypress_fence",
	"biomeswevegone:ebony_fence",
	"biomeswevegone:fir_fence",
	"biomeswevegone:florus_fence",
	"biomeswevegone:green_enchanted_fence",
	"biomeswevegone:holly_fence",
	"biomeswevegone:ironwood_fence",
	"biomeswevegone:jacaranda_fence",
	"biomeswevegone:mahogany_fence",
	"biomeswevegone:maple_fence",
	"biomeswevegone:palm_fence",
	"biomeswevegone:pine_fence",
	"biomeswevegone:rainbow_eucalyptus_fence",
	"biomeswevegone:redwood_fence",
	"biomeswevegone:sakura_fence",
	"biomeswevegone:skyris_fence",
	"biomeswevegone:spirit_fence",
	"biomeswevegone:white_mangrove_fence",
	"biomeswevegone:willow_fence",
	"biomeswevegone:witch_hazel_fence",
	"biomeswevegone:zelkova_fence",
	"cobblemon:apricorn_fence",
	"cobblemon:saccharine_fence",
	"copycats:copycat_fence",
	"createdeco:andesite_mesh_fence",
	"createdeco:brass_mesh_fence",
	"createdeco:copper_mesh_fence",
	"createdeco:industrial_iron_mesh_fence",
	"createdeco:iron_mesh_fence",
	"createdeco:zinc_mesh_fence",
	"minecraft:acacia_fence",
	"minecraft:bamboo_fence",
	"minecraft:birch_fence",
	"minecraft:cherry_fence",
	"minecraft:crimson_fence",
	"minecraft:dark_oak_fence",
	"minecraft:jungle_fence",
	"minecraft:mangrove_fence",
	"minecraft:nether_brick_fence",
	"minecraft:oak_fence",
	"minecraft:spruce_fence",
	"minecraft:warped_fence",
	"mynethersdelight:powdery_fence",
	"ribbits:mossy_oak_planks_fence"
]
for (const fence of FENCES) {
	BlockEvents.rightClicked(fence, event => {
		const player = event.player
		if (!player.mainHandItem.isEmpty() || !player.offhandItem.isEmpty() || player.swinging) {
			return
		}

		const level = event.level
		const level_block = event.block

		/** @type {$FenceBlock} */
		const block = level_block.getBlock()
		const pos = level_block.getPos()

		const state_north = level_block.getNorth().getBlockState()
		const state_south = level_block.getSouth().getBlockState()
		const state_east = level_block.getEast().getBlockState()
		const state_west = level_block.getWest().getBlockState()
		const is_north_face_sturdy = state_north.isFaceSturdy(level, pos, Direction.NORTH.opposite, "full")
		const is_south_face_sturdy = state_south.isFaceSturdy(level, pos, Direction.SOUTH.opposite, "full")
		const is_east_face_sturdy = state_east.isFaceSturdy(level, pos, Direction.EAST.opposite, "full")
		const is_west_face_sturdy = state_west.isFaceSturdy(level, pos, Direction.WEST.opposite, "full")
		if (!is_north_face_sturdy && !is_south_face_sturdy && !is_east_face_sturdy && !is_west_face_sturdy) {
			player.swing("main_hand")
			level.runCommandSilent(`execute positioned ${pos.x} ${pos.y} ${pos.z} align xyz run playsound bubble_cobble:buzz player @a ~ ~ ~ 0.25`)
			return // Nothing to do, there's only fences here, maybe.
		}

		const states = level_block.getProperties()
		const is_fence_disconnected_from_sturdy_faces = (
			(states.get("north") == "false" || !is_north_face_sturdy)
			&& (states.get("south") == "false" || !is_south_face_sturdy)
			&& (states.get("east") == "false" || !is_east_face_sturdy)
			&& (states.get("west") == "false" || !is_west_face_sturdy)
		)

		const block_set_flags = 2 | 16 // Send update to clients, do not update neighbors.
		if (is_fence_disconnected_from_sturdy_faces) {
			level.setBlock(pos, Block.withProperties(
				level_block.getBlockState(), {
					north: block.connectsTo(state_north, is_north_face_sturdy, Direction.NORTH),
					south: block.connectsTo(state_south, is_south_face_sturdy, Direction.SOUTH),
					east: block.connectsTo(state_east, is_east_face_sturdy, Direction.EAST),
					west: block.connectsTo(state_west, is_west_face_sturdy, Direction.WEST),
				}),
				block_set_flags
			)
			level.runCommandSilent(`execute positioned ${pos.x} ${pos.y} ${pos.z} align xyz run playsound minecraft:block.wooden_trapdoor.open block @a ~ ~ ~ 1.0`)
			// if (state_north.properties.contains("south")) {
			//	 level_block.getNorth().setBlockState(Block.withProperties(state_north, {south: patch.north}))
			// }
		} else {
			level.setBlock(pos, Block.withProperties(
				level_block.getBlockState(), {
					north: state_north.hasTag("minecraft:fences"),
					south: state_south.hasTag("minecraft:fences"),
					west: state_west.hasTag("minecraft:fences"),
					east: state_east.hasTag("minecraft:fences"),
				}),
				block_set_flags
			)
			level.runCommandSilent(`execute positioned ${pos.x} ${pos.y} ${pos.z} align xyz run playsound minecraft:block.wooden_trapdoor.close block @a ~ ~ ~ 1.0`)
			// if (block.getNorth().getProperties().get("north") == "true") {
			// 	block.getNorth().setBlockState(Block.withProperties(block.getNorth().getBlockState(), {north: false}), 2 | 16)
			// }
		}

		level.runCommandSilent(`execute at ${player.uuid} run playsound minecraft:entity.item_frame.remove_item player @a ~ ~ ~ 0.5`)
		player.swing("main_hand", true)
	})
}

// Avoid accidentally placing lanterns when held in offhand.
// There's similar client-side code in client_changes.js.
BlockEvents.rightClicked(event => {
	if (event.hand == "OFF_HAND" && event.item.hasTag("bubble_cobble:lanterns") && !event.player.shiftKeyDown) {
		event.cancel()
	}
})


ServerEvents.basicCommand("currentstructure", event => {
	/** @type {import("net.minecraft.server.level.ServerLevel").$ServerLevel$$Type} */
	const level = event.level

	const block_pos = event.block.getPos()
	const structure_manager = level.structureManager()

	if (!structure_manager.hasAnyStructureAt(block_pos)) {
		event.respond("No structure at the current position").gray()
		return
	}

	const structure_registry = event.registries.registry("worldgen/structure").get()

	let response = Text.of("At the current position, the following structures were found:").gray()
	structure_manager.getAllStructuresAt(block_pos).forEach((structure, set) => {
		const string_id = structure_registry.getKey(structure).toString()
		response = response.append("\n- ")
		response = response.append(Text.of(string_id).green().hover("Click to copy").clickCopy(string_id))
	})
	event.respond(response)
})