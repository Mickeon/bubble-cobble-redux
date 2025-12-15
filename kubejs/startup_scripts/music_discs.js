
global.music_list = {
	grapes: {duration: 180, description: "SolUrsidae - Can't Make Wine Without a Few Bit-crushed Grapes"}, 
	void: {duration: 168.25, description: "Box Dragon - Void (Low Health)"},
	fool: {duration: 118, description: "福山 光晴 - ばかみたい"},
	mint: {duration: 131, description: "Shadownade - Double Mint Refreshed", no_disc: true}
} // Duration is in seconds.

const music_list = global.music_list

StartupEvents.registry("sound_event", e => {
	Object.keys(music_list).forEach(key => {
		e.create(`music.${key}`)
	})
})

StartupEvents.registry("item", e => {
	Object.keys(music_list).forEach((key) => {
		if (music_list[key].no_disc) {
			return
		}
		e.create(`kubejs:music_disc_${key}`)
			.jukeboxPlayable(`kubejs:${key}`, true)
			.displayName("Music Disc")
			.rarity("rare")
			.texture(`kubejs:item/music_disc_${key}`)
	})
})
