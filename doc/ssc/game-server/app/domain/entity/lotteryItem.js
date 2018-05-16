/**
 * Created by linyng on 17-6-27.
 */

const bearcat = require('bearcat');
const util = require('util');
const logger = require('pomelo-logger').getLogger(__filename);

var LotteryItem = function (opts) {
    this.opts = opts;
    this.id = opts.id;
    this.period = opts.period;
    this.identify = opts.identify;
    this.numbers = opts.numbers;
    this.openTime = opts.openTime;
    this.parseResult = opts.parseResult;
};

LotteryItem.prototype.init = function () {
    this.type = this.consts.EntityType.ITEM;
    var Entity = bearcat.getFunction('entity');
    Entity.call(this, this.opts);
    this._init();
};

LotteryItem.prototype.strip = function () {
    var r= {
        id: this.id,
        period:this.period,
        identify:this.identify,
        numbers: this.numbers,
        openTime:this.openTime,
        parseResult: this.parseResult
    };
    return r;
};

module.exports = {
    id: "lotteryItem",
    func: LotteryItem,
    init: "init",
    scope: "prototype",
    parent: "entity",
    args: [{
        name: "opts",
        type: "Object"
    }],
    props: [
        {name: 'consts', ref: 'consts'}
    ]
}