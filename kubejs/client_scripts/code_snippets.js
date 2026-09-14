// ignored: true
// requires: probejs
// requires: cobblemon

// If ProbeJS is installed and `/probejs dump` is executed,
// these additional snippets become available in Visual Studio Code.
// Useful when I don't remember how to spell Fezandipiti.

ProbeEvents.snippets(event => {
	let $PokemonSpecies = Java.loadClass("com.cobblemon.mod.common.api.pokemon.PokemonSpecies")
	let $PropertiesCompletionProvider = Java.loadClass("com.cobblemon.mod.common.pokemon.properties.PropertiesCompletionProvider")
	let $Abilities = Java.loadClass("com.cobblemon.mod.common.api.abilities.Abilities")

	/**
	 * @import {$Stream} from "@package/java/util/stream"
	 * @import {$Snippet} from "@package/moe/wolfgirl/probejs/lang/snippet" does not work.
	 */

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

	ProbeJS.captureType("com.cobblemon.mod.common.api.events.CobblemonEvents")
	ProbeJS.captureType("net.minecraft.world.entity.projectile.ProjectileUtil")
	ProbeJS.captureType("net.neoforged.neoforge.common.DataMapHooks")
	ProbeJS.captureType("com.yori3o.yo_hooks.common.hookregistry.HookRegistry")

	// I don't know why ProbeJS refuses to capture them unless I do this.
	if (Platform.isLoaded("smartkeyprompts")) {
		let $SkpUtils = Java.loadClass("com.mafuyu404.smartkeyprompts.util.SkpUtils")
		let $CommonUtils = Java.loadClass("com.mafuyu404.smartkeyprompts.util.CommonUtils")
		let $KeyUtils = Java.loadClass("com.mafuyu404.smartkeyprompts.util.KeyUtils")
		let $NBTUtils = Java.loadClass("com.mafuyu404.smartkeyprompts.util.NBTUtils")
		let $PlayerUtils = Java.loadClass("com.mafuyu404.smartkeyprompts.util.PlayerUtils")
		let $PromptUtils = Java.loadClass("com.mafuyu404.smartkeyprompts.util.PromptUtils")
	}
})
