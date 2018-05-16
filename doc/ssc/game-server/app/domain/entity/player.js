const logger = require('pomelo-logger').getLogger(__filename);
const bearcat = require('bearcat');
const util = require('util');
const Code = require('../../../../shared/code');
const Answer = require('../../../../shared/answer');
const async = require('async');

function Player(opts) {
    this.opts = opts;
    this.id = opts.id;
    this.roleName = opts.roleName;
    this.imageId = opts.imageId;
    this.sex = opts.sex;
    this.pinCode = opts.pinCode;
    this.username = opts.username;
    this.phone = opts.phone;
    this.email = opts.email;
    this.inviter = opts.inviter;
    this.active = opts.active;
    this.forbidTalk = opts.forbidTalk;
    this.role = opts.role;
    this.rank = opts.rank;
    this.accountAmount = opts.accountAmount;
    this.level = opts.level;
    this.experience = opts.experience;
    this.loginCount = opts.loginCount;
    this.lastLoinTime = opts.lastLoinTime;
    this.state = opts.state;

    if(!!opts.ext){
        this.ext = JSON.parse(opts.ext);
    }
    else {
        this.ext = {
            phone:0,
            email:0,
            pinCode:0,
            alipay:0,
            wechat:0,
            card:0
        }
    }

}

Player.prototype.init = function () {
    this.setRank();
    this.setNextLevelExp();
    this.type = this.consts.EntityType.PLAYER;

    var Entity = bearcat.getFunction('entity');
    Entity.call(this, this.opts);
    this._init();

    this.betStatistics = null;
    this.bets = bearcat.getBean("bets", {})
    this.betMoneyMap = new Map(); //每一期个人投注类型总和限制
    this.bank = null;
    this.serverId = -1;
    this.gameService = null;
};

Player.prototype.setBetStatistics = function (betStatistics) {
    this.betStatistics = betStatistics;
};

Player.prototype.setBank = function (bank) {
    this.bank = bank;
};

Player.prototype.setServerId = function (serverId) {
    this.serverId = serverId;
};

Player.prototype.setService = function (service) {
    this.gameService = service;
};

// 补开投注,中奖money 在补开模块写入数据库，此处只负责更新内存和通知用户
Player.prototype.restoreBets = function (bets) {
    this.accountAmount += bets.money;
    this.betStatistics.betMoney += bets.money;
    this.betStatistics.betCount += bets.count;

    this.emit(this.consts.Event.area.playerPreWinner, {player: this, itemOK:bets.itemOK, uids: [{uid: this.id, sid: this.serverId}]});
    logger.error('~~~~~~~~~~Player.prototype.restoreBets~~~~~~~~~~~', {player: this, itemOK:bets.itemOK, uids: [{uid: this.id, sid: this.serverId}]});
    this.addExperience(bets.betmoney);
    this.changeNotify();
};

// 退还投注额
Player.prototype.revertBets = function (bets) {
    this.accountAmount += bets.money;
    this.betStatistics.betMoney -= bets.money;
    this.betStatistics.betCount -= bets.count;

    this.emit(this.consts.Event.area.playerPreWinner, {player: this, itemOK:bets.itemOK, uids: [{uid: this.id, sid: this.serverId}]});

    bets.itemOK.forEach(function (item) {
        let betItem = this.bets.getItem(item.id);
        if(betItem){
            betItem.setState(item.state);
        }
    });

    logger.error('~~~~~~~~~~Player.prototype.revertBets~~~~~~~~~~~', {player: this, itemOK:bets.itemOK, uids: [{uid: this.id, sid: this.serverId}]});

    this.changeNotify();
};

// 后台充值及时到账
Player.prototype.backendRechare = function (money) {
    this.accountAmount += money;
    this.changeNotify();
};

Player.prototype.isIdle = function () {
    if (this.bets.isEmpty()) {
        return true;
    }
    return false;
};

