
StartupEvents.registry("block", event => {
	// Blocks.MUD_BRICKS
	event.create("bubble_cobble:cracked_mud_bricks")
			.copyPropertiesFrom(Blocks.MUD_BRICKS)
	event.create("bubble_cobble:chiseled_mud_bricks")
			.copyPropertiesFrom(Blocks.MUD_BRICKS)
			.parentModel("minecraft:block/cube_column")
			.textures({
				end: "bubble_cobble:block/mud_pillar_top",
				side: "bubble_cobble:block/chiseled_mud_bricks"
			})
			.bounciness(0.5)
			.fallenOn(callback => {
				callback.applyFallDamage()
				if (!Platform.isClientEnvironment() || !Client.isLocalPlayer(callback.entity.uuid)) {
					return
				}

				callback.level.playLocalSound(callback.block.getCenterX(), callback.block.getCenterY(), callback.block.getCenterZ(), "bubble_cobble:block.chiseled_mud_bricks.fall", "blocks", 0.2, 0.9, false)
			})
	event.create("bubble_cobble:mud_pillar")
			.copyPropertiesFrom(Blocks.MUD_BRICKS)
			.property(BlockProperties.AXIS)
			.placementState(callback => {
				callback.set(BlockProperties.AXIS, callback.clickedFace.axis)
			})
})

StartupEvents.registry("sound_event", event => {
	event.create("bubble_cobble:block.chiseled_mud_bricks.fall")
})