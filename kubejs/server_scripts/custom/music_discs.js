/** @import {global} from "../../startup_scripts/custom/music_discs" */
const MUSIC_LIST = global.MUSIC_LIST

ServerEvents.registry("jukebox_song", event => {
	Object.keys(MUSIC_LIST).forEach((key, index) => {
		const duration = MUSIC_LIST[key].duration
		const description = MUSIC_LIST[key].description
		event.create(`bubble_cobble:${key}`)
				.song(`bubble_cobble:music.${key}`, duration)
				.description(Text.of(description))
				.comparatorOutput(index + 1)
	})
})

ServerEvents.tags("item", event => {
	Object.keys(MUSIC_LIST).forEach((key) => {
		if (MUSIC_LIST[key].no_disc) {
			return
		}
		event.add("c:music_discs", `bubble_cobble:music_disc_${key}`)
	})
})
