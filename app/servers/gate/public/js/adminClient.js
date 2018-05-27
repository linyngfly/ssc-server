/**
 * Created by linyng on 17-5-16.
 */

var pomelo = window.pomelo;

var adminClient =function () {
    this.host = window.location.hostname;
    this.port = 3014;
    this.httpHost = location.href.replace(location.hash, '').substr(0, httpHost.lastIndexOf('/') + 1);
};

adminClient.prototype.invokeCallback = function (cb) {
    if (!!cb && typeof cb == 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

//登录游戏服务器
adminClient.prototype.login = function (username, password, cb) {
    if (!username) {
        this.invokeCallback(cb, '用户名不能为空', null);
        return;
    }

    if (!password) {
        this.invokeCallback(cb, '密码不能为空', null);
        return;
    }

    var self = this;
    $.post(this.httpHost + 'users/login', {username: username, password: password}, function (webRes) {
        if (webRes.code !== 200) {
            self.invokeCallback(cb, '用户名或者密码错误', null);
            return;
        }
        pomelo.init({
            host: self.host,
            port: 3014,
            log: true
        }, function () {
            pomelo.request('gate.gateHandler.connect', {
                uid: webRes.uid
            }, function (gateRes) {
                pomelo.disconnect();
                if (gateRes.result.code !== 200) {
                    self.invokeCallback(cb, '连接游戏网关失败', null);
                    return;
                }

                pomelo.init({
                    host: gateRes.data.host,
                    port: gateRes.data.port,
                    log: true
                }, function () {
                    pomelo.request('connector.entryHandler.adminLogin', {token: webRes.token}, function (res) {
                        if (res.result.code != 200) {
                            self.invokeCallback(cb, '登录游戏服务器失败', null);
                            return;
                        }
                        self.invokeCallback(cb, null, '登录游戏服务器成功');
                    });
                });
            });
        });
    });
};

// 充值
// money 充值金额
// status(2：确认，3：撤销)
// operator 操作人
adminClient.prototype.recharge = function (uid, money, operator, bankInfo, cb) {
    var self = this;
    pomelo.request('connector.entryHandler.recharge', {uid: uid, money: money, operator:operator, bankInfo:bankInfo}, function (res) {
        if (!res.result || res.result.code != 200) {
            self.invokeCallback(cb, res.result,null);
        }
        else {
            self.invokeCallback(cb, null,null);
        }
    });
};

// 提现确认
// orderId 重置订单
// status(2：确认，3：撤销)
// operator 操作人
// 充值到的账号信息
adminClient.prototype.cash = function (uid, orderId, status, operator, bankInfo, cb) {
    var self = this;
    pomelo.request('connector.entryHandler.cashHandler', {uid: uid, orderId: orderId, status:status, operator:operator, bankInfo:bankInfo}, function (res) {
        if (!res.result || res.result.code != 200) {
            self.invokeCallback(cb, res.result);
        }
        else {
            self.invokeCallback(cb, null,null);
        }
    });
};


// 系统参数配置
adminClient.prototype.setConfig = function (configs,cb) {
    var self = this;
    pomelo.request('connector.entryHandler.setConfig', {configs: configs}, function (res) {
        if (!res.result || res.result.code != 200) {
            self.invokeCallback(cb, res.result);
        }
        else {
            self.invokeCallback(cb, null,null);
        }
    });
};

// ctrl{
//     code:0, //0:禁言 1:激活
//     operate:true
// }

adminClient.prototype.playerCtrl = function (uid, ctrl, cb) {
    var self = this;
    pomelo.request('connector.entryHandler.playerCtrl', {uid: uid, ctrl:ctrl}, function (res) {
        if (!res.result || res.result.code != 200) {
            self.invokeCallback(cb, res.result);
        }
        else {
            self.invokeCallback(cb, null,null);
        }
    });
};

// 收动开奖
// period 彩票期数20170620108
// 开奖号码[1,3,5,1,8]
adminClient.prototype.openLottery = function (period, numbers, cb) {
    var self = this;
    pomelo.request('connector.entryHandler.backendOpenCode', {period: period, numbers:numbers}, function (res) {
        if (!res.result || res.result.code != 200) {
            self.invokeCallback(cb, res.result);
        }
        else {
            self.invokeCallback(cb, null,null);
        }
    });

};

window.adminClient = adminClient;

