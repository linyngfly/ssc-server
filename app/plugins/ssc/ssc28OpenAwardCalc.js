const config = require('./config');

class Ssc28OpenAwardCalc {
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
        this._valueCalc();
        this._duiziCalc();
        this._pantherCalc();
        this._shunZiCalc();
        return this._openResult;
    }

    // 和大小计算 大>=14  小<=13
    _totalSizeCalc() {
        this._openResult.add(this._total >= 14 ? config.SSC28.BET_DIC.BIG : config.SSC28.BET_DIC.SMALL);
        if(this._total >= 22){
            this._openResult.add(config.SSC28.BET_DIC.JIDA)
        }

        if(this._total <= 5){
            this._openResult.add(config.SSC28.BET_DIC.JIXIAO)
        }
    }

    // 和单双计算
    _totalSingleDoubleCalc() {
        this._openResult.add(this._total % 2 === 0 ? config.SSC28.BET_DIC.DOUBLE : config.SSC28.BET_DIC.SINGLE);
    }

    //球大小单双 0-4 小 5-9 大
    _valueCalc() {
        for (let i = 0; i < this._numbers.length; ++i) {
            this._openResult.add(this._numbers[i]);
        }
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

    _duiziCalc(){
        let sortNumbers = this._numbers.sort(function (a, b) {
            return a - b;
        });

        if(sortNumbers[0] == sortNumbers[1] || sortNumbers[1] == sortNumbers[2]){
            this._openResult.add(config.SSC28.BET_DIC.DUI);
        }
    }
}

module.exports = Ssc28OpenAwardCalc;