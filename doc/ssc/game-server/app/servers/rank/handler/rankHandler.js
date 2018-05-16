/**
 * Created by linyng on 17-5-24.
 */

var bearcat = require('bearcat');
var Answer = require('../../../../../shared/answer');
var Code = require('../../../../../shared/code');

var RankHandler = function (app) {
    this.app = app;
    this.utils = null;
    this.consts = null;
    this.rankService = null;
};

//胜率排行
RankHandler.prototype.winRateRankList = function (msg, session, next) {

    let skip = Number(msg.skip);
    let limit = Number(msg.limit);
    if(isNaN(skip) || isNaN(limit)){
        next(null, new Answer.NoDataResponse(Code.PARAMERROR));
        return;
    }

    let list = this.rankService.getWinRankList();
    next(null, new Answer.DataResponse(Code.OK, list.slice(skip, skip + limit)));
};

//今日土豪榜
RankHandler.prototype.todayRichRankList = function (msg, session, next) {
    let skip = Number(msg.skip);
    let limit = Number(msg.limit);
    if(isNaN(skip) || isNaN(limit)){
        next(null, new Answer.NoDataResponse(Code.PARAMERROR));
        return;
    }

    let list = this.rankService.richRankList();
    next(null, new Answer.DataResponse(Code.OK, list.slice(skip, skip + limit)));
};

module.exports = function (app) {
    return bearcat.getBean({
        id: "rankHandler",
        func: RankHandler,
        args: [{
            name: "app",
            value: app
        }],
        props: [{
            name: "rankService",
            ref: "rankService"
        }]
    });
}
