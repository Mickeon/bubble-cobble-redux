scoreboard objectives add spawner_carry_count dummy
scoreboard players add @s spawner_carry_count 1

carryon place @s
effect give @s minecraft:slowness 10 200 true
effect give @s minecraft:trial_omen 10 0 true
effect give @s minecraft:darkness 10 0 true
playsound bubble_cobble:buzz player @s

execute if score @s spawner_carry_count matches 1 run function bubble_cobble:1_stop_right_there
execute if score @s spawner_carry_count matches 2 run function bubble_cobble:2_no_breathing
execute if score @s spawner_carry_count matches 3.. run function bubble_cobble:3_keel_over_and_die