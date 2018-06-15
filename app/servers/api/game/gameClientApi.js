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
        route: '/setPlayerInfoByGM', //修改玩家信息（目前只能修改昵称，头像）
        handler: GM.setPlayerInfo,
        params: [],
        accountFields: []
    },

    setOrderState: {
        route: '/setOrderState', //修改订单状态
        handler: GM.setOrderState,
        params: [],
        accountFields: []
    },

    getBroadcast: {
        route: '/getBroadcast', //获取系统公告
        handler: GM.getBroadcast,
        params: [],
        accountFields: []
    },

    setBroadcast: {
        route: '/getBroadcast', //后台设置系统公告
        handler: GM.setBroadcast,
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
    getDrawState: {
        route: '/getDrawState', //获取抽奖状态，0:无抽奖机会，1:可以抽奖
        handler: turntable.getDrawState,
        params: [],
        accountFields: []
    },

};

module.exports = {
    API: api_list,
    PREFIX: '/game/clientApi',
};

