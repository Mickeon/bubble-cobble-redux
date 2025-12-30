
// https://aldak.netlify.app/javadoc/1.21.1-21.1.x/net/minecraft/commands/commandsourcestack
/**
 * @import {$Component} from "net.minecraft.network.chat.Component"
 * @import {$Player} from "net.minecraft.world.entity.player.Player"
 * @import {$CommandContext} from "com.mojang.brigadier.context.CommandContext"
 * @import {$CommandSourceStack} from "net.minecraft.commands.CommandSourceStack"
 */


/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerEvent$TabListNameFormat").$PlayerEvent$TabListNameFormat } */
let $PlayerEvent$TabListNameFormat  = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerEvent$TabListNameFormat")
/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerEvent$NameFormat").$PlayerEvent$NameFormat } */
let $PlayerEvent$NameFormat  = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerEvent$NameFormat")

const NICKNAME_JSON_PATH = "nicknames.json"
const NICKNAME_MAX_STRING_LENGTH = 48
const NICKNAME_MAX_JSON_LENGTH = 256
const SUCCESS = 1
const FAILURE = 0
let nicknames = {}

const TEXT_NICKNAME_HINT = Text.of([
	Text.of(" 🧊 If you don't know what you're doing, make yourself a nice nickname by clicking on "),
	Text.of("this website").aqua().underlined().clickOpenUrl("https://text.datapackhub.net/").hover("https://text.datapackhub.net/"),
	Text.of(" On the bottom-left, click on \"1.21.9+\" and set it to \"pre-1.21.5\". Write something down, then click on the Copy icon on the bottom-left."),
]).color("#83BED9")

ServerEvents.loaded(event => {
	nicknames = try_read_and_parse_json(NICKNAME_JSON_PATH) ?? {}
})

NativeEvents.onEvent($PlayerEvent$NameFormat, event => {
	const uuid = event.entity.uuid
	if (nicknames[uuid]) {
		event.displayname = nicknames[uuid]
	}
})

NativeEvents.onEvent($PlayerEvent$TabListNameFormat, event => {
	const uuid = event.entity.uuid
	if (nicknames[uuid]) {
		event.displayName = nicknames[uuid]
	}
})

ServerEvents.commandRegistry(event => {
	const commands = event.commands
	const arguments = event.arguments

	console.log("Registering nickname command")

	event.register(commands.literal("nickname")
		.requires(source => source.isPlayer())
		.then(commands.argument("new_nickname", arguments.COMPONENT.create(event))
			.suggests((command, builder) => {
				let player_nickname = get_nickname(command.source.getPlayer())
				if (player_nickname && builder.input.endsWith("/nickname ")) { // Jank.
					builder.suggest(Text.of(player_nickname).toJson().toString(), () => "Your current nickname")
				}
				return builder.buildFuture()
			})
			.executes(context => {
				return nickname_command(context.source, arguments.COMPONENT.getResult(context, "new_nickname"))
			})
		)
		.then(commands.argument("clear", arguments.WORD.create(event))
			.suggests((command, builder) => {
				if (has_nickname(command.source.getPlayer()) && builder.input.endsWith("/nickname ")) { // Jank.
					builder.suggest("clear", () => "Removes the current nickname.")
				}
				return builder.buildFuture()
			})
			.executes(context => {
				// Quite horrid but okay.
				if (arguments.WORD.getResult(context, "clear") != "clear") {
					context.source.getPlayer().tell(TEXT_NICKNAME_HINT)
					return FAILURE
				}
				return nickname_clear_command(context.source)
			})
		)

	)
})

/**
 * @param {$CommandSourceStack} source
 * @param {$Component} new_name
 */
function nickname_command(source, new_name) {
	try {
		let player = source.getPlayer()
		let new_nickname = Text.of(new_name)//.hover(Text.translate("This is %s in disguise!", player.username))
		if (new_nickname.isEmpty()) {
			source.sendFailure(Text.translate(`Unable to parse nickname.`))
			player.tell(TEXT_NICKNAME_HINT)
			return FAILURE
		}
		if (new_nickname.getString().length() > NICKNAME_MAX_STRING_LENGTH) {
			source.sendFailure(Text.translate(`Nickname "%s" is way too long. Try something shorter?`, new_name))
			return FAILURE
		}
		if (new_nickname.toJson().toString().length() > NICKNAME_MAX_JSON_LENGTH) {
			source.sendFailure(Text.translate(`Nickname "%s" has too much style going on. Try something simpler?`, new_name))
			return FAILURE
		}

		if (new_nickname.equals(get_nickname(player))) {
			source.sendFailure(Text.translate(`Nickname "%s" is the same as before.`, new_name))
			return FAILURE
		}

		nicknames[player.uuid] = new_nickname
		JsonIO.write(NICKNAME_JSON_PATH, JsonUtils.objectOf(nicknames))
		player.refreshDisplayName()
		player.refreshTabListName()
		source.sendSuccess(
			Text.translate(`Nicknamed "%s" to "%s".`,
				Text.of(player.username).color(player.teamColor),
				Text.of(get_nickname(player)))
			.gray(),
			true
		)
		return SUCCESS
	} catch (error) {
		console.error(error)
		return FAILURE
	}
}

/**
 * @param {$CommandSourceStack} source
 */
function nickname_clear_command(source) {
	let player = source.getPlayer()
	if (!has_nickname(player)) {
		source.sendFailure(Text.translate(`Player "%s" does not have a nickname.`, player.username))
		return FAILURE
	}

	delete nicknames[player.uuid]
	JsonIO.write(NICKNAME_JSON_PATH, JsonUtils.objectOf(nicknames))
	player.refreshDisplayName()
	player.refreshTabListName()
	source.sendSuccess(Text.translate(`Cleared nickname for "%s"`, Text.of(player.username).color(player.teamColor)).gray(), true)
	return SUCCESS
}

/** @param {$Player} player */
function has_nickname(player) {
	return !!nicknames[player.uuid]
}

/** @param {$Player} player */
function get_nickname(player) {
	return nicknames[player.uuid] ?? null
}

function try_read_and_parse_json(path) {
	try {
		return JSON.parse(JsonIO.readJson(path).toString())
	} catch (error) {
		console.error(error)
		return null
	}
}