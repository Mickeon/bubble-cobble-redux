// requires: probejs
// requires: emi
// requires: remi

global.datagen_functions.remi_groups = function() {
	const PATH = "config/remi/stack_groups/wood_sets"
	const WOOD_TYPES = [
		"arts_and_crafts:cork",
		// "cobblemon:apricorn", // Exclude Apricorns and Apricorn Seeds.
		"cobblemon:saccharine",
		"biomesoplenty:dead",
		"biomesoplenty:empyreal",
		"biomesoplenty:fir",
		"biomesoplenty:hellbark",
		"biomesoplenty:jacaranda", // Needs to be renamed to "Pale Jaracanda".
		"biomesoplenty:magic",
		"biomesoplenty:mahogany",
		"biomesoplenty:maple",
		"biomesoplenty:palm",
		"biomesoplenty:pine",
		"biomesoplenty:redwood", // Needs to be renamed to "Redder Wood".
		"biomesoplenty:umbran",
		"biomesoplenty:willow",
		"biomeswevegone:aspen",
		"biomeswevegone:baobab",
		"biomeswevegone:blue_enchanted",
		"biomeswevegone:cika",
		"biomeswevegone:cypress",
		"biomeswevegone:ebony",
		"biomeswevegone:fir",
		"biomeswevegone:florus",
		"biomeswevegone:green_enchanted",
		"biomeswevegone:holly", // Exclude Holly Wreath from this.
		"biomeswevegone:ironwood",
		"biomeswevegone:jacaranda",
		"biomeswevegone:mahogany",
		"biomeswevegone:maple",
		"biomeswevegone:palm",
		"biomeswevegone:pine",
		"biomeswevegone:rainbow_eucalyptus",
		"biomeswevegone:redwood",
		"biomeswevegone:sakura",
		"biomeswevegone:skyris",
		"biomeswevegone:spirit",
		"biomeswevegone:white_mangrove",
		"biomeswevegone:willow",
		"biomeswevegone:witch_hazel",
		"biomeswevegone:zelkova",
		"biomeswevegone:palo_verde",
		"mynethersdelight:powdery",
	]

	WOOD_TYPES.forEach(wood_type => {
		const namespace = ID.namespace(wood_type)
		const name = ID.path(wood_type)

		const group = {
			__comment: "Generated data. Do not edit manually.",
			type: "remi:group",
			id: `${namespace}:wood_sets/${name}`,
			name: `§b${StringUtils.snakeCaseToTitleCase(name)}§r Wood Set`,
			contents: []
		}

		group.contents = Ingredient.of(RegExp(`${namespace}[:/].*${name}`)).itemIds.stream().map(s => "item:" + s).sorted().toList()
		JsonIO.write(`${PATH}/${namespace}/${name}.json`, group)
		// console.log(JSON.stringify(group, null, "\t"))
	})
}