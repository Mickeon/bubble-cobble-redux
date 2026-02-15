
StartupEvents.registry("block", event => {
	// Blocks.MUD_BRICKS
	event.create("cracked_mud_bricks")
			.copyPropertiesFrom(Blocks.MUD_BRICKS)
	event.create("chiseled_mud_bricks")
			.copyPropertiesFrom(Blocks.MUD_BRICKS)
			.parentModel("minecraft:block/cube_column")
			.textures({
				end: "kubejs:block/mud_pillar_top",
				side: "kubejs:block/chiseled_mud_bricks"
			})
			.bounciness(0.5)
			.fallenOn(/** @param {import("dev.latvian.mods.kubejs.block.callback.EntityFallenOnBlockCallback").$EntityFallenOnBlockCallback$$Type} callback */ callback => {
				callback.applyFallDamage()
				if (!Platform.isClientEnvironment() || !Client.isLocalPlayer(callback.entity.uuid)) {
					return
				}

				callback.level.playLocalSound(callback.block.getCenterX(), callback.block.getCenterY(), callback.block.getCenterZ(), "kubejs:block.chiseled_mud_bricks.fall", "blocks", 0.2, 0.9, false)
			})
	event.create("mud_pillar")
			.copyPropertiesFrom(Blocks.MUD_BRICKS)
			.property(BlockProperties.AXIS)
			.placementState(/** @param {import("dev.latvian.mods.kubejs.block.callback.BlockStateModifyPlacementCallback").$BlockStateModifyPlacementCallback$$Type} callback */ callback => {
				callback.set(BlockProperties.AXIS, callback.clickedFace.axis)
			})
})

StartupEvents.registry("sound_event", event => {
	event.create("kubejs:block.chiseled_mud_bricks.fall")
})