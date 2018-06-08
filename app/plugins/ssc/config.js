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
        BET_LIMIT_CONFIG_ID:1,
        BET_RATE_CONFIG_ID:2,
        BET_TYPE: {
            UNKNOWN: 0,
            SIZE: 1,
            HA_SIZE: 2,
            DUI: 3,
            SHUN: 4,
            BAO: 5,
            NUM: 6,
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
        BET_TYPE_LIMIT_DIC: {
            ONE_MIN: 'ONE_MIN', //单注最低
            ONE_MAX: 'ONE_MAX', //单注最高
            NUM: 'NUM', //单点数字
            SIZE: 'SIZE', //大小单双
            MULTI: 'MULTI',//大小单双组合
            JI: 'JI',//极大小
            BAO: 'BAO',//豹子
            DUI: 'DUI',//对子
            SHUN: 'SHUN',//顺子
            ALL: 'ALL',//总下注额度限制
        },
        BET_TYPE_RATE_DIC: {
            BIG:'BIG',
            SMALL:'SMALL',
            SINGLE:'SINGLE',
            DOUBLE:'DOUBLE',
            BIG_SINGLE:'BIG_SINGLE',
            BIG_DOUBLE:'BIG_DOUBLE',
            SMALL_SINGLE:'SMALL_SINGLE',
            SMALL_DOUBLE:'SMALL_DOUBLE',
            BAO:'BAO',
            DUI:'DUI',
            SMALL_SINGLE:'SMALL_SINGLE',
            SHUN:'SHUN',
            JI:'JI',
            NUM:'NUM',
        },

        BET_DIC_INDEX:{
            '大':0,
            '小':1,
            '单':2,
            '双':3,
        },

        BET_TYPE_DIC_LINK:{
            '大':'BIG',
            '小':'SMALL',
            '单':'SINGLE',
            '双':'DOUBLE',
            '大单':'BIG_SINGLE',
            '大双':'BIG_DOUBLE',
            '小单':'SMALL_SINGLE',
            '小双':'SMALL_DOUBLE',
            '豹子':'BAO',
            '对子':'DUI',
            '小单':'SMALL_SINGLE',
            '顺子':'SHUN',
            '极大':'JI',
            '极小':'JI',
            '0':'NUM',
            '1':'NUM',
            '2':'NUM',
            '3':'NUM',
            '4':'NUM',
            '5':'NUM',
            '6':'NUM',
            '7':'NUM',
            '8':'NUM',
            '9':'NUM',
            '10':'NUM',
            '11':'NUM',
            '12':'NUM',
            '13':'NUM',
            '14':'NUM',
            '15':'NUM',
            '16':'NUM',
            '17':'NUM',
            '18':'NUM',
            '19':'NUM',
            '20':'NUM',
            '21':'NUM',
            '22':'NUM',
            '23':'NUM',
            '24':'NUM',
            '25':'NUM',
            '26':'NUM',
            '27':'NUM',
        }

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
        //投注限制配置
        BET_LIMIT_CONFIG:{
            ONE_MIN: 10,  //单注最低
            ONE_MAX: 10000, //单注最高
            NUM: 1000, //单点数字
            SIZE: 2000, //大小单双
            MULTI: 20000, //大小单双组合
            JI: 1000, //极大小
            BAO: 500, //豹子
            DUI: 100, //对子
            SHUN: 200, //顺子
            ALL: 1000000,//总下注额度限制
        },
        //赔率配置
        BET_RATE_CONFIG:{
            BIG: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            SMALL: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            SINGLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            DOUBLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            BIG_SINGLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            BIG_DOUBLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            SMALL_SINGLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            SMALL_DOUBLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            BAO: 15,
            DUI: 12,
            SHUN: 80,
            JI: 20,
            NUM: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,1,1,1,1,1,1,1,1,1,1,1,1
            ],
        },
    },
    LUCKY28: {
        MSG_CHANNEL_NAME: 'LUCKY28_HALL',
        //投注限制配置
        BET_LIMIT_CONFIG:{
            ONE_MIN: 10,  //单注最低
            ONE_MAX: 10000, //单注最高
            NUM: 1000, //单点数字
            SIZE: 2000, //大小单双
            MULTI: 20000, //大小单双组合
            JI: 1000, //极大小
            BAO: 500, //豹子
            DUI: 100, //对子
            SHUN: 200, //顺子
            ALL: 1000000,//总下注额度限制
        },
        //赔率配置
        BET_RATE_CONFIG:{
            BIG: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            SMALL: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            SINGLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            DOUBLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            BIG_SINGLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            BIG_DOUBLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            SMALL_SINGLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            SMALL_DOUBLE: [
                [[-1, 2000], 1.5],
                [[2000, 3000], 1.2],
                [[3000, -1], 1],
            ],
            BAO: 15,
            DUI: 12,
            SHUN: 80,
            JI: 20,
            NUM: [
                0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 27
            ],
        },
    },
    TURNTABLE:{
        AWARD:[
            {rate:0.6, money:0},
            {rate:0.15, money:5.88},
            {rate:0.12, money:8.88},
            {rate:0.09, money:16.88},
            {rate:0.04, money:18.88},
        ],
        TOTAL:10000,
    }
};