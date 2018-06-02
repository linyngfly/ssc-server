const ERROR_OBJ = require('../error_code').ERROR_OBJ;
const CQBetParser = require('./CQBetParser');
const BonusPool = require('./bonusPool');
const CQPlayer = require('./CQPlayer');
const Hall = require('../Hall');
const config = require('../config');
const models = require('../../../models');
const constants = require('../../../consts/constants');

class Cqssc extends Hall {
    constructor() {
        super({msgChannelName: config.CQSSC.MSG_CHANNEL_NAME});
        this._betParser = new CQBetParser();
        this._bonusPool = new BonusPool();
        this._playerMap = new Map();
    }

    start() {
        super.start();
        this._bonusPool.start();
    }

    stop() {
        super.stop();
        this._bonusPool.stop();
    }

    async request(route, msg, session) {
        if (!this[route]) {
            throw ERROR_OBJ.NOT_SUPPORT_SERVICE;
        }
        this[route](msg, session);
    }

    async rpc(method, msg) {
        if (!this[method]) {
            throw ERROR_OBJ.NOT_SUPPORT_SERVICE;
        }
        this[method](msg);
    }

    enter(msg) {
        let player = this._playerMap.get(msg.uid);
        if (player) {
            player.state = constants.PLAYER_STATE.ONLINE;
            return;
        }
        player = this._createPlayer(msg.uid, msg.sid);
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
        let account = await models.account.helper.getAccount(uid);
        return new CQPlayer({uid: uid, sid: sid, account: account});
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
    async c_bet(msg) {
        if (!this._bonusPool.canBetNow()) {
            throw ERROR_OBJ.BET_CHANNEL_CLOSE;
        }

        let [err, parseRet] = this._betParser.parse(msg.betData);
        if (err) {
            return [err];
        }

        //TODO 投注限额
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

    }
}

module.exports = new Cqssc();