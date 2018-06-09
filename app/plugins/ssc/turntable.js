const config = require('./config');
const utils = require('../../utils/utils');
const models = require('../../models');
const logBuilder = require('../../utils/logSync/logBuilder');


class Turntable {

    async getDraw(data) {
        let resp = {
            award:0,
        };

        await redisConnector.set(models.constants.TURNTABLE_BONUS_POOL_BALANCE, 10000000);
        let balance = await redisConnector.get(models.constants.TURNTABLE_BONUS_POOL_BALANCE);
        if(balance <=0){
            return resp;
        }

        let money = this._randomGetAward(config.TURNTABLE.AWARD);
        if(money && money > 0){
            await redisConnector.incrbyfloat(models.constants.TURNTABLE_BONUS_POOL_BALANCE, -money);
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
        console.log('rnd=', rnd);

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