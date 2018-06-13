CREATE SCHEMA
IF NOT EXISTS `lottery`;

USE `lottery`;

ALTER SCHEMA `lottery` DEFAULT COLLATE utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table User(用户表)
# ------------------------------------------------------------
CREATE TABLE
IF NOT EXISTS `tbl_user` (
  `id` bigint(20) unsigned NOT NULL COMMENT '用户ID',
  `username` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '登录名',
  `password` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '登录密码',
  `phone` varchar(11) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '电话',
  `nickname` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '角色名称',
  `openid` varchar(11) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '渠道标识',
  `email` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `from_ip` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '登录来源',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `inviter` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '邀请人',
  `active` tinyint(3) unsigned DEFAULT '0' COMMENT '是否激活',
  `forbid_talk` tinyint(3) unsigned DEFAULT '0' COMMENT '玩家禁言',
  `friends` json DEFAULT NULL COMMENT '朋友列表',
  `role` smallint(6) unsigned DEFAULT NULL COMMENT '0:玩家,1:拉手',
  `figure_url` smallint(6) unsigned DEFAULT '1' COMMENT '头像id(1~6)',
  `test` smallint(6) unsigned DEFAULT '1' COMMENT '封号标识（<0封号）',
  `rank_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '荣誉称号',
  `money` decimal(20,2) DEFAULT '0.00' COMMENT '账户金额',
  `level` smallint(6) unsigned DEFAULT '1' COMMENT '等级(1~10)',
  `experience` smallint(11) unsigned DEFAULT '0' COMMENT '经验值',
  `login_count` smallint(6) unsigned DEFAULT '0' COMMENT '登录次数',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后在线时间',
  `ext` json DEFAULT NULL COMMENT '扩展数据',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_UNIQUE` (`username`) USING BTREE
) ENGINE = INNODB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table Bank(用户银行信息)
# ------------------------------------------------------------
CREATE TABLE
IF NOT EXISTS `tbl_bank` (
  `id` bigint(20) unsigned NOT NULL COMMENT '用户ID',
  `bank_address` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '开户行地址',
  `bank_account` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '户名',
  `bank_card` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '银行卡号',
  `weixin` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '微信',
  `zhifubao` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '支付宝',
  `pin_code` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '取款密码',
  `bind_card_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '绑卡时间',
  PRIMARY KEY (`id`)
) ENGINE = INNODB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table config(系统配置)
# ------------------------------------------------------------
CREATE TABLE
IF NOT EXISTS `tbl_config` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `identify` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '游戏标志',
  `type` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '配置类型',
  `info` json NOT NULL COMMENT '配置信息',
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_UNIQUE` (`identify`,`type`) USING BTREE
) ENGINE = INNODB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table Lottery(开奖历史)
# ------------------------------------------------------------
CREATE TABLE
IF NOT EXISTS `tbl_lottery` (
	`id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
	`period` VARCHAR (20) COLLATE utf8_unicode_ci NOT NULL COMMENT '期数',
	`identify` VARCHAR (20) COLLATE utf8_unicode_ci NOT NULL COMMENT '标志',
	`numbers` VARCHAR (20) COLLATE utf8_unicode_ci NOT NULL COMMENT '开奖数字',
	`time` TIMESTAMP NOT NULL COMMENT '开奖时间',
	`openResult` json NOT NULL COMMENT '开奖结果',
	PRIMARY KEY (`id`),
    UNIQUE KEY `period_UNIQUE` (`period`,`identify`) USING BTREE
) ENGINE = INNODB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table tbl_order 充值订单表
# ------------------------------------------------------------
CREATE TABLE
IF NOT EXISTS `tbl_order` (
	`id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`uid` BIGINT (20) UNSIGNED NOT NULL COMMENT '用户ID',
	`money` BIGINT (20) NOT NULL COMMENT '充值数量',
	`type` SMALLINT (6) UNSIGNED NOT NULL COMMENT '类型1:充值，2：提现',
	`operator` VARCHAR (20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '操作人账号',
	`bankInfo` VARCHAR (20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '充值账号信息',
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '订单创建时间',
	`state` SMALLINT (6) UNSIGNED NOT NULL COMMENT '交易处理状态 1:请求，2：确认，3：撤销',
	PRIMARY KEY (`id`)
) ENGINE = INNODB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table tbl_bets 用户投注信息
# ------------------------------------------------------------
CREATE TABLE
IF NOT EXISTS `tbl_bets` (
	`id` BIGINT (20) UNSIGNED NOT NULL COMMENT '投注ID',
	`uid` BIGINT (20) UNSIGNED NOT NULL COMMENT '用户ID',
	`period` VARCHAR (20) COLLATE utf8_unicode_ci NOT NULL COMMENT '期数',
	`identify` VARCHAR (20) COLLATE utf8_unicode_ci NOT NULL COMMENT '标志',
	`betData` VARCHAR (50) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户输入投注数据',
	`betItems` json NOT NULL COMMENT '投注条目',
	`multi` SMALLINT (6) UNSIGNED NOT NULL COMMENT '是否是组合投注,0否，1是',
	`betCount` SMALLINT (6) UNSIGNED NOT NULL COMMENT '投注数',
	`betMoney` DECIMAL (20, 2) UNSIGNED NOT NULL COMMENT '投注金额',
	`winCount` SMALLINT (6) UNSIGNED NOT NULL COMMENT '投赢注数',
	`winMoney` DECIMAL (20, 2) UNSIGNED NOT NULL COMMENT '收益金额',
	`betTime` TIMESTAMP NOT NULL COMMENT '投注时间',
	`state` SMALLINT (6) UNSIGNED NOT NULL COMMENT '0待开奖，1 撤销，2 赢 3输',
	PRIMARY KEY (`id`)
) ENGINE = INNODB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table tbl_money_log 消费记录
# ------------------------------------------------------------
CREATE TABLE
IF NOT EXISTS `tbl_money_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `uid` bigint(20) unsigned NOT NULL COMMENT '用户ID',
  `gain` decimal(20,2) unsigned NOT NULL COMMENT '获得',
  `cost` decimal(20,2) unsigned NOT NULL COMMENT '花费',
  `total` decimal(20,2) unsigned NOT NULL COMMENT '账户总额',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '时间',
  `scene` smallint(6) unsigned NOT NULL COMMENT '场景',
  PRIMARY KEY (`id`)
) ENGINE = INNODB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table tbl_player_income(玩家投注反水信息)
# ------------------------------------------------------------
CREATE TABLE
IF NOT EXISTS `tbl_player_income` (
	`id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`uid` BIGINT (20) UNSIGNED NOT NULL COMMENT '用户ID',
	`betMoney` BIGINT (20) UNSIGNED NOT NULL COMMENT '投注金额',
	`incomeMoney` BIGINT (20) NOT NULL COMMENT '盈亏金额',
	`defectionRate` FLOAT (6, 2) NOT NULL COMMENT '反水比例',
	`defectionMoney` DECIMAL (20, 2) NOT NULL COMMENT '反水金額',
	`winRate` FLOAT (6, 2) NOT NULL COMMENT '胜率',
	`incomeTime` BIGINT (20) UNSIGNED NOT NULL COMMENT '反水日期',
	PRIMARY KEY (`id`)
) ENGINE = INNODB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

# ------------------------------------------------------------
# Dump of table tbl_agent_income(代理投注反水信息)
# ------------------------------------------------------------
CREATE TABLE
IF NOT EXISTS `tbl_agent_income` (
	`id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`uid` BIGINT (20) UNSIGNED NOT NULL COMMENT '用户ID',
	`betMoney` BIGINT (20) UNSIGNED NOT NULL COMMENT '投注金额',
	`incomeMoney` BIGINT (20) NOT NULL COMMENT '盈亏金额',
	`rebateRate` FLOAT (6, 2) NOT NULL COMMENT '分成比例',
	`rebateMoney` DECIMAL (20, 2) NOT NULL COMMENT '分成金额',
	`upperRebateRate` FLOAT (6, 2) NOT NULL COMMENT '上级分成比例',
	`upperRebateMoney` DECIMAL (20, 2) NOT NULL COMMENT '上级分成金额',
	`incomeTime` BIGINT (20) UNSIGNED NOT NULL COMMENT '分成日期',
	PRIMARY KEY (`id`)
) ENGINE = INNODB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

