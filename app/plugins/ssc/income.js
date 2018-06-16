const models = require('../../models');
const utils = require('../../utils/utils');
const logBuilder = require('../../utils/logSync/logBuilder');
const config = require('./config');
const schedule = require('node-schedule');

class Income {
    constructor() {
        this._schedule = null;
    }

    async start() {
        let _time = config.TASK.INCOME_DAILY_CALC.time.split(',');
        let cron_time = `${_time[0]} ${_time[1]} ${_time[2]} ${_time[3]} ${_time[4]} ${_time[5]}`;
        this._schedule = schedule.scheduleJob(cron_time, async function () {
            await this._calcPlayerIncome();
            await this._calcAgentIncome();
        }.bind(this));
    }

    async stop() {
        if (this._schedule) {
            this._schedule.cancel();
            this._schedule = null;
        }
    }

    /**
     * 计算玩家反水收益
     * @returns {Promise<void>}
     */
    async _calcPlayerIncome() {
        let yesterday_zero = utils.timestamp_yesterday();
        yesterday_zero = new Date(yesterday_zero);

        let today_zero = utils.timestamp_today();
        today_zero = new Date(today_zero);

        let rows = await mysqlConnector.query('SELECT id FROM tbl_user WHERE role=? AND test>0 AND updated_at>=?',
            [models.constants.ROLE.PLAYER, yesterday_zero.format()]);

        if (!rows || rows.length == 0) {
            return;
        }

        for (let i = 0; i < rows.length; ++i) {
            let uid = rows[i].id;
            try {
                let dayBetInfos = await mysqlConnector.query('SELECT SUM(betMoney) as dayBetMoney, SUM(winMoney) as dayWinMoney,SUM(betCount) as dayBetCount, SUM(winCount) as dayWinCount,COUNT(DISTINCT period) AS periodCount, SUM(multi) AS multiCount, identify FROM tbl_bets WHERE uid=? AND betTime>=? AND betTime<? AND state IN(?,?) GROUP BY identify',
                    [uid, yesterday_zero.format(), today_zero.format(), models.constants.BET_STATE.WIN, models.constants.BET_STATE.LOSE]);

                if (!dayBetInfos && dayBetInfos.length == 0) {
                    continue;
                }

                for (let j = 0, len = dayBetInfos.length; j < len; ++j) {
                    let dayBetInfo = dayBetInfos[j];
                    if (dayBetInfo.dayBetCount == 0) {
                        continue;
                    }

                    let identify = dayBetInfo.identify;
                    let incomeConfig = this._getPlayerConfig(identify);
                    let period_count = dayBetInfo.periodCount;
                    let multi_rate = Number((dayBetInfo.multiCount / dayBetInfo.dayBetCount).toFixed(2));
                    let incomeMoney = dayBetInfo.dayWinMoney - dayBetInfo.dayBetMoney;
                    let dayIncomeInfo = {
                        uid: uid,
                        identify: identify,
                        betMoney: dayBetInfo.dayBetMoney,
                        incomeMoney: incomeMoney,
                        defectionMoney: 0,
                        defectionRate: 0,
                        winRate: Number(((dayBetInfo.dayWinCount / dayBetInfo.dayBetCount) * 100).toFixed(2)),
                        periodCount: dayBetInfo.periodCount,
                        multiRate: multi_rate,
                        incomeTime: yesterday_zero.format()
                    };

                    let defectionRate = 0;
                    let defectionMoney = 0;
                    if (period_count >= incomeConfig.PERIOD_COUNT && multi_rate >= incomeConfig.MULTI_RATE && incomeMoney < 0) {
                        let range = incomeConfig.RANGE;
                        let num = Math.abs(incomeMoney);
                        for (let k = 0, len = range.length; k < len; ++k) {
                            let item = range[k];
                            let section = item[0];
                            if (section[0] == -1 && num < section[1] || num >= section[0] && num < section[1]
                                || section[1] == -1 && num >= section[0]) {
                                defectionRate = item[1];
                                defectionMoney = defectionRate * num;
                                break;
                            }
                        }
                    }

                    dayIncomeInfo.defectionMoney = defectionMoney;
                    dayIncomeInfo.defectionRate = defectionRate;
                    logBuilder.addLog(logBuilder.tbl_id.TBL_PLAYER_INCOME, dayIncomeInfo);
                }
            } catch (err) {
                err;
            }
        }
    }

