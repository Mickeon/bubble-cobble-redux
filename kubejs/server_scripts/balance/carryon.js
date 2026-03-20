// requires: carryon

// Allow carrying Noteblocks.
BlockEvents.rightClicked(["minecraft:note_block"], event => {
	const player = event.player
	if (player.isHoldingInAnyHand(item => item != Item.getEmpty())) {
		return // Need to be fully empty-handed.
	}

	const carry_on_data = player.getCarryOnData()
	if (!carry_on_data.isKeyPressed() || event.hitResult.distanceTo(player) > 2.5) {
		return
	}

	const level_block = event.block
	carry_on_data.setBlock(level_block.getBlockState(), null)
	player.setCarryOnData(carry_on_data)

	play_sound_globally(event.level, level_block.getPos().getCenter(), level_block.getBlock().getSoundType().getBreakSound(), "blocks", 1, 0.5)
	level_block.setBlockState(Blocks.AIR)

	event.cancel()
})

ServerEvents.tags("block", event => {
	event.add("bubble_cobble:no_fast_travel_when_carrying",
		/sophisticatedstorage:.*(chest|barrel)/,
		"#lootr:containers",
		"gravestone:gravestone"
	)
})

ServerEvents.tags("entity_type", event => {
	event.add("bubble_cobble:no_fast_travel_when_carrying",
		"#lootr:containers",
	)
})

// Nerf players carrying heavy storage considerably.
PlayerEvents.tick(event => {
	const player = event.player
	if (!player.carryOnData.carrying) {
		return
	}

	// CarryOn really does not like it when we check the `block` property without carrying a block.
	// So we check it like this.
	if (player.carryOnData.nbt.getString("type") != "BLOCK") {
		return
	}
	if (player.carryOnData.block.hasTag("bubble_cobble:no_fast_travel_when_carrying")) {
		player.addEffect(MobEffectUtil.of("via_romana:travellers_fatigue", SEC, 0, true, true))
		player.addEffect(MobEffectUtil.of("supplementaries:overencumbered", SEC, 5, true, true))
		player.unRide()
		player.modifyAttribute("minecraft:generic.jump_strength", "bubble_cobble:carrying", -2, "add_multiplied_total")
		player.server.scheduleInTicks(1, callback => {
			if (!player.carryOnData.carrying) {
				player.removeAttribute("minecraft:generic.jump_strength", "bubble_cobble:carrying")
			}
		})
	}
})