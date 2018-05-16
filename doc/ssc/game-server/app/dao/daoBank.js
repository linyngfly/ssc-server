/**
 * Created by linyng on 17-6-16.
 */

const logger = require('pomelo-logger').getLogger(__filename);
const pomelo = require('pomelo');
const bearcat = require('bearcat');

function DaoBank() {
};

//绑定银行卡
DaoBank.prototype.bind = function (playerId, address, username, cardNO, alipay,wechat, cb) {
    var sql = 'insert into Bank (uid,address,username,cardNO, zhifubao, weixin, bindTime) values(?,?,?,?,?,?,?)';
    var args = [playerId, address, username, cardNO, alipay,wechat,Date.now()];
    var self = this;
    pomelo.app.get('dbclient').insert(sql, args, function (err, res) {
        if (err !== null) {
            logger.error(err);
            self.utils.invokeCallback(cb, err, null);
        } else {
            self.utils.invokeCallback(cb, null, {
                address:address,
                username:username,
                cardNO:cardNO,
                alipay:alipay,
                wechat:wechat
            });
        }
    });
};

DaoBank.prototype.setBankCard = function (playerId, address, username, cardNO, cb) {
    let sql = 'update Bank set address = ?, username = ?, cardNO=? where uid = ?';
    let args = [address, username, cardNO, playerId];
    let self = this;
    pomelo.app.get('dbclient').insert(sql, args, function (err, res) {
        if (err !== null) {
            logger.error(err);
            self.utils.invokeCallback(cb, err, null);
        } else {
            self.utils.invokeCallback(cb, null, true);
        }
    });
};

DaoBank.prototype.setAlipay = function (playerId, alipay, cb) {
    let sql = 'update Bank set zhifubao = ? where uid = ?';
    let args = [alipay, playerId];
    let self = this;
    pomelo.app.get('dbclient').insert(sql, args, function (err, res) {
        if (err !== null) {
            logger.error(err);
            self.utils.invokeCallback(cb, err, null);
        } else {
            self.utils.invokeCallback(cb, null, true);
        }
    });
};

DaoBank.prototype.setWechat = function (playerId, wechat, cb) {
    let sql = 'update Bank set weixin = ? where uid = ?';
    let args = [wechat, playerId];
    let self = this;
    pomelo.app.get('dbclient').insert(sql, args, function (err, res) {
        if (err !== null) {
            logger.error(err);
            self.utils.invokeCallback(cb, err, null);
        } else {
            self.utils.invokeCallback(cb, null, true);
        }
    });
};

DaoBank.prototype.get = function (playerId, cb) {
    var sql = 'select * from Bank where uid=?';
    var args = [playerId];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null || (!!res && res.length === 0)) {
            self.utils.invokeCallback(cb, null, null);
        } else {
            self.utils.invokeCallback(cb, null, {
                address:res[0].address,
                username:res[0].username,
                cardNO:res[0].cardNO,
                alipay:res[0].zhifubao,
                wechat:res[0].weixin
            });
        }
    });
};

module.exports = {
    id:"daoBank",
    func:DaoBank,
    props:[
        {name:'utils', ref:'utils'}
    ]
}