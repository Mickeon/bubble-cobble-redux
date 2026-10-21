let $DataMapHooks = Java.loadClass("net.neoforged.neoforge.common.DataMapHooks")

RecipeViewerEvents.addEntries("item", event => {
	event.add(Item.of("cobblemon:pokemon_model", {
		"minecraft:item_name": Text.of(`Pokémon`),
		"minecraft:lore": [
			Text.of(`A stand-in you can right-click on`),
			Text.of(`to view interactions in the recipe viewer`)
		],
		"minecraft:rarity": "epic",
		"cobblemon:pokemon_item": {
			species: "cobblemon:glaceon",
			aspects: [""]
		},
	}))
})

// Highlight nearby waxed blocks.
ClientEvents.highlight(event => {
	const player = event.player
	if (!player.isHolding("minecraft:honeycomb") || Client.isPaused()) {
		return
	}

	const level = player.level
	const eye_position = player.getEyePosition()
	const area = AABB.ofSize(eye_position, 16, 8, 16)
	BlockPos.betweenClosedStream(area).forEach(pos => {
		const block = level.getBlock(pos).getBlock()
		const is_waxed = $DataMapHooks.getBlockUnwaxed(block)
		const can_be_waxed = $DataMapHooks.getBlockWaxed(block)
		if (is_waxed || can_be_waxed) {
			// let direction = Direction.UP
			// let normal = new Vec3d(direction.normal.x, direction.normal.y, direction.normal.z)
			// let particle_pos = pos.getCenter().add(normal).offsetRandom(Utils.getRandom(), 1)
			// let particle_vel = Vec3d.atLowerCornerOf(normal).scale(1)
			// if (can_be_waxed) {
			// 	event.addBlock(pos, "white_dye")
			// }

			if (Utils.getRandom().nextFloat() > (is_waxed ? 0.2 : 0.5)) {
				return // Reduce the amount of particles.
			}

			let particle_pos = pos.getCenter().offsetRandom(Utils.getRandom(), 1.25)
			let vec_to_center = particle_pos.vectorTo(pos.getCenter())
			let particle_vel = vec_to_center.scale(vec_to_center.lengthSqr() * 2.0 - 1.0)
			event.level.addParticle(is_waxed ? "minecraft:wax_on" : "minecraft:wax_off", false,
				particle_pos.x(), particle_pos.y(), particle_pos.z(),
				particle_vel.x(), particle_vel.y(), particle_vel.z()
			)

			// const result = level.clip(new $ClipContext(player.getEyePosition(), pos.getCenter(), "visual", "none", player))
			// event.addBlock(result.getBlockPos(), "yellow_dye")
		}
	})

	if ($DataMapHooks.getBlockWaxed(event.targetBlock.getBlock())) {
		event.addTargetBlock("gray_dye")
	}
})

// Purposely remove unused textures that take up a lot of memory space.
// ClientEvents.generateAssets("after_mods", event => {
// 	let $LoadedTexture  = Java.loadClass("dev.latvian.mods.kubejs.client.LoadedTexture")
// 	const REMOVED_TEXTURE_PATHS = [
// 		"sophisticatedstorage:textures/block/logo.png",
// 		"accessories:textures/gui/sprites/highlight/clickbait.png",
// 		"lodestone:textures/painting/lefunny.png",
// 	]
// 	const get_empty_texture = (() => $LoadedTexture.EMPTY.toBytes())

// 	for (let id of REMOVED_TEXTURE_PATHS) {
// 		event.add({id: id, data: get_empty_texture})
// 	}

// 	// These textures are huge and should be brought down to a reasonable size.
//	// Note that Liko's Pendant's texture is no longer huge.
// 	// Does not work for some reason. The texture cannot be loaded.
// 	// event.add({id: "mega_showdown:textures/item/likos_pendant.png", data: () => {
// 	// 	let path = "mega_showdown:item/likos_pendant"
// 	// 	let texture = event.loadTexture(path)
// 	// 	if (!texture || texture.width <= 0 || texture.height <= 0) {
// 	// 		console.error(`Could not find texture at "${path}"`)
// 	// 		return $LoadedTexture.EMPTY.toBytes()
// 	// 	}
// 	// 	texture = texture.resize(16, 16)
// 	// 	if (!texture || texture.width <= 0 || texture.height <= 0) {
// 	// 		console.error(`Could not resize texture at "${path}"`)
// 	// 		return $LoadedTexture.EMPTY.toBytes()
// 	// 	}
// 	// 	return texture.toBytes()
// 	// }})
// })

