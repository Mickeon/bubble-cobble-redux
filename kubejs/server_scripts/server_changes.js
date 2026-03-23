// priority: 10
// requires: cobblemonraiddens
// requires: create
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

// PlayerEvents.chat(event => {
// 	let {player, message, server, component} = event
// 	server.tell([player.displayName, Text.darkGray(" » "), component])
// 	event.cancel()
// })

// Give items to other players directly!
ItemEvents.dropped(event => {
	const item = event.item
	const dropper = event.entity
	const item_entity = event.itemEntity

	const result = dropper.rayTrace(dropper.entityInteractionRange() + 1)
	let target = result.entity

	/** @param {import("net.minecraft.world.entity.LivingEntity").$LivingEntity$$Original} target */
	const can_receive_dropped_item = (target) => {
		return target && target != dropper && (target.isPlayer() || target.type == "minecraft:armor_stand") && target.isAlive()
	}

	if (!target) {
		// Let's try a more generous check.
		let range = dropper.entityInteractionRange()
		let starting_pos = dropper.eyePosition
		let ending_pos = result.hit
		for (let progress = 0.0; progress < range; progress += 1.0) {
			let box_extent = 1 + 0.1 * progress
			let box = AABB.ofSize(starting_pos.add(dropper.getForward().scale(progress)), box_extent, 1, box_extent)
			// event.level.sendParticles(dropper, `supplementaries:air_burst`, true,
			// 	box.getCenter().x(), box.getCenter().y(), box.getCenter().z(),
			// 	0, 0.0, 0.0, 0.0, 4.0
			// )
			let found_entities = event.level.getEntitiesWithin(box).oneFilter(can_receive_dropped_item)
			if (!found_entities.isEmpty()) {
				target = found_entities.getFirst()
				break
			}
		}
	}
	if (can_receive_dropped_item(target)) {
		// Getting these now, as the item may be copied and cleared later.
		let item_count = item.count
		let item_display_name = item.displayName
		if (target.isPlayer()) {
			target.give(item.copyAndClear())
		} else {
			/** @type {import("net.minecraft.world.entity.LivingEntity").$LivingEntity$$Original} */
			let armor_stand = target
			if (armor_stand.mainHandItem.isEmpty()) {
				armor_stand.mainHandItem = item.copyAndClear()
			} else {
				item_entity.teleportTo(target.level.dimension, target.x, target.y, target.z, 0, 0)
				item_entity.pickUpDelay = 0
			}
		}
		// For some reason "remove" with "Owner" tag specifically does not work.
		// So we can't do this, as it'd be impossible to grab the item back up by other players.
		// item_entity.mergeNbt({Owner: target.nbt.get("UUID")})

		play_sound_at_entity(dropper, "minecraft:entity.glow_item_frame.remove_item", "players", 0.2, remap(item_count, 1, 64, 1.1, 0.5))
		dropper.statusMessage = Text.translateWithFallback("", "Gave %s to %s", [item_display_name, target.displayName]).gray()
		play_sound_at_entity(target, "minecraft:item.armor.equip_generic", "players")
		target.statusMessage = Text.translateWithFallback("", "Received %s from %s", [item_display_name, dropper.displayName]).gray()
	}
})

// Allow tuning down Noteblocks.
BlockEvents.rightClicked("minecraft:note_block", event => {
	const player = event.player
	if (!player.isShiftKeyDown() || event.item.block) {
		return // You're likely trying to place a block onto the Noteblock.
	}

	const level = event.level
	const level_block = event.block
	const block_pos = level_block.getPos()
	const block_state = level_block.getBlockState()
	const properties = level_block.getProperties()
	const block = /** @type {import("net.minecraft.world.level.block.NoteBlock").$NoteBlock$$Type} */ (level_block.getBlock())

	const current_note = Number.parseInt(properties.get("note"))
	const new_note = (current_note - 1.0 + 24) % 24
	properties.put("note",  new_note.toString())

	level_block.setBlockState(Block.withProperties(block_state, properties))
	level.blockEvent(block_pos, block, 0, 0)

	event.cancel()
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
		const item = event.item
		if (item.customData.getBoolean("kubejs:fixed")) {
			return
		}

		let current_contents = /** @type {$PotionContents} */ (item.get("minecraft:potion_contents"))
		let modified_effects = Utils.newList()
		current_contents.customEffects().forEach(effect => {
			modified_effects.add(MobEffectUtil.of(effect.getEffect(), effect.duration * SEC))
		})

		let new_contents = new $PotionContents(current_contents.potion(), current_contents.customColor(), modified_effects)
		item.setPotionContents(new_contents)

		// item.getCustomData().putBoolean("kubejs:fixed", true) // For some reason this doesn't work anymore.
		item.setCustomData({"kubejs:fixed": true})
		item.setLore([
			Text.of(`You probably tried drinking this.`).darkGray(),
			Text.of(`It doesn't last as long as it says,`).darkGray(),
			Text.of(`but it still is a lot. Forgive me`).darkGray()
		])
	})
}

