const moment = require('moment');
const util = require('util');
const config = require('../config');
const httpclient = require('../../../net/httpclient');

/**
 * https://user.opencai.net/bucket/order.aspx
 * 账户 18108083126  密码dswd2017
 */

class OpenCaiNetApi {
    constructor() {
        this._sdkAddress = [
            {
                host: 'ho.apiplus.net',
                port: 80,
                method: "GET",
                path: '/newly.do?token=t208b2a08fd475e76k&code=%s&rows=%d&format=json'
            },
            {
                host: 'z.apiplus.net',
                port: 80,
                method: "GET",
                path: '/newly.do?token=t208b2a08fd475e76k&code=%s&rows=%d&format=json'
            }
        ];
    }

    async _getSdkInfo(options) {
        let sdkData = await httpclient.get(options);
        sdkData = JSON.parse(sdkData.toString());
        return sdkData;
    }

    async getLotteryInfo(type, rows = 2) {
        let lotteryInfo = {};
        for (let i = 0; i < this._sdkAddress.length; i++) {
            try {
                this._sdkAddress[i].path = util.format(this._sdkAddress[i].path, type.CODE, rows);
                let sdkData = await this._getSdkInfo(this._sdkAddress[i]);
                lotteryInfo.identify = sdkData.code;

                let infos = sdkData.data;

                let last_opentime = moment(infos[0].opentime).add(type.INTERVAL, 'minutes');
                lotteryInfo.next = {
                    period: Number(infos[0].expect) + 1,
                    opentime: last_opentime.format('YYYY-MM-DD HH:mm:ss')
                };

                lotteryInfo.last = {
                    period: Number(infos[0].expect),
                    opentime: infos[0].opentime,
                    numbers: infos[0].opencode
                };

                lotteryInfo.pre = {
                    period: Number(infos[1].expect),
                    opentime: infos[1].opentime,
                    numbers: infos[1].opencode
                };

                return lotteryInfo;

            } catch (e) {
                console.error('OpenCaiNetApi getLotteryInfo err=', e);
            }
        }
    }
}

setInterval(async ()=>{
    let tt = new OpenCaiNetApi();
    console.log(await tt.getLotteryInfo(config.OPEN_CAI_NET.CAKENO));
}, 5000);

module.exports = OpenCaiNetApi;