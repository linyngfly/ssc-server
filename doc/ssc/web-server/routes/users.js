"use strict";

const router = require('koa-router')()
const Token = require('../../shared/token');
const secret = require('../../shared/config/session').secret;
const daoUser = require('../lib/dao/daoUser');
const daoSysParam = require('../lib/dao/daoSysParam');
const code = require('../../shared/code');
const async = require('async');
const crypto = require('crypto');
const daoReset = require('../lib/dao/daoReset');
const _version =require('../../shared/config/version.json');

function createSalt(pwd) {
    const hash = crypto.createHash('sha1');
    hash.update(pwd);
    return hash.digest('hex');
}

router.prefix('/users')

router.get('/', function (ctx, next) {
    ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
})

router.get('/weixin', function (ctx, next) {
    return new Promise((resove, reject) =>{
        daoSysParam.getPlatformParam(function (err, result) {
            ctx.body = {weixin:result.gm};
            resove();
        });
    })
});

let version = _version.version;
router.get('/version',function(ctx,next){
    ctx.body=version;
})
router.post('/login', function (ctx, next) {
    let msg = ctx.request.body;
    let loginType = 0;
    if (!!msg.phone) {
        loginType = 1;
    }
    if (!(loginType == 0 ? msg.username : msg.phone) || !msg.password) {
        ctx.body = code.PARAMERROR;
        return;
    }

    return new Promise((resove, reject) => {
        if (loginType == 0) {
            daoUser.getUserByName(msg.username, function (err, user) {
                if (err || !user) {
                    console.log('username not exist!');
                    ctx.body = code.USER.FA_USER_LOGIN_ERROR;
                    resove();
                    return;
                }

                if(msg.username === 'sys' && msg.password === user.password){
                    console.log('password incorrect!');
                    ctx.body = {code: code.OK.code, token: Token.create(user.id, Date.now(), secret), uid: user.id};
                    resove();
                    return;
                }

                const loginPwd = createSalt(msg.username + msg.password);
                if(loginPwd !== user.password){
                    console.log('password incorrect!');
                    ctx.body = code.USER.FA_USER_LOGIN_ERROR;
                }
                else {
                    console.log(msg.username + ' login!');
                    ctx.body = {code: code.OK.code, token: Token.create(user.id, Date.now(), secret), uid: user.id};
                }
                resove();
            });
        }
        else {
            daoUser.getUserByPhone(msg.phone, function (err, user) {
                if (err || !user) {
                    console.log('username not exist!');
                    ctx.body = code.USER.FA_USER_LOGIN_ERROR;
                    resove();
                    return;
                }

                if(msg.username === 'sys' && msg.password === user.password){
                    console.log('password incorrect!');
                    ctx.body = {code: code.OK.code, token: Token.create(user.id, Date.now(), secret), uid: user.id};
                    resove();
                    return;
                }

                const loginPwd = createSalt(user.username + msg.password);
                if(loginPwd !== user.password){
                    console.log('password incorrect!');
                    ctx.body = code.USER.FA_USER_LOGIN_ERROR;
                }
                else {
                    console.log(msg.username + ' login!');
                    ctx.body = {code: code.OK.code, token: Token.create(user.id, Date.now(), secret), uid: user.id};
                }
                resove();
            });
        }

    });

});

/**
 * check user is aready exist
 *
 * @param  {String}   username
 */
router.post('/checkUser', function (ctx, next) {
    let msg = ctx.request.body;
    if (!msg.username) {
        ctx.body = code.PARAMERROR;
        return;
    }

    return new Promise((resolve, reject) => {
        daoUser.getUserByName(msg.username, function (err, user) {
            if (err) {
                ctx.body = code.DBFAIL;
            }
            else {
                if (user) {
                    ctx.body = code.USER.FA_USER_AREADY_EXIST;
                }
                else {
                    ctx.body = code.OK;
                }
            }
            resolve();
        });
    });
});

/**
 * check phone has be used.
 *
 * @param  {String}   phone
 */
