const models = require('../../models');

class GenAccount {
    constructor() {
        this._apiCfgMap = new Map();
    }

    async getAccount(uid, url) {
        let apiCfg = this._apiCfgMap.get(url);
        if (!apiCfg) {
            return;
        }

        if (!apiCfg.accountFields) {
            return;
        }

        return await models.account.helper.getAccount(uid, apiCfg.accountFields);
    }

    checkParams(url, reqData) {
        let apiCfg = this._apiCfgMap.get(url);
        if (apiCfg && apiCfg.params && apiCfg.params.length > 0) {
            let params = apiCfg.params;
            for (let i = 0; i < params.length; i++) {
                if (reqData[params[i]] == null) {
                    return false;
                }
            }
        }
        return true;
    }

    registeApiCfg(url, apiCfg) {
        if (!apiCfg) return;
        this._apiCfgMap.set(url, apiCfg);
    }
}

module.exports = new GenAccount();