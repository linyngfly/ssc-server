const ERROR_OBJ = require('./error_code').ERROR_OBJ;
const models = require('../../models');
const Token = require('../../utils/token');
const eventType = require('../../consts/eventType');
const config = require('./config');
const SSC28Income = require('./ssc28Income');
const schedule = require('node-schedule');
const logBuilder = require('../../utils/logSync/logBuilder');
const EventEmitter = require('events').EventEmitter;
// ip:116.31.100.75
// ip:119.63.35.75
// :22
// root
// Y/w@YnFw9QtT#J#smV

class Hall extends EventEmitter{
    constructor(){
        super();
        this._adminToken = null;
        this._broadcast = {content:config.BROADCAST};
        this._schedule = null;
        this._ssc28Income = new SSC28Income();
    }

    async _updateDailyReset(){
        await this._updateAdminToken();
        await models.account.helper.delAccountField(models.account.fieldConst.DAILY_DRAW);
    }

    async loadConfig(){
        //初始化GM联系信息
        let rows = mysqlConnector.query('SELECT * FROM `tbl_config` WHERE identify=? AND type=?',
            ['ssc', 'gm']);
        if(!rows || !rows[0]){
            await mysqlConnector.query('INSERT INTO `tbl_config` (`identify`, `type`, `info`) ' +
                'VALUES(?,?,?) ON DUPLICATE KEY UPDATE identify=VALUES(identify), type=VALUES(type), info=VALUES(info)',
                ['ssc', 'gm', JSON.stringify({wechat:'kefu001',QQ:'13380323'})]);
        }

        rows = mysqlConnector.query('SELECT * FROM `tbl_config` WHERE identify=? AND type=?',
            ['ssc', 'broadcast']);
        if(!rows || !rows[0]){
            await mysqlConnector.query('INSERT INTO `tbl_config` (`identify`, `type`, `info`) ' +
                'VALUES(?,?,?) ON DUPLICATE KEY UPDATE identify=VALUES(identify), type=VALUES(type), info=VALUES(info)',
                ['ssc', 'broadcast', JSON.stringify({content:'高回报，低投入，欢迎玩耍'})]);
        }else {
            this._broadcast = JSON.parse(rows[0].info);
        }
    }

    async _updateAdminToken(){
        //刷新admin_token
        this._adminToken = Token.create(8888, Date.now(), '123456789');
        await mysqlConnector.query('INSERT INTO `tbl_config` (`identify`, `type`, `info`) ' +
            'VALUES(?,?,?) ON DUPLICATE KEY UPDATE identify=VALUES(identify), type=VALUES(type), info=VALUES(info)',
            ['ssc', 'admin_token', JSON.stringify({token:this._adminToken})]);
    }

    async start() {
        await this.loadConfig();
        await this._updateAdminToken();

        let _time = config.TASK.CONFIG_DAILY_RESET.time.split(',');
        let cron_time = `${_time[0]} ${_time[1]} ${_time[2]} ${_time[3]} ${_time[4]} ${_time[5]}`;
        this._schedule = schedule.scheduleJob(cron_time, async function () {
            await this._updateDailyReset();
        }.bind(this));
        await this._ssc28Income.start();
        logger.error('Hall start');
    }

    async stop() {
        if (this._schedule) {
            this._schedule.cancel();
            this._schedule = null;
        }
        await this._ssc28Income.stop();
        logger.error('Hall stop');
    }

    async recharge(data) {
        let money = Number(data.money);
        if (Number.isNaN(money)) {
            throw ERROR_OBJ.PARAM_WRONG_TYPE;
        }
        let account = data.account;
        await mysqlConnector.query('INSERT INTO `tbl_order` (`uid`, `money`, `type`, `bankInfo`,`state`) VALUES (?,?,?,?,?)',
            [account.uid, money, 1, data.bankInfo, 1]);
    }

    async cash(data) {
        let money = Number(data.money);
        if (Number.isNaN(money)) {
            throw ERROR_OBJ.PARAM_WRONG_TYPE;
        }

        let account = data.account;
        account.money = -money;
        await account.commit();

        logBuilder.addMoneyLog({
            uid:account.uid,
            cost:money,
            total:account.money,
            scene:models.constants.GAME_SCENE.CASH
        });

        if (account.money < 0) {
            account.money = money;
            await account.commit();
            throw ERROR_OBJ.ACCOUNT_AMOUNT_NOT_ENOUGH;
        }

        await mysqlConnector.query('INSERT INTO `tbl_order` (`uid`, `money`, `type`, `bankInfo`,`state`) VALUES (?,?,?,?,?)',
            [account.uid, money, 2, data.bankInfo, 1]);

        return {
            money: account.money
        };

    }

    async getBankLog(data){
        let skip = data.skip || 0;
        let limit = data.limit || 20;
        let rows = await mysqlConnector.query('SELECT * FROM tbl_money_log WHERE uid=? ORDER BY created_at DESC LIMIT ?,?',
            [data.uid, skip, limit]);

        return rows || [];
    }

