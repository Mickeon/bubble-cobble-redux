
// Avoid accidentally placing lanterns when held in offhand.
// There's similar client-side code, too.
BlockEvents.rightClicked(event => {
	if (event.hand == "OFF_HAND" && event.item.hasTag("bubble_cobble:lanterns") && !event.player.shiftKeyDown) {
		event.cancel()
	}
})
