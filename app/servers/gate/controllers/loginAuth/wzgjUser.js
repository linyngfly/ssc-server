const _ = require('lodash');
const User = require('./user');
const models = require('../../../../models');
const ERROR_OBJ = require('../../../../consts/error_code').ERROR_OBJ;
const moment = require('moment');
const QUERY_UID_BY_OPENID = "SELECT `id` FROM `tbl_user` WHERE `openid`=? ";

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
        //TODO 暂时
        return;
        if(!this._codes[phone] || this._codes[phone] != code){
            throw ERROR_OBJ.PHONE_CODE_INVALID;
        }
    }

    async _queryAccount(uid) {
        let mysqlPlayer = await models.account.helper.getAccount2Mysql(uid);
        return await models.account.helper.createAccount(uid, mysqlPlayer);
    }

    async sendPhoneCode(phone){
        //TODO 短信接口发送短信
        this._codes[phone] = 353221;
        return {expires:60};
    }

    async isRegister(data){
        let openid = data.username;
        let uid = await redisConnector.hget(models.constants.MAP_OPENID_UID, openid);
        if(uid != null){
            return uid;
        }

        let rows = await mysqlConnector.query(QUERY_UID_BY_OPENID, [openid]);
        let row = rows && rows[0];
        if (row) {
            await this._queryAccount(row.id);
            await redisConnector.hset(models.constants.MAP_OPENID_UID, openid, row.id);
            return row.id;
        }
    }

    async _checkInviter(uid){
        try{
            let account = await models.account.helper.getAccount(uid, models.account.fieldConst.ROLE);
            if(account.role == 0){
                return false;
            }
        }catch (e) {
            return false;
        }

        return true;
    }

    async register(data) {
        //TODO 手机校验
        this._checkPhoneCode(data.username, data.code);

        let accountData = _.cloneDeep(data);
        let openid = data.username;
        accountData.phone = openid;
        accountData.openid = data.username;
        accountData.password = this._createSalt(data.username + data.password);

        // let uid = await this._genUID();
        // accountData.id = uid;
        let at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        accountData.created_at = at;
        accountData.updated_at = at;
        accountData.openid = openid;
        accountData.from_ip = data.ip;

        if(data.inviter != null && this._checkInviter(data.inviter)){
            accountData.inviter = data.inviter;
        }

        let account = await models.account.helper.createAccount(accountData);
        await redisConnector.hset(models.constants.MAP_OPENID_UID, openid, account.uid);

        return account.uid;
    }

    async login(data) {
        let account = await models.account.helper.getAccount(data.uid);
        data.account = account;
        await super.login(data);
        return account.toJSON();
    }

    async logout(data){
        let account = await models.account.helper.getAccount(data.uid);
        account.token = '';
        await account.commit();
    }

    _authCheck(data){
        let saltPassword = this._createSalt(data.username + data.password);
        if (saltPassword !== data.account.password) {
            throw ERROR_OBJ.USERNAME_PASSWORD_ERROR;
        }
    }

    async modifyPassword(data) {
        let account = await models.account.helper.getAccount(data.uid);
        if (account) {
            let oldSaltPassword = this._createSalt(account.username + account.password);
            if (oldSaltPassword == account.password) {
                let newSaltPassword = this._createSalt(account.username + data.newPassword);
                account.password = newSaltPassword;
                await account.commit();
                return account;
            } else {
                throw ERROR_OBJ.PASSWORD_ERROR;
            }
        } else {
            throw ERROR_OBJ.USER_NOT_EXIST;
        }
    }

}

module.exports = WZGJUser;