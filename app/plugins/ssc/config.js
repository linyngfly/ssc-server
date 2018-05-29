module.exports = {
    BET_CLOSE_RESERVE_DURATION:30, //投注提前关闭时间
    DES_SEPARATOR:'/',
    BET_SEPARATOR:'/',

    BET_STATE:{    // 0待开奖，1 撤销，2 赢 3输
        BET_WAIT:1,
        BET_CANCEL:2,
        BET_WIN:3,
        BET_LOSE:4,
        BET_BACK:5
    },
    CQSSC:{
        BetType:{
            UNKNOWN:0,
            SIZE:1,
            POS:2,
            NUM:3,
            BS1:4,
            BS2:5,
            BS3:6
        },
        BET_DIC:{
            BIG:'大',
            SMALL:'小',
            SINGLE:'单',
            DOUBLE:'双',
            DRAGON:'龙',
            TIGER:'虎',
            EQUAL1:'和',
            EQUAL2:'合',
            BAO:'豹',
            SHUN:'顺'
        },
        BET_BSPOS:{
            BEGIN:'前',
            MID:'中',
            END:'后'
        }

    },
    CANADA28:{

    },
    LUCKY28:{

    }
};