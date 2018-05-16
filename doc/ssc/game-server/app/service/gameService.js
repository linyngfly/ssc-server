var logger = require('pomelo-logger').getLogger(__filename);
var EventEmitter = require('events').EventEmitter;
var bearcat = require('bearcat');
var pomelo = require('pomelo');
var Answer = require('../../../shared/answer');
var Code = require('../../../shared/code');
var defaultConfigs = require('../../../shared/config/sysParamConfig.json');

var GameService = function () {
    this.id = 0;
    this.noticeTickCount = 0; // player score rank
    this.countdownCount = 0;
    this.players = {};
    this.trusteePlayers = {};
    this.entities = {};
    this.channel = null;
    this.globalChannel = null;
    this.consts = null;
    this.globalEntityId = 0;
    this.platformTypeBet = new Map();
    this.winners = [];
    this.intervalId = 0;
    this.gameId = -1;
    this.openingPeriod = null;
};

/**
 * Init areas
 * @param {Object} opts
 * @api public
 */
GameService.prototype.init = function () {
    this.gameId = 1001;//pomelo.app.getCurServer().gameId+1000;

    //logger.error('!!!!!!!!!!!!init!!!!!!!!!!!!!!',pomelo.app.getCurServer().gameId);

    var opts = this.dataApiUtil.area().findById(1);
    this.id = opts.id;
    this.generateGlobalLottery();
    this.daoUser.updateAllOfline();
    //初始化系統參數配置
    //logger.error("yyyyyyyyyyyyyyyyyyyyyyyyyyyyy",this.gameId);
    var self = this;
    this.daoConfig.initPlatformParam(defaultConfigs, function (err, result) {
        if(!err && !!result){
            self.sysConfig.setConfigs(result);
            self.run();
            logger.info('平台参数配置成功', result);
            return;
        }
        logger.error('平台参数配置获取失败，系统无法工作');
    });

    //logger.error("yyyyyyyyyyyyyyyyyyyyyyyyyyyyy",this.gameId);
    let configs = pomelo.app.get('redis');
    this.redisApi.init(configs);

    this.platformBet.init(this.redisApi);

    logger.error("yyyyyyyyyyyyyyyyyyyyyyyyyyyyy",this.gameId);
    this.redisApi.sub('openLottery', function (msg) {
       logger.error('~~~~~~~~~~openLottery~~~~~~~~~~~~~`', msg);
        if(self.openingPeriod === msg.period){
            logger.error('~~~~~~~~~~openLottery~开奖信息已经获取到啦~~~~~~~~~~~~`', pomelo.app.getCurServer().gameId);
            return;
        }
        logger.error('~~~~~~~~~~openLottery~开奖信息已经获取到啦~~~~~~~~~~~~`', pomelo.app.getCurServer().gameId);
        self.openingPeriod = msg.period;
        self.openLottery(msg.period, msg.numbers);
    });

    this.redisApi.sub('restoreBets', function (msg) {
       logger.error('~~~~~~~~~~restoreBets~~~~~~~~~~~~~`', msg);
        let player = self.getPlayer(msg.playerId);
        if(player){
            player.restoreBets(msg.bets);
            logger.error('~~~~~~~~~~restoreBets~~~1111~~~~~~~~~~`', msg.bets);
        }
        player = self.getTrusteePlayer(msg.playerId);
        if(player){
            player.restoreBets(msg.bets);
            logger.error('~~~~~~~~~~restoreBets~~~2222~~~~~~~~~~`', msg.bets);
        }
    });

    this.redisApi.sub('revertBets', function (msg) {
       logger.error('~~~~~~~~~~revertBets~~~~~~~~~~~~~`', msg);
        let player = self.getPlayer(msg.playerId);
        if(player){
            player.revertBets(msg.bets);
        }
        player = self.getTrusteePlayer(msg.playerId);
        if(player){
            player.revertBets(msg.bets);
        }
    });

    this.redisApi.sub('recharge', function (msg) {
     //   logger.error('~~~~~~~~~~recharge~~~~~~~~~~~~~`', msg);
        //在线用户及时到帐
        let player = self.getPlayer(msg.uid);
        //if (!!player) {
        if (!!player) {
            player.backendRechare(msg.money);
            player.defineNotify(self.consts.MsgNotifyType.RECHARGE, {money:msg.money});
        }
    });


    this.redisApi.sub('cashHandler', function (msg) {
      //  logger.error('~~~~~~~~~~cashHandler~~~~~~~~~~~~~`', msg);
        var player = self.getPlayer(msg.uid);
        if (!!player) {
            player.defineNotify(self.consts.MsgNotifyType.CASHOK, {money:msg.money});
        }
    });

    this.redisApi.sub('restoreRechargeMoney', function (msg) {
        //在线用户及时到帐
      //  logger.error('~~~~~~~~~~restoreRechargeMoney~~~~~~~~~~~~~`', msg);
        var player = self.getPlayer(msg.uid);
        if (!!player) {
            player.backendRechare(msg.money);
            player.defineNotify(self.consts.MsgNotifyType.CASHFAIL, {money:msg.money});
        }
    });

    this.redisApi.sub('setConfigs', function (msg) {
        self.sysConfig.setConfigs(msg.configs);
        logger.info('GameService平台参数配置更新');
    });

    this.redisApi.sub('pinCodeUpdate', function (msg) {
        let player = self.getPlayer(msg.playerId);
        if(player){
            logger.info('用户支付密码已经更新');
            player.pinCode = msg.pinCode;
        }
    });
};

