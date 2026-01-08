/** @type {typeof import("net.neoforged.neoforge.event.brewing.RegisterBrewingRecipesEvent").$RegisterBrewingRecipesEvent } */
let $RegisterBrewingRecipesEvent  = Java.loadClass("net.neoforged.neoforge.event.brewing.RegisterBrewingRecipesEvent")
/** @type {typeof import("net.neoforged.neoforge.event.ItemStackedOnOtherEvent").$ItemStackedOnOtherEvent } */
let $ItemStackedOnOtherEvent  = Java.loadClass("net.neoforged.neoforge.event.ItemStackedOnOtherEvent")
/** @type {typeof import("net.minecraft.world.entity.animal.CatVariant").$CatVariant } */
let $CatVariant  = Java.loadClass("net.minecraft.world.entity.animal.CatVariant")
/** @type {typeof import("net.minecraft.server.level.ServerPlayer").$ServerPlayer } */
let $ServerPlayer  = Java.loadClass("net.minecraft.server.level.ServerPlayer")
/** @type {typeof import("net.minecraft.world.level.portal.DimensionTransition").$DimensionTransition } */
let $DimensionTransition  = Java.loadClass("net.minecraft.world.level.portal.DimensionTransition")

/** @typedef {import("dev.latvian.mods.kubejs.item.ItemModificationKubeEvent$ItemModifications").$ItemModificationKubeEvent$ItemModifications$$Original} $ItemModifications */

Platform.setModName("kubejs", "Bubble Cobble")
Platform.setModName("bubble_cobble", "Bubble Cobble")


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

	event.modify(["minecraft:potion", "minecraft:splash_potion", "minecraft:lingering_potion"], /** @param {ItemModifications} item */ item => {
		item.maxStackSize = 12
	})

	// Lower how much time it takes to eat food in general.
	event.modify("*", /** @param {$ItemModifications} modified */ modified => {
		const item = modified.item()
		const food_properties = item.getFoodProperties(Item.of(item), null)
		if (!food_properties || food_properties.eatSeconds() <= 0.0) {
			return
		}

		// Food with many effects should take longer to eat.
		const eat_time = food_properties.eatSeconds()
			* Math.min(0.6 + food_properties.effects().size() * 0.1, 1.0)

		if (eat_time == food_properties.eatSeconds()) {
			return // Same resulting value, no need to change anything.
		}

		const nutrition = food_properties.nutrition()
		const saturation = food_properties.saturation()

		// FoodBuilder does not use the saturation value as is when building. Weird.
		// The final value results from `nutrition * provided_saturation * 2.0`. This is the reverse formula, plus a check to avoid NaN.
		const reversed_saturation = (saturation != 0.0 ? (saturation / nutrition / 2.0) : 0.0)

		const food_builder = (new $FoodBuilder())
			.nutrition(nutrition)
			.saturation(reversed_saturation)
			.eatSeconds(eat_time)
			.alwaysEdible(food_properties.canAlwaysEat())

		if (food_properties.usingConvertsTo().present) {
			food_builder.usingConvertsTo(food_properties.usingConvertsTo().get())
		}

		food_properties.effects().forEach(e => {
			food_builder.effect(
				e.effect().effect.getKey(),
				e.effect().duration,
				e.effect().amplifier,
				e.probability()
			)
		})

		const result = food_builder.build()
		modified.food = result

		if (saturation.toFixed(1) != result.saturation().toFixed(1)) {
			console.warn(`Food "${item.id}" original saturation ${food_properties.saturation().toFixed(1)} was changed to ${result.saturation().toFixed(1)}.`)
		}
	})

	/**
	 * @import {$List} from "java.util.List"
	 * @import {$Tool} from "net.minecraft.world.item.component.Tool"
	 * @import {$Tool$Rule} from "net.minecraft.world.item.component.Tool$Rule"
	 */

	// Make hammers... break more stuff.
	event.modify(["justhammers:stone_hammer", "justhammers:stone_reinforced_hammer", "justhammers:iron_hammer", "justhammers:iron_reinforced_hammer"], /** @param {$ItemModifications} modified */ modified => {
		const item_path = modified.item().idLocation.getPath()
		const is_stone = item_path.startsWith("stone")

		const axe_breaking_speed = is_stone ? 3.0 : 5.0
		const ore_breaking_speed = is_stone ? 2.0 : 4.0
		/** @type {$Tool} */
		const tool = modified.componentMap.get("minecraft:tool")
		/** @type {$List<$Tool$Rule>} */
		const rules = Utils.newList()
		rules.addAll(tool.rules())
		rules.add({speed: axe_breaking_speed, blocks: "#minecraft:mineable/axe", correctForDrops: true})
		rules.add({speed: axe_breaking_speed, blocks: "#c:glass_blocks", correctForDrops: false})
		modified.tool = {
			damagePerBlock: tool.damagePerBlock(),
			defaultMiningSpeed: tool.defaultMiningSpeed(),
			rules: rules
		}

		// Reinforced Hammers lasts disproportionately too much.
		if (item_path.includes("reinforced")) {
			let damage = modified.componentMap.get("minecraft:max_damage")
			modified.maxDamage = damage / (is_stone ? 6 : 3)
		}
	})

	/** @param {import("net.minecraft.world.item.Item").$Item$$Type} item  @param {number} max_damage */
	function set_max_damage(item, max_damage) {
		event.modify(item, /** @param {$ItemModifications} modified */ modified => {
			modified.maxDamage = max_damage
			modified.damage = 0
		})
	}

	// Fix Copper Armor having no durability.
	set_max_damage("minecraft:copper_helmet", 121)
	set_max_damage("minecraft:copper_chestplate", 176)
	set_max_damage("minecraft:copper_leggings", 165)
	set_max_damage("minecraft:copper_boots", 143)

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

