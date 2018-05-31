const _ = require('lodash');
const User = require('./user');
const models = require('../../../../models');
const ERROR_OBJ = require('../../../../consts/error_code').ERROR_OBJ;
const moment = require('moment');
const QUERY_UID_BY_OPENID = "SELECT `id` FROM `user` WHERE `openid`=? ";

class WZGJUser extends User {
    constructor() {
        super();
        this._codes = {
            "18602842393":"353221"
        };
    }

    getUserInfo(data) {
        return data;
    }

    _checkPhoneCode(phone, code){
        return;
        if(!this._codes[phone] || this._codes[phone] != code){
            throw ERROR_OBJ.PHONE_CODE_INVALID;
        }
    }

    async _queryPlayerFromMysql(uid) {
        let mysqlPlayer = await models.player.helper.getMysqlPlayer(uid);
        return await models.player.helper.createPlayer(uid, mysqlPlayer);
    }

    async sendPhoneCode(phone){
        //TODO 短信接口发送短信
        this._codes[phone] = 353221;
        return {expires:60};
    }

    async isRegister(data){
        let openid = data.username;
        let uid = await redisConnector.hget(models.redisKeyConst.MAP_OPENID_UID, openid);
        if(uid != null){
            return uid;
        }

        let rows = await mysqlConnector.query(QUERY_UID_BY_OPENID, [openid]);
        let row = rows && rows[0];
        if (row) {
            await this._queryPlayerFromMysql(row.id);
            await redisConnector.hset(models.redisKeyConst.MAP_OPENID_UID, openid, row.id);
            return row.id;
        }
    }

    async register(data) {
        //TODO 手机校验
        this._checkPhoneCode(data.username, data.code);

        let playerData = _.cloneDeep(data);
        let openid = data.username;
        playerData.phone = openid;
        playerData.openid = data.username;
        playerData.password = this._createSalt(data.username + data.password);

        let uid = await this._genUID();
        playerData.id = uid;
        let at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        playerData.created_at = at;
        playerData.updated_at = at;
        playerData.openid = openid;

        await redisConnector.hset(models.redisKeyConst.MAP_OPENID_UID, openid, uid);
        await models.player.helper.createPlayer(uid, playerData);
        return uid;
    }

    async login(data) {
        let player = await models.player.helper.getPlayer(data.uid);
        data.player = player;
        await super.login(data);
        return player.toJSON();
    }

    async logout(data){
        let player = await models.player.helper.getPlayer(data.uid);
        player.token = '';
        await player.commit();
    }

    _authCheck(data){
        let saltPassword = this._createSalt(data.username + data.password);
        if (saltPassword !== data.player.password) {
            throw ERROR_OBJ.USERNAME_PASSWORD_ERROR;
        }
    }

    async modifyPassword(data) {
        let player = await models.player.helper.getPlayer(data.uid);
        if (player) {
            let oldSaltPassword = this._createSalt(player.username + player.password);
            if (oldSaltPassword == player.password) {
                let newSaltPassword = this._createSalt(player.username + data.newPassword);
                player.password = newSaltPassword;
                await player.commit();
                return player;
            } else {
                throw ERROR_OBJ.PASSWORD_ERROR;
            }
        } else {
            throw ERROR_OBJ.USER_NOT_EXIST;
        }
    }

}

module.exports = WZGJUser;