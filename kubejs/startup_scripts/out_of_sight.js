/** @type {typeof import("net.neoforged.neoforge.event.BuildCreativeModeTabContentsEvent").$BuildCreativeModeTabContentsEvent } */
let $BuildCreativeModeTabContentsEvent  = Java.loadClass("net.neoforged.neoforge.event.BuildCreativeModeTabContentsEvent")

// Items in this list:
// - Cannot be crafted
// - Are removed from all tags
// - Are hidden from recipe viewers
// - Are hidden from Creative tabs
/** @type {Special.Item[]} */
global.DISABLED_ITEMS = [
	// Unused.
	/^libraryferret/,

	// In favour of Brewin' and Chewin's cheese.
	/^create_bic_bit:(?!.*souffle).*cheese/,
	"create_bic_bit:curdled_milk_bucket", // Note: Fails on startup if used as an Ingredient.

	// Overpowered.
	/^constructionstick:template/,

	// In favour of Sophisticated Backpacks.
	// "astral_dimension:backpack",
	// "astral_dimension:harsh_backpack",

	// In favour of Minecraft's own Copper Nugget.
	"create:copper_nugget",

	// Cobbreeding adds a lot of unnecessary, coloured Pokemon eggs.
	/cobbreeding:.+pokemon_egg/,
	"cobbreeding:manaphy_egg",

	// Obsolete.
	"createmonballsoverhaul:apricorn_punch"
]

/** @type {Special.Fluid[]} */
global.DISABLED_FLUIDS = [
	"create_bic_bit:curdled_milk"
]

NativeEvents.onEvent("lowest", $BuildCreativeModeTabContentsEvent, event => {
	let evaluated_items = Ingredient.of(global.DISABLED_ITEMS).stackArray
	// console.log("Hiding the following items: " + evaluated_items)
	for (const item of evaluated_items) {
		event.remove(item, "parent_and_search_tabs")
	}
})
