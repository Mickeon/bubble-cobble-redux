/**
 * @import {$Vec3} from "net.minecraft.world.phys.Vec3"
 * @import {$UUID} from "java.util.UUID"
 */

ServerEvents.recipes(event => {
	event.shaped("kubejs:ruler", ["  B", " BB", "BBA"], {B: "minecraft:bamboo", A: "create:andesite_alloy"})
})

// Somewhat shoddy Ruler mechanic. I can only work with particles here.
function RulerData() {
	this.start_pos = new BlockPos(0, 0, 0)
	this.target_pos = new BlockPos(0, 0, 0)
	this.target_face_normal = new Vec3d(0, 0, 0)
	this.draw_start = new Vec3d(0, 0, 0)

	this.measure_loop = null
	this.stop_measuring = function() {
		this.measure_loop.clear()
		delete this.measure_loop
	}
}
/** @param {$UUID} uuid  @returns {RulerData} */
RulerData.getOrCreate = function(uuid) {
	if (!players_ruler_data[uuid]) {
		players_ruler_data[uuid] = new RulerData()
	}
	return players_ruler_data[uuid]
}
const players_ruler_data = {}
BlockEvents.rightClicked(event => {
	if (event.item.id != "kubejs:ruler") {
		return
	}

	// TODO: Do not trigger the ruler when trying to use blocks normally.
	// const use_result = block.getBlockState().useItemOn(
	// 	event.item, event.level, player, event.hand, event.hitResult
	// )
	// if (use_result.consumesAction()) {
	// 	return
	// }

	const {player, block, item, server} = event
	const ruler = RulerData.getOrCreate(player.uuid)
	if (!ruler.measure_loop) {
		/** @param {$Vec3} position @param {string} color @param {number} scale */
		let draw_dust_at = function(position, color, scale) {
			scale = scale || 1.0
			player.level.sendParticles(player, `minecraft:dust{color:${color},scale:${scale}}`, true,
				position.x(), position.y(), position.z(),
				0, 1, 1, 1, 1.0
			)
		}

		/** @param {$Vec3} from @param {$Vec3} to @param {string} color @param {number} scale @param {number?} particle_count @param {number?} draw_start_offset */
		let draw_dust_segment = function(from, to, color, scale, particle_count, draw_start_offset) {
			let step = particle_count ? (1 / particle_count) : 0.1
			let ratio = draw_start_offset ? (draw_start_offset / from.distanceTo(to)) : 0.0
			while (ratio < 1.0) {
				// draw_dust_at(from.lerp(to, ratio).align(Direction.ALL_SET), color)
				draw_dust_at(from.lerp(to, ratio), color, scale)
				ratio += step
			}
		}

		ruler.start_pos = block.getPos()
		ruler.target_pos = block.getPos()
		ruler.target_face_normal = new Vec3d(event.facing.normal.x, event.facing.normal.y, event.facing.normal.z)
		ruler.draw_start = ruler.start_pos.center.add(ruler.target_face_normal.scale(0.6))
		ruler.begun_tick = server.tickCount
		ruler.measure_loop = server.scheduleRepeatingInTicks(2, () => {
			if (!player.isHoldingInAnyHand(item) || player.isRemoved()) {
				ruler.stop_measuring()
				return
			}
			const raytraced = player.rayTrace()
			if (raytraced.type == "block") {
				ruler.target_pos = raytraced.block.getPos()
				ruler.target_face_normal = new Vec3d(raytraced.facing.normal.x, raytraced.facing.normal.y, raytraced.facing.normal.z)
				ruler.draw_start = ruler.start_pos.center.add(ruler.target_face_normal.scale(0.6))
			}

			const distance_x = ruler.target_pos.getX() - ruler.start_pos.getX()
			const distance_y = ruler.target_pos.getY() - ruler.start_pos.getY()
			const distance_z = ruler.target_pos.getZ() - ruler.start_pos.getZ()
			const abs_distance_x = Math.abs(distance_x)
			const abs_distance_y = Math.abs(distance_y)
			const abs_distance_z = Math.abs(distance_z)

			const longest_distance = Math.max(abs_distance_x, abs_distance_y, abs_distance_z)

			/** @param {number} distance  */
			function make_text_for_number(distance) {
				return Text.of(distance.toFixed().padStart(3, " "))
						.color(distance == 0 ? "dark_gray" : (
							longest_distance == Math.abs(distance) ? "#FFFFFF" : "#EEEEEE"
						))
			}

			player.statusMessage = [
				Text.of(` `), Text.of(`X: `).red().underlined(), make_text_for_number(distance_x),
				Text.of(` `), Text.of(`Y: `).green().underlined(), make_text_for_number(distance_y),
				Text.of(` `), Text.of(`Z: `).blue().underlined(), make_text_for_number(distance_z),
			]

			if (longest_distance == 0) {
				draw_dust_at(ruler.draw_start, "[1.0, 1.0, 1.0]")
				return
			}
			draw_dust_at(ruler.draw_start.add(distance_x, distance_y, distance_z), "[1.0, 1.0, 1.0]", 0.5)

			// Sort distances. The would-be longest segment is drawn first, with any succeeding one starting from where the segment ends.
			let segments = [{
				id: "X",
				vec: new Vec3d(distance_x, 0, 0),
				length: abs_distance_x,
				color: "[1.0, 0.1, 0.1]",
			}, {
				id: "Y",
				vec: new Vec3d(0, distance_y, 0),
				length: abs_distance_y,
				color: "[0.1, 1.0, 0.1]",
			}, {
				id: "Z",
				vec: new Vec3d(0, 0, distance_z),
				length: abs_distance_z,
				color: "[0.1, 0.1, 1.0]",
			}].sort((a, b) => {
				return b.length - a.length
			})

			// const longest_segment = segments[0]
			// player.statusMessage = `${longest_segment.id} ${longest_segment.vec.length()}`

			let segment_start = ruler.draw_start
			for (const segment of segments) {
				if (segment.length == 0) {
					continue
				}
				let segment_end = segment_start.add(segment.vec)
				let limited_length = Math.min(segment.length, 32)
				draw_dust_segment(segment_start, segment_end, segment.color, 1.0, limited_length * 0.25)
				draw_dust_segment(segment_start, segment_end, segment.color, 0.5, limited_length)
				// draw_dust_segment(segment_start, segment_end, "[0.1, 0.1, 0.1]", 0.5, limited_length, 0.5)
				segment_start = segment_end
			}

			// player.statusMessage = `X: ${distance_x}, `
			// const mannhattan_distance = ruler.start_pos.distManhattan(target_pos)
			// player.statusMessage = `Mannhattan Distance: ${mannhattan_distance + 1}, `
		})
	} else {
		ruler.stop_measuring()
	}

	player.swing(event.hand, true)
	player.playNotifySound("create:controller_click", "players", 0.5, 1.0)

	event.cancel()
})

ItemEvents.firstRightClicked(event => {
	if (event.item.id != "kubejs:ruler") {
		return
	}
	const {player} = event
	const ruler = RulerData.getOrCreate(player.uuid)
	if (!ruler.measure_loop || ruler.begun_tick == event.server.tickCount) {
		return
	}

	player.swing(event.hand, true)
	player.playNotifySound("create:controller_click", "players", 0.5, 0.8)
	ruler.stop_measuring()
})