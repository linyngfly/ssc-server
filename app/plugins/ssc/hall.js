const ERROR_OBJ = require('./error_code').ERROR_OBJ;
const models = require('../../models');
const Token = require('../../utils/token');

class Hall {
    constructor(){
        this._adminToken = null;
    }

    async _updateAdminToken(){
        this._adminToken = Token.create(8888, Date.now(), '123456789');
        await mysqlConnector.query('INSERT INTO `tbl_config` (`identify`, `type`, `info`) ' +
            'VALUES(?,?,?) ON DUPLICATE KEY UPDATE identify=VALUES(identify), type=VALUES(type), info=VALUES(info)',
            ['ssc', 'admin_token', JSON.stringify({token:this._adminToken})])
    }

    async start() {
        await this._updateAdminToken();
        logger.error('Hall start');
    }

    async stop() {
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
        if (account.money < 0) {
            account.money = money;
            await account.commit();
            throw ERROR_OBJ.ACCOUNT_AMOUNT_NOT_ENOUGH;
        }

        await mysqlConnector.query('INSERT INTO `tbl_order` (`uid`, `money`, `type`, `bankInfo`,`state`) VALUES (?,?,?,?,?)',
            [account.uid, money, 2, data.bankInfo, 1]);

        return {
            money: account.money
        }

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
        let account = await models.account.helper.getAccount(order.uid, models.account.fieldConst.MONEY);
        if(data.state == 2){ //确认
            if(order.type == 1){ //充值
                account.money = order.num;
                await account.commit();
            }
        }else if(data.state == 3){
            if(order.type == 2){ //提现
                account.money = order.num;
                await account.commit();
            }
        }
        await mysqlConnector.query('UPDATE `tbl_order` SET state=?,operator=? WHERE id=?',
            [data.state, data.operator, data.id]);
    }
}

module.exports = new Hall();