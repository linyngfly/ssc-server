const httpclient = require('../app/net/httpclient');
const OmeloClient = require('./omelo-wsclient/omeloClient');


const GATE_HOST = 'http://127.0.0.1:3002';
const GAME_IP = "127.0.0.1";
const GAME_PORT = 4003;

class SSCClient{
    constructor(){
        this._player = null;
        this._state = false;
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
    }

    onUnBet(msg){
        console.info('onUnBet msg=', JSON.stringify(msg));
    }

    onChat(msg){
        console.info('onChat msg=', JSON.stringify(msg));
    }

    onCountdown(msg){
        console.info('onCountdown msg=', JSON.stringify(msg));
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

    async enterGame(mainType, subType) {
        await this._handshake(GAME_IP, GAME_PORT);
        const route = "game.sscHandler.c_enter";
        let resp = await this._request(route, {
            token: this._player.token,
            mainType:mainType,
            subType:subType
        });

        console.info(resp);

    }

    leaveGame() {

    }

    /**
     * 网络io错误
     * @param {异常原因} reason
     */
    _sockeError(reason) {
        this._client.removeAllListeners('disconnect');
        logger.error('网络IO错误,自动重连中...', reason);
        this._state = false;
        setTimeout(this.joinGame.bind(this), 10000);
    }

    /**
     * 用户会话断开
     * @param {断开原因} reason
     */
    _offline(reason) {
        this._client.removeAllListeners('disconnect');
        logger.error('会话断开,自动重连中disconnect...', this._myUID);
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
                    logger.error('握手失败:', err);
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
                console.info('resp = ',JSON.stringify(resp));
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

    await client.enterGame('ssc', 'cqssc');

}

main();

