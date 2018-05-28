const listenApi = require('../../api/listenApi');
const {API,PREFIX} = require('../../api/gate/gateClientApi');

module.exports = (router) => {
    listenApi(router, 'gate', 'gateClientApi', API, PREFIX);
};