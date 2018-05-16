/**
 * Created by linyng on 17-5-22.
 */

const logger = require('pomelo-logger').getLogger(__filename);
const pomelo = require('pomelo');
const bearcat = require('bearcat');
const async = require('async');

var DaoConfig = function () {

};

DaoConfig.prototype.initPlatformParam = function (configs, callback) {
    var self = this;
    var sysConfig = null;
    async.waterfall([function (cb) {
        var sql = 'insert into config values(?,?)';
        var args = [1, JSON.stringify(configs)];
        pomelo.app.get('dbclient').insert(sql, args, function(err,res){
            if(err !== null){
                cb(null,null);
            } else {
                cb(null, configs);
            }
        });
    },function (res,cb) {
        if(res){
            sysConfig = res;
            cb();
        }
        else {
            var sql = 'select * from config where id = ?';
            var args = [1];

            pomelo.app.get('dbclient').query(sql,args,function(err, res){
                if(err !== null){
                    cb(err);
                } else {
                    if (!!res && res.length === 1) {
                        sysConfig = JSON.parse(res[0].info);
                        cb();
                    } else {
                        cb('sys config not exist');
                    }
                }
            });

        }
    }],function (err) {
        if(err){
            self.utils.invokeCallback(callback, err, null);
        }
        else {
            self.utils.invokeCallback(callback, null, sysConfig);
        }
    });

};

DaoConfig.prototype.updateConfig = function (configs, cb) {
    var sql = 'update config set info = ?  where id = 1';
    var args = [JSON.stringify(configs)];
    var self = this;
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, err.message, false);
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

module.exports = {
    id: "daoConfig",
    func: DaoConfig,
    props: [
        {name: "utils", ref: "utils"},
        {name: "consts", ref: "consts"}
    ]
}