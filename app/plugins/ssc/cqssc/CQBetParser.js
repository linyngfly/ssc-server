/**
 * Created by linyng on 17-5-22.
 */

const ERROR_OBJ = require('../error_code').ERROR_OBJ;
const config = require('../config');
const CQBetDict = require('./CQBetDict');

class CQBetParser{
    constructor(){
        this._splitReg=/.{1}/g;
        this._reg1 = /(^[大小单双龙虎和合]+)\/?([1-9][0-9]*)$/i;
        this._reg2 = /(^[1-5]+)\/([大小单双0-9]+)\/([1-9][0-9]*)$/i; //1~5球数字的大小单双值玩法
        this._reg3 = /(^[0-9]+)\/([1-9][0-9]*)$/i; //包数字玩法
        this._reg4 = /(^[豹顺]+)子?\/?([1-9][0-9]*)$/i;
        this._reg5= /(^[豹顺]+)子?\/([0-9]+)\/([0-9]+)\/([0-9]+)$/i;
        this._reg6 = /(^[前中后])([豹顺])\/?([1-9][0-9]*)$/i;
        this._keyValue =['前','中','后'];

        this._CQBetDict = new CQBetDict();
        this._CQBetDict.init();
    }

    checkType(betData) {
        let type = config.CQSSC.BetType.UNKNOWN;
        if(betData.match(this._reg1)){
            type = config.CQSSC.BetType.SIZE;
        }else if(betData.match(this._reg2)){
            type = config.CQSSC.BetType.POS;
        }else if(betData.match(this._reg3)){
            type = config.CQSSC.BetType.NUM;
        }else if(betData.match(this._reg4)){
            type = config.CQSSC.BetType.BS1;
        }else if(betData.match(this._reg5)){
            type = config.CQSSC.BetType.BS2;
        }else if(betData.match(this._reg6)){
            type = config.CQSSC.BetType.BS3;
        }
        return type;
    }

    handleSize(betData) {
        let parseResult = {
            error:ERROR_OBJ.OK,
            total:0,
            betTypeInfo:{},
            betItems:[]
        };

        let result = betData.match(this._reg1);
        if(!result){
            parseResult.error = ERROR_OBJ.BET_TYPE_NOT_EXIST;
            return parseResult;
        }

        let perMoney = parseInt(result[2],10);
        if(isNaN(perMoney) || perMoney === 0){
            parseResult.error = ERROR_OBJ.BET_AMOUNT_INVALID;
            return parseResult;
        }

        let types = result[1].match(this._splitReg);
        for (let i = 0; i< types.length;++i){
            let betType = this._CQBetDict.get(types[i]);
            if(betType){
                let item = {};
                item.result = types[i];
                item.money = perMoney;
                item.type= betType;
                parseResult.betItems.push(item);

                parseResult.total+= perMoney;

                if(undefined === parseResult.betTypeInfo[betType.code]){
                    parseResult.betTypeInfo[betType.code]= {money:0,type:{}};
                    parseResult.betTypeInfo[betType.code].desc ="";
                }
                parseResult.betTypeInfo[betType.code].money += perMoney;
                parseResult.betTypeInfo[betType.code].type = betType;
                parseResult.betTypeInfo[betType.code].desc += `${item.result}/${perMoney} `;
            }
            else {
                parseResult.error = ERROR_OBJ.BET_DATA_INVALID;
                return parseResult;
            }
        }

        return parseResult;
    }

    handlePos(betData) {
        let parseResult = {
            error:ERROR_OBJ.OK,
            total:0,
            betTypeInfo:{},
            betItems:[]
        };

        let result = betData.match(this._reg2);
        if(!result){
            parseResult.error = ERROR_OBJ.BET_TYPE_NOT_EXIST;
            return parseResult;
        }

        let ballPos = result[1].match(this._splitReg);

        //投注位置1～5
        for(let i = 0; i< ballPos.length;++i){
            if(ballPos[i]> 5 ||ballPos[i]<=0){
                parseResult.error = ERROR_OBJ.BET_DATA_INVALID;
                return parseResult;
            }
        }

        let perMoney = parseInt(result[3],10);
        if(isNaN(perMoney) || perMoney === 0){
            parseResult.error = ERROR_OBJ.BET_AMOUNT_INVALID;
            return parseResult;
        }

        let types = result[2].match(this._splitReg);
        for (let j=0;j< ballPos.length;++j){
            for (let i = 0; i< types.length;i++){
                let betType = this._CQBetDict.get(types[i], ballPos[j]);
                if(betType){
                    let item = {};
                    item.type = betType;
                    item.result = ballPos[j] + config.BET_SEPARATOR + types[i];
                    item.money = perMoney;

                    parseResult.betItems.push(item);

                    parseResult.total+= perMoney;

                    if(undefined === parseResult.betTypeInfo[betType.code]){
                        parseResult.betTypeInfo[betType.code]= {money:0,type:{}};
                        parseResult.betTypeInfo[betType.code].desc ="";
                    }
                    parseResult.betTypeInfo[betType.code].money += perMoney;
                    parseResult.betTypeInfo[betType.code].type = betType;
                    parseResult.betTypeInfo[betType.code].desc += `${item.result}${config.DES_SEPARATOR}${perMoney} `;

                }else {
                    parseResult.error = ERROR_OBJ.BET_DATA_INVALID;
                    return parseResult;
                }
            }
        }

        return parseResult;
    }