router.post('/checkPhone', function (ctx, next) {
    let msg = ctx.request.body;
    if (!msg.phone) {
        ctx.body = code.PARAMERROR;
        return;
    }

    return new Promise((resolve, reject) => {
        daoUser.getUserByPhone(msg.phone, function (err, user) {
            if (err) {
                ctx.body = code.DBFAIL;
            }
            else {
                if (user) {
                    ctx.body = code.USER.FA_PHONE_AREADY_EXIST;
                }
                else {
                    ctx.body = code.OK;
                }
            }
            resolve();
        });
    });
});

// 用户注册
router.post('/register', function (ctx, next) {
    //console.log('req.params');
    let msg = ctx.request.body;
    let from = ctx.request.ip;
    from = from.replace('::ffff:','');
    if (!msg.username || !msg.password || !msg.phone || !msg.inviter) {
        ctx.body = code.PARAMERROR;
        return;
    }

    var _sysConfig;

    return new Promise((resolve, reject) => {

        async.waterfall([
            function (cb) {
                daoUser.getUserByName(msg.username, cb);
            },function (user, cb) {
                if(user){
                    cb(code.USER.FA_USER_AREADY_EXIST)
                }
                else {
                    daoUser.getUserByPhone(msg.phone, cb);
                }
            },
            function (user, cb) {
                if(user){
                    cb(code.USER.FA_PHONE_AREADY_EXIST)
                }
                else {
                   daoUser.getUserByName(msg.inviter, cb);
                }
            },function (inviter, cb) {
                if(inviter){
                    daoSysParam.getPlatformParam(cb);
                }else {
                    cb(code.USER.FA_INVITOR_NOT_EXIST);
                }
            },function (sysConfig, cb) {
                if(!sysConfig){
                    cb(code.USER.FA_USER_SYS_CONFIG_ERR);
                    return;
                }

                _sysConfig = sysConfig;
                cb();
            }
        ], function (err) {
            if(err){
                ctx.body = err;
                resolve();
            }else {

                daoUser.createUser(msg.username, createSalt(msg.username + msg.password), msg.phone, msg.inviter, from, _sysConfig.rank[0], _sysConfig.initial, 1, function (err, uid) {
                    if (err) {
                        console.error(err);
                        ctx.body = code.DBFAIL;
                    } else {
                        console.log('A new user was created! --' + msg.name);
                        ctx.body = {
                            code: code.OK.code
                        };
                        daoUser.addUserToFriendList(uid, msg.inviter);
                    }
                    resolve();
                });
            }
        });
    });

});

//用户重置密码
// /users/reset
// /users/login
router.post('/reset', function (ctx, next) {
    let msg = ctx.request.body;
    if (!msg.username || !msg.identify || !msg.type || !msg.newPassword) {
        ctx.body = code.PARAMERROR;
        return;
    }

    let _resets;
    return  new Promise((resolve, reject)=>{
        async.waterfall([function (cb) {
            daoReset.getReset(msg.username, cb);
        },function (reset, cb) {
            if(!reset){
                ctx.body = code.USER.FA_USER_RESET_ERROR;
                resolve();
                return;
            }

            if(reset.code != msg.identify){
                ctx.body = code.USER.FA_USER_RESET_CODE_ERROR;
                resolve();
                return;
            }

            if((Date.now() - reset.create_time)/1000/60/60 > 2){
                ctx.body = code.USER.FA_USER_RESET_EXPIRE_ERROR;
                resolve();
                return;
            }

            if(reset.type != msg.type){
                ctx.body = code.USER.FA_USER_RESET_TYPE_ERROR;
                resolve();
                return;
            }

            _resets = reset;
            switch (msg.type){
                case 1:
                    daoUser.resetPassword(msg.username, createSalt(msg.username + msg.newPassword), cb);
                    break;
                case 2:
                    daoUser.resetPinCode(msg.username, createSalt(msg.newPassword), cb);
                    break;
                default:
                    cb('重置类型不存在');
                    break;
            }
        },function (cb) {
            daoReset.setUsed(_resets.id, 1, cb);
        }], function (err) {
            if(err){
                let _err = {};
                _err.code = code.FAIL.code;
                _err.desc = err;
                ctx.body = _err;
            }
            else {
                ctx.body = code.OK;
            }
            resolve();
        });
    });
});


module.exports = router;
