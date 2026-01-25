/**
 * @import {$Vec3} from "net.minecraft.world.phys.Vec3"
 */

// Experimental Ruler mechanic.
function RulerData() {
	this.start_block = new BlockPos(0, 0, 0)
	this.draw_start = new Vec3d(0, 0, 0)
	this.measure_loop = null
}
const players_ruler_data = {}
BlockEvents.rightClicked(event => {
	if (event.item.id != "supplementaries:altimeter") {
		return
	}

	const {player, block, item, server} = event
	if (!players_ruler_data[player.uuid]) {
		players_ruler_data[player.uuid] = new PowderSnowData()
	}
	/** @type {RulerData} */
	let ruler = players_ruler_data[player.uuid]

	// item.customData.putLongArray("ruler_start", [block_pos.x(), block_pos.y(), block_pos.z()])
	if (!ruler.measure_loop) {
		/** @param {$Vec3} position @param {string} color  */
		let send_particles_at = function(position, color) {
			player.level.sendParticles(player, `minecraft:dust{color:${color},scale:1.0}`, true,
				position.x(), position.y(), position.z(),
				1, 0, 0, 0, 1.0
			)
		}

		/** @param {$Vec3} from @param {$Vec3} to @param {string} color */
		let draw_dust_segment = function(from, to, color) {
			let ratio = 0
			while (ratio < 1.0) {
				// send_particles_at(from.lerp(to, ratio).align(Direction.ALL_SET), color)
				send_particles_at(from.lerp(to, ratio), color)
				ratio += 0.1
			}
		}

		let face_normal = new Vec3d(event.facing.normal.x, event.facing.normal.y, event.facing.normal.z)

		ruler.start_block = block.getPos()
		ruler.draw_start = ruler.start_block.center.add(face_normal.scale(0.6) )
		ruler.measure_loop = server.scheduleRepeatingInTicks(2, () => {
			if (!player.isHoldingInAnyHand(item)) {
				ruler.measure_loop.clear()
				delete ruler.measure_loop
				return
			}
			const looked_at_block = player.rayTrace().block
			if (!looked_at_block) {
				return
			}

			const distance_x = looked_at_block.getX() - ruler.start_block.getX()
			const distance_y = looked_at_block.getY() - ruler.start_block.getY()
			const distance_z = looked_at_block.getZ() - ruler.start_block.getZ()
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
				send_particles_at(ruler.draw_start, "[1.0, 1.0, 1.0]")
				return
			}

			// Sort distances. The would-be longest segment is drawn first, with any succeeding one starting from where the segment ends.
			let segments = [{
				id: "X",
				vec: new Vec3d(distance_x, 0, 0),
				color: "[1.0, 0.1, 0.1]",
			}, {
				id: "Y",
				vec: new Vec3d(0, distance_y, 0),
				color: "[0.1, 1.0, 0.1]",
			}, {
				id: "Z",
				vec: new Vec3d(0, 0, distance_z),
				color: "[0.1, 0.1, 1.0]",
			}]
			segments.sort((a, b) => {
				return b.vec.lengthSqr() - a.vec.lengthSqr()
			})

			// const longest_segment = segments[0]
			// player.statusMessage = `${longest_segment.id} ${longest_segment.vec.length()}`

			let segment_start = ruler.draw_start
			for (const segment of segments) {
				if (segment.vec.lengthSqr() == 0) {
					continue
				}
				let segment_end = segment_start.add(segment.vec)
				draw_dust_segment(segment_start, segment_end, segment.color)
				segment_start = segment_end
			}

			// player.statusMessage = `X: ${distance_x}, `
			// const mannhattan_distance = ruler.start_block.distManhattan(looked_at_block.getPos())
			// player.statusMessage = `Mannhattan Distance: ${mannhattan_distance + 1}, `
		})
	} else {
		ruler.measure_loop.clear()
		delete ruler.measure_loop
	}

	event.cancel()
})