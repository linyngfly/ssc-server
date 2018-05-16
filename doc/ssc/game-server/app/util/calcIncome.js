/**
 * Created by linyng on 17-5-26.
 */

var async = require('async');
var logger = require('pomelo-logger').getLogger(__filename);
var CalcIncome = function () {
    this.beginTime = 0;
    this.endTime = 0;
    this.incomeTime = 0;
};

CalcIncome.prototype.init = function (_redis) {
    this.redisApi = _redis;
};

//玩家反水
CalcIncome.prototype.playerDefection = function (playerId, callback) {
    var self = this;
    async.waterfall([
        function (cb) {
            self.daoBets.getPlayerBetBaseInfo(playerId.id, self.beginTime, self.endTime, function (err, res) {
                cb(null, res);
            });
        }, function (income, cb) {

            var playerDayIncomeInfo = {
                playerId: playerId.id,
                betMoney: 0,
                incomeMoney: 0,
                defection: 0,
                defectionRate: 0,
                winRate: 0.0,
                incomeTime: self.incomeTime
            };

            if (!!income) {
                if (income.dayBetCount > 0) {
                    playerDayIncomeInfo.winRate = Number(((income.dayWinCount/income.dayBetCount)*100).toFixed(2));
                }

                var defection = 0; //反水
                var defectionRate = self.incomeCfg.getDefectionRate(playerId.level);
                //盈亏金额
                var incomeMoney = income.dayWinMoney - income.dayBetMoney;
                if (incomeMoney < 0 && income.dayBetMoney >= 50) {
                    defection = Math.abs(incomeMoney) * defectionRate/100;
                    playerDayIncomeInfo.defectionRate = defectionRate;
                }
                playerDayIncomeInfo.betMoney = income.dayBetMoney;
                playerDayIncomeInfo.incomeMoney = incomeMoney;
                playerDayIncomeInfo.defection = defection;
            }

            self.daoIncome.addPlayerIncome(playerDayIncomeInfo, function (err, res) {
                if (err) {
                    logger.error('写入玩家反水记录失败!' + err.stack);
                    cb('写入玩家反水记录失败');
                    return;
                }
                self.utils.invokeCallback(callback, null, res);
            })
        }
    ], function (err) {
        if (err) {
            logger.error('玩家'+playerId.id+'反水存在异常!' + err);
            self.utils.invokeCallback(callback, null, null);
        }
    });

};

// 获取代理下的玩家今日收益
CalcIncome.prototype.getPlayerTodayIncome = function (playerId, callback) {
    var self = this;
    this.daoIncome.getPlayerIncomeByTime(playerId, this.incomeTime, function (err, res) {
        if (err) {
            self.utils.invokeCallback(callback, null, {betMoney: 0, incomeMoney: 0,defection:0});
            return;
        }
        self.utils.invokeCallback(callback, null, res);
    })
};

//代理商分成
CalcIncome.prototype.agentRebate = async function (agent, callback) {

    logger.error('~~~~~agentRebate:',agent);

    // id, userId, level
    let self = this;
    let agentIncomInit = {
        playerId: agent.id,
        betMoney: 0,
        incomeMoney: 0,
        rebateRate: 0,
        rebateMoney: 0,
        upperRebateRate:0,
        upperRebateMoney:0,
        incomeTime: self.incomeTime
    };
    let friendIds = null;

    try {
        let myFriends = await self.daoUser.getMyFriends(agent.id);
        if(myFriends){
            friendIds = JSON.parse(myFriends);
            if (!friendIds || friendIds.length === 0) {
                friendIds = null;
            }
        }
    }catch (e){

        logger.error('代理商反水存在异常：', agent.id, e);

    }finally {
        if(!friendIds){
            self.daoAgentIncome.agentAddIncome(agentIncomInit, function (err, res) {
                self.utils.invokeCallback(cb, null, null);
            });
            return;
        }
    }
    logger.error('~~~~~friendIds:',friendIds);
    async.map(friendIds, self.getPlayerTodayIncome.bind(self), function (err, incomes) {

        async.reduce(incomes, {betMoney: 0, incomeMoney: 0, defection:0}, function (reduce, item, reduce_callback) {
            reduce.betMoney += item.betMoney;
            reduce.incomeMoney += item.incomeMoney;
            reduce.defection += item.defection;
            reduce_callback(null, reduce);
        }, function (err, income) {

            let rate = 0; //上级最大分成比例
            let upperRate = 0; //上级实际可以分成比例

            self.daoUser.getUpperAgent(agent.id, function (err, upper) {
                logger.error('~~~~~agent:',agent.ext);
                if(upper){
                    logger.error('~~~~~upper:',upper.ext);
                    if(!!upper.ext && !!upper.ext.divide){
                        rate = upper.ext.divide;
                        upperRate = upper.ext.divide - agent.ext.divide;
                    }
                }
                else {
                    if(!!agent.ext && !!agent.ext.divide){
                        rate = agent.ext.divide;
                    }
                }

                logger.error('~~~~~rate:',rate, 'upperRate',upperRate);

                //盈亏金额
                var incomeMoney = (-income.incomeMoney) - income.defection;
                agentIncomInit.rebateMoney = incomeMoney * rate/100;
                if(upperRate > 0){
                    agentIncomInit.upperRebateMoney = incomeMoney * upperRate/100;
                    agentIncomInit.rebateMoney -= agentIncomInit.upperRebateMoney;
                }
                logger.error('~~~~~upperRebateMoney:',agentIncomInit.upperRebateMoney, 'incomeMoney:', incomeMoney);
                logger.error('~~~~~agentIncomInit.rebateMoney:',agentIncomInit.rebateMoney);

                agentIncomInit.betMoney = income.betMoney;
                agentIncomInit.incomeMoney = incomeMoney;
                agentIncomInit.rebateRate = rate - upperRate;
                agentIncomInit.upperRebateRate = upperRate;
                self.daoAgentIncome.agentAddIncome(agentIncomInit, function (err, res) {
                    if (err) {
                        logger.error('代理商分成记录失败!' + err.stack);
                        self.utils.invokeCallback(callback, null, null);
                        return;
                    }
                    logger.error('~~~~~res:',res);
                    if(agentIncomInit.upperRebateMoney !== 0){
                        res.upper = {playerId:upper.id, rebateMoney:agentIncomInit.upperRebateMoney};
                    }

                    logger.error('~~~~~res1111:',res);

                    self.utils.invokeCallback(callback, null, res);
                });
            });


        });
    });
};

