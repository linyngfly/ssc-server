/**
 * Created by linyng on 17-5-23.
 */

var logger = require('pomelo-logger').getLogger('bearcat-lottery', 'calcOpenLottery');

function CalcOpenLottery() {
}

CalcOpenLottery.prototype.init = function () {
    this.openCodeResult = new Set();
}

// 和大小计算 大>=23  小<23
CalcOpenLottery.prototype.totalSizeCalc = function (numbers) {

    var total = 0;
    for (var i = 0; i<numbers.length;++i){
        total += parseInt(numbers[i],10);
    }
    this.openCodeResult.add(total >= 23 ? this.consts.BetDic.BIG:this.consts.BetDic.SMALL);

};

// 和单双计算
CalcOpenLottery.prototype.totalSingleDoubleCalc = function (numbers) {
    var total = 0;
    for (var i = 0; i<numbers.length;++i){
        total += parseInt(numbers[i],10);
    }
    this.openCodeResult.add(total%2 === 0 ? this.consts.BetDic.DOUBLE:this.consts.BetDic.SINGLE);
};

// 龙虎计算 龙 1>5 虎 1<5
CalcOpenLottery.prototype.dragonAndTigerCalc = function (numbers) {
    var number1 = numbers[0];
    var number5 = numbers[4];

    if(number1 === number5){
        return;
    }
    this.openCodeResult.add(number1 > number5 ? this.consts.BetDic.DRAGON:this.consts.BetDic.TIGER);
};

// 合玩法 1=5
CalcOpenLottery.prototype.equal15Calc = function (numbers) {
    var number1 = numbers[0];
    var number5 = numbers[4];
    if(number1 === number5){
    this.openCodeResult.add(this.consts.BetDic.EQUAL1);
    this.openCodeResult.add(this.consts.BetDic.EQUAL2);
    }
};

//球大小单双 0-4 小 5-9 大
CalcOpenLottery.prototype.perPosSizeSingleDoubleCalc = function (numbers) {
    for (var i = 0; i<numbers.length;++i){
        var num = parseInt(numbers[i],10);
        var size = num <=4 ? ((i+1)+this.consts.BET_SEPARATOR+this.consts.BetDic.SMALL):((i+1)+this.consts.BET_SEPARATOR+this.consts.BetDic.BIG);

        var sd = num%2 === 0?((i+1)+this.consts.BET_SEPARATOR+this.consts.BetDic.DOUBLE):((i+1)+this.consts.BET_SEPARATOR+this.consts.BetDic.SINGLE);

        this.openCodeResult.add(size);
        this.openCodeResult.add(sd);
    }
};

//球值
CalcOpenLottery.prototype.perPosValueCalc = function (numbers) {
    for (var i = 0; i<numbers.length;++i){
        var vals = (i+1)+this.consts.BET_SEPARATOR+numbers[i];
        this.openCodeResult.add(vals);
    }
};

//包数字
CalcOpenLottery.prototype.containValueCalc = function (numbers) {
    for (var i = 0; i<numbers.length;++i){
        var vals = (i+1)+this.consts.BET_SEPARATOR+numbers[i];
        this.openCodeResult.add(vals);
    }
};

//豹子：连续3球相同
CalcOpenLottery.prototype.pantherCalc = function (numbers) {
    if(numbers[0] === numbers[1] && numbers[1]=== numbers[2]){
        this.openCodeResult.add(this.consts.BetBSPos.BEGIN + this.consts.BetDic.BAO);
    }

    if(numbers[1] === numbers[2] && numbers[2]=== numbers[3]){
        this.openCodeResult.add(this.consts.BetBSPos.MID + this.consts.BetDic.BAO);
    }

    if(numbers[2] === numbers[3] && numbers[3]=== numbers[4]){
        this.openCodeResult.add(this.consts.BetBSPos.END + this.consts.BetDic.BAO);
    }
};

// 顺子：连子
CalcOpenLottery.prototype.checkShunZi = function (numbers) {
    var sortNumbers =  numbers.sort(function (a, b) {
        return a-b;
    });

    if(sortNumbers[2] === 9 && sortNumbers[1] === 1 && sortNumbers[0] === 0){
        return true;
    }

    if(sortNumbers[2] === 9 && sortNumbers[1] === 8 && sortNumbers[0] === 0){
        return true;
    }

    if((sortNumbers[0] + 1) === sortNumbers[1] && (sortNumbers[1] + 1) === sortNumbers[2]){
        return true;
    }

    return false;
}

CalcOpenLottery.prototype.shunZiCalc = function (numbers) {
    if(this.checkShunZi([Number(numbers[0]),Number(numbers[1]),Number(numbers[2])])){
        this.openCodeResult.add(this.consts.BetBSPos.BEGIN + this.consts.BetDic.SHUN);
    }

    if(this.checkShunZi([Number(numbers[1]),Number(numbers[2]),Number(numbers[3])])){
        this.openCodeResult.add(this.consts.BetBSPos.MID + this.consts.BetDic.SHUN);
    }

    if(this.checkShunZi([Number(numbers[2]),Number(numbers[3]),Number(numbers[4])])){
        this.openCodeResult.add(this.consts.BetBSPos.END + this.consts.BetDic.SHUN);
    }
};

CalcOpenLottery.prototype.calc = function (numbers) {
    this.init();
    this.totalSizeCalc(numbers);
    this.totalSingleDoubleCalc(numbers);
    this.dragonAndTigerCalc(numbers);
    this.equal15Calc(numbers);
    this.perPosSizeSingleDoubleCalc(numbers);
    this.perPosValueCalc(numbers);
    this.containValueCalc(numbers);
    this.pantherCalc(numbers);
    this.shunZiCalc(numbers);

    return this.openCodeResult;
}

module.exports ={
    id:"calcOpenLottery",
    func:CalcOpenLottery,
    props:[
        {name:'consts', ref:'consts'}
    ]
}