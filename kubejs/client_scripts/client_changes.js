//#region More imports than you will ever know what to do with.
// https://github.com/SettingDust/ModSets/blob/main/src/common/game/main/java/settingdust/mod_sets/game/ModSetsConfigScreenGenerator.java
let $ModSetsConfigScreenGenerator = Java.loadClass("settingdust.mod_sets.game.ModSetsConfigScreenGenerator")
/** @type {typeof import("net.neoforged.neoforge.client.event.ClientPauseChangeEvent$Post").$ClientPauseChangeEvent$Post } */
let $ClientPauseChangeEvent$Post  = Java.loadClass("net.neoforged.neoforge.client.event.ClientPauseChangeEvent$Post")
/** @type {typeof import("net.neoforged.neoforge.client.event.ScreenEvent$Init$Post").$ScreenEvent$Init$Post } */
let $ScreenEvent$Init$Post  = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$Init$Post")
/** @type {typeof import("net.minecraft.client.gui.components.Tooltip").$Tooltip } */
let $Tooltip  = Java.loadClass("net.minecraft.client.gui.components.Tooltip")
/** @type {typeof import("net.minecraft.client.gui.screens.PauseScreen").$PauseScreen } */
let $PauseScreen  = Java.loadClass("net.minecraft.client.gui.screens.PauseScreen")
/** @type {typeof import("net.minecraft.client.gui.screens.TitleScreen").$TitleScreen } */
let $TitleScreen  = Java.loadClass("net.minecraft.client.gui.screens.TitleScreen")
/** @type {typeof import("net.minecraft.client.gui.components.Button").$Button } */
let $Button  = Java.loadClass("net.minecraft.client.gui.components.Button")
/** @type {typeof import("net.minecraft.client.gui.components.Button$Builder").$Button$Builder } */
let $Button$Builder  = Java.loadClass("net.minecraft.client.gui.components.Button$Builder")
/** @type {typeof import("net.neoforged.neoforge.client.gui.widget.ModsButton").$PauseScreen } */
let $ModsButton  = Java.loadClass("net.neoforged.neoforge.client.gui.widget.ModsButton")
//#endregion

// Avoid accidentally placing lanterns when held in offhand.
// There's similar server-side code in server_changes.js.
BlockEvents.rightClicked(event => {
	if (event.hand == "OFF_HAND" && event.item.hasTag("bubble_cobble:lanterns") && !event.player.shiftKeyDown) {
		event.player.playNotifySound("bubble_cobble:buzz", "players", 0.5, 1.0)
		event.cancel()
	}
})

// Add easily-accessible Mod Sets button.
NativeEvents.onEvent($ScreenEvent$Init$Post, event => {
	if (!(event.screen instanceof $PauseScreen || event.screen instanceof $TitleScreen)) {
		return
	}
	const screen = event.screen
	// HACK: Nasty way to find the Mods Button.
	/** @type {import("net.minecraft.client.gui.components.Button").$Button$$Type} */
	let mods_button
	screen.children().forEach(existing_button => {
		if (existing_button instanceof $Button) {
			// console.log(Text.of(existing_button.getMessage()))
			if (existing_button.getMessage().getString() == "Mods") {
				mods_button = existing_button
			}
		}
	})

	if (!mods_button) {
		console.warn("Could not find Mods button?")
		return
	}

	const modsets_button = new $Button$Builder(Text.translatableWithFallback("", "Sets"), button => {
			Client.forceSetScreen($ModSetsConfigScreenGenerator.generateScreen(Client.currentScreen))
		})
		// .pos(screen.width * 0.5 + 104, screen.height * 0.5 - 24)
		.pos(mods_button.right, mods_button.getY())
		.width(32)
		.tooltip($Tooltip.create(Text.translatableWithFallback("", "Turn off the few\nmods you HATE")))
		.build()

	screen.addRenderableWidget(modsets_button)
})

// KeyBindEvents.pressed("key.use", event => {
// 	event.client.statusMessage = "Potato"
// })


// Move EMI buttons away from the bottom-right.
// Currently disabled as there's no reason to be doing this.
// /** @import {$AbstractWidget} from "net.minecraft.client.gui.components.AbstractWidget" */
// // https://github.com/emilyploszaj/emi/blob/1.21/xplat/src/main/java/dev/emi/emi/screen/EmiScreenManager.java
// let $EmiScreenManager = Java.loadClass("dev.emi.emi.screen.EmiScreenManager")
// /** @type {typeof import("net.minecraft.client.gui.screens.inventory.AbstractContainerScreen").$AbstractContainerScreen } */
// let $AbstractContainerScreen  = Java.loadClass("net.minecraft.client.gui.screens.inventory.AbstractContainerScreen")
// NativeEvents.onEvent("highest", $ScreenEvent$Render$Pre, event => {
// 	console.log(event.screen.getMenu)
// 	if (!event.screen instanceof $AbstractContainerScreen) {
// 		return
// 	}

// 	console.log(event.screen)

// 	const PADDING = 2
// 	const screen = event.screen

// 	const /** @type {$AbstractWidget} */ emi_config = $EmiScreenManager.emi
// 	const /** @type {$AbstractWidget} */ emi_search = $EmiScreenManager.search
// 	const /** @type {$AbstractWidget} */ emi_tree = $EmiScreenManager.tree
// 	try {
// 		// Debugging.
// 		// let widget = emi_search
// 		// console.log(`pos  x: ${widget.getX()}\ty: ${widget.getY()}`)
// 		// console.log(`base x: ${widget.baseX()}\ty: ${widget.baseY()}`)
// 		// console.log(`size x: ${widget.getWidth()}\ty: ${widget.getHeight()}`)
// 		// console.log(`rectangle ${widget.rectangle}`)

// 		emi_config.setX(emi_search.getX() - emi_config.getWidth() - PADDING)
// 		emi_tree.setX(emi_config.getX() - emi_tree.getWidth() - PADDING)
// 	} catch (error) {
// 		console.error(error)
// 	}
// })
