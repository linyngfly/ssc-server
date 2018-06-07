const models = require('../../../models');
const Task = require('../../../utils/task/task');
const utils = require('../../../utils/utils');
const ERROR_CODE = require('../../../consts/error_code').ERROR_CODE;

/**
 * redis数据定时同步到mysql
 */
class BetSync extends Task {
    constructor(conf) {
        super(conf);
    }

    /**
     * 执行定时任务
     * @private
     */
    async _exeTask(cb) {
        logger.info('玩家投注数据同步开始');
        await this._syncFullData();
        utils.invokeCallback(cb, null);
        logger.info('玩家投注数据同步完成');
    }

    _parseIds(res) {
        let betIds = [];
        for (let i = 0; i < res.length; i++) {
            let id = Number(res[i]);
            if (!isNaN(id) && id != 0) {
                betIds.push(id);
            }
        }
        return betIds;
    }

    async _toMysql(betId) {
        let bet = await models.bet.helper.getBet(betId);
        if (bet) {
            await models.bet.helper.setBet2Mysql(bet);
        }
    }

    async _syncFullData() {
        let _cursor = 0;
        do {
            let {cursor, result} = await redisConnector.sscan(models.constants.DATA_SYNC_BE_IDS, _cursor, this.taskConf.readLimit);
            let betIds = this._parseIds(result);
            for (let i = 0; i < betIds.length; i++) {
                try {
                    await this._toMysql(betIds[i]);
                    await redisConnector.srem(models.constants.DATA_SYNC_BE_IDS, betIds[i]);
                    logger.info(`玩家投注${betIds[i]}数据完整同步成功`);
                } catch (err) {
                    logger.error(`玩家投注${betIds[i]}数据完整同步失败`, err);
                }
            }
            _cursor = cursor;
            if (_cursor == 0) {
                return;
            }
        } while (1);
    }

}

module.exports = BetSync;




