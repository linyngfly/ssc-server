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

    DATA_SYNC_FULL_UIDS: `${PREFIX}sync:full_uids`,
    DATA_SYNC_DELTA_UIDS: `${PREFIX}sync:delta_uids`,
    DATA_SYNC_DELTA_UID_FIELDS: `${PREFIX}sync:delta_uid_fields`,

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
};
