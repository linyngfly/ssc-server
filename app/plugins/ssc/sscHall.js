const omelo = require('omelo');
// const globalStatusData = require('../../utils/globalStatusData');
const rpcDefs = require('../../net/rpcDefs');
const config = require('./config');
const ERROR_OBJ = require('./error_code').ERROR_OBJ;
const sscCmd = require('../../cmd/sscCmd');
const constants = require('../../consts/constants');

// 回水规则
// a下注11期 （0-24：00）
//  b 组合比例占下单总数15%
//
// c输500-999 回8%
// 输1000-9999回 10%
// 输10000-49999 回12%
// 输50000回15%
// 每天结算12点，后台可以随时看见           晚上24:00


// 上下级反水规则
//拉手有自己的分销二维码，可以扫码编辑成为他的下线   拉手的反水比例10%,15%,20% ,25%,30%
//安周结算，输赢有返利 ？？确定按周吗？


// 抽奖的门槛：3个条件
// 新用户注册  可以抽一次
// 每天下注 达到10期  可以抽奖
// 每人每天限一次
//
// 抽奖的逻辑：4种奖金额度，加一种没中奖提示   奖金额度  5.88   8.88   16.88   18.88
//
// 每天由后台设置奖金总额。奖池的金额=设置奖金的额度-已经抽奖金额
//
// 注：当奖池的里的金额已经低于5.88，有玩家抽中5.88/8.88/16.88/18.88  怎么处理？
//
// 后台统计每条抽奖的明细和明天发出去的总额。


// 十五 用户帐变明细(增加金币日志)
// 查看每笔账户的资金变化明细。（增加或者减少）

//以每个玩家为单位

let BET_LIMIT_CONFIG = {
    ONE_MIN: 10,  //单注最低
    ONE_MAX: 10000, //单注最高
    NUM: 1000, //单点数字
    SIZE: 2000, //大小单双
    MULTI: 20000, //大小单双组合
    JI: 1000, //极大小
    BAO: 500, //豹子
    DUI: 100, //对子
    SHUN: 200, //顺子
    ALL: 1000000,//总下注额度限制
};
BET_LIMIT_CONFIG;

//赔率数据结构
let BET_RATE_CONFIG = {
    SIZE: {
        BIG: [
            [[-1, 2000], 1.5],
            [[2000, 3000], 1.2],
            [[3000, -1], 1],
        ],
        SMALL: [
            [[-1, 2000], 1.5],
            [[2000, 3000], 1.2],
            [[3000, -1], 1],
        ],
        SINGLE: [
            [[-1, 2000], 1.5],
            [[2000, 3000], 1.2],
            [[3000, -1], 1],
        ],
        DOUBLE: [
            [[-1, 2000], 1.5],
            [[2000, 3000], 1.2],
            [[3000, -1], 1],
        ],
    },
    MULTI: {
        BIG_SINGLE: [
            [[-1, 2000], 1.5],
            [[2000, 3000], 1.2],
            [[3000, -1], 1],
        ],
        BIG_DOUBLE: [
            [[-1, 2000], 1.5],
            [[2000, 3000], 1.2],
            [[3000, -1], 1],
        ],
        SMALL_SINGLE: [
            [[-1, 2000], 1.5],
            [[2000, 3000], 1.2],
            [[3000, -1], 1],
        ],
        SMALL_DOUBLE: [
            [[-1, 2000], 1.5],
            [[2000, 3000], 1.2],
            [[3000, -1], 1],
        ],
    },
    BAO: 20,
    DUI: 50,
    SHUN: 34,
    JI: 20,
    NUM: [
        0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 27
    ],
};


class SscHall {
    constructor(opts) {
        this._msgChannelName = opts.msgChannelName;
        this._betParser = opts.betParser;
        this._bonusPool = opts.bonusPool;
        this._playerMap = new Map();
    }

    start() {
        this._msgChannel = omelo.app.get('globalChannelService');

        let self = this;

        this._bonusPool.on(config.LOTTERY_EVENT.TICK_COUNT, (dt) => {
            logger.error('开奖倒计时=', dt, self._msgChannelName);
            self.broadcast(sscCmd.push.countdown.route, {
                dt: dt,
            });
        });

        this._bonusPool.on(config.LOTTERY_EVENT.OPEN_AWARD, async (lotteryInfo) => {
            await self._openAward(lotteryInfo.last);
            self.broadcast(sscCmd.push.countdown.route, {
                lotteryInfo: lotteryInfo,
            });
        });

        this._bonusPool.start();
    }

    stop() {
        this._bonusPool.stop();
        if (this._msgChannel) {
            this._msgChannel.destroy();
            this._msgChannel = null;
        }
    }

