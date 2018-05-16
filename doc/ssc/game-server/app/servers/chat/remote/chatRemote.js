/**
 * Created by linyng on 17-4-20.
 */

const bearcat = require("bearcat");
const Code = require('../../../../../shared/code');
const Answer = require('../../../../../shared/answer');
const logger = require('pomelo-logger').getLogger(__filename);

var ChatRemote = function(app) {
    this.app = app;
    this.channelService = app.get('channelService');
    this.consts = null;
    this.utils = null;
};

//加入聊天通道
ChatRemote.prototype.join = function(playerId, sid, roleName, roomId, cb) {
    logger.error('chat:',this.app.getCurServer());
    var code = this.chatService.add(playerId, sid, roleName, 1);
    cb(code);
};

//离开聊天通道
ChatRemote.prototype.leave = function(playerId, roomId, cb) {
    if(!!roomId){
        this.chatService.kick(playerId, 1);
    }
    cb();
};

/**
 * 聊天消息转发
 */
ChatRemote.prototype.send = function(msg, playerId, roomId, cb) {
    if(!this.chatService.canTalk(playerId)){
        this.utils.invokeCallback(cb, Code.CHAT.FA_CHAT_FORBIDTALK);
        return;
    }

    if(!this.consts.ChatMsgType.isSupported(msg.msgType)){
        this.utils.invokeCallback(cb, Code.CHAT.FA_UNSUPPORT_CHAT_MSGTYPE);
        return;
    }

    if(!msg.from || !msg.target || !msg.content){
        this.utils.invokeCallback(cb, Code.CHAT.FA_CHAT_DATA_ERROR);
        return;
    }
    msg.time = Date.now();

    this.chatService.pushByRoomId(1, msg, cb);
};

//获取聊天历史
ChatRemote.prototype.getChatHistory = function (roomId, cb) {
    this.chatService.getHistory(roomId, cb);
};

//获取聊天成员
ChatRemote.prototype.get = function(name, flag) {
    var users = [];
    var channel = this.channelService.getChannel(name, flag);
    if( !! channel) {
        users = channel.getMembers();
    }
    for(var i = 0; i < users.length; i++) {
        users[i] = users[i].split('*')[0];
    }
    return users;
};

//设置用户禁言状态
ChatRemote.prototype.userForbidTalk = function (uid, operate, cb) {
    if(!!uid){
        this.chatService.pub('forbidTalk', {uid:uid, operate:operate});
    }
    cb(null, new Answer.NoDataResponse(Code.OK));
};

module.exports = function (app) {
    return bearcat.getBean({
        id: "chatRemote",
        func: ChatRemote,
        args: [{
            name: "app",
            value: app
        }],
        props: [
            {name:"consts", ref:"consts"},
            {name:"utils", ref:"utils"},
            {name:"chatService",ref:"chatService"}
        ]
    });
};
