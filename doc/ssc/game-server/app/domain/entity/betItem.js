/**
 * Created by linyng on 17-5-22.
 */

var bearcat = require('bearcat');
var util = require('util');
var logger = require('pomelo-logger').getLogger('bearcat-lottery', 'BetItem');

var BetItem = function (opts) {
    this.opts = opts;
    this.id = opts.id;
    this.playerId = opts.playerId;
    this.period = opts.period;
    this.identify = opts.identify;
    this.betInfo = opts.betInfo;
    this.state = opts.state;
    this.betCount = opts.betCount;
    this.winCount = opts.winCount;
    this.betMoney = opts.betMoney;
    this.winMoney = opts.winMoney;
    this.betTime = opts.betTime;
    this.betTypeInfo = opts.betTypeInfo
    this.betItems = opts.betItems;
    this.roleName = null;
};

BetItem.prototype.init = function () {
    this.type = this.consts.EntityType.ITEM;
    var Entity = bearcat.getFunction('entity');
    Entity.call(this, this.opts);
    this._init();
};

BetItem.prototype.setRoleName = function(roleName){
    this.roleName = roleName;
}

BetItem.prototype.getState = function () {
    return this.state;
};
BetItem.prototype.getBetInfo = function () {
    return this.betInfo;
};

BetItem.prototype.setState = function (state) {
    this.state = state;
};

BetItem.prototype.setBetItems = function (betItems) {
    this.betItems = betItems;
};

BetItem.prototype.getBetTypeInfo = function () {
    return this.betTypeInfo;
}

BetItem.prototype.setFreeBetValue = function (type, freeBetValue) {
    this.betTypeInfo[type].freeBetValue = freeBetValue;
};

BetItem.prototype.setPriFreeBetValue = function (type, freeBetValue) {
    this.betTypeInfo[type].priFreeBetValue = freeBetValue;
};

// 获取本金
BetItem.prototype.getBetMoney = function () {
    return this.betMoney;
};

//获取投注柱数
BetItem.prototype.getBetCount = function () {
    return this.betCount;
};

//获取中奖金额
BetItem.prototype.getWinMoney = function () {
    return this.winMoney;
};
//获取中奖柱数
BetItem.prototype.getWinCount = function () {
    return this.winCount;
};

//计算一柱中奖收益
BetItem.prototype.getIncomValue = function (openInfo, item) {
    var inc = 0;
    var multi = this.incomeCfg.getBetRate(item.type.code);
    if(openInfo.has(item.result)){
        inc = item.money * (1 + multi);
        inc = Number(inc.toFixed(2));
    }
    if(inc > 0) this.winCount++;
    return inc;
};

BetItem.prototype.calcHarvest = function (openInfo) {
    for (var item of this.betItems) {
        this.winMoney += this.getIncomValue(openInfo, item);
    }
};

BetItem.prototype.getBetExternalInfo = function () {
    var betTypeFormat = "";
    var priFreeInfo = "";
    var betDescInfoFormat = "投注 ";
    var multiCount = 0;
    for (var type in this.betTypeInfo){
        betTypeFormat += `${this.betTypeInfo[type].type.desc}${this.consts.DES_SEPARATOR}${this.betTypeInfo[type].freeBetValue}${this.consts.DES_SEPARATOR}`;
        priFreeInfo += `${this.betTypeInfo[type].type.desc}${this.consts.DES_SEPARATOR}${this.betTypeInfo[type].priFreeBetValue}${this.consts.DES_SEPARATOR}`;
        betDescInfoFormat += `${this.betTypeInfo[type].desc}`;
        multiCount ++;
    }

    if(multiCount > 1){
        betDescInfoFormat+= "各1注";
    }
    betTypeFormat = betTypeFormat.substring(0, betTypeFormat.lastIndexOf(`${this.consts.DES_SEPARATOR}`));
    priFreeInfo = priFreeInfo.substring(0, priFreeInfo.lastIndexOf(`${this.consts.DES_SEPARATOR}`));

    return {
        betFreeInfoFormat:betTypeFormat,
        priFreeInfoFormat:priFreeInfo,
        betDescInfoFormat:betDescInfoFormat
    };
}

BetItem.prototype.strip = function () {
    var ext = this.getBetExternalInfo();
    var r= {
        id: this.id,
        entityId:this.entityId,
        type:this.type,
        playerId: this.playerId,
        roleName:this.roleName,
        period: this.period,
        identify: this.identify,
        betInfo: this.betInfo,
        state: this.state,
        betCount: this.betCount,
        winCount: this.winCount,
        betMoney:this.betMoney,
        winMoney:this.winMoney,
        betTime: this.betTime,
        betTypeInfo:this.betTypeInfo,
        betItems:this.betItems,
        betFreeInfo:ext.betFreeInfoFormat,
        betPriFreeInfo:ext.priFreeInfoFormat,
        betDescInfo:ext.betDescInfoFormat
    };
    return r;
};

BetItem.prototype.toJSON = function () {
    var r = this._toJSON();

    //  r['id'] = this.id;
    r['type'] = this.type;

    return r;
};

// Emit the event 'save'.
BetItem.prototype.save = function () {
    this.emit('save');
};

module.exports = {
    id: "betItem",
    func: BetItem,
    init: "init",
    scope: "prototype",
    parent: "entity",
    args: [{
        name: "opts",
        type: "Object"
    }],
    props: [
        {name: 'betParser', ref: 'betParser'},
        {name: 'incomeCfg', ref: 'incomeCfg'},
        {name: 'consts', ref: 'consts'}
    ]
}