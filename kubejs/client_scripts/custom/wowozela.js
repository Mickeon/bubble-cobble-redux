
/**
 * @import {$SoundEvent} from "@package/net/minecraft/sounds"
 * @import {$ScheduledEvents$ScheduledEvent} from "@package/dev/latvian/mods/kubejs/util"
 */

ItemEvents.modifyTooltips(event => {
	event.modify("bubble_cobble:wowozela", text => {
		text.dynamic("wowozela_sound")
	})
})

ItemEvents.dynamicTooltips("wowozela_sound", event => {
	let custom_data = event.item.getCustomData()
	let sound_event_id = custom_data.getString("sound")
	let sound_event = Client.soundManager.getSoundEvent(sound_event_id)
	if (sound_event) {
		let subtitle = sound_event.getSubtitle() || "some special tunes"
		event.lines.add(2, Text.translateWithFallback("", "Sounds like %s", Text.of(subtitle).aqua()).color(MASCOT_COLOR_DARK))
	}

})

/** @typedef {ReturnType<typeof WowozelaBuilder>} Wowozela  */
const WowozelaBuilder = function(player, sound_event) {
	return {
		player: /** @type {$ClientPlayer} */ (player),
		sound_event: /** @type {$SoundEvent} */ (sound_event),
		loop: /** @type {$ScheduledEvents$ScheduledEvent} */ (null)
	}
}
const WowozelaManager = {
	DEFAULT_SOUND_EVENT: Utils.getSound("minecraft:block.note_block.flute"),
	players: /** @type {Record<string, Wowozela>} */ ({}),
	put: /** @param {$Player} player */ function(player, sound) {
		let uuid = player.getStringUuid()
		if (this.players[uuid]) {
			this.remove(player)
		}
		let sound_event = Utils.getSound(sound) || this.DEFAULT_SOUND_EVENT
		this.players[uuid] = WowozelaBuilder(player, sound_event)
		this.players[uuid].loop = Client.scheduleRepeatingInTicks(1, () => this.play_loop(this.players[uuid]))
		this.play_loop(this.players[uuid])
	},
	remove: /** @param {$Player} player */ function(player) {
		let uuid = player.getStringUuid()
		if (!this.players[uuid]) {
			return
		}
		this.players[uuid].loop.clear()
		delete this.players[uuid]
	},
	play_loop: /** @param {Wowozela} wowozela */ function(wowozela) {
		let $FastColor$ABGR32 = Java.loadClass("net.minecraft.util.FastColor$ABGR32");
		let $Mth = Java.loadClass("net.minecraft.util.Mth")

		let player = wowozela.player
		if (!player.isUsingItem()) {
			// Compromise. `releaseUsing` does not get called when switching item while holding use.
			this.remove(player)
			return
		}

		let eye_pitch = player.getPitch()
		let percent = (-eye_pitch + 90) / 180;
		if (player.isShiftKeyDown()) {
			percent = (Math.floor(percent * 24) / 24) // Snap to semitones.
		}
		let color = $Mth.hsvToRgb($Mth.frac(percent + 0.333), 1, 1)
		let red = ($FastColor$ABGR32.red(color) / 255)
		let green = ($FastColor$ABGR32.green(color) / 255)
		let blue = ($FastColor$ABGR32.blue(color) / 255)

		// let position = player.getEyePosition().add(player.getViewVector(0).scale(0.5))
		// let direction = player.getViewVector(0)
		// level.spawnParticles(`create:cube{hot:true,avg_age:40,scale:0.1,r:${red},g:${green},b:${blue}}`, true,
		// 		position.x(), position.y(), position.z(),
		// 		direction.x(), direction.y(), direction.z(), 0, 0.1)
		// let position = player.getEyePosition().add(player.getViewVector(0).scale(4))
		// let direction = player.getViewVector(0).scale(2)
		// let particle = Client.particleEngine.createParticle(`minecraft:dust{color:[${red},${green},${blue}],scale:${1.5}}`,
				// position.x(), position.y(), position.z(),
				// direction.x(), direction.y(), direction.z()
		// )
		// let delta = Client.getTimer().getGameTimeDeltaTicks()

		let position = player.getEyePosition().add(player.getViewVector(0).scale(0.5))
		let direction = player.getViewVector(0).scale(1)
		let particle = Client.particleEngine.createParticle(`minecraft:dust_plume`,
				position.x(), position.y(), position.z(),
				direction.x(), direction.y(), direction.z()
		)
		particle.setColor(red, green, blue)
		particle.setParticleSpeed(direction.x(), direction.y(), direction.z())
		particle.scale(2)
		particle.setLifetime(200)

		let sound_event = wowozela.sound_event
		let sound_pitch = Math.pow(2.0, percent * 2 - 1)
		player.playSound(sound_event, 0.25, sound_pitch)
	},
}


NetworkEvents.dataReceived("bubble_cobble:start_wowozela", event => {
	let player = event.level.getPlayerByUUID(event.data.getString("uuid"))
	if (!player) {
		return
	}
	WowozelaManager.put(player, event.data.getString("sound"))
})

NetworkEvents.dataReceived("bubble_cobble:stop_wowozela", event => {
	let player = event.level.getPlayerByUUID(event.data.getString("uuid"))
	if (!player) {
		return
	}
	WowozelaManager.remove(player)
})