GameService.prototype.run = function () {
    setInterval(this.tick.bind(this), 100);
}

GameService.prototype.tick = function () {
    // return;
    this.countdown();
    this.notice();
};

GameService.prototype.updateLatestBets = function (item) {
    let self = this;
    this.redisApi.cmd('incr', null, this.consts.BET_ID, null, function (err, betId) {
        let index = betId[0];
        self.redisApi.cmd('hset', self.consts.BET_TABLE, index%self.consts.BET_MAX, JSON.stringify(item), function (err, result) {
            if(err){
                logger.error('bet hset ', err, result);
            }
        });
    });
};

GameService.prototype.getLatestBets = function (cb) {
    let self = this;
    this.redisApi.cmd('hvals', this.consts.BET_TABLE, null, null, function (err, result) {
        //logger.error('@@@@@@@@@@@@@@@@@@@@@@@@@ getLatestBets ', err, result);
        if(err){
            self.utils.invokeCallback(cb, Code.DBFAIL);
            return;
        }

        let betItems = [];
        for(let item of result[0]){
            betItems.push(JSON.parse(item));
        }

        betItems.sort(function (a,b) {
            return b.betTime - a.betTime;
        });

        self.utils.invokeCallback(cb, null, betItems);
    });
};

GameService.prototype.winnerNotice = function () {
    if(this.winners.length > 0){
        this.getLottery().winnerNotice(this.winners.pop());
    }
    else {
        clearInterval(this.intervalId);
        this.intervalId = 0;
    }
};

// 系统开奖
GameService.prototype.openLottery = function (period, numbers) {
    this.winners = [];
    var openCodeResult = this.calcOpenLottery.calc(numbers);
    var parseResult = [];
    for (let item of openCodeResult) {
        parseResult.push(item);
    }
    var self=this;
    this.getLottery().publishParseResult(parseResult);
    for (var id in this.players) {
        var winner = this.getEntity(this.players[id]).openCode(period, openCodeResult, numbers);
        if(!!winner){
            this.winners.push(winner);
        }
    }

    for (var id in this.trusteePlayers) {
        var winner = this.trusteePlayers[id].openCode(period, openCodeResult, numbers);
        if(!!winner){
            this.winners.push(winner);
        }
    }

    this.trusteePlayers = {};
    this.platformBet.resetBet();

    if(this.intervalId != 0){
        clearInterval(this.intervalId);
        this.intervalId = 0;
    }

    this.intervalId = setInterval(this.winnerNotice.bind(this), 2000);

    //和
    if(numbers[0]===numbers[4]){
        this.daoBets.refund(period,function(err,result){
            if (!err) {
                if (result) {
                    for(var i=0;i<result.length;i++){
                        
                        logger.error('uid:'+result[i].uid);
                        logger.error('money:'+result[i].money);
                        var uid=result[i].uid;
                        var money=result[i].money;

                        self.daoUser.updateAccountAmount(Number(uid),money,function(err,res){
                            if(!err){
                                logger.error('success');
                            }
                            
                        })
                    } 
                }
            }

        });
    
    }
};

GameService.prototype.canBetNow = function () {
    if(this.getLottery().getTickCount() < this.consts.BetCloseTime){
        return false;
    }

    return true;
};

GameService.prototype.pubMsg = function (event, msg) {
    this.redisApi.pub(event, JSON.stringify(msg));
};


GameService.prototype.addAction = function (action) {
    return this.actionManager().addAction(action);
};

GameService.prototype.abortAction = function (type, id) {
    return this.actionManager().abortAction(type, id);
};

GameService.prototype.abortAllAction = function (id) {
    return this.actionManager().abortAllAction(id);
};

GameService.prototype.getChannel = function () {
    if (this.channel) {
        return this.channel;
    }
    this.channel = pomelo.app.get('channelService').getChannel('game_' + this.gameId, true);
    return this.channel;
};

GameService.prototype.getGlobalChannel = function () {
    if (this.globalChannel) {
        return this.globalChannel;
    }
    this.globalChannel = pomelo.app.get('globalChannelService');
    return this.globalChannel;
};

GameService.prototype.broadcastMessage = function (route, msg) {
    this.getGlobalChannel().pushMessage('connector', route, msg, this.gameId, {isPush: true});
};

/**
 * Add entity to game
 * @param {Object} e Entity to add to the game.
 */
