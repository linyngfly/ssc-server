const moment = require('moment');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;

class MysqlHelper {
    constructor(models, sqlConst) {
        this._models = models;
        this._sqlConst = sqlConst;
    }

    async setTableRow(rows) {
        if (!Array.isArray(rows)) {
            rows = [rows];
        }
        let sqlCmds = [];
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let sqlRow = this._obj2SqlObj(row);
            let tables = this._sqlConst.TABLES;
            for (let i = 0; i < tables.length; i++) {
                let table = tables[i];
                let sqlKey = [];
                let sqlValue = [];
                for (let field in this._models) {
                    let modelItem = this._models[field];
                    if (modelItem.tbl == table) {
                        if (sqlRow[field] != null) {
                            sqlKey.push(field);
                            sqlValue.push(sqlRow[field]);
                        }
                    }
                }
                if (sqlKey.length < 2) {
                    continue;
                }
                if(sqlKey.indexOf('id') == -1){
                    sqlKey.push('id');
                    sqlValue.push(row.id);
                }
                let sql = this._sqlObj2sqlCmd(table, sqlKey);
                logger.error('sql=', sql);
                logger.error('sqlValue=', sqlValue);
                sqlCmds.push({
                    sql: sql,
                    params: sqlValue
                });
            }
        }

        if (sqlCmds.length == 0) {
            return;
        }

        await mysqlConnector.execTransaction(sqlCmds);
    }

    async getTableRow(uid, fields) {
        if (uid == null) {
            throw ERROR_OBJ.PARAM_MISSING;
        }

        let sqlTableFields = {};
        if (null == fields || fields.length == 0) {
            fields = this._sqlConst.MODEL_FIELDS;
        }

        for (let i in fields) {
            let field = fields[i];
            let t = this._models[field].tbl;
            if (t) {
                sqlTableFields[t] = sqlTableFields[t] || new Set();
                sqlTableFields[t].add(field);
            }
        }

        if (Object.keys(sqlTableFields).length == 0) {
            return;
        }

        //字段去重
        for (let table in sqlTableFields) {
            sqlTableFields[table] = Array.from(sqlTableFields[table]);
        }

        let sql = this._genSqlQueryCmd(sqlTableFields);
        let rows = await mysqlConnector.query(sql, [uid]);
        if (rows && rows[0]) {
            return this._sqlObj2Obj(rows[0]);
        }
    }

    _genSqlQueryCmd(sqlTableFields) {
        let sql = `SELECT `;
        let head = true;
        for (let table in sqlTableFields) {
            let tableFields = sqlTableFields[table];
            for (let i = 0; i < tableFields.length; i++) {
                if (head) {
                    sql += `${table}.${tableFields[i]} `;
                    head = false;
                } else {
                    sql += `,${table}.${tableFields[i]} `;
                }
            }
        }
        sql += `FROM ${this._sqlConst.PRI_TABLE} `;

        for (let table in sqlTableFields) {
            if (table != this._sqlConst.PRI_TABLE) {
                sql += `LEFT JOIN ${table} ON ${this._sqlConst.PRI_TABLE}.${this._sqlConst.PRI_KEY}=${table}.${this._sqlConst.PRI_KEY} `;
            }
        }

        sql += `WHERE ${this._sqlConst.PRI_TABLE}.${this._sqlConst.PRI_KEY}=? `;

        return sql;
    }

    _sqlObj2sqlCmd(table, sqlObj) {
        let sql = "INSERT INTO " + '`' + table + "`" + " (";
        for (let i in sqlObj) {
            if (i == 0) {
                sql += "`" + sqlObj[i] + "`";
            } else {
                sql += "," + "`" + sqlObj[i] + "`";
            }
        }
        sql += ") VALUES(";
        for (let i in sqlObj) {
            if (i == 0) {
                sql += "?";
            } else {
                sql += ",?";
            }
        }
        sql += ") ON DUPLICATE KEY UPDATE ";

        let k = 0;
        for (let i in sqlObj) {
            if (k == 0 && sqlObj[i] != this._sqlConst.PRI_KEY) {
                sql += "`" + sqlObj[i] + "`" + "=VALUES(" + "`" + sqlObj[i] + "`" + ")";
                k++;
            } else if (k > 0 && sqlObj[i] != this._sqlConst.PRI_KEY) {
                sql += "," + "`" + sqlObj[i] + "`" + "=VALUES(" + "`" + sqlObj[i] + "`" + ")";
            }
        }
        return sql;
    }

    _sqlObj2Obj(row) {
        let result = {};
        for (let field in this._models) {
            let value = row[field];
            if (value != null) {
                if (this._models[field].type === 'object') {
                    try {
                        result[field] = JSON.parse(value);
                    } catch (err) {
                        logger.error(`用户${row.id}数据${field}解析错误：${value}`);
                    }
                } else if (this._models[field].type === 'timestamp') {
                    if (typeof (value) === 'string' && value.indexOf('-') === -1) {
                        value = Number(value);
                    }
                    result[field] = moment(value).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    result[field] = value;
                }
            }
        }
        return result;
    }

    _obj2SqlObj(row) {
        let result = {};
        for (let key in this._models) {
            if (row[key] != null) {
                if (this._models[key].type == 'object') {
                    result[key] = JSON.stringify(row[key]);
                } else {
                    result[key] = row[key];
                }
            }
        }
        return result;
    }
}

module.exports = MysqlHelper;