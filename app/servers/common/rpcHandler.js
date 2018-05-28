class RpcHandler {
    static register(method, prototype, entry) {
        prototype[method] = async function (data, cb) {
            if (typeof data === 'function') {
                cb = data;
                data = {};
            }
            try {
                let resp = await entry.rpc(method, data);
                utils.invokeCallback(cb, err, resp || {});
            } catch (err) {
                utils.invokeCallback(cb, err);
            }
        };
    }
}

module.exports = RpcHandler;