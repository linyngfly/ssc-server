const listenApi = require('../../api/listenApi');
const {apiCfgs,PREFIX} = require('../../api/resource/resourceClientApiConfig');

module.exports = (router) => {
    listenApi(router, 'resource', 'resourceClientApiConfig', apiCfgs, PREFIX);
};