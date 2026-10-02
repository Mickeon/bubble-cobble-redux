
// Right-click with empty hand on fences to disconnect/reconnect them from solid faces.
/** @import {$FenceBlock} from "@package/net/minecraft/world/level/block" */
const FENCES = [
	"biomesoplenty:dead_fence",
	"biomesoplenty:empyreal_fence",
	"biomesoplenty:fir_fence",
	"biomesoplenty:hellbark_fence",
	"biomesoplenty:jacaranda_fence",
	"biomesoplenty:magic_fence",
	"biomesoplenty:mahogany_fence",
	"biomesoplenty:maple_fence",
	"biomesoplenty:palm_fence",
	"biomesoplenty:pine_fence",
	"biomesoplenty:redwood_fence",
	"biomesoplenty:umbran_fence",
	"biomesoplenty:willow_fence",
	"biomeswevegone:aspen_fence",
	"biomeswevegone:baobab_fence",
	"biomeswevegone:blue_enchanted_fence",
	"biomeswevegone:cika_fence",
	"biomeswevegone:cypress_fence",
	"biomeswevegone:ebony_fence",
	"biomeswevegone:fir_fence",
	"biomeswevegone:florus_fence",
	"biomeswevegone:green_enchanted_fence",
	"biomeswevegone:holly_fence",
	"biomeswevegone:ironwood_fence",
	"biomeswevegone:jacaranda_fence",
	"biomeswevegone:mahogany_fence",
	"biomeswevegone:maple_fence",
	"biomeswevegone:palm_fence",
	"biomeswevegone:pine_fence",
	"biomeswevegone:rainbow_eucalyptus_fence",
	"biomeswevegone:redwood_fence",
	"biomeswevegone:sakura_fence",
	"biomeswevegone:skyris_fence",
	"biomeswevegone:spirit_fence",
	"biomeswevegone:white_mangrove_fence",
	"biomeswevegone:willow_fence",
	"biomeswevegone:witch_hazel_fence",
	"biomeswevegone:zelkova_fence",
	"cobblemon:apricorn_fence",
	"cobblemon:saccharine_fence",
	"copycats:copycat_fence",
	"createdeco:andesite_mesh_fence",
	"createdeco:brass_mesh_fence",
	"createdeco:copper_mesh_fence",
	"createdeco:industrial_iron_mesh_fence",
	"createdeco:iron_mesh_fence",
	"createdeco:zinc_mesh_fence",
	"minecraft:acacia_fence",
	"minecraft:bamboo_fence",
	"minecraft:birch_fence",
	"minecraft:cherry_fence",
	"minecraft:crimson_fence",
	"minecraft:dark_oak_fence",
	"minecraft:jungle_fence",
	"minecraft:mangrove_fence",
	"minecraft:nether_brick_fence",
	"minecraft:oak_fence",
	"minecraft:spruce_fence",
	"minecraft:warped_fence",
	"mynethersdelight:powdery_fence",
	"ribbits:mossy_oak_planks_fence"
]
for (const fence of FENCES) {
	BlockEvents.rightClicked(fence, event => {
		const player = event.player
		if (!player.mainHandItem.isEmpty() || !player.offhandItem.isEmpty() || player.swinging) {
			return
		}

		const level = event.level
		const level_block = event.block

		/** @type {$FenceBlock} */
		const block = level_block.getBlock()
		const pos = level_block.getPos()

		const state_north = level_block.getNorth().getBlockState()
		const state_south = level_block.getSouth().getBlockState()
		const state_east = level_block.getEast().getBlockState()
		const state_west = level_block.getWest().getBlockState()
		const is_north_face_sturdy = state_north.isFaceSturdy(level, pos, Direction.NORTH.opposite, "full")
		const is_south_face_sturdy = state_south.isFaceSturdy(level, pos, Direction.SOUTH.opposite, "full")
		const is_east_face_sturdy = state_east.isFaceSturdy(level, pos, Direction.EAST.opposite, "full")
		const is_west_face_sturdy = state_west.isFaceSturdy(level, pos, Direction.WEST.opposite, "full")
		if (!is_north_face_sturdy && !is_south_face_sturdy && !is_east_face_sturdy && !is_west_face_sturdy) {
			player.swing("main_hand")
			play_sound_globally(level, pos.getCenter(), "bubble_cobble:ui.buzz", "players", 0.25)
			return // Nothing to do, there's only fences here, maybe.
		}

		const states = level_block.getProperties()
		const is_fence_disconnected_from_sturdy_faces = (
			(states.get("north") == "false" || !is_north_face_sturdy)
			&& (states.get("south") == "false" || !is_south_face_sturdy)
			&& (states.get("east") == "false" || !is_east_face_sturdy)
			&& (states.get("west") == "false" || !is_west_face_sturdy)
		)

		const block_set_flags = 2 | 16 // Send update to clients, do not update neighbors.
		if (is_fence_disconnected_from_sturdy_faces) {
			level.setBlock(pos, Block.withProperties(
				level_block.getBlockState(), {
					north: block.connectsTo(state_north, is_north_face_sturdy, Direction.NORTH),
					south: block.connectsTo(state_south, is_south_face_sturdy, Direction.SOUTH),
					east: block.connectsTo(state_east, is_east_face_sturdy, Direction.EAST),
					west: block.connectsTo(state_west, is_west_face_sturdy, Direction.WEST),
				}),
				block_set_flags
			)
			play_sound_globally(level, pos.getCenter(), "minecraft:block.wooden_trapdoor.open", "blocks", 1.0)
			// if (state_north.properties.contains("south")) {
			//	 level_block.getNorth().setBlockState(Block.withProperties(state_north, {south: patch.north}))
			// }
		} else {
			level.setBlock(pos, Block.withProperties(
				level_block.getBlockState(), {
					north: state_north.hasTag("minecraft:fences"),
					south: state_south.hasTag("minecraft:fences"),
					west: state_west.hasTag("minecraft:fences"),
					east: state_east.hasTag("minecraft:fences"),
				}),
				block_set_flags
			)
			play_sound_globally(level, pos.getCenter(), "minecraft:block.wooden_trapdoor.close", "blocks", 1.0)
			// if (block.getNorth().getProperties().get("north") == "true") {
			// 	block.getNorth().setBlockState(Block.withProperties(block.getNorth().getBlockState(), {north: false}), 2 | 16)
			// }
		}

		play_sound_globally(level, pos.getCenter(), "minecraft:entity.item_frame.remove_item", "players", 0.5)
		player.swing("main_hand", true)
	})
}
