const omelo = require('omelo');
const {RedisConnector, MysqlConnector} = require('../../database/dbclient');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;
const plugins = require('../../plugins');
console.log('plugins=',plugins);

class LotteryApp {
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

        // for(let mainType in plugins){
        //     let SUB_GAMES = plugins[mainType].SUB_GAMES;
        //     if(!SUB_GAMES){
        //         plugins[mainType].start();
        //         logger.info('启动主游戏', mainType);
        //     }else {
        //         for(let sub in SUB_GAMES){
        //             logger.info('启动子游戏', sub);
        //             logger.info('启动子游戏', SUB_GAMES);
        //             SUB_GAMES[sub].start();
        //
        //         }
        //     }
        // }
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
}

module.exports = LotteryApp;