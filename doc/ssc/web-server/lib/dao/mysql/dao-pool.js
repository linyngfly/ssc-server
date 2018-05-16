var _poolModule = require('generic-pool');
var configs = require('../../../../shared/config/mysql');
var mysql = require('mysql');

var env = process.env.NODE_ENV || 'development';

if(configs[env]) {
    configs = configs[env];
}

var createMysqlPool = function (app) {
    var pool  = mysql.createPool({
        connectionLimit : 10,
        host     : configs.host,
        user     : configs.user,
        password : configs.password,
        database : configs.database
    });
    return pool;
};

exports.createMysqlPool = createMysqlPool;
