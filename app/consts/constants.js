module.exports = {
    PLUGINS:{
        MAIN:'mainType',
        SUB:'subType',
    },

    PLAYER_STATE: {
        OFFLINE: 0,
        ONLINE: 1
    },

    //用户授权渠道ID定义
    AUTH_CHANNEL_ID: {
        WZGJ_INNER: 1001,
    },

    WORLD_CHANNEL_NAME: {
        BARRAGE: 'barrage', //弹幕
    },

    GLOBAL_STATUS_DATA_TYPE: {
        PLAYER_GAME_POS: {
            name: 'player_game_pos',
            type: 'object'
        },
        PLAYER_RANKMATCH_POS: {
            name: 'player_rankmatch_pos',
            type: 'object'
        }
    },

    RANK_TYPE: {
        GOLD: 1,   //土豪排行
        BET: 2,  //下注排行
    },

    MSG_TYPE: {
        PRIVATE_MSG: 0,
        WORLD_MSG: 1,
        FRIEND_REQUEST: 2,  //好友请求
        BROADCAST: 3,
    },

    PLATFORM_TYPE: {
        ANDROID: 1,
        IOS: 2
    },

    SEX:{
        MALE:0,
        FEMALE:1
    },

};