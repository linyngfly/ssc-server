const omelo = require('omelo');
// const globalStatusData = require('../../utils/globalStatusData');
const rpcDefs = require('../../net/rpcDefs');
const config = require('./config');
const ERROR_OBJ = require('./error_code').ERROR_OBJ;
const sscCmd = require('../../cmd/sscCmd');
const constants = require('../../consts/constants');

class SscHall{
    constructor(opts){
        this._msgChannelName = opts.msgChannelName;
        this._betParser = opts.betParser;
        this._bonusPool = opts.bonusPool;
        this._playerMap = new Map();
    }

    start(){
        this._msgChannel = omelo.app.get('globalChannelService');

        let self = this;

        this._bonusPool.on(config.LOTTERY_EVENT.TICK_COUNT, (dt)=>{
            logger.error('开奖倒计时=', dt);
            self.broadcast(sscCmd.push.countdown.route, {
                dt: dt,
            });
        });

        this._bonusPool.on(config.LOTTERY_EVENT.OPEN_AWARD, async (lotteryInfo)=>{
            await self._openAward(lotteryInfo.last);
            self.broadcast(sscCmd.push.countdown.route, {
                lotteryInfo: lotteryInfo,
            });
        });

        this._bonusPool.start();
    }

    stop(){
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

    async _createPlayer(uid, sid) {}

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
    async c_heartbeat(msg){
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
        await player.bet({
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
        await player.unBet(msg.id);
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

    addMsgChannel({uid, sid}){
        this._msgChannel.add(this._msgChannelName, uid, sid);
    }

    leaveMsgChannel({uid, sid}){
        this._msgChannel.leave(this._msgChannelName, uid, sid);
    }

    broadcast(route, data, serverType = rpcDefs.serverType.game){
        if(this._msgChannel){
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

    async _openAward(last){}


}

module.exports = SscHall;