const httpclient = require('../app/net/httpclient');

async function register(data) {
    let resp = await httpclient.postData({}, host + path);
    console.log(resp);
}

const host = 'http://127.0.0.1:3002';
const path = '/gate/clientApi/login';
let req = {
    phone:'18603532232',
    code:'353221',
    nickname:'飞鱼的梦想',
    password:'123456'
};

register(req, host + path);

