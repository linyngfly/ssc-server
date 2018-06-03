const Player = require('./player');
const config = require('./config');
const models = require('../../models');
const moment = require('moment');
const sscCmd = require('../../cmd/sscCmd');
const ERROR_OBJ = require('./error_code').ERROR_OBJ;

class SscPlayer extends Player{
    constructor(opts){
        super(opts);
        this._account = opts.account;
        this._betsMap = new Map();
        this._last_chat_timestamp = 0;
    }

    get account() {
        return this._account;
    }

    //获取投注的赔率
    _getBetRate(typeCode) {}

    async openAward(period, numbers, openResult) {
        let bets = [];
        for (let bet of this._betsMap.values()) {
            if (bet.period == period && bet.state == models.constants.BET_STATE.WAIT) {
                let betItems = bet.betItems;
                for (let i = 0; i < betItems.length; i++) {
                    let item = betItems[i];
                    let multi = this._getBetRate(item.type.code);
                    if (openResult.has(item.result)) {
                        let inc = item.money * (1 + multi);
                        inc = Number(inc.toFixed(2));
                        bet.winCount++;
                        bet.winMoney += inc;
                        this.account.winCount = 1;
                        this.account.money = inc;
                    }
                }

                let incomeMoney = Number((bet.winMoney - bet.betMoney).toFixed(2));
                bet.state = incomeMoney > 0 ? models.constants.BET_STATE.WIN : models.constants.BET_STATE.LOSE;
                bets.push({id: bet.id, state: bet.state, money: incomeMoney});
                await bet.commit();
            }
        }

        if(bets.length == 0){
            return;
        }
        this._betsMap.clear();
        await this.account.commit();
        this.emit(sscCmd.push.betResult.route, {numbers:numbers, bets:bets})
    }

    isBet() {
        return this._betsMap.size != 0;
    }

    //投注限额检查
    canBet() {
        //TODO 投注限额检查
    }

    async bet({period, identify, betData, parseRet}) {
        this.account.money = 0;
        await this.account.commit();

        if(parseRet.total == -1) {
            let money = Math.floor(this.account.money / parseRet.betItems.length);
            for (let i = 0; i < parseRet.betItems.length; i++) {
                let item = parseRet.betItems[i];
                item.money = money;
                item.desc = item.desc.replace(/ALL/, money)
            }
            parseRet.total = money * parseRet.betItems.length;
        }

        this.account.money = -parseRet.total;
        await this.account.commit();
        if (this.account.money < 0) {
            this.account.money = parseRet.total;
            await this.account.commit();
            throw ERROR_OBJ.ACCOUNT_AMOUNT_NOT_ENOUGH;
        }

        let bet = await models.bet.helper.createBet({
            uid: this.uid,
            period: period,
            identify: identify,
            betData: betData,
            betTypeInfo: parseRet.betTypeInfo,
            betItems: parseRet.betItems,
            betCount: parseRet.betItems.length,
            betMoney: parseRet.total,
            betTime: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        this._betsMap.set(bet.id, bet);
        this.emit(sscCmd.push.bet.route, bet.toJSON());
    }

    async unBet(id) {
        let bet = this._betsMap.get(id);
        if (!bet) {
            throw ERROR_OBJ.BET_NOT_EXIST;
        }

        if (bet.state != models.constants.BET_STATE.WAIT) {
            throw ERROR_OBJ.BET_CANNOT_CANCEL;
        }

        this.account.money = bet.betMoney;
        bet.state = models.constants.BET_STATE.CANCEL;

        await bet.commit();
        await this.account.commit();

        this._betsMap.delete(id);

        this.emit(sscCmd.push.unBet.route, bet.toJSON());
    }

    async chat(msg) {
        let now = Date.now();
        if (now - this._last_chat_timestamp < config.CHAT_INTERVAL_TIME) {
            throw ERROR_OBJ.CHAT_TOO_FREQUENT;
        }

        //TODO 发送消息，校验消息格式
        this.emit(sscCmd.push.chat.route, msg);
        this._last_chat_timestamp = Date.now();
    }




}

module.exports = SscPlayer;