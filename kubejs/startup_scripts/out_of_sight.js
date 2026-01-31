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

	// These Artifacts are ridiculous.
	"artifacts:eternal_steak",
	"artifacts:everlasting_beef",
	"artifacts:aqua_dashers", // In favour of Relics's Aqua-Walker.
	"artifacts:strider_shoes", // In favour of Relics's Magma Walker.
	// Disabling these Relics here is not enough, remember to also disable them in their respective configs!
	"relics:infinity_ham", // Dude.
	"relics:magic_mirror", // The Begone Potion exists.
	"relics:leather_belt", // Needs balancing.
	"relics:drowned_belt", // Needs balancing.
	"relics:hunter_belt", // Needs balancing.
	"relics:elytra_booster", // I do not want to even encourage using the Elytra.
	"relics:amphibian_boot", // Needs balancing.
	// "relics:leafy_ring", // Self-stated to be WIP.
	"relics:phantom_boot", // Free-flight, but actually you're walking. No cooldowns or anything.
	"artifacts:umbrella", // People love it but it is ridiculous how much it trivializes movement.
	"artifacts:villager_hat", // I do not want to even encourage trading.
	"artifacts:night_vision_goggles", // Free Night Vision is always a big no-no.
	"artifacts:scarf_of_invisibility", // In favour of Relics's Midnight Robe.
	// "artifacts:crystal_heart", // Needs balancing. Too many hearts at max.
	// "artifacts:helium_flamingo", // Needs balancing. Ridiculous air time at max.
]

/** @type {Special.Item[]} */
global.DISABLED_ITEM_EXCEPTIONS = [
	"cobbreeding:pokemon_egg",
	"justhammers:stone_hammer",
	"justhammers:stone_reinforced_hammer",
	"justhammers:iron_hammer",
	"justhammers:iron_reinforced_hammer",
	"gag:escape_rope",
	"gag:time_sand_pouch"
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
