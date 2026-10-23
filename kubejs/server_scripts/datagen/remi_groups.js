// requires: probejs
// requires: emi
// requires: remi

global.datagen.functions.remi_groups = function() {
	const PATH = "config/remi/stack_groups"
	const WOOD_TYPES = [
		{id: "oak", exclude: [/(dark_oak|mossy)/]},
		{id: "spruce"},
		{id: "birch"},
		{id: "jungle", exclude: ["@undergroundworlds"]},
		{id: "dark_oak"},
		{id: "acacia"},
		{id: "mangrove"},
		{id: "cherry", exclude: [/urban_decor:.*(wrap|polyanthous)/]},
		{id: "bamboo", exclude: ["farmersdelight:bamboo_basket", "minecraft:bamboo", "supplementaries:bamboo_spikes", "supplementaries:bamboo_spikes_tipped"]},
		{id: "crimson", exclude: ["minecraft:crimson_fungus", "minecraft:crimson_roots", "minecraft:crimson_nylium", "@mynethersdelight"]},
		{id: "warped", exclude: ["minecraft:warped_fungus", "minecraft:warped_roots", "minecraft:warped_nylium", "minecraft:warped_fungus_on_a_stick", "@mynethersdelight"]},
		"arts_and_crafts:cork",
		{id: "cobblemon:apricorn", exclude: ["#cobblemon:apricorns", "#cobblemon:apricorn_sprouts"]},
		"cobblemon:saccharine",
		{id: "biomesoplenty:dead", exclude: ["biomesoplenty:dead_grass"]},
		"biomesoplenty:empyreal",
		"biomesoplenty:fir",
		"biomesoplenty:hellbark",
		{id: "biomesoplenty:jacaranda", display_name: "Pale Jaracanda"},
		"biomesoplenty:magic",
		"biomesoplenty:mahogany",
		"biomesoplenty:maple",
		"biomesoplenty:palm",
		"biomesoplenty:pine",
		{id: "biomesoplenty:redwood", display_name: "Redder Wood"},
		"biomesoplenty:umbran",
		"biomesoplenty:willow",
		"biomeswevegone:aspen",
		{id: "biomeswevegone:baobab", exclude: ["biomeswevegone:baobab_fruit"]},
		"biomeswevegone:blue_enchanted",
		"biomeswevegone:cika",
		"biomeswevegone:cypress",
		"biomeswevegone:ebony",
		"biomeswevegone:fir",
		"biomeswevegone:florus",
		"biomeswevegone:green_enchanted",
		{id: "biomeswevegone:holly", exclude: ["biomeswevegone:holly_wreath"]},
		"biomeswevegone:ironwood",
		"biomeswevegone:jacaranda",
		"biomeswevegone:mahogany",
		"biomeswevegone:maple",
		"biomeswevegone:palm",
		"biomeswevegone:pine",
		"biomeswevegone:rainbow_eucalyptus",
		"biomeswevegone:redwood",
		{id: "biomeswevegone:sakura", exclude: ["biomeswevegone:white_sakura_petals",  "biomeswevegone:yellow_sakura_petals"]},
		"biomeswevegone:skyris",
		"biomeswevegone:spirit",
		"biomeswevegone:white_mangrove",
		"biomeswevegone:willow",
		"biomeswevegone:witch_hazel",
		"biomeswevegone:zelkova",
		"biomeswevegone:palo_verde",
		{id: "mynethersdelight:powdery", exclude: ["mynethersdelight:powdery_torch"]},
	]
	const all_item_ids = Registry.of("item").getValues()
	WOOD_TYPES.forEach(wood_type => {
		const id = wood_type.id || wood_type
		const namespace = ID.namespace(id)
		const name = ID.path(id)
		const display_name = wood_type.display_name || StringUtils.snakeCaseToTitleCase(name)

		const group = {
			__comment: "Generated data. Do not edit manually.",
			type: "remi:group",
			id: `${namespace}:wood_sets/${name}`,
			name: Text.join(Text.of(display_name).color("light_blue_dye"), ` Wood Set`),
			priority: 1,
			contents: []
		}

		// Having a single regex with positive lookbehind (`biomeswevegone[:/].*(?<=[:_])pine`) gives errors.
		const inclusions = Ingredient.of(namespace == "minecraft" ? "*" : RegExp(`${namespace}[:/]`)).and(RegExp(`[/:_]${name}`))
		const exclusions = (wood_type.exclude ? Ingredient.of(wood_type.exclude) : Ingredient.none).or("@displaydelight")
		// For some reason, Clutter No more causes Ingredient.of() with regex to not find items that
		// are not in creative tabs (inconsistently, too). So we gotta go through the entire list manually.
		group.contents = all_item_ids.stream()
			.filter(s => inclusions.test(s) && !exclusions.test(s))
			.map(s => "item:" + s).sorted().toList()
		JsonIO.write(`${PATH}/wood_sets/${namespace}/${name}.json`, group)
		// console.log(JSON.stringify(group, null, "\t"))
	})

	const $ElementalTypes = Java.loadClass("com.cobblemon.mod.common.api.types.ElementalTypes")
	if ($ElementalTypes) {
		$ElementalTypes.all().stream().forEach(type => {
			const id = type.showdownId()
			const display_name = String(type.getDisplayName().getString()) + " Gem" // Gotta wrap because it returns a Java String object.
			const primary_color = type.getPrimaryColor()
			const secondary_color = type.getSecondaryColor()
			const vec_begin = new Vec3f(
				primary_color % 0x1000000 / 0x10000,
				primary_color % 0x10000 / 0x100,
				primary_color % 0x100
			)
			const vec_end = new Vec3f(
				secondary_color % 0x1000000 / 0x10000,
				secondary_color % 0x10000 / 0x100,
				secondary_color % 0x100
			)
			const final_name = Text.empty()
			for (let i = 0; i < display_name.length; i += 1) {
				let vec = vec_begin.lerp(vec_end, i / display_name.length)
				let color = Color.rgba(vec.x(), vec.y(), vec.z(), 1.0)
				let char = display_name.charAt(i)
				console.log(char)
				final_name.append(Text.of(char).color(color))
			}

			const group = {
				__comment: "Generated data. Do not edit manually.",
				type: "remi:group",
				id: `cobblemon:${id}_gem_stuff`,
				name: final_name.append(" Stuff"),
				contents: []
			}

			group.contents = Ingredient.of(RegExp(`cobblemon:${id}_gem`)).itemIds.stream().map(s => "item:" + s).sorted().toList()
			JsonIO.write(`${PATH}/cobblemon/type_gems/${id}.json`, group)
			// console.log(JSON.stringify(group, null, "\t"))
		})
	}
}
