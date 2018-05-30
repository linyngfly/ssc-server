const listenApi = require('../../api/listenApi');
const {API, PREFIX} = require('../../api/game/gameClientApi');

module.exports = (router) => {
    listenApi(router, 'game', 'gameClientApi', API, PREFIX);
};