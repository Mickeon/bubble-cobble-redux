advancement revoke @s only bubble_cobble:custom/escape_with_escape_rope
item modify entity @s weapon {function:"minecraft:set_item",item:"minecraft:air",conditions:[{condition:"minecraft:inverted",term:{condition:"minecraft:entity_properties",entity:"this",predicate:{type_specific:{type:"minecraft:player",gamemode:["creative"]}}}}]}
playsound supplementaries:block.rope.break player @a
playsound minecraft:entity.item.break player @a ~ ~ ~ 0.5