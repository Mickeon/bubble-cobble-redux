ServerEvents.recipes(event => {
	event.smelting("kubejs:cracked_mud_bricks", "minecraft:mud_bricks", 0.1)

	event.shaped("kubejs:chiseled_mud_bricks", ["S", "S"], {S: "minecraft:mud_brick_slab"})
	event.stonecutting("kubejs:chiseled_mud_bricks", "minecraft:mud_bricks")

	event.shaped("kubejs:mud_pillar", ["S", "S"], {S: ["minecraft:mud_bricks", "minecraft:packed_mud"]})
	event.stonecutting("kubejs:mud_pillar", ["minecraft:mud_bricks", "minecraft:packed_mud"])
})

ServerEvents.tags("block", event => {
	// This does not work the first time, requires /reload for some reason.
	// Blocks.MUD_BRICKS.getTags().forEach(tag => {
	// 	event.add(tag, "kubejs:cracked_mud_bricks", "kubejs:chiseled_mud_bricks", "kubejs:mud_pillar")
	// })

	// No time investigating, just do it manually for now.
	event.add("cobblemon:trail_ruins_blocks", "kubejs:cracked_mud_bricks", "kubejs:chiseled_mud_bricks", "kubejs:mud_pillar")
	event.add("minecraft:mineable/pickaxe", "kubejs:cracked_mud_bricks", "kubejs:chiseled_mud_bricks", "kubejs:mud_pillar")
	event.add("mowziesmobs:bricks", "kubejs:cracked_mud_bricks", "kubejs:chiseled_mud_bricks", "kubejs:mud_pillar")
})