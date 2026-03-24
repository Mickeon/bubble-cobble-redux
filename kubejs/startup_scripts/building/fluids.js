
StartupEvents.registry("fluid", event => {
	// const possible_tints = ["white", "gray", "cyan", "red", "green", "light_purple"]

	const renuvium = event.create("renuvium", "kubejs:thick")
	renuvium
		.stillTexture("kubejs:block/renuvium_still")
		.flowingTexture("kubejs:block/renuvium_flow")
		.levelDecreasePerBlock(3)
		.tickRate(50)
		.explosionResistance(15)
		.renderType("cutout")
		.translucent()
		// .tint(possible_tints[Utils.getRandom().nextInt(possible_tints.length)])
		// Changes tint on every startup, basically.
		.tint(Color.rgba(
			Utils.getRandom().nextInt(128, 255),
			Utils.getRandom().nextInt(128, 255),
			Utils.getRandom().nextInt(128, 255),
			255
		).getRgb())
		.tag("create:bottomless/allow")
		.tag("create:fan_processing_catalysts/haunting")
		.displayName(Text.red("Renuvium"))

	renuvium.fluidType
		.lightLevel(3)
		.rarity("rare")
		.canDrown(true)
		.viscosity(100) // Arbitrary and I don't think either values are used anywhere for us.
		.density(100)
		.canPushEntity(true)
		.motionScale(-0.01)
		.fallDistanceModifier(0.5)

	// Does not work unfortunately, due to a KubeJS bug.
	// renuvium.block
	// 	.lightLevel(3)
	// 	.randomTick(r => play_sound_globally(r.level, r.block.getPos().getCenter(), "artifacts:item.whoopee_cushion.fart", "blocks"))
	// 	.soundType(SoundType.AMETHYST)

	renuvium.bucketItem
		.rarity("rare")
		.tag("c:buckets")
})


BlockEvents.modification(event => {
	event.modify(["kubejs:renuvium"], /** @param {$BlockModifications} modified */ modified => {
		modified.setLightEmission(3)
		modified.setSpeedFactor(0.8)
		modified.setFriction(0.01)
		modified.setSoundType(SoundType.HONEY_BLOCK)
		// Does not work for some reason.
		// modified.setIsRandomlyTicking(true)
		// modified.setRandomTickCallback(r => play_sound_globally(r.level, r.block.getPos().getCenter(), "artifacts:item.whoopee_cushion.fart", "blocks"))
	})
})