

EntityEvents.drops("minecraft:player", event => {
	const player = event.player
	switch (player.username) {
		case "AceNil_": {
			add_drop(player, Item.of("minecraft:orange_dye"), 0.5)
			add_drop(player, Item.of("create:cardboard_package_10x8"), 0.5)
			add_drop(player, Item.of("create:cardboard"), 0.25)
			add_drop(player, Item.of("create:cardboard_block"), 0.2)
			add_drop(player, Item.of("create:bound_cardboard_block").withCustomName("Bound Cardboard Block 😳"), 0.2)
			add_drop(player, Item.of("kubejs:music_disc_void"), 0.1)
		} break;
		case "BootlegKaka": {
			add_drop(player, Item.of("minecraft:black_dye"), 0.75)
			add_drop(player, Item.of("minecraft:ink_sac"), 0.75)
			add_drop(player, Item.of("create:cardboard"), 0.25)
			add_drop(player, Item.of("create:cardboard_block"), 0.2)
		} break;
		case "BluStar7": {
			add_drop(player, Item.of("minecraft:blue_dye"), 0.75)
			add_drop(player, Item.of("minecraft:blue_dye").withCustomName("Blue Lyve"), 0.5)
		} break;
		case "BlueBerryNice": {
			add_drop(player, Item.of("minecraft:iron_nugget", 3), 0.5)
			add_drop(player, Item.of("minecraft:blue_dye"), 0.5)
			add_drop(player, Item.of("biomeswevegone:blueberries"), 0.5)
			add_drop(player, Item.of("biomeswevegone:blueberry_pie"), 0.1)
		} break;
		case "ButteryInkling": {
			add_drop(player, Item.of("minecraft:apple"), 0.75)
			add_drop(player, Item.of("biomeswevegone:green_apple"), 0.75)
			add_drop(player, Item.of("brewinandchewin:pizza_slice"), 0.75)
			add_drop(player, Item.of("minecraft:cake"), 0.2)
			add_drop(player, Item.of("farmersdelight:apple_pie"), 0.2)
			add_drop(player, Item.of("biomeswevegone:green_apple_pie"), 0.2)
			add_drop(player, Item.of("cobblemon:leftovers"), 0.01)
		} break;
		case "CafeJaze": {
			add_drop(player, Item.of("minecraft:brown_dye"), 0.75)
			add_drop(player, Item.of("create_deepfried:yuca_fries"), 0.5)
			add_drop(player, Item.of("handcrafted:white_cup"), 0.25)
			add_drop(player, Item.of("handcrafted:wood_cup"), 0.25)
		} break;
		case "CandleClockwork": {
			add_drop(player, Item.of("minecraft:orange_stained_glass"), 0.5)
			add_drop(player, Item.of("minecraft:orange_stained_glass_pane"), 0.5)
			add_drop(player, Item.of("kubejs:chiseled_mud_bricks"), 0.25)
			add_drop(player, Item.of("minecraft:orange_candle").withCustomName("Fair enough."), 0.25)
			add_drop(player, Item.of("supplementaries:candle_holder_orange"), 0.1)
		} break;
		case "CantieLabs": {
			add_drop(player, Item.of("kubejs:chiseled_mud_bricks"), 0.75)
			add_drop(player, Item.of("cobblemon:dragon_scale"), 0.25)
			add_drop(player, Item.of("create:cogwheel"), 0.5)
			add_drop(player, Item.of("minecraft:blue_dye"), 0.25)
		} break;
		case "CyanGoat": {
			add_drop(player, Item.of("minecraft:cyan_dye"), 0.75)
			add_drop(player, Item.of("minecraft:goat_horn"), 0.1)
		} break;
		case "Fableworks": {
			add_drop(player, Item.of("minecraft:pink_dye"), 0.75)
			add_drop(player, Item.of("minecraft:amethyst_shard"), 0.75)
		} break;
		case "Giuly_Clockwork": {
			add_drop(player, Item.of("minecraft:blue_dye"), 0.75)
			add_drop(player, Item.of("minecraft:soul_torch"), 0.25)
			add_drop(player, Item.of("minecraft:blue_candle"), 0.25)
			add_drop(player, Item.of("supplementaries:candle_holder_blue"), 0.1)
		} break;
		case "LabbyRosenfeld": {
			add_drop(player, Item.of("farmersdelight:milk_bottle"), 0.75)
			add_drop(player, Item.of("create_deepfried:yuca_fries"), 0.5)
			add_drop(player, Item.of("biomesoplenty:blood_bucket"), 0.1)
			const killer_player = event.source.player
			if (killer_player) {
				add_drop(player, Item.playerHead(killer_player.username).enchant("minecraft:vanishing_curse", 1))
				killer_player.tell(Text.lightPurple("Laby will remember this."))
			}
		} break;
		case "LuckyAquapura": {
			add_drop(player, Item.of("minecraft:white_dye"), 0.75)
			add_drop(player, Item.of("minecraft:white_dye"), 0.5)
			add_drop(player, get_funny_salmon(), 0.5)
		} break;
		case "luigiman0640": {
			add_drop(player, Item.of("minecraft:lime_dye"), 0.75)
			add_drop(player, Item.of("biomeswevegone:green_mushroom"), 0.5)
			add_drop(player, Item.of("minecraft:green_dye"), 0.25)
			add_drop(player, Item.of("minecraft:arrow", 4).withCustomName("Shell"), 0.125)
		} break;
		case "mAIgehound": {
			const scene_style = ["",
				{color:"#9ef4b1",text:`S`},{color:"#8ce9c0",text:`c`},{color:"#7bdfd0",text:`e`},{color:"#69d4e0",text:`n`},{color:"#58c9ef",text:`e`},
				{color:"#46beff",text:`-`},{color:"#60aaff",text:`S`},{color:"#7a96ff",text:`t`},{color:"#9582ff",text:`y`},{color:"#af6eff",text:`l`},{color:"#c95aff",text:`e`}
			]
			add_drop(player, Item.of("minecraft:bone").withCustomName("Buppy"), 0.75)
			add_drop(player, Item.of("minecraft:magenta_dye").withCustomName(scene_style), 0.75)
			add_drop(player, Item.of("minecraft:black_dye"), 0.25)
			add_drop(player, Item.of("minecraft:black_wool"), 0.25)
		} break;
		case "NightingaleNil": {
			add_drop(player, Item.of("minecraft:potion", {"minecraft:potion_contents": {potion: "minecraft:mundane", custom_color: 14466167}})
					.withCustomName("Ginseng Bottle").enchant("quick_charge", 3), 0.75)
			add_drop(player, Item.of("minecraft:green_dye"), 0.25)
			add_drop(player, Item.of("minecraft:lava_bucket"), 0.1)
		} break;
		case "minusjos": {
			add_drop(player, get_funny_salmon(), 0.75)
		} break;
		case "pepperponyo": {
			add_drop(player, Item.of("farmersdelight:hamburger").withCustomName("Hamburger :) 🍔"), 0.75)
		} break;
		case "Polyfluff": {
			add_drop(player, Item.of("minecraft:white_wool"), 0.75)
			add_drop(player, Item.of("biomeswevegone:cattail_sprout"), 0.5)
			add_drop(player, Item.of("biomesoplenty:cattail"), 0.25)
			add_drop(player, Item.of("kubejs:music_disc_grapes"), 0.1)
			player.level.spawnParticles("minecraft:dust_color_transition{from_color:[1.0, 1.0, 1.0], to_color:[1.0, 0.9, 0.5], scale: 4.0}", false,
				player.x, player.y, player.z,
				0.75, 0.5, 0.75, 50, 0.25
			)
			player.level.runCommandSilent(`execute as ${player.uuid} at ${player.uuid} run playsound supplementaries:item.bomb player @a ~ ~ ~ 1.0`)
			player.level.spawnParticles("minecraft:firework", false, player.x, player.eyeY, player.z, 0.1, 0.1, 0.1, 60, 0.1)
		} break;
		case "Rem_Phase02": {
			add_drop(player, Item.of("minecraft:honeycomb"), 0.75)
			add_drop(player, Item.of("minecraft:honey_bottle"), 0.5)
			add_drop(player, Item.of("farmersdelight:skillet"), 0.1)
		} break;
		case "Shawaqua": {
			add_drop(player, Item.of("minecraft:pink_dye"), 0.75)
			add_drop(player, Item.of("minecraft:cherry_planks"), 0.5)
			add_drop(player, Item.of("minecraft:cherry_sapling"), 0.5)
			add_drop(player, Item.of("minecraft:rabbit"), 0.25)
		} break;
		case "SmallCactusCat": {
			add_drop(player, Item.of("minecraft:green_dye"), 0.75)
			add_drop(player, Item.of("minecraft:cactus"), 0.75)
			add_drop(player, Item.of("cobblemon:green_apricorn"), 0.25)
		} break;
		case "SpaceNerdSam": {
			add_drop(player, Item.of("minecraft:honeycomb"), 0.75)
			add_drop(player, Item.of("minecraft:honey_bottle").withCustomName("The bees!").withLore("- Mickeon"), 0.5)
		} break;
		case "Spintopple": {
			add_drop(player, Item.of("cobblemon:dawn_stone"), 0.75)
		} break;
		case "SniperZee": {
			add_drop(player, Item.of("minecraft:cod"), 0.75)
			add_drop(player, Item.of("create:sand_paper").withLore("Have you ever tried to pet a shark?"), 0.5)
			add_drop(player, Item.of("minersdelight:fish_stew_cup"), 0.25)
			add_drop(player, Item.of("create_deepfried:fish_and_chips"), 0.1)
		} break;
		case "SueTheMimiga": {
			add_drop(player, Item.of("splash_potion", {"minecraft:potion_contents": {potion: "kubejs:recall"}}).withLore(Text.red("Get out, get out!")), 0.1)
			add_drop(player, Item.of("minecraft:rabbit").withCustomName("I think this is still funny."), 0.75)
			add_drop(player, Item.of("farmersdelight:beef_patty"), 0.5)
			add_drop(player, Item.of("farmersdelight:cabbage_leaf"), 0.5)
			add_drop(player, Item.of("farmersdelight:tomato"), 0.5)
			add_drop(player, Item.of("farmersdelight:onion"), 0.5)
			add_drop(player, Item.of("minersdelight:rabbit_stew_cup"), 0.1)
			const killer_player = event.source.player
			if (killer_player) {
				add_drop(player, Item.of("minecraft:paper").withCustomName("Ow.").withLore("What better way to send Sue home, than to kill them?"), 1.0)
			}
		} break;
		case "SunGlaceon": {
			add_drop(player, Item.of("farmersdelight:melon_popsicle"), 0.5)
			add_drop(player, Item.of("mynethersdelight:tear_popsicle"), 0.1)
		} break;
		case "8chazyplays8":
		case "TheDukeOfSlimes": {
			add_drop(player, Item.of("minecraft:slime_ball"), 0.75)
			add_drop(player, Item.of("minecraft:slime_block"), 0.05)
		} break;
		case "UnkemptMoss": {
			add_drop(player, Item.of("minecraft:bread"), 0.75)
			add_drop(player, Item.of("minecraft:moss_block").withCustomName("Kept Moss"), 0.5)
			add_drop(player, Item.of("mynethersdelight:boiled_egg"), 0.5)
		} break;
		case "WaiGee": {
			add_drop(player, Item.of("create:cut_calcite_bricks"), 0.75)
			add_drop(player, Item.of("minecraft:prismarine_shard"), 0.5)
			add_drop(player, Item.of("minecraft:white_dye"), 0.5)
			add_drop(player, Item.of("minecraft:purple_dye"), 0.5)
		} break;
		case "wyanido": {
			add_drop(player, get_funny_salmon(), 0.5)
		} break;
		case "Mickeon": {
			add_drop(player, Item.of("kubejs:blue_mascot_cat"), 0.75)
			add_drop(player, Item.of("cobblemon:ice_stone"), 0.5)
			add_drop(player, Item.of("minecraft:blue_ice"), 0.25)
			add_drop(player, Item.of("minecraft:ice"), 0.25)
		} break;
	}

	add_drop(player, Item.of("kubejs:music_disc_fool"), 0.01)
	handle_head_drop(player)
})

/**
 * @param {$Player} player
 * @param {$ItemStack} stack */
function add_drop(player, stack, chance) {
	if (Utils.getRandom().nextDouble() > chance) {
		return
	}
	player.block.popItemFromFace(stack, Direction.UP)
}

function get_funny_salmon() {
	return Item.of("minecraft:salmon")
			.withLore("You may feel a bit lighter after eating this.")
			.enchant("minecraft:feather_falling", 1)
}

/** @param {$Player} player */
function handle_head_drop(player) {
	const head = Item.playerHead(player.username)
	if (DASH_STARTERS.includes(player.username)) {
		head.addAttributeModifier(
			"kubejs:dash_jump_count",
			{id: "kubejs:dash_head_bonus", amount: 1, operation: "add_value"},
			"any"
		)
	}
	add_drop(player, head, 0.25)
}