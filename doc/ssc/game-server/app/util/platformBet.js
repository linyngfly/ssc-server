/**
 * Created by linyng on 2017/6/2.
 */

const logger = require('pomelo-logger').getLogger(__filename);
const Answer = require('../../../shared/answer');
const Code = require('../../../shared/code');
const async = require('async');

let PlatformBet = function () {
    this.platformTypeBet = new Map();
    this._redisApi = null;
    this._table_name = 'platformBet';
};

PlatformBet.prototype.init = function (redis) {
    this._redisApi = redis;
};

PlatformBet.prototype.canBet = async function (type, value, cb) {
    let self = this;
    let promise = new Promise((resolve, reject) => {
        this._redisApi.cmd('hget', self._table_name, type, null, function (err, num) {
            let newNum = (!!num ? Number(num) : 0) + value;
            var err = {};
            var freeBetValue = 0;
            if (self.betLimitCfg.platformLimit(type, newNum)) {
                freeBetValue = self.betLimitCfg.getPlatformValue(type) - num;
                err = Code.GAME.FA_BET_PLATFORM_LIMIT;
            }
            else {
                freeBetValue = self.betLimitCfg.getPlatformValue(type) - newNum;
                err = Code.OK;
            }
            resolve(new Answer.DataResponse(err, {freeBetValue: freeBetValue}));
            self.utils.invokeCallback(cb, new Answer.DataResponse(err, {freeBetValue: freeBetValue}));
        });
    });

    return promise;


    // let self = this;
    // try {
    //     let num = await this._redisApi.cmd('hget', this._table_name, type, null);
    //     let newNum = (!!num ? Number(num) : 0) + value;
    //     var freeBetValue = 0;
    //     if (self.betLimitCfg.platformLimit(type, newNum)) {
    //         freeBetValue = self.betLimitCfg.getPlatformValue(type) - num;
    //         err = Code.GAME.FA_BET_PLATFORM_LIMIT;
    //     }
    //     else {
    //         freeBetValue = self.betLimitCfg.getPlatformValue(type) - newNum;
    //         err = Code.OK;
    //     }
    //     self.utils.invokeCallback(cb, new Answer.DataResponse(err, {freeBetValue: freeBetValue}));
    //
    // }catch (e){
    //
    // }


};

PlatformBet.prototype.addBet = function (type, value) {
    let self = this;
    async.waterfall([
        function (cb) {
            self._redisApi.cmd('hget', self._table_name, type, null, cb);
        },
        function (num, cb) {
            let newNum = (!!num ? Number(num) : 0) + value;
            self._redisApi.cmd('hset', self._table_name, type, newNum === 0 ? '0' : newNum, cb);
        }
    ], function (err) {
        logger.error('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@addBet:', err);
    });
};

PlatformBet.prototype.reduceBet = function (type, value, cb) {
    let self = this;
    let newNum = 0;
    async.waterfall([
        function (callback) {
            self._redisApi.cmd('hget', self._table_name, type, null, callback);
        },
        function (num, callback) {
            newNum = (!!num ? Number(num) : 0) - value;
            self._redisApi.cmd('hset', self._table_name, type, newNum === 0 ? '0' : newNum, callback);
        }
    ], function (err) {
        if (err) {
            logger.error('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@reduceBet:', err);
        }
        let freeBetValue = self.betLimitCfg.getPlatformValue(type) - newNum;
        self.utils.invokeCallback(cb, freeBetValue);
    });
};

PlatformBet.prototype.resetBet = function () {
    this._redisApi.cmd('del', this._table_name, null, null, function (err, result) {
        logger.error('@@@@@@@@@@@@@@@@@@@@@@@@@@@ canBet:', err, result);
    });
    this.platformTypeBet.clear();
};

module.exports = {
    id: "platformBet",
    func: PlatformBet,
    props: [
        {name: "betLimitCfg", ref: "betLimitCfg"},
        {name: "utils", ref: "utils"}
    ]
}