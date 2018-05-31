/**
 * Created by Administrator on 2017/4/15.
 */

const omelo = require('omelo');
const consts = require('../../../consts/constants');

class PlayerFilter{
    constructor(){
        this._routes = new Set();
    }

    before(msg, session, next){
        if(this._routes.has(msg.__route__)){
            if(omelo.entry){
                let game = omelo.entry.getGame(session.get(consts.PLUGINS.MAIN), session.get(consts.PLUGINS.SUB));
                if(game){
                }
            }
        }
        // logger.error('msg.__route__=', msg.__route__, msg)
        //game.fishHandler.c_login
        if(msg.__route__.indexOf('c_enter_room') == -1 && msg.__route__.indexOf('c_login') == -1 && msg.__route__.indexOf('c_logout') == -1){
            let room = omelo.app.game.hasInRoom(session.uid);
            if(!room){
                next(CONSTS.SYS_CODE.PALYER_NOT_IN_SCENE, {});
                return;
            }
            msg.room = room;
            next();
        }
        else{
            next();
        }
    }

    after(err, msg, session, resp, next){
        next();
    }

    addRoute(route){
        this._routes.add(route);
    }

}

module.exports = new PlayerFilter();