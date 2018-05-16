/**
 * Created by linyng on 17-6-22.
 */

const mysql = require('./mysql/mysql');

let daoReset = module.exports;

daoReset.getReset = function (username, cb) {
    var sql = 'select * from  reset where username = ? and used = ? order by create_time DESC';
    var args = [username, 0];
    mysql.query(sql,args,function(err, res){
        if(err !== null){
            cb(err.message, null);
        } else {
            if (!!res && res.length >= 1) {
                cb(null, res[0]);
            } else {
                cb(null, null);
            }
        }
    });
};

daoReset.setUsed = function (id, used, cb) {
    var sql = 'UPDATE reset SET used= ? WHERE id = ?';
    var args = [used, id];
    mysql.update(sql,args,function(err, res){
        if(err !== null){
            !!cb && cb(err, false);
        } else {
            !!cb && cb(null, true);
        }
    });
};