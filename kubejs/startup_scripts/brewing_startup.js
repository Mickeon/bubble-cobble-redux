// requires: brewinandchewin
/** @type {typeof import("net.minecraft.world.entity.projectile.ThrowableItemProjectile").$ThrowableItemProjectile } */
let $ThrowableItemProjectile  = Java.loadClass("net.minecraft.world.entity.projectile.ThrowableItemProjectile")
/** @type {typeof import("net.neoforged.neoforge.event.entity.ProjectileImpactEvent").$ProjectileImpactEvent } */
let $ProjectileImpactEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.ProjectileImpactEvent")
/** @type {typeof import("net.minecraft.world.entity.projectile.Projectile").$Projectile } */
let $Projectile  = Java.loadClass("net.minecraft.world.entity.projectile.Projectile")
/** @type {typeof import("net.minecraft.world.level.Level").$Level } */
let $Level  = Java.loadClass("net.minecraft.world.level.Level")
/** @type {typeof import("net.minecraft.world.item.ItemStack").$ItemStack } */
let $ItemStack  = Java.loadClass("net.minecraft.world.item.ItemStack")
/** @type {typeof import("net.minecraft.world.item.Item$Properties").$Item$Properties } */
let $Item$Properties  = Java.loadClass("net.minecraft.world.item.Item$Properties")
/** @type {typeof import("umpaz.brewinandchewin.common.item.BoozeItem").$BoozeItem } */
let $BoozeItem  = Java.loadClass("umpaz.brewinandchewin.common.item.BoozeItem")
/** @type {typeof import("dev.latvian.mods.kubejs.item.ItemBuilder").$ItemBuilder } */
let $ItemBuilder  = Java.loadClass("dev.latvian.mods.kubejs.item.ItemBuilder")

/**
 * @import {$ItemStack} from "net.minecraft.world.item.ItemStack"
 * @import {$Level} from "net.minecraft.world.level.Level"
 * @import {$LivingEntity} from "net.minecraft.world.entity.LivingEntity"
 * @import {$Projectile} from "net.minecraft.world.entity.projectile.Projectile"
 * @import {$RegistryKubeEvent} from "dev.latvian.mods.kubejs.registry.RegistryKubeEvent"
 */

const SEC = 20
const MIN = SEC * 60


StartupEvents.registry("fluid", event => {
	event.create("sweet_berry_wine", "kubejs:thin").tint("red").noBucket().displayName("Sweet Berry Wine")
	event.create("honey_liqueur", "kubejs:thin").tint("brown").noBucket().displayName("honey Liqueur")
	event.create("spumante", "kubejs:thin").tint("lime").noBucket().displayName("Spumante")
	event.create("sparkling_rose", "kubejs:thin").tint("yellow").noBucket().displayName("Sparkling Rosé")
	event.create("berry_juice_soda", "kubejs:thin").tint("light_blue_dye").noBucket().displayName("Berry Juice Soda")
	event.create("firebomb_whiskey", "kubejs:thin").tint("dark_red").noBucket().displayName("Firebomb Whiskey")

})

StartupEvents.registry("item", event => {
	create_wine(event, "sweet_berry_wine", (new $FoodBuilder())
			.effect("brewinandchewin:tipsy", 1 * MIN, 0, 1.0)
			.saturation(3)
			.nutrition(1)
	)
	create_wine(event, "honey_liqueur", (new $FoodBuilder())
			.effect("brewinandchewin:tipsy", 1 * MIN, 0, 1.0)
			.effect("minecraft:dolphins_grace", 5 * MIN, 2, 1.0)
			.effect("minecraft:luck", 3 * MIN, 1, 1.0)
	)
	create_wine(event, "spumante", (new $FoodBuilder())
			.effect("brewinandchewin:tipsy", 3 * MIN, 1, 1.0)
			.effect("minecraft:water_breathing", 5 * MIN, 0, 1.0)
			.effect("minecraft:haste", 5 * MIN, 2, 1.0)
	)
	create_wine(event, "sparkling_rose", (new $FoodBuilder())
			.effect("brewinandchewin:tipsy", 5 * MIN, 0, 1.0)
			.effect("minecraft:glowing", 8 * MIN, 1, 1.0)
			.effect("minecraft:night_vision", 5 * MIN, 1, 1.0)
	)

	event.create("berry_juice_soda")
			.displayName("Berry Juice Soda")
			.tooltip(Text.gray("Clears all negative effects."))
			.tooltip(Text.green("Rated E for everybody!"))
			.useAnimation("drink")
			.maxStackSize(16)
			.food(f => f
					.nutrition(2)
					.saturation(1)
					.alwaysEdible()
					.effect("farmersdelight:comfort", 5 * MIN, 0, 1.0)
					.effect("minecraft:slowness", 0.1 * MIN, 20, 1.0)
					.usingConvertsTo(Item.of("minecraft:glass_bottle"))
			)
			.finishUsing((item_stack, level, entity) => {
				entity.activeEffectsMap.forEach(
					(effect, effect_instance) => {
					if (!effect.value().beneficial) {
						effect_instance.duration = 1
					}
				})

				entity.eat(level, item_stack)
				// entity.potionEffects.add("alexscaves:stunned", 3 * SEC, 0, false, false)
				return item_stack
			})
	event.create("firebomb_whiskey")
			.displayName("Firebomb Whiskey")
			.tooltip([Text.gray("With an "), Text.gold("fiery"), Text.gray(" aftertaste.")])
			.useAnimation("bow")
			.maxStackSize(16)
			.food(f => f
					.nutrition(2)
					.saturation(0.5)
					.effect("brewinandchewin:tipsy", 1 * MIN, 0, 1.0)
					.usingConvertsTo(Item.of("minecraft:glass_bottle"))
				)
			.useDuration((item_stack) => 30)
			.use((level, player, hand) => true)
			.releaseUsing((item_stack, level, entity, tick) => global.release_firebomb_whiskey(item_stack, level, entity, tick))
			.finishUsing((item_stack, level, entity) => global.finish_using_firebomb_whiskey(item_stack, level, entity))

})


