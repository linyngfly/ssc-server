const moment = require('moment');
const crypto = require('crypto');
const Token = require('../../../../utils/token');
const session = require('../../../../utils/imports').session;

class User {
    constructor() {
    }

    async _queryAccount(uid) {
    }

    async isRegister(openId) {
    }

    async register(data) {
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
        let token = Token.create(player.uid, Date.now(), session.secret);
        player.token = token;
        player.updated_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        player.login_count = 1;
        await player.commit();
    }
}

module.exports = User;