Player.prototype.transferTask = function (target) {
    target.bets = this.bets;
    target.betMoneyMap =  this.betMoneyMap;
}

Player.prototype.setRank = function () {
    this.rank = this.sysConfig.getRank(this.level);
};

Player.prototype.setNextLevelExp = function () {
    var _exp = this.sysConfig.getUpdate(this.level);
    if (!!_exp) {
        this.nextLevelExp = _exp;
    } else {
        this.nextLevelExp = 9999999999;
    }
}

Player.prototype.addExperience = function (exp) {
    if(isNaN(exp)){
        logger.error('经验值无效');
        return;
    }

    this.experience += exp;
    if (this.experience >= this.nextLevelExp) {
        this.upgrade();
    }
    this.save();
};

Player.prototype.upgrade = function () {
    while (this.experience >= this.nextLevelExp) {
        //logger.error('player.upgrade ' + this.experience + ' nextLevelExp: ' + this.nextLevelExp);
        this._upgrade();
    }
    this.changeNotify();
    this.setRank();
};

//Upgrade, update player's state
Player.prototype._upgrade = function () {
    this.level += 1;
    this.experience -= this.nextLevelExp;
    this.setNextLevelExp();
};

Player.prototype.setState = function(state){
    this.state = state;
    this.save();
};

Player.prototype.setRoleName = function (name) {
    this.roleName = name;
    this.save();
    this.changeNotify();
};

Player.prototype.setImageId = function (imageId) {
    this.imageId = imageId;
    this.save();
    this.changeNotify();
};

Player.prototype.setPhone = function (phone) {
    if(this.ext.phone === 1){
        return Code.GAME.FA_MODIFY_LIMIT;
    }
    this.phone = phone;
    this.ext.phone = 1;
    this.save();
    this.changeNotify();
    return Code.OK;
};
// alipay:0,
// wechat:0,
// card:0

Player.prototype.updateBankBindState = function (address, username, cardNO, alipay, wechat, pinCode) {
    if(!!address && !!username && !!cardNO && this.ext.card === 0){
        this.ext.card = 1;
    }

    if(!!alipay && this.ext.alipay === 0){
        this.ext.alipay = 1;
    }

    if(!!wechat && this.ext.wechat === 0){
        this.ext.wechat = 1;
    }

    if(!!pinCode && this.ext.pinCode === 0){
        this.ext.pinCode = 1;
        this.pinCode = this.utils.createSalt(pinCode);
        this.setPinCode(this.pinCode);
    }
};

Player.prototype.updateBankInfo = function (address, username, cardNO, alipay, wechat, pinCode, cb) {
    let self = this;
    async.waterfall([
        function (callback) {
            if(!!address && !!username && !!cardNO){
                if(self.ext.card === 0){
                    self.daoBank.setBankCard(self.id, address, username, cardNO, function (err, result) {
                        if(result){
                            self.ext.card = 1;
                            self.bank.cardNO = cardNO;
                            self.bank.address = address;
                            self.bank.username = username;
                            callback();
                        }
                        else {
                            callback(Code.DBFAIL);
                        }
                    });
                }
                else {
                    callback(Code.GAME.FA_CANNOT_REBIND_CARD);
                }
            }else {
                callback();
            }
        },
        function (callback) {
            if(!!alipay){
                if(self.ext.alipay === 0){
                    self.daoBank.setAlipay(self.id, alipay, function (err, result) {
                        if(result){
                            self.ext.alipay = 1;
                            self.bank.alipay = alipay;
                            callback();
                        }
                        else {
                            callback(Code.DBFAIL);
                        }
                    });
                }
                else {
                    callback(Code.GAME.FA_CANNOT_REBIND_ALIPAY);
                }
            }else {
                callback();
            }
        },
        function (callback) {
            if(!!wechat){
                if(self.ext.wechat === 0){
                    self.daoBank.setWechat(self.id, wechat, function (err, result) {
                        if(result){
                            self.bank.wechat = wechat;
                            self.ext.wechat = 1;
                            callback();
                        }
                        else {
                            callback(Code.DBFAIL);
                        }
                    });
                }
                else {
                    callback(Code.GAME.FA_CANNOT_REBIND_WECHAT);
                }
            }else {
                callback();
            }
        },
        function (callback) {
            if(!!pinCode){
                if(self.ext.pinCode === 0){
                    self.pinCode = self.utils.createSalt(pinCode);
		    console.log(self);
                    self.setPinCode(self.pinCode);
                    self.ext.pinCode = 1;
                    callback();

                }else {
                    callback();(Code.GAME.FA_MODIFY_LIMIT);
                }
            }else {
                callback();
            }
        }
    ],function (err) {
        cb(err);
    });
};