GameService.prototype.addEntity = async function (e) {
    if (!e || !e.entityId) {
        return false;
    }

    //todo should add after filter
    ++e.loginCount;
    e.lastOnlineTime = Date.now();
    e.save();

    this.entities[e.entityId] = e;
    this.eventManager.addEvent(e);

    if (e.type === this.consts.EntityType.PLAYER) {

        this.getChannel().add(e.id, e.serverId);
        this.getGlobalChannel().add(this.gameId, e.id, e.serverId);

        if (!!this.players[e.id]) {
            logger.error('add player twice! player : %j', e);
        }

        e.setState(1);

        this.players[e.id] = e.entityId;

        if(!!this.trusteePlayers[e.id]){
            this.trusteePlayers[e.id].transferTask(e);
            delete this.trusteePlayers[e.id];
        }

        this.getLottery().publishCurLottery([{uid: e.id, sid: e.serverId}]);
        this.getLottery().initPublishParseResult([{uid: e.id, sid: e.serverId}]);

        let self = this;
        this.getLatestBets(function (err, bets) {
            //logger.error('~~~~~~~~~~~~~~~~~~~getLatestBets~~~~~~~~~~~~~~~~~~', bets)
            self.getLottery().initPublishLatestBets(bets, [{uid: e.id, sid: e.serverId}]);
        });

    }
    return true;
};


/**
 * 下期开奖倒计时
 */
GameService.prototype.countdown = function () {
    if (this.countdownCount >= 5) {
        this.getLottery().countdown();
        this.countdownCount = 0;
    }
    this.countdownCount++;

};

/**
 * 发布公告
 */
GameService.prototype.notice = function () {
    if (this.noticeTickCount >= 20 && this.intervalId === 0) {
        this.getLottery().publishNotice();
        this.noticeTickCount = 0;
    }
    this.noticeTickCount++;
};


/**
 * Remove Entity form game
 * @param {Number} entityId The entityId to remove
 * @return {boolean} remove result
 */
GameService.prototype.removeEntity = function (entityId) {
    var e = this.entities[entityId];
    if (!e) {
        return true;
    }

    if (e.type === this.consts.EntityType.PLAYER) {
        e.setState(0);
        // this.getChannel().leave(e.id, e.serverId);
        this.getChannel().leave(e.id, e.serverId);
        this.getGlobalChannel().leave(this.gameId, e.id, e.serverId);
        if(!e.isIdle()){
            this.trusteePlayers[e.id] = e;
        }
        delete this.players[e.id];
    }

    delete this.entities[entityId];
    return true;
};

/**
 * Get entity from game
 * @param {Number} entityId.
 */
GameService.prototype.getEntity = function (entityId) {
    return this.entities[entityId];
};

/**
 * Get entities by given id list
 * @param {Array} The given entities' list.
 */
GameService.prototype.getEntities = function (ids) {
    var result = [];
    for (var i = 0; i < ids.length; i++) {
        var entity = this.entities[ids[i]];
        if (entity) {
            result.push(entity);
        }
    }

    return result;
};

GameService.prototype.getAllPlayers = function () {
    var _players = [];
    var players = this.players;
    for (var id in players) {
        _players.push(this.entities[players[id]]);
    }

    return _players;
};

GameService.prototype.generateGlobalLottery = function () {
    var lotteryData = this.dataApiUtil.lottery().data;
    var t = bearcat.getBean('lottery', {
        kindId: lotteryData["1"].id,
        kindName: lotteryData["1"].name,
        imgId: lotteryData["1"].imgId,
    });
    t.gameService = this;
    this.globalEntityId = t.entityId;
    this.addEntity(t);
};

GameService.prototype.getLottery = function () {
    return this.entities[this.globalEntityId];
}

GameService.prototype.getAllEntities = function () {
    var r = {};
    var entities = this.entities;

    for (var id in entities) {
        r[id] = entities[id].toJSON();
    }

    return r;
    // return this.entities;
};

GameService.prototype.getPlayer = function (playerId) {
    var entityId = this.players[playerId];
    return this.entities[entityId];
};

GameService.prototype.getTrusteePlayer = function (playerId) {
    return this.trusteePlayers[playerId];
};

GameService.prototype.removePlayer = function (playerId) {
    var entityId = this.players[playerId];

    if (entityId) {
        delete this.players[playerId];
        this.removeEntity(entityId);
    }
};

GameService.prototype.entities = function () {
    return this.entities;
};

module.exports = {
    id: "gameService",
    func: GameService,
    props: [{
        name: "dataApiUtil",
        ref: "dataApiUtil"
    }, {
        name: "consts",
        ref: "consts"
    }, {
        name: "eventManager",
        ref: "eventManager"
    }, {
        name: "calcOpenLottery",
        ref: "calcOpenLottery"
    }, {
        name: "betLimitCfg",
        ref: "betLimitCfg"
    }, {
        name: "daoConfig",
        ref: "daoConfig"
    }, {
        name: "sysConfig",
        ref: "sysConfig"
    }, {
        name: "platformBet",
        ref: "platformBet"
    }, {
        name: "daoBets",
        ref: "daoBets"
    },{
        name: "calcIncome",
        ref: "calcIncome"
    },{
        name: "daoUser",
        ref: "daoUser"
    },
    {
        name: "daoRecord",
        ref: "daoRecord"
    }, {
        name:'redisApi',
        ref:'redisApi'
    }, {
        name:'utils',
        ref:'utils'
    }]
}
