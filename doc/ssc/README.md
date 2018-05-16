## lottery
A lottery bet platform using pomelo framework and cocos creator.
The chat server currently runs on nodejs v7.10.0, and should run fine on the latest stable as well.It requires the following npm libraries:
- pomelo
- express
- crc
- koa2
- cqss
 ssh root@116.31.99.217
sudo apt install sysstat
sudo apt install redis-server

## 数据清理
truncate table AgentIncome;
truncate table Bank;
truncate table Bets;
truncate table Lottery;
truncate table PlayerIncome;
truncate table Record;
truncate table reset;
truncate table User;


mysql 远程访问权限设置
update user set host = '%' where user = 'root';
FLUSH PRIVILEGES;

GRANT ALL PRIVILEGES ON *.* TO 'root'@'%'WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%'IDENTIFIED BY 'linyng' WITH GRANT OPTION;
FLUSH PRIVILEGES;

vim /etc/mysql/mysql.conf.d/mysqld.cnf

service mysql restart

#工作日志

## 2017-06-07
* 托管用户投注管理
* 投注没能正常开奖处理
* 投注后，用户退出在登录，操作投注id问题
* 充值记录
* 用户中奖提示
* 分析排序问题
* 聊天用户信息显示（昵称、头像、等级、金币、胜率[胜数，胜率]）

## 2017-06-08
* 代理商分成（编码完成）
* 充值、提现微信号(OK)
* 手机、邮箱、提款密码用户只能修改一次(OK)
* 投注增加新投注方式解析
* 验证用户升级(OK)
* 系统配置完善(OK)
* 优化系统配置扩展性(OK)
* 公告发布(OK)
* 中奖消息（用户消息）
* 开奖分析重复(OK)

## 2017-06-18
* 豹子顺子开奖缺陷解决
* 数据库连接池中无效连接释放问题
* 投注分析优化

## 2017-06-20
* 增加聊天消息历史(存数据库,发送到客户端）(OK)
* 聊天室结构调整(OK)
* 升级按照后台配置金额升级(OK)
* 增加体验用户角色，输赢不加入反水，分成和数据汇总（OK）
* 用户基本信息增加总投注额（OK）

* 昵称默认使用登录账号，昵称不能重复(OK)
* 登录密码、支付密码重置(待测试)
* 提现和充值增加操作人用户账号、冲值银行账号(待测试)
* 发起提现申请时，增加账号信息（微信、支付宝）(接口不需要动)
* 银行卡绑定增加微信、支付宝（待测试）

* 服务器重启或关闭，重启后，继续开奖之前投注信息

* 后台一级代理撤销，二级代理指向SYS，一级代理下的玩家指向SYS

* 官方已经开奖，平台未开奖，使用后台设置开奖数据

* 超过3分钟官网未开奖，则自动返款



