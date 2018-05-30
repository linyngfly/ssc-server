const http = require('http');
const https = require('https');
const querystring = require('querystring');
const URL = require('url');
const ERROR_OBJ = require('../consts/error_code').ERROR_OBJ;

module.exports.postData = _postData;
module.exports.getData = _getData;
module.exports.get = _get;

function _postData(data, url) {
    // let postData = querystring.stringify(data);
    let postData = JSON.stringify(data);
    let fields = URL.parse(url);
    let enableHttps = fields.protocol === 'https:';
    const options = {
        method: "POST",
        host: fields.hostname,
        port: fields.port,
        path: fields.path,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    let net = enableHttps ? https : http;
    return new Promise(function (resolve, reject) {
        let req = net.request(options, function (res) {
            res.setEncoding('utf-8');
            let response = "";
            res.on('data', (chunk) => {
                response += chunk;
            });
            res.on('end', () => {
                resolve(response);
            });
        });
        req.on('error', function (err) {
            logger.error('http post error=', err);
            reject(ERROR_OBJ.NETWORK_ERROR);
        });
        req.write(postData);
        req.end();
    });
}

function _getData(url) {
    let fields = URL.parse(url);
    const options = {
        method: "GET",
        host: fields.hostname,
        port: fields.port,
        path: fields.path,
    };
    return _get(options, fields.protocol === 'https:');
}

function _get(options, isHttps = false){
    let net = isHttps ? https : http;
    return new Promise(function (resolve, reject) {
        let req = net.request(options, function (res) {
            if(res.statusCode != 200){
                logger.error('http请求失败，statusCode=', res.statusCode);
                reject(ERROR_OBJ.NETWORK_ERROR);
                return;
            }

            let bufCache = null;
            res.on('data', function (chunk) {
                if (!bufCache) {
                    bufCache = Buffer.from(chunk);
                } else {
                    bufCache = Buffer.concat([bufCache, chunk], bufCache.byteLength + chunk.byteLength);
                }
            });
            res.on('end', function () {
                resolve(bufCache);
            });
        });

        req.on('error', function (err) {
            logger.error('http get error=', err);
            reject(ERROR_OBJ.NETWORK_ERROR);
        });
        req.end();
    });
}

