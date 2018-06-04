const schedule = require('node-schedule');

class Task {
    constructor(conf) {
        this.taskConf = conf;
        this.schedule = null;
        this.busy = false;
        this._taskId = null;
    }

    set taskId(value) {
        this._taskId = value;
    }

    get taskId() {
        return this._taskId;
    }

    _exeTask() { }

    /**
     * 启动定时任务
     * @param cfg 任务配置信息
     */
    run() {
        let _time = this.taskConf.time.split(',');
        let cron_time = `${_time[0]} ${_time[1]} ${_time[2]} ${_time[3]} ${_time[4]} ${_time[5]}`;

        let self = this;
        this.schedule = schedule.scheduleJob(cron_time, function () {
            if (self.busy) {
                logger.warn(self.taskId + '任务繁忙');
                return;
            }
            self.busy = true;
            self._exeTask(function (err) {
                self.busy = false;
            });
        }.bind(this));
    }

    /**
     * 取消定时任务
     */
    cancle() {
        if (this.schedule) {
            this.schedule.cancel();
            this.schedule = null;
        }
        this._exeTask();
    }

    get config() {
        return this.taskConf;
    }
}

module.exports = Task;