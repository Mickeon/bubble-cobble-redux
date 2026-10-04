// requires: handcrafted

ServerEvents.tags("item", event => {
	event.add("minecraft:piglin_loved", "handcrafted:golden_thin_pot", "handcrafted:golden_thick_pot", "handcrafted:golden_wide_pot", "handcrafted:golden_medium_pot") //Reported: https://github.com/terrarium-earth/Handcrafted/issues/152
})

ServerEvents.tags("block", event => {
	event.add("minecraft:enchantment_power_provider", "#handcrafted:shelves") // https://github.com/terrarium-earth/Handcrafted/issues/136
	event.add("minecraft:guarded_by_piglins", "handcrafted:golden_thin_pot", "handcrafted:golden_thick_pot", "handcrafted:golden_wide_pot", "handcrafted:golden_medium_pot") // Reported: https://github.com/terrarium-earth/Handcrafted/issues/152

	// Bugged. See also https://github.com/terrarium-earth/Handcrafted/issues/132.
	event.add("c:relocation_not_supported",	"#handcrafted:nightstands", "#handcrafted:desks", "#handcrafted:counters", "#handcrafted:tables", "#handcrafted:benches", "#handcrafted:couches", "immersive_furniture:furniture_proxy")

	// Custom sound when opening HandCrafted's containers.
	// TODO: Expand to include more generic containers?
	event.add("bubble_cobble:handcrafted_containers",
		"#handcrafted:cupboards",
		"#handcrafted:drawers",
		"#handcrafted:desks",
		"#handcrafted:side_tables",
		"#handcrafted:nightstands" ,
		"#handcrafted:counters",
		"#handcrafted:shelves",
	)

	// Allows sitting on them on Create contraptions.
	// Should be moved to another script later.
	event.add("create:seats",
		"#handcrafted:benches",
		"#handcrafted:chairs",
		"#handcrafted:couches",
		"urban_decor:plastic_chair",
		"urban_decor:stainless_steel_chair",
		"urban_decor:booth",
		"urban_decor:toilet",
		"urban_decor:dark_toilet",
		"urban_decor:bathtub",
		"urban_decor:dark_bathtub",
	)
})

ServerEvents.recipes(event => {
	if (Platform.isLoaded("brewinandchewin")) {
		// Just kinda makes sense.
		event.remove({id: "handcrafted:berry_jam_jar"})
		event.shapeless(Item.of("handcrafted:berry_jam_jar"), Ingredient.of("brewinandchewin:sweet_berry_jam"))
		event.shapeless(Item.of("brewinandchewin:sweet_berry_jam"), Ingredient.of("handcrafted:berry_jam_jar"))
	}
})

PlayerEvents.chestOpened("minecraft:generic_9x3", event => {
	if (event.block && event.block.hasTag("bubble_cobble:handcrafted_containers")) {
		// event.player.playNotifySound("relics:ability_locked", "players", 1, 1)
		event.player.playNotifySound("create:blaze_munch", "players", 0.25, 2.0)
	}
})