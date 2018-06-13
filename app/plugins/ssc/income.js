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

        let rows = await mysqlConnector.query('SELECT id FROM tbl_user role=? AND test>0 AND updated_at>=?',
            [models.constants.ROLE.PLAYER, yesterday_zero.format()]);

        if (!rows || rows.length == 0) {
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            let uid = rows[i].id;

        }
    }


}

module.exports = Income;