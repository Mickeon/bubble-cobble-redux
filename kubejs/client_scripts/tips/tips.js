
// requires:tipsmod
// ignored: true
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
	"sol",
	"candle",
	"helpful",
	"unhelpful"
]
const HARDCODED_TITLES = {
	// "sol": Text.of("Sol Gaming Tip").color("#76EC84").bold().underlined()
}
const DEFAULT_CYCLE_TIME = 10000 // For now.
const HELPFUL_CYCLE_TIME = 12000

ClientEvents.generateAssets("before_mods", event => {
	TIPS_FILENAMES.forEach(name => {
		const path = TIPS_FOLDER_PATH + name + ".json"
		const obj = JsonUtils.toObject(JsonIO.readJson(path))
		if (!obj) {
			console.warn(`Could not read JSON at path ${path}. Skipping.`)
			return
		}

		const title = obj.title ?? TITLE_PLACEHOLDER
		if (name in HARDCODED_TITLES) {
			title = HARDCODED_TITLES[name]
		}
		const text_list = (Array.isArray(obj) ? obj : (obj.tips ?? []))
		const helpful = Boolean(obj.helpful) // Undocumented.

		console.log(`Found ${text_list.length} tips for \"${name}\"`)

		let j = 0
		for (const text of text_list) {
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
