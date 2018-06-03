const ERROR_OBJ = require('./error_code').ERROR_OBJ;
const config = require('./config');

/**
 * 小:0~13, 大:14~27
 * 小:0~13, 大:14~27
 * 极小:0~5, 极大:22~27
 */

class Ssc28BetParser {
    constructor() {
        this._splitReg = /.{1}/g;
        this._reg1 = /(^[大小单双]+)\/?([1-9][0-9]*)$/i;
        this._reg1_reverse = /(^[1-9][0-9]*)\/?([大小单双]+)$/i;
        this._reg2 = /^[梭]?哈([大小单双]+)$/i;
        this._reg3 = /(^对子)\/?([1-9][0-9]*)$/i;
        this._reg3_reverse = /(^[1-9][0-9]*)\/?(对子)$/i;
        this._reg4 = /(^顺子)\/?([1-9][0-9]*)$/i;
        this._reg4_reverse = /(^[1-9][0-9]*)\/?(顺子)$/i;
        this._reg5 = /(^豹子)\/?([1-9][0-9]*)$/i;
        this._reg5_reverse = /(^[1-9][0-9]*)\/?(豹子)$/i;
        this._reg6 = /(^[0-27]+)[点艹.操]{1}([1-9][0-9]*)$/i;
        this._reg7 = /(^极[大小]{1})\/?([1-9][0-9]*)$/i;
        this._reg7_reverse = /(^[1-9][0-9]*)\/?(极[大小]{1})$/i;
    }

    _checkType(betData) {
        let type = null;
        let checkResult = {
            splitData:null,
            reverse:false
        };

        for (; ;) {
            checkResult.splitData = betData.match(this._reg1);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.SIZE;
                break;
            }

            checkResult.splitData = betData.match(this._reg1_reverse);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.SIZE;
                checkResult.splitData.reverse = true;
                break;
            }

            checkResult.splitData = betData.match(this._reg2);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.HA_SIZE;
                break;
            }

            checkResult.splitData = betData.match(this._reg3);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.DUI;
                break;
            }

            checkResult.splitData = betData.match(this._reg3_reverse);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.DUI;
                checkResult.splitData.reverse = true;
                break;
            }

            checkResult.splitData = betData.match(this._reg4);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.SHUN;
                break;
            }

            checkResult.splitData = betData.match(this._reg4_reverse);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.SHUN;
                checkResult.splitData.reverse = true;
                break;
            }

            checkResult.splitData = betData.match(this._reg5);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.BAO;
                break;
            }

            checkResult.splitData = betData.match(this._reg5_reverse);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.BAO;
                checkResult.splitData.reverse = true;
                break;
            }

            checkResult.splitData = betData.match(this._reg6);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.DOT;
                break;
            }

            checkResult.splitData = betData.match(this._reg7);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.JI;
                break;
            }

            checkResult.splitData = betData.match(this._reg7_reverse);
            if (checkResult.splitData) {
                type = config.SSC28.BET_TYPE.JI;
                checkResult.splitData.reverse = true;
                break;
            }

            break;
        }

        return [type, checkResult];
    }

    _checkMoney(money) {
        if (isNaN(money) || money === 0) {
            return ERROR_OBJ.BET_AMOUNT_INVALID;
        }

        if (money < config.BET_MIN_MONEY) {
            return ERROR_OBJ.BET_AMOUNT_TOO_LOW;
        }
    }

    _handleSize(splitData, reverse) {
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

        let err = this._checkMoney(perMoney);
        if (err) {
            return [err];
        }

        for (let i = 0; i < types.length; ++i) {
            let item = {};
            item.result = types[i];
            item.money = perMoney;
            item.desc = `${item.result}${config.DES_SEPARATOR}${perMoney} `;
            parseResult.betItems.push(item);
            parseResult.total += perMoney;
        }

        return [null, parseResult];
    }

    _handleSuoHa(splitData, reverse) {
        let parseResult = {
            total: -1,
            betItems: []
        };

        let types = splitData[1].match(this._splitReg);
        for (let i = 0; i < types.length; ++i) {
            let item = {};
            item.result = types[i];
            item.money = -1;
            item.desc = `${item.result}${config.DES_SEPARATOR}${item.money} `;
            parseResult.betItems.push(item);
        }

        return [null, parseResult];
    }

    _handleDSBJI(splitData, reverse) {
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
            types = splitData[1]
        }

        let err = this._checkMoney(perMoney);
        if (err) {
            return [err];
        }

        let item = {};
        item.result = types;
        item.money = perMoney;
        item.desc = `${item.result}${config.DES_SEPARATOR}${perMoney} `;
        parseResult.betItems.push(item);
        parseResult.total += perMoney;

        return [null, parseResult];
    }

    _handleDot(splitData, reverse) {
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
        item.desc = `${item.result}${config.DES_SEPARATOR}ALL `;
        parseResult.betItems.push(item);
        parseResult.total += perMoney;

        return [null, parseResult];
    }

    parse(data){
        let parseRet = null;
        let [type, checkResult] = this._checkType(data);
        switch (type){
            case config.SSC28.BET_TYPE.SIZE:{
                parseRet = this._handleSize(checkResult.splitData, checkResult.reverse);
                break;
            }
            case config.SSC28.BET_TYPE.HA_SIZE:{
                parseRet = this._handleSuoHa(checkResult.splitData, checkResult.reverse);
                break;
            }
            case config.SSC28.BET_TYPE.DUI:
            case config.SSC28.BET_TYPE.SHUN:
            case config.SSC28.BET_TYPE.BAO:
            case config.SSC28.BET_TYPE.JI:{
                parseRet = this._handleDSBJI(checkResult.splitData, checkResult.reverse);
                break;
            }
            case config.SSC28.BET_TYPE.DOT:{
                parseRet = this._handleDot(checkResult.splitData, checkResult.reverse);
                break;
            }
            default:
                parseRet = [ERROR_OBJ.BET_DATA_INVALID];
                break;
        }
        return parseRet;
    }

}

module.exports = Ssc28BetParser;