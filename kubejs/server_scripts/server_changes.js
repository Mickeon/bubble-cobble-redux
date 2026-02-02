// priority: 10
// requires: create
// requires: enhancedcelestials
// requires: cobblemonraiddens
// requires: xaerominimap
// requires: xaeroworldmap

const RAID_DIMENSION_EFFECTS = ["xaerominimap:no_minimap", "xaeroworldmap:no_world_map", "xaerominimap:no_waypoints"]

// Safer End, and Raid Dimension stuff.
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

	else if (player.level.dimension == "cobblemonraiddens:raid_dimension") {
		// This is nasty but I prefer it over another "else" for now.
		let add_raid_effects = () => {
			for (const effect of RAID_DIMENSION_EFFECTS) {
				player.addEffect(MobEffectUtil.of(effect, 40, 0, true, false))
			}
		}
		add_raid_effects()

		server.scheduleRepeatingInTicks(10, callback => {
			if (player.isRemoved() || player.level.dimension != "cobblemonraiddens:raid_dimension") {
				callback.clear()
				return
			}
			add_raid_effects()
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

// https://github.com/CorgiTaco-MC/Enhanced-Celestials/blob/1.21.X/Common/src/main/java/dev/corgitaco/enhancedcelestials/lunarevent/EnhancedCelestialsLunarForecastWorldData.java
let $EnhancedCelestials = Java.loadClass("dev.corgitaco.enhancedcelestials.EnhancedCelestials")
/** @type {typeof import("net.minecraft.core.Holder").$Holder } */
let $Holder  = Java.loadClass("net.minecraft.core.Holder")

/** @returns {import("net.minecraft.core.Holder").$Holder$$Type<T>} */
function get_current_lunar_event_holder(level) {
	let lunar_forecast = $EnhancedCelestials.lunarForecastWorldData(level).orElse(null)
	return (lunar_forecast ? lunar_forecast.currentLunarEventHolder() : $Holder.direct())
}

function is_lunar_event_happening(level) {
	return !get_current_lunar_event_holder(level).is("enhancedcelestials:default")
}

/** @type {Special.EntityType[]} */
const NO_SKY_LIGHT_MOBS = [
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
	// Among others.
	"minecraft:creeper",
	"minecraft:witch",
]
NO_SKY_LIGHT_MOBS.forEach(entity_type => {
	EntityEvents.checkSpawn(entity_type, event => {
		if (event.block.getSkyLight() >= 1 && event.type == "NATURAL") {
			if (event.block.getSkyLight() <= 7 && is_lunar_event_happening(event.level)) {
				// console.log("Ignoring most sky light spawn rules, there's a Lunar Event happening")
				return
			}
			// console.log(`Trying to spawn ${event.entity.type}, but can't under the sky light!`)
			event.cancel()
		}
	})
})

// After the above changes, a lot of Endermen spawn on the surface. Rectify that.
// const FEWER_SKY_LIGHT_MOBS = ["minecraft:enderman", "minecraft:spider"]
// FEWER_SKY_LIGHT_MOBS.forEach(entity_type => {
// 	EntityEvents.checkSpawn(entity_type, event => {
// 		if (event.block.getSkyLight() >= 1 && event.type == "NATURAL" && Utils.getRandom().nextFloat() > 0.3) {
// 			// console.log(`Trying to spawn ${event.entity.type}, but chance said no!`)
// 			event.cancel()
// 		}
// 	})
// })

EntityEvents.checkSpawn("minecraft:enderman", event => {
	if (event.block.getSkyLight() >= 1 && event.type == "NATURAL" && Utils.getRandom().nextFloat() > 0.3) {
		// console.log(`Trying to spawn ${event.entity.type}, but chance said no!`)
		event.cancel()
	}
})

EntityEvents.checkSpawn("minecraft:spider", event => {
	if (event.block.getSkyLight() >= 1 && event.type == "NATURAL" && Utils.getRandom().nextFloat() > 0.1) {
		// console.log(`Trying to spawn ${event.entity.type}, but chance said no!`)
		event.cancel()
	}
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
// Use Rope to repair Escape Rope.
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

	if (left.id == "gag:escape_rope" && right.hasTag("c:ropes")) {
		const repair_per_material = left.maxDamage * 0.5
		const repair_amount = Math.min(repair_per_material * right.count, left.maxDamage)
		const new_damage = Math.max(left.damageValue - repair_amount, 0)
		event.cost = 1
		event.materialCost = Math.ceil(repair_amount / repair_per_material)
		event.output = left.copy()
		event.output.damageValue = new_damage
		return
	}

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

// HACK: I have code below to mitigate this, but it's nasty, on server loaded. FluidInteractionRegistry persists
// when the server is closed. This is fine for dedicated servers, but you will eventually run out of memory in singleplayer.
// At the same time, interactions can't be added properly on startup as some registries are not ready yet(?)
// /** @type {typeof import("java.util.function.Function").$Function } */
// let $JavaFunction  = Java.loadClass("java.util.function.Function")
// https://lexxie.dev/neoforge/1.21.1/net/neoforged/neoforge/fluids/FluidInteractionRegistry.FluidInteraction.html
/** @type {typeof import("net.neoforged.neoforge.fluids.FluidInteractionRegistry").$FluidInteractionRegistry } */
let $FluidInteractionRegistry  = Java.loadClass("net.neoforged.neoforge.fluids.FluidInteractionRegistry")
/** @type {typeof import("net.neoforged.neoforge.fluids.FluidInteractionRegistry$InteractionInformation").$FluidInteractionRegistry$InteractionInformation } */
let $InteractionInformation = Java.loadClass("net.neoforged.neoforge.fluids.FluidInteractionRegistry$InteractionInformation")
ServerEvents.loaded(event => {
	const LAVA = Fluid.lava().getFluidType()

	// The method to access this property has been added by Create. Prepare for the worst.
	// Nasty hack to not add fluid interactions every time.
	const interactions = $FluidInteractionRegistry.getInteractions()
	const interactions_with_lava = interactions.get(LAVA).size()
	if (interactions_with_lava > 13) {
		console.log(`Bubble Cobble fluid interactions already registered (Lava has ${interactions_with_lava} of them)`)
		return
	}
	console.log("Adding Bubble Cobble fluid interactions")

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation(
		Fluid.getType("createmonballsoverhaul:source_standard_tumblestone_coating").getFluidType(),
		Blocks.GRANITE.defaultBlockState()
	))

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation(
		Fluid.getType("createmonballsoverhaul:source_light_tumblestone_coating").getFluidType(),
		Blocks.DIORITE.defaultBlockState()
	))

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation(
		Fluid.getType("createmonballsoverhaul:source_dense_tumblestone_coating").getFluidType(),
		Blocks.BLACKSTONE.defaultBlockState()
	))

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation(
		Fluid.getType("create_bic_bit:ketchup").getFluidType(),
		Block.getBlock("arts_and_crafts:red_soapstone").defaultBlockState()
	))

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation(
		Fluid.getType("create_bic_bit:mayonnaise").getFluidType(),
		Blocks.CALCITE.defaultBlockState()
	))

	// Note that Curdled Milk is currently unavailable.
	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation(
		Fluid.getType("create_bic_bit:curdled_milk").getFluidType(),
		Block.getBlock("arts_and_crafts:gypsum").defaultBlockState()
	))

	// Funny.
	$FluidInteractionRegistry.addInteraction(Fluid.getType("create_bic_bit:mayonnaise").getFluidType(), new $InteractionInformation(
		Fluid.getType("create:chocolate").getFluidType(),
		Block.getBlock("kubejs:chiseled_mud_bricks").defaultBlockState()
	))

	// console.log(`There are ${interactions.size()} fluids with registered interactions:`)
	// interactions.forEach((fluid_type, list) => {
	// 	console.log(`${fluid_type} has ${list.size()} fluid interactions`)
	// })

	// TODO: Cobblestone generator on top of Bedrock randomly makes Andesite, Granite, or Diorite.
	// This works now but it's not currently needed.
	// $FluidInteractionRegistry.addInteraction(Fluid.water().getFluidType(), new $InteractionInformation["(net.neoforged.neoforge.fluids.FluidType,java.util.function.Function)"](
	// 	Fluid.getType("createmonballsoverhaul:source_standard_tumblestone_coating").getFluidType(),
	// 	new $JavaFunction({
	// 		apply: (fluid_state) => {
	// 			return Math.random() > 0.5 ? Blocks.IRON_BLOCK.defaultBlockState() : Blocks.GOLD_BLOCK.defaultBlockState()
	// 		}
	// 	})
	// ))
})