const Player = require('./player');
const config = require('./config');
const models = require('../../models');
const moment = require('moment');
const sscCmd = require('../../cmd/sscCmd');
const ERROR_OBJ = require('./error_code').ERROR_OBJ;
const logBuilder = require('../../utils/logSync/logBuilder');

class SscPlayer extends Player {
    constructor(opts) {
        super(opts);
        this._limitRate = opts.limitRate;
        this._account = opts.account;
        this._betsMap = new Map();
        this._betLimitMap = new Map();
        this._betRateMap = new Map();
        this._last_chat_timestamp = 0;
    }

    get account() {
        return this._account;
    }

    async openAward(period, numbers, opentime, openAwardCalc) {
        let bets = [];
        let openResult = openAwardCalc.openResult;
        for (let bet of this._betsMap.values()) {
            if (bet.period == period && bet.state == models.constants.BET_STATE.WAIT) {
                let betItems = bet.betItems;
                for (let i = 0; i < betItems.length; i++) {
                    let item = betItems[i];
                    if (openResult.has(item.result)) {
                        let multi = this._limitRate.getRate(bet.rate_dic, this._betRateMap.get(bet.rate_dic), openAwardCalc.sum);
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
                bets.push({
                    id: bet.id, state: bet.state, money: incomeMoney, period: period, numbers: numbers,
                    opentime: opentime, openResult: Array.from(openResult)
                });
                await bet.commit();

                logBuilder.addMoneyLog({
                    uid: this.uid,
                    gain: bet.winMoney,
                    total: this.account.money,
                    scene: models.constants.GAME_SCENE.LOTTERY
                });


                redisConnector.sadd(models.constants.DATA_SYNC_BE_IDS, bet.id);
            }
        }

        if (bets.length == 0) {
            return;
        }

        this._betsMap.clear();
        this._betLimitMap.clear();
        this._betRateMap.clear();
        await this.account.commit();
        this.emit(sscCmd.push.betResult.route, {money:this.account.money, numbers: numbers, bets: bets});
    }

    isBet() {
        return this._betsMap.size != 0;
    }

    //投注限额检查
    canBet() {
        //TODO 投注限额检查
    }

    myBetOrder() {
        let bets = [];
        for (let bet of this._betsMap.values()) {
            bets.push(bet.toJSON());
        }
        return bets;
    }

    _getLimitKey(dic, num){
        if(dic == config.SSC28.BET_TYPE_LIMIT_DIC.NUM){
            return dic+num;
        }
        return dic;
    }

    async bet({period, identify, betData, parseRet}) {
        logger.error('bet=', betData, parseRet);
        this.account.money = 0;
        await this.account.commit();

        if (parseRet.total == -1) {
            let money = Math.floor(this.account.money / parseRet.betItems.length);
            for (let i = 0; i < parseRet.betItems.length; i++) {
                let item = parseRet.betItems[i];
                item.money = money;
                item.desc = item.desc.replace(/-1/, money);
            }
            parseRet.total = money * parseRet.betItems.length;
        }

        let oneBetMoney = parseRet.total / parseRet.betItems.length;
        let oneMin = this._limitRate.getLimit(config.SSC28.BET_TYPE_LIMIT_DIC.ONE_MIN);
        let oneMax = this._limitRate.getLimit(config.SSC28.BET_TYPE_LIMIT_DIC.ONE_MAX);
        if (oneBetMoney > oneMax) {
            throw ERROR_OBJ.BET_AMOUNT_TOO_HIGH;
        } else if (oneBetMoney < oneMin) {
            throw ERROR_OBJ.BET_AMOUNT_TOO_LOW;
        }

        let allTypeMoney = this._betLimitMap.get(config.SSC28.BET_TYPE_LIMIT_DIC.ALL) || 0;
        allTypeMoney += parseRet.total;
        let maxAllTypeLimitMoney = this._limitRate.getLimit(config.SSC28.BET_TYPE_LIMIT_DIC.ALL);
        if (allTypeMoney > maxAllTypeLimitMoney) {
            throw ERROR_OBJ.BET_PERIOD_OVERLOAD_LIMIT;
        }

        let limitKey = this._getLimitKey(parseRet.limit_dic, parseRet.betItems[0].result);
        let totalLimitMoney = this._betLimitMap.get(limitKey) || 0;
        totalLimitMoney += parseRet.total;
        let maxLimitMoney = this._limitRate.getLimit(parseRet.limit_dic, parseRet.betItems[0].result);
        if (totalLimitMoney > maxLimitMoney) {
            throw ERROR_OBJ.BET_TYPE_OVERLOAD_LIMIT;
        }

        let bet = await models.bet.helper.createBet({
            uid: this.uid,
            period: period,
            identify: identify,
            betData: betData,
            betItems: parseRet.betItems,
            multi: config.SSC28.BET_TYPE_LIMIT_DIC.MULTI == parseRet.limit_dic ? 1 : 0,
            betCount: parseRet.betItems.length,
            betMoney: parseRet.total,
            betTime: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        bet.limit_dic = parseRet.limit_dic;
        bet.rate_dic = parseRet.rate_dic;

        this.account.money = -parseRet.total;
        await this.account.commit();
        if (this.account.money < 0) {
            this.account.money = parseRet.total;
            await this.account.commit();
            throw ERROR_OBJ.ACCOUNT_AMOUNT_NOT_ENOUGH;
        }

        logBuilder.addMoneyLog({
            uid: this.uid,
            cost: parseRet.total,
            total: this.account.money,
            scene: models.constants.GAME_SCENE.BET
        });

        let sysInfo = {
            publisher: +this.uid,
            content: `下注消耗金豆${parseRet.total}`,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        logBuilder.addLog(logBuilder.tbl_id.TBL_SYS_MESSAGE, sysInfo);

        this._betsMap.set(bet.id, bet);
        this._betLimitMap.set(limitKey, totalLimitMoney);
        this._betLimitMap.set(config.SSC28.BET_TYPE_LIMIT_DIC.ALL, allTypeMoney);
        let rateMoney = this._betRateMap.get(bet.rate_dic) || 0;
        rateMoney += parseRet.total;
        this._betRateMap.set(bet.rate_dic, rateMoney);
        this.emit(sscCmd.push.bet.route, bet.toJSON());
        return {money: this.account.money};
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

        logBuilder.addMoneyLog({
            uid: this.uid,
            gain: bet.betMoney,
            total: this.account.money,
            scene: models.constants.GAME_SCENE.UNBET
        });

        let sysInfo = {
            publisher: +this.uid,
            content: `撤销下注返还金豆${bet.betMoney}`,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        logBuilder.addLog(logBuilder.tbl_id.TBL_SYS_MESSAGE, sysInfo);

        let limitKey = this._getLimitKey(bet.limit_dic, bet.betItems[0].result);

        let typeLimitMoney = this._betLimitMap.get(limitKey);
        this._betLimitMap.set(limitKey, typeLimitMoney - bet.betMoney);

        let allTypeLimitMoney = this._betLimitMap.get(config.SSC28.BET_TYPE_LIMIT_DIC.ALL);
        this._betLimitMap.set(config.SSC28.BET_TYPE_LIMIT_DIC.ALL, allTypeLimitMoney - bet.betMoney);

        this._betsMap.delete(id);

        this.emit(sscCmd.push.unBet.route, bet.toJSON());

        return {money: this.account.money};
    }

    async chat(msg) {
        if (this.account.forbid_talk == 1) {
            throw ERROR_OBJ.CHAT_FORBID_TALK;
        }

        let now = Date.now();
        if (now - this._last_chat_timestamp < config.CHAT_INTERVAL_TIME) {
            throw ERROR_OBJ.CHAT_TOO_FREQUENT;
        }

        msg.time = moment().format('YYYY-MM-DD HH:mm:ss');

        //TODO 发送消息，校验消息格式
        this.emit(sscCmd.push.chat.route, msg);
        this._last_chat_timestamp = now;
    }

}

module.exports = SscPlayer;