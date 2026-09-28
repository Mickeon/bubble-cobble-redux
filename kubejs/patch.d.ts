import { $TickDuration_ } from "@package/dev/latvian/mods/kubejs/util"
import { $List_, $Optional } from "@package/java/util"
import { $BiFunction_, $BiPredicate_, $Predicate_, $ToIntFunction_, $UnaryOperator_ } from "@package/java/util/function"
import { $LocalPlayer } from "@package/net/minecraft/client/player";
import { $BlockPos, $GlobalPos_ } from "@package/net/minecraft/core"
import { $ResourceKey_ } from "@package/net/minecraft/resources"
import { $MinecraftServer } from "@package/net/minecraft/server"
import { $DamageType, $DamageSource } from "@package/net/minecraft/world/damagesource"
import { $ItemStack, $ItemStack_, $UseAnim_} from "@package/net/minecraft/world/item"
import { $Ingredient_ } from "@package/net/minecraft/world/item/crafting"
import { $EnchantmentInstance } from "@package/net/minecraft/world/item/enchantment"
import { $ItemAbility } from "@package/net/neoforged/neoforge/common"
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

declare module "@package/dev/latvian/mods/kubejs/item" {
	// Replaced all of the "$ItemBehaviorFunctions" with "this".
	export interface $ItemBuilder {
		name(name: $ItemBehavior$NameCallback_): this;
        use(use: $ItemBehavior$UseCallback_): this;
        useDuration(useDuration: $ToIntBiFunction_<$ItemStack, $LivingEntity>): this;
		isPiglinCurrency(isPiglinCurrency: $Predicate_<$ItemStack>): this;
        isPiglinCurrency(isPiglinCurrency: boolean): this;
		finishUsing(finishUsing: $ItemBehavior$FinishUsingCallback_): this;
        isEnderMask(isEnderMask: boolean): this;
        isEnderMask(isEnderMask: $ItemBehavior$EndermanMaskTest_): this;
        canBeHurtBy(canBeHurtBy: $BiPredicate_<$ItemStack, $DamageSource>): this;
        applyEnchantments(applyEnchantments: $BiFunction_ction_<$ItemStack, $List<$EnchantmentInstance>, $ItemStack>): this;
		getEntityLifespan(getEntityLifespan: $ToIntBiFunction_<$ItemStack, $Level>): this;
        getEntityLifespan(lifespan: number): this;
        immuneTo(damageTypes: $List_<$ResourceKey_<$DamageType>>): this;
        barColor(barColor: $Function_<$ItemStack, $KubeColor>): this;
        barWidth(barWidth: $ToIntFunction_<$ItemStack>): this;
		/**
         * Makes the item glow like enchanted, even if it's not enchanted.
         */
        glow(glow: boolean): this;
        useAnimation(anim: $UseAnim_): this;
        canPerformAction(canPerformAction: $BiPredicate_<$ItemStack, $ItemAbility>): this;
        canElytraFly(canElytraFly: boolean): this;
        canElytraFly(canElytraFly: $BiPredicate_<$ItemStack, $LivingEntity>): this;
        elytraFlightTick(elytraFlightTick: $ItemBehavior$ElytraFlightTickCallback_): this;
        releaseUsing(releaseUsing: $ItemBehavior$ReleaseUsingCallback_): this;
        canDisableShield(canDisableShield: boolean): this;
        canDisableShield(canDisableShield: $ItemBehavior$DisableShieldTest_): this;
        tooltip(component: $Component_): this;
        makesPiglinsNeutral(makesPiglinsNeutral: $BiPredicate_<$ItemStack, $LivingEntity>): this;
        makesPiglinsNeutral(makesPiglinsNeutral: boolean): this;
        canWalkOnPowderedSnow(canWalkOnPowderedSnow: boolean): this;
        canWalkOnPowderedSnow(canWalkOnPowderedSnow: $BiPredicate_<$ItemStack, $LivingEntity>): this;
        hurtEnemy(hurtEnemy: $Predicate_<$ItemBehavior$HurtEnemyContext>): this;
        craftingRemainingItem(craftingRemainingItem: $UnaryOperator_<$ItemStack>): this;
        onlyHurtBy(damageTypes: $List_<$ResourceKey_<$DamageType>>): this;
	}
}

declare module "@package/dev/latvian/mods/kubejs/script" {
	export interface $PlatformWrapper {
		static isLoaded(modId: SpecialTypes.ModId | string): boolean;
	}
}
