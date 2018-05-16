var bearcat = require('bearcat');
var Code = require('../../../../../shared/code');
var Answer = require('../../../../../shared/answer');
/**
 * Gate handler that dispatch user to connectors.
 */
var GateHandler = function(app) {
	this.app = app;
	this.dispatcher = null;
};

//连接网关，分配游戏服务器
GateHandler.prototype.connect = function(msg, session, next) {
	var uid = msg.uid;
	if (!uid) {
		next(null, new Answer.NoDataResponse(Code.FAIL));
		return;
	}

	var connectors = this.app.getServersByType('connector');
	if (!connectors || connectors.length === 0) {
		next(null, new Answer.NoDataResponse(Code.GATE.FA_NO_SERVER_AVAILABLE));
		return;
	}

	var res = this.dispatcher.dispatch(uid, connectors);
	next(null, new Answer.DataResponse(Code.OK,{host: res.host, port: res.clientPort}));
};

module.exports = function(app) {
	return bearcat.getBean({
		id: "gateHandler",
		func: GateHandler,
		args: [{
			name: "app",
			value: app
		}],
		props: [{
			name: "dispatcher",
			ref: "dispatcher"
		}]
	});
};