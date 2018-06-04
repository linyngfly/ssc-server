const omelo = require('omelo');
const {RedisConnector, MysqlConnector} = require('../../database/dbclient');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;
const plugins = require('../../plugins');
const consts = require('../../consts/constants');
const omeloUtil = require('../common/omeloUtil');

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
            let SUB_GAMES = plugins[mainType];
            if(!SUB_GAMES){
                plugins[mainType].start();
                logger.error('启动主游戏', mainType);
            }else {
                for(let sub in SUB_GAMES){
                    logger.error('启动子游戏', sub);
                    // logger.error('启动子游戏', SUB_GAMES);
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
        await plugins[msg.gameType].rpc(method, msg);
    }

    async request(route, msg, session) {
        if (this[route]) {
            return await this[route](msg, session);
        }

        let game = this.getGame(session.get(consts.PLUGINS.MAIN), session.get(consts.PLUGINS.SUB));
        await game.request(route, msg, session);
    }

    getGame(main, sub){
        let game = null;
        if (main) {
            if(sub){
                game = plugins[main] && plugins[main][sub];
            }else {
                game = plugins[main];
            }
        }

        if(!game){
            throw ERROR_OBJ.NOT_SUPPORT_GAME_TYPE;
        }

        return game;
    }

    async c_enter(msg, session) {
        let game = this.getGame(msg.mainType, msg.subType);

        await omeloUtil.kick(msg.uid, 'login');
        await omeloUtil.bind(session, msg.uid);

        let kvs = {};
        kvs[consts.PLUGINS.MAIN] = msg.mainType;
        kvs[consts.PLUGINS.SUB] = msg.subType;
        kvs.token = msg.token;
        await omeloUtil.set(session, kvs);
        session.on('closed', this.close.bind(this));
        msg.sid = session.frontendId;
        await game.enter(msg);
        logger.info(`玩家[${msg.uid}]登录游戏[${msg.mainType}->${msg.subType}]成功`);
    }

    async c_leave(msg, session) {
        let game = this.getGame(session.get(consts.PLUGINS.MAIN), session.get(consts.PLUGINS.SUB));
        game.leave(msg);
        await omeloUtil.kick(msg.uid || session.uid, 'logout');
        logger.info(`玩家[${msg.uid}]登出游戏[${msg.mainType}->${msg.subType}]成功`);
    }

    close(session, reason) {
        let uid = session && session.uid;
        if(uid){
            let game = this.getGame(session.get(consts.PLUGINS.MAIN), session.get(consts.PLUGINS.SUB));
            game.setPlayerState(uid, consts.PLAYER_STATE.OFFLINE);
            logger.info(`玩家[${uid}],网络连接断开`, reason);
        }else {
            logger.info(`未知玩家,网络连接断开`, reason);
        }
    }
}

module.exports = GameApp;