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
            msg: {
                mainType:'ssc',
                subType:'lucky28',
                token:'afsdfaffsa2342',
            },
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
            resp: {
                money:100
            }
        };

        this._req.unBet = {
            route: 'game.sscHandler.c_unBet',
            msg: {
                id:1,
            },
            res: {
                money:100
            }
        };

        /**
         * 获取下期投注数据
         * @type {{route: string, msg: {}, res: {}}}
         */
        this._req.myBetOrder = {
            route: 'game.sscHandler.c_myBetOrder',
            msg: {},
            res: {}
        };

        this._req.myBetResult = {
            route: 'game.sscHandler.c_myBetResult',
            msg: {},
            res: {}
        };

        /**
         * 获取大厅最近投注信息
         * @type {{route: string, msg: {}, res: {}}}
         */
        this._req.getBets = {
            route: 'game.sscHandler.c_getBets',
            msg: {},
            res: {}
        };

        this._req.chat = {
            route: 'game.sscHandler.c_chat',
            msg: {
                type: 0, //0 文本 1图片 2语音
                content: '', //对应类型的自定义内容,
                tid:-1, //-1 广播，其他则为私聊消息
            },
            res: {}
        };

        /**
         * 获取大厅最近聊天信息
         * @type {{route: string, msg: {}, res: {}}}
         */
        this._req.getChats = {
            route: 'game.sscHandler.c_getChats',
            msg: {
            },
            res: {}
        };

        /**
         * 获取大厅最近开奖信息
         * @type {{route: string, msg: {}, res: {}}}
         */
        this._req.getLotterys = {
            route: 'game.sscHandler.c_getLotterys',
            msg: {},
            res: {}
        };
    }

    initPush() {
        super.initPush();

        this._push.enter = {
            route: 's_enter',
            msg: {
                nickname:'咸鱼也有梦'
            },
        };

        this._push.leave = {
            route: 's_leave',
            msg: {
                nickname:'咸鱼也有梦'
            },
        };

        this._push.bet = {
            route: 's_bet',
            msg: {
                data:{},
                ext:{

                }
            },
        };

        this._push.unBet = {
            route: 's_unBet',
            msg: {
                data:{},
                ext:{

                }
            },
        };

        this._push.chat = {
            route: 's_chat',
            msg: {
                data:{},
                ext:{
                }
            },
        };

        this._push.countdown = {
            route: 's_countdown',
            msg: {
                data:{},
                ext:{
                }
            },
        };

        this._push.betResult = {
            route: 's_betResult',
            msg: {
            },
        };

        this._push.openLottery = {
            route: 's_openLottery',
            msg: {
            },
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