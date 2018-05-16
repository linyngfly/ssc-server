/**
 * Created by linyng on 2017/6/23.
 */

const logger = require('pomelo-logger').getLogger(__filename);
var bearcat = require('bearcat');

var LotteryRemote = function (app) {
    this.app = app;
};

LotteryRemote.prototype.checkPeriodValid = function (period, cb) {
    this.utils.invokeCallback(cb, null, this.app.lotteryService.checkPeriod(period));
};

module.exports = function (app) {
    return bearcat.getBean({
        id: "lotteryRemote",
        func: LotteryRemote,
        args: [{
            name: "app",
            value: app
        }],
        init:"init",
        props: [{
            name: "rankService",
            ref: "rankService"
        },{
            name: "utils",
            ref: "utils"
        }]
    });
}

