const omelo = require('omelo');
const globalStatusData = require('../../utils/globalStatusData');
const rpcDefs = require('../../net/rpcDefs');

class Hall{
    constructor(opts){
        this._msgChannelName = opts.msgChannelName;
    }

    start(){
        this._msgChannel = omelo.app.get('globalChannelService');
    }

    stop(){
        if (this._msgChannel) {
            this._msgChannel.destroy();
            this._msgChannel = null;
        }
    }


    addMsgChannel({uid, sid}){
        this._msgChannel.add(this._msgChannelName, uid, sid);
    }

    leaveMsgChannel({uid, sid}){
        this._msgChannel.leave(this._msgChannelName, uid, sid);
    }

    broadcast(route, data, channelName, serverType = rpcDefs.serverType.game){
        if(this._msgChannel){
            this._msgChannel.pushMessage(serverType, route, data, channelName);
        }
    }

    addGamePos(uid, sid, data){
        if(this._gamePosType){
            globalStatusData.addData(this._gamePosType, uid, sid, data);
        }
    }

    delGamePos(uid, sid){
        if(this._gamePosType){
            globalStatusData.delData(this._gamePosType, uid, sid);
        }
    }


}

module.exports = Hall;