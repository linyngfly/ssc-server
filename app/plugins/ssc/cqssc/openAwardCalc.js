const config = require('../config');

class OpenAwardCalc {
    constructor(numbers) {
        this._numbers = numbers;
        this._total = this._numbers.reduce(function (pre, cur) {
            return Number(pre) + Number(cur);
        }, 0);
        this._openResult = new Set();
    }

    calc(){
        this._totalSizeCalc();
        this._totalSingleDoubleCalc();
        this._dragonAndTigerCalc();
        this._equal15Calc();
        this._perPosSizeSingleDoubleCalc();
        this._perPosValueCalc();
        this._containValueCalc();
        this._pantherCalc();
        this._shunZiCalc();
        return this._openResult;
    }

    // 和大小计算 大>=23  小<23
    _totalSizeCalc() {
        this._openResult.add(this._total >= 23 ? config.CQSSC.BET_DIC.BIG : config.CQSSC.BET_DIC.SMALL);
    }

    // 和单双计算
    _totalSingleDoubleCalc() {
        this._openResult.add(this._total % 2 === 0 ? config.CQSSC.BET_DIC.DOUBLE : config.CQSSC.BET_DIC.SINGLE);
    }

    // 龙虎计算 龙 1球 > 5球 虎 1球 < 5球
    _dragonAndTigerCalc() {
        let number1 = this._numbers[0];
        let number5 = this._numbers[4];

        if (number1 === number5) {
            return;
        }
        this._openResult.add(number1 > number5 ? config.CQSSC.BET_DIC.DRAGON : config.CQSSC.BET_DIC.TIGER);
    }

    // 合玩法 1球=5球
    _equal15Calc() {
        let number1 = this._numbers[0];
        let number5 = this._numbers[4];
        if (number1 === number5) {
            this._openResult.add(config.CQSSC.BET_DIC.EQUAL1);
            this._openResult.add(config.CQSSC.BET_DIC.EQUAL2);
        }
    }

    //球大小单双 0-4 小 5-9 大
    _perPosSizeSingleDoubleCalc() {
        for (let i = 0; i < this._numbers.length; ++i) {
            let num = parseInt(this._numbers[i], 10);
            let size = num <= 4 ? ((i + 1) + config.CQSSC.BET_SEPARATOR + config.CQSSC.BET_DIC.SMALL) : ((i + 1) + config.CQSSC.BET_SEPARATOR + config.CQSSC.BET_DIC.BIG);

            let sd = num % 2 === 0 ? ((i + 1) + config.CQSSC.BET_SEPARATOR + config.CQSSC.BET_DIC.DOUBLE) : ((i + 1) + config.CQSSC.BET_SEPARATOR + config.CQSSC.BET_DIC.SINGLE);

            this._openResult.add(size);
            this._openResult.add(sd);
        }
    }

    //球值
    _perPosValueCalc() {
        for (let i = 0; i < this._numbers.length; ++i) {
            let val = (i + 1) + config.CQSSC.BET_SEPARATOR + this._numbers[i];
            this._openResult.add(val);
        }
    }

    //包数字
    _containValueCalc() {
        for (let i = 0; i < this._numbers.length; ++i) {
            let val = (i + 1) + config.CQSSC.BET_SEPARATOR + this._numbers[i];
            this._openResult.add(val);
        }
    }

    //豹子：连续3球相同
    _pantherCalc() {
        if (this._numbers[0] === this._numbers[1] && this._numbers[1] === this._numbers[2]) {
            this._openResult.add(config.CQSSC.BetBSPos.BEGIN + config.CQSSC.BET_DIC.BAO);
        }

        if (this._numbers[1] === this._numbers[2] && this._numbers[2] === this._numbers[3]) {
            this._openResult.add(config.CQSSC.BetBSPos.MID + config.CQSSC.BET_DIC.BAO);
        }

        if (this._numbers[2] === this._numbers[3] && this._numbers[3] === this._numbers[4]) {
            this._openResult.add(config.CQSSC.BetBSPos.END + config.CQSSC.BET_DIC.BAO);
        }
    }


    // 顺子：连子
    checkShunZi() {
        let sortNumbers = this._numbers.sort(function (a, b) {
            return a - b;
        });

        if (sortNumbers[2] === 9 && sortNumbers[1] === 1 && sortNumbers[0] === 0) {
            return true;
        }

        if (sortNumbers[2] === 9 && sortNumbers[1] === 8 && sortNumbers[0] === 0) {
            return true;
        }

        if ((sortNumbers[0] + 1) === sortNumbers[1] && (sortNumbers[1] + 1) === sortNumbers[2]) {
            return true;
        }

        return false;
    }

    _shunZiCalc() {
        if (this.checkShunZi([Number(this._numbers[0]), Number(this._numbers[1]), Number(this._numbers[2])])) {
            this._openResult.add(config.CQSSC.BetBSPos.BEGIN + config.CQSSC.BET_DIC.SHUN);
        }

        if (this.checkShunZi([Number(this._numbers[1]), Number(this._numbers[2]), Number(this._numbers[3])])) {
            this._openResult.add(config.CQSSC.BetBSPos.MID + config.CQSSC.BET_DIC.SHUN);
        }

        if (this.checkShunZi([Number(this._numbers[2]), Number(this._numbers[3]), Number(this._numbers[4])])) {
            this._openResult.add(config.CQSSC.BetBSPos.END + config.CQSSC.BET_DIC.SHUN);
        }
    }
}

module.exports = OpenAwardCalc;