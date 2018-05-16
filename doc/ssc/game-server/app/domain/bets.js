/**
 * Created by linyng on 17-5-22.
 */


var logger = require('pomelo-logger').getLogger('bearcat-lottery');
var bearcat = require('bearcat');
var util = require('util');
var Code = require('../../../shared/code');

function Bets(opts) {
    this.opts = opts;
    this.id = 1;
    this.betMap = new Map();
};

Bets.prototype.init = function () {
    this.type = this.consts.EntityType.BETS;
    var Entity = bearcat.getFunction('entity');
    Entity.call(this, this.opts);
    this._init();
};

Bets.prototype.addItem = function (item) {
    this.betMap.set(item.id, item);
    this.eventManager.addEvent(item);
};

Bets.prototype.getItem = function (entityId) {
    return this.betMap.get(entityId);
};

Bets.prototype.openCodeCalc = function (period, openCodeResult,numbers) {
    logger.error('openCodeCalc');
    var calcResult = {winCount:0,winMoney:0,betMoney:0,betCount:0, itemOK:[]};
    for (var item of this.betMap.values()) {
        //&& item.period === period
        if (item.getState() === this.consts.BetState.BET_WAIT && item.period === period) {
            item.calcHarvest(openCodeResult);
            var subMoney = Number((item.getWinMoney() - item.getBetMoney()).toFixed(2));
            logger.error('##################subMoney', subMoney, 'period:',period);
            if(subMoney > 0){
                item.setState(this.consts.BetState.BET_WIN);
                calcResult.itemOK.push({id:item.id,state:this.consts.BetState.BET_WIN,money:subMoney});
            }
            else {
                logger.error(1);
                var betinfo=item.getBetInfo();
                if (numbers[0]===numbers[4] && (betinfo.indexOf('虎')>-1 ||betinfo.indexOf('龙')>-1)) {
                    item.setState(this.consts.BetState.BET_BACK);
                    calcResult.itemOK.push({id:item.id,state:this.consts.BetState.BET_BACK, money:subMoney});
                }else{
                    logger.error(2);
                    item.setState(this.consts.BetState.BET_LOSE);
                    calcResult.itemOK.push({id:item.id,state:this.consts.BetState.BET_LOSE, money:subMoney});
                }
                
            }

            item.save();
            calcResult.winCount += item.getWinCount();
            calcResult.winMoney += item.getWinMoney();
            calcResult.betMoney += item.getBetMoney();
            calcResult.betCount += item.getBetCount();
        }
    }
    this.betMap.clear();

    return calcResult;
};

Bets.prototype.isEmpty = function () {
    return this.betMap.size === 0;
}

//Get all the items
Bets.prototype.all = function () {
    return this.betMap;
};

Bets.prototype.toJSON = function () {
    var r = this._toJSON();

    //  r['id'] = this.id;
    r['type'] = this.type;

    return r;
};

module.exports = {
    id: "bets",
    func: Bets,
    scope: "prototype",
    parent: "entity",
    init: "init",
    args: [{
        name: "opts",
        type: "Object"
    }],
    props: [
        {name: "consts", ref: "consts"},
        {name: "eventManager", ref: "eventManager"},
    ]
};