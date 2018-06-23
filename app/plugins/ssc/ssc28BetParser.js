

const ERROR_OBJ = require('./error_code').ERROR_OBJ;
const config = require('./config');

/**
 * 小:0~13, 大:14~27
 * 小:0~13, 大:14~27
 * 极小:0~5, 极大:22~27
 */



class SSC28BetParser {
    constructor() {
        this._splitReg = /.{1}/g;
        this._reg1 = /(^[大小单双]+)\/?([1-9][0-9]*)$/i;
        this._reg1_reverse = /(^[1-9][0-9]*)\/?([大小单双]+)$/i;
        this._reg2 = /^([梭]?哈)([大小单双]+)$/i;
        this._reg3 = /(^对子)\/?([1-9][0-9]*)$/i;
        this._reg3_reverse = /(^[1-9][0-9]*)\/?(对子)$/i;
        this._reg4 = /(^顺子)\/?([1-9][0-9]*)$/i;
        this._reg4_reverse = /(^[1-9][0-9]*)\/?(顺子)$/i;
        this._reg5 = /(^豹子)\/?([1-9][0-9]*)$/i;
        this._reg5_reverse = /(^[1-9][0-9]*)\/?(豹子)$/i;
        this._reg6 = /(^[0-9]|[1][0-9]|[2][0-7])[点艹.操]{1}([1-9][0-9]*)$/i;
        this._reg7 = /(^极[大小]{1})\/?([1-9][0-9]*)$/i;
        this._reg7_reverse = /(^[1-9][0-9]*)\/?(极[大小]{1})$/i;
    }

    _handleBetData(betData, limitRate) {

        let parseResult = null;

        for (; ;) {
            let splitData = betData.match(this._reg1);
            if (splitData) {
                parseResult = this._handleSize(splitData, limitRate);
                break;
            }

            splitData = betData.match(this._reg1_reverse);
            if (splitData) {
                parseResult = this._handleSize(splitData, limitRate, true);
                break;
            }

            splitData = betData.match(this._reg2);
            if (splitData) {
                parseResult = this._handleSuoHa(splitData, limitRate);
                break;
            }

            splitData = betData.match(this._reg3);
            if (splitData) {
                parseResult = this._handleDSBJI(splitData, limitRate);
                if(!parseResult[0]){
                    parseResult[1].limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.DUI;
                }
                break;
            }

            splitData = betData.match(this._reg3_reverse);
            if (splitData) {
                parseResult = this._handleDSBJI(splitData, limitRate, true);
                if(!parseResult[0]){
                    parseResult[1].limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.DUI;
                }
                break;
            }

            splitData = betData.match(this._reg4);
            if (splitData) {
                parseResult = this._handleDSBJI(splitData, limitRate);
                if(!parseResult[0]){
                    parseResult[1].limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.SHUN;
                }

                break;
            }

            splitData = betData.match(this._reg4_reverse);
            if (splitData) {
                parseResult = this._handleDSBJI(splitData, limitRate, true);
                if(!parseResult[0]){
                    parseResult[1].limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.SHUN;
                }
                break;
            }

            splitData = betData.match(this._reg5);
            if (splitData) {
                parseResult = this._handleDSBJI(splitData, limitRate);
                if(!parseResult[0]){
                    parseResult[1].limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.BAO;
                }
                break;
            }

            splitData = betData.match(this._reg5_reverse);
            if (splitData) {
                parseResult = this._handleDSBJI(splitData, limitRate, true);
                if(!parseResult[0]){
                    parseResult[1].limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.BAO;
                }
                break;
            }

            splitData = betData.match(this._reg6);
            if (splitData) {
                parseResult = this._handleNum(splitData, limitRate);
                if(!parseResult[0]){
                    parseResult[1].limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.NUM;
                }
                break;
            }

            splitData = betData.match(this._reg7);
            if (splitData) {
                parseResult = this._handleDSBJI(splitData, limitRate);
                if(!parseResult[0]){
                    parseResult[1].limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.JI;
                }
                break;
            }

            splitData = betData.match(this._reg7_reverse);
            if (splitData) {
                parseResult = this._handleDSBJI(splitData, limitRate, true);
                if(!parseResult[0]){
                    parseResult[1].limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.JI;
                }
                break;
            }

            break;
        }

        return parseResult;
    }

    _checkMoney(money) {
        if (isNaN(money) || money === 0) {
            return ERROR_OBJ.BET_AMOUNT_INVALID;
        }
    }

