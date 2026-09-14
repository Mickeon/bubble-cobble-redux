/** @import {global} from "./../startup_scripts/music_discs" */
const MUSIC_LIST = global.MUSIC_LIST

ClientEvents.generateAssets("after_mods", event => {
	event.sounds("kubejs", s => {
		Object.keys(MUSIC_LIST).forEach(key => {
			s.addSound(`music.${key}`, g => {
				g.sound(`kubejs:music/${key}`, sound_instance => {
					sound_instance.stream()
				})
			})
		})
	})
})