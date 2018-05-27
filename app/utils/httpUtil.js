/**
 * 获取客户端IP地址
 * @param {*} ctx
 */
function _getIP(ctx) {
    ctx.request.body = ctx.request.body || {};
    ctx.request.body.ip = ctx.ip;
}

function _getProtocol(ctx){
    ctx.request.body = ctx.request.body || {};
    ctx.request.body.protocol = ctx.request.protocol;
}


module.exports.getIP = _getIP;
module.exports.getProtocol = _getProtocol;