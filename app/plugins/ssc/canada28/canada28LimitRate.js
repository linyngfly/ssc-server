const config = require('../config');
const util = require('util');
const models = require('../../../models');
class Canada28LimitRate{
    constructor(){
        this._limitConfig = config.CANADA28.BET_LIMIT_CONFIG;
        this._rateConfig = config.CANADA28.BET_RATE_CONFIG;

        this._bet_limit_key = util.format(models.constants.CONFIG.BET_LIMIT, config.CANADA28.GAME_IDENTIFY);
        this._bet_rate_key = util.format(models.constants.CONFIG.BET_RATE, config.CANADA28.GAME_IDENTIFY);
    }

    async _loadBetLimit(){
        let bet_limit = null;
        let rows = await mysqlConnector.query('SELECT * FROM tbl_config WHERE identify=? AND type=?',
            [config.CANADA28.GAME_IDENTIFY, config.CONFIG_TYPE.BET_LIMIT]);
        if(rows && rows[0]){
            bet_limit = JSON.parse(rows[0].info);
        }else {
            bet_limit = config.CANADA28.BET_LIMIT_CONFIG;
            await mysqlConnector.insert(`INSERT INTO tbl_config (identify, type, info) VALUES (?,?,?)`,
                [config.CANADA28.GAME_IDENTIFY, config.CONFIG_TYPE.BET_LIMIT, JSON.stringify(bet_limit)]);
        }

        await redisConnector.set(this._bet_limit_key, bet_limit);
        this._limitConfig = bet_limit;
    }

    async _loadBetRate(){
        let bet_rate = null;
        let rows = await mysqlConnector.query('SELECT * FROM tbl_config WHERE identify=? AND type=?',
            [config.CANADA28.GAME_IDENTIFY, config.CONFIG_TYPE.BET_RATE]);
        if(rows && rows[0]){
            bet_rate = JSON.parse(rows[0].info);
        }else {
            bet_rate = config.CANADA28.BET_RATE_CONFIG;
            await mysqlConnector.insert(`INSERT INTO tbl_config (identify, type, info) VALUES (?,?,?)`,
                [config.CANADA28.GAME_IDENTIFY, config.CONFIG_TYPE.BET_RATE, JSON.stringify(bet_rate)]);
        }
        await redisConnector.set(this._bet_rate_key, bet_rate);
        this._rateConfig = bet_rate;
    }

    async loadConfig(){
        try{
            let bet_limit = await redisConnector.get(this._bet_limit_key);
            if(null == bet_limit){
                await this._loadBetLimit();
            }
            this._limitConfig = bet_limit;
            let bet_rate = await redisConnector.get(this._bet_rate_key);
            if(null == bet_rate){
                await this._loadBetRate();
            }
            this._rateConfig = bet_rate;
        }catch (err) {
            logger.error(`加载幸运28投注限制/赔率配置失败 err=`,err);
        }
    }

    async resetConfig(){
        await redisConnector.del(this._bet_limit_key);
        await this._loadBetLimit();

        await redisConnector.del(this._bet_rate_key);
        await this._loadBetRate();
    }

    getLimit(dic, sub){
        let cfg = this._limitConfig[dic];
        if(cfg instanceof Array){
            return Number(cfg[sub]);
        }else {
            return Number(cfg);
        }
    }

    getRateDic(dic){
        return config.SSC28.BET_TYPE_DIC_LINK[dic];
    }

    _check1314(type, sum){
        let _newType = type;
        switch (type){
            case config.SSC28.BET_TYPE_RATE_DIC.BIG:
                if(sum == 14){
                    _newType = config.SSC28.BET_TYPE_RATE_DIC.BIG_14;
                }
                break;
            case config.SSC28.BET_TYPE_RATE_DIC.SMALL:
                if(sum == 13){
                    _newType = config.SSC28.BET_TYPE_RATE_DIC.SMALL_13;
                }
                break;
            case config.SSC28.BET_TYPE_RATE_DIC.SINGLE:
                if (sum == 13) {
                    _newType = config.SSC28.BET_TYPE_RATE_DIC.SINGLE_13;
                }
                break;
            case config.SSC28.BET_TYPE_RATE_DIC.DOUBLE:
                if (sum == 13) {
                    _newType = config.SSC28.BET_TYPE_RATE_DIC.DOUBLE_14;
                }
                break;
            case config.SSC28.BET_TYPE_RATE_DIC.BIG_DOUBLE:
                if(sum == 14){
                    _newType = config.SSC28.BET_TYPE_RATE_DIC.BIG_DOUBLE_14;
                }
                break;
            case config.SSC28.BET_TYPE_RATE_DIC.SMALL_SINGLE:
                if(sum == 13){
                    _newType = config.SSC28.BET_TYPE_RATE_DIC.SMALL_SINGLE_13;
                }
                break;
        }
        return _newType;
    }

    getRate(type, num, sum){
        type = this._check1314(type, sum);
        let rate = this._rateConfig[type];
        if(rate instanceof Array){
            for(let i=0;i<rate.length;i++){
                let item = rate[i];
                if(!(item instanceof Array)){
                    return rate[num];
                }

                let range = item[0];
                let r = Number(item[1]);
                let rng0 = Number(range[0]);
                let rng1 = Number(range[1]);
                if(rng0 == -1 && num < rng1 || num >= rng0 && num < rng1
                || rng1 == -1 && num >= rng0){
                    return r;
                }
            }
        }else {
            return Number(rate);
        }
    }
}

let tt = new Canada28LimitRate();
console.log(tt.getRate('NUM', 4));;



module.exports = Canada28LimitRate;