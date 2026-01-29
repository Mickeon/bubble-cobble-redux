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
	"relics:researching_table",

	// Obsolete.
	"createmonballsoverhaul:apricorn_punch",

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
	/^cobbreeding/,
	// Keeping only 4 hammers from this mod.
	/^justhammers/,
	// Keeping only the Escape Rope from this mod, for now.
	/^gag/,
]

global.DISABLED_ITEM_EXCEPTIONS = [
	"cobbreeding:pokemon_egg",
	"justhammers:stone_hammer",
	"justhammers:stone_reinforced_hammer",
	"justhammers:iron_hammer",
	"justhammers:iron_reinforced_hammer",
	"gag:escape_rope",
]

global.get_disabled_ingredient = function () {
	return Ingredient.of(global.DISABLED_ITEMS).except(global.DISABLED_ITEM_EXCEPTIONS)
}

/** @type {Special.Fluid[]} */
global.DISABLED_FLUIDS = [
	"create_bic_bit:curdled_milk"
]

NativeEvents.onEvent("lowest", $BuildCreativeModeTabContentsEvent, event => {
	let evaluated_items = global.get_disabled_ingredient().stackArray
	// console.log("Hiding the following items: " + evaluated_items)
	for (const item of evaluated_items) {
		event.remove(item, "parent_and_search_tabs")
	}
})
