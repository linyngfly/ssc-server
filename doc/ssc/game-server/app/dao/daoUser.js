/**
 * Created by linyng on 2017/4/21.
 */

var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var bearcat = require('bearcat');
var async = require('async');

var DaoUser = function () {
    this.utils = null;
};

// 获取玩家基本信息
DaoUser.prototype.getPlayer = function (playerId, cb) {
    var sql = 'select * from User where id = ?';
    var args = [playerId];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, err, null);
        } else if (!res || res.length <= 0) {
            self.utils.invokeCallback(cb, '用户不存在', null);
        } else {
            self.utils.invokeCallback(cb, null, bearcat.getBean("player", res[0]));
        }
    });
};

DaoUser.prototype.checkRoleName = function (roleName) {
    return new Promise((resolve, reject) => {
        var sql = 'select * from User where roleName = ?';
        var args = [roleName];
        var self = this;
        pomelo.app.get('dbclient').query(sql, args, function (err, res) {
            if (err !== null) {
                reject(err);
            } else if (!res || res.length === 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

DaoUser.prototype.updateAllOfline = function () {
    var sql = 'update User set state = ?';
    var args = [0];
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            logger.error('重置所有用户在线状态失败,', err);
        } else {
            logger.error('重置所有用户在线状态成功');
        }
    });
};

DaoUser.prototype.setPinCode = function (playerId, pinCode) {
    var sql = 'update User set pinCode = ? where id=?';
    logger.error(sql);
    var args = [pinCode, playerId];
    console.log(args)
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        
        if (err !== null) {
            logger.error('设置支付密码失败');
        } else {
            logger.error('设置支付密码成功');
        }
    });
};

// 通过名称获取好友
DaoUser.prototype.getPlayerByName = function (username, cb) {
    var sql = 'select * from User where username = ?';
    var args = [username];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, err.message, null);
        } else if (!res || res.length <= 0) {
            self.utils.invokeCallback(cb, null, null);
        } else {
            self.utils.invokeCallback(cb, null, bearcat.getBean("player", res[0]));
        }
    });
};

// 获取我的好友
DaoUser.prototype.getMyFriends = function (playerId, cb) {
    let sql = 'select friends from User where id = ?';
    let args = [playerId];
    let self = this;
    return new Promise((resolve, reject)=>{
        pomelo.app.get('dbclient').query(sql, args, function (err, res) {
            if (err !== null) {
                self.utils.invokeCallback(cb, err, null);
                reject(err);
            } else if (!res || res.length <= 0) {
                self.utils.invokeCallback(cb, null, null);
                resolve(null);
            } else {
                self.utils.invokeCallback(cb, null, res[0].friends);
                resolve(res[0].friends);
            }
        });
    });
};

// 获取玩家综合信息
DaoUser.prototype.getPlayerAllInfo = function (playerId, cb) {
    var self = this;
    async.parallel([
            function (callback) {
                self.getPlayer(playerId, function (err, player) {
                    if (!!err || !player) {
                        logger.error('Get user for daoUser failed! ' + err);
                    }
                    callback(err, player);
                });
            },
            function (callback) {
                self.daoBets.getBetStatistics(playerId, function (err, betStatistics) {
                    if (!!err) {
                        logger.error('Get task for taskDao failed!');
                    }
                    callback(err, betStatistics);
                });
            },
            function (callback) {
                self.daoBank.get(playerId, callback);
            }
        ],
        function (err, results) {
            if (!!err) {
                self.utils.invokeCallback(cb, err);
            } else {
                let player = results[0];
                if(player){
                    player.setBetStatistics(results[1]);
                    player.setBank(results[2]);
                }
                self.utils.invokeCallback(cb, null, player);
            }
        });
};

//获取玩家收益ID
DaoUser.prototype.getPlayersIncomeId = function (cb) {
    var sql = 'select id,level from User where role != ? and active =?';
    var args = [this.consts.RoleType.TRIAL,1];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, err.message, null);
        } else if (!res || res.length <= 0) {
            self.utils.invokeCallback(cb, null, []);
        } else {
            self.utils.invokeCallback(cb, null, res);
        }
    });
};

//获取玩家排行ID
DaoUser.prototype.getPlayersRankId = function (cb) {
    var sql = 'select id,roleName from User where role != ? and active = ?';
    var args = [this.consts.RoleType.TRIAL,1];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, err.message, null);
        } else if (!res || res.length <= 0) {
            self.utils.invokeCallback(cb, null, []);
        } else {
            self.utils.invokeCallback(cb, null, res);
        }
    });
};

//更新玩家余额
DaoUser.prototype.updateAccountAmount = function (playerId, add, cb) {
    var sql = 'update User set accountAmount = accountAmount + ?  where id = ?';
    var args = [add, playerId];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            logger.error('更新账户金额失败,', err);
            self.utils.invokeCallback(cb, err, false);
        } else {
            if (!!res && res.affectedRows > 0) {
                self.utils.invokeCallback(cb, null, true);
            } else {
                logger.error('updateAccountAmount player failed!');
                self.utils.invokeCallback(cb, null, false);
            }
        }
    });
};

