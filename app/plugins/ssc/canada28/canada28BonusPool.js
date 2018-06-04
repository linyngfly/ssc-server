const BonusPool = require('../bonusPool');
const moment = require('moment');
const schedule = require('node-schedule');
const config = require('../config');

/**
 * 加拿大8
 * 19：00 ~ 20：00 维护
 *
 * @type {number}
 */


class Canada28BonusPool extends BonusPool {
    constructor(opts) {
        super(opts);
        this._close_job = null;
        this._open_job = null;
        this._state = 2; //1:open, 2:running, 3:close
    }

    _preHandle() {
        if (this._state == 1) {
            this._countdown.reset(this._openCaiType.INTERVAL * 60 * 1000 - 5000);
            this._state = 2;
        }
    }

    _handleLotteryInfo(lotteryInfo) {
        //TODO 开奖了
        this.emit(config.LOTTERY_EVENT.OPEN_AWARD, lotteryInfo);

        let nextTime = moment(lotteryInfo.next.opentime).format('x');
        if(this._state == 3){
            nextTime = moment(lotteryInfo.next.opentime).add('hours', 1).format('x');
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
        open_rule.hour = 20;
        this._open_job = schedule.scheduleJob(open_rule, function () {
            this._state = 1;
        }.bind(this));

        let close_rule = new schedule.RecurrenceRule();
        close_rule.minute = 0;
        close_rule.hour = 19;
        this._close_job = schedule.scheduleJob(open_rule, function () {
            this._state = 3;
        }.bind(this));
    }

    stop() {
        super.stop();
        schedule.cancelJob(this._open_job);
        schedule.cancelJob(this._close_job);
    }

    /**
     * 投注通道是否关闭
     * 提前30s封注
     * @return {boolean}
     */
    canBetNow() {
        return true;
        return this._lotterInfo != null && this._countdown.duration > config.BET_ADVANCE_CLOSE_TIME;
    }

    getNextPeriod() {
        return this._lotterInfo.next.period;
    }

    getIdentify() {
        return this._openCaiType.IDENTIFY;
    }
}

module.exports = Canada28BonusPool;