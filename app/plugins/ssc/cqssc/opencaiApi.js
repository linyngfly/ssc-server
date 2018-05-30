const sdkAddress = [
    {
        host: 'd.apiplus.net',
        port:80,
        method:"GET",
        path:'/newly.do?token=33c9381371de3848&code=cqssc&rows=2&format=json&extend=true'
    },
    {
        host: 'd.apiplus.net',
        port:80,
        method:"GET",
        path:'/newly.do?token=33c9381371de3848&code=cqssc&rows=2&format=json&extend=true'
    },
    {
        host: 'd.apiplus.net',
        port:80,
        method:"GET",
        path:'/newly.do?token=33c9381371de3848&code=cqssc&rows=2&format=json&extend=true'
    }
];

const httpclient = require('../../../net/httpclient');

class OpenCaiApi {
    constructor() {

    }

    _getInfo(options){
        try {
            let timeData = await httpclient.getData(`${this._host}${url}`);
            return [null, timeData.toString()];
        } catch (e) {
            console.log('e=',e);
            return [e];
        }
    }

    async getLotteryInfo(){

    }
}

module.exports = OpenCaiApi;