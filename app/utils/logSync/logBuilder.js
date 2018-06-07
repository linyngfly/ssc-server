const moment = require('moment');
const taskPool = require('../task/taskPool');
const task_conf = require('./config');
const LogInsertTask = require('./logInsertTask');
const logTableDef = require('./logTableDef');

/**
 * TODO：日志构建
 */
class LogBuilder {
    constructor() {
        this.logInsertTask = new LogInsertTask(task_conf.logInsert);
        taskPool.addTask('logInsertTask', this.logInsertTask);
    }

    _genNow() {
        return moment().format('YYYY-MM-DD HH:mm:ss'); //坑爹：注意此处格式化，否则数据库可能写入失败
    }

    /**
     * 记录开奖历史信息
     * @param data
     */
    addLottery(data){
        //TODO 校验参数合法性
        this.logInsertTask.pushData(logTableDef.TYPE.TBL_LOTTERY, data);
    }

}

module.exports = new LogBuilder();

