const moment = require('moment');
const MissionModel = require('../../../../utils/account/RewardModel');
const ERROR_OBJ = require('../../../../consts/error_code').ERROR_OBJ;
const pack = require('../../../pay/controllers/data/pack');
const BuzzUtil = require('../utils/BuzzUtil');
const tools = require('../../../../utils/tools');

const START_DATE = '2018-05-15';

/**
 * 获取新手狂欢信息.
 * @param {*} data 
 * @param {*} cb 
 */
exports.getNewbieInfo = async (data, cb) => {
    const account = data.account;
    const created_at = account.created_at;

    let day_nth = getDayNth(created_at);
    // 计算截止日期
    let create_date = moment(created_at);
    let end_time = new Date(create_date.add(8, 'days').format('YYYY-MM-DD 23:59:59')).getTime();
    // 获取领取状态
    let reward_status = account.active_stat_newbie;
    for (let i in reward_status) {
        reward_status[i] = reward_status[i] > 0 ? 1 : -1;
    }

    let ret = {
        day_nth: day_nth,
        end_time: end_time,
        reward_status: reward_status,
    };

    console.error('getNewbieInfo:\n', ret);
    cb(null, ret);
}

/**
 * 同步新手狂欢活动进度.
 * @param {*} data 
 * @param {*} cb 
 */
exports.syncMissionProgress = async (data, cb) => {
    const account = data.account;
    let progress = await MissionModel.getRedisProcessInfo(account) || {};
    let ret = progress;
    cb(null, ret);
}

/**
 * 获取新手狂欢奖励.
 * @param {*} data 
 * @param {*} cb 
 */
exports.getNewbieReward = async (data, cb) => {
    const missionId = data.missionId;
    const account = data.account;
    const uid = account.id;
    const created_at = account.created_at;

    // 超过新手狂欢活动的时间, 抛出错误
    let day_nth = getDayNth(created_at);
    if (day_nth > 9) {
        logger.error(`[ERROR][NEWBIE_REWARD] ${uid}创建账号超过了9天(day_nth),不能领取新手狂欢任务${missionId}的奖励`);
        cb && cb(ERROR_OBJ.ACTIVE_NEWBIE_END);
        return;
    }
    if (new Date(created_at).getTime() < new Date(START_DATE).getTime()) {
        logger.error(`[ERROR][NEWBIE_REWARD] ${uid}创建账号时间早于${START_DATE},不能领取新手狂欢任务${missionId}的奖励`);
        cb && cb(ERROR_OBJ.MISSION_DISATISFY);
        return;
    }

    let active_stat_newbie = account.active_stat_newbie;
    let taskStat = active_stat_newbie[missionId];
    if (-1 == taskStat) {
        logger.error(`[ERROR][NEWBIE_REWARD] ${uid}已经领取了新手狂欢任务${missionId}的奖励，不能重复领取`);
        cb && cb(ERROR_OBJ.MISSION_GOTTON);
        return;
    }

    // 满足条件, 领取奖励
    const info = tools.CfgUtil.active.getNewbieInfo(missionId);
    const opendays = info.opendays;
    if (opendays > day_nth) {
        logger.error(`[ERROR][NEWBIE_REWARD] ${uid}尝试领取新手狂欢任务${missionId}的奖励，但这个奖励要创建账号${opendays}天后才会开放，现在才第${day_nth}天`);
        cb && cb(ERROR_OBJ.MISSION_DISATISFY);
        return;
    }
    const condition = info.condition;
    const value1 = info.value1;
    const value2 = info.value2;

    if (!_checkNewbieReward(`mission_task_once:1_${condition}_${value1}`, uid, value2, cb)) {
        return;
    }

    const reward = info.reward;
    const precondition = info.precondition;
    let item_list = BuzzUtil.getItemList(reward);
    pack.exchange(data, [], item_list, tools.CfgUtil.common.getLogConsts().ACTIVE_NEWBIE);

    // 设置任务状态
    if (0 != precondition) {
        // 有下一个任务则删除当前任务，切换到下一个任务
        active_stat_newbie[precondition] = 1;
        delete active_stat_newbie[missionId];
    }
    else {
        // 没有下一个任务，则设置任务状态为-1
        active_stat_newbie[missionId] = -1;
    }

    account.active_stat_newbie = active_stat_newbie;
    account.commit();

    let ret = {
        item_list: item_list,
        change: {
            gold: account.gold,
            pearl: account.pearl,
            package: account.package,
            skill: account.skill,
            active_stat_newbie: account.active_stat_newbie,
        },
    }
    cb && cb(null, ret);
}

// 校验方法
async function _checkNewbieReward(missionTask_redisKey, uid, value2) {

    let missionValue = await redisConnector.hget(missionTask_redisKey, uid);
    logger.error('mission reward ==', missionValue, missionTask_redisKey);
    if (missionValue == null) {
        logger.error(`[ERROR][NEWBIE_REWARD] ${uid}读取的任务进度${missionTask_redisKey}为空`);
        cb && cb(ERROR_OBJ.MISSION_NULL_RECORD);
        return false;
    }

    if (missionValue < value2) {
        logger.error(`[ERROR][NEWBIE_REWARD] ${uid}任务进度${missionTask_redisKey}不满足领取奖励条件${missionValue}<${value2}`);
        cb && cb(ERROR_OBJ.MISSION_DISATISFY);
        return false;
    }

    return true;
}

/**
 * 计算当前是登录第几天
 * @param {*} created_at 创建账号的日期
 */
function getDayNth(created_at) {
    let current_date = moment();
    let create_date = moment(created_at);
    let day_nth = current_date.diff(create_date, 'days') + 1;
    return day_nth;
}