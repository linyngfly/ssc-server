var new_mini_game_coincatch_cfg =
[
	{
		id : 1001,
		desc_picture : "picture",
		cd : 90,
		coin_1 : {"mt" : 5.5, "score" : 10,"chance":73, "sound":"minigame_coin"},
		coin_2 : { "mt" : 5.1, "score" : 100, "chance":10, "sound":"minigame_coin"},
		coin_3 : {"mt" : 5.3, "score" : -100,"chance":7, "sound":"minigame_coin_bad"},
		coin_4 : { "mt" : 4.7, "doubletime" : 5,"chance":3,"sound":"minigame_coin_good"},
		coin_5 : {"mt" : 4.9, "speedtime" : 10,"chance":5,"sound":"minigame_coin_good"},
		coin_6 : { "mt" : 4.5, "addtime" : 3,"chance":2,"sound":"minigame_coin_good"},
		interval : [0.57,0.002,0.007],
		speed_add : [1,0.02,10],
		speed : 400,
		base_multiple : 1,
		scene_multiple : 0.003,
		maxscore : [30000,40000,100000,280000],
	},
];
module.exports = new_mini_game_coincatch_cfg;