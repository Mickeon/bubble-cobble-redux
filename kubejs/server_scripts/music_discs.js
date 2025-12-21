
const MUSIC_LIST = global.MUSIC_LIST

ServerEvents.registry("jukebox_song", event => {
	// const map = Utils.newMap()
	// map.putAll({
	// 	"key1": "value1",
	// 	"key2": "value2",
	// })
	// console.log(map)
	Object.keys(MUSIC_LIST).forEach((key, index) => {
		const duration = MUSIC_LIST[key].duration
		const description = MUSIC_LIST[key].description
		event.create(`kubejs:${key}`)
				.song(`kubejs:music.${key}`, duration)
				.description(Text.of(description))
				.comparatorOutput(index + 1)
	})
})

ServerEvents.tags("item", event => {
	Object.keys(MUSIC_LIST).forEach((key) => {
		if (MUSIC_LIST[key].no_disc) {
			return
		}
		event.add("c:music_discs", `kubejs:music_disc_${key}`)
	})
})