/** @param {import("net.minecraft.world.entity.LivingEntity").$LivingEntity$$Type} entity */
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

NativeEvents.onEvent($ItemStackedOnOtherEvent, event => {
	if (event.clickAction == "SECONDARY") {
		const item_to_destroy = get_item_to_destroy(event.carriedItem, event.stackedOnItem)
		if (item_to_destroy) {
			if (Platform.isClientEnvironment()) {
				Client.player.playNotifySound("minecraft:block.lava.extinguish", "master", 0.1, 1.0)
			}
			if (!item_to_destroy.getComponents().has("minecraft:fire_resistant")) {
				item_to_destroy.shrink(99)
			}
			event.setCanceled(true)
		}
	}
})

if (Platform.isClientEnvironment()) {
	/** @type {typeof import("net.neoforged.neoforge.client.event.ContainerScreenEvent$Render$Foreground").$ContainerScreenEvent$Render$Foreground } */
	let $ContainerScreenEvent$Render$Foreground  = Java.loadClass("net.neoforged.neoforge.client.event.ContainerScreenEvent$Render$Foreground")
	NativeEvents.onEvent($ContainerScreenEvent$Render$Foreground, event => {
		if (event.containerScreen.menu?.carried.isEmpty()) {
			return
		}
		const container_screen = event.containerScreen
		const focused_slot = container_screen.focusedSlot
		if (!focused_slot) {
			return
		}

		const item_to_destroy = get_item_to_destroy(Client.player.containerMenu.carried, container_screen.focusedSlot.item)
		if (item_to_destroy) {
			event.guiGraphics["renderTooltip(net.minecraft.client.gui.Font,net.minecraft.network.chat.Component,int,int)"](
				Client.font, Text.translateWithFallback("", "%s to delete", [Text.translateWithFallback("", "Right-click").aqua()]).red(), event.mouseX - container_screen.x, event.mouseY - container_screen.y
			)
			event.guiGraphics.fill(focused_slot.x, focused_slot.y, focused_slot.x + 16, focused_slot.y + 16, 100, Color.ORANGE_DYE.getArgb())
		}
	})
}

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
