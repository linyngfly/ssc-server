const Cmd = require('./cmd');
class SSCCmd extends Cmd {
    constructor() {
        super();
        this.initReq();
        this.initPush();
        this.initRemote();
    }

    initReq() {
        super.initReq();

        /**
         * 心跳协议
         * @type {{}}
         */
        this._req.heartbeat = {
            route: 'game.sscHandler.c_heartbeat',
            msg: {},
            res: {}
        };
        /**
         * 进入游戏
         * @type {{route: string, msg: {}, res: {}}}
         */
        this._req.enter = {
            route: 'game.sscHandler.c_enter',
            msg: {},
            res: {}
        };
        /**
         * 离开游戏
         * @type {{route: string, msg: {}, res: {}}}
         */
        this._req.leave = {
            route: 'game.sscHandler.c_leave',
            msg: {},
            res: {}
        };
        /**
         * 玩家投注
         * @type {{route: string, msg: {betData: string}, resp: {}}}
         */
        this._req.bet = {
            route: 'game.sscHandler.c_bet',
            msg: {
                betData:'大100'
            },
            resp: {}
        };

        this._req.unBet = {
            route: 'game.sscHandler.c_unBet',
            msg: {},
            res: {}
        };
    }

    initPush() {
        super.initPush();

        this._push.bet = {
            route: 's_bet',
            msg: {},
        };

        this._push.unBet = {
            route: 's_unBet',
            msg: {},
        };
    }

    initRemote() {
        super.initRemote();
        this._rpc.enterGame = {
            route: 'rpc_enter_game',
            msg: {
                mode: '',
                scene: 'scene_fish_1',
                sid: 'connector-server-1'
            }
        };
    }
}

module.exports = new SSCCmd();