Player.prototype.setPinCode = function (pinCode) {
    this.daoUser.setPinCode(this.id, pinCode);
};

Player.prototype.bindCard = function (address, username, cardNO, alipay, wechat, pinCode, cb) {
    let self = this;
    async.waterfall([
        function (callback) {
            self.daoBank.get(self.id, callback);
        },
        function (banks, callback) {
            if(!banks){
                self.daoBank.bind(self.id, address, username, cardNO, alipay, wechat,function (err, result) {
                    if(!err && result){
                        self.updateBankBindState(address, username, cardNO, alipay, wechat, pinCode);
                        self.bank = result;
                        callback();
                    }
                    else {
                        callback(Code.DBFAIL);
                    }
                });
            }
            else {
                self.updateBankInfo(address, username, cardNO, alipay, wechat, pinCode, callback);
            }
        }
    ],function (err) {
        if(err){
            self.utils.invokeCallback(cb, err, null);
        }else {
            self.utils.invokeCallback(cb, null, null);
            self.save();
            self.changeNotify();
        }
    });
};

Player.prototype.setEmail = function (email) {
    if(this.ext.email === 1){
        return Code.GAME.FA_MODIFY_LIMIT;
    }
    this.email = email;
    this.ext.email = 1;
    this.save();
    this.changeNotify();
    return Code.OK;
};

Player.prototype.recharge = function (money) {
    this.accountAmount += money;
    this.save();
    this.changeNotify();
};

Player.prototype.cash = function (pinCode, money) {
    if(pinCode !== this.pinCode){
        return Code.GAME.FA_CAST_PINCODE_ERR;
    }
    if (this.accountAmount < money){
        return Code.GAME.FA_CAST_ERROR;
    };
    this.accountAmount -= money;
    this.save();
    this.changeNotify();
    return Code.OK;
};

Player.prototype.setCanTalk = function (canTalk) {
    this.forbidTalk = canTalk;
    this.save();
};

Player.prototype.getMyBets = function (skip, limit, cb) {
    this.daoBets.getBets(this.id, skip, limit, cb);
};

Player.prototype.getMyIncomes = function (skip, limit, cb) {
    this.daoIncome.getPlayerIncomes(this.id, skip, limit, cb);
};

Player.prototype.getBaseInfo = function () {
    var winRate = 0;
    if (this.betStatistics.betCount > 0) {
        winRate = Number(((this.betStatistics.winCount / this.betStatistics.betCount) * 100).toFixed(2))
    }
    return {
        roleName: this.roleName,
        imageId: this.imageId,
        level: this.level,
        accountAmount: Number(this.accountAmount.toFixed(2)),
        winCount: this.betStatistics.winCount,
        betMoney:this.betStatistics.betMoney,
        winRate: winRate
    }
};

