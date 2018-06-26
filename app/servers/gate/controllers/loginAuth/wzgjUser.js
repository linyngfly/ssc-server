const _ = require('lodash');
const User = require('./user');
const utils = require('../../../../utils/utils');
const util = require('util');
const models = require('../../../../models');
const ERROR_OBJ = require('../../../../consts/error_code').ERROR_OBJ;
const moment = require('moment');
const QUERY_UID_BY_OPENID = "SELECT `id` FROM `tbl_user` WHERE `openid`=? ";
const httpclient = require('../../../../net/httpclient');

class WZGJUser extends User {
    constructor() {
        super();
        this._codes = new Map();
        this._sms = {
            timeout:300000,
            url:'http://118.31.17.45:8899/sms.aspx',
            userid:1126,
            account:'WZGJ',
            password:'wz123456',
            contentTemplate:'欢迎注册王者国际，你的验证码是:%s【王者国际】'
        };
    }

    getUserInfo(data) {
        return data;
    }

    _checkPhoneCode(phone, code){
        let codeInfo = this._codes.get(phone);
        if(!codeInfo || codeInfo.code!=code){
            throw ERROR_OBJ.PHONE_CODE_INVALID; 
        }

        if(Date.now() - codeInfo.time > this._sms.timeout){
            this._codes.delete(phone);
            throw ERROR_OBJ.PHONE_CODE_EXPIRES;
        }
    }

    async _queryAccount(uid) {
        let mysqlPlayer = await models.account.helper.getAccount2Mysql(uid);
        return await models.account.helper.setAccount(uid, mysqlPlayer);
    }

    async sendPhoneCode(phone){
        let code = utils.random_int_str(4);
        let content = util.format(this._sms.contentTemplate, code);
        let url = `${this._sms.url}?action=send&userid=${this._sms.userid}&account=${this._sms.account}&password=${this._sms.password}&mobile=${phone}&content=${encodeURIComponent(content)}&sendTime=&extno=`;
        logger.error('url=',url);
        let resp = await httpclient.getData(url);
        logger.error('sendPhoneCode resp=',resp.toString());

        this._codes.set(phone, {
            code:code,
            time:Date.now()
        });

        return {expires:this._sms.timeout};
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
            if(account.role == 1){
                return true;
            }
        }catch (err) {
            if(err == ERROR_OBJ.PLAYER_NOT_EXIST){
                let userData = await models.account.helper.getAccount2Mysql(uid, [models.account.fieldConst.ROLE]);
                if(userData && userData.role == 1){
                    return true;
                }
            }
        }
        return false;
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

        if(data.inviter != null){
            if(await this._checkInviter(data.inviter)){
                accountData.inviter = data.inviter;
            }else{
                throw ERROR_OBJ.INVITER_INVALID;
            }
        }

        let account = await models.account.helper.createAccount(accountData);
        await redisConnector.hset(models.constants.MAP_OPENID_UID, openid, account.uid);

        this._codes.delete(data.username);
        
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