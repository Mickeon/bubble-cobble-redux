import { $TickDuration_ } from "@package/dev/latvian/mods/kubejs/util"
import { $Optional } from "@package/java/util"
import { $LocalPlayer } from "@package/net/minecraft/client/player";
import { $BlockPos } from "@package/net/minecraft/core"
import { $GlobalPos_ } from "@package/net/minecraft/core"
import { $MinecraftServer } from "@package/net/minecraft/server"
import { $ItemStack, $ItemStack_ } from "@package/net/minecraft/world/item"
import { $Ingredient_ } from "@package/net/minecraft/world/item/crafting"
import { Minecraft$CampfireCooking, Minecraft$SmithingTransform, Minecraft$SmithingTrim } from "@side-only/server/events/recipes";

declare module "@package/net/minecraft/world/entity" {
	export interface $Entity {
		get x(): number
		get y(): number
		get z(): number
		get server(): $MinecraftServer
		mainSupportingBlockPos: $Optional<$BlockPos>
	}

	export interface $LivingEntity {
		getSleepingPos(): $Optional<$BlockPos>;
	}
}

declare module "@package/net/minecraft/world/entity/player" {
	export interface $Player {
		getInventory(): $Inventory;
		getCraftingGrid(): $Inventory;
		getLastDeathLocation(): $Optional<$GlobalPos_>
		get inventory(): $Inventory;
		get craftingGrid(): $Inventory;
		get mainSupportingBlockPos(): $Optional<$BlockPos>
	}
}

declare module "@package/dev/latvian/mods/kubejs/script" {
	export interface $ConsoleJS {
		log(...message: string[]): void;
		debug(message: string): $ConsoleLine;
		error(message: string): $ConsoleLine;
		warn(message: string): $ConsoleLine;
	}
}

declare module "@package/dev/latvian/mods/kubejs/recipe" {
	export interface $RecipesKubeEvent {
		smithingTrim(template: $Ingredient_, base: $Ingredient_, addition: $Ingredient_): Minecraft$SmithingTrim;
		campfireCooking(result: $ItemStack_, ingredient: $Ingredient_, xp?: number, time?: $TickDuration_): Minecraft$CampfireCooking;
		smithingTransform(result: $ItemStack_, template: $Ingredient_, base: $Ingredient_, addition: $Ingredient_): Minecraft$SmithingTransform;

		/** @deprecated ProbeJS mistake, these methods do not exist. */ smithing_trim
		/** @deprecated ProbeJS mistake, these methods do not exist. */ campfire_cooking
		/** @deprecated ProbeJS mistake, these methods do not exist. */ smithing_transform
	}
}

declare module "@package/dev/latvian/mods/kubejs/client" {
	export interface $ClientPlayerKubeEvent {
		getPlayer(): $LocalPlayer;
		get player(): $LocalPlayer;
	}
}
