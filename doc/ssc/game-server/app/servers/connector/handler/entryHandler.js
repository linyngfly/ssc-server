var Code = require('../../../../../shared/code');
var async = require('async');
var bearcat = require('bearcat');
var logger = require('pomelo-logger').getLogger(__filename);
var Answer = require('../../../../../shared/answer');

var EntryHandler = function (app) {
    this.app = app;
    this.serverId = app.get('serverId').split('-')[2];
};

//管理员登录
EntryHandler.prototype.adminLogin = function (msg, session, next) {
    var token = msg.token, self = this;
    if (!token) {
        next(new Error('invalid entry request: empty token'), new Answer.NoDataResponse(Code.PARAMERROR));
        return;
    }

    var _playerId;
    async.waterfall([
        function (cb) {
            // auth token
            self.app.rpc.auth.authRemote.auth(session, token, cb);
        }, function (code, playerId, cb) {
            if (code.code !== Code.OK.code) {
                next(null, new Answer.NoDataResponse(code));
                return;
            }
            _playerId = playerId;
            self.app.get('sessionService').kick(playerId, cb);
        },
        function (cb) {
            session.bind(_playerId, cb);
        },function (cb) {
            session.on('closed', onAdminLeave.bind(null, self.app));
            session.pushAll(cb);
        }
    ], function (err) {
        if (err) {
            next(err, new Answer.NoDataResponse(Code.FAIL));
            return;
        }
        next(err, new Answer.NoDataResponse(Code.OK));
    });
};

// 后台充值operator, bankInfo
EntryHandler.prototype.recharge = function (msg, session, next) {
    if(!msg.money || !msg.uid || !msg.operator){
        next(null, new Answer.NoDataResponse(Code.PARAMERROR));
        return;
    }
    //uid":"3","money":"10000","operator":"admin","bankInfo":"
    var money = parseInt(msg.money, 10);
    if(isNaN(money)){
        next(null, new Answer.NoDataResponse(Code.PARAMERROR));
        return;
    }

    logger.error('@@@@@@@@@@@@@@@@@@@@@@@@ EntryHandler.recharge', msg);
    this.app.rpc.game.playerRemote.recharge(session, Number(msg.uid), money, msg.operator, msg.bankInfo, function (err, result) {
        next(err, result);
    });
};

// 后台提现确认
EntryHandler.prototype.cashHandler = function (msg, session, next) {
    if(!msg.uid || !msg.orderId || !msg.status || !msg.operator || !msg.bankInfo || !(!!msg.status && (msg.status == this.consts.RecordOperate.OPERATE_OK ||
        msg.status == this.consts.RecordOperate.OPERATE_ABORT))){
        next(null, new Answer.NoDataResponse(Code.PARAMERROR));
        return;
    }
   // "uid":"4","orderId":"1","status":"2","operator":"admin","bankInfo":"zhifubao"
   // {"uid":"4","orderId":"1","status":"2","operator":"admin","bankInfo":"test"}
    logger.error('@@@@@@@@@@@@@@@@@@@@@@@@ EntryHandler.cashHandler', msg);
    this.app.rpc.game.playerRemote.cashHandler(session, Number(msg.uid), Number(msg.orderId), Number(msg.status), msg.operator, msg.bankInfo, function (err, result) {
        next(null, result);
    });
};

//后台配置修改
EntryHandler.prototype.setConfig = function (msg, session, next) {
    if(!msg.configs){
        next(null, new Answer.NoDataResponse(Code.PARAMERROR));
        return;
    }

    this.app.rpc.game.playerRemote.setConfig(session, msg.configs, function (err, result) {
        next(err, result);
    });
};

//玩家控制
EntryHandler.prototype.playerCtrl = function (msg, session, next) {
    if(!msg.uid || !msg.ctrl){
        next(null, new Answer.NoDataResponse(Code.PARAMERROR));
        return;
    }
    var self = this;
    switch (Number(msg.ctrl.code)){
        case this.consts.PlayerCtrl.forbidTalk:
            this.app.rpc.chat.chatRemote.userForbidTalk(session, Number(msg.uid), msg.ctrl.operate, next);
            break;
        case this.consts.PlayerCtrl.active:
            if(!msg.ctrl.operate){
                this.app.connectorService.pub('kick', {uid:msg.uid});
                //self.app.get('sessionService').kick(Number(msg.uid), '帐号冻结');
                logger.error('~~~~~~~~~playerCtrl~~~~~~~~~~帐号冻结剔除用户');
            }
            break;
        default:
            break;
    }

    this.app.rpc.game.playerRemote.playerCtrl(session, Number(msg.uid), msg.ctrl, next);
};

