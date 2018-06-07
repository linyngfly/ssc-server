const Account = require('./account');
const Parser = require('../../common/parser');
const accountFieldConst = require('./accountFieldConst');
const genRedisKey = require('../genRedisKey');
const accountModel = require('./accountModel');
const sqlConst = require('./sqlConst');
const MysqlHelper = require('../../common/mysqlHelper');
const constants = require('../constants');
const ERROR_OBJ = require('../../../consts/error_code').ERROR_OBJ;
const _ = require('lodash');

class AccountHelper {
    constructor(){
        this._mysqlHelper = new MysqlHelper(accountModel, sqlConst);
    }
    async exist(uid) {
        let exist = await redisConnector.hget(genRedisKey.getAccountKey(accountFieldConst.USERNAME), uid);
        if (exist == null) {
            return false;
        }
        return true;
    }

    async _genUID(){
        return await redisConnector.incr(constants.UID_COUNTER);
    }

    async createAccount(data) {
        if (data == null) {
            throw ERROR_OBJ.PARAM_MISSING;
        }

        let fields = {};
        if (data instanceof Array) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                for (let key in item) {
                    fields[key] = item[key];
                }
            }
        } else {
            fields = data;
        }

        if (Object.keys(fields).length == 0) {
            return;
        }

        for(let key in accountModel){
            let item = accountModel[key];
            if(item.require){
                if(null == fields[key]){
                    throw ERROR_OBJ.PARAM_MISSING;
                }
            }
            if(fields[key] == null){
                if(item.type == 'object'){
                    fields[key] = _.cloneDeep(item.def);
                }else {
                    fields[key] = item.def;
                }
            }
        }

        let cmds = [];
        let uid = await this._genUID();
        fields.id = uid;
        let account = new Account(uid);
        for (let key in fields) {
            let [cmd] = account.getCmd(key) || [];
            if (cmd) {
                try {
                    let value = Parser.serializeValue(key, fields[key], account);
                    account.appendValue(key, value);
                    cmds.push([cmd, genRedisKey.getAccountKey(key), uid, value]);
                } catch (e) {
                    e;
                }
            }
        }
        await redisConnector.multi(cmds);
        return account;
    }

    async getAccount(uid, fields) {
        if (uid == null) {
            throw ERROR_OBJ.PARAM_MISSING;
        }

        let isHave = await this.exist(uid);
        if (!isHave) {
            throw ERROR_OBJ.PLAYER_NOT_EXIST;
        }

        if (!fields || fields.length == 0) {
            fields = sqlConst.MODEL_FIELDS;
        }

        if (fields.length > 1) {
            let cmds = [];
            for (let i = 0; i < fields.length; i++) {
                cmds.push(['hget', genRedisKey.getAccountKey(fields[i]), uid]);
            }
            let docs = await redisConnector.multi(cmds);
            let account = new Account(uid);
            for (let i = 0; i < fields.length; ++i) {
                try {
                    account.appendValue(fields[i], docs[i]);
                } catch (e) {
                    e;
                }
            }
            return account;
        } else {
            let doc = await redisConnector.hget(genRedisKey.getAccountKey(fields[0]), uid);
            let account = new Account(uid);
            account.appendValue(fields[0], doc);
            return account;
        }
    }

    async delAccount(uid) {
        if (uid == null) {
            throw ERROR_OBJ.PARAM_MISSING;
        }
        let cmds = [];
        sqlConst.MODEL_FIELDS.forEach(function (item) {
            cmds.push(['hdel', genRedisKey.getAccountKey(item), uid]);
        });
        return await redisConnector.multi(cmds);
    }

    async getAccount2Mysql(uid, fields = []){
        return await this._mysqlHelper.getTableRow(uid, fields);
    }

    async setAccount2Mysql(players){
        return await this._mysqlHelper.setTableRow(players);
    }
}

module.exports = new AccountHelper();
