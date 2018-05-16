/**
 * Created by linyng on 17-5-21.
 */

var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var bearcat = require('bearcat');

var DaoRecord = function () {

};

DaoRecord.prototype.add = function (playerId, num, type, status, freeMoney, operator, bankInfo, cb) {
    var sql = 'insert into Record (uid,num,type,create_time, status, accountAmount, operator, bankInfo) values(?,?,?,?,?,?,?,?)';
    var args = [playerId, num, type, Date.now(), status, freeMoney, operator, bankInfo];
    var self = this;
    pomelo.app.get('dbclient').insert(sql, args, function (err, res) {
        if (err !== null) {
            logger.error('写入资金流动记录失败,', err, '|uid:', playerId, '|num:', num, '|type:', type);
            self.utils.invokeCallback(cb, err, false);
        } else {
            self.utils.invokeCallback(cb, null, true);
        }
    });
};

DaoRecord.prototype.getRecords = function (playerId, skip, limit, cb) {
    var sql = 'select * from Record where uid= ? ORDER BY create_time DESC limit ?,?';
    var self = this;
    pomelo.app.get('dbclient').insert(sql, [playerId, skip, limit], function (err, res) {
        if (err !== null) {
            logger.error('读取流水记录失败,', err);
            self.utils.invokeCallback(cb, {code: err.number, msg: err.message}, null);
        } else {
            self.utils.invokeCallback(cb, null, res);
        }
    });
};

DaoRecord.prototype.getRecord = function (orderId, cb) {
    var sql = 'select * from Record where id= ?';
    var self = this;
    pomelo.app.get('dbclient').insert(sql, [orderId], function (err, res) {
        if (err !== null || res.length === 0) {
            logger.error('读取流水记录失败,', err);
            self.utils.invokeCallback(cb, '流水记录不存在', null);
        } else {
            self.utils.invokeCallback(cb, null, res[0]);
        }
    });
};

DaoRecord.prototype.setOperate = function (orderId, status, operator, bankInfo, cb) {
    var sql = 'update Record set status =?,operator = ?, bankInfo = ? where id= ?';
    var self = this;
    pomelo.app.get('dbclient').insert(sql, [status, operator, bankInfo, orderId], function (err, res) {
        if (err !== null) {
            logger.error('设置流水记录状态失败,', err);
            self.utils.invokeCallback(cb, err);
        } else {
            self.utils.invokeCallback(cb, null);
        }
    });

};

module.exports = {
    id: "daoRecord",
    func: DaoRecord,
    props: [
        {name: "utils", ref: "utils"}
    ]
}