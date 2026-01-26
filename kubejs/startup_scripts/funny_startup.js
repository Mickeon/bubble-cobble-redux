/** @type {typeof import("net.neoforged.neoforge.event.brewing.RegisterBrewingRecipesEvent").$RegisterBrewingRecipesEvent } */
let $RegisterBrewingRecipesEvent  = Java.loadClass("net.neoforged.neoforge.event.brewing.RegisterBrewingRecipesEvent")
/** @type {typeof import("net.minecraft.world.entity.animal.CatVariant").$CatVariant } */
let $CatVariant  = Java.loadClass("net.minecraft.world.entity.animal.CatVariant")
/** @type {typeof import("net.minecraft.server.level.ServerPlayer").$ServerPlayer } */
let $ServerPlayer  = Java.loadClass("net.minecraft.server.level.ServerPlayer")
/** @type {typeof import("net.minecraft.world.level.portal.DimensionTransition").$DimensionTransition } */
let $DimensionTransition  = Java.loadClass("net.minecraft.world.level.portal.DimensionTransition")


ItemEvents.modification(event => {
	event.modify("cobblemon:ice_stone", /** @param {$ItemModifications} item */ item => {
		item.food = (new $FoodBuilder()).alwaysEdible().effect("minecraft:poison", 10, 1, 1).build()
		// Something else also happens, but it is handled in server scripts.
	})

	event.modify(["create:polished_rose_quartz", "create:rose_quartz"], /** @param {$ItemModifications} item */ item => {
		item.food = (new $FoodBuilder()).alwaysEdible().build()
	})

	event.modify(["biomesoplenty:cattail", "biomeswevegone:cattail_sprout", "biomeswevegone:fluorescent_cattail_sprout"], /** @param {$ItemModifications} item */ item => {
		item.food = (new $FoodBuilder()).alwaysEdible().nutrition(1).build()
	})
})

StartupEvents.registry("item", event => {
	event.create("blue_mascot_cat")
			.displayName("Sopping Wet Thing")
			.rarity("rare")
			.tooltip(Text.of("Shake him comedically for some cool noises!").color("#83BED9"))
			.useAnimation("brush")
			.useDuration(item_stack => 30)
			.use((level, player, hand) => {
				if (level.isClientSide()) {
					return true
				}

				level.server.scheduleRepeatingInTicks(6, callback => {
					if (player.usingItem && player.useItem.id == "kubejs:blue_mascot_cat") {
						let nununu = "Nu" + "nu".repeat(Math.random() * 4) + "!"
						level.server.runCommandSilent(`title ${player.username} times 1 5 5`)
						level.server.runCommandSilent(`title ${player.username} actionbar {"text":"${nununu}","color":"aqua"}`)
						player.playNotifySound("supplementaries:item.bubble_blower", "players", 1, 1.0 + 0.2 * Math.random())

						const mickeon = find_mickeon(level.server)
						if (mickeon) {
							mickeon.potionEffects.add("minecraft:slowness", 10, 1, true, false)
						}
					} else {
						callback.clear()
					}
				})
				return true
			})
			.finishUsing((item_stack, level, entity) => {
				entity.potionEffects.add("farmersdelight:comfort", 5 * SEC)

				if (entity.player) {
					let is_finite = !item_stack.customData.getBoolean("infinite")
					if (is_finite) {
						item_stack.shrink(1)
						entity.addItem(Item.of("cobblemon:ice_stone"))
					}
					entity.ticksFrozen = 10 * SEC
					entity.playNotifySound("supplementaries:block.jar.break", "players", 1, 1.1)
					entity.addItemCooldown(item_stack.id, SEC)
				}
				if (!level.isClientSide()) {
					const mickeon = find_mickeon(level.server)
					if (mickeon) {
						level.runCommandSilent(`execute at ${mickeon.uuid} run playsound minecraft:entity.enderman.teleport player @a`)
						level.runCommandSilent(`execute at ${entity.uuid} run playsound minecraft:entity.enderman.teleport player @a`)
						mickeon.potionEffects.add("minecraft:slow_falling", 3 * SEC, 3, true, false)
						mickeon.teleportTo(level.dimension, entity.x, entity.y, entity.z, mickeon.yaw, mickeon.pitch)
					}
				}
				return item_stack
			})
			.tag("create:upright_on_belt")
	event.create("bearded_dragon_bowl")
			.displayName("Bearded Dragon Bowl")
			.unstackable()
			.fireResistant()
			.rarity("epic")
			.use((level, player, hand) => true)
			.tag("create:upright_on_belt")

	event.create("banana_mayo_sandwich")
			.displayName("Banana and Mayo Sandwich")
			.food(f => f
					.nutrition(8)
					.saturation(0.25)
			)
	event.create("doublemint_gum")
			.displayName("Doublemint™ Gum")
			.food(f => f
					.nutrition(1)
					.saturation(0.25)
					.eatSeconds(0.25)
					.alwaysEdible()
					.effect("farmersdelight:comfort", 30, 0, 1)
			)
			.maxStackSize(63)
			.rarity("uncommon")
			.jukeboxPlayable("kubejs:mint")
	event.create("horse_urine_bottle")
			.maxStackSize(16)
			.tooltip(Text.translatableWithFallback("", "dude").darkGray().italic())
			.tag("c:drinks")
			.tag("c:drinks/juice")
			.tag("c:potions/bottle")
			.useAnimation("drink")
			.food(f => f
					.alwaysEdible()
					.effect("minecraft:nausea", 5 * SEC, 0, 1.0)
					.effect("minecraft:nausea", 20 * SEC, 0, 0.75)
					.effect("kubejs:girl_power", 30 * SEC, 0, 0.5)
			)
			.createItemProperties()
					.craftRemainder("minecraft:glass_bottle")
	event.create("super_ghostbusters")
			.displayName("Super Ghostbusters")
			.unstackable()
			.rarity("rare")
			.tooltip(Text.of("Why the fuck is all the modpack full of ghost?").color("#83BED9"))
			.useAnimation("toot_horn")
			.useDuration(item_stack => 30)
			.use((level, player, hand) => {
				if (level.isDay() || player.potionEffects.isActive("minecraft:infested")) {
					player.playNotifySound("bubble_cobble:buzz", "players", 1, 0.1)
					player.addItemCooldown(player.getItemInHand(hand), 40)
					return false
				}

				return true
			})
			.food(f => f
					.alwaysEdible()
					.effect("minecraft:levitation", 5 * SEC, 0, 1.0)
					.effect("brewinandchewin:intoxication", 5 * MIN, 0, 1.0)
			)
			.jukeboxPlayable("kubejs:ghostbusters")
})

