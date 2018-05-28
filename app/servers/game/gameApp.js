const omelo = require('omelo');
const { RedisConnector, MysqlConnector } = require('../../database/dbclient');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;

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
        await this[route](msg, session);
    }

    c_enter(msg, session) {
        let self = this;
        let sessionService = omelo.app.get('sessionService');

        return new Promise(function (resolve, reject) {
            sessionService.kick(msg.uid, function () {
                session.bind(msg.uid, function (err) {
                    if(err){
                        reject(err);
                        return;
                    }
                    session.on('closed', self.close.bind(self));
                    //TODO 处理校验玩家要加入的游戏类型是否支持
                    resolve();
                    logger.info(`用户[${msg.uid}]登陆成功`);
                });
            });
        });
    }

    c_leave(msg, session) {
        session.uid;
        let sessionService = omelo.app.get('sessionService');
        sessionService && sessionService.kick(msg.uid);
        utils.invokeCallback(cb, null);
    }

    close(session, reason) {
        if (!session || !session.uid) {
            return;
        }
        let uid = session.uid;
        logger.info(`用户[${uid}] 网络连接断开`, reason);
    }
}

module.exports = GameApp;