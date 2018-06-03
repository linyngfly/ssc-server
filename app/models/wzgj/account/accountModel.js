const constants = require('../constants');

module.exports = {
    id: {
        def: 0,
        type: "number",
        tbl: 'user',
        primary_key:true,
        comment: '用户ID'
    },
    username: {
        def: '',
        type: "string",
        tbl: 'user',
        require:true,
        comment: '登录名'
    },
    openid: {
        def: '',
        type: "string",
        tbl: 'user',
        require:true,
        comment: '用户唯一标识'
    },
    password: {
        def: '',
        type: "string",
        tbl: 'user',
        require:true,
        comment: '登录密码'
    },
    nickname: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '昵称'
    },
    phone: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '电话'
    },
    email: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '邮箱'
    },
    from: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '登录来源IP'
    },
    created_at: {
        def: '1970-01-02 00:00:00',
        type: "timestamp",
        tbl: 'user',
        comment: '注册时间'
    },
    inviter: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '邀请人'
    },
    active: {
        def: 0,
        type: "number",
        tbl: 'user',
        comment: '是否激活'
    },
    forbid_talk: {
        def: 0,
        type: "number",
        tbl: 'user',
        comment: '玩家禁言'
    },
    friends: {
        def: [],
        type: "object",
        tbl: 'user',
        comment: '朋友列表'
    },
    role: {
        def: constants.ROLE.PLAYER,
        type: "number",
        tbl: 'user',
        comment: '0:玩家,1:一级代理商,2:二级代理商,3:体验用户'
    },
    figure_url: {
        def: constants.IMG_ID.IMD1,
        type: "string",
        tbl: 'user',
        comment: '头像id(1~6)'
    },
    rank_name: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '荣誉称号'
    },
    pin_code: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '取款密码'
    },
    money: {
        def: 0,
        type: "number",
        tbl: 'user',
        inc:true,
        comment: '账户金额'
    },
    level: {
        def: 1,
        type: "number",
        tbl: 'user',
        comment: '等级'
    },
    experience: {
        def: 0,
        type: "number",
        inc:true,
        tbl: 'user',
        comment: '经验值'
    },
    login_count: {
        def: 0,
        type: "number",
        inc:true,
        tbl: 'user',
        comment: '登录次数'
    },
    updated_at: {
        def: '1970-01-02 00:00:00',
        type: "timestamp",
        tbl: 'user',
        comment: '最后在线时间'
    },
    token: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '会话token'
    },
    test: {
        def: 1,
        type: "number",
        tbl: 'user',
        comment: '封号标识（<0封号）'
    },
    ext: {
        def: {},
        type: "object",
        tbl: 'user',
        comment: '扩展数据'
    },

    bank_address: {
        def: '',
        type: "string",
        tbl: 'bank',
        comment: '开户行地址'
    },
    bank_account: {
        def: '',
        type: "string",
        tbl: 'bank',
        comment: '户名'
    },
    bank_card: {
        def: '',
        type: "string",
        tbl: 'bank',
        comment: '银行卡号'
    },
    weixin: {
        def: '',
        type: "string",
        tbl: 'bank',
        comment: '微信'
    },
    zhifubao: {
        def: '',
        type: "string",
        tbl: 'bank',
        comment: '支付宝'
    },
    bind_card_at: {
        def: '1970-01-02 00:00:00',
        type: "timestamp",
        tbl: 'bank',
        comment: '绑卡时间'
    }
};
let genCode = false;
if(genCode){
    const genCode = require('../../common/genCode');
    const path = require('path');
    const playerCommit = path.join(__dirname, 'AccountCommit.js');
    genCode.genCommitByModel(module.exports, playerCommit, 'AccountCommit');

    const sqlConst = path.join(__dirname, 'sqlConst.js');
    genCode.genTables(module.exports, sqlConst);

    const fieldConst = path.join(__dirname, 'accountFieldConst.js');
    genCode.genFieldConst(module.exports, fieldConst);
}