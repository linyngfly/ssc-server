/**
 * Created by linyng on 17-5-23.
 */

// odds 投注賠率设置 玩家等级高一级提升0.1
// msg 公告
// initial 玩家初始金币
//
// rank 称号等级标准
//
// limit 个人投注记录历史显示天数
//
// norm 投注限额设置 p 平台 m 用户
// bw 玩家反水设置

// size 大小单双龙虎
// sz 顺子
// bz 豹子
// num 数字（包数字，买数字）
// sum 和

// {
//     odds: “{“size”:{“min”:”1.0”,”max”:”2.0”},”sz”:{“min”:”10”,”max”:”20”},”bz”:{“min”:”60”,”max”:”90”},”num”:{“min”:”9”,”max”:”10”},”sum”:{“min”:”9”,”max”:”10”}}”,
//     msg: “123”,
//     initial: “1”,
//     rank: “[“1”,”2”,”3”,”4”,”5”,”6”,”7”,”8”,”9”,”1”]”,
//     limit: “11”,
//     norm: “{“size”:{“p”:”100000”,”m”:”3000”},”sz”:{“p”:”200000”,”m”:”2000”},”bz”:{“p”:”600000”,”m”:”6000”},”num”:{“p”:”100000”,”m”:”3000”},”sum”:{“p”:”200000”,”m”:”2000”}}”,
//     bw: “[“1”,”5”,”10”,”15”,”20”,”25”,”30”,”35”,”40”,”45”]”
// }
//
// odds 反水设置
// size 大小单双龙虎
// sz 顺子
// bz 豹子
// num 数字（包数字，买数字）
// sum 和
//
// msg 公告
//
// initial 玩家初始金币
//
// rank 称号等级标准
//
// limit 历史显示天数
//
// norm 投注限额设置
//
// size 大小单双龙虎 p 平台 m 用户
// sz 顺子
// bz 豹子
// num 数字（包数字，买数字）
// sum 和
//
// bw 反水设置
//
// 下标对应等级

var logger = require('pomelo-logger').getLogger('bearcat-lottery', 'betLimitCfg');

function BetLimitCfg() {

};

BetLimitCfg.prototype.init = function () {
    this.playerMap = new Map();
    this.platformMap = new Map();
};

/**
 * update the config data
 * @param config
 */
