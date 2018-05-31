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
        if(!this[route]){
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
        let msgId = {
            sid: msg.sid,
            uid: msg.uid,
        };

        let player = this._playerMap.get(msg.uid);
        if (player) {
            player.state = constants.PLAYER_STATE.ONLINE;
            return;
        }
        player = new CQPlayer(msgId);
        this._addPlayer(player);
    }

    leave(msg) {
        let player = this._playerMap.get(msg.uid);
        if (!player.isBet()) {
            this._delPlayer(player);
        }else {
            player.state = constants.PLAYER_STATE.OFFLINE;
        }
    }

    _createPlayer({uid,sid}){

    }

    _addPlayer(player){
        this.addEvent(player);
        this.addMsgChannel(player.msgId);
        this._playerMap.set(player.uid, player);
    }

    _delPlayer(player){
        this.leaveMsgChannel(player.msgId);
        this._playerMap.delete(player.uid);
    }

    setPlayerState(uid, state) {
        let player = this._playerMap.get(uid);
        if (player) {
            player.state = state;
        }
    }


    c_bet(msg) {
        if (!this._bonusPool.canBetNow()) {
            throw ERROR_OBJ.BET_CHANNEL_CLOSE;
        }

        let [err, parseRet] = this._betParser.parse(msg.betData);
        if (err) {
            return [err];
        }

        //TODO 投注限额
        let player = this._playerMap.get(msg.uid);
        player.bet(this._bonusPool.getNextPeriod(), this._bonusPool.getIdentify(), msg.betData, parseRet);


    }

    c_unBet(msg) {

    }

    c_chat(msg) {

    }

    addEvent(player) {

    }
}

module.exports = new Cqssc();