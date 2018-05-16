/**
 * Created by linyng on 17-5-22.
 */

var mysql = require('./mysql/mysql');
var async = require('async');
var defaultSysParam = require('../../../shared/config/sysParamConfig.json');

var DaoSysParam = module.exports;

DaoSysParam.getPlatformParam = function (callback) {
    var self = this;
    var sysConfig = null;
    async.waterfall([function (cb) {
        var sql = 'insert into config (info) values(?,?)';
        var args = [1, JSON.stringify(defaultSysParam)];

        mysql.insert(sql, args, function(err,res){
            if(err !== null){
                cb(null,null);
            } else {
                cb(null, defaultSysParam);
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

            mysql.insert(sql, args, function(err,res){
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
            callback(null, defaultSysParam);
        }
        else {
            callback(null, sysConfig);
        }
    });

};