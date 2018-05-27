/**
 * 获取客户端IP地址
 * @param {*} ctx
 */
function _getIP(ctx) {
    ctx.request.body = ctx.request.body || {};
    ctx.request.body.ip = ctx.ip;
}


module.exports.getIP = _getIP;