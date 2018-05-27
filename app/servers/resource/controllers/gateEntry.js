const omelo = require('omelo');
const httpCfg = omelo.app.get('http');
const logicResponse = require('../../common/logicResponse');
class GateEntry{
    async version(){
        return logicResponse.ask({
            version:"1.0.3",
            time:"2017-09-01 10:00:34"
        });
    }
    async getGate(data, ctx){
        let enable = ctx.protocol == 'https' ? true : false;
        let resource = httpCfg.resource[0];
        let gateInfo = {
            protocol : ctx.protocol,
            address: enable ?  resource.https.publicHost:
                resource.http.publicHost,
            port: enable ? resource.https.port : resource.http.port,
        };
        return logicResponse.ask(gateInfo);
    }
}

module.exports = new GateEntry();