    handleNum(betData) {
        let parseResult = {
            error:ERROR_OBJ.OK,
            total:0,
            betTypeInfo:{},
            betItems:[]
        };

        let result = betData.match(this._reg3);
        if(!result){
            parseResult.error = ERROR_OBJ.BET_TYPE_NOT_EXIST;
            return parseResult;
        }

        let perMoney = parseInt(result[2],10);
        if(isNaN(perMoney) || perMoney === 0){
            parseResult.error = ERROR_OBJ.BET_AMOUNT_INVALID;
            return parseResult;
        }

        let types = result[1].match(this._splitReg);
        for (let i = 0; i< types.length;++i){
            for (let j=1;j<=5;j++){
                let betType = this._CQBetDict.get(types[i], j);
                if(betType){
                    let tempItem = {};
                    tempItem.type = betType;
                    tempItem.result = j + config.BET_SEPARATOR + types[i];
                    tempItem.money = perMoney;
                    parseResult.betItems.push(tempItem);

                    parseResult.total+= perMoney;
                    if(undefined === parseResult.betTypeInfo[betType.code]){
                        parseResult.betTypeInfo[betType.code]= {money:0,type:{}};
                        parseResult.betTypeInfo[betType.code].desc ="";
                    }
                    parseResult.betTypeInfo[betType.code].money += perMoney;
                    parseResult.betTypeInfo[betType.code].type = betType;
                    parseResult.betTypeInfo[betType.code].desc += `${tempItem.result}${config.DES_SEPARATOR}${perMoney} `;
                }
                else {
                    parseResult.error = ERROR_OBJ.BET_DATA_INVALID;
                    return parseResult;
                }
            }
        }

        return parseResult;
    }

    handleBS1(betData) {
        let parseResult = {
            error:ERROR_OBJ.OK,
            total:0,
            betTypeInfo:{},
            betItems:[]
        };

        let result = betData.match(this._reg4);
        if(!result){
            parseResult.error = ERROR_OBJ.BET_TYPE_NOT_EXIST;
            return parseResult;
        }

        let perMoney = parseInt(result[2],10);
        if(isNaN(perMoney) || perMoney === 0){
            parseResult.error = ERROR_OBJ.BET_AMOUNT_INVALID;
            return parseResult;
        }

        let types = result[1].match(this._splitReg);
        for (let j=0;j<this._keyValue.length;j++){
            for (let i = 0; i< types.length;++i){
                let betType = this._CQBetDict.get(this._keyValue[j]+types[i]);
                if(betType){
                    let tempItem = {};
                    tempItem.type = betType;
                    tempItem.result = this._keyValue[j]+types[i];
                    tempItem.money = perMoney;
                    parseResult.betItems.push(tempItem);

                    parseResult.total+= perMoney;
                    if(undefined === parseResult.betTypeInfo[betType.code]){
                        parseResult.betTypeInfo[betType.code]= {money:0,type:{}};
                        parseResult.betTypeInfo[betType.code].desc ="";
                    }
                    parseResult.betTypeInfo[betType.code].money += tempItem.money;
                    parseResult.betTypeInfo[betType.code].type = betType;
                    parseResult.betTypeInfo[betType.code].desc += `${tempItem.result}${config.DES_SEPARATOR}${perMoney} `;
                }
                else {
                    parseResult.error = ERROR_OBJ.BET_DATA_INVALID;
                    return parseResult;
                }
            }
        }

        return parseResult;
    }

