CREATE SCHEMA  IF NOT EXISTS `lottery`;
USE `lottery`;
ALTER SCHEMA `lottery`  DEFAULT COLLATE utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table User(用户表)
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `user` (
  `uid` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '登录名',
  `password` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '登录密码',
  `phone` varchar(11) COLLATE utf8_unicode_ci NOT NULL COMMENT '电话',
  `email`  varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `from` varchar(25) COLLATE utf8_unicode_ci NOT NULL COMMENT '登录来源',
  `regTime` bigint(20) unsigned NOT NULL COMMENT '注册时间',
  `inviter` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '邀请人',
  `active` tinyint(3) unsigned DEFAULT '0' COMMENT '是否激活',
  `forbidTalk` tinyint(3) unsigned DEFAULT '0' COMMENT '玩家禁言',
  `friends` json DEFAULT NULL COMMENT '朋友列表',
  `role` smallint(6) unsigned NOT NULL COMMENT '0:玩家,1:一级代理商,2:二级代理商,3:体验用户',
  `roleName` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '角色名称',
  `imageId` smallint(6) unsigned DEFAULT '1' COMMENT '头像id(1~6)',
  `rank` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '荣誉称号',
  `pinCode` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '取款密码',
  `accountAmount` DECIMAL(20,2) DEFAULT 0 COMMENT '账户金额',
  `level` smallint(6) unsigned DEFAULT 1 COMMENT '等级(1~10)',
  `experience` smallint(11) unsigned DEFAULT 0 COMMENT '经验值',
  `loginCount` smallint(6) unsigned DEFAULT 0 COMMENT '登录次数',
  `lastOnlineTime` bigint(20) unsigned DEFAULT NULL COMMENT '最后在线时间',
  `ext` json DEFAULT NULL COMMENT '扩展数据',
  `state` tinyint(3) unsigned DEFAULT '0' COMMENT '在线状态',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `phone_UNIQUE` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


# ------------------------------------------------------------
# Dump of table Bank(用户银行信息)
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bank`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) unsigned NOT NULL COMMENT '用户ID',
  `address` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '开户行地址',
  `username` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '户名',
  `cardNO` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '银行卡号',
  `weixin` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '微信',
  `zhifubao` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '支付宝',
  `bindTime` bigint(20) unsigned NOT NULL COMMENT '绑卡时间',
  PRIMARY KEY (`id`),
  FOREIGN KEY(`uid`) REFERENCES User(`id`),
  UNIQUE KEY `uid_UNIQUE` (`uid`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table BettingInformation(用户投注信息)
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bets_log`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) unsigned NOT NULL COMMENT '用户ID',
  `period` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '期数',
  `identify` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '标志',
  `betInfo` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '投注信息{type:0,value:0}',
  `state` smallint(6) unsigned NOT NULL COMMENT '0待开奖，1 撤销，2 赢 3输',
  `betCount` smallint(6) unsigned NOT NULL COMMENT '投注数',
  `winCount` smallint(6) unsigned NOT NULL COMMENT '投赢注数',
  `betMoney` DECIMAL(20,2) unsigned NOT NULL COMMENT '投注金额',
  `winMoney` DECIMAL(20,2) unsigned NOT NULL COMMENT '收益金额',
  `betTime` bigint(20) unsigned NOT NULL COMMENT '投注时间',
  `betTypeInfo` json NOT NULL COMMENT '投注类型信息',
  `betItems` json NOT NULL COMMENT '投注条目',
  PRIMARY KEY (`id`),
  FOREIGN KEY(`uid`) REFERENCES User(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# ------------------------------------------------------------
# Dump of table Lottery(开奖历史)
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `lottery_log`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `period` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '期数',
  `identify` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '标志',
  `numbers` varchar(10) COLLATE utf8_unicode_ci NOT NULL COMMENT '开奖结果',
  `openTime` bigint(20) unsigned NOT NULL COMMENT '开奖时间',
  `parseResult` json NOT NULL COMMENT '开奖分析结果',
   PRIMARY KEY (`id`),
   UNIQUE KEY `period_UNIQUE` (`period`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table PlayerIncome(玩家投注盈亏表)
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `player_income`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) unsigned NOT NULL COMMENT '用户ID',
  `betMoney` bigint(20) unsigned NOT NULL COMMENT '投注金额',
  `incomeMoney` bigint(20) NOT NULL COMMENT '盈亏金额',
  `defection` DECIMAL(20,2) NOT NULL COMMENT '反水金額',
  `defectionRate` FLOAT(6,2) NOT NULL COMMENT '反水比例',
  `winRate` FLOAT(6,2) NOT NULL COMMENT '勝率',
  `incomeTime` bigint(20) unsigned NOT NULL COMMENT '反水日期',
   PRIMARY KEY (`id`),
   FOREIGN KEY(`uid`) REFERENCES User(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# alter table AgentIncome add upperRebateRate FLOAT(6,2) NOT NULL COMMENT '上级分成比例';
# alter table AgentIncome add upperRebateMoney DECIMAL(20,2) NOT NULL COMMENT '上级分成金额';

# ------------------------------------------------------------
# Dump of table AgentIncome(代理投注盈亏表)
# ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `agent_income`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) unsigned NOT NULL COMMENT '用户ID',
  `betMoney` bigint(20) unsigned NOT NULL COMMENT '投注金额',
  `incomeMoney` bigint(20) NOT NULL COMMENT '盈亏金额',
  `rebateRate` FLOAT(6,2) NOT NULL COMMENT '分成比例',
  `rebateMoney` DECIMAL(20,2) NOT NULL COMMENT '分成金额',
  `upperRebateRate` FLOAT(6,2) NOT NULL COMMENT '上级分成比例',
  `upperRebateMoney` DECIMAL(20,2) NOT NULL COMMENT '上级分成金额',
  `incomeTime` bigint(20) unsigned NOT NULL COMMENT '分成日期',
   PRIMARY KEY (`id`),
   FOREIGN KEY(`uid`) REFERENCES User(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table config(系统配置)
# ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `config`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `info` json NOT NULL COMMENT '配置信息',
   PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table Record(充值记录)
# ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `recharge_log`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) unsigned NOT NULL COMMENT '用户ID',
  `num` bigint(20) NOT NULL COMMENT '金额',
  `accountAmount` DECIMAL(20,2) NOT NULL COMMENT '用户余额',
  `type` smallint(6) unsigned NOT NULL COMMENT '类型1:充值，2：提现',
  `status` smallint(6) unsigned NOT NULL COMMENT '交易处理状态 1:请求，2：确认，3：撤销',
  `operator` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '操作人账号',
  `bankInfo` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '充值账号信息',
  `create_time` bigint(20) unsigned NOT NULL COMMENT '记录时间',
   PRIMARY KEY (`id`),
   FOREIGN KEY(`uid`) REFERENCES User(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table reset(密码重置表)
# ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reset`(
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '登录名',
  `code` smallint(6) unsigned NOT NULL COMMENT '重置码',
  `type` smallint(6) unsigned NOT NULL COMMENT '1：登录密码，2：提款码',
  `create_time` bigint(20) unsigned NOT NULL COMMENT'创建时间',
  `used` tinyint(3) unsigned DEFAULT '0' COMMENT '是否已经使用',
   PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

