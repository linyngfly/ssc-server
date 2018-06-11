
const GM = require('../../game/controllers/gm');

const api_list = {

    setPlayerInfo:{
        route: '/setPlayerInfo', //修改玩家信息（目前只能修改昵称，头像）
        handler: GM.setPlayerInfo,
        params: [],
        accountFields: []
    },

    setOrderState:{
        route: '/setOrderState', //转盘抽奖
        handler: GM.setOrderState,
        params: [],
        accountFields: []
    },



};

module.exports = {
    API:api_list,
    PREFIX: '/game/clientApi',
};

