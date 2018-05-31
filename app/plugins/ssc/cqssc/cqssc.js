const ERROR_OBJ = require('../error_code').ERROR_OBJ;
const CQBetParser = require('./CQBetParser');
const BonusPool = require('./bonusPool');
const CQPlayer = require('./CQPlayer');
const constants = require('../../../consts/constants');



class Cqssc{
    constructor(){
        this._betParser = new CQBetParser();
        this._bonusPool = new BonusPool();
        this._playerMap = new Map();
    }

    start(){
    }

    stop(){
    }

    async request(route, msg, session){
        if(!this[route]){
            throw ERROR_OBJ.NOT_SUPPORT_SERVICE;
        }
        this[route](msg, session);
    }

    async rpc(method, msg){
        if(!this[method]){
            throw ERROR_OBJ.NOT_SUPPORT_SERVICE;
        }
        this[method](msg);
    }

    enter(msg){
        let player = this._playerMap.get(msg.uid);
        if(player){
            player.state =constants.PLAYER_STATE.ONLINE;
            return;
        }

        player = new CQPlayer({
            sid:msg.sid,
            uid:msg.uid,
        });
        this._playerMap.set(msg.uid, player);
    }

    leave(msg){

    }

    setPlayerState(uid, state){

    }


    c_bet(msg){
        if(!this._bonusPool.canBetNow()){
            throw ERROR_OBJ.BET_CHANNEL_CLOSE;
        }

        let [err, parseRet] = this._betParser.parse(msg.betData);
        if(err){
            return [err];
        }

        //TODO 投注限额
        let player = this._playerMap.get(msg.uid);
        player.bet(this._bonusPool.getNextPeriod(), this._bonusPool.getIdentify(), msg.betData, parseRet);


    }

    c_unBet(msg){

    }

    c_chat(msg){

    }
}

module.exports = new Cqssc();