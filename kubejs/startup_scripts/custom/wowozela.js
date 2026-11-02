
StartupEvents.registry("item", event => {
	event.create("bubble_cobble:wowozela")
			.unstackable()
			.use((level, player, hand) => global.start_using_wowozela(level, player, hand))
			.releaseUsing((item_stack, level, entity, tick) => global.release_using_wowozela(item_stack, level, entity, tick))
			.useDuration(item_stack => 100000)
			.glow(true)
			.useAnimation("toot_horn")
			.tooltip(Text.of(`Eye-pitch-based instrument`).gray())
			.texture("minecraft:item/bamboo")
			.parentModel("minecraft:item/handheld")
			.tag("c:tools")
})

StartupEvents.modifyCreativeTab("minecraft:tools_and_utilities", event => {
	event.add("bubble_cobble:wowozela")
})

/** @type {import("@package/dev/latvian/mods/kubejs/item").$ItemBehavior$UseCallback_} */
global.start_using_wowozela = function(level, player, hand) {
	if (level.isClientSide()) {
		return true
	}
	let custom_data = player.getHeldItem(hand).getCustomData()
	level.server.sendData("bubble_cobble:start_wowozela", {
		uuid: player.getStringUuid(),
		sound: custom_data.getString("sound")}
	)

	// player.modifyAttribute("minecraft:generic.movement_speed", "bubble_cobble:wowozela", 2, "add_multiplied_base")
	return true
}

/** @type {import("@package/dev/latvian/mods/kubejs/item").$ItemBehavior$FinishUsingCallback_} */
global.release_using_wowozela = function(item_stack, level, entity) {
	if (level.isClientSide()) {
		return item_stack
	}
	level.server.sendData("bubble_cobble:stop_wowozela", {
		uuid: entity.getStringUuid()
	})
	// entity.removeAttribute("minecraft:generic.movement_speed", "bubble_cobble:wowozela")
	return item_stack
}

// /give @s bubble_cobble:wowozela[custom_data={sound_event:"minecraft:block.note_block.bit"}]
// /give @s bubble_cobble:wowozela[custom_data={sound_event:"sounds:block.copper_ore.step"}]

// let $MovingSoundInstance = Java.loadClass("com.cobblemon.mod.common.util.MovingSoundInstance")
// new $MovingSoundInstance()
