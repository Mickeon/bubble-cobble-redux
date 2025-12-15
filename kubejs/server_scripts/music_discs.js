
const music_list = global.music_list

ServerEvents.registry("jukebox_song", event => {
	// const map = Utils.newMap()
	// map.putAll({
	// 	"key1": "value1",
	// 	"key2": "value2",
	// })
	// console.log(map)
	Object.keys(music_list).forEach((key, index) => {
		const duration = music_list[key].duration
		const description = music_list[key].description
		event.create(`kubejs:${key}`)
				.song(`kubejs:music.${key}`, duration)
				.description(Text.of(description))
				.comparatorOutput(index + 1)
	})
})

ServerEvents.tags("item", event => {
	Object.keys(music_list).forEach((key) => {
		if (music_list[key].no_disc) {
			return
		}
		event.add("c:music_discs", `kubejs:music_disc_${key}`)
	})
})
