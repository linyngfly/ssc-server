/**
 * 获取客户端IP地址
 * @param {*} ctx
 */
function _getIP(ctx) {
    ctx.request.body.data = ctx.request.body.data || {};
    ctx.request.body.data.ip = ctx.ip;
}


module.exports.getIP = _getIP;