    /**
     * 计算代理商分成
     */
    async _calcAgentIncome() {
        let yesterday_zero = utils.timestamp_yesterday();
        yesterday_zero = new Date(yesterday_zero);

        let today_zero = utils.timestamp_today();
        today_zero = new Date(today_zero);

        let rows = await mysqlConnector.query('SELECT id FROM tbl_user WHERE role=? AND test>0',
            [models.constants.ROLE.AGENT]);

        if (!rows || rows.length == 0) {
            return;
        }

        for (let i = 0; i < rows.length; ++i) {
            let uid = rows[i].id;
            let agentRows = await mysqlConnector.query('SELECT id FROM tbl_user WHERE inviter=? AND test>0', [uid]);
            if (!agentRows || agentRows.length == 0) {
                continue;
            }

            try {
                let params = [yesterday_zero.format(), today_zero.format(), models.constants.BET_STATE.WIN, models.constants.BET_STATE.LOSE];
                let sql = 'SELECT SUM(betMoney) as dayBetMoney, SUM(winMoney) as dayWinMoney, identify FROM tbl_bets WHERE betTime>=? AND betTime<? AND state IN(?,?) AND uid IN(';
                for(let i=0;i<agentRows.length;i++){
                    params.push(agentRows[i].id);
                    if(i == agentRows.length-1){
                        sql += '?';
                    }else {
                        sql += '?,';
                    }
                }
                sql += ') GROUP BY identify';
                let dayBetInfos = await mysqlConnector.query(sql, params);
                if (!dayBetInfos && dayBetInfos.length == 0) {
                    continue;
                }

                for (let j = 0, len = dayBetInfos.length; j < len; ++j) {
                    let dayBetInfo = dayBetInfos[j];
                    if (dayBetInfo.dayBetMoney == 0) {
                        continue;
                    }

                    let identify = dayBetInfo.identify;
                    let incomeConfig = this._getAgentConfig(identify);
                    let incomeMoney = dayBetInfo.dayWinMoney - dayBetInfo.dayBetMoney;
                    let dayIncomeInfo = {
                        uid: uid,
                        identify: identify,
                        betMoney: dayBetInfo.dayBetMoney,
                        incomeMoney: incomeMoney,
                        rebateMoney: 0,
                        rebateRate: 0,
                        incomeTime: yesterday_zero.format()
                    };

                    let rebateRate = 0;
                    let rebateMoney = 0;
                    if (incomeMoney < 0) {
                        let range = incomeConfig.RANGE;
                        let num = Math.abs(incomeMoney);
                        for (let k = 0, len = range.length; k < len; ++k) {
                            let item = range[k];
                            let section = item[0];
                            if (section[0] == -1 && num < section[1] || num >= section[0] && num < section[1]
                                || section[1] == -1 && num >= section[0]) {
                                rebateRate = item[1];
                                rebateMoney = rebateRate * num;
                                break;
                            }
                        }
                    }

                    dayIncomeInfo.rebateMoney = rebateMoney;
                    dayIncomeInfo.rebateRate = rebateRate;
                    logBuilder.addLog(logBuilder.tbl_id.TBL_AGENT_INCOME, dayIncomeInfo);
                }
            } catch (err) {
                err;
            }
        }
    }

    _getPlayerConfig(identify) {
        let cfg = null;
        switch (identify) {
            case config.LUCKY28.GAME_IDENTIFY:
                cfg = config.LUCKY28.INCOME.PLAYER;
                break;
            case config.CANADA28.GAME_IDENTIFY:
                cfg = config.CANADA28.INCOME.PLAYER;
                break;
        }

        return cfg;
    }

    _getAgentConfig(identify) {
        let cfg = null;
        switch (identify) {
            case config.LUCKY28.GAME_IDENTIFY:
                cfg = config.LUCKY28.INCOME.AGENT;
                break;
            case config.CANADA28.GAME_IDENTIFY:
                cfg = config.CANADA28.INCOME.AGENT;
                break;
        }

        return cfg;
    }


}

module.exports = Income;