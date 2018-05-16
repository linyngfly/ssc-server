/**
 * Created by linyng on 2017/5/18.
 */

var crc = require('crc');
var logger = require('pomelo-logger').getLogger(__filename);
var Code = require('../../../shared/code');
var Answer = require('../../../shared/answer');

var RouteUtil = module.exports;

RouteUtil.routeDispatch = function (uid, servers) {
    var index = Math.abs(parseInt(crc.crc32(uid.toString())), 16) % servers.length;
    return servers[index];
};

RouteUtil.chat = function(session, msg, app, cb) {
    var chatServers = app.getServersByType('chat');

    if(!chatServers || chatServers.length === 0) {
        cb(new Error('can not find chat servers.'));
        return;
    }

    var res = RouteUtil.routeDispatch(session.uid, chatServers);

    logger.debug('-----------------------route chat:', res.id);

    cb(null, res.id);
};

RouteUtil.area = function(session, msg, app, cb) {
    var areaServers = app.getServersByType('area');

    if(!areaServers || areaServers.length === 0) {
        cb(new Error('can not find game servers.'), new Answer.NoDataResponse(Code.FAIL));
        return;
    }

    logger.debug('---------------11111---------------------', session.uid,'----------------', session)
    var res = RouteUtil.routeDispatch(session.uid, areaServers);
    logger.debug('----------------22222--------------------', session.uid,'----------------', session)
    cb(null, res.id);
};
