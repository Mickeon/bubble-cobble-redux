// priority: 1000

/**
 * @import {$Player} from "net.minecraft.world.entity.player.Player"
 * @import {$ServerPlayer} from "net.minecraft.server.level.ServerPlayer")
 * @import {$ItemStack} from "net.minecraft.world.item.ItemStack"
 * @import {$ScheduledEvents$ScheduledEvent} from "dev.latvian.mods.kubejs.util.ScheduledEvents$ScheduledEvent"
 * @import {$PotionContents} from "net.minecraft.world.item.alchemy.PotionContents"
 * @import {$Entity} from "net.minecraft.world.entity.Entity"
 * @import {$Level} from "net.minecraft.world.level.Level
 * @import {$SoundSource$$Type} from "net.minecraft.sounds.SoundSource"
 */

const SEC = 20 // How many ticks in a second.
const MIN = SEC * 60 // How many ticks in a minute.

/** @param {number} value @param {number} min1 @param {number} max1 @param {number} min2 @param {number} max2 */
function remap(value, min1, max1, min2, max2) {
	let value_norm = (value - min1) / (max1 - min1) // Inverse linear interpolation function.
	return min2 + (max2 - min2) * value_norm // Linear interpolation function.
}

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max)
}

/** @param {Array} array @returns {string} */
function pick_random(array) {
	return array[Math.floor(Math.random() * array.length)]
}

/**
 * @description Plays a sound for every player. This is unlike Player.playNotifySound() which only plays the sound to a specific player.
 * This function exists because:
 * - Level.playSound() is intended to be executed by the client and server individually.
 *   In that function, the first parameter denotes who the server should NOT play the sound to, so both client and server do not overlap. This is undesirable if most of the logic is entirely server-side.
 *   For similar reasons, Player.playSound() also doesn't work on the local player.
 * - From KubeJS (& Rhino), the function call has ambiguous parameter types and needs to be converted into the abomination below.
 * @see https://lexxie.dev/neoforge/1.21.1/net/minecraft/world/level/Level.html#playSound(net.minecraft.world.entity.Entity,net.minecraft.core.BlockPos,net.minecraft.sounds.SoundEvent,net.minecraft.sounds.SoundSource,float,float)
 * @param {$Level} level @param {$Vec3} pos @param {Special.SoundEvent} sound_event @param {$SoundSource$$Type} source @param {number?} pitch @param {number?} volume
 */
function play_sound_globally(level, pos, sound_event, source, volume, pitch) {
	volume = volume || 1.0
	pitch = pitch || 1.0

	level["playSound(net.minecraft.world.entity.player.Player,double,double,double,net.minecraft.sounds.SoundEvent,net.minecraft.sounds.SoundSource,float,float)"]
			(null, pos.x(), pos.y(), pos.z(), sound_event, source, volume, pitch)
}
/**
 * @description A shorthand for play_sound_globally when an entity (and therefore player!) plays a sound.
 * @param {$Entity} entity @param {Special.SoundEvent} sound_event @param {$SoundSource$$Type} source @param {number?} pitch @param {number?} volume
 */
function play_sound_at_entity(entity, sound_event, source, volume, pitch) {
	play_sound_globally(entity.level, entity.position(), sound_event, source, volume, pitch)
}

/**
 * @description Returns `true` if the given player matches one or more usernames. Always returns `true` in singleplayer. Intended for funny consequences.
 * @param {$Player} player @param {string | Array<string>} usernames
 */
function is_eligible_for_easter_egg(player, usernames) {
	if (player.server.isSingleplayer()) {
		return true
	}
	if (typeof usernames === "string") {
		return player.username == usernames
	}
	return usernames.includes(player.username)
}

/** @private */ const DASH_STARTERS = [
	"AceNil_",
	"LuckyAquapura",
	"BlueBerryNice",
	"CafeJaze",
	"CantieLabs",
	"Giuly_Clockwork",
	"Fableworks",
	"LabbyRosenfeld",
	"mAIgehound",
	"SueTheMimiga",
	"pepperponyo",
	"WaiGee",
]

/** @param {$Player} player */
function has_bonus_dash(player) {
	return is_eligible_for_easter_egg(player, DASH_STARTERS)
}