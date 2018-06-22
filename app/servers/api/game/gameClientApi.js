const GM = require('../../game/controllers/gm');
const order = require('../../game/controllers/order');
const player = require('../../game/controllers/player');
const bank = require('../../game/controllers/bank');
const bets = require('../../game/controllers/bets');
const turntable = require('../../game/controllers/turntable');

const api_list = {
    getGMContactInfo: {
        route: '/getGMContactInfo', //获取GM联系方式
        handler: GM.getGMContactInfo,
        params: [],
        accountFields: []
    },

    setPlayerInfoByGM: {
        route: '/setPlayerInfoByGM', //GM修改玩家信息
        handler: GM.setPlayerInfo,
        params: ['mainType', 'subType', 'token', 'id', 'fields'],
        accountFields: []
    },

    setOrderState: {
        route: '/setOrderState', //修改订单状态
        handler: GM.setOrderState,
        params: ['mainType', 'subType', 'token', 'state', 'operator', 'id'],
        accountFields: []
    },

    publishSysMessage: {
        route: '/publishSysMessage', //修改订单状态
        handler: GM.publishSysMessage,
        params: ['mainType', 'subType', 'token', 'publisher', 'content'],
        accountFields: []
    },

    getBroadcast: {
        route: '/getBroadcast', //获取系统公告
        handler: GM.getBroadcast,
        params: [],
        accountFields: []
    },

    setBroadcast: {
        route: '/setBroadcast', //后台设置系统公告
        handler: GM.setBroadcast,
        params: ['mainType', 'subType', 'token', 'content'],
        accountFields: []
    },

    setInitMoney: {
        route: '/setInitMoney', //后台设置系统公告
        handler: GM.setInitMoney,
        params: ['mainType', 'subType', 'token', 'money'],
        accountFields: []
    },

    getSysMessage: {
        route: '/getSysMessage', //获取系统消息
        handler: GM.getSysMessage,
        params: [],
        accountFields: []
    },

    myBets: {
        route: '/myBets', //投注历史
        handler: bets.myBets,
        params: [],
        accountFields: []
    },

    setPlayerInfo: {
        route: '/setPlayerInfo', //修改玩家信息（目前只能修改昵称，头像）
        handler: player.setPlayerInfo,
        params: [],
        accountFields: []
    },

    getPlayerInfo: {
        route: '/getPlayerInfo', //查询玩家信息
        handler: player.getPlayerInfo,
        params: [],
        accountFields: []
    },

    bindPayInfo: {
        route: '/bindPayInfo', //绑定银行账户信息
        handler: bank.bindPayInfo,
        params: [],
        accountFields: []
    },

    getBankLog: {
        route: '/getBankLog', //获取金币变化日志
        handler: bank.getBankLog,
        params: [],
        accountFields: []
    },

    getMyDefection: {
        route: '/getMyDefection', //获取玩家反水信息
        handler: bank.getMyDefection,
        params: [],
        accountFields: []
    },

    getMyRebate: {
        route: '/getMyRebate', //获取拉手分成信息
        handler: bank.getMyRebate,
        params: [],
        accountFields: []
    },

    cash: {
        route: '/cash', //提现请求
        handler: order.cash,
        params: [],
        accountFields: []
    },

    recharge: {
        route: '/recharge', //充值请求
        handler: order.recharge,
        params: [],
        accountFields: []
    },
    turntable_draw: {
        route: '/turntable_draw', //转盘抽奖
        handler: turntable.turntable_draw,
        params: [],
        accountFields: []
    },


};

module.exports = {
    API: api_list,
    PREFIX: '/game/clientApi',
};

