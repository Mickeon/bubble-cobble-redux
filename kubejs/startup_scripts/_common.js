// priority: 1000

Platform.setModName("kubejs", "KubeJS (Bubble Cobble)")
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
 * @import {$ItemPredicate_} from "@package/dev/latvian/mods/kubejs/item"
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

// Kind of a test.
if (Platform.isClientEnvironment()) {
	Color.createMapped("#F2C891", "bleachdew", "bleachdew_dye")
}

StartupEvents.registry("sound_event", event => {
	event.create("bubble_cobble:ui.buzz")
	event.create("bubble_cobble:dash")
	event.create("bubble_cobble:ui.entry_get")
	event.create("bubble_cobble:ui.recharged")
	event.create("bubble_cobble:block.shipping_bin.open_money")
	event.create("bubble_cobble:block.shipping_bin.open_nothing")
	event.create("bubble_cobble:block.shipping_bin.sell")
	event.create("bubble_cobble:crash.crate_jump")
	event.create("bubble_cobble:crash.fruit_got")
	event.create("bubble_cobble:crash.life_got")
	event.create("bubble_cobble:voice.cut_that_out")
	event.create("bubble_cobble:voice.sniper_apple")
	event.create("bubble_cobble:item.bearded_dragon_chirp")
	event.create("bubble_cobble:entity.enderman.bones_cracking")
	event.create("bubble_cobble:heal")
})

/** @param {RegistryTypes.CreativeModeTab} tab_id */
function remove_tab(tab_id) {
	StartupEvents.modifyCreativeTab(tab_id, event => {
		event.remove("*")
	})
}

// Primordial for TS autocompletion of `global`.
// This lets us pretend scripts are modules by assigning to `exports` in startup scripts,
// then `/** @import {} from "..." */` in server/client scripts.
// We don't do it in this script because we want to "export" almost everything.
// See https://discord.com/channels/303440391124942858/1300462173855678534/1555898235879559312.
let exports = {}
// let exports = global
// global.SEC = exports.SEC = SEC
// Object.assign(exports, global)

global.SEC = SEC
global.MIN = MIN
global.remap = remap
global.play_sound_globally = play_sound_globally
global.is_eligible_for_easter_egg = is_eligible_for_easter_egg
global.is_dev = is_dev

const Currency = global.Currency = {
	COIN_LIST: [
		{coin: "numismatics:sun", value: 4096},
		{coin: "numismatics:crown", value: 512},
		{coin: "numismatics:cog", value: 64},
		{coin: "numismatics:sprocket", value: 16},
		{coin: "numismatics:bevel", value: 8},
		{coin: "numismatics:spur", value: 1},
	],

	/** @param {number} price @param {Array<{id: string, count: number}} result */
	create_coins_from_value: function(price, result) {
		// Recursive function that goes through every coin in smaller decrements.
		for (let i in this.COIN_LIST) {
			let {coin, value} = this.COIN_LIST[i]
			if (value <= price) {
				if (price % value == 0) {
					result.push({id: coin, count: price / value})
					return result
				} else {
					result.push({id: coin, count: Math.floor(price / value)})
					this.create_coins_from_value(price % value, result)
				}
				return result
			}
		}
	},
	// /** @param {$ItemStack} item_stack */
	// is_coin: function(item_stack) {
	// 	return item_stack.hasTag("numismatics:coins")
	// }

	/** @param {$ItemStack} item_stack */
	single_worth: function(item) {
		for (let entry of this.COIN_LIST) {
			if (entry.coin == item.id) {
				return entry.value
			}
		}
		return 0
	},
	/** @param {$Player} player @param {$ItemStack} item_stack */
	try_deducting_coins: function(player, price) {
		if (player.isCreative()) {
			return true
		}

		// What a mess.
		// Check if it's even possible to pay.
		let coins = []
		let inventory_worth = 0
		for (let item of player.inventory.getAllItems()) {
			if (item.id == "numismatics:spur") {
				coins.push(item)
				inventory_worth += item.getCount()
			}
			if (item.id == "numismatics:bevel") {
				coins.push(item)
				inventory_worth += item.getCount() * 8
			}
		}
		if (inventory_worth < price) {
			return false
		}
		coins.sort((a, b) => Currency.single_worth(b) - Currency.single_worth(a))
		for (let coin of coins) {
			// I do not feel like being smart about it today.
			if (coin.id == "numismatics:spur") {
				let deduction = Math.min(price, coin.getCount())
				coin.shrink(deduction)
				price -= deduction
			}
			if (coin.id == "numismatics:bevel") {
				let deduction = Math.min(price / 8, coin.getCount())
				coin.shrink(deduction)
				price -= deduction * 8
			}
			if (price <= 0) {
				break
			}
		}

		return true
	}
}

if (Platform.isLoaded("probejs") && !global.datagen) {
	global.datagen = {}
	global.datagen.functions = ({
		dummy: function() {}
	})
}
