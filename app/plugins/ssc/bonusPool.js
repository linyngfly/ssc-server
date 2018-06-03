const EventEmitter = require('events').EventEmitter;
const Countdown = require('../../utils/countdown');
const config = require('./config');
const moment = require('moment');

const TASK_DT = 100;

class BonusPool extends EventEmitter {
    constructor(opts) {
        super();
        this._lotteryApi = opts.lotteryApi;
        this._openCaiType = opts.openCaiType;
        this._countdown = new Countdown(this.countdownNotify.bind(this));
        this._canRun = true;
        this._lotterInfo = null;
    }

    countdownNotify(dt) {
        this.emit(config.LOTTERY_EVENT.TICK_COUNT, dt/1000);
    }


    //处理业务
    async update() {
        try {
            let lotteryInfo = await this._lotteryApi.getLotteryInfo(this._openCaiType);
            if(!lotteryInfo){
                return;
                // throw new Error('lotteryInfo is null');
            }

            if(lotteryInfo.next.period != lotteryInfo.last.period+1 &&  lotteryInfo.last.period != lotteryInfo.pre.period + 2){
                // throw new Error('lotteryInfo is invalid');
                return;
            }

            // logger.error('getLotteryInfo=', lotteryInfo);
            if (!this._lotterInfo || this._lotterInfo.next.period == lotteryInfo.last.period) {
                //TODO 开奖了
                this.emit(config.LOTTERY_EVENT.OPEN_AWARD, lotteryInfo);
                let nextTime = moment(lotteryInfo.next.opentime).format('x');
                let free = nextTime - moment().format('x');
                free = Math.min(free, 0);
                // logger.error('free =', free);
                this._countdown.reset(Math.floor(free/1000)*1000);
                this._lotterInfo = lotteryInfo;
            }
        } catch (err) {
            logger.error('获取开奖数据异常，err=', err);
        }
    }

    _runTask() {
        if (!this._canRun) return;
        setTimeout(async function () {
            this._countdown.tick();
            await this.update();
            this._runTask();
        }.bind(this), TASK_DT);
    }

    start() {
        this._runTask();
    }

    stop() {
        this._canRun = false;
    }

    /**
     * 投注通道是否关闭
     * 提前30s封注
     * @return {boolean}
     */
    canBetNow() {
        return this._lotterInfo != null && this._countdown.duration > config.BET_ADVANCE_CLOSE_TIME;
    }

    getNextPeriod() {
        return this._lotterInfo.next.period;
    }

    getIdentify() {
        return this._openCaiType.IDENTIFY;
    }
}

module.exports = BonusPool;