module.exports = {

    LOTTERY_EVENT: {
        TICK_COUNT: Symbol('tick_count'),
        OPEN_AWARD: Symbol('open_award'),
    },

    BET_ADVANCE_CLOSE_TIME: 30000, //投注提前关闭时间单位毫秒(ms)
    DES_SEPARATOR: '/',
    BET_SEPARATOR: '/',
    CHAT_INTERVAL_TIME: 5000, //聊天间隔时间单位毫秒(ms)

    BET_MIN_MONEY: 10,

    OPEN_CAI_TYPE: {
        BJKL8: {
            IDENTIFY: 'bjkl8',
            INTERVAL: 5
        },
        CAKENO: {
            IDENTIFY: 'cakeno',
            INTERVAL: 3
        },
        CQSSC: {
            IDENTIFY: 'cqssc',
            INTERVAL: 3
        }
    },

    SSC28: {
        BET_TYPE: {
            UNKNOWN: 0,
            SIZE: 1,
            HA_SIZE: 2,
            DUI: 3,
            SHUN: 4,
            BAO: 5,
            DOT: 6,
            JI: 7,
        },
        BET_DIC: {
            BIG: '大',
            SMALL: '小',
            SINGLE: '单',
            DOUBLE: '双',
            BAO: '豹子',
            SHUN: '顺子',
            DUI: '对子',
            JIDA: '极大',
            JIXIAO: '极小'
        },

    },

    CQSSC: {
        MSG_CHANNEL_NAME: 'CQSSC_HALL',

        BetType: {
            UNKNOWN: 0,
            SIZE: 1,
            POS: 2,
            NUM: 3,
            BS1: 4,
            BS2: 5,
            BS3: 6
        },
        BET_DIC: {
            BIG: '大',
            SMALL: '小',
            SINGLE: '单',
            DOUBLE: '双',
            DRAGON: '龙',
            TIGER: '虎',
            EQUAL1: '和',
            EQUAL2: '合',
            BAO: '豹',
            SHUN: '顺'
        },
        BET_BSPOS: {
            BEGIN: '前',
            MID: '中',
            END: '后'
        }

    },
    CANADA28: {
        MSG_CHANNEL_NAME: 'CANADA28_HALL',
    },
    LUCKY28: {
        MSG_CHANNEL_NAME: 'LUCKY28_HALL',
    }
};