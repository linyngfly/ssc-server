const omelo = require('omelo');
const {RedisConnector, MysqlConnector} = require('../../database/dbclient');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;
const plugins = require('../../plugins');
console.log('plugins=',plugins);

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

        for(let mainType in plugins){
            let SUB_GAMES = plugins[mainType].SUB_GAMES;
            if(!SUB_GAMES){
                plugins[mainType].start();
                logger.info('启动主游戏', mainType);
            }else {
                for(let sub in SUB_GAMES){
                    logger.info('启动子游戏', sub);
                    logger.info('启动子游戏', SUB_GAMES);
                    SUB_GAMES[sub].start();

                }
            }
        }
        logger.info('游戏服务启动成功');
    }

    stop() {
        redisConnector.stop();
        mysqlConnector.stop();
        logger.info('游戏服务关闭');
    }

    async rpc(method, msg) {
        if(this[method]){
            return this[method](msg);
        }
        await plugins[msg.gameType].rpc(route, msg);
    }

    async request(route, msg, session) {
        if (this[route]) {
            return await this[route](msg, session);
        }
        await plugins[session.get('gameType')].request(route, msg, session);
    }

    c_enter(msg, session) {
        let self = this;
        let sessionService = omelo.app.get('sessionService');
        return new Promise(function (resolve, reject) {
            sessionService.kick(msg.uid, () => {
                session.bind(msg.uid, (err) => {
                    if (err) {
                        logger.error('session.bind err=', err);
                        reject(ERROR_OBJ.NETWORK_ERROR);
                        return;
                    }
                    session.on('closed', self.close.bind(self));
                    //TODO 处理校验玩家要加入的游戏类型是否支持
                    let mainType = msg.mainType;
                    let subType = msg.subType;
                    if (plugins[mainType] && subType && plugins[mainType][subType]) {
                        session.set('mainType', mainType);
                        session.set('subType', subType);
                        session.pushAll((err) => {
                            if (err) {
                                logger.error('session.pushAll err=', err);
                                reject(ERROR_OBJ.NETWORK_ERROR);
                                return;
                            }
                            resolve();
                            logger.info(`用户[${msg.uid}]登陆成功`);
                        })
                    }else {
                        reject(ERROR_OBJ.NOT_SUPPORT_GAME_TYPE);
                    }
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