    async getMyDefection(data){
        let skip = data.skip || 0;
        let limit = data.limit || 20;
        let rows = await mysqlConnector.query('SELECT * FROM tbl_player_income WHERE uid=? ORDER BY created_at DESC LIMIT ?,?',
            [data.uid, skip, limit]);

        return rows || [];
    }

    async getMyRebate(data){
        let skip = data.skip || 0;
        let limit = data.limit || 20;
        let rows = await mysqlConnector.query('SELECT * FROM tbl_agent_income WHERE uid=? ORDER BY created_at DESC LIMIT ?,?',
            [data.uid, skip, limit]);

        return rows || [];
    }

    async bindPayInfo(data){
        let account = data.account;
        account[config.BANK_FIELD[data.type]] = data.info;
        await account.commit();
    }

    async setOrderState(data){
        if(data.token !== this._adminToken){
            throw ERROR_OBJ.TOKEN_INVALID;
        }

        let rows = await mysqlConnector.query('SELECT * FROM `tbl_order` WHERE id=?', [data.id]);
        if(!rows || !rows[0]){
            logger.error('订单不存在');
            throw ERROR_OBJ.ORDER_ILLEGAL;
        }

        let order = rows[0];

        if(order.state != 1){
            return;
        }

        let account = await models.account.helper.getAccount(order.uid, models.account.fieldConst.MONEY);
        if(data.state == 2){ //确认
            if(order.type == 1){ //充值
                account.money = order.money;

                logBuilder.addMoneyLog({
                    uid:account.uid,
                    gain:order.money,
                    total:account.money,
                    scene:models.constants.GAME_SCENE.RECHARGE
                });

                await account.commit();
            }
        }else if(data.state == 3){
            if(order.type == 2){ //提现
                account.money = order.money;
                logBuilder.addMoneyLog({
                    uid:order.uid,
                    gain:order.money,
                    total:account.money,
                    scene:models.constants.GAME_SCENE.CASH_CANCEL
                });
                await account.commit();
            }
        }
        await mysqlConnector.query('UPDATE `tbl_order` SET state=?,operator=? WHERE id=?',
            [data.state, data.operator, data.id]);
    }

    async getGMInfo(data){
        let rows = mysqlConnector.query('SELECT * FROM `tbl_config` WHERE identify=? AND type=?',
            ['ssc', 'gm']);

        if (rows && rows[0]) {
            let info = rows[0];
            return info;
        }
    }

    async setPlayerInfo(data){
        let fields = data.fields;
        for(let key in fields){
            let typeInfo = models.account.modelDefine[key];
            if(typeInfo && typeInfo.modify == true){
                data.account[key] = fields[key];
            }else {
                throw ERROR_OBJ.PLAYER_FIELD_CANNOT_MODIFY;
            }
        }
        await data.account.commit();
    }

    async getBroadcast(data){
        return this._broadcast;
    }

    async setBroadcast(data){
        if(data.token !== this._adminToken){
            throw ERROR_OBJ.TOKEN_INVALID;
        }

        this._broadcast = {content:data.content};
        await mysqlConnector.query('INSERT INTO `tbl_config` (`identify`, `type`, `info`) ' +
            'VALUES(?,?,?) ON DUPLICATE KEY UPDATE identify=VALUES(identify), type=VALUES(type), info=VALUES(info)',
            ['ssc', 'broadcast', JSON.stringify(this._broadcast)]);
        this.emit(config.HALL_EVENT.BROADCAST, this._broadcast);
    }

    async setInitMoney(data){
        if(data.token !== this._adminToken){
            throw ERROR_OBJ.TOKEN_INVALID;
        }

        let money = Number(data.money);
        if(Number.isNaN(money)){
            throw ERROR_OBJ.PARAM_MISSING;
        }

        await mysqlConnector.query('INSERT INTO `tbl_config` (`identify`, `type`, `info`) ' +
            'VALUES(?,?,?) ON DUPLICATE KEY UPDATE identify=VALUES(identify), type=VALUES(type), info=VALUES(info)',
            ['ssc', 'init_money', JSON.stringify({money:money})]);

        redisConnector.pub(eventType.PLAYER_EVENT_INIT_MONEY, {money:money});
    }

    async setPlayerInfoByGM(data){
        if(data.token !== this._adminToken){
            throw ERROR_OBJ.TOKEN_INVALID;
        }

        let account = models.account.helper.getAccount(data.id);
        let fields = data.fields;
        for(let key in fields){
            let typeInfo = models.account.modelDefine[key];
            if(typeInfo && (typeInfo.gmModify == true || typeInfo.modify == true)){
                account[key] = fields[key];
            }else {
                throw ERROR_OBJ.PLAYER_FIELD_CANNOT_MODIFY;
            }
        }
        await account.commit();
        this.emit(config.HALL_EVENT.PLAYER_CHANGE, {uid:data.id, fields:fields});
    }
}

module.exports = new Hall();