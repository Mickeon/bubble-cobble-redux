
/** @type {typeof import("com.cobblemon.mod.common.api.events.CobblemonEvents").$CobblemonEvents } */
let $CobblemonEvents  = Java.loadClass("com.cobblemon.mod.common.api.events.CobblemonEvents")

ItemEvents.modification(event => {
	event.modify(["minecraft:potion", "minecraft:splash_potion", "minecraft:lingering_potion"], /** @param {ItemModifications} item */ item => {
		item.maxStackSize = 12
	})

	// Lower how much time it takes to eat food in general.
	event.modify(i => Boolean(i.getFoodProperties(null)), /** @param {$ItemModifications} modified */ modified => {
		const item = modified.item()
		const food_properties = item.getFoodProperties(Item.of(item), null)
		if (food_properties.eatSeconds() <= 0.0) {
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
				e.effect().getEffect().getKey(),
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

	/** @param {$Item} item  @param {number} max_damage */
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

	// Make Sandpaper last double as much.
	set_max_damage("create:sand_paper", 16)
	set_max_damage("create:red_sand_paper", 16)

	// TODO: Embed Fortune/Looting II into Golden tools (This is derived from Quark).
	// Enchantments are not registered at this stage, so it's not possible like this.
	// event.modify(["minecraft:golden_pickaxe", "minecraft:golden_axe", "minecraft:golden_shovel", "minecraft:golden_hoe", "minecraft:golden_sword", "farmersdelight:golden_knife"], /** @param {$ItemModifications} modified */ modified => {
	// 	modified.resetComponents().set("minecraft:enchantments", {fortune:2,looting:2})
	// })
})

// Pokemon Egg hatching effect.
if (global.on_hatch_egg_pre) {
	global.on_hatch_egg_pre.unsubscribe()
}
global.on_hatch_egg_pre = $CobblemonEvents.HATCH_EGG_PRE.subscribe(event => {
	const player = event.player
	if (!player) {
		return
	}

	player.playNotifySound("minecraft:block.sniffer_egg.hatch", "neutral", 1.0, player.getRandom().triangle(1.0, 0.2))
	player.level.spawnParticles(`minecraft:item{item:{id: "cobbreeding:pokemon_egg"}}`, false, player.x, player.eyeY, player.z, 0.1, 0.1, 0.1, 20, 0.2)

	const pokemon = event.egg
	if (pokemon && pokemon.getShiny()) {
		player.playNotifySound("minecraft:entity.firework_rocket.twinkle", "neutral", 1.0, player.getRandom().triangle(1.5, 0.2))
		player.level.spawnParticles("biomeswevegone:borealis_glint", false, player.x, player.eyeY, player.z, 0.1, 0.1, 0.1, 60, 1)
	}
})

