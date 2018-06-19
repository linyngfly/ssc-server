const innerUserAuth = require('../../gate/controllers/innerUserAuth');
const queryServices = require('../../gate/controllers/queryServices');
const share = require('../../gate/controllers/share');
const httpUtil = require('../../../utils/httpUtil');

const api_list = {
    register: {
        route: '/register', //内置账号注册
        handler: innerUserAuth.register,
        params: ['username', 'code', 'nickname', 'password'],
        accountFields: null,
        ext: {
            getIP: httpUtil.getIP
        }
    },
    getPhoneCode: {
        route: '/getPhoneCode', //获取手机验证码
        handler: innerUserAuth.getPhoneCode,
        params: ['phone'],
        resp: ['expires'],
        accountFields: null,
    },
    login: {
        route: '/login', //内置账号登录
        handler: innerUserAuth.login,
        params: ['username', 'password'],
        accountFields: null,
        ext: {
            getIP: httpUtil.getIP
        }
    },
    logout: {
        route: '/logout', //注销
        handler: innerUserAuth.logout,
        params: [],
        accountFields: null
    },
    modifyPassword: {
        route: '/modifyPassword', //内置账号修改密码
        handler: innerUserAuth.modifyPassword,
        params: [],
        accountFields: null
    },
    get_api_server: {
        route: '/get_api_server', //获取服务器列表
        handler: queryServices.lists,
        params: [],
        accountFields: null,
        ext: {
            getProtocol: httpUtil.getProtocol
        },
    },
    query_game_entry: {
        route: '/query_game_entry', //查询游戏入口
        handler: queryServices.query_game_entry,
        params: [],
        accountFields: null
    },

    share_gen_url: {
        route: '/share_gen_url', //生成分享地址
        handler: share.share_gen_url,
        params: [],
        accountFields: null
    },

    share_open_url:{
        route: '/share_gen_url', //生成分享地址
        handler: share.share_open_url,
        params: [],
        accountFields: null
    }
};


module.exports = {
    API: api_list,
    PREFIX: '/gate/clientApi',
};