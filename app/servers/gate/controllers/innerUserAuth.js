const consts = require('../../../consts/consts');
const authSdk = require('./loginAuth/authSdk');
const ERROR_OBJ = require('../../../consts/error_code').ERROR_OBJ;
const logger = require('omelo-logger').getLogger('gate', __filename);
const logicResponse = require('../../common/logicResponse');

class InnerUserAuth {
    /**
     * 注册
     * @param data
     * @returns {Promise<*|{data, type}>}
     */
    async register(data) {
        let sdkApi = authSdk.sdk(consts.AUTH_CHANNEL_ID.WZGJ_INNER);
        if (!sdkApi) {
            throw ERROR_OBJ.NOT_SUPPORT_CHANNEL_LOGIN;
        }

        try {
            let uid = await sdkApi.isRegister(data);
            if (uid != null) {
                throw ERROR_OBJ.USERNAME_EXIST;
            } else {
                let uid = await sdkApi.register(data);
                data.uid = uid;
                let resp = await sdkApi.login(data);
                logger.info(`注册新用户${uid}`);
                return logicResponse.ask(resp);
            }
        } catch (err) {
            logger.error('用户注册失败', err);
            throw err;
        }
    }

    /**
     * 登录
     * @param data
     * @returns {Promise<*|{data, type}>}
     */
    async login(data) {
        let sdkApi = authSdk.sdk(consts.AUTH_CHANNEL_ID.WZGJ_INNER);
        if (!sdkApi) {
            throw ERROR_OBJ.NOT_SUPPORT_CHANNEL_LOGIN;
        }

        try {
            let uid = await sdkApi.isRegister(data);
            if(uid == null){
                throw ERROR_OBJ.USER_NOT_EXIST;
            }

            data.uid = uid;
            let resp = await sdkApi.login(data);
            return logicResponse.ask(resp);
        } catch (err) {
            logger.error('用户登录失败', err);
            throw err;
        }
    }

    async logout(data){
        let sdkApi = authSdk.sdk(consts.AUTH_CHANNEL_ID.WZGJ_INNER);
        if (!sdkApi) {
            throw ERROR_OBJ.NOT_SUPPORT_CHANNEL_LOGIN;
        }

        try{
            await sdkApi.logout(data);
            return logicResponse.ask({status: 1, msg: "成功退出"});
        }catch (err){
            logger.error("退出账户失败", err);
            throw ERROR_OBJ.LOGINOUT_FAIL;
        }
    }

    /**
     * 发送短信验证码
     * @param data
     * @returns {Promise<void>}
     */
    async getPhoneCode(data){
        let sdkApi = authSdk.sdk(consts.AUTH_CHANNEL_ID.WZGJ_INNER);
        if (!sdkApi) {
            throw ERROR_OBJ.NOT_SUPPORT_CHANNEL_LOGIN;
        }

        try {
            let resp = await sdkApi.sendPhoneCode(data.phone);
            return logicResponse.ask(resp);
        }catch(err){
            logger.error('获取短信验证码失败', err);
            throw err;
        }
    }

    /**
     * 修改密码
     * @param data
     * @returns {Promise<*|{data, type}>}
     */
    async modifyPassword(data) {
        if (!data.username || !data.oldPassword || !data.newPassword) {
            throw ERROR_OBJ.PARAM_MISSING;
        }

        let sdkApi = authSdk.sdk(consts.AUTH_CHANNEL_ID.WZGJ_INNER);
        if (!sdkApi) {
            throw ERROR_OBJ.NOT_SUPPORT_CHANNEL_LOGIN;
        }

        try {
            let uid = await sdkApi.isRegister(data.username);
            if(uid == null){
                throw ERROR_OBJ.USER_NOT_EXIST;
            }
            data.uid = uid;
            let account = await sdkApi.modifyPassword(data);
            return logicResponse.ask(account);
        } catch (err) {
            logger.error('用户密码修改失败', err);
            throw ERROR_OBJ.OLD_PASSWORD_ERROR;
        }
    }
}

module.exports = new InnerUserAuth();