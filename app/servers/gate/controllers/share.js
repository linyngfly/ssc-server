const omelo = require('omelo');
const httpCfg = omelo.app.get('http');
const dispatcher = require('../../../utils/dispatcher');
const ERROR_OBJ = require('../../../consts/error_code').ERROR_OBJ;
const logicResponse = require('../../common/logicResponse');
// const qrcode = require('qrcode');
const url = require('url');

async function share_gen_url(data, ctx) {
    // let enable = ctx.protocol == 'https' ? true : false;
    // let resource = httpCfg.gate[0];
    // let urlInfo = {
    //     protocol : ctx.protocol,
    //     address: enable ?  resource.https.publicHost:
    //         resource.http.publicHost,
    //     port: enable ? resource.https.port : resource.http.port,
    //     path:'/register.html?inviter='+data.uid
    // };
    //
    // let share_url = url.format(urlInfo);
    // logger.error('share_url=',share_url);
    // let qr_url = await qrcode.toDataURL(share_url);
    // logger.error('qr_url=',qr_url);
    // return logicResponse.ask({share_url:share_url}, logicResponse.TYPE.FILE);
}

async function share_open_url(data) {

    return logicResponse.ask({});
}

module.exports.share_gen_url = share_gen_url;
module.exports.share_open_url = share_open_url;