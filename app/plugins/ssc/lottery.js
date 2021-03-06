const EventEmitter = require('events').EventEmitter;
const Countdown = require('../../utils/countdown');
const config = require('./config');
const moment = require('moment');

const TASK_DT = 100;

class Lottery extends EventEmitter {
    constructor(opts) {
        super();
        this._lotteryApi = opts.lotteryApi;
        this._openCaiType = opts.openCaiType;
        this._countdown = new Countdown(this.countdownNotify.bind(this));
        this._canRun = true;
        this._lotterInfo = null;
    }

    get lotteryInfo(){
        return this._lotterInfo;
    }

    countdownNotify(dt) {
        this.emit(config.LOTTERY_EVENT.TICK_COUNT, dt/1000);
    }

    _handleLotteryInfo(lotteryInfo){
        //TODO 开奖了
        this.emit(config.LOTTERY_EVENT.OPEN_AWARD, lotteryInfo);
        if(lotteryInfo.enable){
            let nextTime = moment(lotteryInfo.next.opentime).format('x');
            let free = nextTime - moment().format('x');
            free = Math.max(free, 0);
            this._countdown.reset(Math.floor(free/1000)*1000);
        }else {
            this._countdown.reset(lotteryInfo.next.interval);
        }


    }

    //处理业务
    async update() {
        try {
            let lotteryInfo = await this._lotteryApi.getLotteryInfo(this._openCaiType);
            if(!lotteryInfo){

                // throw new Error('lotteryInfo is null');
                return;
            }

            if(lotteryInfo.next.period != lotteryInfo.last.period+1 &&  lotteryInfo.last.period != lotteryInfo.pre.period + 2){
                throw new Error('lotteryInfo is invalid');
                // return;
            }

            if (!this._lotterInfo || this._lotterInfo.next.period <= lotteryInfo.last.period) {
                this._handleLotteryInfo(lotteryInfo);
                this._lotterInfo = lotteryInfo;
            }
            // logger.error('获取开奖数据this._lotterInfo.next.period = ', this._lotterInfo.next.period);
            // logger.error('lotteryInfo.last.period = ', lotteryInfo.last.period);
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

}
module.exports = Lottery;