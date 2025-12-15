// requires:brewinandchewin

const SEC = 20
const MIN = SEC * 60

const TEMP_COLD = 1
const TEMP_CHILLY = 2
const TEMP_DEFAULT = 3
const TEMP_WARM = 4
const TEMP_HOT = 5

ServerEvents.recipes(event => {
	fermenting(event, Fluid.of("kubejs:sweet_berry_wine", 1000), TEMP_CHILLY, [
			Ingredient.of("minecraft:sweet_berries"),
			Ingredient.of("minecraft:sweet_berries"),
			Ingredient.of("minecraft:sweet_berries"),
		], Item.of("kubejs:sweet_berry_wine"), Fluid.sizedIngredientOf("#c:water", 250)
	)
	fermenting(event, Fluid.of("kubejs:honey_liqueur", 1000), TEMP_WARM, [
			Ingredient.of("minecraft:sugar"),
			Ingredient.of("minecraft:apple"),
			Ingredient.of("minecraft:apple"),
		], Item.of("kubejs:honey_liqueur"), Fluid.sizedIngredientOf("#c:honey", 250)
	)
	fermenting(event, Fluid.of("kubejs:spumante", 1000), TEMP_CHILLY, [
			Ingredient.of("minecraft:sweet_berries"),
			Ingredient.of("minecraft:white_dye"),
			Ingredient.of("minecraft:sugar"),
		], Item.of("kubejs:spumante"), Fluid.sizedIngredientOf("#c:honey", 250)
	)
	fermenting(event, Fluid.of("kubejs:sparkling_rose", 1000), TEMP_CHILLY, [
			Ingredient.of("minecraft:glow_berries"),
			Ingredient.of("minecraft:glow_berries"),
			Ingredient.of("minecraft:sweet_berries"),
			Ingredient.of("minecraft:glow_ink_sac"),
		], Item.of("kubejs:sparkling_rose"), Fluid.sizedIngredientOf("#c:honey", 250)
	)
	fermenting(event, Fluid.of("kubejs:berry_juice_soda", 1000), TEMP_COLD, [
			Ingredient.of("#cobblemon:berries"),
			Ingredient.of("#cobblemon:berries"),
			Ingredient.of("minecraft:sugar"),
			Ingredient.of("minecraft:sugar"),
		], Item.of("kubejs:berry_juice_soda"), Fluid.sizedIngredientOf("#c:honey", 250)
	)
	fermenting(event, Fluid.of("kubejs:firebomb_whiskey", 1000), TEMP_HOT, [
			Ingredient.of("minecraft:gunpowder"),
			Ingredient.of("mynethersdelight:bullet_pepper"),
			Ingredient.of("minecraft:nether_wart"),
			Ingredient.of("minecraft:glistering_melon_slice"),
		], Item.of("kubejs:firebomb_whiskey"), Fluid.sizedIngredientOf("#c:honey", 250)
	)
})

/**
 * @param {$RecipesKubeEvent} event 
 * @param {import("net.neoforged.neoforge.fluids.FluidStack").$FluidStack$$Type} fluid_result 
 * @param {1 | 2 | 3 | 4 | 5} temperature 
 * @param {$Ingredient[]} ingredients 
 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Type} item_result 
 * @param {import("net.neoforged.neoforge.fluids.crafting.SizedFluidIngredient").$SizedFluidIngredient$$Type} fluid_base 
 */
function fermenting(event, fluid_result, temperature, ingredients, item_result, fluid_base) {
	event.custom({
		type: "brewinandchewin:fermenting",
		base_fluid: fluid_base.toNestedJson(),
		experience: 2.0,
		ingredients: ingredients,
		fermenting_time: 10 * MIN,
		temperature: temperature,
		result: fluid_result,
		unit: "millibuckets"
	})

	event.custom({
		type: "brewinandchewin:keg_pouring",
		fluid: {
			id: fluid_result.id,
			amount: 250,
		},
		output: item_result,
		container: Item.of("minecraft:glass_bottle"),
		unit: "millibuckets"
	})
}

ServerEvents.tags("item", event => {
	event.add("kubejs:wines", 
		"kubejs:sweet_berry_wine",
		"kubejs:honey_liqueur",
		"kubejs:spumante",
		"kubejs:sparkling_rose",
		"kubejs:berry_juice_soda",
		"kubejs:firebomb_whiskey"
	)
})

// 	/** @type {Internal.Player} */
// 	const player = event.player

// 	if (!player || !player.hasEffect("brewinandchewin:tipsy")) {
// 		return
// 	}
// 	/** @type {MobEffectInstance} */
// 	const effect = player.getEffect("brewinandchewin:tipsy")
// 	if (effect.getAmplifier() < 9) {
// 		player.potionEffects.add("brewinandchewin:tipsy", 
// 				effect.getDuration() + 30 * SEC,
// 				effect.getAmplifier() + 1, false, false)
// 	}
// })


