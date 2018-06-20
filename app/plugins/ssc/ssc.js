const omelo = require('omelo');
// const globalStatusData = require('../../utils/globalStatusData');
const rpcDefs = require('../../net/rpcDefs');
const config = require('./config');
const ERROR_OBJ = require('./error_code').ERROR_OBJ;
const sscCmd = require('../../cmd/sscCmd');
const constants = require('../../consts/constants');
const models = require('../../models');
const util = require('util');
const hall = require('./hall');
const logBuilder = require('../../utils/logSync/logBuilder');
const schedule = require('node-schedule');

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
// 抽奖的逻辑：4种奖金额度，加一种没中奖提示   奖金额度 0  5.88   8.88   16.88   18.88
//
// 每天由后台设置奖金总额。奖池的金额=设置奖金的额度-已经抽奖金额
//
// 注：当奖池的里的金额已经低于5.88，有玩家抽中5.88/8.88/16.88/18.88  怎么处理？
//
// 后台统计每条抽奖的明细和明天发出去的总额。

class SSC {
    constructor(opts) {
        this._hallName = opts.hallName;
        this._gameIdentify = opts.gameIdentify;
        this._betParser = opts.betParser;
        this._lottery = opts.lottery;
        this._betLimitRate = opts.betLimitRate;
        this._playerMap = new Map();
        this._schedule = null;
    }

    async start() {
        this._msgChannel = omelo.app.get('globalChannelService');
        await this._betLimitRate.loadConfig();

        let self = this;

        this._lottery.on(config.LOTTERY_EVENT.TICK_COUNT, (dt) => {
            logger.error(this._gameIdentify + ' 开奖倒计时=', dt, self._hallName);
            self.broadcast(sscCmd.push.countdown.route, {
                dt: dt,
            });
        });

        this._lottery.on(config.LOTTERY_EVENT.OPEN_AWARD, async (lotteryInfo) => {
            let last = lotteryInfo.last;
            let openResult = await self._openAward(last);

            let lotteryData = {
                period: last.period,
                identify: this._gameIdentify,
                numbers: last.numbers,
                time: last.opentime,
                openResult: openResult
            };

            logBuilder.addLotteryLog(lotteryData);
            await redisConnector.lpush(util.format(models.constants.LOTTERY_LATEST_HISTORY, self._hallName), lotteryData);
            self.broadcast(sscCmd.push.openLottery.route, {
                lotteryInfo: lotteryInfo,
            });
        });

        hall.on(config.HALL_EVENT.PLAYER_CHANGE, async function (event) {
            let player = this._playerMap.get(event.uid);
            if (player) {
                let fields = event.fields;
                for (let key in fields) {
                    player.account[key] = fields[key];
                }
                await player.account.commit();
            }
        }.bind(this));

        hall.on(config.HALL_EVENT.BROADCAST, function (broadcast_content) {
            self.broadcast(sscCmd.push.broadcast.route, broadcast_content);
        }.bind(this));

        this._lottery.start();

        let _time = config.TASK.CONFIG_DAILY_RESET.time.split(',');
        let cron_time = `${_time[0]} ${_time[1]} ${_time[2]} ${_time[3]} ${_time[4]} ${_time[5]}`;
        this._schedule = schedule.scheduleJob(cron_time, async function () {
            await this._betLimitRate.resetConfig();
        }.bind(this));
    }

    stop() {
        this._lottery.stop();
        if (this._msgChannel) {
            this._msgChannel.destroy();
            this._msgChannel = null;
        }

        if (this._schedule) {
            this._schedule.cancel();
            this._schedule = null;
        }
    }

    async request(route, msg, session) {
        if (!this[route]) {
            throw ERROR_OBJ.NOT_SUPPORT_SERVICE;
        }
        return await this[route](msg, session);
    }

    async rpc(method, msg) {
        if (!this[method]) {
            throw ERROR_OBJ.NOT_SUPPORT_SERVICE;
        }
        return this[method](msg);
    }

    async enter(msg) {
        logger.error('玩家加入游戏', this._gameIdentify);
        let player = this._playerMap.get(msg.uid);
        if (player) {
            this._updatePlayerState(player, constants.PLAYER_STATE.ONLINE);
            return;
        }
        player = await this._createPlayer(msg.uid, msg.sid);
        this._addPlayer(player);

        this.broadcast(sscCmd.push.enter.route, {nickname: player.account.nickname});
    }

    async leave(msg) {
        logger.error('玩家加入游戏', this._gameIdentify);
        let player = this._playerMap.get(msg.uid);
        if (!player.isBet()) {
            await this._delPlayer(player);
        } else {
            this._updatePlayerState(player, constants.PLAYER_STATE.OFFLINE);
        }
        this.broadcast(sscCmd.push.leave.route, {nickname: player.account.nickname});
    }

    isInGameHall(uid) {
        return this._playerMap.has(uid);
    }

    async _createPlayer(uid, sid) {
    }

    _addPlayer(player) {
        this.addEvent(player);
        this.addMsgChannel(player.msgId);
        this._playerMap.set(player.uid, player);
    }

