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

    async rpc(method, msg) {
        this[method](msg);
    }

    async request(route, msg, session) {
        if(this[route]){
            return await this[route](msg, session);
        }
        this[route](msg, session);
    }

    c_enter(msg, session, cb) {
        let self = this;
        let _uid = msg.uid;
        let sessionService = omelo.app.get('sessionService');
        async.waterfall([
            function (cb) {
                sessionService.kick(_uid, function (err) {
                    if (err) {
                        cb(CONSTS.SYS_CODE.SYSTEM_ERROR);
                    } else {
                        cb();
                    }
                });
            },
            function (cb) {
                session.bind(_uid, function (err) {
                    if (err) {
                        cb(CONSTS.SYS_CODE.SYSTEM_ERROR);
                    } else {
                        session.on('closed', self._socketClose.bind(self));
                        cb();
                    }
                });
            }
        ], function (err) {
            utils.invokeCallback(cb, err);
            logger.info(`用户[${_uid}]登陆成功`);
        });
    }

    c_leave(msg, session, cb) {
        let sessionService = omelo.app.get('sessionService');
        sessionService && sessionService.kick(msg.uid);
        utils.invokeCallback(cb, null);
    }
}

module.exports = GameApp;