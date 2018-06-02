const models = require('../../models');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;
const Token = require('../../utils/token');
const session = require('../../utils/imports').session;

module.exports = async function (token) {
    if (!token) {
        throw ERROR_OBJ.PARAM_MISSING;
    }

    let {uid,timestamp} = Token.parse(token, session.secret);
    if(!uid){
        throw ERROR_OBJ.TOKEN_INVALID;
    }

    if(session.expire != -1){
        if(Date.now() - timestamp > session.expire){
            throw ERROR_OBJ.TOKEN_INVALID;
        }
    }

    let account = await models.account.getAccount(uid, [models.account.fieldConst.TOKEN, models.account.fieldConst.TEST]);
    if (account.test < 0) {
        throw ERROR_OBJ.PLAYER_CHEAT;
    } else if (account.token != token) {
        throw ERROR_OBJ.TOKEN_INVALID;
    }

    return uid;
};