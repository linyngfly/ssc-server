var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var Code = require('../../../../../shared/code');
var Answer = require('../../../../../shared/answer');

var PlayerFilter = function() {
};

/**
 * 非法玩家过滤
 */
PlayerFilter.prototype.before = function(msg, session, next){
	var player = pomelo.app.gameService.getPlayer(session.uid);
    var route = msg.__route__;

	if(!player){
        next('玩家非法操作,请先登陆', new Answer.NoDataResponse(Code.FA_PLAYER_NOT_FOUND));
        return;
	}
    next();
};

module.exports = {
    id:"playerFilter",
	func:PlayerFilter
};