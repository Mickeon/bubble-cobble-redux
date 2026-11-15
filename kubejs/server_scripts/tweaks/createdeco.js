// requires: createdeco
// requires: lootjs

const COINSTACK_TO_NUGGET = {
	"createdeco:gold_coinstack": "minecraft:gold_nugget",
	"createdeco:iron_coinstack": "minecraft:iron_nugget",
	"createdeco:zinc_coinstack": "create:zinc_nugget",
	"createdeco:brass_coinstack": "create:brass_nugget",
	"createdeco:copper_coinstack": Item.exists("minecraft:copper_nugget") ? "minecraft:copper_nugget" : "create:copper_nugget",
	"createdeco:netherite_coinstack": "createdeco:netherite_nugget",
	"createdeco:industrial_iron_coinstack": "createdeco:industrial_iron_nugget",
}

ServerEvents.tags("item", event => {
	event.add("c:glass_panes", "createdeco:iron_window_pane", "createdeco:zinc_window_pane", "createdeco:brass_window_pane", "createdeco:copper_window_pane", "createdeco:andesite_window_pane", "createdeco:industrial_iron_window_pane") // Reported: https://github.com/talrey/CreateDeco/issues/302
	event.add("c:storage_blocks", "#c:storage_blocks/industrial_iron") // Reported: https://github.com/talrey/CreateDeco/issues/303

	// Shared in a bunch of places.
	event.add("bubble_cobble:coinstacks", Object.keys(COINSTACK_TO_NUGGET))
})

ServerEvents.tags("block", event => {
	// Shared in a bunch of places.
	event.add("bubble_cobble:coinstacks", Object.keys(COINSTACK_TO_NUGGET))
})

ServerEvents.recipes(event => {
	// Make Create Deco's industrial Iron compatible with Create: Dreams & Desires's.
	// We don't even have the mod anymore, but this is innocuous.
	event.replaceInput({mod: "createdeco"}, "createdeco:industrial_iron_nugget", "#c:nuggets/industrial_iron")
	event.replaceInput({mod: "createdeco"}, "createdeco:industrial_iron_ingot", "#c:ingots/industrial_iron")

	// All of the other types require differently colored torches, because Copper Torches didn't exist.
	if (Item.exists("minecraft:copper_torch")) {
		event.replaceInput({id: /^createdeco:green_.*lamp/}, "minecraft:glow_berries", "minecraft:copper_torch")
	}

	// Use nuggies for Coin Stacks, as individual coins are disabled.
	for (let coinstack in COINSTACK_TO_NUGGET) {
		let nugget = COINSTACK_TO_NUGGET[coinstack]
		event.replaceInput(coinstack, Ingredient.all, nugget)
	}
})

LootJS.lootTables(event => {
	for (let coinstack in COINSTACK_TO_NUGGET) {
		let nugget = COINSTACK_TO_NUGGET[coinstack]
		event.getBlockTable(coinstack).replaceItem(Ingredient.all, nugget)
	}
})
