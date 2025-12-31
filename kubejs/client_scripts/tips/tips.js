
// requires: tipsmod
// Temporarily disable these tips during Beta testing.

// Undocumented sources:
// https://github.com/Darkhax-Minecraft/Tips/blob/1.21.1/common/src/main/java/net/darkhax/tipsmod/common/impl/client/tips/conditions/ConditionRules.java
// https://github.com/Darkhax-Minecraft/Tips/blob/1.21.1/common/src/main/java/net/darkhax/tipsmod/common/impl/client/tips/SimpleTip.java#L84
// https://github.com/Darkhax-Minecraft/Tips/blob/1.21.1/common/src/main/java/net/darkhax/tipsmod/common/impl/client/tips/conditions/RuleBuilders.java

// The following is a valid JSON example.
// event.json(`bubble_cobble:tips/${index}`, {
// 	type: "tipsmod:simple", // Required.
// 	title: Text.of(), // Required.
// 	text: Text.of(), // Required.
//  cycle_time: integer // Optional.
// 	conditions: { // Optional.
// 		screens: {any_of: "anvil_screen"}
// 	}
// })

const TITLE_PLACEHOLDER = Text.translate("Tip").color("gray").bold().underlined()
const TIPS_FOLDER_PATH = "kubejs/client_scripts/tips/"
const TIPS_FILENAMES = [
	"blu",
	"candle_helpful",
	"candle",
	"cantie",
	"helpful",
	"luigi_handbook",
	"luigi",
	"madds",
	"neo",
	"sol",
	"unhelpful",
]
const DEBUG_CYCLE_TIME = 5000 // Constant not used, just for reference.
const DEFAULT_CYCLE_TIME = 15000 // Constant not used, just for reference.
const HELPFUL_CYCLE_TIME = 20000

ClientEvents.generateAssets("before_mods", event => {
	TIPS_FILENAMES.forEach(name => {
		const path = TIPS_FOLDER_PATH + name + ".json"

		const obj = try_read_and_parse_json(path)
		if (!obj) {
			console.warn(`Could not parse JSON at path ${path}. Skipping.`)
			return
		}

		const title = obj.title ?? TITLE_PLACEHOLDER
		const text_list = (Array.isArray(obj) ? obj : (obj.tips ?? []))
		const helpful = Boolean(obj.helpful)

		console.log(`Found ${text_list.length} tips in \"${name}\"`)

		let j = 0
		for (let text of text_list) {

			// if (typeof text === "string") {
			// 	text = markdown_string_to_component(text)
			// }

			let result = {
				type: "tipsmod:simple",
				text: text,
			}
			if (title) {
				result.title = title
			}
			if (helpful) {
				result.cycle_time = HELPFUL_CYCLE_TIME
			}

			let result_path = `bubble_cobble:tips/${name}/${j}`
			event.json(result_path, result)
			// console.log(`Stored tip at path \"${result_path}\"`)

			j += 1 // I hate this but what can you do.
		}
	})
})

// Debug current screen.
// var prior_screen
// ClientEvents.tick(event => {
// 	const current_screen = event.client.currentScreen
// 	if (prior_screen != current_screen) {
// 		prior_screen = current_screen
// 		console.log(current_screen)
// 	}
// })

// for (const [index, tip] of MISC_TIPS.entries()) {
// 	event.json(`bubble_cobble:tips/misc/${index}`, {
// 		type: "tipsmod:simple",
// 		title: Text.of("Tip").color("#76D0EC").bold().underlined(),
// 		text: tip,
// 	})
// }

// Rapid testing.
// ItemEvents.modifyTooltips(event => {
// 	event.add("minecraft:acacia_boat", markdown_string_to_component(
// 		"The ***FREAKING*** **Blackboard** ||accepts|| _more _than."
// 	))
// })

/** @param {String} str @returns {$MutableComponent} */
function markdown_string_to_component(str) {
	// const str = "The *Blackboard* accepts _more _than just dyes.";
	console.log(`Going through markdown conversion for: "${str}"`)

	let final_text = Text.empty()

	// const regex = /(\*\*|\*|_|.$)/g
	const regex = /(\|\||\*\*|\*|_|.$)/g
	// const regex = /(\[.*\]|\|\||\*\*|\*|_|.$)/g
	// const regex = /(?:^|[^\\])(\*\*\*|\*\*|\*|_|.$)/g // Get second group in the match [1] with this one.
	// const regex = /(?<!\\)(?:\\\\)*(\*\*|\*|_|.$)/g // Does not work for Rhino.
	let /** @type {RegExpExecArray} */ match

	let bold = false
	let italic = false
	let obfuscated = false
	let start_idx = 0
	while ((match = regex.exec(str)) != null) {
		let group = match[0]
		console.log(`--- Found ${group} at index ${match.index} --- Next starts at ${regex.lastIndex}`);

		// Insert a component for the string found before these special characters.
		let text_component = Text.of(str.substring(start_idx, regex.lastIndex - group.length))
		if (bold) { text_component = text_component.bold() }
		if (italic) { text_component = text_component.italic() }
		if (obfuscated) { text_component = text_component.obfuscated() }
		// console.log(`"${text_component}"`)

		final_text = final_text.append(text_component)

		if (regex.lastIndex == str.length) {
			break // console.log(`End of the string`)
		}

		// Interpret the formatting for the next component.
		if (group == "**") {
			bold = !bold // console.log(`bold: ${bold}`)
		} else if (group == "_" || group == "*") {
			italic = !italic // console.log(`italic: ${italic}`)
		} else if (group == "||") {
			obfuscated = !obfuscated
		}

		start_idx = regex.lastIndex
	}

	return final_text
}


function try_read_and_parse_json(path) {
	try {
		return JSON.parse(JsonIO.readJson(path).toString())
	} catch (error) {
		console.error(error)
		return null
	}
}