/**
 * @param {$RegistryKubeEvent} event
 * @param {string} id
 * @param {$FoodBuilder} f
 */
function create_wine(event, id, f) {
	f.alwaysEdible()
	event.createCustom(id, () =>
		new $BoozeItem(
			() => Fluid.getType("minecraft:water"), // TODO: Weird. What was this for again?
			new $Item$Properties()
					.stacksTo(16)
					.craftRemainder("minecraft:glass_bottle")
					.food(f.build())
		)
	)
}


NativeEvents.onEvent($ProjectileImpactEvent, event => {
	if (event.entity.level.isClientSide()) {
		return
	}
	const projectile = event.getProjectile()
	if (!(projectile instanceof $ThrowableItemProjectile)) {
		return
	}

	if (projectile.item.id != "kubejs:firebomb_whiskey") {
		return
	}

	// projectile.playSound("minecraft:block.glass.break", 2, 1)
	projectile.playSound("cobblemon:impact.fire", 2, 1)

	const hit_point = event.getRayTraceResult().getLocation()
	const hit_block = projectile.level.getBlock(hit_point)

	let aabb = AABB.CUBE.move(hit_point.x(), hit_point.y(), hit_point.z()).inflate(3)

	const explosion = hit_block.explode({
		causesFire: true,
		mode: "none",
		strength: 1.5,
		explosionSound: "cobblemon:poke_ball.shiny_send_out", // Does not play, but shuts the default explosion.
		damageSource: new DamageSource("minecraft:on_fire", projectile, projectile.owner),
		source: projectile.owner
	})

	const entities_in_range = projectile.level.getEntitiesWithin(aabb)
	entities_in_range.forEach(entity => {
		entity.attack(new DamageSource("minecraft:on_fire", projectile, projectile.owner), 2)
		entity.setRemainingFireTicks(100)
	})
	// projectile.kill()
	// event.setCanceled(true)
})

// Using global allows these functions to be reloaded with /kubejs reload.
/**
 * @param {$ItemStack} item_stack
 * @param {$Level} level
 * @param {$LivingEntity} entity
 * @param {number} remaining_ticks
 */
global.release_firebomb_whiskey = function(item_stack, level, entity, remaining_ticks) {
	const speed = remap(remaining_ticks, 30, 0, 0.75, 1.25)

	/**@type {$Projectile} */
	const projectile = level.createEntity("minecraft:potion")
	projectile.mergeNbt({Item: Item.of("kubejs:firebomb_whiskey")})
	projectile.x = entity.x
	projectile.y = entity.eyeY
	projectile.z = entity.z
	projectile.owner = entity

	const movement = entity.lookAngle

	projectile.setDeltaMovement(movement.scale(speed))
	projectile.spawn()
	entity.playSound("minecraft:entity.splash_potion.throw")

	if (entity instanceof $Player) {
		entity.addItemCooldown(item_stack.getItem(), 10)

		if (!entity.isCreative()) {
			item_stack.shrink(1)
		}
	}

}

/**
 * @param {$ItemStack} item_stack
 * @param {$Level} level
 * @param {$LivingEntity} entity
 */
global.finish_using_firebomb_whiskey = function(item_stack, level, entity) {
	// entity.statusMessage = "OWch"
	// console.log("WOCHH")
	entity.playSound("supplementaries:block.jar.break")
	entity.playSound("minecraft:entity.witch.drink")
	entity.setRemainingFireTicks(100)
	if (entity instanceof $Player) {
		entity.addItemCooldown(item_stack.getItem(), 10)
	}
	return entity.eat(level, item_stack)
}

/** @param {number} value @param {number} min1 @param {number} max1  @param {number} min2 @param {number} max2 */
function remap(value, min1, max1, min2, max2) {
	let value_norm = (value - min1) / (max1 - min1) // Inverse linear interpolation function.
	return min2 + (max2 - min2) * value_norm // Linear interpolation function.
}

