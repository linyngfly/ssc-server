const omelo = require('omelo');
const { RedisConnector, MysqlConnector } = require('../../database/dbclient');

class GameApp {
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

        logger.info('游戏服务启动成功');
    }

    stop() {
        redisConnector.stop();
        mysqlConnector.stop();
        logger.info('游戏服务关闭');
    }

    rpc(method, data, cb) {
        this[method](data, cb);
    }

    request(route, msg, session, cb) {
        if (this._interceptReq(route, msg, session, cb)) {
            return;
        }
        this._instance.request(route, msg, session, cb);
    }
}

module.exports = GameApp;