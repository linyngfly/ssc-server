/**
 * 全局KEY常量定义
 * @type {{}}
 */

const PREFIX = 'wzgj:';

module.exports = {
    PREFIX: PREFIX,
    MAP_OPENID_UID: `${PREFIX}openid:uid`,
    SWITCH: {
        SERVICE: `${PREFIX}switch:service`, //服务开关
        API: `${PREFIX}switch:api`, //api开关
    },

    CONFIG:{
        BET_LIMIT:`${PREFIX}config:%s:bet_limit`, //投注限制
        BET_RATE:`${PREFIX}config:%s:bet_rate`, //投注赔率
        TURNTABLE_BONUS_POOL:`${PREFIX}config:%s:turntable_bonus_pool`,  //转盘抽奖奖池剩余额度，每天重置为系统设置的总额度
        TURNTABLE_AWARD:`${PREFIX}config:%s:turntable_award`,  //转盘奖金比例配置
    },

    DATA_SYNC_FULL_UIDS: `${PREFIX}sync:full_uids`,
    DATA_SYNC_DELTA_UIDS: `${PREFIX}sync:delta_uids`,
    DATA_SYNC_DELTA_UID_FIELDS: `${PREFIX}sync:delta_uid_fields`,
    DATA_SYNC_BE_IDS: `${PREFIX}sync:bet_ids`,

    //UID计数器
    UID_COUNTER: `${PREFIX}counter:uid`,

    //投注ID计数器
    BET_ID_COUNTER: `${PREFIX}counter:betId`,

    //最近聊天纪录
    CHAT_LATEST_HISTORY: `${PREFIX}history:%s:chat_latest_list`,

    //最近全服投注信息
    BET_LATEST_HISTORY: `${PREFIX}history:%s:bet_latest_list`,

    //最近个人投注信息
    BET_PRIVATE_LATEST_HISTORY: `${PREFIX}history:%s:bet_private_latest_list`,

    //最近开奖记录
    LOTTERY_LATEST_HISTORY: `${PREFIX}history:%s:lottery_latest_list`,

    //角色定义
    ROLE: {
        PLAYER: 0, //玩家
        AGENT1: 1, //一级代理商
        AGENT2: 2, //二级代理商
        TEST: 3, //体验用户
    },

    //头像id(1~6)
    IMG_ID: {
        IMD1: '1',
        IMD2: '2',
        IMD3: '3',
        IMD4: '4',
        IMD5: '5',
        IMD6: '6',
    },

    //投注状态
    BET_STATE: {
        WAIT: 0, //待开奖
        CANCEL: 1, //撤销
        WIN: 2, //赢
        LOSE: 3, //输
    },

    GAME_SCENE: {
        BET: 1, //投注
        LOTTERY: 2, //开奖
        EXCHANGE: 3, //兑换
        TURNTABLE: 4, //转盘抽奖
    }
};
