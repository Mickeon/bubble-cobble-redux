// requires: fieldguide

ServerEvents.recipes(event => {
	event.shaped("bubble_cobble:newspaper_station", ["LBL", "RAR", "OGO"], {L: "#minecraft:logs", B: "minecraft:writable_book", R: "minecraft:cobbled_deepslate", A: "minecraft:lectern", O: "#c:obsidians", G: "create:millstone"})
})

ServerEvents.loaded(event => {
	event.server.scheduleRepeatingInTicks(24000, () => global.magazine_shuffle(event.server))
})
