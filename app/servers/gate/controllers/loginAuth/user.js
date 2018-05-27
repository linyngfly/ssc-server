const moment = require('moment');
const utils = require('../../../../utils/utils');
const crypto = require('crypto');
const models = require('../../../../models');

class User {
    constructor() {
    }

    async _queryPlayerFromMysql(uid) {
    }

    async isRegister(openId) {
    }

    async register(data) {
    }

    async _genUID(){
        return await redisConnector.incr(models.redisKeyConst.UID_COUNTER);
    }

    async login(data) {
        this._authCheck(data);
        await this._afterLogin(data);
    }

    logout(){

    }

    _authCheck(player, data){}

    getUserInfo(data) {
    }

    _createSalt(data) {
        const hash = crypto.createHash('sha1');
        hash.update(data);
        return hash.digest('hex');
    }

    async _afterLogin(data){
        let player = data.player;
        let token = utils.generateSessionToken(player.uid);
        player.token = token;
        player.updated_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        player.login_count += 1;
        await player.commit();
    }
}

module.exports = User;