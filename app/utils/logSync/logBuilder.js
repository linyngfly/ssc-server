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
        this._tbl_id = logTableDef.TYPE;
    }

    get tbl_id(){
        return this._tbl_id;
    }

    _genNow() {
        return moment().format('YYYY-MM-DD HH:mm:ss'); //坑爹：注意此处格式化，否则数据库可能写入失败
    }

    /**
     * 添加log
     * @param data
     */
    addLog(tbl_id, data){
        this.logInsertTask.pushData(tbl_id, data);
    }

    /**
     * 记录开奖历史信息
     * @param data
     */
    addLotteryLog(data){
        //TODO 校验参数合法性
        this.logInsertTask.pushData(logTableDef.TYPE.TBL_LOTTERY, data);
    }

    addMoneyLog(data){
        //TODO 校验参数合法性
        data.created_at = this._genNow();
        data.gain = data.gain || 0;
        data.cost = data.cost || 0;
        if(data.gain == 0 && data.cost == 0){
            return;
        }

        this.logInsertTask.pushData(logTableDef.TYPE.TBL_MONEY_LOG, data);
    }

}

module.exports = new LogBuilder();