    _handleSize(splitData, limitRate, reverse = false) {
        let parseResult = {
            total: 0,
            betItems: []
        };

        let perMoney = 0;
        let types = null;
        if (reverse) {
            perMoney = parseInt(splitData[1], 10);
            types = splitData[2].match(this._splitReg);
        } else {
            perMoney = parseInt(splitData[2], 10);
            types = splitData[1].match(this._splitReg);
        }

        if (types.length > 2) {
            return [ERROR_OBJ.BET_DATA_INVALID];
        }

        if (types.length == 2 && types[0] == types[1]) {
            return [ERROR_OBJ.BET_DATA_INVALID];
        }

        if (types.indexOf('单') != -1 && types.indexOf('双') != -1 || types.indexOf('大') != -1 && types.indexOf('小') != -1) {
            return [ERROR_OBJ.BET_DATA_INVALID];
        }

        if (types.length > 1) {
            parseResult.multi = 1;
            if (config.SSC28.BET_DIC_INDEX[types[0]] > config.SSC28.BET_DIC_INDEX[types[1]]) {
                let tmp = types[0];
                types[0] = types[1];
                types[1] = tmp;
            }
            parseResult.limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.MULTI;
        }else {
            parseResult.limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.SIZE;
        }

        let err = this._checkMoney(perMoney);
        if (err) {
            return [err];
        }

        let item = {};
        item.result = types.join('');
        item.money = perMoney;
        item.desc = `${item.result}${config.DES_SEPARATOR}${perMoney}`;
        parseResult.betItems.push(item);
        parseResult.total += perMoney;
        parseResult.rate_dic = limitRate.getRateDic(item.result);


        return [null, parseResult];
    }

    _handleSuoHa(splitData, limitRate) {
        let parseResult = {
            total: -1,
            betItems: []
        };

        let types = splitData[2].match(this._splitReg);

        if (types.length > 2) {
            return [ERROR_OBJ.BET_DATA_INVALID];
        }

        if (types.length == 2 && types[0] == types[1]) {
            return [ERROR_OBJ.BET_DATA_INVALID];
        }

        if (types.indexOf('单') != -1 && types.indexOf('双') != -1 || types.indexOf('大') != -1 && types.indexOf('小') != -1) {
            return [ERROR_OBJ.BET_DATA_INVALID];
        }

        if (types.size > 1) {
            parseResult.multi = 1;
            if (config.SSC28.BET_DIC_INDEX[types[0]] > config.SSC28.BET_DIC_INDEX[types[1]]) {
                let tmp = types[0];
                types[0] = types[1];
                types[1] = tmp;
            }
            parseResult.limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.MULTI;
        }else{
            parseResult.limit_dic = config.SSC28.BET_TYPE_LIMIT_DIC.SIZE;
        }

        let item = {};
        item.result = types.join('');
        item.money = -1;
        item.desc = `${item.result}${config.DES_SEPARATOR}-1`;
        parseResult.betItems.push(item);
        parseResult.rate_dic = limitRate.getRateDic(item.result);

        return [null, parseResult];
    }

    _handleDSBJI(splitData, limitRate, reverse) {
        let parseResult = {
            total: 0,
            betItems: []
        };

        let perMoney = 0;
        let types = null;
        if (reverse) {
            perMoney = parseInt(splitData[1], 10);
            types = splitData[2];
        } else {
            perMoney = parseInt(splitData[2], 10);
            types = splitData[1];
        }

        let err = this._checkMoney(perMoney);
        if (err) {
            return [err];
        }

        let item = {};
        item.result = types;
        item.money = perMoney;
        item.desc = `${item.result}${config.DES_SEPARATOR}${perMoney}`;
        parseResult.betItems.push(item);
        parseResult.total += perMoney;
        parseResult.rate_dic = limitRate.getRateDic(item.result);

        return [null, parseResult];
    }

    _handleNum(splitData, limitRate) {
        let parseResult = {
            total: 0,
            betItems: []
        };

        let types = splitData[1];
        let perMoney = parseInt(splitData[2], 10);
        let err = this._checkMoney(perMoney);
        if (err) {
            return [err];
        }

        let item = {};
        item.result = `${types}`;
        item.money = perMoney;
        item.desc = `${item.result}${config.DES_SEPARATOR}${perMoney}`;
        parseResult.betItems.push(item);
        parseResult.total += perMoney;
        parseResult.rate_dic = limitRate.getRateDic(item.result);
        return [null, parseResult];
    }

    parse(data, limitRate) {
        let parseRet = this._handleBetData(data, limitRate);
        if (!parseRet) {
            return [ERROR_OBJ.BET_DATA_INVALID];
        }
        return parseRet;
    }

}

module.exports = SSC28BetParser;