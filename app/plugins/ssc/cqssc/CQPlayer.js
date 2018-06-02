const Player = require('../player');
const config = require('../config');
const models = require('../../../models');
const moment = require('moment');
const ERROR_OBJ = require('../error_code').ERROR_OBJ;

class CQPlayer extends Player {
    constructor(opts) {
        super(opts);
        this._account = opts.account;
        this._betsMap = new Map();
        this._last_chat_timestamp = 0;
    }

    get account() {
        return this._account;
    }

    isBet() {
        return this._betsMap.size != 0;
    }

    canBet() {
        //TODO 投注限额检查
    }

    async bet({period, identify, betData, parseRet}) {
        await this._account.gold = -parseRet.total;
        await this._account.commit();
        if(this._account.gold < 0){
            throw ERROR_OBJ.ACCOUNT_AMOUNT_NOT_ENOUGH;
        }else {
            await this._account.gold = parseRet.total;
            await this._account.commit();
        }

        let bet = await models.bet.helper.createBet({
            uid:this.uid,
            nickname:this._account.nickname,
            period:period,
            identify:identify,
            betData:betData,
            betTypeInfo:parseRet.betTypeInfo,
            betItems:parseRet.betItems,
            betCount:parseRet.betItems.length,
            betMoney:parseRet.total,
            betTime:moment().format('YYYY-MM-DD HH:mm:ss')
        });
        this._betsMap.set(bet.id, bet);
    }

    async unBet(id) {
        let bet = this._betsMap.get(id);
        if(!bet){
            throw ERROR_OBJ.BET_NOT_EXIST;
        }

        if(bet.state != models.constants.BET_STATE.WAIT){
            throw ERROR_OBJ.BET_CANNOT_CANCEL;
        }

        bet.state = models.constants.BET_STATE.CANCEL;
        await bet.commit();
    }

    async chat(msg){
        let now = Date.now();
        if(now - this._last_chat_timestamp < config.CHAT_INTERVAL_TIME){
            throw ERROR_OBJ.CHAT_TOO_FREQUENT;
        }

        //TODO 发送消息
        this._last_chat_timestamp = Date.now();
    }
}

module.exports = CQPlayer;