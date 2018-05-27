const omelo = require('omelo');
const httpCfg = omelo.app.get('http');
const logicResponse = require('../../common/logicResponse');
class GateEntry{
    async getGate(data, ctx){
        let enable = ctx.protocol == 'https' ? true : false;
        let resource = httpCfg.resource[0];
        let gateInfo = {
            PROTOCOL : ctx.protocol,
            address: enable ?  resource.https.publicHost:
                resource.http.publicHost,
            port: enable ? resource.https.port : resource.http.port,
        };
        return logicResponse.ask(gateInfo);
    }
}

module.exports = new GateEntry();