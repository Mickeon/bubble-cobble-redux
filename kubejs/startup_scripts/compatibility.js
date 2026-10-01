
StartupEvents.postInit(event => {
	const $BuiltInRegistries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries")
	const $ResourceLocation = Java.loadClass("net.minecraft.resources.ResourceLocation")

	// Mildly elegant.
	const KUBEJS_TO_BUBBLE_COBBLE_REMAPS = [
		{
			registry: $BuiltInRegistries.ITEM, // Registry.of("minecraft:item").registry()
			entries: [
				"blue_mascot_cat",
				"bearded_dragon_bowl",
				"banana_mayo_sandwich",
				"doublemint_gum",
				"horse_urine_bottle",
				"super_ghostbusters",

				"ruler",
				"trowel",

				"berry_juice_soda",
				"firebomb_whiskey",
				"honey_liqueur",
				"sparkling_rose",
				"spumante",
				"sweet_berry_wine",

				"music_disc_grapes",
				"music_disc_void",
				"music_disc_fool",

				"mud_pillar",
				"chiseled_mud_bricks",
				"cracked_mud_bricks",

				"renuvium_bucket",
			]
		},
		{
			registry: $BuiltInRegistries.BLOCK,
			entries: [
				"mud_pillar",
				"chiseled_mud_bricks",
				"cracked_mud_bricks",

				"berry_juice_soda",
				"sweet_berry_wine",
				"sparkling_rose",
				"spumante",
				"honey_liqueur",
				"firebomb_whiskey",

				"renuvium",
			]
		},
		{
			registry: $BuiltInRegistries.FLUID,
			entries: [
				"berry_juice_soda",
				"flowing_berry_juice_soda",
				"sweet_berry_wine",
				"flowing_sweet_berry_wine",
				"sparkling_rose",
				"flowing_sparkling_rose",
				"spumante",
				"flowing_spumante",
				"honey_liqueur",
				"flowing_honey_liqueur",
				"firebomb_whiskey",
				"flowing_firebomb_whiskey",

				"renuvium",
				"flowing_renuvium",
			]
		},
		{
			registry: $BuiltInRegistries.ATTRIBUTE,
			entries: [
				"dash_jump_count",
			]
		},
		{
			registry: $BuiltInRegistries.MOB_EFFECT,
			entries: [
				"begone",
				"girl_power",
			]
		},
		{
			registry: $BuiltInRegistries.CAT_VARIANT,
			entries: [
				"pipi",
			]
		}
	]

	for (const category of KUBEJS_TO_BUBBLE_COBBLE_REMAPS) {
		let registry = category.registry
		for (const entry of category.entries) {
			registry.addAlias(
					$ResourceLocation.fromNamespaceAndPath("kubejs", entry),
					$ResourceLocation.fromNamespaceAndPath("bubble_cobble", entry)
			)
		}
	}
})
