class RpcHandler{
    static register(method, prototype, entry){
        prototype[method] = function (data, cb) {
            if(typeof data === 'function') cb = data;
            try{
                entry.rpc(method, data, function(err, result){
                    utils.invokeCallback(cb, err, result || {});
                });
            }catch (err) {
                utils.invokeCallback(cb, err);
            }
        };
    }
}

module.exports = RpcHandler;