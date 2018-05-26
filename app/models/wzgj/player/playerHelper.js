const Player = require('./player');
const Parser = require('../../common/parser');
const playerFieldConst = require('./playerFieldConst');
const genRedisKey = require('../genRedisKey');
const playerModel = require('./playerModel');
const ERROR_OBJ = require('../../../consts/error_code').ERROR_OBJ;

class PlayerHelper {
    async exist(uid) {
        let exist = await redisConnector.hget(genRedisKey.getPlayerKey(playerFieldConst.USERNAME), uid);
        if (exist == null) {
            return false;
        }
        return true;
    }

    async createPlayer(uid, data) {
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

        for(let key in playerModel){
            let item = playerModel[key];
            if(item.require){
                if(null == fields[key]){
                    throw ERROR_OBJ.PARAM_MISSING;
                }
            }
        }

        let cmds = [];
        let player = new Player(uid);
        for (let key in fields) {
            let cmd = player.getCmd(key);
            if (cmd) {
                try {
                    let value = Parser.serializeValue(key, fields[key], player);
                    player.appendValue(key, value);
                    cmds.push([cmd, genRedisKey.getPlayerKey(key), uid, value]);
                } catch (e) {
                    e;
                }
            }
        }
        await redisConnector.multi(cmds);
        return player;
    }

    async getPlayer(uid, fields) {
        if (uid == null) {
            throw ERROR_OBJ.PARAM_MISSING;
        }

        let isHave = await this.exist(uid);
        if (!isHave) {
            throw ERROR_OBJ.PLAYER_NOT_EXIST;
        }

        if (!fields || fields.length == 0) {
            fields = PlayerHelper.MODEL_FIELDS;
        }

        if (fields.length > 1) {
            let cmds = [];
            for (let i = 0; i < fields.length; i++) {
                cmds.push(['hget', genRedisKey.getPlayerKey(fields[i]), uid]);
            }
            let docs = await redisConnector.multi(cmds);
            let player = new Player(uid);
            for (let i = 0; i < fields.length; ++i) {
                try {
                    player.appendValue(fields[i], docs[i]);
                } catch (e) {
                    e;
                }
            }
            return player;
        } else {
            let doc = await redisConnector.hget(genRedisKey.getPlayerKey(fields[0]), uid);
            let player = new Player(uid);
            player.appendValue(fields[0], doc);
            return player;
        }
    }

    async delPlayer(uid) {
        if (uid == null) {
            throw ERROR_OBJ.PARAM_MISSING;
        }
        let cmds = [];
        PlayerHelper.MODEL_FIELDS.forEach(function (item) {
            cmds.push(['hdel', genRedisKey.getPlayerKey(item), uid]);
        });
        return await redisConnector.multi(cmds);
    }
}

PlayerHelper.MODEL_FIELDS = Object.keys(playerModel);

module.exports = new PlayerHelper();
