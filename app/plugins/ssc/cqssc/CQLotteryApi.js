const moment = require('moment');
const urlencode = require('urlencode');
const cheerio = require('cheerio');
const ERROR_OBJ = require('../error_code').ERROR_OBJ;
const httpclient = require('../../../net/httpclient');

class CQLotteryApi {
    constructor() {
        this._host = 'http://buy.cqcp.net';
    }

    async getLotteryInfo(type, rows = 2) {
        let lotteryInfo = {};
        lotteryInfo.identify = type.IDENTIFY;

        try {
            // let serverTime = await this._getServerTime();
            // if (!serverTime) {
            //     return;
            // }
            // lotteryInfo.serverTime = serverTime;

            let preInfos = await this._getPreInfo(rows);
            if (!preInfos) {
                return;
            }

            let nextInfo = await this._getNextInfo();
            if (!nextInfo) {
                return;
            }
            lotteryInfo.next = {
                period: Number(nextInfo.period),
                opentime: nextInfo.time
            };

            lotteryInfo.last = {
                period: Number(preInfos[0].period),
                opentime: preInfos[0].time,
                numbers: preInfos[0].numbers
            };

            lotteryInfo.pre = {
                period: Number(preInfos[1].period),
                opentime: preInfos[1].time,
                numbers: preInfos[1].numbers
            };

            return lotteryInfo;

        } catch (e) {
            console.error('CQLotteryApi CQLotteryApi err=', e);
        }

    }

    /**
     * 获取彩票官方时间
     * @return {Promise.<*|moment.Moment>}
     * @private
     */
    async _getServerTime() {
        let url = `/game/time.aspx?ab=${Math.random()}`;
        let timeData = await httpclient.getData(`${this._host}${url}`);
        // console.log('服务器时间 timeData=', timeData.toString());
        let serverTime = moment(timeData.toString());
        let isValid = serverTime.isValid();
        if (!isValid) {
            return;
        }
        serverTime = serverTime.format('YYYY-MM-DD HH:mm:ss');
        return serverTime;
    }

    /**
     * 获取前几期开奖历史
     * @returns {Promise<*[]>}
     */
    async _getPreInfo() {
        let now = new Date();
        let url = "/Game/GetNum.aspx?iType=3&time=" + urlencode(now);
        let preData = await httpclient.getData(`${this._host}${url}`);
        const $ = cheerio.load(preData);
        let src_listData = $.root().find('body');
        let ulList = src_listData.find('ul');
        let _items = [];
        ulList.each(function () {
            let liItem = $(this).children();
            let _item = {};
            liItem.each(function (i) {
                switch (i) {
                    case 0:
                        _item.period = now.getFullYear().toString().substring(0, 2) + $(this).text();
                        break;
                    case 1:
                        _item.numbers = $(this).text();
                        break;
                    case 2:
                        _item.time = now.getFullYear() + '-' + $(this).text() + ':' + '00';
                        break;
                }
            });
            _items.push(_item);
        });
        // console.info('开奖历史 _items=' + JSON.stringify(_items));
        return _items;
    }

    async _getLatestInfo() {
        let url = `/Game/GetNum.aspx?iType=11&name=${Math.random()}`;
        let numberData = await httpclient.getData(`${this._host}${url}`);
        numberData = numberData.toString();
        let index = numberData.indexOf('|');
        if (index < 0) {
            console.log('开奖数据无效:', numberData);
            throw ERROR_OBJ.DATA_NULL_ERROR;
        }

        let period = numberData.substring(0, numberData.indexOf('|'));
        let numbers = numberData.substring(numberData.indexOf('|') + 1);

        let now = new Date();
        let resp = {period: now.getFullYear().toString().substring(0, 2) + period, numbers: numbers};
        //toddo 校验数据是否有效
        // console.log('最近开奖信息, resp=', resp);
        return resp;
    }

    async _getNextInfo() {
        let url = "/Game/ShortIssues.aspx?time=" + urlencode(new Date()) + "&type=" + "BEAB95B0BAA1242CF042D1659686F54B" + "&iType=Ssc";
        let nextData = await httpclient.getData(`${this._host}${url}`);
        nextData = nextData.toString();
        let index = nextData.lastIndexOf('$');
        let filt = nextData.substring(0, index);
        let period = filt.substring(0, filt.lastIndexOf('$'));
        let time = filt.substring(filt.indexOf('$') + 1);

        //todo 校验数据
        let now = new Date();
        let resp = {
            period: now.getFullYear().toString().substring(0, 2) + period,
            time: time
        };
        // console.log('下期开奖信息=', resp);
        return resp;
    }
}

// setInterval(async ()=>{
//     let test = new CQLotteryApi();
//     console.log(await test.getLotteryInfo());
// }, 5000);


module.exports = CQLotteryApi;