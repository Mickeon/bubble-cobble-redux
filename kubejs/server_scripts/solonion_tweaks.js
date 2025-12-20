// priority: 10
// requires: solonion
// requires: pehkui

/** @type {typeof import("team.creative.solonion.api.SOLOnionAPI").$SOLOnionAPI } */
const SOLOnionAPI = Java.loadClass("team.creative.solonion.api.SOLOnionAPI")
/** @type {typeof import("virtuoel.pehkui.api.ScaleTypes").$ScaleTypes } */
const ScaleTypes = Java.loadClass("virtuoel.pehkui.api.ScaleTypes")
const MAX_DIVERSITY = 32.0
const LOSS_LIMIT = 0.2
const MINING_SPEED_THRESHOLD = 18
const REGENERATION_THRESHOLD = 7

// Tweaks to hunger system, featuring Spice of Life: Onion:
// - At high food diversity, exhaustion increases slower, as such saturation drains slower.
// - Starving is very funny.
EntityEvents.spawned("minecraft:player", event => {
	const player = event.player
	const server = player.server
	/** @type {$ScheduledEvents$ScheduledEvent} */
	let starve_event = null

	let prior_exhaustion = player.getFoodData().getExhaustionLevel()

	const mining_speed_scale = player.pehkui_getScaleData(ScaleTypes.MINING_SPEED)

	const is_candle = player.username == "CandleClockwork"
	const super_starve_starting_tick_rate = 60
	const super_starve_lowest_tick_rate = is_candle ? 2 : 40

	server.scheduleRepeatingInTicks(20, callback => {
		// if (player.isRemoved() || !SOLOnionAPI.isPresent(player) || !player.isAlive()) {
		// if (player.isRemoved() || !player.isAlive()) {
		if (!player.isAlive()) {
			callback.clear()
			console.log(`Clearing SoL callback for ${player.username}`)
			return
		}

		let food_diversity = SOLOnionAPI.getFoodCapability(player).foodDiversity(player)
		if (player.health < player.maxHealth) {
			let regen_amount = clamp(remap(food_diversity, REGENERATION_THRESHOLD, MAX_DIVERSITY, 0.0, 0.8), 0.0, 0.8)
			player.health += regen_amount
		}

		// Super starvation.
		if (player.foodLevel <= 1.0 && starve_event == null) {
			console.log(`Beginning to starve for ${player.username}`)
			starve_event = server.scheduleRepeatingInTicks(super_starve_starting_tick_rate, _callback => {
				if (player.isRemoved() || player.foodLevel > 1.0 || !player.isAlive()) {
					starve_event.clear()
					starve_event = null
					console.log(`Clearing SoL Super Starvation callback for ${player.username}`)
					return
				}
				// As more time passes, damage happens more frequently, within reason...
				server.runCommandSilent(`damage ${player.uuid} 0.01 minecraft:starve`)
				if (starve_event.timer > super_starve_lowest_tick_rate) {
					starve_event.timer -= 1
				}

				if (is_candle) {
					if (starve_event.timer <= 4) {
						server.runCommandSilent(`effect give ${player.username} minecraft:speed 1 5 true`)
						if (player.isCreative() || player.isSpectator()) {
							server.runCommandSilent(`gamemode survival ${player.username}`)
							server.runCommandSilent(`execute at ${player.username} run playsound minecraft:entity.goat.screaming.ambient player ${player.username}`)
							server.runCommandSilent(`title ${player.username} times 2 20 2`)
							server.runCommandSilent(`title ${player.username} title {"text":"mimmy help"}`)
						}
					}

				}
			})

		}

		if (player.foodLevel <= 6.0
		|| player.health < player.maxHealth
		|| player.isPassenger()
		|| player.hasEffect("minecraft:hunger")) {
			return // No benefits.
		}

		let current_exhaustion = player.getFoodData().getExhaustionLevel()

		let usual_loss = Math.max(current_exhaustion - prior_exhaustion, 0)
		if (usual_loss <= 0.0) {
			prior_exhaustion = current_exhaustion
			return
		}
		// We give all exhaustion back to compensate the usual loss by performing actions.
		player.getFoodData().setExhaustion(prior_exhaustion)

		// Then we do our own thing.
		let loss = usual_loss * clamp(remap(food_diversity, 0.0, MAX_DIVERSITY, 1.0, LOSS_LIMIT), LOSS_LIMIT, 1.0)
		// console.log(`Multiplied loss by ${loss / usual_loss} for ${player.name}`)
		player.addExhaustion(loss)


		prior_exhaustion = current_exhaustion

		// if (player.hasEffect("brewinandchewin:tipsy") && player.random.nextInt(4) == 0) {
		// 	player.giveExperiencePoints(Math.min(player.getEffect("brewinandchewin:tipsy").amplifier + 1, 3))
		// }

		// mining_speed_scale.setScale(clamp(remap(food_diversity, MINING_SPEED_THRESHOLD, MAX_DIVERSITY, 1.0, 2.0), 1.0, 2.0))
		mining_speed_scale.setScale(food_diversity >= MINING_SPEED_THRESHOLD ? 1.2 : 1.0)

		// Utils.server.tell(`${String(usual_loss).substring(0, 4) } => ${String(loss).substring(0, 4)}`)
	})

})

ServerEvents.tags("damage_type", event => {
	event.add("minecraft:bypasses_invulnerability", "minecraft:starve") // I know you.
})
