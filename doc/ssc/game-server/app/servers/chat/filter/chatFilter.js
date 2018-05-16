/**
 * Created by linyng on 2017/4/24.
 */

var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');

module.exports = function() {
    return new Filter();
};

var Filter = function() {
};

/**
 * 聊天信息过滤
 * 聊天刷屏过滤
 */
Filter.prototype.before = function(msg, session, next){
    next();
};
