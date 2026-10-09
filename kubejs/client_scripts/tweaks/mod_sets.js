// requires: mod_sets

/**
 * @import {$GuiEventListener} from "@package/net/minecraft/client/gui/components/events"
 * @import {$Button} from "@package/net/minecraft/client/gui/components"
 */

let $Button = Java.loadClass("net.minecraft.client.gui.components.Button")
let $Tooltip = Java.loadClass("net.minecraft.client.gui.components.Tooltip")
let $PauseScreen = Java.loadClass("net.minecraft.client.gui.screens.PauseScreen")
let $TitleScreen = Java.loadClass("net.minecraft.client.gui.screens.TitleScreen")
let $Button$Builder = Java.loadClass("net.minecraft.client.gui.components.Button$Builder")
let $ScreenEvent$Init$Post = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$Init$Post")
// let $ModsButton = Java.loadClass("net.neoforged.neoforge.client.gui.widget.ModsButton")

// https://github.com/SettingDust/ModSets/blob/main/src/common/game/main/java/settingdust/mod_sets/game/ModSetsConfigScreenGenerator.java
let $ModSetsConfigScreenGenerator = Java.loadClass("settingdust.mod_sets.game.ModSetsConfigScreenGenerator")

const MODS_TEXT = Text.translate("fml.menu.mods").getString()
const SERVER_LINKS_TEXT = Text.translate("menu.server_links").getString()

// Add easily-accessible Mod Sets button.
NativeEvents.onEvent($ScreenEvent$Init$Post, event => {
	if (!(event.screen instanceof $PauseScreen || event.screen instanceof $TitleScreen)) {
		return
	}

	// Genuinely horrid way to find the Mods/Links Button.
	/** @type {$Button=} */
	let target_button
	/** @type {$List<$GuiEventListener} */
	(event.screen.children()).forEach(existing_button => {
		if (!target_button && existing_button instanceof $Button) {
			let message_string = existing_button.getMessage().getString()
			if (message_string == MODS_TEXT || message_string == SERVER_LINKS_TEXT) {
				target_button = existing_button
			}
		}
	})
	if (!target_button) {
		console.warn(`Expected Mods/Links button in ${event.screen}, but could not find it?`)
		return
	}

	const modsets_button = new $Button$Builder(Text.translatableWithFallback("", "Sets"), button => {
			Client.forceSetScreen($ModSetsConfigScreenGenerator.generateScreen(event.screen))
		})
		// .pos(screen.width * 0.5 + 104, screen.height * 0.5 - 24)
		.pos(target_button.right, target_button.getY())
		.width(32)
		.tooltip($Tooltip.create(Text.translatableWithFallback("", "Turn off the few\nmods you HATE")))
		.build()

	event.screen.addRenderableWidget(modsets_button)
})
