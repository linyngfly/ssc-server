/**
 * Created by linyng on 17-5-20.
 */

//http://buy.cqcp.net/game/time.aspx?ab=0.6524683441539258 (2017-06-05 10:34:20 服务器时间)
//http://buy.cqcp.net/Game/ShortIssues.aspx?time=Sat%20May%2020%202017%2010:25:47%20GMT+0800%20(CST)&type=BEAB95B0BAA1242CF042D1659686F54B&iType=Ssc
//170605028$2017-06-05 10:39:00$ （下期开奖时间）

//http://buy.cqcp.net/Game/GetNum.aspx?iType=3&time=Sat%20May%2020%202017%2010:27:15%20GMT+0800%20(CST) （开奖历史列表）
//http://buy.cqcp.net/Game/GetNum.aspx?iType=11&name=0.5110282660503318（开奖号码）


var http = require('http');
var urlencode = require('urlencode');
const cheerio = require('cheerio');

// http://buy.cqcp.net/game/cqssc/
var host = 'buy.cqcp.net';
var port = 80;

function getServerTime() {
    var url = `/game/time.aspx?ab=${Math.random()}`;
    //  var options = `{host: '${host}', port: ${port}, path: '${url}', method: 'get'}`;
    //   console.log(options,'----',JSON.parse(options));
    var req = http.request({
        host: host,
        port: 80,
        path: url,
        method: 'get'
    }, function (res) {
        if (res.statusCode != 200) {
            console.log('获取服务器时间请求失败', res);
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
            console.log('服务器系统时间:', timeData);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        self.getLotteryInfo(self.nextAddr(), callback);
    });

    req.end();

}

function getOpenNumber() {

    var url = `/Game/GetNum.aspx?iType=11&name=${Math.random()}`;
    // var options = `{host:${host},port:${port},path:${url},method:'get'}`;
    var req = http.request({
        host: host,
        port: 80,
        path: url,
        method: 'get'
    }, function (res) {
        if (res.statusCode != 200) {
            console.log('获取开奖号码失败');
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
            var period = numberData.substring(0, numberData.indexOf('|'));
            var number = numberData.substring(numberData.indexOf('|') + 1);
            console.log('获取开奖 期数:', period, '开奖号:', number);

        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        self.getLotteryInfo(self.nextAddr(), callback);
    });

    req.end();
}


// <ul class='openul bgF0F9FE'>
//     <li class='openli1'>170605045</li>
//     <li class='openli2'>3,2,9,9,9</li>
//     <li class='openli3'>06-05 13:30</li>
// </ul>
// <ul class='openul'>
//     <li class='openli1'>170605044</li>
//     <li class='openli2'>8,6,3,9,3</li>
//    <li class='openli3'>06-05 13:20</li>
// </ul>
// <ul class='openul bgF0F9FE'>
//     <li class='openli1'>170605043</li>
//     <li class='openli2'>0,2,2,3,6</li>
//     <li class='openli3'>06-05 13:10</li>
// </ul>
// <ul class='openul'>
//     <li class='openli1'>170605042</li>
//     <li class='openli2'>5,2,1,1,9</li>
//    <li class='openli3'>06-05 13:00</li>
// </ul>
// <ul class='openul bgF0F9FE'>
//     <li class='openli1'>170605041</li>
//     <li class='openli2'>8,9,0,1,5</li>
//     <li class='openli3'>06-05 12:50</li>
// </ul>
// <ul class='openul'>
//     <li class='openli1'>170605040</li>
//     <li class='openli2'>8,6,1,6,3</li>
//     <li class='openli3'>06-05 12:40</li>
// </ul>

// <ul id=“fruits”>
// <li class=“apple”>Apple</li>
// <li class=“orange”>Orange</li>
// <li class=“pear”>Pear</li>
// </ul>

function getOpenNumbers() {

    var now = new Date();
    // now.toDateString();
    //console.log(urlencode(now));
    var url = "/Game/GetNum.aspx?iType=3&time=" + urlencode(now);

    //var url = `/Game/GetNum.aspx?iType=3&time=" +${urlencode(new Date())}`;
    // var options = `{host:${host},port:${port},path:${url},method:'get'}`;
    var req = http.request({
        host: host,
        port: 80,
        path: url,
        method: 'get'
    }, function (res) {
        if (res.statusCode != 200) {
            console.log('获取开奖号码失败');
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

            const $ = cheerio.load(numberData);
            console.log($('.openul').children().length);
            console.log(typeof $('.openul').children());

            var items = [];
            $('.openul').children().each(function (i, elem) {
                items[i] = $(this).text();
            });
            console.log(items);

      //      0,1,2, 3,4,5

            var now = new Date();


            var infos = [];
            var info1 = {period: now.getFullYear()+items[0], numbers: items[1], time: now.getFullYear()+'-'+items[2]+':'+'00'};
            var info2 = {period: now.getFullYear()+items[3], numbers: items[4], time: now.getFullYear()+'-'+items[5]+':'+'00'};


            console.log('-------------------',[info1,info2]);

            var nextTime = new Date('2017-06-05 13:59:00');
            nextTime.setSeconds(nextTime.getSeconds() + 40);
            console.log(nextTime.toISOString());

            // docs.forEach(function (item) {
            //     console.log(item);
            // })

            // var itemList = [];
            // lists.each(function(item) {
            //     var cap = $(this);
            //     //console.log(cap.find('h3').text());
            //     var item = {
            //         period: cap.find('openli1').text(),
            //         number: cap.find('openli2').text(),
            //         time: cap.find('openli3').text(),
            //     }
            //     console.log(item);
            //     itemList.push(item);
            // });
            // console.info(itemList);

            //console.log('获取开奖历史号码:',lists.children('li'));
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        self.getLotteryInfo(self.nextAddr(), callback);
    });

    req.end();
}

function getNextOpenNumberTime() {
    var now = new Date();
    var url = "/Game/ShortIssues.aspx?time=" + urlencode(now) + "&type=" + "BEAB95B0BAA1242CF042D1659686F54B" + "&iType=Ssc";

    //var url = `/Game/GetNum.aspx?iType=3&time=" +${urlencode(new Date())}`;
    // var options = `{host:${host},port:${port},path:${url},method:'get'}`;
    var req = http.request({
        host: host,
        port: 80,
        path: url,
        method: 'get'
    }, function (res) {
        if (res.statusCode != 200) {
            console.log('获取开奖号码失败');
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

            // const $ = cheerio.load(numberData);
            // console.log($.html('.openul'));

            //170605048$2017-06-05 13:59:00$

            var reg1 = /(\d+)\$(.+)\$$/i;
            ;
            var index = numberData.lastIndexOf('$');
            var filt = numberData.substring(0, index);
            var period = filt.substring(0, filt.lastIndexOf('$'));
            var time = filt.substring(filt.indexOf('$') + 1);
            // var result = numberData.match(reg1);

            console.log('下期开奖 期数:', period, '时间:', time);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        self.getLotteryInfo(self.nextAddr(), callback);
    });

    req.end();
}


function getLottery() {

    setInterval(function () {
        // getServerTime();
        // getOpenNumber();
        getOpenNumbers();
        // getNextOpenNumberTime();
    }, 1000);
}

getLottery();
