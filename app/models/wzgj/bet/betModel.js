const constants = require('../constants');

module.exports = {
    id: {
        def: 0,
        type: "number",
        tbl: 'tbl_bets',
        primary_key: true,
        comment: '投注ID'
    },
    uid: {
        def: 0,
        type: "number",
        tbl: 'tbl_bets',
        require: true,
        comment: '用户ID'
    },
    period: {
        def: '',
        type: "string",
        tbl: 'tbl_bets',
        require: true,
        comment: '期数'
    },
    identify: {
        def: '',
        type: "string",
        tbl: 'tbl_bets',
        require: true,
        comment: '彩票标志'
    },
    betData: {
        def: '',
        type: "string",
        tbl: 'tbl_bets',
        require: true,
        comment: '原始投注数据'
    },
    betItems: {
        def: {},
        type: "object",
        tbl: 'tbl_bets',
        require: true,
        comment: '投注条目'
    },
    multi:{
        def: 0,
        type: "number",
        tbl: 'tbl_bets',
        comment: '是否是组合投注,0否，1是'
    },
    betCount: {
        def: 0,
        type: "number",
        tbl: 'tbl_bets',
        require: true,
        comment: '投注数'
    },
    betMoney: {
        def: 0,
        type: "number",
        tbl: 'tbl_bets',
        require: true,
        comment: '投注金额'
    },
    winCount: {
        def: 0,
        type: "number",
        tbl: 'tbl_bets',
        comment: '投赢注数'
    },
    winMoney: {
        def: 0,
        type: "number",
        tbl: 'tbl_bets',
        comment: '收益金额'
    },
    betTime: {
        def: '1970-01-02 00:00:00',
        type: "timestamp",
        tbl: 'tbl_bets',
        require: true,
        comment: '投注时间'
    },
    state: {
        def: constants.BET_STATE.WAIT,
        type: "number",
        tbl: 'tbl_bets',
        comment: '0待开奖，1 撤销，2 赢 3输 4返还'
    },
};
let genCode = false;
if (genCode) {
    const genCode = require('../../common/genCode');
    const path = require('path');
    const playerCommit = path.join(__dirname, 'betCommit.js');
    genCode.genCommitByModel(module.exports, playerCommit, 'BetCommit');

    const sqlConst = path.join(__dirname, 'sqlConst.js');
    genCode.genTables(module.exports, sqlConst);

    const fieldConst = path.join(__dirname, 'betFieldConst.js');
    genCode.genFieldConst(module.exports, fieldConst);
}