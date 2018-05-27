const loginConfig = require('./login.config');
const constDef = require('../../../../consts/consts');

class AuthSdk {
    constructor() {
        this._sdkMap = new Map();
        this.install(constDef.AUTH_CHANNEL_ID.WZGJ_INNER);
    }

    sdk(type) {
        return this._sdkMap.get(type);
    }

    install(type) {
        let platformConfig = loginConfig.PLATFORM_CONFIG[type];
        let sdkApi = new platformConfig.Class(platformConfig.sdk);
        this._sdkMap.set(type, sdkApi);
    }
}

module.exports = new AuthSdk();