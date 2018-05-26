const crypto = require('crypto');
const User = require('./user');
const ERROR_OBJ = require('../../../../consts/error_code').ERROR_OBJ;

function createSalt(pwd) {
    const hash = crypto.createHash('sha1');
    hash.update(pwd);
    return hash.digest('hex');
}

class InnerUser extends User {
    constructor() {
        super();
    }

    loginStatus(token) { }

    getUserInfo(data) {
        return data;
    }

    async registe(data) {
        //TODO 手机校验
        data.username = data.phone;
        data.password = createSalt(data.username + data.password);
        return await super.registe(data);
    }

    handleAuthCheck(account, data){
        let saltPassword = createSalt(account.channel_account_id + data.password);
        if (saltPassword !== account.password) {
            throw ERROR_OBJ.USERNAME_PASSWORD_ERROR;
        }
    }

    async bindPhone(data) {
        let account = await redisAccountSync.getAccountAsync(data.uid);
        if (account) {
            if (account.phone) {
                throw ERROR_OBJ.USER_NOT_EXIST;
            } else {
                account.phone = data.phone;
                account.commit();
                return account;
            }
        } else {
            throw ERROR_OBJ.USER_NOT_EXIST;
        }
    }

    async modifyPassword(data) {
        let account = await redisAccountSync.getAccountAsync(data.uid);
        if (account) {
            let oldSaltPassword = createSalt(account.channel_account_id + data.oldPassword);
            if (oldSaltPassword == account.password) {
                let newSaltPassword = createSalt(account.channel_account_id + data.newPassword);
                account.password = newSaltPassword;
                account.commit();
                return account;
            } else {
                throw ERROR_OBJ.PASSWORD_ERROR;
            }
        } else {
            throw ERROR_OBJ.USER_NOT_EXIST;
        }
    }

}

module.exports = InnerUser;