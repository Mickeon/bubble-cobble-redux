
if (Fluid.exists("kubejs:renuvium")) {
ServerEvents.recipes(event => {
	event.recipes.create.mixing(Fluid.of("kubejs:renuvium"), [
		Fluid.ingredientOf("minecraft:water").withAmount(1000),
		Ingredient.of("#create:stone_types/crimsite"), // Red.
		Ingredient.of("arts_and_crafts:gypsum"), // Orange.
		Ingredient.of("#create:stone_types/ochrum"), // Yellow.
		Ingredient.of("#create:stone_types/veridium"), // Green.
		Ingredient.of("arts_and_crafts:cyan_soapstone"), // Cyan.
		Ingredient.of("#create:stone_types/asurine"), // Blue.
		Ingredient.of("minecraft:amethyst_block"), // Purple.
		Ingredient.of("#create:stone_types/calcite")
			.or("#create:stone_types/diorite")
			.or("#create:stone_types/limestone"), // White.
	], 30 * SEC).superheated()
})

ServerEvents.tags("block", event => {
	event.add("minecraft:replaceable", "kubejs:renuvium")
	event.add("minecraft:combination_step_sound_blocks", "kubejs:renuvium")
})
}

ServerEvents.loaded(event => {
	/** @type {typeof import("net.neoforged.neoforge.fluids.FluidInteractionRegistry").$FluidInteractionRegistry } */
	let $FluidInteractionRegistry  = Java.loadClass("net.neoforged.neoforge.fluids.FluidInteractionRegistry")
	/** @type {typeof import("net.neoforged.neoforge.fluids.FluidInteractionRegistry$InteractionInformation").$FluidInteractionRegistry$InteractionInformation } */
	let $InteractionInformation = Java.loadClass("net.neoforged.neoforge.fluids.FluidInteractionRegistry$InteractionInformation")
	/** @type {typeof import("net.minecraft.world.level.material.FluidState").$FluidState } */
	let $FluidState  = Java.loadClass("net.minecraft.world.level.material.FluidState")

	const clone_catalyst_fluid = Fluid.exists("kubejs:renuvium")
		? Fluid.getType("kubejs:renuvium").getFluidType()
		: Fluid.getType("create:chocolate").getFluidType()

	const interactions = $FluidInteractionRegistry.getInteractions()
	const interactions_with_clone_catalyst = interactions.get(clone_catalyst_fluid).size()
	if (interactions_with_clone_catalyst > 4) {
		console.log(`Bubble Cobble fluid interactions already registered (Clone catalyst has ${interactions_with_clone_catalyst} of them)`)
		return
	}
	// $FluidInteractionRegistry.getInteractions().clear() // For debugging purposes. Please do not let this in release.
	console.log("Adding Bubble Cobble clone fluid interactions")

	function below_block_cloning_fluid_interaction(block_state) {
		$FluidInteractionRegistry.addInteraction(clone_catalyst_fluid, new $InteractionInformation["(net.neoforged.neoforge.fluids.FluidInteractionRegistry$HasFluidInteraction,net.minecraft.world.level.block.state.BlockState)"](
			/** @type {import("net.neoforged.neoforge.fluids.FluidInteractionRegistry$HasFluidInteraction").$FluidInteractionRegistry$HasFluidInteraction$$Type} */
			(level, current_pos, relative_pos, current_state) => {
				return current_state.getAmount() < $FluidState.AMOUNT_FULL && level.getBlockState(current_pos.below()) == block_state
			},
			block_state
		))
	}

	below_block_cloning_fluid_interaction(Block.getBlock("create:asurine").defaultBlockState())
	below_block_cloning_fluid_interaction(Block.getBlock("create:crimsite").defaultBlockState())
	below_block_cloning_fluid_interaction(Block.getBlock("create:ochrum").defaultBlockState())
	below_block_cloning_fluid_interaction(Block.getBlock("create:veridium").defaultBlockState())
})