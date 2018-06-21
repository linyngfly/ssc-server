const TBL_ID = {
    TBL_LOTTERY: 1,
    TBL_MONEY_LOG: 2,
    TBL_PLAYER_INCOME: 3,
    TBL_AGENT_INCOME: 4,
    TBL_SYS_MESSAGE: 5,
};

const TBL_DEF = {};
TBL_DEF[TBL_ID.TBL_LOTTERY] = {
    name: 'tbl_lottery',
    field: ['period', 'identify', 'numbers', 'time', 'openResult'],
};
TBL_DEF[TBL_ID.TBL_MONEY_LOG] = {
    name: 'tbl_money_log',
    field: ['uid', 'gain', 'cost', 'total', 'created_at', 'scene'],
};
TBL_DEF[TBL_ID.TBL_PLAYER_INCOME] = {
    name: 'tbl_player_income',
    field: ['uid', 'identify', 'betMoney', 'incomeMoney', 'defectionRate',
        'defectionMoney', 'winRate', 'periodCount', 'multiRate','satisfy', 'incomeTime'],
};
TBL_DEF[TBL_ID.TBL_AGENT_INCOME] = {
    name: 'tbl_agent_income',
    field: ['uid', 'identify', 'betMoney', 'incomeMoney', 'rebateRate',
        'rebateMoney', 'incomeTime'],
};
TBL_DEF[TBL_ID.TBL_SYS_MESSAGE] = {
    name: 'tbl_sys_message',
    field: ['publisher', 'content', 'created_at'],
};

module.exports = {
    TYPE: TBL_ID,
    TABLE: TBL_DEF
};