    handleBS2(betData) {
        let parseResult = {
            error:ERROR_OBJ.OK,
            total:0,
            betTypeInfo:{},
            betItems:[]
        };

        let result = betData.match(this._reg5);
        if(!result){
            parseResult.error = ERROR_OBJ.BET_TYPE_NOT_EXIST;
            return parseResult;
        }


        let perMoneys = [];
        perMoneys.push(Number(result[2]));
        perMoneys.push(Number(result[3]));
        perMoneys.push(Number(result[4]));

        let sum =  perMoneys.reduce(function (previous, current) {
            return previous + current;
        });

        if(isNaN(sum) || sum === 0){
            parseResult.error = ERROR_OBJ.BET_AMOUNT_INVALID;
            return parseResult;
        }

        let types = result[1].match(this._splitReg);
        for (let j=0;j<this._keyValue.length;j++){
            for (let i = 0; i< types.length;++i){
                let betType = this._CQBetDict.get(this._keyValue[j]+types[i]);
                if(betType){
                    let tempItem = {};
                    tempItem.type = betType;
                    tempItem.result = this._keyValue[j]+types[i];
                    tempItem.money = perMoneys[j];

                    if(tempItem.money === 0) continue;
                    parseResult.betItems.push(tempItem);

                    parseResult.total+= tempItem.money;
                    if(undefined === parseResult.betTypeInfo[betType.code]){
                        parseResult.betTypeInfo[betType.code]= {money:0,type:{}};
                        parseResult.betTypeInfo[betType.code].desc ="";
                    }
                    parseResult.betTypeInfo[betType.code].money += tempItem.money;
                    parseResult.betTypeInfo[betType.code].type = betType;
                    parseResult.betTypeInfo[betType.code].desc += `${tempItem.result}${config.DES_SEPARATOR}${tempItem.money} `;
                }
                else {
                    parseResult.error = ERROR_OBJ.BET_DATA_INVALID;
                    return parseResult;
                }
            }
        }

        return parseResult;
    }

    handleBS3(betData) {
        let parseResult = {
            error:ERROR_OBJ.OK,
            total:0,
            betTypeInfo:{},
            betItems:[]
        };

        let result = betData.match(this._reg6);
        if(!result){
            parseResult.error = ERROR_OBJ.BET_TYPE_NOT_EXIST;
            return parseResult;
        }

        let perMoney = parseInt(result[3],10);
        if(isNaN(perMoney) || perMoney === 0){
            parseResult.error = ERROR_OBJ.BET_AMOUNT_INVALID;
            return parseResult;
        }

        let key = result[1];
        let type = result[2];
        let betType = this._CQBetDict.get(key+type);
        if(!betType){
            parseResult.error = ERROR_OBJ.BET_DATA_INVALID;
            return parseResult;
        }

        let tempItem = {};
        tempItem.type = betType;
        tempItem.result = key + type;
        tempItem.money = perMoney;
        parseResult.betItems.push(tempItem);

        parseResult.total+= perMoney;
        if(undefined === parseResult.betTypeInfo[betType.code]){
            parseResult.betTypeInfo[betType.code]= {money:0,type:{}};
            parseResult.betTypeInfo[betType.code].desc ="";
        }
        parseResult.betTypeInfo[betType.code].money += tempItem.money;
        parseResult.betTypeInfo[betType.code].type = betType;
        parseResult.betTypeInfo[betType.code].desc += `${tempItem.result}${config.DES_SEPARATOR}${perMoney} `;

        return parseResult;
    }

    parse(data, cb){

        let parseRet = null;
        switch (this.checkType(data)){
            case config.CQSSC.BetType.SIZE:{
                parseRet = this.handleSize(data);
            }
                break;
            case config.CQSSC.BetType.POS:{
                parseRet = this.handlePos(data);
            }
                break;
            case config.CQSSC.BetType.NUM:{
                parseRet = this.handleNum(data);
            }
                break;
            case config.CQSSC.BetType.BS1:{
                parseRet = this.handleBS1(data);
            }
                break;
            case config.CQSSC.BetType.BS2:{
                parseRet = this.handleBS2(data);
            }
                break;
            case config.CQSSC.BetType.BS3:{
                parseRet = this.handleBS3(data);
            }
                break;
            default:
                parseRet = {error:ERROR_OBJ.BET_TYPE_NOT_EXIST};
                break;
        }

        if(!!parseRet && parseRet.error.code === ERROR_OBJ.OK.code){
            cb(null, parseRet);
        }
        else {
            cb(parseRet.error, null);
        }
    }
}

module.exports = CQBetParser;

