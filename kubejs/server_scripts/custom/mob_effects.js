
const GIRL_POWER_EFFECT = Registry.of("mob_effect").get("bubble_cobble:girl_power")
if (GIRL_POWER_EFFECT) {
let $MobEffectEvent$Added = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added")
let $MobEffectEvent$Expired = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Expired")
let $MobEffectEvent$Remove = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove")

NativeEvents.onEvent($MobEffectEvent$Added, event => {
	if (event.effectInstance && event.effectInstance.is(GIRL_POWER_EFFECT)) {
		event.entity.modifyAttribute("bubble_cobble:dash_jump_count", "bubble_cobble:girl_power_effect", event.effectInstance.amplifier + 1, "add_value")
	}
})

NativeEvents.onEvent($MobEffectEvent$Expired, event => {
	if (event.effectInstance && event.effectInstance.is(GIRL_POWER_EFFECT)) {
		event.entity.removeAttribute("bubble_cobble:dash_jump_count", "bubble_cobble:girl_power_effect")
	}
})

NativeEvents.onEvent($MobEffectEvent$Remove, event => {
	if (event.effectInstance && event.effectInstance.is(GIRL_POWER_EFFECT)) {
		event.entity.removeAttribute("bubble_cobble:dash_jump_count", "bubble_cobble:girl_power_effect")
	}
})

ItemEvents.entityInteracted("minecraft:potion", event => {
	if (event.target.type != "cobblemon:pokemon") {
		return
	}

	const pokemon_entity = /** @type {$PokemonEntity} */ (event.target)
	const pokemon = pokemon_entity.pokemon
	const item = event.item
	const player = /** @type {$Player} */ (event.entity)

	const current_contents = /** @type {$PotionContents} */ (item.getComponents().get("minecraft:potion_contents"))
	if (!current_contents.is("bubble_cobble:girl_power")) {
		return
	}

	// Try to change gender.
	const previous_gender = pokemon.gender
	pokemon.gender = pokemon.gender == "female" ? "male" : "female"
	if (pokemon.gender == previous_gender) {
		// Either genderless or limited. Either way, nothing changed.
		player.playNotifySound("bubble_cobble:ui.buzz", "players", 1.0, 1.0)
		return
	}

	if (!player.isCreative()) {
		item.consume(1, pokemon_entity)
	}

	pokemon_entity.playSound("bubble_cobble:crash.life_got", 0.25, 1.0)
	pokemon_entity.playAmbientSound()

	const is_male_to_female = pokemon.gender == "female"
	const from_color = is_male_to_female ? "[0.8, 0.8, 1.0]" : "[1.0, 0.8, 1.0]"
	const to_color = is_male_to_female ? "[1.0, 0.0, 1.0]" : "[0.0, 0.1, 1.0]"
	const particle_box = pokemon_entity.boundingBox.deflate(0.5)
	pokemon_entity.level.spawnParticles(`minecraft:dust_color_transition{from_color:${from_color}, to_color:${to_color}, scale: 3.0}`, false,
		particle_box.center.x(), particle_box.center.y(), particle_box.center.z(),
		particle_box.xsize, particle_box.ysize, particle_box.zsize, 40, 0.5
	)

	event.success()
})
}