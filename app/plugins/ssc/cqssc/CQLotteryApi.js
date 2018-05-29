const urlencode = require('urlencode');
const cheerio = require('cheerio');
const ERROR_OBJ = require('../error_code').ERROR_OBJ;
const httpclient = require('../../../net/httpclient');

class CQLotteryApi {
    constructor() {
        this._host = 'http://buy.cqcp.net';
    }

    /**
     * 获取彩票官方时间
     * @returns {Promise<*[]>}
     */
    async getServerTime() {
        let url = `/game/time.aspx?ab=${Math.random()}`;
        try {
            let timeData = await httpclient.getData(`${this._host}${url}`);
            return [null, timeData.toString()];
        } catch (e) {
            console.log('e=',e);
            return [e];
        }
    }

    /**
     * 获取前几期开奖历史
     * @returns {Promise<*[]>}
     */
    async getPreInfo() {
        let now = new Date();
        let url = "/Game/GetNum.aspx?iType=3&time=" + urlencode(now);
        try {
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
            console.info('------开奖历史-------------' + JSON.stringify(_items));
            return [null, _items];
        } catch (e) {
            return [e];
        }
    }

    async getLatestInfo() {
        let url = `/Game/GetNum.aspx?iType=11&name=${Math.random()}`;
        try {
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
            console.log('获取开奖 期数:', period, '开奖号:', numbers, resp);
            return [null, resp];
        } catch (e) {
            return [e];
        }
    }

    async getNextInfo() {
        let url = "/Game/ShortIssues.aspx?time=" + urlencode(new Date()) + "&type=" + "BEAB95B0BAA1242CF042D1659686F54B" + "&iType=Ssc";
        try {
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
            console.log('下期开奖信息=', resp);
            return [null, resp];
        } catch (e) {
            return [e];
        }
    }
}

// let test = new CQLotteryApi();
// test.getServerTime();
// test.getPreInfo();
// test.getLatestInfo()
// test.getNextInfo();

module.exports = CQLotteryApi;