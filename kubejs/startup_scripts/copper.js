StartupEvents.registry("armor_material", event => {
	const $ArmorMaterial$Layer = Java.loadClass("net.minecraft.world.item.ArmorMaterial$Layer")

	let a = new $ArmorMaterial$Layer(ID.of("copper", false))
	// console.log(a.texture(false))
	// console.log(a.texture(true))

	event.create("minecraft:copper")
			.defense({
				helmet: 2,
				chestplate: 4,
				leggings: 3,
				boots: 1,
			})
			.enchantmentValue(8)
			.equipSound("minecraft:item.armor.equip_copper")
			.repairIngredient(() => Ingredient.of("minecraft:copper_ingot"))
			.layers([
				a,
			])
})

ItemEvents.toolTierRegistry(event => {
	event.add("minecraft:copper", tier => {
		tier.setIncorrectBlocksForDropsTag("minecraft:incorrect_for_stone_tool")
		tier.setUses(190)
		tier.setSpeed(5)
		tier.setAttackDamageBonus(1)
		tier.setEnchantmentValue(13)
		tier.setRepairIngredient(Ingredient.of("minecraft:copper_ingot"))
	})
})

StartupEvents.registry("item", event => {
	event.create("minecraft:copper_nugget")
			.tag([
				"c:nuggets",
				"c:nuggets/copper"
			])
	event.create("minecraft:copper_shovel", "kubejs:shovel")
			.tier("minecraft:copper")
			.tag([
				"minecraft:shovels"
			])
	event.create("minecraft:copper_pickaxe", "kubejs:pickaxe")
			.tier("minecraft:copper")
			.tag([
				"minecraft:pickaxes"
			])
	event.create("minecraft:copper_axe", "kubejs:axe")
			.maxDamage(190)
			.tier("minecraft:copper")
			.attackDamageBaseline(7)
			.speedBaseline(-3.2)
			.tag([
				"minecraft:axes"
			])
	event.create("minecraft:copper_hoe", "kubejs:hoe")
			.tier("minecraft:copper")
			.attackDamageBaseline(-1)
			.speedBaseline(-2.0)
			.tag([
				"minecraft:hoes"
			])
	event.create("minecraft:copper_sword", "kubejs:sword")
			.tier("minecraft:copper")
			.tag([
				"minecraft:swords"
			])

	event.create("minecraft:copper_helmet", "kubejs:helmet")
			.material("minecraft:copper")
			.maxDamage(121)
			.tag([
				"minecraft:head_armor",
			])
	event.create("minecraft:copper_chestplate", "kubejs:chestplate")
			.material("minecraft:copper")
			.maxDamage(176)
			.tag([
				"minecraft:chest_armor",
			])
	event.create("minecraft:copper_leggings", "kubejs:leggings")
			.material("minecraft:copper")
			.maxDamage(165)
			.tag([
				"minecraft:leg_armor",
			])
	event.create("minecraft:copper_boots", "kubejs:boots")
			.material("minecraft:copper")
			.maxDamage(143)
			.tag([
				"minecraft:foot_armor",
			])
})

StartupEvents.modifyCreativeTab("minecraft:combat", event => {
	event.addAfter("minecraft:stone_sword", "minecraft:copper_sword")
	event.addBefore("minecraft:iron_helmet", ["minecraft:copper_helmet", "minecraft:copper_chestplate", "minecraft:copper_leggings", "minecraft:copper_boots"])
})

StartupEvents.modifyCreativeTab("minecraft:tools_and_utilities", event => {
	event.addAfter("minecraft:stone_hoe", ["minecraft:copper_shovel", "minecraft:copper_pickaxe", "minecraft:copper_axe", "minecraft:copper_hoe"])
})


// No point if I can't get the particles to work.
// StartupEvents.registry("particle_type", event => {
// 	event.create("kubejs:copper_fire_flames").texture("kubejs:copper_flame")
// })

// StartupEvents.registry("block", event => {
// 	const $TorchBlock = Java.loadClass("net.minecraft.world.level.block.TorchBlock")
// 	const $WallTorchBlock = Java.loadClass("net.minecraft.world.level.block.WallTorchBlock")
// 	const $BlockBehaviour$Properties = Java.loadClass("net.minecraft.world.level.block.state.BlockBehaviour$Properties")
// 	const $ParticleTypes = Java.loadClass("net.minecraft.core.particles.ParticleTypes")

// 	const particle_type = $ParticleTypes.SMALL_FLAME
// 	// const particle_type = new $ParticleTypeBuilder("minecraft:copper_fire_flame").texture("").get()
// 	event.createCustom("minecraft:copper_torch", () => new $TorchBlock(
// 		particle_type,
// 		new $BlockBehaviour$Properties()
// 			.noCollission()
// 			.instabreak()
// 			.lightLevel(p => 14)
// 			.sound(SoundType.WOOD)
// 			.pushReaction("destroy")
// 	))
// 	event.createCustom("minecraft:copper_wall_torch", () => new $WallTorchBlock(
// 		particle_type,
// 		new $BlockBehaviour$Properties()
// 			.noCollission()
// 			.instabreak()
// 			.lightLevel(p => 14)
// 			.sound(SoundType.WOOD)
// 			.pushReaction("destroy")
// 			.dropsLike("minecraft:copper_torch")
// 	))
// })

// StartupEvents.registry("item", event => {
// 	const $StandingAndWallBlockItem = Java.loadClass("net.minecraft.world.item.StandingAndWallBlockItem")

// 	event.createCustom("minecraft:copper_torch", () => new $StandingAndWallBlockItem(
// 		"minecraft:copper_torch",
// 		"minecraft:copper_wall_torch",
// 		new $Item$Properties(),
// 		Direction.DOWN
// 	))
// })

// Example script.
/*
StartupEvents.registry('particle_type', e => {
	e.create('test')
		.textures([
			'minecraft:big_smoke_0',
			'minecraft:big_smoke_1',
			'minecraft:big_smoke_2',
			'minecraft:big_smoke_3'
		])
	// This one needs kubejs/textures/particle/sludge_bubble.png
	e.create('kubejs:mod')
		.texture('kubejs:sludge_bubble')
	e.create('kubejs:custom')
	e.create('special')
})
*/