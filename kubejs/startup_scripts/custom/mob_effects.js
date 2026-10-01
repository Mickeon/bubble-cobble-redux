let $RegisterBrewingRecipesEvent = Java.loadClass("net.neoforged.neoforge.event.brewing.RegisterBrewingRecipesEvent")

StartupEvents.registry("mob_effect", event => {
	event.create("bubble_cobble:begone")
		.color("#AEFFF8")
		.instant()
		.effectTick(entity => global.begone_effect(entity))
	event.create("bubble_cobble:girl_power")
		.color("#FFAEE0")
		.beneficial()
})

StartupEvents.registry("potion", event => {
	event.create("bubble_cobble:begone").effect("bubble_cobble:begone")
	event.create("bubble_cobble:girl_power").effect("bubble_cobble:girl_power", 5 * MIN, 1)
})

NativeEvents.onEvent($RegisterBrewingRecipesEvent, event => {
	event.builder.addRecipe(`potion[minecraft:potion_contents={"potion":"minecraft:awkward"}]`, "#c:ender_pearls", `minecraft:potion[minecraft:potion_contents={"potion":"bubble_cobble:begone"}]`)
	event.builder.addRecipe("bubble_cobble:horse_urine_bottle", "cobblemon:carbos" , `minecraft:potion[minecraft:potion_contents={"potion":"bubble_cobble:girl_power"}]`)
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
	entity.removeEffect("bubble_cobble:begone")
}
