const httpclient = require('../app/net/httpclient');
const OmeloClient = require('./omelo-wsclient/omeloClient');

// const GAME_HOST = 'http://116.31.100.75:4002';
const GAME_HOST = 'http://127.0.0.1:4002';
// const AUDIO_HOST = 'http://116.31.100.75:3102';
const AUDIO_HOST = 'http://127.0.0.1:3102';
// const GATE_HOST = 'http://116.31.100.75:3002';
const GATE_HOST = 'http://127.0.0.1:3002';
// const GAME_IP = "116.31.100.75";
const GAME_IP = "127.0.0.1";
const GAME_PORT = 4003;

class SSCClient {
    constructor() {
        this._player = null;
        this._state = false;
        this._heartbeat = null;
        this._heartbeat_fail_count = 0;
        this._bets = new Map();
        this._client = new OmeloClient();
        this._client.on('io-error', this._sockeError.bind(this));
        this._listen();
    }

    _listen() {
        this._client.on('s_enter', this.onEnter.bind(this));
        this._client.on('s_leave', this.onLeave.bind(this));
        this._client.on('s_bet', this.onBet.bind(this));
        this._client.on('s_unBet', this.onUnBet.bind(this));
        this._client.on('s_chat', this.onChat.bind(this));
        this._client.on('s_countdown', this.onCountdown.bind(this));
        this._client.on('s_betResult', this.onBetResult.bind(this));
        this._client.on('s_openLottery', this.onOpenLottery.bind(this));
        this._client.on('s_broadcast', this.onBroadcast.bind(this));
    }

    onEnter(msg) {
        console.info('onEnter msg=', JSON.stringify(msg));
    }

    onLeave(msg) {
        console.info('onLeave msg=', JSON.stringify(msg));
    }

    onBet(msg) {
        console.info('onBet msg=', JSON.stringify(msg));
        this._bets.set(msg.data.id, msg);
    }

    onUnBet(msg) {
        console.info('onUnBet msg=', JSON.stringify(msg));
    }

    onChat(msg) {
        console.info('onChat msg=', JSON.stringify(msg));
    }

    onCountdown(msg) {
        console.info('onCountdown msg=', JSON.stringify(msg));
    }

    onBetResult(msg) {
        console.info('onBetResult msg=', JSON.stringify(msg));
    }

    onOpenLottery(msg) {
        console.info('onOpenLottery msg=', JSON.stringify(msg));
    }

    onBroadcast(msg) {
        console.info('onBroadcast msg=', JSON.stringify(msg));
    }

    /**
     * 注册
     * @param data
     * @returns {Promise<void>}
     */
    async register(data) {

        let resp = await httpclient.postData(data, GATE_HOST + '/gate/clientApi/register');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('registe err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('registe ok');
            console.log(resp.data);
            this._player = resp.data;
        }

    }

    /**
     * 登录
     * @param data
     * @returns {Promise<void>}
     */
    async login(data) {
        let resp = await httpclient.postData(data, GATE_HOST + '/gate/clientApi/login');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('login err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('login ok');
            console.log(resp.data);
            this._player = resp.data;
        }
    }

