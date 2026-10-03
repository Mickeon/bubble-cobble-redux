// requires: brewinandchewin

/** @readonly @enum */
const Temperature = {
	COLD: 1,
	CHILLY: 2,
	DEFAULT: 3,
	WARM: 4,
	HOT: 5,
}

ServerEvents.recipes(event => {
	fermenting(event, Fluid.of("bubble_cobble:sweet_berry_wine", 1000), Temperature.CHILLY, [
			Ingredient.of("minecraft:sweet_berries"),
			Ingredient.of("minecraft:sweet_berries"),
			Ingredient.of("minecraft:sweet_berries"),
		], Item.of("bubble_cobble:sweet_berry_wine"), Fluid.sizedIngredientOf("#c:water", 250)
	)
	fermenting(event, Fluid.of("bubble_cobble:honey_liqueur", 1000), Temperature.WARM, [
			Ingredient.of("minecraft:sugar"),
			Ingredient.of("minecraft:apple"),
			Ingredient.of("minecraft:apple"),
		], Item.of("bubble_cobble:honey_liqueur"), Fluid.sizedIngredientOf("#c:honey", 250)
	)
	fermenting(event, Fluid.of("bubble_cobble:spumante", 1000), Temperature.CHILLY, [
			Ingredient.of("minecraft:sweet_berries"),
			Ingredient.of("minecraft:white_dye"),
			Ingredient.of("minecraft:sugar"),
		], Item.of("bubble_cobble:spumante"), Fluid.sizedIngredientOf("#c:honey", 250)
	)
	fermenting(event, Fluid.of("bubble_cobble:sparkling_rose", 1000), Temperature.CHILLY, [
			Ingredient.of("minecraft:glow_berries"),
			Ingredient.of("minecraft:glow_berries"),
			Ingredient.of("minecraft:sweet_berries"),
			Ingredient.of("minecraft:glow_ink_sac"),
		], Item.of("bubble_cobble:sparkling_rose"), Fluid.sizedIngredientOf("#c:honey", 250)
	)
	fermenting(event, Fluid.of("bubble_cobble:berry_juice_soda", 1000), Temperature.COLD, [
			Ingredient.of("#cobblemon:berries"),
			Ingredient.of("#cobblemon:berries"),
			Ingredient.of("minecraft:sugar"),
			Ingredient.of("minecraft:sugar"),
		], Item.of("bubble_cobble:berry_juice_soda"), Fluid.sizedIngredientOf("#c:honey", 250)
	)
	fermenting(event, Fluid.of("bubble_cobble:firebomb_whiskey", 1000), Temperature.HOT, [
			Ingredient.of("minecraft:gunpowder"),
			Ingredient.of("mynethersdelight:bullet_pepper"),
			Ingredient.of("minecraft:nether_wart"),
			Ingredient.of("minecraft:glistering_melon_slice"),
		], Item.of("bubble_cobble:firebomb_whiskey"), Fluid.sizedIngredientOf("#c:honey", 250)
	)
})

/**
 * @import {$Ingredient} from "net.minecraft.world.item.crafting.Ingredient"
*/

/**
 * @param {$RecipesKubeEvent} event
 * @param {import("@package/net/neoforged/neoforge/fluids").$FluidStack} fluid_result
 * @param {Temperature} temperature
 * @param {Array<$Ingredient>} ingredients
 * @param {import("@package/net/minecraft/world/item").$ItemStack} item_result
 * @param {import("@package/net/neoforged/neoforge/fluids/crafting").$SizedFluidIngredient} fluid_base
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
	event.add("bubble_cobble:wines",
		"bubble_cobble:sweet_berry_wine",
		"bubble_cobble:honey_liqueur",
		"bubble_cobble:spumante",
		"bubble_cobble:sparkling_rose",
		"bubble_cobble:berry_juice_soda",
		"bubble_cobble:firebomb_whiskey"
	)
})
