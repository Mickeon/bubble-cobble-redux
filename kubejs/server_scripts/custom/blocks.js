
ServerEvents.recipes(event => {
	event.smelting("bubble_cobble:cracked_mud_bricks", "minecraft:mud_bricks", 0.1)

	event.shaped("bubble_cobble:chiseled_mud_bricks", ["S", "S"], {S: "minecraft:mud_brick_slab"})
	event.stonecutting("bubble_cobble:chiseled_mud_bricks", "minecraft:mud_bricks")

	event.shaped("bubble_cobble:mud_pillar", ["S", "S"], {S: ["minecraft:mud_bricks", "minecraft:packed_mud"]})
	event.stonecutting("bubble_cobble:mud_pillar", ["minecraft:mud_bricks", "minecraft:packed_mud"])
})

ServerEvents.tags("block", event => {
	// This does not work the first time, requires /reload for some reason.
	// Blocks.MUD_BRICKS.getTags().forEach(tag => {
	// 	event.add(tag, "bubble_cobble:cracked_mud_bricks", "bubble_cobble:chiseled_mud_bricks", "bubble_cobble:mud_pillar")
	// })

	// No time investigating, just do it manually for now.
	event.add("cobblemon:trail_ruins_blocks", "bubble_cobble:cracked_mud_bricks", "bubble_cobble:chiseled_mud_bricks", "bubble_cobble:mud_pillar")
	event.add("minecraft:mineable/pickaxe", "bubble_cobble:cracked_mud_bricks", "bubble_cobble:chiseled_mud_bricks", "bubble_cobble:mud_pillar")
	event.add("mowziesmobs:bricks", "bubble_cobble:cracked_mud_bricks", "bubble_cobble:chiseled_mud_bricks", "bubble_cobble:mud_pillar")
})
