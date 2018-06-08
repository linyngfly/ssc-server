const config = require('./config');
const moment = require('moment');
const utils = require('../../utils/utils');

class Turntable {
    constructor() {
        this._balance = 0;
        this._startTime = moment();
    }

    randomGetAward(awardList) {
        if (!awardList || awardList.length == 0) {
            return null;
        }

        let rates = [];
        for (let i = 0; i < awardList.length; i++) {
            rates.push(awardList[i].rate * 100);
        }
        let range = [];
        rates.reduce(function (pre, item) {
            range.push(pre + item);
            return pre + item;
        }, 0);

        let rnd = utils.random_int(0, 100);
        console.log('rnd=', rnd);

        let awardIndex = 0;
        for (let i = 0; i < range.length; i++) {
            if (range[i] > rnd) {
                awardIndex = i;
                break;
            }
        }

        return awardList[awardIndex].money;
    }

    // lottery() {
    //
    // }

    getDraw() {
        // this._getCount ++;

        //时间片数
        // let startTime = moment();
        // startTime.hour(0);
        // startTime.minute(0);
        let startTime = Number(this._startTime.format('x'));

        let endTime = moment();
        endTime.hour(23);
        endTime.minute(59);
        endTime = Number(endTime.format('x'));

        let now = Number(moment().format('x'));
        let deltaTime = Math.floor(Number((endTime - startTime)/config.TURNTABLE.TOTAL));

        let releaseTime = startTime + Math.floor(this._balance)*deltaTime + utils.random_int(0, deltaTime);

        let money = this.randomGetAward(config.TURNTABLE.AWARD);

        // console.log(now, releaseTime);

        if(now < releaseTime){
            // console.log('中奖时间片段未到');
            return 0;
        }

        this._balance += money;

        return money;
    }
}

// let tt = new Turntable();
//
// setInterval(function () {
//     console.log(tt.getDraw());
// }, 1000);


module.exports = new Turntable();