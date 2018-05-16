var EventEmitter = require('events').EventEmitter;
var util = require('util');

var id = 1;

/**
 * Initialize a new 'Entity' with the given 'opts'.
 * Entity inherits EventEmitter
 *
 * @param {Object} opts
 * @api public
 */
function Entity(opts) {
	EventEmitter.call(this);
	this.opts = opts || {};
	this.entityId = id++;
	this.kindId = opts.kindId;
	this.kindName = opts.kindName;
    this.serverId = -1;
}

util.inherits(Entity, EventEmitter);

Entity.prototype._init = function() {
	var opts = this.opts;
}

Entity.prototype._toJSON = function() {
	return {
		entityId: this.entityId,
		kindId: this.kindId,
		kindName: this.kindName,
		areaId: this.areaId
	}
}

module.exports = {
	id: "entity",
	func: Entity,
	abstract: true,
	props: [{
		name: "dataApiUtil",
		ref: "dataApiUtil"
	}, {
		name: "utils",
		ref: "utils"
	}]
}