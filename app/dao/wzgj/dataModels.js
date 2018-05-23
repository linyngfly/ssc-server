const dataModels = {};
dataModels.user = {
    "uid": {
        "def": 0,
        "type": "number",
        "comment": '用户ID'
    },
    "username": {
        "def": '',
        "type": "string",
        "comment": '登录名'
    },
    "password": {
        "def": '',
        "type": "string",
        "comment": '登录密码'
    },
    "phone": {
        "def": '',
        "type": "string",
        "comment": '电话'
    },
    "email": {
        "def": '',
        "type": "string",
        "comment": '邮箱'
    },
    "from": {
        "def": '',
        "type": "string",
        "comment": '登录来源'
    },
    "regTime": {
        "def": '1970-01-02 00:00:00',
        "type": "timestamp",
        "comment": '注册时间'
    },
    "inviter": {
        "def": '',
        "type": "string",
        "comment": '邀请人'
    },
    "active": {
        "def": 0,
        "type": "number",
        "comment": '是否激活'
    },
    "forbidTalk": {
        "def": 0,
        "type": "number",
        "comment": '玩家禁言'
    },
    "friends": {
        "def": [],
        "type": "object",
        "comment": '朋友列表'
    },
    "role": {
        "def": 0,
        "type": "number",
        "comment": '0:玩家,1:一级代理商,2:二级代理商,3:体验用户'
    },
    "roleName": {
        "def": '',
        "type": "string",
        "comment": '角色名称'
    },
    "imageId": {
        "def": '1',
        "type": "string",
        "comment": '头像id(1~6)'
    },
    "rank": {
        "def": '',
        "type": "string",
        "comment": '荣誉称号'
    },
    "pinCode": {
        "def": '',
        "type": "string",
        "comment": '取款密码'
    },
    "accountAmount": {
        "def": 0,
        "type": "number",
        "comment": '账户金额'
    },
    "level": {
        "def": 1,
        "type": "number",
        "comment": '等级'
    },
    "experience": {
        "def": 0,
        "type": "number",
        "comment": '经验值'
    },
    "loginCount": {
        "def": 0,
        "type": "number",
        "comment": '登录次数'
    },
    "lastOnlineTime": {
        "def": '1970-01-02 00:00:00',
        "type": "timestamp",
        "comment": '最后在线时间'
    },
    "ext": {
        "def": {},
        "type": "object",
        "comment": '最后在线时间'
    },
};

dataModels.bank = {
    "uid": {
        "def": 0,
        "type": "number",
        "comment": '用户ID'
    },
    "address": {
        "def": '',
        "type": "string",
        "comment": '开户行地址'
    },
    "username": {
        "def": '',
        "type": "string",
        "comment": '户名'
    },
    "cardNO": {
        "def": '',
        "type": "string",
        "comment": '银行卡号'
    },
    "weixin": {
        "def": '',
        "type": "string",
        "comment": '微信'
    },
    "zhifubao": {
        "def": '',
        "type": "string",
        "comment": '支付宝'
    },
    "bindTime": {
        "def": '1970-01-02 00:00:00',
        "type": "timestamp",
        "comment": '绑卡时间'
    },
};

dataModels.bets_log = {
    "uid": {
        "def": 0,
        "type": "number",
        "comment": '用户ID'
    },
    "period": {
        "def": 0,
        "type": "number",
        "comment": '期数'
    },
    "identify": {
        "def": '',
        "type": "number",
        "comment": '标志'
    },
    "betInfo": {
        "def": {},
        "type": "object",
        "comment": '投注信息'
    },
    "state": {
        "def": 0,
        "type": "number",
        "comment": '0待开奖，1 撤销，2 赢 3输'
    },
    "betCount": {
        "def": 0,
        "type": "number",
        "comment": '投注数'
    },
    "winCount": {
        "def": 0,
        "type": "number",
        "comment": '投赢注数'
    },
    "betMoney": {
        "def": 0,
        "type": "number",
        "comment": '投注金额'
    },
    "winMoney": {
        "def": 0,
        "type": "number",
        "comment": '收益金额'
    },
    "betTime": {
        "def": '1970-01-02 00:00:00',
        "type": "timestamp",
        "comment": '投注时间'
    },
    "betTypeInfo": {
        "def": {},
        "type": "object",
        "comment": '投注类型信息'
    },
    "betItems": {
        "def": {},
        "type": "object",
        "comment": '投注条目'
    },
};

module.exports = dataModels;