/**
 * 重庆时时彩玩法说明（5个数字）
 * 1. 投注总数大于50注，开始计入排行（这个是投注数量，不是金额）。
 * 2. 提款密码和手机号是完善个人资料里面填写，提款时客服需要核对玩家个人信息。
 * 3. 开奖时间每天 早10:00-晚10：00.每10分钟一局 晚10：05-2:00是每5分钟一局，共120期
 * 4. 投注方式
 * 1） 总和大小—5位数字相加大于等于23为大，反之为小。识别方式（  大100  小100 ）数字为金额
 * 2） 总和单双—5位数字相加为奇数及为单 偶数为双。识别方式为（ 单100  双100）如果买总和大 单各100 识别方式为（ 大单100）类推小单各60元 识别方式（小单60）
 * 3） 龙虎玩法 及1球比5球大为龙 及50981 一球为5 五球为1 一球比五球大 及是龙。反之为虎。识别方式（龙100 虎100）
 * 4） 和 的玩法 及 一球和五球数字相同为和 例如50985 一球和五球都为5 识别方式（和100 合100）如果玩家买 大 单 龙 和 各60元识别方式（大单龙和60）如果玩家买 单 龙 和
 * 各100元识别方式（单龙和100 一共投注3注 投注金300元）以此类推
 * 5） 数字玩法 例如1球买8, 100元 识别方式（1/8/100）类推3球买5 ,50元 识别方式（3/5/50）例如4球买6,8各50 即 4球买6 ,50元 4球买8 ,50元
 * 识别方式（4/68/50）类推5球买789各60 识别方式（5/789/60）如果玩家买1，2，3球7各100元  识别方式（123/7/100）。如果玩家买3，4球买数字6 和8各100元
 * 识别方式（34/68/100 一共投注4注 投注金400元）以此类推 混合买法 124/大单579/90 代表 1，2，4球买 大 单 各90元 买 数字5 7 9 各90元  此注一共15注  投注额 1350元
 * 6） 每位数字的大小单双 0-4为小 5-9为大 0 2 4 6 8为双 1 3 5 7 9为单 识别方式（1／单／100 及 1球买单 100元 以此类推 3／大／100 及 3球买大 100元）如果玩家买
 * 1球大双各100 识别方式（1／大双／100 一共投注2注 投注金200元）以此类推
 * 7） 包数字玩法  如果玩家每个球买8  100元及1-5球都买数字8 100元，共下注5注每注100元。，1-5球任意出一个及中奖，出一个中一个，出两个中两个  识别方式（8/100 一共投注5注 投注金500元
 * 75/100 代表 包数字 7 和 5 各100元 一共投注10注 投注额1000元）
 * 8） 顺子豹子玩法 顺子及3个数字连号为顺子 例如 345 543 354 都为顺子 豹子及3个数字相同为豹子 例如 888 为豹子  顺子和豹子分为前 中 后  例如开奖号码35401 前面3位数字354相连
 * 为前顺子，以此类推 20915 为中顺子  12890为后顺子  21354 为前顺子和后顺子  10219 为前顺子 中顺子  01234为前顺子 中顺子 后顺子，豹子例如88809 为前豹子   90111为前顺子
 * 后豹子 17770为中豹子  88880为前豹子和中豹子 77777为前豹子中豹子后豹子 识别方式（豹100 代表前中后豹子各买100  豹／100/50/80 代表前豹子 100元 中豹子50 元 后豹子 80元
 * 顺100 代表前中后顺子各100元  顺／100/0/70 代表前顺子100元 中顺子0 元 后顺子 70元  豹顺100  代表前中后顺子和豹子各买100元 一共下注6注 投注金600元）
 *
 * 9） 所有的投注方式赔率可以后台设置和修改，每种下注玩家单注限额可以设置，总下注金额限制可设置。例如 总和大小单双  每个玩家下注金额限制8k元  整个平台下注金额限制2w 即 张三下注
 * 总和大不能超过8k  张三下注大8000 李四下注 大8000  王五只能下注 大4000.这样限制方式是分别针对每一个单项下注方式来设定。例如 龙虎玩法 玩家限额5k 平台总限制2w  豹子玩法 玩家
 * 单注限额300 总平台限额1200
 * 5. 反水比例
 * 1） 合作伙伴反水10% 15% 20% 25%30% 35%40% 每5%为一个等级
 * 2） 玩家反水按照当日 玩家输钱金额（》=50）计算 1%-5%每 0.5%为一个等级
 *
 * 6. 管理员后台
 * 方便客服人员给玩家充值和下分，并需要显示每个玩家的信息，包括当日输赢情况，充值下分情况，反水情况。下注情况，历史数据，每个玩家发展下线列表和数据。
 * 7. 每个玩家输入推荐人id后，不能再输入其推荐人的id。及每个玩家只能输入一次推荐人id。
 *
 *
 * 玩家信息显示：
 * 昵称    投注      剩余可投注数（整个平台）
 * 张三：单1000  （剩余19000）
 * 李四：单5000  （剩余14000）
 * 王五：豹子100 （剩余 900/900/900）
 * 赵六：豹子／100/50/200  （剩余 800/850/700）
 *
 * 大小单双龙虎   1.9~2.0  0.1一级
 * 顺子    10~20  1.0一级
 * 豹子   60~90  5.0一级
 * 数字（包数字，买数字）    9~10   0.5一级
 * 和    9~10   0.5一级
 * 计算玩家盈利：投注额×赔率-本金=盈利
 * 中奖结果显示的的时候直接在投注对话框显示盈利
 * *
 */
