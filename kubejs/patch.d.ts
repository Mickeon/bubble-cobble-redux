
declare module "@package/net/minecraft/world/entity" {
    export interface $Entity {
        get x(): number
        get y(): number
        get z(): number
        get server(): $MinecraftServer
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