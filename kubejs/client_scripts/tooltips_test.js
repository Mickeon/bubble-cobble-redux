
ItemEvents.modifyTooltips(event => {
	event.modify("minecraft:skeleton_skull", text => {
		text.dynamic("skeleton_skull")
	})
	event.modify("minecraft:player_head", text => {
		text.dynamic("show_player_head_owner")
	})

	// SHIFT, ALT and CTRL are all keys you can check!
	event.modify("minecraft:beacon", { shift: false }, text => {
		text.add(Text.gold("Hold ").append(Text.yellow("Shift ")).append("to see more info"))
	})

	event.modify("minecraft:beacon", { shift: true }, text => {
		text.insert(1, Text.green("Gives positive effects to players in a range").bold(true))
		text.insert(2, Text.red("Requires a base built out of precious metals or gems to function!"))
		text.insert(3,
			Text.white("Iron, ").append(
			Text.aqua("Diamonds, ")).append(
			Text.gold("Gold ")).append(
			Text.white("or even ")).append(
			Text.green("Emeralds ")).append(
			Text.white("are valid base blocks!"))
		)
	})

	event.modifyAll({ alt: true, ctrl: true, advanced: true }, text => {
		text.dynamic("show_modpack_debug_stuff")
	})
})

ItemEvents.dynamicTooltips("skeleton_skull", event => {
	event.add(Text.gray("Could this have been ").append(Client.player.name).append("'s head?"))
})


ItemEvents.dynamicTooltips("show_player_head_owner", event => {
	/** @import {$ResolvableProfile} from "net.minecraft.world.item.component.ResolvableProfile"*/
	const profile = /** @type {$ResolvableProfile?} */ (event.item.components.get("minecraft:profile"))
	const player_name = profile && profile.isResolved() && profile.name().get()
	if (player_name) {
		event.lines.add(1, Text.translateWithFallback("", "Looks like %s's head...", [Text.aqua(player_name)]).darkGray())
	}
})

ItemEvents.dynamicTooltips("show_modpack_debug_stuff", event => {
	event.add(Text.gray(["🏴 ", Text.darkGray(event.item.getDescriptionId() ?? "none")]))

	const block = event.item.block
	if (block) {
		let sound_type = block.invokeGetSoundType(block.defaultBlockState())
		event.add(Text.gray("🔊 ").append(Text.darkGray(sound_type.placeSound.location)))
	}

})
