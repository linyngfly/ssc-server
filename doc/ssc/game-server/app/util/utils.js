const util = require('util');
const crypto = require('crypto');

var Utils = function() {

};


// 密码加密
Utils.prototype.createSalt = function(pwd) {
    const hash = crypto.createHash('sha1');
    hash.update(pwd);
    return hash.digest('hex');
};

// callback util
Utils.prototype.invokeCallback = function(cb) {
	if (!!cb && typeof cb == 'function') {
		cb.apply(null, Array.prototype.slice.call(arguments, 1));
	}
};

//generate a random number between min and max
Utils.prototype.rand = function(min, max) {
	var n = max - min;
	return min + Math.round(Math.random() * n);
};

// clone a object
Utils.prototype.clone = function(o) {
	var n = {};
	for (var k in o) {
		n[k] = o[k];
	}

	return n;
};

Utils.prototype.myPrint = function() {
    if (isPrintFlag) {
        var len = arguments.length;
        if(len <= 0) {
            return;
        }
        var stack = getStack();
        var aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
        for(var i = 0; i < len; ++i) {
            aimStr += arguments[i] + ' ';
        }
        console.log('\n' + aimStr);
    }
};

module.exports = {
	id: "utils",
	func: Utils
}