const versions = require('./versions');

class VersionsUtil{
    constructor(){
        this._divisionPlatform = false;
        this._imgDispatcher = false;
        this._init();
    }

    _init(){
        if(versions.PLATFORM_DIVISION.indexOf(versions.PUB_GAME_TYPE) != -1){
            this._divisionPlatform = true;
        }

        if(versions.IMG_DISPATCHER.indexOf(versions.PUB_GAME_TYPE) != -1){
            this._imgDispatcher = true;
        }
    }

    getVerKey () {
        return versions.GAMETYPE_TAG[versions.PUB_GAME_TYPE];
    }

    getOpenid(openid, device){
        if(this._divisionPlatform){
            return `${openid}_${device}`;
        }else{
            return openid;
        }
    }

    getCDNDomain(){
        return versions.CDN_DOMAIN[versions.PUB_GAME_TYPE];
    }

    getImgDispatcher(){
        return this._imgDispatcher;
    }

    getWWWDomain(){
        return versions.WWW_DOMAIN.indexOf(versions.PUB_GAME_TYPE) !== -1 ? 'www.' : null;
    }

    isDevelopment(){
        return versions.LOCAL_DEV_MODE;
    }
}

module.exports = new VersionsUtil();