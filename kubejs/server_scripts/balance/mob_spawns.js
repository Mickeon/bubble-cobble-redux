// requires: enhancedcelestials

// Do not ever spawn Slimes or Bats naturally in Flat World.
const NO_FLAT_WORLD_MOBS = ["minecraft:slime", "minecraft:bat", "cnc:giant_boar", "cnc:white_tailed_deer"]
NO_FLAT_WORLD_MOBS.forEach(entity_type => {
	EntityEvents.checkSpawn(entity_type, event => {
		if (event.server.worldData.isFlatWorld() && event.type != "SPAWN_EGG") {
			event.cancel()
		}
	})
})

// https://github.com/CorgiTaco-MC/Enhanced-Celestials/blob/1.21.X/Common/src/main/java/dev/corgitaco/enhancedcelestials/lunarevent/EnhancedCelestialsLunarForecastWorldData.java
/** @type {typeof import("dev.corgitaco.enhancedcelestials.EnhancedCelestials").$EnhancedCelestials } */
let $EnhancedCelestials = Java.loadClass("dev.corgitaco.enhancedcelestials.EnhancedCelestials")

function is_lunar_event_happening(level) {
	const forecast = $EnhancedCelestials.lunarForecastWorldData(level).orElse(null)
	return forecast && forecast.currentLunarEventHolder().is(forecast.getDimensionSettings().defaultEvent())
}

// Do not spawn most hostiles naturally under the skylight.
// Allow them to spawn with a bit of skylight during a Lunar Event.

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
		if (event.level.isOverworld() && event.block.getSkyLight() >= 1 && event.type == "NATURAL") {
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

// EntityEvents.checkSpawn("minecraft:enderman", event => {
// 	if (event.block.getSkyLight() >= 1 && event.type == "NATURAL" && Utils.getRandom().nextFloat() > 0.3) {
// 		// console.log(`Trying to spawn ${event.entity.type}, but chance said no!`)
// 		event.cancel()
// 	}
// })

// After the above changes, a lot of Spiders spawn on the surface. Rectify that.
EntityEvents.checkSpawn("minecraft:spider", event => {
	if (event.block.getSkyLight() >= 1 && event.type == "NATURAL" && event.level.getRandom().nextFloat() > 0.1) {
		// console.log(`Trying to spawn ${event.entity.type}, but chance said no!`)
		event.cancel()
	}
})
