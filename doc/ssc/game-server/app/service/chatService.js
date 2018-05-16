/**
 * Created by linyng on 2017/5/9.
 */

const Code = require('../../../shared/code');
const logger = require('pomelo-logger').getLogger(__filename);
const bearcat = require('bearcat');
const pomelo = require('pomelo');


var ChatService = function () {
    this.app = pomelo.app;
    this.roomMap = new Map();
    this.uidMap = new Map();
};

/**
 * 初始化聊天服务
 */
ChatService.prototype.init = function () {
    //加载禁言用户列表
    this.loadForbidTalkUser();

    //配置聊天数据库
    let configs = this.app.get('redis');
    this.daoChat.init(1, 100, configs);

    //配置消息订阅
    this.redisApi.init(configs);
    let self = this;
    // 踢掉玩家
    this.redisApi.sub('forbidTalk', function (msg) {
        logger.error('~~~~~~~~~~ChatService.forbidTalk~~~~~~~~~~`', msg);
        self.forbidTalk(msg.uid, msg.operate);
    });
};

ChatService.prototype.pub = function(event, msg){
    this.redisApi.pub(event, JSON.stringify(msg));
};

ChatService.prototype.loadForbidTalkUser = function () {
    let self = this;
    this.daoUser.getForbidUserID(function (err, uids) {
        if(err){
            self.forbidTalkSet = new Set();
        }
        else {
            self.forbidTalkSet = new Set(uids);
        }
    });
};

ChatService.prototype.allocRoom = function (cb) {
    for(let [id, value] of this.roomMap){
        if(value.userMap.size < value.maxLoad){
            this.utils.invokeCallback(cb, null, id);
            return;
        }
    }
    this.utils.invokeCallback(cb, 'No room available!', null);
};

ChatService.prototype.checkRoomIdValid = function (roomId) {
    if(this.roomMap.has(roomId)){
        return true;
    }
    return false;
};

ChatService.prototype.getRoomList = function () {
    return this.dataApiUtil.room().data;
};

ChatService.prototype.add = function (playerId, sid, roleName, roomId) {
    if (checkDuplicate(this, playerId, roomId)) {
        return Code.OK;
    }

    let enterRoomId = this.uidMap.get(playerId);
    if(!!enterRoomId){
        this.leave(playerId, enterRoomId);
    }

   // var channel = this.app.get('channelService').getChannel(roomId, true);
    let channel = this.app.get('globalChannelService');
    if (!channel) {
        return Code.CHAT.FA_CHANNEL_CREATE;
    }
    //channel.pushMessage(this.consts.Event.chat.enterRoom, {uid:playerId,roleName:roleName});
    //channel.add(playerId, sid);
    channel.add(roomId, playerId, sid);
    addRecord(this, playerId, roleName, sid, roomId);

    return Code.OK;
};

ChatService.prototype.leave = function (playerId, roomId) {
    logger.error('!!!!!!!!!!!ChatService leave', playerId, roomId);

    let record = this.roomMap.get(roomId).get(playerId);
  //  var channel = this.app.get('channelService').getChannel(roomId, true);
    let channel = this.app.get('globalChannelService');

    logger.error('!!!!!!!!!!!ChatService record', record);

    if (channel && record) {
      //  channel.leave(playerId, record.sid);
        channel.leave(roomId, playerId, record.sid);
        logger.error('!!!!!!!!!!!ChatService record 11111', record);
    }

    removeRecord(this, playerId, roomId);

   // channel.pushMessage(this.consts.Event.chat.leaveRoom, {uid:playerId});
    logger.error('ChatService.prototype.leave');
};

ChatService.prototype.canTalk = function (uid) {
  return !this.forbidTalkSet.has(uid);
};

ChatService.prototype.forbidTalk = function (uid, operate) {
    if(operate){
        this.forbidTalkSet.add(uid);
    }
    else {
        this.forbidTalkSet.delete(uid);
    }
};


function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        obj[k] = v;
    }
    return obj;
}

function mapToJson(map) {
    return JSON.stringify([...map]);
}

ChatService.prototype.getUsers = function (roomId) {
    let userMap =  this.roomMap.get(roomId).userMap;
    return strMapToObj(userMap);
};

ChatService.prototype.kick = function (playerId, roomId) {
    let record = this.roomMap.get(roomId).get(playerId);
    let channel = this.app.get('channelService').getChannel(roomId, true);

    if (channel && record) {
        channel.leave(playerId, record.sid);
    }
    removeRecord(this, playerId, roomId);

    channel.pushMessage(this.consts.Event.chat.leaveRoom, {uid:playerId});
};

ChatService.prototype.pushByRoomId = function (roomId, msg, cb) {
    let channel = this.app.get('globalChannelService');
    if (!channel) {
        this.utils.invokeCallback(cb, Code.CHAT.FA_CHANNEL_NOT_EXIST);
        return;
    }

    let self  = this;
    channel.pushMessage('connector',this.consts.Event.chat.chatMessage, msg, roomId, {isPush:true}, function (err, fails) {
        if(err) {
            console.error('send message to all users error: %j, fail ids: %j', err, fails);
            self.utils.invokeCallback(cb, Code.FAIL);
            return;
        }

        self.recordChat(msg);
        self.utils.invokeCallback(cb, Code.OK);
    });

};

ChatService.prototype.getHistory = function (roomId, cb) {
    let self = this;
    this.daoChat.gets(function (err, result) {
        if(err){
            self.utils.invokeCallback(cb, Code.CHAT.FA_CHAT_HISTORY_EMPTY);
            return;
        }

        let chats = [];
        for(let item of result[0]){
            chats.push(JSON.parse(item));
        }

        chats.sort(function (a,b) {
            return a.time - b.time;
        });

        self.utils.invokeCallback(cb, null, chats);
    });
};

ChatService.prototype.recordChat = function (msg) {
    this.daoChat.add(msg);
};

ChatService.prototype.pushByUID = function (uid, msg, cb) {
    let record = this.roomMap.get(msg.roomId).get(uid);
    if (!record) {
        cb(null, this.code.CHAT.FA_USER_NOT_ONLINE);
        return;
    }

    this.app.get('channelService').pushMessageByUids(this.consts.Event.chat.chatMessage, msg, [{
        uid: record.uid,
        sid: record.sid
    }], cb);
};

let checkDuplicate = function (service, playerId, roomId) {
    return !!service.roomMap.get(roomId) && !!service.roomMap.get(roomId).get(playerId);
};

let addRecord = function (service, playerId, roleName, sid, roomId) {
    let record = {uid: playerId, name: roleName, sid: sid};
    let userMap = service.roomMap.get(roomId);
    if(!userMap){
        userMap = new Map;
        service.roomMap.set(roomId, userMap);
    }
    userMap.set(playerId, record);
    service.uidMap.set(playerId, roomId);
};

let removeRecord = function (service, playerId, roomId) {
    let userMap = service.roomMap.get(roomId);
    if(!!userMap){
        userMap.delete(playerId);
        service.uidMap.delete(playerId);
    }
};

module.exports = {
    id: "chatService",
    func: ChatService,
    props: [{
        name: "utils",
        ref: "utils"
    }, {
        name: "dataApiUtil",
        ref: "dataApiUtil"
    }, {
        name: "consts",
        ref: "consts"
    }, {
        name: "daoUser",
        ref: "daoUser"
    }, {
        name: "daoChat",
        ref: "daoChat"
    }, {
        name: "redisApi",
        ref: "redisApi"
    }]
}
