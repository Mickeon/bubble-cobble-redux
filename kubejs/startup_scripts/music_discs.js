// @ts-check
/**
 * @typedef {Object} MusicData
 * @property {number} duration - In seconds.
 * @property {string} description
 * @property {boolean=} no_disc
 */

/** @type {Object.<string, MusicData>} */
const MUSIC_LIST = {
	grapes: {duration: 180, description: "SolUrsidae - Can't Make Wine Without a Few Bit-crushed Grapes"},
	void: {duration: 168.25, description: "Box Dragon - Void (Low Health)"},
	fool: {duration: 118, description: "福山 光晴 - ばかみたい"},
	mint: {duration: 131, description: "Shadownade - Double Mint Refreshed", no_disc: true}
}
global.MUSIC_LIST = MUSIC_LIST

StartupEvents.registry("sound_event", event => {
	Object.keys(MUSIC_LIST).forEach(key => {
		event.create(`music.${key}`)
	})
})

StartupEvents.registry("item", event => {
	Object.keys(MUSIC_LIST).forEach((key) => {
		if (MUSIC_LIST[key].no_disc) {
			return
		}
		event.create(`kubejs:music_disc_${key}`)
			.jukeboxPlayable(`kubejs:${key}`, true)
			.displayName("Music Disc")
			.rarity("rare")
			.texture(`kubejs:item/music_disc_${key}`)
	})
})
