const innerUserAuth = require('../../gate/controllers/innerUserAuth');
const queryServices = require('../../gate/controllers/queryServices');
const httpUtil = require('../../../utils/httpUtil');

const api_list = {
    get_api_server: {
        route: '/get_api_server', //获取服务器列表
        handler: queryServices.lists,
        params: [],
        accountFields: null,
        ext: {
            getNetProtocol: function (ctx) {
                ctx.request.body.data = ctx.request.body.data || {};
                ctx.request.body.data.protocol = ctx.request.protocol;
            }
        },
    }, query_game_entry: {
        route: '/query_game_entry', //查询游戏入口
        handler: queryServices.query_game_entry,
        params: [],
        accountFields: null
    },
    register: {
        route: '/register', //内置账号注册
        handler: innerUserAuth.register,
        params: ['phone','code','nickname','password'],
        accountFields: null,
        ext: {
            getIP: httpUtil.getIP
        }
    },
    getPhoneCode: {
        route: '/getPhoneCode', //获取手机验证码
        handler: innerUserAuth.getPhoneCode,
        params: ['phone'],
        resp:['expires'],
        accountFields: null,
    },
    login: {
        route: '/login', //内置账号登录
        handler: innerUserAuth.login,
        params: ['phone','password'],
        accountFields: null,
        ext: {
            getIP: httpUtil.getIP
        }
    }, logout: {
        route: '/logout', //注销
        handler: innerUserAuth.logout,
        params: [],
        accountFields: null
    }, modifyPassword: {
        route: '/modifyPassword', //内置账号修改密码
        handler: innerUserAuth.modifyPassword,
        params: [],
        accountFields: null
    }
};


module.exports = {
    apiCfgs: api_list,
    PREFIX: '/gate/clientApi',
};