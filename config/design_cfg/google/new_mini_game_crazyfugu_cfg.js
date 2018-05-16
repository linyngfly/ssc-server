var new_mini_game_crazyfugu_cfg =
[
	{
		id : 1001,
		desc_picture : "picture",
		cd : 60,
		fugu_1 : {"score" : 100,"chance":70,"sound":"minigame_fugu_good"},
		fugu_2 : {"score" : -500,"chance":30,"sound":"minigame_fugu_bad", "hitsound": "minigame_fugu_hit"},
		interval : [0.6,0.003,0.2],
		holdon : [1,0.003,0.6],
		base_multiple : 1,
		scene_multiple : 0.005,
		maxscore : [17000,25000,65000,180000],
	},
];
module.exports = new_mini_game_crazyfugu_cfg;