// 获取玩家帐号余额
DaoUser.prototype.getAccountAmount = function (playerId, cb) {
    var sql = 'select  accountAmount from User where id = ?';
    var args = [playerId];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, err, null);
        } else {
            if (!!res && res.length > 0) {
                self.utils.invokeCallback(cb, null, res[0].accountAmount);
            } else {
                logger.error('updateAccountAmount player failed!');
                self.utils.invokeCallback(cb, 'user not exist', null);
            }
        }
    });
};

// 设置玩家激活状态
DaoUser.prototype.setPlayerActive = function (playerId, bActive, cb) {
    var sql = 'update User set active = ?  where id = ?';
    var args = [bActive?1:0, playerId];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, err, false);
        } else {
            if (!!res && res.affectedRows > 0) {
                self.utils.invokeCallback(cb, null, true);
            } else {
                self.utils.invokeCallback(cb, null, false);
            }
        }
    });
};

// 设置玩家是否可以发言
DaoUser.prototype.setPlayerCanTalk = function (playerId, bTalk, cb) {
    var sql = 'update User set forbidTalk = ?  where id = ?';
    var args = [bTalk?1:0, playerId];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, err, false);
        } else {
            if (!!res && res.affectedRows > 0) {
                self.utils.invokeCallback(cb, null, true);
            } else {
                self.utils.invokeCallback(cb, null, false);
            }
        }
    });
};

// 获取平台所有代理商
DaoUser.prototype.getAgents = function (cb) {
    logger.error('^^^^^^^^^^^^^^^^^^^^^DaoUser.getAgents 111111');
    var sql = 'select id, ext from User where role in(?,?) and active =?';
    var args = [this.consts.RoleType.AGENT1, this.consts.RoleType.AGENT2, 1];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, err.message, null);
        } else {
            if (!!res && res.length >= 1) {

                var agents = [];
                for (let i = 0; i < res.length; i++) {
                    logger.error('^^^^^^^^^^^^^^^^^^^^^DaoUser.getAgents:', res[i].ext, typeof res[i].ext);
                    agents.push({
                        id: res[i].id,
                        ext: JSON.parse(res[i].ext)
                    })
                }
                self.utils.invokeCallback(cb, null, agents);
            } else {
                self.utils.invokeCallback(cb, ' user not exist ', null);
            }
        }
    });
};

// 获取代理商的上级代理商
DaoUser.prototype.getUpperAgent = function (playerId, cb) {
    var self = this;
    var upperAgentId = {};

    return new Promise((resolve, reject)=>{
        async.waterfall([
                function (callback) {
                    self.getPlayer(playerId, callback);
                },
                function (player, callback) {
                    self.getPlayerByName(player.inviter, function (err, agent) {
                        if(!!err || !agent || !agent.active || (agent.role != self.consts.RoleType.AGENT1 && agent.role
                            != self.consts.RoleType.AGENT2)){
                            self.utils.invokeCallback(callback, '上级代理不存在', null);
                            resolve(null, null);
                            return;
                        }
                        logger.error('~~~~~DaoUser.getUpperAgent:',playerId, 'agent:', typeof agent.ext);
                        try {
                            upperAgentId = {
                                id: agent.id,
                                ext:agent.ext
                                // ext: JSON.parse(agent.ext)
                            };
                        }catch (err){
                            callback(err);
                            return;
                        }
                        callback();
                    });
                }
            ],
            function (err) {
                if (!!err) {
                    logger.error('~~~~~DaoUser.getUpperAgent err:', err, 'playerId:',playerId);
                    self.utils.invokeCallback(cb, err, null);
                    resolve(null, null);
                } else {
                    self.utils.invokeCallback(cb, null, upperAgentId);
                    resolve(null, upperAgentId);
                }
            });
    });
};

// 获取所以被禁言的用户ID
DaoUser.prototype.getForbidUserID = function (cb) {
    var sql = 'select * from  User where forbidTalk = ?';
    var args = [true];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, err.message, null);
        } else {
            if (!!res && res.length >= 1) {
                var userIds = [];
                for(let i = 0; i< res.length; ++i){
                    userIds.push(res[i].id);
                }
                self.utils.invokeCallback(cb, null, userIds);
            } else {
                self.utils.invokeCallback(cb, ' user not exist ', null);
            }
        }
    });
};

module.exports = {
    id: "daoUser",
    func: DaoUser,
    props: [
        {name: "utils", ref: "utils"},
        {name: "dataApiUtil", ref: "dataApiUtil"},
        {name: "daoBets", ref: "daoBets"},
        {name: "consts", ref: "consts"},
        {name: "daoBank", ref: "daoBank"},
    ]
}



