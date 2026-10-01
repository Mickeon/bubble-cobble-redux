/** @import {global} from "../../startup_scripts/custom/music_discs" */
const MUSIC_LIST = global.MUSIC_LIST

ClientEvents.generateAssets("after_mods", event => {
	event.sounds("bubble_cobble", s => {
		Object.keys(MUSIC_LIST).forEach(key => {
			s.addSound(`music.${key}`, g => {
				g.sound(`bubble_cobble:music/${key}`, sound_instance => {
					sound_instance.stream()
				})
			})
		})
	})
})