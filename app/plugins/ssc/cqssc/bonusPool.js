const CQLotteryApi = require('./CQLotteryApi');
const Countdown = require('../../../utils/countdown');
const EventEmitter = require('events').EventEmitter;
const config = require('../config');
const moment = require('moment');

const TASK_DT = 100;

class BonusPool extends EventEmitter {
    constructor() {
        super();
        this._cqLotteryApi = new CQLotteryApi();
        this._countdown = new Countdown(this.countdownNotify.bind(this));
        this._canRun = true;
        this._lotterInfo = null;
        this._task_dt_count = 0;
    }

    countdownNotify(dt) {
        this.emit(config.LOTTERY_EVENT.TICK_COUNT, dt/1000);
    }


    //处理业务
    async update() {
        this._task_dt_count++;
        if (this._task_dt_count >= 30 || this._lotterInfo == null) {
            try {
                let lotteryInfo = await this._cqLotteryApi.getLotteryInfo();
                if(!lotteryInfo){
                    throw new Error('lotteryInfo is null');
                }

                if(lotteryInfo.next.period != lotteryInfo.last.period+1 &&  lotteryInfo.last.period != lotteryInfo.pre.period + 2){
                    throw new Error('lotteryInfo is invalid');
                }

                logger.error('getLotteryInfo=', lotteryInfo);
                if (!this._lotterInfo || this._lotterInfo.next.period == lotteryInfo.last.period) {
                    //TODO 开奖了
                    this.emit(config.LOTTERY_EVENT.OPEN_AWARD, lotteryInfo);
                    let nextTime = moment(lotteryInfo.next.opentime).format('x');
                    let free = nextTime - moment().format('x');
                    logger.error('free =', free);
                    this._countdown.reset(Math.floor(free/1000)*1000);
                    this._lotterInfo = lotteryInfo;
                }

                this._task_dt_count = 0;
            } catch (err) {
                logger.error('获取开奖数据异常，err=', err);
                this._task_dt_count = 10;
            }
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
        return true;
    }

    getNextPeriod() {
        return '2018032323';
    }

    getIdentify() {
        return ';';
    }
}

module.exports = BonusPool;