    async request(route, msg, session) {
        if (!this[route]) {
            throw ERROR_OBJ.NOT_SUPPORT_SERVICE;
        }
        await this[route](msg, session);
    }

    async rpc(method, msg) {
        if (!this[method]) {
            throw ERROR_OBJ.NOT_SUPPORT_SERVICE;
        }
        this[method](msg);
    }

    async enter(msg) {
        let player = this._playerMap.get(msg.uid);
        if (player) {
            player.state = constants.PLAYER_STATE.ONLINE;
            return;
        }
        player = await this._createPlayer(msg.uid, msg.sid);
        this._addPlayer(player);
    }

    leave(msg) {
        let player = this._playerMap.get(msg.uid);
        if (!player.isBet()) {
            this._delPlayer(player);
        } else {
            player.state = constants.PLAYER_STATE.OFFLINE;
        }
    }

    async _createPlayer(uid, sid) {
    }

    _addPlayer(player) {
        this.addEvent(player);
        this.addMsgChannel(player.msgId);
        this._playerMap.set(player.uid, player);
    }

    _delPlayer(player) {
        this.leaveMsgChannel(player.msgId);
        this._playerMap.delete(player.uid);
    }

    setPlayerState(uid, state) {
        let player = this._playerMap.get(uid);
        if (player) {
            player.state = state;
        }
    }

    // {
    //     "total": 200,
    //     "betTypeInfo": {
    //         "1": {"money": 100, "type": {"code": 1, "desc": "大"}, "desc": "大/100 "},
    //         "3": {"money": 100, "type": {"code": 3, "desc": "单"}, "desc": "单/100 "}
    //     },
    //     "betItems": [{"result": "大", "money": 100, "type": {"code": 1, "desc": "大"}}, {
    //         "result": "单",
    //         "money": 100,
    //         "type": {"code": 3, "desc": "单"}
    //     }]
    // }
    async c_heartbeat(msg) {
        let player = this._playerMap.get(msg.uid);
        player.updateActiveTime();
    }

    async c_bet(msg) {
        if (!this._bonusPool.canBetNow()) {
            throw ERROR_OBJ.BET_CHANNEL_CLOSE;
        }

        let [err, parseRet] = this._betParser.parse(msg.betData);
        if (err) {
            return [err];
        }

        let player = this._playerMap.get(msg.uid);

        return await player.bet({
            period: this._bonusPool.getNextPeriod(),
            identify: this._bonusPool.getIdentify(),
            betData: msg.betData,
            parseRet: parseRet
        });

    }

    async c_unBet(msg) {
        if (!this._bonusPool.canBetNow()) {
            throw ERROR_OBJ.BET_CHANNEL_CLOSE;
        }

        let player = this._playerMap.get(msg.uid);
        return await player.unBet(msg.id);
    }

    async c_chat(msg) {
        let player = this._playerMap.get(msg.uid);
        player.chat(msg);
    }

    addEvent(player) {
        let self = this;
        player.on(sscCmd.push.bet.route, (data) => {
            self.broadcast(sscCmd.push.bet.route, {
                data: data,
                ext: {
                    nickname: player.account.nickname,
                }
            });
        });

        player.on(sscCmd.push.unBet.route, (data) => {
            self.broadcast(sscCmd.push.unBet.route, {
                data: data,
                ext: {
                    nickname: player.account.nickname,
                }
            });
        });

        player.on(sscCmd.push.chat.route, (data) => {
            self.broadcast(sscCmd.push.chat.route, {
                data: data,
                ext: {
                    nickname: player.account.nickname,
                }
            });
        });

        player.on(sscCmd.push.betResult.route, (data) => {
            player.send(sscCmd.push.betResult.route, data);
        });
    }

    addMsgChannel({uid, sid}) {
        this._msgChannel.add(this._msgChannelName, uid, sid);
    }

    leaveMsgChannel({uid, sid}) {
        this._msgChannel.leave(this._msgChannelName, uid, sid);
    }

    broadcast(route, data, serverType = rpcDefs.serverType.game) {
        if (this._msgChannel) {
            this._msgChannel.pushMessage(serverType, route, data, this._msgChannelName);
        }
    }

    // addGamePos(uid, sid, data){
    //     if(this._gamePosType){
    //         globalStatusData.addData(this._gamePosType, uid, sid, data);
    //     }
    // }
    //
    // delGamePos(uid, sid){
    //     if(this._gamePosType){
    //         globalStatusData.delData(this._gamePosType, uid, sid);
    //     }
    // }

    async _openAward(last) {
    }


}

module.exports = SscHall;