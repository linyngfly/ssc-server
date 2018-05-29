const ERROR_OBJ = require('../error_code').ERROR_OBJ;
const CQBetParser = require('./CQBetParser');
const BonusPool = require('./bonusPool');

class Cqssc{
    constructor(){
        this._betParser = new CQBetParser();
        this._bonusPool = new BonusPool();
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

    c_bet(msg, session){
        if(!this._bonusPool.canBetNow()){
            throw ERROR_OBJ.BET_CHANNEL_CLOSE;
        }

        let [err, parseRet] = this._betParser.parse(msg.betData);
        if(err){
            return [err];
        }

    }

    c_unBet(msg, session){

    }
}

module.exports = new Cqssc();