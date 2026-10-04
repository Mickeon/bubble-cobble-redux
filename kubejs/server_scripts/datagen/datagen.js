// requires: probejs
// priority: 10

ServerEvents.commandRegistry(event => {
	console.log("Registering datagen command")

	const commands = event.commands
	const arguments = event.arguments

	const datagen_command = commands.literal("datagen")
		.requires(source => source.isPlayer() && source.hasPermission(3))
		.then(commands.argument("function_name", arguments.STRING.create(event))
			.suggests((command, builder) => {
				for (const key in global.datagen_functions) {
					builder.suggest(key)
				}
				return builder.buildFuture()
			})
			.executes(context => {
				const function_name = arguments.STRING.getResult(context, "function_name")
				const datagen_function = global.datagen_functions[function_name]
				if (!datagen_function) {
					return FAILURE
				}

				Utils.runAsync(datagen_function)
					.thenRun(() => context.source.sendSuccess(Text.of(`Successfully dumped ${function_name}.`), true))

				return SUCCESS
			})
		)

	event.register(datagen_command)
})
