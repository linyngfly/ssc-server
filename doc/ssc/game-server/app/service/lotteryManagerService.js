/**
 * Created by linyng on 17-5-17.
 */

var logger = require('pomelo-logger').getLogger(__filename);
var http = require('http');
var async = require('async');

// 非常荣幸您选择我们作为您的开奖数据供应商！
// 您的数据账号：33C9381371DE3848
//
// 您的校验密码：ED10513DF478
//
// 快速管理地址：http://face.opencai.net?token=33c9381371de3848&verify=ed10513df478
//
//     自助管理平台：(即将上线)

function LotteryManagerService() {
    this.addrIndex = 0;
    this.latestLotteryInfo = null;
    this.latestPeriod = null;
    this.latestOpenTime = 0;
    this.latestOpenOriTime = 0;
    this.autoLearServerOpenTime = {minute:1,second:20};
}

var lotteryResultSample = {
    "rows": 1,
    "code": "cqssc",
    "remain": "498hrs",
    "next": [{"expect": "20170518025", "opentime": "2017-05-18 10:10:40"}],
    "open": [{"expect": "20170518024", "opencode": "3,7,2,1,1", "opentime": "2017-05-18 10:00:52"}],
    "time": "2017-05-18 10:01:31"
};

var lotteryResultSample2 =  {
    "rows":2,
    "code":"cqssc",
    "remain":"155hrs",
    "next":[{"expect": "20170601066", "opentime": "2017-06-01 17:00:40"}],
    "open":[{"expect": "20170601065", "opencode": "7,3,0,0,8", "opentime": "2017-06-01 16:50:43"},
            {"expect": "20170601064", "opencode": "3,5,8,9,2", "opentime": "2017-06-01 16:40:45"}
           ],
    "time":"2017-06-01 17:00:15"
}

LotteryManagerService.prototype.init = function (service) {
    this.lotteryData = this.dataApiUtil.lotteryApi().data;
    this.lotteryIds = this.dataApiUtil.lotteryApi().ids;
    this.gameService = service;
    this.tickCount = 0;

    setInterval(this.tick.bind(this), 2000);
};

LotteryManagerService.prototype.nextAddr = function () {
    if (this.lotteryIds.length <= 0) return null;

    this.addrIndex = (this.addrIndex + 1) % this.lotteryIds.length;
    var addr = this.lotteryData[this.addrIndex];
    var retVal = {header: {host: addr.host, port: addr.port, path: addr.path, method: addr.method}, type: addr.type};
    return retVal;
};

LotteryManagerService.prototype.timeSync = function (result) {
    var lottery = this.gameService.getLottery();
    if (!lottery) {
        return;
    }

    var sysTickTime = new Date(result.tickTime);
    //var nextOpenTime = new Date(result.next.opentime);

    var tick = (this.latestOpenTime - sysTickTime) / 1000;
    lottery.setTickCount(result.next.period, tick);
    this.tickCount = 0;
};

LotteryManagerService.prototype.tick = function () {
    var self = this;
    this.getOfficialLotteryInfo(function (err, result) {
        if (err || !result) {
            console.log('获取彩票信息失败', err);
            return;
        }

        var lottery = self.gameService.getLottery();
        if (!lottery) {
            return;
        }

        if (!self.latestPeriod || (!!self.latestPeriod && self.latestPeriod != result.last.period)) {
            lottery.publishLottery(result);
            self.gameService.openLottery(result.last.numbers.split(','), result.last.period);
            self.latestPeriod = result.last.period;
            self.latestOpenTime = result.next.opentime.getTime();
            self.latestOpenOriTime = result.next.oriTime.getTime();
            self.timeSync(result);
        }

        if(self.tickCount > 10){
            self.timeSync(result);
        }

        self.tickCount++;
    });

    return;

    this.getLotteryInfo(this.nextAddr(), function (err, result) {
        if (err || !result) {
            return;
        }

        var lottery = self.gameService.getLottery();
        if (!lottery) {
            return;
        }

        if (!self.latestLotteryInfo || (!!self.latestLotteryInfo && self.latestLotteryInfo.next.period === result.last.period)) {
            lottery.publishLottery(result);
            self.gameService.openLottery(result.last.numbers.split(','), result.last.period, result.last.opentime);

            var sysTickTime = new Date(result.tickTime);
            var nextOpenTime = new Date(result.next.opentime);

            var tick = (nextOpenTime - sysTickTime) / 1000;
            lottery.setTickCount(result.next.period, tick);
        }
        self.latestLotteryInfo = result;
    });
};



// {
//     "rows":2,
//     "code":"cqssc",
//     "remain":"155hrs",
//     "next":[{"expect": "20170601066", "opentime": "2017-06-01 17:00:40"}],
//     "open":[{"expect": "20170601065", "opencode": "7,3,0,0,8", "opentime": "2017-06-01 16:50:43"},
//             {"expect": "20170601064", "opencode": "3,5,8,9,2", "opentime": "2017-06-01 16:40:45"}
//            ],
//     "time":"2017-06-01 17:00:15"
// }
LotteryManagerService.prototype.checkA = function (result) {
    var lotteryInfo = {};
    if (!result.code || !result.time) {
        return null;
    }

    lotteryInfo.identify = result.code;
    lotteryInfo.tickTime = result.time;

    if (!result.next || !result.next[0] || !result.next[0].expect || !result.next[0].opentime) {
        return null;
    }
    lotteryInfo.next = {period: result.next[0].expect, opentime: result.next[0].opentime};

    if (!result.open || !result.open[0] || !result.open[0].expect || !result.open[0].opentime || !result.open[0].opencode) {
        return null;
    }
    lotteryInfo.last = {
        period: result.open[0].expect,
        opentime: result.open[0].opentime,
        numbers: result.open[0].opencode
    };

    if (!result.open || !result.open[1] || !result.open[1].expect || !result.open[1].opentime || !result.open[1].opencode) {
        return null;
    }
    lotteryInfo.pre = {
        period: result.open[1].expect,
        opentime: result.open[1].opentime,
        numbers: result.open[1].opencode
    };

    return lotteryInfo;
};

