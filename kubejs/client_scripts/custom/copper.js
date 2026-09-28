// ignored: true

// https://discord.com/channels/303440391124942858/1535061969130889278/1535530339248898048
ClientEvents.particleProviderRegistry(event => {
	const $KubeAnimatedParticle = Java.loadClass("dev.latvian.mods.kubejs.client.KubeAnimatedParticle")
	const $Consumer = Java.loadClass("java.util.function.Consumer")
	const $TypeInfo = Java.loadClass("dev.latvian.mods.rhino.type.TypeInfo")

	const ConsumerType = $TypeInfo.of($Consumer).withParams($TypeInfo.of($KubeAnimatedParticle))
	const Consumer = Java.makeFunctionProxy(ConsumerType, /** @param {import("@package/dev/latvian/mods/kubejs/client").$KubeAnimatedParticle} particle */ particle => {
		particle.friction = 1
		particle.gravity = 0.5
		// particle.color = 0xFF4545
		particle.fasterWhenYMotionBlocked = true
	})
	event.register("kubejs:copper_fire_flames", Consumer)
})
// ClientEvents.particleProviderRegistry(event => {
	// event.register("minecraft:copper_fire_flames")
	// event.register("kubejs:test")

	// event["register(net.minecraft.core.particles.ParticleType,java.util.function.Consumer)"]
	// 	("minecraft:copper_fire_flames", /** @param {import("@package/dev/latvian/mods/kubejs/client").$KubeAnimatedParticle} particle */ particle => {
	// 		// Modify particle's options
	// 		global.copper_fire_flames(particle)
	// 	}
	// )
	// /** @type {import("@package/dev/latvian/mods/kubejs/client").$ParticleProviderRegistryKubeEvent$SpriteSetParticleProvider_} */
	// event["register(net.minecraft.core.particles.ParticleType,dev.latvian.mods.kubejs.client.ParticleProviderRegistryKubeEvent$SpriteSetParticleProvider)"]
	// 	("minecraft:copper_fire_flames",
	// 	/**
	// 	 *
	// 	 * @param {T} type
	// 	 * @param {import("@package/net/minecraft/client/multiplayer").$ClientLevel} clientLevel
	// 	 * @param {number} x
	// 	 * @param {number} y
	// 	 * @param {number} z
	// 	 * @param {import("@package/net/minecraft/client/particle").$SpriteSet} sprites
	// 	 * @param {number} xSpeed
	// 	 * @param {number} ySpeed
	// 	 * @param {number} zSpeed
	// 	 */
	// 	(type, clientLevel, x, y, z, sprites, xSpeed, ySpeed, zSpeed) => {

	// 	})
// })

/**
const HugeExplosionSeedParticle$Provider = Java.loadClass('net.minecraft.client.particle.HugeExplosionSeedParticle$Provider')
const $ParticleProviderRegistryKubeEvent = Java.loadClass('dev.latvian.mods.kubejs.client.ParticleProviderRegistryKubeEvent')
const $KubeAnimatedParticle = Java.loadClass('dev.latvian.mods.kubejs.client.KubeAnimatedParticle')
const $SpriteSetParticleProvider = Java.loadClass('dev.latvian.mods.kubejs.client.ParticleProviderRegistryKubeEvent$SpriteSetParticleProvider')
const $Consumer = Java.loadClass('java.util.function.Consumer')
const $TypeInfo = Java.loadClass('dev.latvian.mods.rhino.type.TypeInfo')

ClientEvents.particleProviderRegistry(event => {
	// Registers a default, simple provider for kubejs:test
	event.register('kubejs:test')
	// Registers a default, simple provider for kubejs:mod and allows users to edit the particle
	const ConsumerType = $TypeInfo.of($Consumer).withParams($TypeInfo.of($KubeAnimatedParticle))
	const Consumer = Java.makeFunctionProxy(ConsumerType, particle => {
		// Modify particle's options
		particle.friction = 1
		particle.gravity = 0.5
		particle.color = 0xFF4545
		particle.fasterWhenYMotionBlocked = true
	})
	event.register('kubejs:mod', Consumer)
	event.register('kubejs:custom', Java.cast($SpriteSetParticleProvider, (type, clientlevel, x, y, z, spriteSet, xSpeed, ySpeed, zSpeed) => {
		var kube = clientLevel.kubeParticle(x, y, z, spriteSet)
		kube.color = 0xDD232D
		kube.onTick(particle => {
			particle.speed = [0, particle.ySpeed * 1.1, 0]
		})
		return kube
	}))

	// Register a 'special' provider (does not have a SpriteSet provided)
	event.registerSpecial('kubejs:special', new HugeExplosionSeedParticle$Provider())
})
*/

