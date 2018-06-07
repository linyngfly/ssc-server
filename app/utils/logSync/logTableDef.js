module.exports = {

    TYPE: {
        TBL_LOTTERY: 1,
        TBL_MONEY_LOG: 2,
    },

    TABLE: {
        1: {
            name: 'tbl_lottery',
            field: ['period', 'identify', 'numbers', 'time', 'openResult'],
        },
        2:{
            name: 'tbl_money_log',
            field: ['uid', 'gain', 'cost', 'total','created_at', 'scene'],
        }
    }

};