//todo:检查用户投注类型总额是否超限
Player.prototype.canBet = function (type, value) {
    var num = this.betMoneyMap.get(type);
    num = !!num ? num : 0;
    var err = {};
    var freeBetValue = 0;
    if (this.betLimitCfg.playerLimit(type, num + value)) {
        err.code = Code.GAME.FA_BET_PLAYER_LIMIT.code;
        err.desc = Code.GAME.FA_BET_PLAYER_LIMIT.desc + '最多还能下注' + (this.betLimitCfg.getPlayerValue(type) - num).toString();
        freeBetValue = this.betLimitCfg.getPlayerValue(type) - num;
    } else {
        err = Code.OK;
        freeBetValue = this.betLimitCfg.getPlayerValue(type) - (num + value);
    }

    return new Answer.DataResponse(err, {freeBetValue: freeBetValue});
};

Player.prototype.addBetValue = function (type, value) {
    var num = this.betMoneyMap.get(type);
    num = !!num ? num : 0;
    num += value;
    this.betMoneyMap.set(type, num);
};


Player.prototype.reduceBetValue = function (type, value) {
    var num = this.betMoneyMap.get(type);
    num = !!num ? num : 0;
    num -= value;
    this.betMoneyMap.set(type, num);
    var limis = this.betLimitCfg.getPlayerValue(type);
    return limis- num;
};

Player.prototype.bet = function (period, identify, betData, betParseInfo, cb) {
    if (betParseInfo.total > this.accountAmount) {
        this.utils.invokeCallback(cb, Code.GAME.FA_ACCOUNTAMOUNT_NOT_ENOUGH, null);
        return;
    }
    var self = this;
    this.daoBets.addBet({
        playerId: this.id,
        period: period,
        identify: identify,
        betInfo: betData,
        state: this.consts.BetState.BET_WAIT,
        betCount: betParseInfo.betItems.length,
        winCount: 0,
        betMoney: betParseInfo.total,
        winMoney: 0,
        betTime: Date.now(),
        betTypeInfo: betParseInfo.betTypeInfo,
        betItems:betParseInfo.betItems
    }, function (err, betItem) {
        if (err) {
            self.utils.invokeCallback(cb, err, null);
            return;
        }
        self.betStatistics.betCount += betParseInfo.betItems.length;
        self.betStatistics.betMoney += betParseInfo.total;
        self.accountAmount -= betParseInfo.total;
        self.save();
        self.changeNotify();

        for (var type in betParseInfo.betTypeInfo) {
            self.platformBet.addBet(betParseInfo.betTypeInfo[type].type.code, betParseInfo.betTypeInfo[type].money);
            self.addBetValue(betParseInfo.betTypeInfo[type].type.code, betParseInfo.betTypeInfo[type].money);
        }
        betItem.setRoleName(self.roleName);

        self.bets.addItem(betItem);

        self.emit(self.consts.Event.area.playerBet, {player: self, betItem: betItem});
        self.utils.invokeCallback(cb, null, betItem);

        betItem.save();
// logger.error('~~~~~~~~~~~~~~~~~~~~addExperience~~~~~~~~~test');
//         self.addExperience(betItem.getBetMoney());
    });

};

Player.prototype.unBet = function (entityId, cb) {
    var betItem = this.bets.getItem(entityId);
    if (betItem) {
        if (betItem.getState() != this.consts.BetState.BET_WAIT) {
            this.utils.invokeCallback(cb, Code.GAME.FA_BET_STATE, null);
            return;
        }

        betItem.setState(this.consts.BetState.BET_CANCLE);
        this.accountAmount += betItem.getBetMoney();
        this.betStatistics.betMoney -= betItem.getBetMoney();
        this.betStatistics.betCount -= betItem.getBetCount();

        var betTypeInfo = betItem.getBetTypeInfo();

        let betTypeInfoArr = [];
        for (let type in betTypeInfo) {
            betTypeInfoArr.push(betTypeInfo[type]);
        }

        let self = this;
        async.map(betTypeInfoArr, function (item, callback) {
            self.platformBet.reduceBet(item.type.code, item.money, function (freeValue) {
                betItem.setFreeBetValue(item.type.code, freeValue);
                let priFreeValue = self.reduceBetValue(item.type.code, item.money);
                betItem.setPriFreeBetValue(item.type.code, priFreeValue);
                callback(null, item);
            });
        },function(err, result) {
            betItem.save();
            self.utils.invokeCallback(cb, null, betItem);
            self.save();
            self.changeNotify();
            self.emit(self.consts.Event.area.playerUnBet, {player: self, betItem: betItem});
        });
    }
    else {
        this.utils.invokeCallback(cb, Code.GAME.FA_ENTITY_NOT_EXIST, null);
    }
};

