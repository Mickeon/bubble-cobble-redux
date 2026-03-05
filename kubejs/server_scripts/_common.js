// priority: 1000

/**
 * @import {$ServerPlayer} from "net.minecraft.server.level.ServerPlayer"
 * @import {$ItemStack} from "net.minecraft.world.item.ItemStack"
 * @import {$ScheduledEvents$ScheduledEvent} from "dev.latvian.mods.kubejs.util.ScheduledEvents$ScheduledEvent"
 * @import {$PotionContents} from "net.minecraft.world.item.alchemy.PotionContents"
 * @import {$Entity} from "net.minecraft.world.entity.Entity"
 * @import {$Level} from "net.minecraft.world.level.Level
 * @import {$SoundSource$$Type} from "net.minecraft.sounds.SoundSource"
 */

/** @import {global} from "./../startup_scripts/_common" */
const {SEC, MIN, play_sound_globally, remap, is_eligible_for_easter_egg} = global

// Object.assign(globalThis, global)
// /** @typedef {(value: number, min1: number, max1: number, min2: number, max2:) => number} RemapFunction */
// const remap = /** @type {RemapFunction} */ (global.remap)

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max)
}

/** @param {Array<T>} array @returns {T} */
function pick_random(array) {
	return array[Math.floor(Math.random() * array.length)]
}

/**
 * @description A shorthand for play_sound_globally when an entity (and therefore player!) plays a sound.
 * @param {$Entity} entity @param {Special.SoundEvent} sound_event @param {$SoundSource$$Type} source @param {number?} pitch @param {number?} volume
 */
function play_sound_at_entity(entity, sound_event, source, volume, pitch) {
	play_sound_globally(entity.level, entity.position(), sound_event, source, volume, pitch)
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