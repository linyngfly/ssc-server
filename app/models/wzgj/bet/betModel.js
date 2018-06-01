module.exports = {
    id: {
        def: 0,
        type: "number",
        tbl: 'bets_log',
        require: true,
        primary_key: true,
        comment: '投注ID'
    },
    uid: {
        def: 0,
        type: "number",
        tbl: 'bets_log',
        require: true,
        comment: '用户ID'
    },
    period: {
        def: '',
        type: "string",
        tbl: 'bets_log',
        require: true,
        comment: '期数'
    },
    identify: {
        def: '',
        type: "string",
        tbl: 'bets_log',
        require: true,
        comment: '彩票标志'
    },
    oriBetInfo: {
        def: '',
        type: "string",
        tbl: 'bets_log',
        alias: 'betInfo',
        require: true,
        comment: '原始投注数据'
    },
    betTypeInfo: {
        def: {},
        type: "object",
        tbl: 'bets_log',
        require: true,
        comment: '投注类型信息'
    },
    betItems: {
        def: {},
        type: "object",
        tbl: 'bets_log',
        require: true,
        comment: '投注条目'
    },
    betCount: {
        def: 0,
        type: "number",
        tbl: 'bets_log',
        require: true,
        comment: '投注数'
    },
    betMoney: {
        def: 0,
        type: "number",
        tbl: 'bets_log',
        require: true,
        comment: '投注金额'
    },
    winCount: {
        def: 0,
        type: "number",
        tbl: 'bets_log',
        comment: '投赢注数'
    },
    winMoney: {
        def: 0,
        type: "number",
        tbl: 'bets_log',
        comment: '收益金额'
    },
    betTime: {
        def: '1970-01-02 00:00:00',
        type: "timestamp",
        tbl: 'bets_log',
        require: true,
        comment: '投注时间'
    },
    state: {
        def: 0,
        type: "number",
        tbl: 'bets_log',
        comment: '0待开奖，1 撤销，2 赢 3输'
    },
};
let genCode = true;
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