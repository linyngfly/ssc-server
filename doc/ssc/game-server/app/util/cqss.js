/**
 * Created by linyng on 17-5-20.
 */

const http = require('http');
const urlencode = require('urlencode');
const cheerio = require('cheerio');
const logger = require('pomelo-logger').getLogger(__filename);

// POST
//http://buy.cqcp.net/ajaxHTTP/gamedraw/GetOpenNumber.aspx
//param:sPass=BEAB95B0BAA1242CF042D1659686F54B&idMode=8&iType=2&iCount=1

var CQSS = function () {
    this.host = 'buy.cqcp.net';
    this.port = 80;
};

CQSS.prototype.getServerTime = function (callback) {
    var url = `/game/time.aspx?ab=${Math.random()}`;
    var self = this;
    var req = http.request({
        host: this.host,
        port: this.port,
        path: url,
        method: 'get'
    }, function (res) {
        if (res.statusCode != 200) {
            logger.error('获取服务器时间请求失败', res);
            self.utils.invokeCallback(callback, res, null);
            return;
        }

        var timeData = "";
        res.on('data', function (chunk) {
            // console.log('BODY: ' + chunk);
            if (chunk) {
                timeData += chunk;
            }
        });

        res.on("end", function () {
          //  console.log('服务器系统时间:', timeData);

            self.utils.invokeCallback(callback, null, timeData);


            // var sys = new Date(timeData);
            // if(sys.isValid()){
            //     self.utils.invokeCallback(callback, null, timeData);
            // }
            // else {
            //     self.utils.invokeCallback(callback, '时间无效', null);
            // }
        });
    });

    req.on('error', function (e) {
        self.utils.invokeCallback(callback, e, null);
        logger.error('problem with request: ',  e.message);
    });

    req.end();
};

// 获取开奖历史
CQSS.prototype.getPreInfo = function (callback) {
    var now = new Date();
    var url = "/Game/GetNum.aspx?iType=3&time=" + urlencode(now);

    var self = this;
    // var options = `{host:${host},port:${port},path:${url},method:'get'}`;
    var req = http.request({
        host: this.host,
        port: this.port,
        path: url,
        method: 'get'
    }, function (res) {
        if (res.statusCode != 200) {
            console.log('获取开奖历史信息失败');
            self.utils.invokeCallback(callback, res, null);
            return;
        }

        var preData = "";
        res.on('data', function (chunk) {
            // console.log('BODY: ' + chunk);
            if (chunk) {
                preData += chunk;
            }
        });

        res.on("end", function () {
            const $ = cheerio.load(preData);
            let src_listData = $.root().find('body');

            let ulList = src_listData.find('ul');

            var now = new Date();
            let _items = [];
            ulList.each(function () {
                let liItem = $(this).children();
                let _item = {};
                liItem.each(function (i) {
                    switch (i){
                        case 0:
                            _item.period = now.getFullYear().toString().substring(0,2) + $(this).text();
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

    //        console.info('------开奖历史-------------' + _items);
            //toddo 校验数据是否有效
            self.utils.invokeCallback(callback, null, _items);
        });
    });

    req.on('error', function (e) {
        logger.error('problem with request: ', e.message);
        self.utils.invokeCallback(callback, e, null);
    });

    req.end();
};

CQSS.prototype.getLatestInfo = function (callback) {
    var url = `/Game/GetNum.aspx?iType=11&name=${Math.random()}`;
    var self = this;
    // var options = `{host:${host},port:${port},path:${url},method:'get'}`;
    var req = http.request({
        host: this.host,
        port: this.port,
        path: url,
        method: 'get'
    }, function (res) {
        if (res.statusCode != 200) {
            console.log('获取开奖号码失败');
            self.utils.invokeCallback(callback, res, null);
            return;
        }

        var numberData = "";
        res.on('data', function (chunk) {
            // console.log('BODY: ' + chunk);
            if (chunk) {
                numberData += chunk;
            }
        });

        res.on("end", function () {
            var index = numberData.indexOf('|');
            if (index < 0) {
                self.utils.invokeCallback(callback, '开奖数据无效', null);
                return;
            }

            var period = numberData.substring(0, numberData.indexOf('|'));
            var numbers = numberData.substring(numberData.indexOf('|') + 1);

            var now = new Date();

            //toddo 校验数据是否有效
            self.utils.invokeCallback(callback, null, {period: now.getFullYear().toString().substring(0,2) + period, numbers: numbers});
            //console.log('获取开奖 期数:', period, '开奖号:', numbers);

        });
    });

    req.on('error', function (e) {
        logger.error('problem with request: ' ,e.message);
        self.utils.invokeCallback(callback, e, null);
    });

    req.end();
};

CQSS.prototype.getNextInfo = function (callback) {
    var url = "/Game/ShortIssues.aspx?time=" + urlencode(new Date()) + "&type=" + "BEAB95B0BAA1242CF042D1659686F54B" + "&iType=Ssc";
    var self = this;
    var req = http.request({
        host: this.host,
        port: this.port,
        path: url,
        method: 'get'
    }, function (res) {
        if (res.statusCode != 200) {
            console.log('获取下期开奖信息失败');
            self.utils.invokeCallback(callback, res, null);
            return;
        }

        var nextData = "";
        res.on('data', function (chunk) {
            // console.log('BODY: ' + chunk);
            if (chunk) {
                nextData += chunk;
            }
        });

        res.on("end", function () {

            // const $ = cheerio.load(numberData);
            // console.log($.html('.openul'));

            //170605048$2017-06-05 13:59:00$

            var index = nextData.lastIndexOf('$');
            var filt = nextData.substring(0, index);
            var period = filt.substring(0, filt.lastIndexOf('$'));
            var time = filt.substring(filt.indexOf('$') + 1);
            // var nextTime = new Date(time);
            //
            // nextTime.setMinutes(nextTime.getMinutes() + self.autoLearServerOpenTime.minute);
            // nextTime.setSeconds(nextTime.getSeconds() + self.autoLearServerOpenTime.second);

            //todo 校验数据
            var now = new Date();
            self.utils.invokeCallback(callback, null, {
                period: now.getFullYear().toString().substring(0,2) + period,
                time: time
            });

           // console.log('下期开奖 期数:', period, '时间:', time);
        });
    });

    req.on('error', function (e) {
        logger.error('problem with request: ' , e.message);
        self.utils.invokeCallback(callback, e, null);
    });

    req.end();
}

module.exports = {
    id: "cqss",
    func: CQSS,
    props: [
        {name: "utils", ref: "utils"}
    ]
}




