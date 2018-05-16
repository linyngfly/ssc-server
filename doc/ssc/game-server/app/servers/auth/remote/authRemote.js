/**
 * Created by linyng on 2017/4/21.
 */

var tokenService = require('../../../../../shared/token');
var bearcat = require("bearcat");
var Code = require('../../../../../shared/code');
var DEFAULT_SECRET = 'pomelo_session_secret';
var DEFAULT_EXPIRE = 6 * 60 * 60 * 1000;	// default session expire time: 6 hours

var AuthRemote = function(app) {
    this.app = app;
    var session = app.get('session') || {};
    this.secret = session.secret || DEFAULT_SECRET;
    this.expire = session.expire || DEFAULT_EXPIRE;
};


/**
 * Auth token and check whether expire.
 *
 * @param  {String}   token token string
 * @param  {Function} cb
 * @return {Void}
 */
AuthRemote.prototype.auth = function(token, cb) {
    var res = tokenService.parse(token, this.secret);
    if(!res) {
        cb(null, Code.ENTRY.FA_TOKEN_INVALID);
        return;
    }

    if(!checkExpire(res, this.expire)) {
        cb(null, Code.ENTRY.FA_TOKEN_EXPIRE);
        return;
    }

    this.daoUser.getPlayer(res.uid, function(err, player) {
        if(err) {
            cb(err);
            return;
        }

        if(!player.active){
            cb(null, Code.ENTRY.FA_USER_NOT_ACTIVE, null);
            return;
        }
        cb(null, Code.OK, player.id);
    });
};

/**
 * Check the token whether expire.
 *
 * @param  {Object} token  token info
 * @param  {Number} expire expire time
 * @return {Boolean}        true for not expire and false for expire
 */
var checkExpire = function(token, expire) {
    if(expire < 0) {
        // negative expire means never expire
        return true;
    }

    return (Date.now() - token.timestamp) < expire;
};

module.exports = function (app) {
    return bearcat.getBean({
        id:"authRemote",
        func:AuthRemote,
        args:[{
            name:"app",
            value:app
        }],
        props:[
            {name:"consts", ref:"consts"},
            {name:"daoUser", ref:"daoUser"}
        ]
    })
}


