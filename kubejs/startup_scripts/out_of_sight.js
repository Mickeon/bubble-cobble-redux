// priority: 0
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

	// In favour of Create's copper nuggets.
	// "leafscopperbackport:copper_nugget",
	// In favour of Minecraft's own Copper Nugget.
	"create:copper_nugget"
]

/** @type {Special.Fluid[]} */
global.DISABLED_FLUIDS = [
	"create_bic_bit:curdled_milk"
]

// global.DISABLED_ITEMS_ingredient = Ingredient.of(global.DISABLED_ITEMS)

// Item registry is not fully ready here. We wait for initialization and cache the result.
// global.EVALUATED_DISABLED_ITEMS = []
// StartupEvents.postInit(event => {
// 	global.EVALUATED_DISABLED_ITEMS = Ingredient.of(global.DISABLED_ITEMS).stackArray
// 	console.log("Hiding the following items: " + global.EVALUATED_DISABLED_ITEMS)
// })

// NativeEvents.onEvent("lowest", $BuildCreativeModeTabContentsEvent, event => {
// 	global.EVALUATED_DISABLED_ITEMS.forEach(item => {
// 		event.remove(item, "parent_and_search_tabs")
// 	})
// })

NativeEvents.onEvent("lowest", $BuildCreativeModeTabContentsEvent, event => {
	// Caching fails to work, for some reason.
	// if (!global.EVALUATED_DISABLED_ITEMS) {
	// 	global.EVALUATED_DISABLED_ITEMS = Ingredient.of(global.DISABLED_ITEMS).stackArray
	// }
	let evaluated_items = Ingredient.of(global.DISABLED_ITEMS).stackArray
	// console.log("Hiding the following items: " + evaluated_items)
	for (const item of evaluated_items) {
		event.remove(item, "parent_and_search_tabs")
	}
})

//#region Deader than Disco
// const CREATIVE_TAB_IDS = ["constructionstick:tab", "create_bic_bit:base"]
// StartupEvents.modifyCreativeTab(CREATIVE_TAB_IDS, tab => {
	// tab.remove(Ingredient.of(global.DISABLED_ITEMS))
// 	tab.remove(global.DISABLED_ITEMS)
// })
// Does not work. Only fetches vanilla Creative tabs.
// Registry.of("creative_mode_tab").keys.forEach(tab_id => {
// 	console.log(tab_id)
// 	StartupEvents.modifyCreativeTab(tab_id, tab => {
// 		tab.remove(global.DISABLED_ITEMS)
// 	})
// });


// /** @type {typeof import("net.neoforged.neoforge.event.BuildCreativeModeTabContentsEvent").$BuildCreativeModeTabContentsEvent } */
// let $BuildCreativeModeTabContentsEvent  = Java.loadClass("net.neoforged.neoforge.event.BuildCreativeModeTabContentsEvent")


// let tab_items = []
// NativeEvents.onEvent("low", $BuildCreativeModeTabContentsEvent, event => {
// 	console.log(`Checking for fetching ${event.tabKey.path}`)
// 	if (event.tabKey == "cobblemon:utility_item") {
// 		/** @type {import("net.minecraft.world.item.CreativeModeTab").$CreativeModeTab$$Original} */
// 		let creative_tab = Registry.of("creative_mode_tab").get("cobblenav:cobblenav")
// 		console.log(`Fetching all items ${creative_tab.getDisplayItems()}`)
// 		event.acceptAll(creative_tab.getDisplayItems())
// 	}
// })

// NativeEvents.onEvent("lowest", $BuildCreativeModeTabContentsEvent, event => {
// 	console.log(`Checking for removing ${event.tabKey.path}`)
// 	if (event.getTabKey() == "cobblenav:cobblenav") {
// 		console.log(`Removing all items ${event.tab.getDisplayItems()}`)
// 		// for (const item of event.tab.getDisplayItems()) {
// 		tab_items = event.tab.getDisplayItems()
// 		for (const item of tab_items) {
// 			event.remove(item, "parent_and_search_tabs")
// 		}

// 		// event.remove(Item.of("cobblenav:pokenav_item_base"), "parent_and_search_tabs")
// 	}
// })


// /** @param {Special.CreativeModeTab} tab_id @param {Special.CreativeModeTab} with_id */
// function remove_and_merge_tab(tab_id, with_id) {
// 	let items = []
//	// Does not work. Display items is completely empty when requested, unless the script is reloaded.
// 	StartupEvents.modifyCreativeTab(tab_id, event => {
// 		console.log(`Removed tab ${tab_id} display items: ${event.tab.getDisplayItems()}`)
// 		items = event.tab.getDisplayItems()
// 		event.remove("*")
// 	})

// 	StartupEvents.modifyCreativeTab(with_id, event => {
// 		console.log(`Merger tab ${with_id} receiving items: ${items}`)
// 		event.add(items)
// 	})

// 	"%minecraft:redstone_blocks"
// 	StartupEvents.modifyCreativeTab(with_id, event => {
// 		// let items = Ingredient.of(`%${tab_id}`).stackArray
// 		let items = Ingredient.of(`%${tab_id}`).stacks
// 		for (let item of items) {
// 			console.log(`Moving ${item} from ${tab_id} to tab ${with_id}`)
// 			event.add(item)
// 		}
// 	})

// 	StartupEvents.modifyCreativeTab(tab_id, event => {
// 		event.remove("*")
// 	})
// }
//#endregion