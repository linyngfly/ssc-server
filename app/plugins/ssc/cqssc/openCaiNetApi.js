const moment = require('moment');
const util = require('util');
const config = require('../config');
const httpclient = require('../../../net/httpclient');

class OpenCaiNetApi {
    constructor() {
        this._sdkAddress = [
            {
                host: 'r.apiplus.net',
                port: 80,
                method: "GET",
                path: '/newly.do?token=8396675f3e16356cd2d20d7c84d1aa58&code=%s&rows=%d&format=json'
            },
            {
                host: 'r.apiplus.net',
                port: 80,
                method: "GET",
                path: '/newly.do?token=b8df1b564c190ccb343f3308b6a3379e&code=%s&rows=%d&format=json'
            }
        ];
    }

    async _getSdkInfo(options) {
        let sdkData = await httpclient.get(options);
        sdkData = JSON.parse(sdkData.toString());
        return sdkData;
    }

    async getLotteryInfo(type, rows = 2) {

        this._sdkAddress.sort(() => {
            return Math.random() > 0.5 ? -1 : 1;
        });

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