Player.prototype.openCode = function (period, openCodeResult, numbers) {
    logger.error('openCode');
    logger.error(period);
    var calcResult = this.bets.openCodeCalc(period, openCodeResult,numbers);
    this.betStatistics.winCount += calcResult.winCount;
    this.accountAmount += calcResult.winMoney;
    this.addExperience(Number(calcResult.betMoney));
    this.save();

    if(calcResult.winCount != 0){
        this.changeNotify();
    }

    var winMoney = Number((calcResult.winMoney - calcResult.betMoney).toFixed(2));
    if(calcResult.betCount  > 0){
        this.emit(this.consts.Event.area.playerWinner, {player: this, winMoney:winMoney,numbers:numbers, itemOK:calcResult.itemOK, uids: [{uid: this.id, sid: this.serverId}]});
    }

    this.betMoneyMap.clear();

    if(winMoney > 0){
        return {name:this.roleName, money:winMoney};
    }

    return null;
};

// Emit the event 'save'.
Player.prototype.save = function () {
    this.emit('save');
};

Player.prototype.changeNotify = function () {
    this.emit(this.consts.Event.area.playerChange, {player: this, uids: [{uid: this.id, sid: this.serverId}]});
};

Player.prototype.defineNotify = function(type, msg){
    this.emit(this.consts.Event.area.defineNotify, {player:this, type:type, msg:msg, uids:[{uid: this.id, sid: this.serverId}]});
};

Player.prototype.strip = function () {

    var r = {
        id: this.id,
        entityId: this.entityId,
        kindId: this.kindId,
        kindName: this.kindName,
        type: this.type,
        roleName: this.roleName,
        imageId: this.imageId,
        pinCode: this.pinCode,
        username: this.username,
        phone: this.phone,
        email: this.email,
        inviter: this.inviter,
        active: this.active,
        forbidTalk: this.forbidTalk,
        role: this.role,
        rank: this.rank,
        accountAmount: Number(this.accountAmount.toFixed(2)),
        level: this.level,
        experience: this.experience,
        loginCount: this.loginCount,
        lastLoinTime: this.lastLoinTime,
        betStatistics: this.betStatistics,
        bank:this.bank,
        state:this.state,
        ext:JSON.stringify(this.ext)
    };

    return r;
}

/**
 * Parse String to json.
 * It covers object' method
 *
 * @param {String} data
 * @return {Object}
 * @api public
 */
Player.prototype.toJSON = function () {
    var r = this._toJSON();

    r['id'] = this.id;
    r['type'] = this.type;
    r['name'] = this.name;
    r['walkSpeed'] = this.walkSpeed;
    r['score'] = this.score;

    return r;
};

module.exports = {
    id: "player",
    func: Player,
    scope: "prototype",
    parent: "entity",
    init: "init",
    args: [{
        name: "opts",
        type: "Object"
    }],
    props: [
        {name: "consts", ref: "consts"},
        {name: "dataApiUtil", ref: "dataApiUtil"},
        {name: "daoBets", ref: "daoBets"},
        {name: "utils", ref: "utils"},
        {name: "daoIncome", ref: "daoIncome"},
        {name: "platformBet", ref: "platformBet"},
        {name: "betLimitCfg", ref: "betLimitCfg"},
        {name: "sysConfig", ref: "sysConfig"},
        {name: "daoBank", ref: "daoBank"},
        {name: "daoUser", ref: "daoUser"}
    ]
}
