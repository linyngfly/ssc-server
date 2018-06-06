const config = require('../config');

class Lucky28LimitRate{
    constructor(){
        this._limitConfig = config.LUCKY28.BET_LIMIT_CONFIG;
        this._rateConfig = config.LUCKY28.BET_RATE_CONFIG;
    }

    async loadConfig(){
        let limitSql = 'SELECT * FROM config where id=?';
        try{
            let rows = await mysqlConnector.query(limitSql, [config.SSC28.BET_LIMIT_CONFIG_ID]);
            if(rows && rows[0]){
                let info = rows[0].info;
                this._limitConfig = info.lucky28;
            }
        }catch (err) {
            logger.error(`加载幸运28投注限制配置失败 err=`,err);
        }

        let rateSql = 'SELECT * FROM config where id=?';
        try{
            let rows = await mysqlConnector.query(rateSql, [config.SSC28.BET_RATE_CONFIG_ID]);
            if(rows && rows[0]){
                let info = rows[0].info;
                this._rateConfig = info.lucky28;
            }
        }catch (err) {
            logger.error(`加载幸运28赔率配置失败 err=`,err);
        }

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