LotteryManagerService.prototype.checkB = function (result) {

};

LotteryManagerService.prototype.checkC = function (result) {

};

LotteryManagerService.prototype.parse = function (type, result) {
    var resultInfo = null;
    switch (type) {
        case this.consts.LotteryType.A:
            resultInfo = this.checkA(result);
            break;
        case this.consts.LotteryType.B:
            break;
        case this.consts.LotteryType.C:
            break;
        default:
            break;
    }
    return resultInfo;
}

function rand(x) {
  return Math.floor(Math.random()*x);
}
var initPeriod = 20170601165;
LotteryManagerService.prototype.generateLottery = function (oriData) {
    var data = oriData;


    data.next[0].expect = (initPeriod++).toString();
    data.open[0].expect = initPeriod.toString();
    data.open[0].opencode = `${rand(9)},${rand(9)},${rand(9)},${rand(9)},${rand(9)}`;

    data.open[1].expect = initPeriod.toString();
    data.open[1].opencode = `${rand(9)},${rand(9)},${rand(9)},${rand(9)},${rand(9)}`;

    return data;
};

LotteryManagerService.prototype.getLotteryInfo = function (options, callback) {
    if (!options) {
        callback('Request err', null);
        return;
    }

    var self = this;

    var req = http.request(options.header, function (res) {
        if (res.statusCode != 200) {
            self.getLotteryInfo(this.nextAddr(), callback);
            return;
        }

        var resData = "";
        res.on('data', function (chunk) {
            // console.log('BODY: ' + chunk);
            if (chunk) {
                resData += chunk;
            }
        });

        res.on("end", function () {
            var jsData = JSON.parse(resData);
            if (!jsData) {
                self.getLotteryInfo(self.nextAddr(), callback);
                return;
            }

           // var jsData = self.generateLottery(lotteryResultSample2);

            var parseResult = self.parse(options.type, jsData)
            if (parseResult) {
                callback(null, parseResult);
            }
            else {
                self.getLotteryInfo(self.nextAddr(), callback);
            }
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        self.getLotteryInfo(self.nextAddr(), callback);
    });

    req.end();
};

LotteryManagerService.prototype.collateTime = function (tick_time) {
    var nextTime = new Date(tick_time);
    nextTime.setMinutes(nextTime.getMinutes() + this.autoLearServerOpenTime.minute);
    nextTime.setSeconds(nextTime.getSeconds() + this.autoLearServerOpenTime.second);
    return nextTime;
};

LotteryManagerService.prototype.getOfficialLotteryInfo = function (callback) {
    var self = this;
    async.parallel([
            function (cb) {
                self.cqss.getServerTime(cb);
            },
            function (cb) {
                self.cqss.getPreInfo(cb);
            },
            function (cb) {
                self.cqss.getNextInfo(cb);
            }
        ],
        function (err, results) {
            if(!!err){
                self.utils.invokeCallback(callback, err, null);
                return;
            }

            var lotteryInfo = {};
            lotteryInfo.identify = 'cqss';

            var serverTime = results[0];
            lotteryInfo.tickTime = serverTime;

            var preInfos = results[1];
            if(Number(preInfos[0].period) < Number(self.latestPeriod)){
                return;
            }

            var nextInfo = results[2];
            var next_ori_time = new Date(nextInfo.time);
            var col_time = self.collateTime(nextInfo.time);

            lotteryInfo.next = {period: nextInfo.period, opentime: col_time, oriTime: next_ori_time};

            lotteryInfo.last = {
                period: preInfos[0].period,
                opentime: preInfos[0].time,
                numbers: preInfos[0].numbers
            };

            if(self.latestPeriod != preInfos[0].period && self.latestOpenOriTime != 0){
                var open_time = new Date(serverTime);
                var sub_sec = (open_time.getTime() - self.latestOpenOriTime)/1000;
                if(sub_sec > 0){
                    self.autoLearServerOpenTime.minute = Math.floor(sub_sec/60);
                    self.autoLearServerOpenTime.second = (sub_sec%60 -3);
                    console.log('---------------------------------------- auto learn open time:',self.autoLearServerOpenTime.minute+':'+self.autoLearServerOpenTime.second);
                }
            }

            lotteryInfo.pre = {
                period: preInfos[1].period,
                opentime: preInfos[1].time,
                numbers: preInfos[1].numbers
            };

            self.utils.invokeCallback(callback, null, lotteryInfo);
        });
};

module.exports = {
    id: "lotteryManagerService",
    func: LotteryManagerService,
    props: [
        {name: "dataApiUtil", ref: "dataApiUtil"},
        {name: "consts", ref: "consts"},
        {name: "utils", ref: "utils"},
        {name: "cqss", ref: "cqss"}
    ]
}
