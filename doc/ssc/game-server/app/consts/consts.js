var Consts = function () {

    this.DES_SEPARATOR = '/';
    this.BET_SEPARATOR = '/';
    this.BET_TABLE = 'BET';
    this.BET_ID = 'BetId';
    this.BET_MAX = 20;
    this.LOTTERY_TABLE = 'LOTTERY';
    this.LOTTERY_ID = 'LotteryId';
    this.LOTTERY_MAX = 20;
    this.MsgNotifyType = {
        RECHARGE:1, //充值成功msg{money:100}
        CASHOK:2, //提现到账msg{money:150}
        CASHFAIL:3 //提现失败msg{money:200}
    };

    this.BetDataType ={
        UNKNOWN:0,
        SIZE:1,
        POS:2,
        NUM:3,
        BS1:4,
        BS2:5,
        BS3:6
    };

    this.BetDic = {
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
    };

    this.BetBSPos = {
        BEGIN:'前',
        MID:'中',
        END:'后'
    };

    this.BetCloseTime = 30; //s

    this.RoleType ={
        PLAYER:0,
        AGENT1:1,
        AGENT2:2,
        TRIAL:3
    };

    this.PlayerCtrl = {
        forbidTalk:0,
        active:1
    };

    this.RecordType = {
        RECHARGE:1,
        CASH:2,
        BACk:3
    };

    // 充值提现操作状态
    this.RecordOperate = {
        OPERATE_REQ:1, //请求
        OPERATE_OK:2, //确认
        OPERATE_ABORT:3 //中断
    }

    this.RES_CODE = {
        SUC_OK: 1, // success
        ERR_FAIL: -1, // Failded without specific reason
        ERR_USER_NOT_LOGINED: -2, // User not login
        ERR_CHANNEL_DESTROYED: -10, // channel has been destroyed
        ERR_SESSION_NOT_EXIST: -11, // session not exist
        ERR_CHANNEL_DUPLICATE: -12, // channel duplicated
        ERR_CHANNEL_NOT_EXIST: -13 // channel not exist
    };

    this.MESSAGE = {
        RES: 200,
        ERR: 500,
        PUSH: 600
    };

    this.ChatMsgType = {
        CHARACTERS:0,
        IMAGE:1,
        AUDIO:2,
        isSupported:function(type){
            if(type >= 0 && type <= 2){
                return true;
            }
            return false;
        }
    }

    this.EntityType = {
        PLAYER: 'player',
        LOTTERY: 'lottery',
        MOB: 'mob',
        EQUIPMENT: 'equipment',
        ITEM: 'item',
        BAG: 'bag',
        BETS:'bets'
    };

    this.Event = {
        chat:{
            chatMessage: 'onChatMessage',
            enterRoom: 'onEnterRoom',
            leaveRoom: 'onLeaveRoom'
        },
        area:{
            playerLeave:'onPlayerLeave',
            playerBet:'onPlayerBet',
            playerBets:'onPlayerBets',
            playerUnBet:'onPlayerUnBet',
            playerRename:'onPlayerRename',
            playerUpgrade:'onPlayerUpgrade',
            playerChange:'onPlayerChange',
            addEntities:'onAddEntities',
            removeEntities:'onRemoveEntities',
            countdown:'onCountdown',
            lottery:'onLottery',
            notice:'onNotice',
            parseLottery:'onParseLottery',
            playerWinner:'onPlayerWinner',
            playerPreWinner:'onPlayerPreWinner',
            defineNotify:'onDefineNotify',
        }
    };

    this.TaskState = {
        COMPLETED:2,
        COMPLETED_NOT_DELIVERY:1,
        NOT_COMPLETED:0,
        NOT_START:-1
    };

    this.LotteryType = {
        A:"A",
        B:"B",
        C:"C"
    }

    // 0待开奖，1 撤销，2 赢 3输
    this.BetState = {
        BET_WAIT:0,
        BET_CANCLE:1,
        BET_WIN:2,
        BET_LOSE:3,
        BET_BACK:4
    }
}

module.exports = {
    id: "consts",
    func: Consts
}