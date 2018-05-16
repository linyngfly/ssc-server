/**
 * Created by linyng on 17-5-24.
 */

var defaultConfigs = require('../../../shared/config/sysParamConfig.json');

var SysConfig = function () {
    this._configs = defaultConfigs;
    let level = this._configs.update.length;
    this._configs.update[level-1] = 0;
};

SysConfig.prototype.getConfigs = function () {
    return this._configs;
};

SysConfig.prototype.setConfigs = function (configs) {
    this._configs = configs;
    let level = this._configs.update.length;
    this._configs.update[level-1] = 0;
    this.betLimitCfg.update(this._configs.norm);
    this.incomeCfg.update({betRates:this._configs.odds, defectionRates:this._configs.bw});
}

//获取玩家初始化金币
SysConfig.prototype.getPlayerInitialBank = function () {
    return Number(this._configs.initial);
}

//获取系统公告
SysConfig.prototype.getSysNotice = function () {
    return this._configs.msg;
};

//获取玩家等级头衔
SysConfig.prototype.getRank = function (level) {
    if(level > 0 && level <= this._configs.rank.length){
        return this._configs.rank[level-1];
    }
    return '终极老司机';
};

//获取用户升级经验上限数
SysConfig.prototype.getUpdate = function (level) {
    if(level > 0 && level <= this._configs.update.length){
        return Number(this._configs.update[level-1]);
    }
    return 0;
};

//获取GM信息
SysConfig.prototype.getGM = function () {
    return this._configs.gm;
};

// 获取个人投注历史查看天数
SysConfig.prototype.getPrivateBetDays = function () {
    return Number(this._configs.limit);
};

module.exports =  {
    id:"sysConfig",
    func:SysConfig,
    props:[
        {name:"betLimitCfg",ref:"betLimitCfg"},
        {name:"incomeCfg",ref:"incomeCfg"}
    ]
}