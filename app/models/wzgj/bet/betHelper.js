const Bet = require('./bet');
const Parser = require('../../common/parser');
const betFieldConst = require('./betFieldConst');
const genRedisKey = require('../genRedisKey');
const betModel = require('./betModel');
const sqlConst = require('./sqlConst');
const MysqlHelper = require('../../common/mysqlHelper');
const constants = require('../constants');
const ERROR_OBJ = require('../../../consts/error_code').ERROR_OBJ;
const _ = require('lodash');

class BetHelper {
    constructor(){
        this._mysqlHelper = new MysqlHelper(betModel);
    }

    async exist(uid) {
        let exist = await redisConnector.hget(genRedisKey.getBetKey(betFieldConst.ID), uid);
        if (exist == null) {
            return false;
        }
        return true;
    }

    async _genId(){
        return await redisConnector.incr(constants.BET_ID_COUNTER);
    }


    async createBet(data) {
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
            return ERROR_OBJ.BET_DATA_INVALID;
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
        let id = await this._genId();
        fields.id = id;
        let bet = new Bet(id);
        for (let key in fields) {
            let [cmd] = bet.getCmd(key) || [];
            if (cmd) {
                try {
                    let value = Parser.serializeValue(key, fields[key], bet);
                    bet.appendValue(key, value);
                    cmds.push([cmd, genRedisKey.getBetKey(key), id, value]);
                } catch (e) {
                    e;
                }
            }
        }
        await redisConnector.multi(cmds);
        return bet;
    }

    async getBet(id, fields) {
        if (id == null) {
            throw ERROR_OBJ.PARAM_MISSING;
        }

        let isHave = await this.exist(id);
        if (!isHave) {
            throw ERROR_OBJ.PLAYER_NOT_EXIST;
        }

        if (!fields || fields.length == 0) {
            fields = sqlConst.MODEL_FIELDS;
        }

        if (fields.length > 1) {
            let cmds = [];
            for (let i = 0; i < fields.length; i++) {
                cmds.push(['hget', genRedisKey.getBetKey(fields[i]), id]);
            }
            let docs = await redisConnector.multi(cmds);
            let bet = new Bet(id);
            for (let i = 0; i < fields.length; ++i) {
                try {
                    bet.appendValue(fields[i], docs[i]);
                } catch (e) {
                    e;
                }
            }
            return bet;
        } else {
            let doc = await redisConnector.hget(genRedisKey.getBetKey(fields[0]), id);
            let bet = new Bet(id);
            bet.appendValue(fields[0], doc);
            return bet;
        }
    }

    async delBet(id) {
        if (id == null) {
            throw ERROR_OBJ.PARAM_MISSING;
        }
        let cmds = [];
        sqlConst.MODEL_FIELDS.forEach(function (item) {
            cmds.push(['hdel', genRedisKey.getBetKey(item), id]);
        });
        return await redisConnector.multi(cmds);
    }

    async getMysqlBet(id, fields = []){
        return this._mysqlHelper.getTableRow(id, fields);
    }

    async setMysqlBet(players){
        this._mysqlHelper.setTableRow(players);
    }
}

module.exports = new BetHelper();
