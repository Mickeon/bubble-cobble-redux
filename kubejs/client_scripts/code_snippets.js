// requires: probejs
// requires: cobblemon
/** @type {typeof import("com.cobblemon.mod.common.api.pokemon.PokemonSpecies").$PokemonSpecies } */
let $PokemonSpecies  = Java.loadClass("com.cobblemon.mod.common.api.pokemon.PokemonSpecies")
/** @type {typeof import("com.cobblemon.mod.common.pokemon.properties.PropertiesCompletionProvider").$PropertiesCompletionProvider } */
let $PropertiesCompletionProvider  = Java.loadClass("com.cobblemon.mod.common.pokemon.properties.PropertiesCompletionProvider")
/** @type {typeof import("com.cobblemon.mod.common.api.moves.Moves").$Moves } */
let $Moves  = Java.loadClass("com.cobblemon.mod.common.api.moves.Moves")
/** @type {typeof import("com.cobblemon.mod.common.api.abilities.Abilities").$Abilities } */
let $Abilities  = Java.loadClass("com.cobblemon.mod.common.api.abilities.Abilities")

/**
 * @import {$Stream} from "java.util.stream.Stream"
 * @import {$Snippet} from "moe.wolfgirl.probejs.lang.snippet.Snippet"
 */

// If ProbeJS is installed and `/probejs dump` is executed,
// these additional snippets become available in Visual Studio Code.
// Useful when I don't remember how to spell Fezandipiti.

ProbeEvents.snippets(event => {
	/** @param {string} name @param {string} prefix @param {$Stream} stream @param {string} description */
	function snippet_from_string_stream(name, prefix, stream, description) {
		event.create(name, snippet => {
			snippet.prefix(prefix).literal("\"").choices(stream.sorted().toList()).literal("\"")
		})
	}

	let species_stream = $PokemonSpecies.species.stream().map(item => {
		const id = item.resourceIdentifier
		return id.namespace == "cobblemon" ? id.path : id.toString()
	})
	snippet_from_string_stream("cobblemon$$pokemon_species", "@pokemon", species_stream, "Awesome Creatures Inc.")
	snippet_from_string_stream("cobblemon$$pokemon_property", "@pokemon_property", $PropertiesCompletionProvider.INSTANCE.keys().stream())
	snippet_from_string_stream("cobblemon$$pokemon_move", "@pokemon_move", $Moves.names().stream())
	snippet_from_string_stream("cobblemon$$pokemon_ability", "@pokemon_ability", $Abilities.all().stream().map(ability => ability.getName()))

	if (Client.hasSingleplayerServer()) {
		let all_advancements = Client.getSingleplayerServer().getAdvancements().getAllAdvancements()
		snippet_from_string_stream("minecraft$$advancement", "@advancement", all_advancements.stream().map(advancement => advancement.toString()))
	}
})

// ProbeEvents.assignType(event => {
// 	ProbeJS.captureType($PokemonSpecies)
// 	ProbeJS.captureType($PropertiesCompletionProvider)
// })