if (Platform.isLoaded("handcrafted")) {
	// Custom sound when opening HandCrafted's containers.
	// TODO: Expand to include more generic containers?
	ServerEvents.tags("block", event => {
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

	PlayerEvents.chestOpened("minecraft:generic_9x3", event => {
		if (event.block && event.block.hasTag("bubble_cobble:handcrafted_containers")) {
			// event.player.playNotifySound("relics:ability_locked", "players", 1, 1)
			event.player.playNotifySound("create:blaze_munch", "players", 0.25, 2.0)
		}
	})
}

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

	let response = Text.of(`At the current position, the following structures were found:`).gray()
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
	// $FluidInteractionRegistry.getInteractions().clear() // For debugging purposes. Please do not let this in release.
	console.log("Adding Bubble Cobble fluid interactions")

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation(
		Fluid.getType("create_bic_bit:ketchup").getFluidType(),
		Block.getBlock("arts_and_crafts:red_soapstone").defaultBlockState()
	))

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation(
		Fluid.getType("create_bic_bit:mayonnaise").getFluidType(),
		Blocks.CALCITE.defaultBlockState()
	))

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation(
		Fluid.getType("sliceanddice:fertilizer").getFluidType(),
		Block.getBlock("create:veridium").defaultBlockState()
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

	const clone_catalyst_fluid = Fluid.getType("create:chocolate").getFluidType()
	function below_block_cloning_fluid_interaction(block_state) {
		$FluidInteractionRegistry.addInteraction(clone_catalyst_fluid, new $InteractionInformation["(net.neoforged.neoforge.fluids.FluidInteractionRegistry$HasFluidInteraction,net.minecraft.world.level.block.state.BlockState)"](
			/** @type {import("net.neoforged.neoforge.fluids.FluidInteractionRegistry$HasFluidInteraction").$FluidInteractionRegistry$HasFluidInteraction$$Type} */
			(level, current_pos, relative_pos, current_state) => {
				return level.getBlockState(current_pos.below()) == block_state
			},
			block_state
		))
	}

	below_block_cloning_fluid_interaction(Block.getBlock("create:veridium").defaultBlockState())
	below_block_cloning_fluid_interaction(Block.getBlock("create:ochrum").defaultBlockState())
	below_block_cloning_fluid_interaction(Block.getBlock("create:asurine").defaultBlockState())
	below_block_cloning_fluid_interaction(Block.getBlock("create:crimsite").defaultBlockState())

	/** @import {$FluidState} from "net.minecraft.world.level.material.FluidState" */

	const fluid_rand = Utils.getRandom().fork()

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation["(net.neoforged.neoforge.fluids.FluidType,java.util.function.Function)"](
		Fluid.getType("createmonballsoverhaul:source_standard_tumblestone_coating").getFluidType(),
		/** @param {$FluidState} fluid_state */ fluid_state => {
			const chance = fluid_rand.nextDouble()
			if (chance > 0.666) {
				return Blocks.GRANITE.defaultBlockState()
			}
			if (chance > 0.333) {
				return Blocks.DIORITE.defaultBlockState()
			}
			return Blocks.ANDESITE.defaultBlockState()
		}
	))

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation["(net.neoforged.neoforge.fluids.FluidType,java.util.function.Function)"](
		Fluid.getType("createmonballsoverhaul:source_light_tumblestone_coating").getFluidType(),
		/** @param {$FluidState} fluid_state */ fluid_state => {
			const chance = fluid_rand.nextDouble()
			if (chance > 0.666) {
				return Blocks.CALCITE.defaultBlockState()
			}
			if (chance > 0.333) {
				return Blocks.TUFF.defaultBlockState()
			}
			return Block.getBlock("biomeswevegone:dacite").defaultBlockState()
		}
	))

	$FluidInteractionRegistry.addInteraction(LAVA, new $InteractionInformation["(net.neoforged.neoforge.fluids.FluidType,java.util.function.Function)"](
		Fluid.getType("createmonballsoverhaul:source_dense_tumblestone_coating").getFluidType(),
		/** @param {$FluidState} fluid_state */ fluid_state => {
			const chance = fluid_rand.nextDouble()
			if (chance > 0.666) {
				return Block.getBlock("arts_and_crafts:soapstone").defaultBlockState()
			}
			if (chance > 0.333) {
				return Block.getBlock("arts_and_crafts:beige_pietraforte").defaultBlockState()
			}
			return Block.getBlock("arts_and_crafts:gypsum").defaultBlockState()
		}
	))

	// console.log(`There are ${interactions.size()} fluids with registered interactions:`)
	// interactions.forEach((fluid_type, list) => {
	// 	console.log(`${fluid_type} has ${list.size()} fluid interactions`)
	// })
})

