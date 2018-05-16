/**
 * Created by linyng on 2017/4/24.
 */

module.exports =  {
    updateBet:function(client, item, cb) {
        var sql = 'update Bets set uid = ? ,period = ? ,identify = ? ,betInfo = ?, state= ? ,betCount = ? ' +
            ',winCount = ?, betMoney = ?, winMoney = ?, betTypeInfo =?, betItems = ? where id = ?';
        var args = [item.playerId, item.period, item.identify, item.betInfo, item.state, item.betCount,
            item.winCount, item.betMoney, item.winMoney, JSON.stringify(item.betTypeInfo), JSON.stringify(item.betItems), item.id];

        client.query(sql, args, function(err, res) {
            if(err !== null) {
                console.error('write mysql Bets failed!　' + sql + ' ' + JSON.stringify(item) + ' stack:' + err.stack);
            }
            if(!!cb && typeof cb == 'function') {
                cb(!!err);
            }
        });
    }
};