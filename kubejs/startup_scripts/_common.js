// priority: 1000

/** @type {typeof import("net.minecraft.world.entity.player.Player").$Player } */
let $Player  = Java.loadClass("net.minecraft.world.entity.player.Player")
/** @type {typeof import("dev.latvian.mods.kubejs.item.FoodBuilder").$FoodBuilder } */
let $FoodBuilder  = Java.loadClass("dev.latvian.mods.kubejs.item.FoodBuilder")

const SEC = 20
const MIN = SEC * 60
