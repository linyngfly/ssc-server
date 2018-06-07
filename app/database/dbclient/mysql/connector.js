/**
 * Created by linyng on 2017/4/20.
 */
// sequelize-auto -o "./models" -d fishjoy -h localhost -u root -p 3306 -x root -e mysql

const mysql = require('mysql');
const async = require('async');
const utils = require('../../../utils/utils');
const ERROR_OBJ = require('../../../consts/error_code').ERROR_OBJ;


class Connector {
    constructor() {
        this.pool = null;
        logger.error('-----------------MysqlConnector');
    }

    start(opts, cb) {
        return new Promise(function (resolve, reject) {
            if (!opts.enable) {
                utils.invokeCallback(cb, null);
                resolve(false);
                return;
            }

            if (this.pool) {
                utils.invokeCallback(cb, null);
                resolve(false);
                return;
            }

            this.insert = this._query;
            this.update = this._query;
            this.delete = this._query;
            this.query = this._query;

            this.pool = this._createPool(opts);
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    utils.invokeCallback(cb, '数据库连接失败' + err);
                    logger.error('MySQL数据库连接失败', err);
                    resolve(false);
                } else {
                    connection.release();
                    logger.error('MySQL数据库连接成功');
                    global.mysqlConnector = this;
                    utils.invokeCallback(cb, null, this);
                    resolve(true);
                }
            }.bind(this));
        }.bind(this));
    }

    stop() {
        this.pool.end(function (err) {
            logger.error('mysql all connections in the pool have ended');
        });
    }

    /**
     * 通过事务执行数据库操作
     * @param sqlCmds
     * @param callback
     */
    execTransaction(sqlCmds, cb) {
        return new Promise(function (resolve, reject) {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    logger.error('mysql getConnection err:', err);
                    utils.invokeCallback(cb, err);
                    reject(ERROR_OBJ.DB_ERR);
                    return;
                }
                connection.beginTransaction(async function (err) {
                    if (err) {
                        connection.release();
                        logger.error('mysql beginTransaction err:', err);
                        utils.invokeCallback(cb, err);
                        reject(ERROR_OBJ.DB_ERR);
                        return;
                    }

                    let funcArray = [];
                    for (let i = 0; i < sqlCmds.length; i++) {
                        let sqlCmd = sqlCmds[i];
                        let func = async function () {
                            let sql = sqlCmd.sql;
                            let param = sqlCmd.params;
                            return new Promise(function (resolve, reject) {
                                connection.query(sql, param, function (err) {
                                    if (err) {
                                        logger.error('mysql operate err=', err);
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                        };
                        funcArray.push(func);
                    }

                    for (let i = 0; i < funcArray.length; i++) {
                        let func = funcArray[i];
                        try {
                            await func();
                        } catch (e) {
                            logger.error("数据库操作失败， error: " + e);
                            connection.rollback(function (err) {
                                logger.error("事务回滚失败， error: " + err);
                                connection.release();
                                utils.invokeCallback(cb, err);
                                reject(ERROR_OBJ.DB_ERR);
                                return;
                            });
                        }
                    }

                    connection.commit(function (err) {
                        connection.release();
                        utils.invokeCallback(cb, err);
                        if (err) {
                            logger.error("执行事务失败，", err);
                            reject(ERROR_OBJ.DB_ERR);
                        } else {
                            resolve();
                        }
                    });

                });
            });
        }.bind(this));
    }

    _query(sql, args, cb) {
        if (typeof args === 'function') {
            cb = args;
        }
        return new Promise(function (resolve, reject) {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    logger.error('mysql getConnection err:', err);
                    utils.invokeCallback(cb, err);
                    reject(ERROR_OBJ.DB_ERR);
                    return;
                }

                connection.query(sql, args, function (err, results) {
                    connection.release();
                    utils.invokeCallback(cb, err, results);
                    if (err) {
                        logger.error('mysql operate sql:', sql);
                        logger.error('mysql operate args:', args);
                        logger.error('mysql operate err:', err);
                        reject(ERROR_OBJ.DB_ERR);
                    } else {
                        resolve(results);
                    }
                });

            });
        }.bind(this));
    }

    _createPool(opts) {
        if (!opts.enable) {
            return;
        }

        logger.info(opts);

        let options = {
            host: opts.server.host,
            port: opts.server.port,
            database: opts.server.database,
            user: opts.server.user,
            password: opts.server.password,
            charset: opts.server.charset,
            insecureAuth: opts.server.auth,
            connectionLimit: opts.ext.poolSize,
        };

        return mysql.createPool(options);
    }


}

module.exports = Connector;