StartupEvents.modifyCreativeTab("minecraft:food_and_drinks", event => {
	event.add([
		Item.of("kubejs:blue_mascot_cat"),
		Item.of("kubejs:banana_mayo_sandwich"),
		Item.of("create:rose_quartz"),
		Item.of("create:polished_rose_quartz"),
		Item.of("biomesoplenty:cattail"),
		Item.of("biomeswevegone:cattail_sprout"),
		Item.of("biomeswevegone:fluorescent_cattail_sprout"),
		Item.of("kubejs:horse_urine_bottle"),
	])
})

StartupEvents.modifyCreativeTab("kubejs:tab", event => {
	event.remove(Item.of("kubejs:bearded_dragon_bowl"))
	event.add(Item.of("kubejs:bearded_dragon_bowl").withCustomName("Banana"))
	event.add(Item.of("kubejs:bearded_dragon_bowl").withCustomName("Baby Dandy"))
	event.remove("kubejs:doublemint_gum") // Sssh.

	event.add(Item.of("constructionstick:netherite_stick", 1, {
		"constructionstick:lock": "nolock",
		"constructionstick:direction": "target",
		"constructionstick:destruction":true,
		"constructionstick:angel":true,
		"constructionstick:replacement":true,
		"constructionstick:unbreakable": true,
		"constructionstick:selected": "constructionstick:default",
		"minecraft:unbreakable": {show_in_tooltip: false},
		"minecraft:item_name": Text.of("God Stick"),
		"minecraft:rarity": "epic",
		"minecraft:lore": Text.of("Only available in Creative Mode").lightPurple()
	}))
})

StartupEvents.registry("sound_event", event => {
	event.create("bubble_cobble:buzz")
	event.create("bubble_cobble:dash")
	event.create("bubble_cobble:recharged")
	event.create("bubble_cobble:crate_jump")
	event.create("bubble_cobble:fruit_collected")
	event.create("bubble_cobble:life_got")
	event.create("kubejs:item.bearded_dragon_chirp")
})

StartupEvents.registry("attribute", event => {
	event.create("kubejs:dash_jump_count")
		.attachToPlayers()
		.range(0, 0, 128)
		.sentiment("positive")
		.displayName(Text.of("Air Dash")
	)
})

