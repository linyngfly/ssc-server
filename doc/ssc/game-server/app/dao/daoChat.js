/**
 * Created by linyng on 17-6-21.
 */

var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');

function DaoChat() {

};

DaoChat.prototype.init = function (db, max, configs) {
    this.redisApi.init(configs, db);
    this.max = max;
};

DaoChat.prototype.add = function (msg, cb) {
    let self = this;
    this.redisApi.cmd('incr', null, 'msgId', null, function (err, msgId) {
        let index = msgId[0];
        self.redisApi.cmd('set', 'chat' + (index%self.max + 1), JSON.stringify(msg), function (err, result) {
            logger.error('DaoChat add ', err, result, msgId);
        });
    });
};

DaoChat.prototype.gets = function (cb) {
    let self = this;
    this.redisApi.cmd('keys', null, 'chat*',null, function (err, msgIds) {
        // logger.error('@@@@@@@@@@@@@@@@@@@@@@@@@ DaoChat keys ', err, msgIds);
        self.redisApi.cmd('mget', null, msgIds[0], null, function (err, result) {
           // logger.error('DaoChat gets ', err, result);
            self.utils.invokeCallback(cb, err, result);
       })
    });
};

module.exports ={
    id:'daoChat',
    func:DaoChat,
    props:[
        {name:'utils', ref:'utils'},
        {name:'redisApi', ref:'redisApi'}
    ]
}