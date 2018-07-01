const config = require('./config');

class Ssc28OpenAwardCalc {
    constructor(numbers) {
        this._numbers = numbers;
        this._total = this._numbers.reduce(function (pre, cur) {
            return Number(pre) + Number(cur);
        }, 0);
        this._openResult = new Set();
    }

    get openResult() {
        return this._openResult;
    }

    get sum() {
        return this._total;
    }

    calc() {
        this._totalSizeCalc();
        this._totalSingleDoubleCalc();
        this._valueCalc();
        this._multiCalc();
        this._duiziCalc();
        this._pantherCalc();
        this._shunZiCalc();
    }

    // 和大小计算 大>=14  小<=13
    _totalSizeCalc() {
        this._openResult.add(this._total >= 14 ? config.SSC28.BET_DIC.BIG : config.SSC28.BET_DIC.SMALL);
        if (this._total >= 22) {
            this._openResult.add(config.SSC28.BET_DIC.JIDA);
        }

        if (this._total <= 5) {
            this._openResult.add(config.SSC28.BET_DIC.JIXIAO);
        }
    }

    // 和单双计算
    _totalSingleDoubleCalc() {
        this._openResult.add(this._total % 2 === 0 ? config.SSC28.BET_DIC.DOUBLE : config.SSC28.BET_DIC.SINGLE);
    }

    _multiCalc() {
        if (this._total >= 14) {
            this._openResult.add(this._total % 2 === 0 ? config.SSC28.BET_DIC.BIG_DOUBLE : config.SSC28.BET_DIC.BIG_SINGLE);
        } else {
            this._openResult.add(this._total % 2 === 0 ? config.SSC28.BET_DIC.SMALL_DOUBLE : config.SSC28.BET_DIC.SMALL_SINGLE);
        }
    }

    //球值计数
    _valueCalc() {
        this._openResult.add(this._total.toString());
    }


    //豹子：连续3球相同
    _pantherCalc() {
        if (this._numbers[0] === this._numbers[1] && this._numbers[1] === this._numbers[2]) {
            this._openResult.add(config.SSC28.BET_DIC.BAO);
        }
    }


    // 顺子：连子
    _checkShunZi() {
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
        if (this._checkShunZi()) {
            this._openResult.add(config.SSC28.BET_DIC.SHUN);
        }
    }

    _duiziCalc() {
        let sortNumbers = this._numbers.sort(function (a, b) {
            return a - b;
        });

        if (sortNumbers[0] == sortNumbers[1] || sortNumbers[1] == sortNumbers[2]) {
            this._openResult.add(config.SSC28.BET_DIC.DUI);
        }
    }
}

const tt = new Ssc28OpenAwardCalc([4,4,4]);
tt.calc();
console.log(tt.openResult);

module.exports = Ssc28OpenAwardCalc;