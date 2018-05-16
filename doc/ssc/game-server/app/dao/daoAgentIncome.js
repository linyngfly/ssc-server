/**
 * Created by linyng on 17-5-26.
 */

var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var bearcat = require('bearcat');

var DaoAgentIncome = function () {

};

//代理商今日分成信息
DaoAgentIncome.prototype.agentAddIncome = function (income, cb) {
    var sql = 'insert into AgentIncome (uid, betMoney, incomeMoney, rebateRate, rebateMoney, upperRebateRate, upperRebateMoney, incomeTime) values(?,?,?,?,?,?,?,?)';
    logger.error(sql);
    var args = [income.playerId, income.betMoney, income.incomeMoney, income.rebateRate, income.rebateMoney, income.upperRebateRate, income.upperRebateMoney, income.incomeTime];
    var self = this;
    pomelo.app.get('dbclient').insert(sql, args, function (err, res) {
        if (err !== null) {
            self.utils.invokeCallback(cb, {code: err.number, msg: err.message}, null);
        } else {
            logger.error('DaoAgentIncome.prototype.agentAddIncome:', res);
            self.utils.invokeCallback(cb, null, {
                id: res.insertId,
                playerId: income.playerId,
                betMoney: income.betMoney,
                incomeMoney: income.incomeMoney,
                rebateRate: income.rebateRate,
                rebateMoney: income.rebateMoney,
                upperRebateRate: income.upperRebateRate,
                upperRebateMoney: income.upperRebateMoney,
                incomeTime: income.incomeTime
            });
        }
    });
};

module.exports = {
    id: "daoAgentIncome",
    func: DaoAgentIncome,
    props: [
        {name: "utils", ref: "utils"},
        {name: "consts", ref: "consts"}
    ]
}