//玩家反水入账
CalcIncome.prototype.playerIncomeInsertAccount = function (income, callback) {
    let self = this;
    if (!!income && income.defection > 0) {
        this.daoUser.updateAccountAmount(income.playerId, income.defection, function (err, ret) {
            if(ret){
                self.pubMsg('recharge', {uid:income.playerId, money:income.defection});
            }
            callback(null,null);
        });
    }
    else {
        callback(null,null);
    }
};

//代理商分成入账
CalcIncome.prototype.agentsRebateInsertAccount = function (income, callback) {
    if (!!income) {
        let self = this;
        logger.error('~~~~~~~~~~~~玩家id:', income.playerId, '获得反水金额：', income.rebateMoney, 'income:', income);
        this.daoUser.updateAccountAmount(income.playerId, income.rebateMoney, function (err, result) {
            if(result){
                self.pubMsg('recharge', {uid:income.playerId, money:income.rebateMoney});
            }

            if(!!income.upper){
                self.daoUser.updateAccountAmount(income.upper.playerId, income.upper.rebateMoney, function (err, ret) {
                    if(ret){
                        self.pubMsg('recharge', {uid:income.upper.playerId, money:income.upper.rebateMoney});
                    }
                    callback(null,null);
                });
                logger.error('~~~~~~~~~~~~玩家id:', income.playerId,'上级代理id:',income.upper.playerId, '获得反水金额：', income.upper.rebateMoney);
            }
            else {
                callback(null,null);
            }
        });
    }else {
        callback(null,null);
    }
};

//玩家返水计算
CalcIncome.prototype.playersCalc = function () {
    var self = this;
    async.waterfall([
        function (cb) {
            self.daoUser.getPlayersIncomeId(cb);
        },
        function (incomeIds, cb) {
            async.map(incomeIds, self.playerDefection.bind(self), cb);
        }, function (playerIncomes, cb) {
            async.map(playerIncomes, self.playerIncomeInsertAccount.bind(self), cb);
        }

    ], function (err) {
        if (err) {
            logger.error('玩家今日反水存在异常!' + err);
        }

        logger.error('~~~~~~~~~~~~~~~CalcIncome.playersCalc 44444', err);
        logger.info('玩家今日反水计算完成');
        self.agentsCalc();
    });
};

//代理商分成
CalcIncome.prototype.agentsCalc = function () {
    var self = this;
    async.waterfall([
        function (cb) {
            self.daoUser.getAgents(cb);
        },
        function (agents, cb) {
            async.map(agents, self.agentRebate.bind(self), cb);
        },
        function (agentsIncomes, cb) {
            async.map(agentsIncomes, self.agentsRebateInsertAccount.bind(self), cb);
        }
    ], function (err) {
        if (err) {
            logger.error('代理商今日分成存在异常' + err);
            return;
        }
        logger.info('代理商今日分成计算完成');
    });

};

CalcIncome.prototype.pubMsg = function (event, msg) {
    this.redisApi.pub(event, JSON.stringify(msg));
};

//返水计算
CalcIncome.prototype.calc = function () {
    logger.error('~~~~~~~~~~~~~~~CalcIncome.prototype.calc');
    var now = new Date();
    var begin = new Date(now);
    begin.setDate(begin.getDate()-1);
    begin.setHours(1, 55, 0, 0);
    this.beginTime = begin.getTime();


    var end = new Date(now);
    // end.setDate(end.getDate()-1);
    end.setHours(1, 55, 0, 0);
    this.endTime = end.getTime();

    var calcTime = new Date(now);
    calcTime.setDate(calcTime.getDate()-1);
    calcTime.setHours(0,0,0,0);

    this.incomeTime = calcTime.getTime();

    this.playersCalc();
};

module.exports = {
    id: "calcIncome",
    func: CalcIncome,
    props: [
        {name: "daoUser", ref: "daoUser"},
        {name: "daoBets", ref: "daoBets"},
        {name: "incomeCfg", ref: "incomeCfg"},
        {name: "daoIncome", ref: "daoIncome"},
        {name: "daoAgentIncome", ref: "daoAgentIncome"},
        {name: "utils", ref: "utils"}
    ]
}