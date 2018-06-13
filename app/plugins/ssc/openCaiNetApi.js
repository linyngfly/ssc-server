const moment = require('moment');
const util = require('util');
const config = require('./config');
const httpclient = require('../../net/httpclient');




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
        this._last_get_timestamp = Date.now();
    }

    async _getSdkInfo(options) {
        logger.error('options=', options);
        let sdkData = await httpclient.get(options);
        logger.error('sdkData=', sdkData.toString());
        sdkData = JSON.parse(sdkData.toString());
        return sdkData;
    }

    _convertTo3Ball(identify, opencode) {
        let result = null;
        switch (identify){
            case config.OPEN_CAI_TYPE.BJKL8.IDENTIFY:
                result = this._lucky28ConvertTo3Ball(opencode);
                break;
            case config.OPEN_CAI_TYPE.CAKENO.IDENTIFY:
                result = this._canada28ConvertTo3Ball(opencode);
                break;
            default:
                result = opencode;
                break;
        }

        return result;
    }

    /**
     * 北京快乐8 转 幸运28
     * 开奖20位数字：04,06,09,10,15,20,26,31,33,34,40,45,54,65,69,74,75,76,77,79
     *              07,12,13,14,19,26,32,34,36,37,42,45,51,55,59,64,68,69,71,72+02
     * 按大小排列
     * 1~6位相加和值末位数作为幸运28第一个数字
     * 7~12 第二个数字
     * 13~18第三个数字
     */

    _lucky28ConvertTo3Ball(opencode) {
        let idx = opencode.indexOf('+');
        let numbers = opencode.substring(0, idx);
        numbers = numbers.split(',');
        numbers = numbers.sort((a, b) => {
            return a > b ? 1 : -1;
        });
        let newNumbers = [];

        let total = 0;
        for(let i=0; i<6; i++){
            total += numbers[i];
        }
        newNumbers.push(total % 10);
        total = 0;

        for(let i=6; i<12; i++){
            total += numbers[i];
        }
        newNumbers.push(total % 10);
        total = 0;

        for(let i=12; i<18; i++){
            total += numbers[i];
        }

        newNumbers.push(total % 10);
        return newNumbers.join(',');
    }

    _canada28ConvertTo3Ball(opencode) {
        let idx = opencode.indexOf('+');
        let numbers = opencode.substring(0, idx);
        numbers = numbers.split(',');
        numbers = numbers.sort((a, b) => {
            return a > b ? 1 : -1;
        });
        let newNumbers = [];

        let total = numbers[1] + numbers[4] + numbers[7] + numbers[10] + numbers[13] + numbers[16];
        newNumbers.push(total % 10);

        total = numbers[2] + numbers[5] + numbers[8] + numbers[11] + numbers[14] + numbers[17];
        newNumbers.push(total % 10);

        total = numbers[3] + numbers[6] + numbers[9] + numbers[12] + numbers[15] + numbers[18];
        newNumbers.push(total % 10);
        return newNumbers.join(',');
    }

    async getLotteryInfo(type, rows = 2) {
        // let lotteryInfo = {};
        if (Date.now() - this._last_get_timestamp < 4000) {
            return null;
        }

        logger.error('getLotteryInfo requrest', type);
        for (let i = 0; i < this._sdkAddress.length; i++) {
            try {
                // this._sdkAddress[i].path = util.format(this._sdkAddress[i].path, type.IDENTIFY, rows);
                logger.error('http requrest', type);
                this._last_get_timestamp = Date.now();
                let sdkData = await this._getSdkInfo({
                    host: this._sdkAddress[i].host,
                    port: this._sdkAddress[i].port,
                    method: this._sdkAddress[i].method,
                    path: util.format(this._sdkAddress[i].path, type.IDENTIFY, rows)
                });

                let lotteryInfo = {};

                lotteryInfo.identify = sdkData.code;

                let infos = sdkData.data;

                let last_opentime = moment(infos[0].opentime).add(type.INTERVAL, 'minutes');
                last_opentime.second(0);
                lotteryInfo.next = {
                    period: Number(infos[0].expect) + 1,
                    opentime: last_opentime.format('YYYY-MM-DD HH:mm:ss')
                };

                lotteryInfo.last = {
                    period: Number(infos[0].expect),
                    opentime: infos[0].opentime,
                    numbers: this._convertTo3Ball(type.IDENTIFY, infos[0].opencode)
                };

                lotteryInfo.pre = {
                    period: Number(infos[1].expect),
                    opentime: infos[1].opentime,
                    numbers: this._convertTo3Ball(type.IDENTIFY, infos[1].opencode)
                };

                logger.error('lotteryInfo=', lotteryInfo);

                return lotteryInfo;

            } catch (e) {
                console.error('OpenCaiNetApi getLotteryInfo err=', e);
                return;
            }
        }
    }
}

setInterval(async () => {
    let tt = new OpenCaiNetApi();
    console.log(await tt.getLotteryInfo(config.OPEN_CAI_TYPE.BJKL8));
}, 5000);

module.exports = OpenCaiNetApi;