// 后台手动开奖
EntryHandler.prototype.backendOpenCode = function (msg, session, next) {
    if(!msg.period || !msg.numbers){
        next(null, new Answer.NoDataResponse(Code.PARAMERROR));
        return;
    }

    let self = this;
    this.app.rpc.lottery.lotteryRemote.checkPeriodValid(session, msg.period, function (err, result) {
        if(!result){
            next(null, new Answer.NoDataResponse(Code.GAME.FA_PERIOD_INVALID));
            return;
        }

        self.app.rpc.restore.restoreRemote.manualOpen(session, msg.period, msg.numbers, next);
    });
};

//登录
EntryHandler.prototype.login = function (msg, session, next) {
    logger.error('connector:',this.app.getCurServer());

    var token = msg.token, self = this;
    if (!token) {
        next(new Error('invalid entry request: empty token'),new Answer.NoDataResponse(Code.PARAMERROR));
        return;
    }

    var _player, _playerJoinResult;
    async.waterfall([
        function (cb) {
            // auth token
            self.app.rpc.auth.authRemote.auth(session, token, cb);
        }, function (code, playerId, cb) {
            if (code.code !== Code.OK.code) {
                next(null, new Answer.NoDataResponse(code));
                return;
            }
            self.daoUser.getPlayer(playerId, cb);
        },function (player, cb) {
            if (!player) {
                next(null,new Answer.NoDataResponse(Code.USER.FA_USER_NOT_EXIST));
                return;
            }
            _player = player;
            self.app.get('sessionService').kick(_player.id, cb);
        },function (cb) {
            session.bind(_player.id, cb);
        },function (cb) {
            session.set('roleName', _player.roleName);
            session.on('closed', onUserLeave.bind(null, self.app));
            session.pushAll(cb);
        },function (cb) {
            self.app.rpc.game.playerRemote.playerJoin(session, _player.id, session.frontendId, cb);
        },function (playerJoinResult, cb) {
            if(playerJoinResult.result.code != Code.OK.code){
                cb(playerJoinResult.result);
            }
            else {
                _playerJoinResult = playerJoinResult.data.player;
                cb(null, playerJoinResult.data.gameId);
            }
        },function (gameId, cb) {
            self.app.rpc.chat.chatRemote.join(session, _player.id, session.frontendId, _player.roleName, gameId, function (result) {
                if(result.code != Code.OK.code){
                    cb('加入聊天服务器失败');
                }
                else {
                    logger.error('@@@@@@@@@@@@@@@@@@@@@@gameId:', gameId);
                    session.set('roomId', gameId);
                    session.push('roomId', cb);
                }
            });
        }
    ], function (err) {
        if (err) {
            logger.error('用户登录失败 err:',err);
            next(err, new Answer.NoDataResponse(Code.FAIL));
            return;
        }

        logger.error('用户登录成功 uid:',session.uid,'name:', session.get('roleName'));
        next(null, new Answer.DataResponse(Code.OK, _playerJoinResult));
    });
};

//注销
EntryHandler.prototype.logout = function (msg, session, next) {
    onUserLeave(this.app, session, '用户主动推出');
};

//释放用户
var onUserLeave = function (app, session, reason) {
    if(!session || !session.uid) {
        return;
    }
    app.rpc.game.playerRemote.playerLeave(session, session.uid, null);
    app.rpc.chat.chatRemote.leave(session, session.uid, session.get('roomId'),null);
    logger.error('@@@@@@@@@@@@@@@@@@@@@@用户退出@@@@@@@@@@@@@@@@@@uid:',session.uid,'name:', session.get('roleName'));
};

//后台管理员离开
var onAdminLeave = function (app, session, reason) {
    if (session && session.uid) {
        app.get('sessionService').kick(session.uid, null);
    }
};

module.exports = function (app) {
    return bearcat.getBean({
        id: "entryHandler",
        func: EntryHandler,
        args: [{
            name: "app",
            value: app
        }],
        props: [
            {name:"daoUser", ref:"daoUser"},
            {name:"dataApiUtil", ref:"dataApiUtil"},
            {name:"utils", ref:"utils"},
            {name:"consts", ref:"consts"}
        ]
    });
};