// Funniest thing imaginable.
/*
ForgeEvents.onEvent("net.minecraftforge.event.entity.ProjectileImpactEvent", event => {
	if (Utils.server == null) {
		return
	}
	// if (!(event.getProjectile() instanceof Internal.ThrowablePotionItem)) {
	// 	return
	// }

	if (event.getProjectile().getOwner()?.username == "SueTheMimiga") {
		if (event.getProjectile().nbt.getCompound("Item").getCompound("tag").get("Potion") == "gohome:recall_potion") {
			// event.entity.getOwner().potionEffects.add("gohome:recall")
			try {
				let owner = event.getProjectile().getOwner()
				event.getProjectile().teleportTo(owner.level.dimension, owner.x, owner.y, owner.z, 0.0, 0.0)
			} catch (error) {
				console.error(error)
			}
		}
	}
})
*/
/** @param {import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Type} server */
function find_mickeon(server) {
	const player_list = server.getPlayerList()
	return player_list.getPlayerByName("Mickeon")
}


StartupEvents.registry("mob_effect", event => {
	event.create("begone")
		.color("#AEFFF8")
		.instant()
		.effectTick(entity => global.begone_effect(entity))
	event.create("girl_power")
		.color("#FFAEE0")
		.beneficial()
})

StartupEvents.registry("potion", event => {
	event.create("begone").effect("kubejs:begone")
	event.create("girl_power").effect("kubejs:girl_power", 5 * MIN, 1)
})

NativeEvents.onEvent($RegisterBrewingRecipesEvent, event => {
	event.builder.addRecipe(`potion[minecraft:potion_contents={\"potion\":\"minecraft:awkward\"}]`, "#c:ender_pearls", `minecraft:potion[minecraft:potion_contents={"potion":"kubejs:begone"}]`)
	event.builder.addRecipe("kubejs:horse_urine_bottle", "cobblemon:carbos" , `minecraft:potion[minecraft:potion_contents={"potion":"kubejs:girl_power"}]`)
})

/** @param {$LivingEntity} entity */
global.begone_effect = function(entity) {
	if (entity instanceof $ServerPlayer) {
		let dimension_transition = entity.findRespawnPositionAndUseSpawnBlock(false, $DimensionTransition.DO_NOTHING)
		let spawn_pos = dimension_transition.pos()
		entity.playNotifySound("minecraft:entity.enderman.teleport", "players", 1.0, 1.0)
		entity.teleportTo(dimension_transition.newLevel().dimension, spawn_pos.x(), spawn_pos.y(), spawn_pos.z(), dimension_transition.yRot(), dimension_transition.xRot())
		entity.playNotifySound("minecraft:enchant.thorns.hit", "players", 0.5, 1.0)
	}
	entity.removeEffect("kubejs:begone")
}

StartupEvents.registry("cat_variant", event => {
	event.createCustom("pipi", () => new $CatVariant("kubejs:textures/entity/cat/pipi.png"))
})

/** @param {$ItemStack} carried_item @param {$ItemStack} stacked_on_item   */
function get_item_to_destroy(carried_item, stacked_on_item) {
	if (!carried_item.isEmpty() && stacked_on_item.id == "minecraft:lava_bucket") {
		return carried_item
	}
	if (!stacked_on_item.isEmpty() && carried_item.id == "minecraft:lava_bucket") {
		return stacked_on_item
	}
}

// Dead code.
// const ForgeRegistries = Java.loadClass("net.minecraftforge.registries.ForgeRegistries")
// ForgeEvents.onEvent("net.minecraftforge.event.entity.living.MobEffectEvent$Added", event => {
// 	// event.effectInstance.effect gives you the actual MobEffect you can check against.

// 	const effect_id = ForgeRegistries.MOB_EFFECTS.getKey(event.effectInstance.effect)
// 	const effect_source_username = event?.effectSource?.username

// 	Utils.server.tell(effect_id)

// 	// if (effectId == "alexsmobs:lava_vision") {
// 		// 	event.entity.potionEffects.add("minecraft:haste", effectDuration)
// 	// }
// 	if (effect_id == "alexsmobs:lava_vision" && effect_source_username == "Mickeon") {
// 		event.effectSource.potionEffects.add("gohome:recall_potion")
// 	}

// })
// ForgeEvents.onEvent("net.minecraftforge.event.entity.living.MobEffectEvent$Applicable", event => {
// 	const effect_id = ForgeRegistries.MOB_EFFECTS.getKey(event.effectInstance.effect)
// 	Utils.server.tell(effect_id)
// });

// StartupEvents.postInit(event => {
// 	// Java.loadClass("cloud.viniciusith.gohome.effect.RecallEffect")
// })
