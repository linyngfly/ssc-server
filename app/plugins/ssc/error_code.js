const ERROR_CODE = require('../../consts/error_code').ERROR_CODE;
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;

const _errorCode = {
    QUERY_LOTTERY_INFO_ERROR: 10000, //查询开奖信息失败
    BET_TYPE_NOT_EXIST: 10001, //投注类型不存在
    BET_SINGLE_LIMIT: 10002, //单注投注金额超限
    BET_PLAYER_LIMIT: 10003, //玩家投注金额超限
    BET_PLATFORM_LIMIT: 10004, //平台投注金额超限
    LOTTERY_PERIOD_INVALID: 10005, //开奖期数无效
    BET_STATE_EXCEPTION: 10006, //投注状态异常
    BET_AMOUNT_INVALID: 10007, //投注金额无效
    BET_CHANNEL_CLOSE: 10008, //本期投注已关闭
    BET_DATA_INVALID: 10009, //投注数据无效
    PLAYER_NOT_IN_HALL: 10010, //玩家已经不在投注大厅，重新加入
};

for (let item in ERROR_CODE) {
    _errorCode[item] = ERROR_CODE[item];
}

const _errorObj = {

    QUERY_LOTTERY_INFO_ERROR: {
        msg: '查询开奖信息失败',
        code: _errorCode.QUERY_LOTTERY_INFO_ERROR,
    },
    BET_TYPE_NOT_EXIST: {
        msg: '投注类型不存在',
        code: _errorCode.BET_TYPE_NOT_EXIST,
    },
    BET_SINGLE_LIMIT: {
        msg: '单注投注金额超限',
        code: _errorCode.BET_SINGLE_LIMIT,
    },
    BET_PLAYER_LIMIT: {
        msg: '玩家投注金额超限',
        code: _errorCode.BET_PLAYER_LIMIT,
    },
    BET_PLATFORM_LIMIT: {
        msg: '平台投注金额超限',
        code: _errorCode.BET_PLATFORM_LIMIT,
    },

    LOTTERY_PERIOD_INVALID: {
        msg: '开奖期数无效',
        code: _errorCode.LOTTERY_PERIOD_INVALID,
    },
    BET_STATE_EXCEPTION: {
        msg: '投注状态异常',
        code: _errorCode.BET_STATE_EXCEPTION,
    },
    BET_AMOUNT_INVALID: {
        msg: '投注金额无效',
        code: _errorCode.BET_AMOUNT_INVALID,
    },
    BET_CHANNEL_CLOSE: {
        msg: '本期投注已关闭',
        code: _errorCode.BET_CHANNEL_CLOSE,
    },
    BET_DATA_INVALID: {
        msg: '投注数据无效',
        code: _errorCode.BET_DATA_INVALID,
    },
    PLAYER_NOT_IN_HALL: {
        msg: '玩家已经不在投注大厅，重新加入',
        code: _errorCode.PLAYER_NOT_IN_HALL,
    },
};

for (let item in ERROR_OBJ) {
    _errorObj[item] = ERROR_OBJ[item];
}

module.exports.ERROR_CODE = _errorCode;
module.exports.ERROR_OBJ = _errorObj;

