
const GM = require('../../game/controllers/gm');
const order = require('../../game/controllers/order');
const player = require('../../game/controllers/player');
const bank = require('../../game/controllers/bank');
const bets = require('../../game/controllers/bets');

const api_list = {
    gm: {
        route: '/getGMContactInfo', //获取GM联系方式
        handler: GM.getContactInfo,
        params: [],
        accountFields: []
    },

    myBets:{
        route: '/myBets', //投注历史
        handler: bets.myBets,
        params: [],
        accountFields: []
    },

    setPlayerInfo:{
        route: '/setPlayerInfo', //修改玩家信息（目前只能修改昵称，头像）
        handler: player.set,
        params: [],
        accountFields: []
    },

    bindBankInfo:{
        route: '/bindBankInfo', //绑定银行账户信息
        handler: bank.bind,
        params: [],
        accountFields: []
    },

    cash:{
        route: '/cash', //提现请求
        handler: order.cash,
        params: [],
        accountFields: []
    },

    recharge:{
        route: '/recharge', //充值请求
        handler: order.recharge,
        params: [],
        accountFields: []
    }
};

module.exports = {
    API:api_list,
    PREFIX: '/game/clientApi',
};

