const models = require('../../models');
const utils = require('../../utils/utils');

class Income {
    async start() {

    }

    async stop() {

    }


    /**
     * 计算玩家反水收益
     * @returns {Promise<void>}
     */
    async calcPlayerIncome() {
        let yesterday_zero = utils.timestamp_yesterday();
        yesterday_zero = new Date(yesterday_zero);

        let today_zero = utils.timestamp_today();
        today_zero = new Date(today_zero);

        let rows = await mysqlConnector.query('SELECT id FROM tbl_user WHERE role=? AND test>0 AND updated_at>=?',
            [models.constants.ROLE.PLAYER, yesterday_zero.format()]);

        if (!rows || rows.length == 0) {
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            let uid = rows[i].id;
            let dayBetInfo = await this._getPlayerBetInfo(uid, yesterday_zero.format(), today_zero.format());
            if(!dayBetInfo){
                continue;
            }

            let dayIncomeInfo = {
                playerId: uid,
                betMoney: dayBetInfo.dayBetMoney,
                incomeMoney: dayBetInfo.dayWinMoney - dayBetInfo.dayBetMoney,
                defection: 0,
                defectionRate: 0,
                winRate: Number(((dayBetInfo.dayWinCount/dayBetInfo.dayBetCount)*100).toFixed(2)),
                incomeTime: yesterday_zero.format()
            };


        }
    }

    /**
     * 获取玩家指定时间段的投注信息
     * @param uid
     * @param beginTime
     * @param endTime
     * @private
     */
    async _getPlayerBetInfo(uid, beginTime, endTime){
        let rows = await mysqlConnector.query('SELECT SUM(betMoney) as dayBetMoney, SUM(winMoney) as' +
            ' dayWinMoney,SUM(betCount) as dayBetCount, SUM(winCount) as' +
            ' dayWinCount FROM tbl_bets WHERE uid=? betTime >=? AND betTime < ? AND state IN(?,?)',
            [uid, beginTime, endTime, models.constants.BET_STATE.WIN, models.constants.BET_STATE.LOSE]);
        if(rows && rows[0] && rows[0].dayBetCount != 0){
            return rows[0];
        }
    }


}

module.exports = Income;