/*
// I don't understand and I wish I did.
const { $CreativeModeInventoryScreen } = require("@package/net/minecraft/client/gui/screens/inventory")
const { $ScreenEvent$MouseDragged$Pre } = require("@package/net/neoforged/neoforge/client/event")
const { $ScreenEvent$MouseDragged$Post } = require("@package/net/neoforged/neoforge/client/event")
const { $ScreenEvent$MouseScrolled$Pre } = require("@package/net/neoforged/neoforge/client/event")
const { $ScreenEvent$MouseScrolled$Post } = require("@package/net/neoforged/neoforge/client/event")
if (Platform.isLoaded("item_interactions_mod")) {
	console.log("Hi")
	let $ScreenEvent$Init$Post = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$Init$Post")
	NativeEvents.onEvent($ScreenEvent$Init$Post, event => {
		if (!(event.screen instanceof $CreativeModeInventoryScreen)) {
			return
		}
		try {

		let $GlobalDirt = Java.tryLoadClass("dev.mineland.item_interactions_mod.GlobalDirt")
		if (!$GlobalDirt) {
			console.log("Guess I don't know then")
			return
		}

		// $GlobalDirt.slotSpawners.set(1, "onIdle")
		$GlobalDirt.lastMilis += 1000
		$GlobalDirt.msCounter += 1000
		$GlobalDirt.particleList.forEach(a => a.shouldDelete = true)
		$GlobalDirt.particleList.clear()
		// Client.scheduleInTicks(10, () => {
			// $GlobalDirt.slotSpawners.clear()
			// for (let i = 0; i < $GlobalDirt.slotSpawners.size(); i += 1) {
			// 	$GlobalDirt.slotSpawners.set(i, Utils.emptyList(), "onIdle")
			// 	// $GlobalDirt.slotSpawners.setState(i, "onIdle")
			// 	// console.log(i)
			// }
			// $GlobalDirt.restore()
		// })
		// $GlobalDirt.spawnerTickDelta += 200
		console.log("HI")

		} catch (e) {
			console.error(e)
		}
	})
}
*/


if (Platform.isLoaded("smartkeyprompts")) {
	let $PromptUtils = Java.loadClass("com.mafuyu404.smartkeyprompts.util.PromptUtils")
	let $KeyUtils = Java.loadClass("com.mafuyu404.smartkeyprompts.util.KeyUtils")

	ClientEvents.tick(event => {
		const player = event.player
		if (!player) {
			return
		}
		if (Client.getCurrentScreen() || Client.options.hideGui) {
			return
		}

		$PromptUtils.enablePrompt("create", "Grab")
		if (player.isHolding("create:wrench") && player.rayTrace().block.hasTag("create:wrench_pickup")) {
			$PromptUtils.custom("create", `${$KeyUtils.getKeyByDesc("key.sneak")}+${$KeyUtils.getKeyByDesc("key.use")}`, "Grab")
		}

		if (player.hook) {
			$PromptUtils.show("yo_hooks", "key.yo_hooks.jump");
			$PromptUtils.show("yo_hooks", "key.yo_hooks.climb");
			$PromptUtils.show("yo_hooks", "key.yo_hooks.climb_down");
			$PromptUtils.show("yo_hooks", "key.yo_hooks.prevent_use");
		}

		if (player.getControlledVehicle()?.type == "cobblemon:pokemon") {
			$PromptUtils.show("cobblemon", "key.cobblemon.jump");
			$PromptUtils.custom("cobblemon", $KeyUtils.getKeyByDesc("key.cobblemon.throwpartypokemon"), "Dismount")
		}
	})
}
