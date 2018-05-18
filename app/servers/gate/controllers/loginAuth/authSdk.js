const loginConfig = require('./login.config');
const constDef = require('../../../../consts/constDef');

class AuthSdk {
    constructor() {
        this._sdkMap = new Map();
        this.install(constDef.AUTH_CHANNEL_ID.INNER);
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