    async _delPlayer(player) {
        await player.account.commit();
        this.leaveMsgChannel(player.msgId);
        this._playerMap.delete(player.uid);
    }

    _updatePlayerState(player, state) {
        player.state = state;
        if (state == constants.PLAYER_STATE.OFFLINE) {
            this.leaveMsgChannel(player.msgId);
        } else if (state == constants.PLAYER_STATE.ONLINE) {
            this.addMsgChannel(player.msgId);
        }
    }

    setPlayerState(uid, state) {
        let player = this._playerMap.get(uid);
        if (player) {
            this._updatePlayerState(player, state);
        }
    }

    async c_heartbeat(msg) {
        let player = this._playerMap.get(msg.uid);
        player.updateActiveTime();
    }

    async c_bet(msg) {
        if (!this._lottery.canBetNow()) {
            throw ERROR_OBJ.BET_CHANNEL_CLOSE;
        }

        let [err, parseRet] = this._betParser.parse(msg.betData, this._betLimitRate);
        if (err) {
            return [err];
        }

        let player = this._playerMap.get(msg.uid);

        return await player.bet({
            period: this._lottery.getNextPeriod(),
            identify: this._gameIdentify,
            betData: msg.betData,
            parseRet: parseRet,
            limitRate: this._betLimitRate
        });

    }

    async c_unBet(msg) {
        if (!this._lottery.canBetNow()) {
            throw ERROR_OBJ.BET_CHANNEL_CLOSE;
        }

        let player = this._playerMap.get(msg.uid);
        return await player.unBet(msg.id);
    }

    async c_myBetOrder(msg) {
        let player = this._playerMap.get(msg.uid);
        return await player.myBetOrder();
    }

    async c_myBetResult(msg) {
        msg.skip = msg.skip || 0;
        msg.limit = msg.limit || 10;

        let bets = [];
        let sql = 'SELECT * FROM tbl_bets AS a LEFT JOIN tbl_lottery AS b on a.period=b.period and ' +
            'a.identify=b.identify WHERE a.identify=? and a.uid=? LIMIT ?,?';
        let rows = await mysqlConnector.query(sql, [this._gameIdentify, msg.uid, msg.skip, msg.limit]);
        if (rows && rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                let item = rows[i];
                bets.push({
                    id: item.id,
                    state: item.state,
                    betMoney: item.betMoney,
                    money: item.winMoney,
                    betItems: item.betItems,
                    period: item.period,
                    numbers: item.numbers,
                    opentime: item.time,
                    openResult: item.openResult
                });
            }
        }

        return bets;
    }

    async c_getBets(msg) {
        let start = msg.skip || 0;
        let stop = start + (msg.limit || 20);
        return await redisConnector.lrange(util.format(models.constants.BET_LATEST_HISTORY, this._hallName), start, stop);
    }

    async c_chat(msg) {
        let player = this._playerMap.get(msg.uid);
        return await player.chat({
            type: msg.type,
            content: msg.content,
            tid: msg.tid
        });
    }

    async c_getChats(msg) {
        let start = msg.skip || 0;
        let stop = start + (msg.limit || 20);
        return await redisConnector.lrange(util.format(models.constants.CHAT_LATEST_HISTORY, this._hallName), start, stop);
    }

    async c_getLotterys(msg) {
        let start = msg.skip || 0;
        let stop = start + (msg.limit || 20);
        return await redisConnector.lrange(util.format(models.constants.LOTTERY_LATEST_HISTORY, this._hallName), start, stop);
    }

    addEvent(player) {
        let self = this;
        player.on(sscCmd.push.bet.route, (data) => {
            let betData = {
                data: data,
                ext: {
                    nickname: player.account.nickname,
                }
            };
            self.broadcast(sscCmd.push.bet.route, betData);
            redisConnector.lpush(util.format(models.constants.BET_LATEST_HISTORY, self._hallName), betData);
        });

        player.on(sscCmd.push.unBet.route, (data) => {
            let unBetData = {
                data: data,
                ext: {
                    nickname: player.account.nickname,
                }
            };
            self.broadcast(sscCmd.push.unBet.route, unBetData);
            redisConnector.lpush(util.format(models.constants.BET_LATEST_HISTORY, self._hallName), unBetData);
        });

        player.on(sscCmd.push.chat.route, (data) => {
            let chatData = {
                data: data,
                ext: {
                    nickname: player.account.nickname,
                }
            };

            self.broadcast(sscCmd.push.chat.route, chatData);
            redisConnector.lpush(util.format(models.constants.CHAT_LATEST_HISTORY, self._hallName), chatData);
        });

        player.on(sscCmd.push.betResult.route, (data) => {
            player.send(sscCmd.push.betResult.route, data);
        });
    }

    addMsgChannel({uid, sid}) {
        this._msgChannel.add(this._hallName, uid, sid);
    }

    leaveMsgChannel({uid, sid}) {
        this._msgChannel.leave(this._hallName, uid, sid);
    }

    broadcast(route, data, serverType = rpcDefs.serverType.game) {
        if (this._msgChannel) {
            this._msgChannel.pushMessage(serverType, route, data, this._hallName);
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

module.exports = SSC;