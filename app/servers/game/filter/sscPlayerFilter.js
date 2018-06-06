/**
 * Created by Administrator on 2017/4/15.
 */

const omelo = require('omelo');
const consts = require('../../../consts/constants');
const ERROR_OBJ = require('../../../consts/error_code').ERROR_OBJ;

class PlayerFilter{
    constructor(){
        this._routes = new Map();
    }

    before(msg, session, next){
        let isIgnore = this._routes.get(msg.__route__);
        if(!isIgnore || isIgnore == false){
            if(omelo.app.entry){
                let game = omelo.app.entry.getGame(session.get(consts.PLUGINS.MAIN), session.get(consts.PLUGINS.SUB));
                if(!game){
                    next(ERROR_OBJ.PLAYER_NOT_JOIN_HALL, {error:ERROR_OBJ.PLAYER_NOT_JOIN_HALL});
                    return;
                }
                if(!game.isInGameHall(msg.uid)){
                    next(ERROR_OBJ.PLAYER_NOT_IN_GAME, {error:ERROR_OBJ.PLAYER_NOT_JOIN_HALL});
                    return;
                }
            }else {
                next(ERROR_OBJ.SERVER_NOT_RUNNING, {error:ERROR_OBJ.SERVER_NOT_RUNNING});
            }
        }

        next();
    }

    after(err, msg, session, resp, next){
        next();
    }

    /**
     * 添加过滤接口
     * @param route
     * @param isIgnore
     */
    addRoute(route, isIgnore = true){
        this._routes.set(route, isIgnore);
    }

}

module.exports = new PlayerFilter();