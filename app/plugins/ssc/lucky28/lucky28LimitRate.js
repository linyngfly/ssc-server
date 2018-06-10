const config = require('../config');
const util = require('util');
const models = require('../../../models');
class Lucky28LimitRate{
    constructor(){
        this._limitConfig = config.LUCKY28.BET_LIMIT_CONFIG;
        this._rateConfig = config.LUCKY28.BET_RATE_CONFIG;

        this._bet_limit_key = util.format(models.constants.CONFIG.BET_LIMIT, config.LUCKY28.GAME_IDENTIFY);
        this._bet_rate_key = util.format(models.constants.CONFIG.BET_RATE, config.LUCKY28.GAME_IDENTIFY);
    }

    async _loaBetLimit(){
        let bet_limit = null;
        let rows = await mysqlConnector.query('SELECT * FROM tbl_config WHERE identify=? AND type=?',
            [config.LUCKY28.GAME_IDENTIFY, config.CONFIG_TYPE.BET_LIMIT]);
        if(rows && rows[0]){
            bet_limit = JSON.parse(rows[0].info);
        }else {
            bet_limit = config.LUCKY28.BET_LIMIT_CONFIG;
            await mysqlConnector.insert(`INSERT INTO tbl_config (identify, type, info) VALUES (?,?,?)`,
                [config.LUCKY28.GAME_IDENTIFY, config.CONFIG_TYPE.BET_LIMIT, JSON.stringify(bet_limit)]);
        }

        await redisConnector.set(this._bet_limit_key, bet_limit);
        this._limitConfig = bet_limit;
    }

    async _loaBetRate(){
        let bet_rate = null;
        let rows = await mysqlConnector.query('SELECT * FROM tbl_config WHERE identify=? AND type=?',
            [config.LUCKY28.GAME_IDENTIFY, config.CONFIG_TYPE.BET_RATE]);
        if(rows && rows[0]){
            bet_rate = JSON.parse(rows[0].info);
        }else {
            bet_rate = config.LUCKY28.BET_RATE_CONFIG;
            await mysqlConnector.insert(`INSERT INTO tbl_config (identify, type, info) VALUES (?,?,?)`,
                [config.LUCKY28.GAME_IDENTIFY, config.CONFIG_TYPE.BET_RATE, JSON.stringify(bet_rate)]);
        }
        await redisConnector.set(this._bet_rate_key, bet_rate);
        this._rateConfig = bet_rate;
    }

    async loadConfig(){
        try{
            let bet_limit = await redisConnector.get(this._bet_limit_key);
            if(null == bet_limit){
                await this._loaBetLimit();
            }

            let bet_rate = await redisConnector.get(this._bet_rate_key);
            if(null == bet_rate){
                await this._loaBetRate();
            }
        }catch (err) {
            logger.error(`加载幸运28投注限制/赔率配置失败 err=`,err);
        }

        // await this.resetConfig();
    }

    async resetConfig(){
        await redisConnector.del(this._bet_limit_key);
        await this._loaBetLimit(this._bet_limit_key);

        await redisConnector.del(this._bet_rate_key);
        await this._loaBetRate(this._bet_rate_key);
    }

    getLimit(dic){
        return this._limitConfig[dic];
    }

    getRateDic(dic){
        return config.SSC28.BET_TYPE_DIC_LINK[dic];
    }

    getRate(type, num){
        let rate = this._rateConfig[type];
        if(rate instanceof Array){
            for(let i=0;i<rate.length;i++){
                let item = rate[0];
                let range = item[0];
                let r = item[1];
                if(range[0] == -1 && num < range[1] || num >= range[0] && num < range[1]
                || range[1] == -1 && num >= range[0]){
                    return r;
                }
            }
        }
    }
}

module.exports = Lucky28LimitRate;