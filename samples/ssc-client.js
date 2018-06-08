const httpclient = require('../app/net/httpclient');
const OmeloClient = require('./omelo-wsclient/omeloClient');

// const GATE_HOST = 'http://39.108.166.240:3002';
const GATE_HOST = 'http://127.0.0.1:3002';
// const GAME_IP = "39.108.166.240";
const GAME_IP = "127.0.0.1";
const GAME_PORT = 4003;

class SSCClient{
    constructor(){
        this._player = null;
        this._state = false;
        this._heartbeat = null;
        this._heartbeat_fail_count = 0;
        this._bets = new Map();
        this._client = new OmeloClient();
        this._client.on('io-error', this._sockeError.bind(this));
        this._listen();
    }

    _listen(){
        this._client.on('s_bet', this.onBet.bind(this));
        this._client.on('s_unBet', this.onUnBet.bind(this));
        this._client.on('s_chat', this.onChat.bind(this));
        this._client.on('s_countdown', this.onCountdown.bind(this));
        this._client.on('s_betResult', this.onBetResult.bind(this));
        this._client.on('s_openLottery', this.onOpenLottery.bind(this));
    }

    onBet(msg){
        console.info('onBet msg=', JSON.stringify(msg));
        this._bets.set(msg.data.id, msg);
    }

    onUnBet(msg){
        console.info('onUnBet msg=', JSON.stringify(msg));
    }

    onChat(msg){
        console.info('onChat msg=', JSON.stringify(msg));
    }

    onCountdown(msg){
        // console.info('onCountdown msg=', JSON.stringify(msg));
    }

    onBetResult(msg){
        console.info('onBetResult msg=', JSON.stringify(msg));
    }

    onOpenLottery(msg){
        console.info('onOpenLottery msg=', JSON.stringify(msg));
    }

    /**
     * 注册
     * @param data
     * @returns {Promise<void>}
     */
    async register(data){

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
        try{
            await this._handshake(GAME_IP, GAME_PORT);
            let resp = await this._request('game.sscHandler.c_enter', {
                token: this._player.token,
                mainType:mainType,
                subType:subType
            });

            this._client.on('disconnect', this._offline.bind(this));
            // this._heartbeat = setInterval(this.sendHeartbeat.bind(this), 10000);
            this._state = true;
            console.info('enterGame resp=', resp);
        }catch (err) {
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

    async bet(data){
        try {
            let resp = await this._request('game.sscHandler.c_bet', {betData:data});
            console.info('bet ok resp=', resp);
        }catch (err) {
            console.info('bet fail err=', err);
        }

    }

    async unBet(id){
        try{
            let resp = await this._request('game.sscHandler.c_unBet', {id:id});
            console.info('unBet ok resp=', resp);
        }catch (err) {
            console.info('unBet fail err=', err);
        }

    }

    async senChat(data){
        try{
            let resp = await this._request('game.sscHandler.c_chat', data);
            console.info('senChat ok resp=', resp);
        }catch (err) {
            console.info('senChat fail err=', err);
        }

    }

    // async myBets(){
    //     try{
    //         let resp = await this._request('game.sscHandler.c_myBets', {});
    //         console.info('myBets ok resp=', resp);
    //     }catch (err) {
    //         console.info('myBets fail err=', err);
    //     }
    //
    // }

    //TODO NEW 获取最近聊天记录
    async getChats(){
        try{
            let resp = await this._request('game.sscHandler.c_getChats', {
                skip:0,
                limit:10
            });
            console.info('getChats ok resp=', resp);
        }catch (err) {
            console.info('getChats fail err=', err);
        }

    }
    //TODO NEW 获取最近的投注记录
    async getBets(){
        try{
            let resp = await this._request('game.sscHandler.c_getBets', {
                skip:0,
                limit:10
            });
            console.info('getBets ok resp=', resp);
        }catch (err) {
            console.info('getBets fail err=', err);
        }

    }
    //TODO NEW 获取最近几期的开奖记录
    async getLotterys(){
        try{
            let resp = await this._request('game.sscHandler.c_getLotterys', {
                skip:0,
                limit:10
            });
            console.info('getLotterys ok resp=', resp);
        }catch (err) {
            console.info('getLotterys fail err=', err);
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
                }else {
                    resolve(resp);
                }
            });
        });
    }
}

async function main() {
    let client = new SSCClient();
    // await client.register({
    //     username: '18602432393',
    //     password: '123654',
    //     code: '1243',
    //     nickname: '咸鱼也有梦',
    // });

    await client.login({
        username:'18602432393',
        password: '123654'
    });

    await client.enterGame('ssc', 'lucky28');
    console.error(3333);
    await client.bet('大100');
    await client.bet('大双100');
    await client.bet('大单100');
    await client.bet('小50');
    await client.bet('小双50');
    await client.bet('豹子10000');
    await client.bet('对子100');

    await client.senChat({
        type:0,
        content:'大家来投豹子好吗',
        tid: -1
    });

    await client.senChat({
        type:1,
        content:'1',
        tid: -1
    });

    await client.senChat({
        type:2,
        content:'http://www.baidu.com',
        tid: -1
    });

    await client.getBets();
    await client.getChats();
    await client.getLotterys();

    // await client.myBets();
    // await client.bet('大单龙100');
    // console.error(1111);
    // await client.unBet(2);
    // console.error(2222);
    // await client.leaveGame();
}

main();

