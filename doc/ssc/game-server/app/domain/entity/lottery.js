const bearcat = require('bearcat');
const util = require('util');
const pomelo = require('pomelo');
const logger = require('pomelo-logger').getLogger(__filename);
const async = require('async');

/**
 * Initialize a new 'Treasure' with the given 'opts'.
 * Item inherits Entity
 *
 * @param {Object} opts
 * @api public
 */

function Lottery(opts) {
    this.opts = opts;
    this.imgId = opts.imgId;
    this.consts = null;
    this.tickCount = 0;
    this.lastTickCount = 0;
    this.tickPeriod = 0;
    this.lastTickTime = 0;
    this.lastLottery = null; //最近开奖
    this.nextLottery = null; //下期彩票
    this.preLottery = null; //上期开奖
    this.identify = null; //彩票标志
}

Lottery.prototype.init = function () {
    this.type = this.consts.EntityType.LOTTERY;
    var Entity = bearcat.getFunction('entity');
    Entity.call(this, this.opts);
    this._init();

    var self = this;
    let configs = pomelo.app.get('redis');
    this.redisApi.init(configs);
    this.redisApi.sub('tickTimeSync', function (msg) {
        self.setTickCount(Number(msg.tick));
    });

    this.redisApi.sub('publishLottery', function (msg) {
        logger.error('~~~~~~~~~~publishLottery~~~~~~~~~~~~~`', msg);
        self.publishLottery(msg);
    });
};

Lottery.prototype.pubMsg = function (event, msg) {
    this.redisApi.pub(event, JSON.stringify(msg));
};

// proof tick timer
Lottery.prototype.setTickCount = function (tick) {
    this.tickCount = tick;
    this.lastTickTime = Date.now();
};

//发布系统公告
Lottery.prototype.publishNotice = function () {
    this.emit(this.consts.Event.area.notice, {lottery: this, content: this.sysConfig.getSysNotice()});
};

//发布中奖公告
Lottery.prototype.winnerNotice = function (msg) {
    this.emit(this.consts.Event.area.notice, {lottery: this, content: `恭喜${msg.name}中奖${msg.money}`});
};

//开奖信息
Lottery.prototype.publishLottery = function (result) {
    this.lastLottery = result.last;
    this.nextLottery = result.next;
    this.preLottery = result.pre;
    this.identify = result.identify;
    this.tickPeriod = result.next.period;
    this.emit(this.consts.Event.area.lottery, {
        lottery: this,
        lotteryResult: this.lastLottery,
        preLottery: this.preLottery
    });
};

//发布最近一期开奖信息
Lottery.prototype.publishCurLottery = function (uids) {
    if (this.lastLottery) {
        this.emit(this.consts.Event.area.lottery, {
            lottery: this,
            lotteryResult: this.lastLottery,
            preLottery: this.preLottery,
            uids: uids
        });
    }
};

//发布开奖分析结果
Lottery.prototype.publishParseResult = function (parseResult) {
    let self = this;
    let _lotteryItem;
    async.waterfall([
        function (cb) {
            self.daoLottery.getLottery(self.lastLottery.period, cb);
        },
        function (lotteryItem, cb) {
            if(lotteryItem){
                _lotteryItem = lotteryItem;
                cb();
            }
            else {
                self.daoLottery.addLottery(self.identify, self.lastLottery.period, self.lastLottery.numbers,
                    Date.parse(self.lastLottery.opentime), parseResult,
                    function (err, result) {
                        if (!err && !!result) {
                            _lotteryItem = result;
                            cb();
                        }
                        else {
                            cb(err);
                        }
                    });
            }
        }
    ],function (err) {
        if(!!_lotteryItem){
            self.pubMsg('updateLatestLottery', _lotteryItem.strip());
            // logger.error('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~publishParseResult:', _lotteryItem.strip());
            self.emit(self.consts.Event.area.parseLottery, {lottery: self, parseResult: [_lotteryItem.strip()]});
        }
    });
};

Lottery.prototype.getLatestLotterys = function (cb) {
    let self = this;
    self.redisApi.cmd('hvals', this.consts.LOTTERY_TABLE, null, null, function (err, result) {
        // logger.error('DaoChat gets ', err, result);
        if (err) {
            self.utils.invokeCallback(cb, Code.DBFAIL);
            return;
        }

        let lotteryItems = [];
        for (let item of result[0]) {
            lotteryItems.push(JSON.parse(item));
        }

        lotteryItems.sort(function (a, b) {
            return b.openTime - a.openTime;
        });

        self.utils.invokeCallback(cb, null, lotteryItems);
    })
};

//发布最近10期开奖分析结果
Lottery.prototype.initPublishParseResult = function (uids) {
    let self = this;
    this.getLatestLotterys(function (err, lotteryCaches) {
        if (err) {
            return;
        }
        self.emit(self.consts.Event.area.parseLottery, {lottery: self, parseResult: lotteryCaches, uids: uids});
    });
};

//发布最近10条投注记录
Lottery.prototype.initPublishLatestBets = function (betItems, uids) {
    logger.error('~~~~~~~~~~~~~~~~~~~initPublishLatestBets~~~~~~~~~~~~~~~~~~', betItems, uids);
    this.emit(this.consts.Event.area.playerBets, {lottery: this, betItems: betItems, uids: uids});
};

Lottery.prototype.getNextPeriod = function () {
    return this.nextLottery.period;
}

Lottery.prototype.getIdentify = function () {
    return this.identify;
}

Lottery.prototype.getTickCount = function () {
    return this.tickCount;
};

Lottery.prototype.countdown = function () {
    var subTick = 0;
    if (this.lastTickTime != 0) {
        subTick = (Date.now() - this.lastTickTime) / 1000;
    }

    var temp = this.tickCount;
    this.tickCount -= subTick;

    if (this.tickCount < 0) this.tickCount = 0;

    if (Math.floor(this.tickCount) > this.lastTickCount && this.lastTickCount != 0) {
        this.tickCount = this.lastTickCount;
    }

    this.emit(this.consts.Event.area.countdown, {lottery: this});

    this.lastTickTime = Date.now();

    this.lastTickCount = this.tickCount;
};


Lottery.prototype.getWeiXin = function () {
    return this.sysConfig.getGM();
}

Lottery.prototype.save = function () {
    this.emit('save');
};

Lottery.prototype.strip = function () {
    var r = {
        id: this.id,
        entityId: this.entityId,
        kindId: this.kindId,
        kindName: this.kindName,
        areaId: this.areaId,
        type: this.type
    };

    return r;
}

Lottery.prototype.toJSON = function () {
    var r = this._toJSON();

    //  r['id'] = this.id;
    r['type'] = this.type;

    return r;
};

module.exports = {
    id: "lottery",
    func: Lottery,
    scope: "prototype",
    parent: "entity",
    init: "init",
    args: [{
        name: "opts",
        type: "Object"
    }],
    props: [{
        name: "consts",
        ref: "consts"
    }, {
        name: "daoLottery",
        ref: "daoLottery"
    }, {
        name: "sysConfig",
        ref: "sysConfig"
    }, {
        name: 'redisApi',
        ref: 'redisApi'
    }]
};