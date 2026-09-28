// priority: 1000

Platform.setModName("kubejs", "Bubble Cobble")
Platform.setModName("bubble_cobble", "Bubble Cobble")

let $Player = Java.loadClass("net.minecraft.world.entity.player.Player")
let $FoodBuilder = Java.loadClass("dev.latvian.mods.kubejs.item.FoodBuilder")
let $ItemAttributeModifiers = Java.loadClass("net.minecraft.world.item.component.ItemAttributeModifiers")

/**
 * @import {RegistryTypes, SpecialTypes} from "@special/types"
 * @import {$List} from "@package/java/util"
 * @import {$ItemStack} from "@package/net/minecraft/world/item"
 * @import {$Player} from "@package/net/minecraft/world/entity/player"
 * @import {$LivingEntity} from "@package/net/minecraft/world/entity"
 * @import {$SoundEvent_, $SoundSource_} from "@package/net/minecraft/sounds"
 *
 * @typedef {import("@package/dev/latvian/mods/kubejs/item").$ItemModificationKubeEvent$ItemModifications} $ItemModifications
 * @typedef {import("@package/dev/latvian/mods/kubejs/block").$BlockModificationKubeEvent$BlockModifications} $BlockModifications
 */

const SEC = 20 // How many ticks in a second.
const MIN = SEC * 60 // How many ticks in a minute.

/** @param {number} value @param {number} min1 @param {number} max1 @param {number} min2 @param {number} max2 */
function remap(value, min1, max1, min2, max2) {
	let value_norm = (value - min1) / (max1 - min1) // Inverse linear interpolation function.
	return min2 + (max2 - min2) * value_norm // Linear interpolation function.
}

/**
 * @description Plays a sound for every player. This is unlike Player.playNotifySound() which only plays the sound to a specific player.
 * @see https://lexxie.dev/neoforge/1.21.1/net/minecraft/world/level/Level.html#playSound(net.minecraft.world.entity.Entity,net.minecraft.core.BlockPos,net.minecraft.sounds.SoundEvent,net.minecraft.sounds.SoundSource,float,float)
 * @param {$Level} level @param {$Vec3} pos @param {$SoundEvent_} sound_event @param {$SoundSource_} source @param {number?} pitch @param {number?} volume
 */
function play_sound_globally(level, pos, sound_event, source, volume, pitch) {
	volume = volume || 1.0
	pitch = pitch || 1.0

	level["playSound(net.minecraft.world.entity.player.Player,double,double,double,net.minecraft.sounds.SoundEvent,net.minecraft.sounds.SoundSource,float,float)"]
			(null, pos.x(), pos.y(), pos.z(), sound_event, source, volume, pitch)
}

/**
 * @description Returns `true` if the given player matches one or more usernames. Always returns `true` in singleplayer. Intended for funny consequences.
 * @param {$Player} player @param {string | Array<string>} usernames
 */
function is_eligible_for_easter_egg(player, usernames) {
	if (Platform.isClientEnvironment() && Client.isSingleplayer()) {
		return true
	}
	if (player.server && player.server.isSingleplayer()) {
		return true
	}
	if (typeof usernames === "string") {
		return player.username == usernames
	}
	return usernames.includes(player.username)
}

function is_dev() {
	return Platform.isClientEnvironment() && Platform.isLoaded("probejs")
}

global.SEC = SEC
global.MIN = MIN
global.play_sound_globally = play_sound_globally
global.remap = remap
global.is_eligible_for_easter_egg = is_eligible_for_easter_egg
global.is_dev = is_dev

// Kind of a test.
if (Platform.isClientEnvironment()) {
	Color.createMapped("#F2C891", "bleachdew", "bleachdew_dye")
}

StartupEvents.registry("sound_event", event => {
	event.create("bubble_cobble:buzz")
	event.create("bubble_cobble:dash")
	event.create("bubble_cobble:recharged")
	event.create("bubble_cobble:crate_jump")
	event.create("bubble_cobble:fruit_collected")
	event.create("bubble_cobble:life_got")
	event.create("bubble_cobble:sniper_apple")
	event.create("kubejs:item.bearded_dragon_chirp")
	event.create("kubejs:entity.enderman.bones_cracking")
})

/** @param {RegistryTypes.CreativeModeTab} tab_id */
function remove_tab(tab_id) {
	StartupEvents.modifyCreativeTab(tab_id, event => {
		event.remove("*")
	})
}
