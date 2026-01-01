// priority: 1000

/** @import {$Player} from "net.minecraft.world.entity.player.Player" */
/** @import {$ItemStack} from "net.minecraft.world.item.ItemStack" */
/** @import {$ScheduledEvents$ScheduledEvent} from "dev.latvian.mods.kubejs.util.ScheduledEvents$ScheduledEvent" */

const SEC = 20
const MIN = SEC * 60

/** @param {number} value @param {number} min1 @param {number} max1  @param {number} min2 @param {number} max2 */
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

const DASH_STARTERS = [
	"AceNil_",
	"BlueBerryNice",
	"CafeJaze",
	"CantieLabs",
	"Fableworks",
	"LabbyRosenfeld",
	"Mickeon",
	"pepperponyo",
	"WaiGee",
]