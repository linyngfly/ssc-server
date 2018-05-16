/**
 * Created by linyng on 2017/4/20.
 */

var mysql = require('mysql');
var logger = require('pomelo-logger').getLogger(__filename);
var createMysqlPool = function (app) {
    var configs = app.get('mysql');
    var pool  = mysql.createPool({
        connectionLimit : 10,
        host     : configs.host,
        user     : configs.user,
        password : configs.password,
        database : configs.database
    });
    logger.info("999999999999999",configs.host,configs.user,configs.password,configs.datebase);
    return pool;
};

exports.createMysqlPool = createMysqlPool;


