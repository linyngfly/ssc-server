const omelo = require('omelo');
const {RedisConnector, MysqlConnector} = require('../../database/dbclient');
const taskPool = require('../../utils/task/taskPool');
const AccountSync = require('./task/accountSync');
const BetSync = require('./task/betSync');
const AccountKick = require('./task/accountKick');
const taskConf = require('./config/task');

class R2mSyncApp {
    constructor(){}

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

        this._addTask();
        logger.info('REDIS数据同步服启动成功');
    }

    stop() {
        taskPool.removeTask();
        redisConnector.stop();
        mysqlConnector.stop();
        logger.info('REDIS数据同步服关闭');
    }

    _addTask() {
        let accountSync = new AccountSync(taskConf.accountSync);
        let betSync = new BetSync(taskConf.betSync);
        // let accountKick = new AccountKick(taskConf.accountKick);
        taskPool.addTask('userSync', accountSync);
        taskPool.addTask('betSync', betSync);
        // taskPool.addTask('userKick', accountKick);
    }
}

module.exports = R2mSyncApp;