BetLimitCfg.prototype.update = function (configs) {
    for (let type in configs) {
        switch (type) {
            case 'big': {
                let t = this.betType.get('大');
                if (t) {
                    this.playerMap.set(t.code, Number(configs[type].m));
                    this.platformMap.set(t.code, Number(configs[type].p));
                }
            }
                break;
            case 'small': {
                let t = this.betType.get('小');
                if (t) {
                    this.playerMap.set(t.code, Number(configs[type].m));
                    this.platformMap.set(t.code, Number(configs[type].p));
                }
            }
                break;
            case 'single': {
                let t = this.betType.get('单');
                if (t) {
                    this.playerMap.set(t.code, Number(configs[type].m));
                    this.platformMap.set(t.code, Number(configs[type].p));
                }
            }
                break;
            case 'double': {
                let t = this.betType.get('双');
                if (t) {
                    this.playerMap.set(t.code, Number(configs[type].m));
                    this.platformMap.set(t.code, Number(configs[type].p));
                }
            }
                break;
            case 'dragon': {
                let t = this.betType.get('龙');
                if (t) {
                    this.playerMap.set(t.code, Number(configs[type].m));
                    this.platformMap.set(t.code, Number(configs[type].p));
                }
            }
                break;
            case 'tiger': {
                let t = this.betType.get('虎');
                if (t) {
                    this.playerMap.set(t.code, Number(configs[type].m));
                    this.platformMap.set(t.code, Number(configs[type].p));
                }
            }
                break;
            case 'equal': {
                let t = this.betType.get('合');
                if (t) {
                    this.playerMap.set(t.code, Number(configs[type].m));
                    this.platformMap.set(t.code, Number(configs[type].p));
                }
            }
                break;
            case 'sz': {
                let dic = ['前', '中', '后'];
                let szConfigs = configs[type];
                for (let i = 0; i < dic.length; i++) {
                    let t = this.betType.get(`${dic[i]}顺`);
                    if (t) {
                        this.playerMap.set(t.code, Number(szConfigs[i].m));
                        this.platformMap.set(t.code, Number(szConfigs[i].p));
                    }
                }
            }
                break;
            case 'bz': {
                let dic = ['前', '中', '后'];
                let bzConfigs = configs[type];
                for (let i = 0; i < dic.length; i++) {
                    let t = this.betType.get(`${dic[i]}豹`);
                    if (t) {
                        this.playerMap.set(t.code, Number(bzConfigs[i].m));
                        this.platformMap.set(t.code, Number(bzConfigs[i].p));
                    }
                }
            }
                break;
            case 'pos': {
                let posConfigs = configs[type];
                for (let pos = 0; pos < posConfigs.length; pos++) {
                    let posConfig = posConfigs[pos];
                    if (posConfig) {
                        for (let pos_type in posConfig) {
                            switch (pos_type) {
                                case 'big': {
                                    let t = this.betType.get('大', pos + 1);
                                    if (t) {
                                        this.playerMap.set(t.code, Number(posConfig[pos_type].m));
                                        this.platformMap.set(t.code, Number(posConfig[pos_type].p));
                                    }
                                }
                                    break;
                                case 'small': {
                                    let t = this.betType.get('小', pos + 1);
                                    if (t) {
                                        this.playerMap.set(t.code, Number(posConfig[pos_type].m));
                                        this.platformMap.set(t.code, Number(posConfig[pos_type].p));
                                    }
                                }
                                    break;
                                case 'single':
                                    let t = this.betType.get('单', pos + 1);
                                    if (t) {
                                        this.playerMap.set(t.code, Number(posConfig[pos_type].m));
                                        this.platformMap.set(t.code, Number(posConfig[pos_type].p));
                                    }
                                    break;
                                case 'double': {
                                    let t = this.betType.get('双', pos + 1);
                                    if (t) {
                                        this.playerMap.set(t.code, Number(posConfig[pos_type].m));
                                        this.platformMap.set(t.code, Number(posConfig[pos_type].p));
                                    }
                                }

                                    break;
                                case 'num': {
                                    let numConfigs = posConfig[pos_type];
                                    for (let num = 0; num < numConfigs.length; num++) {
                                        let numConfig = numConfigs[num];
                                        let t = this.betType.get(num, pos + 1);
                                        if (t) {
                                            this.playerMap.set(t.code, Number(numConfig.m));
                                            this.platformMap.set(t.code, Number(numConfig.p));
                                        }
                                    }
                                }
                                    break;
                            }
                        }
                    }
                }
            }
                break;
            default:
                break;
        }
    }
};

BetLimitCfg.prototype.getPlayerValue = function (type) {
    var val = this.playerMap.get(type);
    if (!val) val = 1000;
    return val;
}

BetLimitCfg.prototype.playerLimit = function (type, value) {
    var val = this.playerMap.get(type);
    if (!val) val = 1000;
    if (!!val && val >= value) {
        return false;
    }

    return true;
};

BetLimitCfg.prototype.getPlatformValue = function (type) {
    var val = this.platformMap.get(type);
    if (!val) val = 3000;
    return val;
};

BetLimitCfg.prototype.platformLimit = function (type, value) {
    var val = this.platformMap.get(type);
    if (!val) val = 3000;
    if (!!val && val >= value) {
        return false;
    }
    return true;
};

module.exports = {
    id: "betLimitCfg",
    func: BetLimitCfg,
    init: "init",
    props: [
        {name: 'betType', ref: 'betType'}
    ]
};