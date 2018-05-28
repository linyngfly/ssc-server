const sscCmd = require('../../../cmd/sscCmd');
const RpcHandler = require('../../common/rpcHandler');
const omelo = require('omelo');

function PlayerLogin(app) {
    this.app = app;
}

let remote = sscCmd.remote;
for(let k of Object.keys(remote)){
    RpcHandler.register(remote[k].route, PlayerLogin.prototype, omelo.app.entry);
}

module.exports = function (app) {
    return new PlayerLogin(app);
};