    /**
     * 转盘抽奖   TODO NEW
     * @param data
     * @returns {Promise<void>}
     */
    async getDraw(data) {

        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/turntable_draw');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('getDraw err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('getDraw ok');
            console.log(resp.data);
        }
    }

    async recharge(data) {

        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/recharge');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('recharge err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('recharge ok');
            console.log(resp.data);
        }
    }

    async cash(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/cash');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('cash err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('cash ok');
            console.log(resp.data);
        }
    }

    async getBankLog(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/getBankLog');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('getBankLog err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('getBankLog ok');
            console.log(resp.data);
        }
    }

    //TODO NEW 获取系统公告
    async getBroadcast(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/getBroadcast');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('getBroadcast err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('getBroadcast ok');
            console.log(resp.data);
        }
    }


    //TODO NEW 后台设置系统公告
    async setBroadcast(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/setBroadcast');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('setBroadcast err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('setBroadcast ok');
            console.log(resp.data);
        }
    }

    async setInitMoney(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/setInitMoney');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('setInitMoney err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('setInitMoney ok');
            console.log(resp.data);
        }
    }

    //TODO NEW 获取反水记录
    async getMyDefection(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/getMyDefection');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('getMyDefection err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('getMyDefection ok');
            console.log(resp.data);
        }
    }

    //TODO NEW 获取拉手分成
    async getMyRebate(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/getMyRebate');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('getMyRebate err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('getMyRebate ok');
            console.log(resp.data);
        }
    }

    async bindPayInfo(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/bindPayInfo');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('bindPayInfo err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('bindPayInfo ok');
            console.log(resp.data);
        }
    }

    async setOrderState(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/setOrderState');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('setOrderState err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('setOrderState ok');
            console.log(resp.data);
        }
    }

    async getGMContactInfo(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/getGMContactInfo');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('getGMContactInfo err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('getGMContactInfo ok');
            console.log(resp.data);
        }
    }

    async setPlayerInfo(data) {
        let resp = await httpclient.postData(data, GAME_HOST + '/game/clientApi/setPlayerInfo');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('setPlayerInfo err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('setPlayerInfo ok');
            console.log(resp.data);
        }
    }

    async sendHeartbeat() {
        try {
            if (this._state) {
                await this._request('game.sscHandler.c_heartbeat', {});
                this._heartbeat_fail_count = 0;
            }
        } catch (err) {
            this._heartbeat_fail_count++;
            // console.error('sendHeartbeat fail count:', this._heartbeat_fail_count, 'err:', err);
        }
    }

    async enterGame(mainType, subType) {
        try {
            await this._handshake(GAME_IP, GAME_PORT);
            let resp = await this._request('game.sscHandler.c_enter', {
                token: this._player.token,
                mainType: mainType,
                subType: subType
            });

            this._client.on('disconnect', this._offline.bind(this));
            // this._heartbeat = setInterval(this.sendHeartbeat.bind(this), 10000);
            this._state = true;
            console.info('enterGame resp=', resp);
        } catch (err) {
            this._state = false;
            console.error('加入游戏失败，err:', err);
            console.error('加入游戏失败,自动重连中...');
            setTimeout(this.enterGame.bind(this), 10000);
        }

    }

    async leaveGame() {
        this._state = false;
        clearInterval(this._heartbeat);
        let resp = await this._request('game.sscHandler.c_leave', {});
        console.info('leaveGame resp=', resp);
    }

    async bet(data) {
        try {
            let resp = await this._request('game.sscHandler.c_bet', {betData: data});
            console.info('bet ok resp=', resp);
        } catch (err) {
            console.info('bet fail err=', err);
        }

    }

    async unBet(id) {
        try {
            let resp = await this._request('game.sscHandler.c_unBet', {id: id});
            console.info('unBet ok resp=', resp);
        } catch (err) {
            console.info('unBet fail err=', err);
        }

    }

    async senChat(data) {
        try {
            let resp = await this._request('game.sscHandler.c_chat', data);
            console.info('senChat ok resp=', resp);
        } catch (err) {
            console.info('senChat fail err=', err);
        }

    }

    async myBetResult(data) {
        try {
            let resp = await this._request('game.sscHandler.c_myBetResult', data);
            console.info('myBetResult ok resp=', resp);
        } catch (err) {
            console.info('myBetResult fail err=', err);
        }

    }


    async getChats() {
        try {
            let resp = await this._request('game.sscHandler.c_getChats', {
                skip: 0,
                limit: 10
            });
            console.info('getChats ok resp=', resp);
        } catch (err) {
            console.info('getChats fail err=', err);
        }

    }

    async getBets() {
        try {
            let resp = await this._request('game.sscHandler.c_getBets', {
                skip: 0,
                limit: 10
            });
            console.info('getBets ok resp=', resp);
        } catch (err) {
            console.info('getBets fail err=', err);
        }

    }

    async getLotterys() {
        try {
            let resp = await this._request('game.sscHandler.c_getLotterys', {
                skip: 0,
                limit: 10
            });
            console.info('getLotterys ok resp=', resp);
        } catch (err) {
            console.info('getLotterys fail err=', err);
        }

    }

    //
    async myBetOrder() {
        try {
            let resp = await this._request('game.sscHandler.c_myBetOrder', {});
            console.info('c_myBetOrder ok resp=', resp);
        } catch (err) {
            console.info('c_myBetOrder fail err=', err);
        }
    }

    async uploadAudo() {
        let resp = await httpclient.postData({}, AUDIO_HOST + '/resource/clientApi/uploadAudio');
        resp = JSON.parse(resp);
        if (resp.error) {
            console.log('uploadAudo err=' + JSON.stringify(resp.error));
            console.log(resp.error);
        } else {
            console.log('uploadAudo ok');
            console.log(resp.data);
        }
    }

    /**
     * 网络io错误
     * @param {异常原因} reason
     */
    _sockeError(reason) {
        this._client.removeAllListeners('disconnect');
        console.error('网络IO错误,自动重连中...', reason);
        this._state = false;
        setTimeout(this.enterGame().bind(this), 10000);
    }

    /**
     * 用户会话断开
     * @param {断开原因} reason
     */
    _offline(reason) {
        this._client.removeAllListeners('disconnect');
        console.error('会话断开,自动重连中disconnect...');
        this._state = false;
        setTimeout(this.enterGame.bind(this), 10000);
    }

    /**
     * websocket握手
     * @param {ip地址} host
     * @param {端口} port
     */
    _handshake(host, port) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self._client.init({
                host: host,
                port: port,
                log: true
            }, function (err) {
                if (err) {
                    console.error('握手失败:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * 发送用户请求
     * @param {路由} route
     * @param {请求body} msg
     */
    _request(route, msg) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self._client.request(route, msg, function (resp) {
                // console.info('resp = ',JSON.stringify(resp));
                if (resp && resp.code === 500) {
                    reject({
                        code: 500,
                        desc: '服务器内部错误'
                    });
                    return;
                }

                if (resp.error && resp.error.code != 200) {
                    reject(resp);
                } else {
                    resolve(resp);
                }
            });
        });
    }
}

