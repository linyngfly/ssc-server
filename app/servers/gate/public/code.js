module.exports = {
    OK: {code:200,desc:'成功'},
    FAIL: {code:500,desc:'失败'},
    DBFAIL: {code:600,desc:'数据库访问错误'},

    PARAMERROR:{code:700, desc:'参数错误'},

    ENTRY: {
        FA_TOKEN_INVALID: 	{code:1001,desc:"token无效"},
        FA_TOKEN_EXPIRE: 	{code:1002,desc:"token过期"},
        FA_USER_NOT_EXIST: 	{code:1003,desc:"用户不存在"}
    },

    GATE: {
        FA_NO_SERVER_AVAILABLE: {code:2001,desc:"没有可用的connector服务器"}
    },

    CHAT: {
        FA_CHANNEL_CREATE:      {code:3001,desc:"通道创建"},
        FA_CHANNEL_NOT_EXIST: 	{code:3002,desc:"通道不存在"},
        FA_UNKNOWN_CONNECTOR: 	{code:3003,desc:"未知连接服务器"},
        FA_USER_NOT_ONLINE: 	{code:3004,desc:"用户不在线"}
    },
    USER:{
        FA_USER_AREADY_EXIST:   {code:4001,desc:'用户名已经被使用'},
        FA_PHONE_AREADY_EXIST:  {code:4002,desc:'手机号码已经被注册'},
        FA_USER_NOT_EXIST:      {code:4003,desc:'用户不存在'},
        FA_USER_LOGIN_ERROR:    {code:4004,desc:'用户或密码错误'},
        FA_INVITOR_NOT_EXIST:   {code:4005,desc:'推荐人不存在'}
    }
};
