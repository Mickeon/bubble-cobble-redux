let $CatVariant = Java.loadClass("net.minecraft.world.entity.animal.CatVariant")
let $ServerPlayer = Java.loadClass("net.minecraft.server.level.ServerPlayer")
let $DimensionTransition = Java.loadClass("net.minecraft.world.level.portal.DimensionTransition")


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

	event.modify("farmersdelight:skillet",  /** @param {$ItemModifications} modified */ modified => {
		modified.addAttributeModifier("minecraft:generic.armor", {id: "minecraft:generic.armor_resistance", amount: 1, operation: "add_value"}, "head")
	})
})

StartupEvents.registry("item", event => {
	event.create("bubble_cobble:blue_mascot_cat")
			.displayName("Sopping Wet Thing")
			.rarity("rare")
			.tooltip(Text.of(`Shake him comedically for some cool noises!`).color("#83BED9"))
			.useAnimation("brush")
			.useDuration(item_stack => 30)
			.use((level, player, hand) => {
				if (level.isClientSide()) {
					return true
				}

				level.server.scheduleRepeatingInTicks(6, callback => {
					if (player.usingItem && player.useItem.id == "bubble_cobble:blue_mascot_cat") {
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
				entity.potionEffects.add("brewinandchewin:sweet_heart", 5 * SEC)

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
						play_sound_globally(level, mickeon.position(), "minecraft:entity.enderman.teleport", "players")
						play_sound_globally(level, entity.position(), "minecraft:entity.enderman.teleport", "players")
						mickeon.potionEffects.add("minecraft:slow_falling", 3 * SEC, 3, true, false)
						mickeon.teleportTo(level.dimension, entity.x, entity.y, entity.z, mickeon.yaw, mickeon.pitch)
					}
				}
				return item_stack
			})
			.tag("create:upright_on_belt")
	event.create("bubble_cobble:bearded_dragon_bowl")
			.displayName("Bearded Dragon Bowl")
			.unstackable()
			.fireResistant()
			.rarity("epic")
			.use((level, player, hand) => true)
			.tag("create:upright_on_belt")

	event.create("bubble_cobble:banana_mayo_sandwich")
			.name(stack => {
				if (Platform.isClientEnvironment()
				&& Client.player
				&& is_eligible_for_easter_egg(Client.player, "SueTheMimiga")) {
					return Text.of(`Banana Mayo Delicacy 😳`)
				}
				return "Banana and Mayo Sandwich"
			})
			.food(f => f
					.nutrition(8)
					.saturation(0.25)
			)
	event.create("bubble_cobble:doublemint_gum")
			.displayName("Doublemint™ Gum")
			.food(f => f
					.nutrition(1)
					.saturation(0.25)
					.eatSeconds(0.25)
					.alwaysEdible()
					.effect("brewinandchewin:sweet_heart", 30, 0, 1)
			)
			.maxStackSize(63)
			.rarity("uncommon")
			.jukeboxPlayable("bubble_cobble:mint")
	event.create("bubble_cobble:horse_urine_bottle")
			.maxStackSize(16)
			.tooltip(Text.of(`dude`).darkGray().italic())
			.tag("c:drinks")
			.tag("c:drinks/juice")
			.tag("c:potions/bottle")
			.useAnimation("drink")
			.food(f => f
					.alwaysEdible()
					.effect("minecraft:nausea", 5 * SEC, 0, 1.0)
					.effect("minecraft:nausea", 20 * SEC, 0, 0.75)
					.effect("bubble_cobble:girl_power", 30 * SEC, 0, 0.5)
			)
			.createItemProperties()
					.craftRemainder("minecraft:glass_bottle")
	event.create("bubble_cobble:super_ghostbusters")
			.displayName("Super Ghostbusters")
			.unstackable()
			.rarity("rare")
			.tooltip(Text.of(`Why the fuck is all the modpack full of ghost?`).color("#83BED9"))
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
			.jukeboxPlayable("bubble_cobble:ghostbusters")
})

StartupEvents.modifyCreativeTab("minecraft:food_and_drinks", event => {
	event.add([
		Item.of("bubble_cobble:blue_mascot_cat"),
		Item.of("bubble_cobble:banana_mayo_sandwich"),
		Item.of("create:rose_quartz"),
		Item.of("create:polished_rose_quartz"),
		Item.of("biomesoplenty:cattail"),
		Item.of("biomeswevegone:cattail_sprout"),
		Item.of("biomeswevegone:fluorescent_cattail_sprout"),
		Item.of("bubble_cobble:horse_urine_bottle"),
	])
})

StartupEvents.modifyCreativeTab("kubejs:tab", event => {
	event.remove(Item.of("bubble_cobble:bearded_dragon_bowl"))
	event.add(Item.of("bubble_cobble:bearded_dragon_bowl").withCustomName("Banana"))
	event.add(Item.of("bubble_cobble:bearded_dragon_bowl").withCustomName("Baby Dandy"))
	event.remove("bubble_cobble:doublemint_gum") // Sssh.
})

StartupEvents.registry("attribute", event => {
	event.create("bubble_cobble:dash_jump_count")
		.attachToPlayers()
		.range(0, 0, 128)
		.sentiment("positive")
		.displayName(Text.of(`Air Dash`)
	)
})

if (Platform.isClientEnvironment()) {
	KeyBindEvents.registry(event => {
		event.register("bubble_cobble.dash", "MOUSE_BUTTON_4").inputType("mouse").inGame().category("Bubble Cobble")
	})
}

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
/** @param {import("@package/net/minecraft/server").$MinecraftServer} server */
function find_mickeon(server) {
	const player_list = server.getPlayerList()
	return player_list.getPlayerByName("Mickeon")
}


StartupEvents.registry("cat_variant", event => {
	event.createCustom("bubble_cobble:pipi", () => new $CatVariant("bubble_cobble:textures/entity/cat/pipi.png"))
})

// Put Skillet on your head with some really shoddy code.
NativeEvents.onEvent($ItemStackedOnOtherEvent, event => {
	// console.log(event.slot.getSlotIndex())
	if (event.carriedItem.isEmpty()
	&& event.stackedOnItem.id == "farmersdelight:skillet"
	&& event.clickAction == "SECONDARY"
	) {
		event.player.inventory.insertItem(event.player.getEquipment("head").copyAndClear(), false)
		event.player.setEquipment("head", event.stackedOnItem.copyAndClear())
		event.setCanceled(true)
	}
	if (event.carriedItem.id == "farmersdelight:skillet" && event.slot.getSlotIndex() == 39) {
		event.player.inventory.insertItem(event.slot.item.copyAndClear(), false)
		event.slot.set(event.carriedItem.copyAndClear())
		event.setCanceled(true)
	}
})
