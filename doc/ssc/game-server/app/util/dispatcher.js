var crc = require('crc');

var Dispatcher = function() {

}

Dispatcher.prototype.dispatch = function(uid, servers) {
	var index = Math.abs(parseInt(crc.crc32(uid.toString())), 16) % servers.length;
	return servers[index];
};

module.exports = {
	id: "dispatcher",
	func: Dispatcher
}