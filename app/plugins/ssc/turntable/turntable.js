const config = require('../config');
const utils = require('../../../utils/utils');
const util = require('util');
const models = require('../../../models/index');
const logBuilder = require('../../../utils/logSync/logBuilder');


class Turntable {
    constructor(){
        this._award = config.TURNTABLE.AWARD;
        this._bonus_pool_key = util.format(models.constants.CONFIG.TURNTABLE_BONUS_POOL, config.TURNTABLE.GAME_IDENTIFY);
        this._award_key = util.format(models.constants.CONFIG.TURNTABLE_AWARD, config.TURNTABLE.GAME_IDENTIFY);
    }

    async start(){
        logger.error('TURNTABLE start');
        await this.loadConfig();
    }

    stop(){
        super.stop();
    }

    async _loadBonusPool(){
        let balance = null;
        let rows = await mysqlConnector.query('SELECT * FROM tbl_config WHERE identify=? AND type=?', [config.TURNTABLE.GAME_IDENTIFY, config.CONFIG_TYPE.TURNTABLE_BONUS_POOL]);
        if(rows && rows[0]){
            balance = JSON.parse(rows[0].info).total;
        }else {
            balance = config.TURNTABLE.TOTAL;
            await mysqlConnector.insert(`INSERT INTO tbl_config (identify, type, info) VALUES (?,?,?)`,
                [config.TURNTABLE.GAME_IDENTIFY, config.CONFIG_TYPE.TURNTABLE_BONUS_POOL, JSON.stringify({total:balance})]);
        }
        await redisConnector.set(this._bonus_pool_key, balance);
    }

    async _loadAward(){
        let award = null;
        let rows = await mysqlConnector.query('SELECT * FROM tbl_config WHERE identify=? AND type=?', [config.TURNTABLE.GAME_IDENTIFY, config.CONFIG_TYPE.TURNTABLE_AWARD]);
        if(rows && rows[0]){
            award = JSON.parse(rows[0].info);
        }else {
            award = config.TURNTABLE.AWARD;
            await mysqlConnector.insert(`INSERT INTO tbl_config (identify, type, info) VALUES (?,?,?)`,
                [config.TURNTABLE.GAME_IDENTIFY, config.CONFIG_TYPE.TURNTABLE_AWARD, JSON.stringify(award)]);
        }
        await redisConnector.set(this._award_key, award);
        this._award = award;
    }

   async loadConfig(){
       try{
           //加载奖池总额配置
           let balance = await redisConnector.get(this._bonus_pool_key);
           if(null == balance){
               await this._loadBonusPool(this._bonus_pool_key);
           }

           //加载奖品配置
           let award = await redisConnector.get(this._award_key);
           if(null == award){
               await this._loadAward(this._award_key);
           }

       }catch (err) {
            logger.error('加载转盘抽奖配置数据失败');
       }

       // await this.resetConfig();
   }

   async resetConfig(){
       await redisConnector.del(this._bonus_pool_key);
       await this._loadBonusPool(this._bonus_pool_key);

       await redisConnector.del(this._award_key);
       await this._loadAward(this._award_key);
   }

    async getDraw(data) {
        let resp = {
            award:0,
        };

        let balance = await redisConnector.get(this._bonus_pool_key);
        if(balance <=0){
            return resp;
        }

        let money = this._randomGetAward(this._award);
        if(money && money > 0){
            await redisConnector.incrbyfloat(this._bonus_pool_key, -money);
            data.account.money = money;
            await data.account.commit();

            logBuilder.addMoneyLog({
                uid:data.uid,
                gain:money,
                total:data.account.money,
                scene:models.constants.GAME_SCENE.TURNTABLE
            });

            resp.award = money;
            resp.money = data.account.money;
        }

        return resp;
    }

    _randomGetAward(awardList) {
        if (!awardList || awardList.length == 0) {
            return null;
        }

        let rates = [];
        for (let i = 0; i < awardList.length; i++) {
            rates.push(awardList[i].rate * 100);
        }
        let range = [];
        rates.reduce(function (pre, item) {
            range.push(pre + item);
            return pre + item;
        }, 0);

        let rnd = utils.random_int(0, 100);
        logger.error('rnd=', rnd);

        let awardIndex = 0;
        for (let i = 0; i < range.length; i++) {
            if (range[i] > rnd) {
                awardIndex = i;
                break;
            }
        }

        return awardList[awardIndex].money;
    }


}

// let tt = new Turntable();
//
// setInterval(function () {
//     console.log(tt.getDraw());
// }, 1000);


module.exports = new Turntable();