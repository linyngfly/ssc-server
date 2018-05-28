
const GM = require('../../game/controllers/gm');

const api_list = {
    gm: {
        route: '/getGMContactInfo', //获取GM联系方式
        handler: GM.getContactInfo,
        params: [],
        accountFields: []
    },
    myBets:{
        route: '/myBets', //投注历史
        handler: GM.getContactInfo,
        params: [],
        accountFields: []
    },
    cash:{
        route: '/cash', //提现请求
        handler: GM.getContactInfo,
        params: [],
        accountFields: []
    }
};

module.exports = {
    API:api_list,
    PREFIX: '/game/clientApi',
};