// Put logs back together with Tree Bark.
BlockEvents.rightClicked(event => {
	if (!event.item.is("farmersdelight:tree_bark")) {
		return
	}

	const item = event.item
	const level_block = event.block
	// Commenting this out makes the check way less sophisticated, but some mods did not add tags properly.
	// if (!level_block.hasTag("c:stripped_logs") && !level_block.hasTag("c:stripped_woods")) {
	// 	return
	// }
	const stripped_id = level_block.getId()
	if (!stripped_id.includes("stripped")) {
		return // Not a Stripped Log/Wood.
	}

	const unstripped_id = stripped_id.replace("_stripped", "").replace("stripped_", "")
	const unstripped_block = Block.getBlock(unstripped_id)
	if (!unstripped_block) {
		console.warn(`Trying to use bark to convert block into ${unstripped_id}, but it does not exist. Ignoring.`)
		return
	}

	level_block.set(unstripped_block, level_block.getProperties())
	const player = event.player
	if (!player.isCreative()) {
		item.shrink(1)
	}
	player.swing(event.hand, true)

	const position = level_block.getPos().getCenter()
	play_sound_globally(event.level, position, "minecraft:item.axe.strip", "blocks")
	event.level.sendParticles(player, `minecraft:block{block_state:{Name:"${unstripped_id}"}}`, false,
		position.x(), position.y(), position.z(),
		15, 0.5, 0.5, 0.5, 1.0
	)

	event.cancel()
})

// Repair Anvil with Iron Blocks.
BlockEvents.rightClicked(["minecraft:chipped_anvil", "minecraft:damaged_anvil"], event => {
	if (!event.item.is("minecraft:iron_block")) {
		return
	}

	const item = event.item
	const player = event.player
	const level_block = event.block
	if (player.isShiftKeyDown()) {
		return
	}

	const is_fully_damaged = level_block.getId() == "minecraft:damaged_anvil"
	const repaired_anvil = is_fully_damaged ? Block.getBlock("minecraft:chipped_anvil") : Block.getBlock("minecraft:anvil")

	level_block.set(repaired_anvil, level_block.getProperties())
	if (!player.isCreative()) {
		item.shrink(1)
	}
	player.swing(event.hand, true)

	const position = level_block.getPos().getCenter()
	play_sound_globally(event.level, position, "minecraft:block.anvil.place", "blocks", 0.25, is_fully_damaged ? 0.9 : 1.0)
	event.level.sendParticles(player, `supplementaries:air_burst`, false,
		position.x(), position.y() + 0.4, position.z(),
		20, 0.15, 0.1, 0.15, 0.01
	)

	event.cancel()
})