// requires: probejs

/**
 * @import {$Stream} from "@package/java/util/stream"
 * @import {$Collection} from "@package/java/util"
 */

let $Collection = Java.loadClass("java.util.Collection")

// Quite overly structured in hindsight, isn't it?
/** @typedef {ReturnType<typeof SnippetBuilder>} Snippet */
function SnippetBuilder() {
	return {
		prefix: /** @type {Array<string>} */ ([]),
		body: /** @type {Array<string>} */ ([]),
		with_prefix: /** @type {(p: string) => typeof this} */ function (p) {
			this.prefix.push(p)
			return this
		},
		with_description: /** @type {(p: string) => typeof this} */ function (d) {
			this.description = d
			return this
		},
		stripped: function() {
			for (const key in this) {
				if (this[key] instanceof Function) {
					delete this[key]
				}
			}
			return this
		}
	}
}

/** @param {Array<string>} choices */
SnippetBuilder.from_choices = function(choices) {
	const snippet = this()
	const choices_string = choices.join(",")
	snippet.body = ['"${1|' + choices_string + '|}"$0']
	return snippet
}
/** @param {$Stream | $Collection} c @returns {Array<string>} */
function to_string_array(c) {
	const stream = (c instanceof $Collection ? c.stream() : c)
	return stream
			.map((a) => String(a))
			.sorted()
			.toArray()
}


global.datagen.functions.code_snippets = function() {
	const PATH = ".vscode/bubble_cobble.code-snippets"
	const REGISTRY_ACCESS = Registry.access().access()

	const result = {}
	/** @type {(snippet: Snippet, key: string=) => void} */
	function add_to_result(snippet, key) {
		key = key || snippet.prefix[0]
		result[key] = snippet.stripped()
	}

	/** Misnomner, all collections are fine, too.
	 * @type {(a: string, a: $Stream | $Collection, a: string=, a: string=) => void} */
	function snippet_from_stream(prefix, list, name, description) {
		let strings = to_string_array(list)
		if (strings.length == 0) {
			return
		}

		let snippet = SnippetBuilder.from_choices(strings).with_prefix(prefix)
		if (description) {
			snippet = snippet.with_description(description)
		}
		add_to_result(snippet, name)
	}

	// Tags.
	REGISTRY_ACCESS.registries().forEach(entry => {
		let registry_id = ID.reduce(entry.key().location())
		let registry = entry.value()

		snippet_from_stream(`@tag/${registry_id}`,
				registry.getTagNames().map(tag_key => tag_key.location()),
				`@tag/${registry_id}`,
				`Creates a tag from the "${registry_id}" registry`)
	})

	snippet_from_stream("@mod", Platform.getList())
	snippet_from_stream("@registries", REGISTRY_ACCESS.listRegistries().map(key => key.location()))
	snippet_from_stream("@recipe_id", Client.level.getRecipeManager().getRecipeIds())

	if (Platform.isClientEnvironment()) {
		snippet_from_stream("@texture", Client.getModelManager().getAtlas("minecraft:textures/atlas/blocks.png").texturesByName.keySet())
		snippet_from_stream("@advancement", Client.getSingleplayerServer().getAdvancements().getAllAdvancements(), "minecraft$$advancement")

		// Language Keys, Translation/Localization strings.
		let $ClientLanguage = Java.loadClass("net.minecraft.client.resources.language.ClientLanguage")
		let $Language = Java.loadClass("net.minecraft.locale.Language")

		let language = $Language.getInstance()
		if (language instanceof $ClientLanguage) {
			snippet_from_stream("@lang_key", language.storage.keySet()
					.stream()
					.filter(s => /^[^:_][a-z0-9._:# \-]*$/.test(s))
					// There's way too many and it makes VSCode explode, so we gotta cut them down.
					.filter(s => !/^(button|argument(s?)|command(s?)|config|option|subtitle|tag|text)\./.test(s)
						&& !/^(accessories|catnip|cobblemon|collective|colorfulhearts|editor|enhancedcelestials2core|fc|fml|modernfix|moonlight|nbtac|panoptic|treechop|via_romana)\./.test(s)
						&& !/gui\.(xaero)/.test(s)
						&& !/\.(cpm|config|configuration|command(s?))\./.test(s)
					))
		}
	}

	if (Platform.isLoaded("cobblemon")) {
		let $PokemonSpecies = Java.loadClass("com.cobblemon.mod.common.api.pokemon.PokemonSpecies")
		let $PropertiesCompletionProvider = Java.loadClass("com.cobblemon.mod.common.pokemon.properties.PropertiesCompletionProvider")
		let $Abilities = Java.loadClass("com.cobblemon.mod.common.api.abilities.Abilities")
		let $Moves = Java.loadClass("com.cobblemon.mod.common.api.moves.Moves")

		let species_stream = $PokemonSpecies.species.stream().map(item => {
			const id = item.resourceIdentifier
			return id.namespace == "cobblemon" ? id.path : id.toString()
		})

		snippet_from_stream("@pokemon", species_stream, undefined, "Awesome Creatures Inc.")
		snippet_from_stream("@pokemon_property", $PropertiesCompletionProvider.INSTANCE.keys().stream())
		snippet_from_stream("@pokemon_move", $Moves.names().stream())
		snippet_from_stream("@pokemon_ability", $Abilities.all().stream().map(ability => ability.getName()))
	}

	JsonIO.write(PATH, result)
	// console.log(JSON.stringify(result, null, "\t"))
}
