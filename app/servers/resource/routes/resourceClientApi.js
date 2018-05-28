const listenApi = require('../../api/listenApi');
const {API,PREFIX} = require('../../api/resource/resourceClientApi');

module.exports = (router) => {
    listenApi(router, 'resource', 'resourceClientApi', API, PREFIX);
};