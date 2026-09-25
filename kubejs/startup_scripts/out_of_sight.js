let $BuildCreativeModeTabContentsEvent  = Java.loadClass("net.neoforged.neoforge.event.BuildCreativeModeTabContentsEvent")

// Items in this list:
// - Cannot be crafted
// - Are removed from all tags
// - Are hidden from recipe viewers
// - Are hidden from Creative tabs
/** @type {RegistryTypes.Item[]} */
const DISABLED_ITEMS = [
	// Unused.
	/^libraryferret/,
	"urban_decor:sewing_needle",

	// Obsolete.
	// "createmonballsoverhaul:apricorn_punch",

	// In favour of Brewin' and Chewin's cheese.
	/^create_bic_bit:(?!.*souffle).*cheese/,
	"create_bic_bit:curdled_milk_bucket", // Note: Fails on startup if used as an Ingredient.

	// Overpowered.
	/^constructionstick:template/,

	// Cobbreeding adds a lot of unnecessary, coloured Pokemon eggs.
	/^cobbreeding/,
	// Keeping only 4 hammers from this mod.
	/^justhammers/,
	// Keeping only a few items from this mod, for now.
	/^gag/,

	// I don't need to do anything, they're hidden by default now?
	// "artifacts:eternal_steak",
	// "artifacts:everlasting_beef",
	// "artifacts:umbrella", // People love it but it is ridiculous how much it trivializes movement.
	// Disabling these here is not enough, remember to also disable them in their respective Relics configs!
	// These are worth revisiting later, as their effects were rebalanced across updates.
	"artifacts:aqua_dashers", // In favour of Relics's Cut Glass Boot.
	"artifacts:strider_shoes", // In favour of Relics's Cut Glass Boot.
	"artifacts:villager_hat", // I do not want to even encourage trading.
	"artifacts:night_vision_goggles", // Free Night Vision is always a big no-no.
	"artifacts:scarf_of_invisibility", // In favour of Relics's Midnight Robe.
	// "artifacts:crystal_heart", // Needs balancing. Too many hearts at max.
	// "artifacts:helium_flamingo", // Needs balancing. Ridiculous air time at max. Also kind of broken due to crawling keybind?
]
if (Item.exists("minecraft:copper_nugget")) {
	// In favour of Minecraft's own Copper Nugget.
	DISABLED_ITEMS.push("create:copper_nugget")
}

/** @type {RegistryTypes.Item[]} */
const DISABLED_ITEM_EXCEPTIONS = [
	"cobbreeding:pokemon_egg",
	"justhammers:stone_hammer",
	"justhammers:stone_reinforced_hammer",
	"justhammers:iron_hammer",
	"justhammers:iron_reinforced_hammer",
	"gag:escape_rope",
	"gag:time_sand_pouch"
]

global.get_disabled_ingredient = function () {
	// Bit of a cache.
	return Utils.expiringLazy(() => Ingredient.of(DISABLED_ITEMS).except(DISABLED_ITEM_EXCEPTIONS),	SECOND).get()
}

/** @type {RegistryTypes.Fluid[]} */
global.DISABLED_FLUIDS = [
	"create_bic_bit:curdled_milk"
]

/** @type {RegistryTypes.MobEffect[] | RegExp} */
global.HIDDEN_MOB_EFFECTS = [
	// Unused.
	/runiclib/, // Many neat effects are a byproduct of this library.
	"gag:repelling",

	// Only keeping the "Harmful" version of these effects on display.
	"xaerominimap:no_cave_maps",
	"xaerominimap:no_entity_radar",
	"xaerominimap:no_minimap",
	"xaerominimap:no_waypoints",
	"xaeroworldmap:no_cave_maps",
	"xaeroworldmap:no_world_map",
]

NativeEvents.onEvent("lowest", $BuildCreativeModeTabContentsEvent, event => {
	let evaluated_items = global.get_disabled_ingredient().stackArray
	// console.log("Hiding the following items: " + evaluated_items)
	for (const item of evaluated_items) {
		event.remove(item, "parent_and_search_tabs")
	}
})
