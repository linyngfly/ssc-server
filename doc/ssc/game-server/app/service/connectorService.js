/**
 * Created by linyng on 2017/6/23.
 */

const logger = require('pomelo-logger').getLogger(__filename);
const pomelo = require('pomelo');

function ConnectorService() {
};

ConnectorService.prototype.init = function () {
    let configs = pomelo.app.get('redis');
    this.redisApi.init(configs);

    let self = this;
    // 踢掉玩家
    this.redisApi.sub('kick', function (msg) {
        logger.error('~~~~~~~~~~ConnectorService~~~kick~~~~~~~~~~`', msg);
        self.kick(msg.uid);
    });
};

ConnectorService.prototype.pub = function(event, msg){
    this.redisApi.pub(event, JSON.stringify(msg));
};

ConnectorService.prototype.kick = function (uid) {
    pomelo.app.get('sessionService').kick(Number(uid), '帐号冻结');
};

module.exports = {
    id: "connectorService",
    func: ConnectorService,
    props: [
        {name: "consts", ref: "consts"},
        {name: "utils", ref: "utils"},
        {name:'redisApi', ref:'redisApi'}
    ]
}

