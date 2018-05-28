const downloader = require('../../resource/controllers/downloader');
const gateEntry = require('../../resource/controllers/gateEntry');
const upload = require('../../resource/controllers/upload');

const api_list = {
    version:{
        route: '/version', //获取服务版本
        handler: gateEntry.version,
        params: [],
        accountFields: null,
    },
    getGate: {
        route: '/getGate', //获取网关
        handler: gateEntry.getGate,
        params: [],
        accountFields: null,
    },
    downloadImg: {
        route: '/downloadImg', //下载图片
        handler: downloader.getImage,
        params: [],
        accountFields: null
    },
    uploadAudio: {
        route: '/uploadAudio', //上传音频
        handler: upload.pushAudioFile,
        params: [],
        accountFields: null
    },
};


module.exports = {
    API: api_list,
    PREFIX: '/resource/clientApi',
};