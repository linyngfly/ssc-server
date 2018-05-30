const logicResponse = require('../../common/logicResponse');

class GM{
    async getContactInfo(data){
        return logicResponse.ask({
            wechat:'微信',
            qq:'QQ'
        });
    }
}

module.exports = new GM();