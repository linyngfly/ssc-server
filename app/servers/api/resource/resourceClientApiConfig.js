const downloader = require('../../resource/controllers/downloader');
const gateEntry = require('../../resource/controllers/gateEntry');

const api_list = {
    getGate: {
        route: '/getGate', //获取网关
        handler: gateEntry.getGate,
        params: [],
        accountFields: null,
    },
    downloadImg: {
        route: '/downloadImg', //查询游戏入口
        handler: downloader.getImage,
        params: [],
        accountFields: null
    },
};


module.exports = {
    apiCfgs: api_list,
    PREFIX: '/resource/clientApi',
};