const crypto = require("crypto");
const _ = require('lodash');

let utils = module.exports;

// 返回当前的时间戳，单位是秒
utils.timestamp = function timestamp() {
    let date = new Date();
    let time = Date.parse(date); // 1970到现在过去的毫秒数
    time = time / 1000;
    return time;
};

// 时间戳是秒，Date是毫秒
utils.timestamp2date = function timestamp2date(time) {
    let date = new Date();
    date.setTime(time * 1000); //

    return [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
};

// "2017-06-28 18:00:00"
utils.date2timestamp = function date2timestamp(strtime) {
    let date = new Date(strtime.replace(/-/g, '/'));
    let time = Date.parse(date);
    return (time / 1000);
};

// 今天00:00:00的时间戳
utils.timestamp_today = function timestamp_today() {
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    let time = Date.parse(date);
    return time;
};

/**
 * 获取昨日0点时间戳
 * @returns {number}
 */
utils.timestamp_yesterday = function timestamp_yesterday() {
    let time = utils.timestamp_today();
    return (time - 24 * 60 * 60 * 1000);
};

utils.base64_encode = function base64_encode(content) {
    let buf = new Buffer(content);
    let base64 = buf.toString("base64");

    return base64;
};

utils.base64_decode = function base64_decode(base64_str) {
    let buf = new Buffer(base64_str, "base64");
    return buf;
};

utils.md5 = function md5(data) {
    let md5 = crypto.createHash("md5");
    md5.update(data);
    return md5.digest('hex');
};

utils.sha1 = function sha1(data) {
    let sha1 = crypto.createHash("sha1");
    sha1.update(data);
    return sha1.digest('hex');
};

// control letiable of func "myPrint"
let isPrintFlag = false;

/**
 * Check and invoke callback function
 */
utils.invokeCallback = function (cb) {
    if (!!cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

utils.size = function (obj) {
    if (!obj) {
        return 0;
    }

    let size = 0;
    for (let f in obj) {
        if (obj.hasOwnProperty(f)) {
            size++;
        }
    }

    return size;
};

// print the file name and the line number ~ begin
function getStack() {
    let orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };
    let err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    let stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
}

function getFileName(stack) {
    return stack[1].getFileName();
}

function getLineNumber(stack) {
    return stack[1].getLineNumber();
}

utils.myPrint = function () {
    if (isPrintFlag) {
        let len = arguments.length;
        if (len <= 0) {
            return;
        }
        let stack = getStack();
        let aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
        for (let i = 0; i < len; ++i) {
            aimStr += arguments[i] + ' ';
        }
        logger.info('\n' + aimStr);
    }
};
// print the file name and the line number ~ end


utils.random_string = function (len) {
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';

    let maxPos = $chars.length;
    let str = '';
    for (let i = 0; i < len; i++) {
        str += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
};

utils.random_int_str = function (len) {
    let $chars = '0123456789';

    let maxPos = $chars.length;
    let str = '';
    for (let i = 0; i < len; i++) {
        str += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
};

utils.random_int = function (begin, end) {
    let num = begin + Math.random() * (end - begin + 1);
    num = Math.floor(num);
    if (num > end) {
        num = end;
    }
    return num;
};

utils.generateSessionToken = function (uid) {
    return uid + '_' + crypto.randomBytes(24).toString('hex');
};

Object.cloneDeep = (obj) => {
    return _.cloneDeep(obj);
};

// 格式化时间
Date.prototype.format = function (fmt = 'yyyy-MM-dd hh:mm:ss') {
    let o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
                ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

// 计算UTC毫秒
Date.prototype.getUTCFullMilliseconds = function () {
    return this.getTime() - this.getTimezoneOffset() * 60000;
};

// 计算UTC天数
Date.prototype.getDays = function () {
    return Math.floor(this.getUTCFullMilliseconds() / 86400000);
};

// 计算UTC周数
Date.prototype.getWeeks = function () {
    return Math.ceil((4 + this.getDays()) / 7);
};

// 获取距离refTime经过的天数, refTime(时间戳|2013-01-01|2013-01-01 00:00:00)
Date.prototype.getDayPassed = function (refTime) {
    if (isNaN(refTime)) {
        if (refTime.length > 10) {
            refTime = refTime.substr(0, 10);
        }
        refTime = new Date(refTime + ' 00:00:00');
    } else {
        refTime = new Date(refTime * 1000);
    }

    refTime.setHours(0);
    refTime.setMinutes(0);
    refTime.setSeconds(0);

    return Math.ceil((this - refTime) / 1000 / 86400);
};

// 计算UTC时间戳
Date.prototype.getUTCStamp = function () {
    return Math.floor(this.getUTCFullMilliseconds() / 1000);
};

// 计算本地时间戳
Date.prototype.getStamp = function () {
    return Math.floor(this.getTime() / 1000);
};

// 设置当天的时间,支持小数,比如setFloatTime(10.5, 0, 0)即为设置为10点半
Date.prototype.setFloatTime = function (hour, minute, second) {
    let totalMinutes = Math.ceil(hour * 3600 + minute * 60 + second);
    hour = Math.floor(totalMinutes / 3600);
    totalMinutes = totalMinutes % 3600;
    minute = Math.floor(totalMinutes / 60);
    second = totalMinutes % 60;

    this.setHours(hour);
    this.setMinutes(minute);
    this.setSeconds(second);
    return this;
};

// 当天0点
Date.prototype.zeroTime = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

/**
 * 周一0点
 */
Date.prototype.zeroWeek = function () {
    let weekDay = this.getDay();
    if (weekDay == 0) {
        weekDay = 7;
    }

    return this.zeroTime().relativeTime((1 - weekDay) * 24 * 60 * 60);
};

/**
 * 月初零点
 */
Date.prototype.zeroMonth = function () {
    return new Date(this.getFullYear(), this.getMonth(), 1);
};

// 相对时间(秒)
Date.prototype.relativeTime = function (seconds) {
    return new Date(this.getTime() + seconds * 1000);
};

// 标准格式化字符串
Date.prototype.stdFormatedString = function () {
    return this.format('yyyy-MM-dd hh:mm:ss');
};

// 以数字形式表示的年月日
Date.prototype.getDateNumber = function () {
    return this.getFullYear() * 10000 + (this.getMonth() + 1) * 100 + this.getDate();
};

// 以数字形式表示的年月
Date.prototype.getMonthNumber = function () {
    return this.getFullYear() * 100 + (this.getMonth() + 1);
};

Date.prototype.getTodaySeconds = function () {
    return this.getHours() * 3600 + this.getMinutes() * 60 + this.getSeconds();
};

Date.getDayPassed = function (refTime) {
    return (new Date()).getDayPassed(refTime);
};

Date.getStamp = function () {
    return (new Date()).getStamp();
};

Date.createFromStamp = function (stamp) {
    return new Date(stamp * 1000);
};

Date.stdFormatedString = function () {
    return (new Date()).stdFormatedString();
};

/**
 * 根据UTC天数计算UTC周数
 * @param day
 * @returns {number}
 */
Date.calcWeeksFromDays = function (day) {
    return Math.ceil((4 + day) / 7);
};


Date.getTimeFromTimestamp = function (timestamp) {
    let date = new Date(timestamp);
    return date.format("yyyy-MM-dd hh:mm:ss");
};



