const Bet = require('./bet');
const Parser = require('../../common/parser');
const betFieldConst = require('./betFieldConst');
const genRedisKey = require('../genRedisKey');
const betModel = require('./betModel');
const sqlConst = require('./sqlConst');
const MysqlHelper = require('../../common/mysqlHelper');
const ERROR_OBJ = require('../../../consts/error_code').ERROR_OBJ;
const _ = require('lodash');

class BetHelper {
    constructor(){
        this._mysqlHelper = new MysqlHelper(betModel);
    }
    async exist(uid) {
        let exist = await redisConnector.hget(genRedisKey.getPlayerKey(betFieldConst.ID), uid);
        if (exist == null) {
            return false;
        }
        return true;
    }

    async createBet(uid, data) {
        if (uid == null || data == null) {
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

        for(let key in betModel){
            let item = betModel[key];
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
        let bet = new Bet(uid);
        for (let key in fields) {
            let cmd = bet.getCmd(key);
            if (cmd) {
                try {
                    let value = Parser.serializeValue(key, fields[key], bet);
                    bet.appendValue(key, value);
                    cmds.push([cmd, genRedisKey.getPlayerKey(key), uid, value]);
                } catch (e) {
                    e;
                }
            }
        }
        await redisConnector.multi(cmds);
        return bet;
    }

    async getBet(uid, fields) {
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
                cmds.push(['hget', genRedisKey.getPlayerKey(fields[i]), uid]);
            }
            let docs = await redisConnector.multi(cmds);
            let bet = new Bet(uid);
            for (let i = 0; i < fields.length; ++i) {
                try {
                    bet.appendValue(fields[i], docs[i]);
                } catch (e) {
                    e;
                }
            }
            return bet;
        } else {
            let doc = await redisConnector.hget(genRedisKey.getPlayerKey(fields[0]), uid);
            let bet = new Bet(uid);
            bet.appendValue(fields[0], doc);
            return bet;
        }
    }

    async delBet(uid) {
        if (uid == null) {
            throw ERROR_OBJ.PARAM_MISSING;
        }
        let cmds = [];
        sqlConst.MODEL_FIELDS.forEach(function (item) {
            cmds.push(['hdel', genRedisKey.getPlayerKey(item), uid]);
        });
        return await redisConnector.multi(cmds);
    }

    async getMysqlBet(uid, fields = []){
        return this._mysqlHelper.getTableRow(uid, fields);
    }

    async setMysqlBet(players){
        this._mysqlHelper.setTableRow(players);
    }
}

module.exports = new BetHelper();