async function main() {
    let client = new SSCClient();
    await client.register({
        username: '18612432382',
        password: '123654',
            code: '1243',
        nickname: '咸鱼也有梦11',
    });
return;
//
    console.time('111');

    await client.login({
        username: '18612432395',
        password: '123654'
    });


   // await client.getBroadcast({token: client._player.token, mainType: 'ssc', subType: 'hall'});
    //后台GM调用
    // await client.setBroadcast({
    //     mainType: 'ssc',
    //     subType: 'hall',
    //     token: '9be0bcbe4cbd4e6d9f634360146658f1ac676fdff10b802475b003ee8f2f8d69',
    //     content: '大家来投注吧！！！'
    // });

    await client.setInitMoney({
        mainType: 'ssc',
        subType: 'hall',
        token: '9be0bcbe4cbd4e6d9f634360146658f1ac676fdff10b802475b003ee8f2f8d69',
        money: 50000
    });
    return;
    await client.getMyDefection({token: client._player.token, mainType: 'ssc', subType: 'hall', skip: 0, limit: 5});
    await client.getMyRebate({token: client._player.token, mainType: 'ssc', subType: 'hall', skip: 0, limit: 5});
// return

    // await client.getDraw({token:client._player.token, mainType:'ssc', subType:'turntable'});
    //
    // //TODO NEW 获取账单信息
    // await client.getBankLog({token:client._player.token, mainType:'ssc', subType:'hall', skip:0, limit:5});
    // //绑定支付信息
    //
    // //1:支付宝，1：微信，2：银行卡
    // await client.bindPayInfo({token:client._player.token, mainType:'ssc', subType:'hall', type:1, info:{payAccount:'linyngfly@126.com',name:'林洋'}});

// return;

    // await client.recharge({token: client._player.token, mainType: 'ssc', subType: 'hall', money: 10000});
    // await client.cash({token: client._player.token, mainType: 'ssc', subType: 'hall', money: 20000});
    // await client.getGMContactInfo({token: client._player.token, mainType: 'ssc', subType: 'hall'});
    //
    // //TODO NEW 修改玩家信息
    // await client.setPlayerInfo({token: client._player.token, mainType: 'ssc', subType: 'hall', fields:{
    //     nickname:'起个新名字试试', //修改昵称
    //     figure_url:'2', //修改头像
    // }});

    //TODO NEW php后台调用，确认或者撤销订单
    // await client.setOrderState({
    //     mainType: 'ssc',
    //     subType: 'hall',
    //     token: '55f4e909be2de310fd1b203a5a1a29372fd1cd3d6d7dbbf1202c43ba18997873',
    //     state: 3,
    //     operator: 'admin',
    //     id: 2
    // });

    // return;

    // await client.enterGame('ssc', 'canada28');
    await client.enterGame('ssc', 'lucky28');
    //
    // //TODO NEW 获取投个人注历史
    // await client.myBetResult({
    //     skip: 0,
    //     limit: 20,
    // });

    await client.bet('11.100');
    await client.bet('12.100');
    await client.bet('13.100');
    await client.bet('4.100');
    await client.bet('5.100');
    await client.bet('16.100');
    await client.bet('7.100');
    await client.bet('8.100');
    await client.bet('19.100');
    await client.bet('10.100');
    await client.bet('12.100');
    await client.bet('16.100');
    await client.bet('27.100');
    // await client.bet('大双100');
    // await client.bet('大单100');
    // await client.bet('小50');
    // await client.bet('小双50');
    // await client.bet('豹子100');
    // await client.bet('对子100');


    // await client.senChat({
    //     type: 0,
    //     content: '大家来投豹子好吗',
    //     tid: -1
    // });
    //
    // await client.senChat({
    //     type: 1,
    //     content: '1',
    //     tid: -1
    // });
    //
    // await client.senChat({
    //     type: 2,
    //     content: 'http://www.baidu.com',
    //     tid: -1
    // });
    //
    // await client.getBets();
    // await client.getChats();
    // await client.getLotterys();
    //
    // await client.myBetOrder();
    console.timeEnd('111');
    // await client.myBets();
    // await client.bet('大单龙100');
    // console.error(1111);
    // await client.unBet(2);
    // console.error(2222);
    // await client.leaveGame();
}

main();

