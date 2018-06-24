const omelo = require('omelo');
const {RedisConnector, MysqlConnector} = require('../../database').dbclient;
const queryGameEntry = require('./internal/queryGameEntry');
const utils = require('../../utils/utils');
const models = require('../../models');
const eventType = require('../../consts/eventType');
const serviceCtrl = require('../common/serviceCtrl');

class GateApp {
    async start() {
        this._redisConnector = new RedisConnector();
        let result = await this._redisConnector.start(omelo.app.get('redis'));
        if (!result) {
            process.exit(0);
            return;
        }
        this._mysqlConnector = new MysqlConnector();
        result = await this._mysqlConnector.start(omelo.app.get('mysql'));
        if (!result) {
            process.exit(0);
            return;
        }
        serviceCtrl.enableSysShutdow();
        this._redisConnector.sub(eventType.PLAYER_EVENT_INIT_MONEY, (event)=>{
            logger.error('忘记初始化金币变化：', event.money)
            models.account.modelDefine.money.def = Number(event.money);
        });

        await this._loadConfig();
        logger.info('网关服务启动成功');
    }

    stop() {
        redisConnector.stop();
        mysqlConnector.stop();
        logger.info('网关服务已经停止');
    }

    request(route, msg, session, cb) {
        this[route](msg, session, cb);
    }

    async c_query_entry(msg, session, cb) {
        try {
            let entry = await queryGameEntry.getEntry(msg);
            utils.invokeCallback(cb, null, entry);
        }catch(e){
            utils.invokeCallback(cb, e);
        }
    }

    async _loadConfig(){
        let rows = await mysqlConnector.query('SELECT * FROM `tbl_config` WHERE identify=? AND type=?',
            ['ssc', 'init_money']);

        if(!rows || !rows[0]){
            await mysqlConnector.query('INSERT INTO `tbl_config` (`identify`, `type`, `info`) ' +
                'VALUES(?,?,?) ON DUPLICATE KEY UPDATE identify=VALUES(identify), type=VALUES(type), info=VALUES(info)',
                ['ssc', 'init_money', JSON.stringify({money:models.account.modelDefine.money.def})]);
        }else {
            let info = JSON.parse(rows[0].info);
            let money = Number(info.money);
            if(!Number.isNaN(money)){
                models.account.modelDefine.money.def = money;
            }
        }
    }

}

module.exports = GateApp;