
ItemEvents.modifyTooltips(event => {
	event.modify("minecraft:skeleton_skull", text => {
		text.dynamic("skeleton_skull")
	})
	// Show the name of the player who owns the skull in a skulls tooltip.
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

	event.modifyAll({ alt: true, advanced: true }, text => {
		text.dynamic("show_localization_string")
	})
})

ItemEvents.dynamicTooltips("skeleton_skull", event => {
	event.add(Text.gray("Could this have been ").append(Client.player.name).append("'s head?"))
})

ItemEvents.dynamicTooltips("show_player_head_owner", event => {
	// let profile = event.item.components.get("minecraft:profile")
	// let player_name = profile && profile.name().get()
	// if (player_name) {
	// 	event.add(Text.darkGray("Looks like ").append(Text.aqua(player_name)).append(Text.darkGray("'s head...")))
	// }
})

ItemEvents.dynamicTooltips("show_localization_string", event => {
	event.add(Text.gray("Translation ID: ").append(Text.darkGray(event.item.getDescriptionId() ?? "none")))
})
