module.exports = {
    uid: {
        def: 0,
        type: "number",
        tbl: 'user',
        require:true,
        comment: '用户ID'
    },
    username: {
        def: '',
        type: "string",
        tbl: 'user',
        require:true,
        comment: '登录名'
    },
    password: {
        def: '',
        type: "string",
        tbl: 'user',
        require:true,
        comment: '登录密码'
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
    regTime: {
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
    forbidTalk: {
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
        def: 0,
        type: "number",
        tbl: 'user',
        comment: '0:玩家,1:一级代理商,2:二级代理商,3:体验用户'
    },
    roleName: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '角色名称'
    },
    imageId: {
        def: '1',
        type: "string",
        tbl: 'user',
        comment: '头像id(1~6)'
    },
    rank: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '荣誉称号'
    },
    pinCode: {
        def: '',
        type: "string",
        tbl: 'user',
        comment: '取款密码'
    },
    money: {
        def: 0,
        type: "number",
        tbl: 'user',
        alias: 'accountAmount',
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
        tbl: 'user',
        comment: '经验值'
    },
    loginCount: {
        def: 0,
        type: "number",
        tbl: 'user',
        comment: '登录次数'
    },
    lastOnlineTime: {
        def: '1970-01-02 00:00:00',
        type: "timestamp",
        tbl: 'user',
        comment: '最后在线时间'
    },
    ext: {
        def: {},
        type: "object",
        tbl: 'user',
        comment: '最后在线时间'
    },

    address: {
        def: '',
        type: "string",
        tbl: 'bank',
        comment: '开户行地址'
    },
    account: {
        def: '',
        type: "string",
        tbl: 'bank',
        comment: '户名'
    },
    cardNO: {
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
    bindTime: {
        def: '1970-01-02 00:00:00',
        type: "timestamp",
        tbl: 'bank',
        comment: '绑卡时间'
    }
};
let genCode = false;
if(global.genCode){
    const genCode = require('../../common/genCode');
    const path = require('path');
    const filename = path.join(__dirname, 'PlayerCommit.js');
    genCode.genCommitByModel(module.exports, filename, 'PlayerCommit');
}