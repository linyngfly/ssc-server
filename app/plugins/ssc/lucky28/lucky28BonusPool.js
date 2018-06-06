const BonusPool = require('../bonusPool');
const moment = require('moment');
const schedule = require('node-schedule');
const config = require('../config');

/**
 * 北京快乐8
 * 9：00 ~ 23：55
 *
 * @type {number}
 */


class Lucky28BonusPool extends BonusPool {
    constructor(opts) {
        super(opts);
        this._close_job = null;
        this._open_job = null;
        this._state = 2; //1:open, 2:running, 3:close
    }

    _preHandle() {
        if (this._state == 1) {
            this._countdown.reset(this._openCaiType.INTERVAL * 60 * 1000 - 10000);
            this._state = 2;
        }
    }

    _handleLotteryInfo(lotteryInfo) {
        //TODO 开奖了
        this.emit(config.LOTTERY_EVENT.OPEN_AWARD, lotteryInfo);

        let nextTime = moment(lotteryInfo.next.opentime).format('x');
        if(this._state == 3){
            nextTime = moment(lotteryInfo.next.opentime).add('hours', 9).format('x');
        }
        let free = nextTime - moment().format('x');
        free = Math.max(free, 0);
        this._countdown.reset(Math.floor(free / 1000) * 1000);

        this._lotterInfo = lotteryInfo;
    }

    start() {
        super.start();

        let open_rule = new schedule.RecurrenceRule();
        open_rule.minute = 0;
        open_rule.hour = 9;
        this._open_job = schedule.scheduleJob(open_rule, function () {
            this._state = 1;
        }.bind(this));

        let close_rule = new schedule.RecurrenceRule();
        close_rule.minute = 55;
        close_rule.hour = 23;
        this._close_job = schedule.scheduleJob(open_rule, function () {
            this._state = 3;
        }.bind(this));
    }

    stop() {
        super.stop();
        schedule.cancelJob(this._open_job);
        schedule.cancelJob(this._close_job);
    }
}

module.exports = Lucky28BonusPool;