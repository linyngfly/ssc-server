

class Hall{
    async start(){
        logger.error('Hall start');
    }

    async stop(){
        logger.error('Hall stop');
    }

    async recharge(data){
        let account = data.account;
        await mysqlConnector.query('INSERT INTO `tbl_order` (`uid`, `num`, `type`, `bankInfo`,`created_at`,`state`) VALUES ()', [account.uid, ]);
    }

    async cash(data){


    }
}

module.exports = Hall;