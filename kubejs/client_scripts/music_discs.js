
const MUSIC_LIST = global.MUSIC_LIST

/**
 * @import {$SoundsGenerator$$Type} from "dev.latvian.mods.kubejs.client.SoundsGenerator"
 * @import {$SoundsGenerator$SoundGen} from "dev.latvian.mods.kubejs.client.SoundsGenerator$SoundGen"
 * @import {$SoundsGenerator$SoundInstance} from "dev.latvian.mods.kubejs.client.SoundsGenerator$SoundInstance"
 */

ClientEvents.generateAssets("after_mods", event => {
	event.sounds("kubejs", /** @param {$SoundsGenerator$$Type} s */ s => {
		Object.keys(MUSIC_LIST).forEach(key => {
			s.addSound(`music.${key}`, /** @param {$SoundsGenerator$SoundGen} g */ g => {
				g.sound(`kubejs:music/${key}`, /** @param {$SoundsGenerator$SoundInstance} sound_instance */ sound_instance => {
					sound_instance.stream()
				})
			})
		})
	})
})