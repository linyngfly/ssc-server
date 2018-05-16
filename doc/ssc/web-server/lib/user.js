const daoUser = require('../lib/dao/daoUser');

var User = function(opts) {
	this.id = opts.id;
	this.username = opts.username;
    this.password = opts.password;
    this.phone = opts.phone;
    this.email = opts.email;
    this.from = opts.from;
	this.regTime = opts.regTime;
    this.inviter = opts.inviter;
	this.active = opts.active;
	this.forbidTalk = opts.forbidTalk;
	this.friends = opts.friends;
    this.role = opts.role;
    this.roleName = opts.roleName;
    this.imageId = opts.imageId;
    this.rank = opts.rank;
	this.sex = opts.sex;
    this.pinCode = opts.pinCode;
	this.accountAmount = opts.accountAmount;
    this.level = opts.level;
    this.experience = opts.experience;
    this.loginCount = opts.loginCount;
    this.lastLoinTime = opts.lastLoinTime;

};

/**
 * Expose 'Entity' constructor
 */

module.exports = User;
