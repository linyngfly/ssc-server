// var util = require('util');
//
// var a = function() {
// 	this.test();
// }
//
// a.prototype.test = function() {
// 	console.log('test');
// }
//
// var b = function() {
// 	a.call(this);
// 	// this.init();
// }
//
// util.inherits(b, a);
//
// b.prototype.init = function() {
// 	console.log('init');
// }
//
// // b.call(null);
// // var aa = new a();
// // aa.test();
//
// var bb = new b();
// console.log(bb instanceof a);
// bb.init();
// console.log(a);
// console.log(b);

// var reg1 = /^大(\d+)小(\d+)/ig;

var betType = {
    BetSize:1, //和大小 (大100)  (小100)
    BetSingleDouble:2, //和单双 (单100  双100)
    DragonAndTiger:3, //龙虎 (龙100 虎100)
    EQUAL15:4, //合/和玩法 (和100 合100)  （大单龙和60）
    PerPosSizeSingleDouble:5, //每个位置大小单双 (1／大双／100)
    PerPosValue:6, //每个位置值 (124/579/90)  组合(124/大单579/90)
    ContainValue:7, //包数字 （75/100） （8/100）
    ShunZiPanther:8 //豹子、数字玩法 （豹100）代表前中后豹子各买100 （豹/100/50/80） 代表前豹子 100元 中豹子50 元 后豹子 80元 （豹顺100） 代表前中后顺子和豹子各买100元 一共下注6注 投注金600元
}

var map = {
    A:'大',
    B:'小',
    C:'单',
    D:'双',
    E:'龙',
    F:'虎',
    G:'和',
    H:'合',
    I:'豹',
    J:'顺'

};

//1）和大小玩法 5位数字相加大于等于23为大，反之为小
console.log('------总和大小-------');
var reg11 = /^大(\d+)/i;
var reg12 = /小(\d+)/i;

var type11 = '大100';
var type12 = '小100';
console.log(type11.match(reg11));
console.log('--------------------');

//2）和单双玩法 5位数字相加为奇数及为单 偶数为双
console.log('------总和单双-------');
var reg21 = /单(\d+)/i;
var reg22 = /双(\d+)/i;
var reg23 = /^单(\d+)双(\d+)/i;
var type21 = '单100';
var type22 = '双100';
console.log(type21.match(reg21));
console.log('--------------------');

//3） 龙虎玩法 1球比5球大为龙,反之为虎
console.log('------龙虎玩法-------');
var reg31 = /龙(\d+)/i;
var reg32 = /虎(\d+)/i;
var type31 = '龙100';
var type32 = '虎100';
console.log(type31.match(reg31));
console.log('--------------------');

//4） 和/合 的玩法 及 一球和五球数字相同为和或合 例如50985 一球和五球都为5 识别方式（和100或者合100）
console.log('------和/合玩法-------');
var reg41 = /和(\d+)/i;
var reg42 = /合(\d+)/i;
var type41 = '和100';
var type42 = '合100';
console.log(type41.match(reg41));
console.log('--------------------');

var s='我1234567890',reg=/.{1}/g,rs=s.match(reg);
//rs.push(s.substring(rs.join('').length));
console.log('--------------------',rs);

//可以组合：（大单龙合60）：大 单 龙 和 各60
console.log('------大单龙合组合玩法-------');
 var reg51 = /([大小单双龙虎和合]+)(\d+)/i;
//var reg51 = /[ABCDEFGH](\d+)/i;
//var reg42 = /合(\d+)/i;
 //var type51 = '大单龙合60';
 var type51 = '大小单双龙虎和合200';
 //var type51 = 'ACEH60';
var type52 = '小双虎和100';
console.log(type51.match(reg51));
var result51 = type51.match(reg51);
var types51 = result51[1].match(reg);
var perMoney51 = result51[2];
console.log('----------------------------types:',types51, perMoney51);
console.log('----------------------------');
//5） 数字玩法 例如1球买8, 100元 识别方式（1/8/100）
// 类推3球买5 ,50元 识别方式（3/5/50）例如4球买6,8各50
// 即 4球买6 ,50元 4球买8 ,50元 识别方式（4/68/50）类推5球买789各60
// 识别方式（5/789/60）如果玩家买1，2，3球7各100元  识别方式（123/7/100）
// 。如果玩家买3，4球买数字6 和8各100元 识别方式（34/68/100 一共投注4注 投注金400元）
// 以此类推 混合买法 124/大单579/90 代表 1，2，4球买 大 单 各90元
// 买 数字5 7 9 各90元  此注一共15注  投注额 1350元

// 6） 每位数字的大小单双 0-4为小 5-9为大 0 2 4 6 8为双 1 3 5 7 9为单
// 识别方式（1／单／100 及 1球买单 100元 以此类推 3／大／100 及 3球买大 100元）
// 如果玩家买 1球大双各100 识别方式（1／大双／100 一共投注2注 投注金200元）以此类推
console.log('------每位数字的大小单双玩法-------');
var reg61 = /(\d+)\/(.+)\/(\d+)/i;
var sample61 = '124/大小单双579/90';
console.log(sample61.match(reg61));
var result61 = sample61.match(reg61);
var numberPos = result61[1];
var types61 = result61[2];
var perMoney = result61[3];
console.log('--------------------numberPos,types61,perMoney',numberPos,types61,perMoney);

console.log('--------------------');

// 7） 包数字玩法  如果玩家每个球买8  100元及1-5球都买数字8 100元，共下注5注每注100元。
// ，1-5球任意出一个及中奖，出一个中一个，出两个中两个  识别方式（8/100 一共投注5注 投注金500元
// 75/100 代表 包数字 7 和 5 各100元 一共投注10注 投注额1000元）

console.log('------包数字玩法-------');
var reg71 = /(\d+)\/(\d+)/i;
var sample71 = '75/300';
console.log(sample71.match(reg71));
var result71 = sample71.match(reg71);
var types71 = result71[1];
var perMoney = result71[2];
console.log('--------------------types71,perMoney',types71,perMoney);

console.log('--------------------');


// 8） 顺子豹子玩法 顺子及3个数字连号为顺子 例如 345 543 354 都为顺子 豹子及3个数字相同为豹子
// 例如 888 为豹子  顺子和豹子分为前 中 后  例如开奖号码35401 前面3位数字354相连 为前顺子，
// 以此类推 20915 为中顺子  12890为后顺子  21354 为前顺子和后顺子  10219 为前顺子 中顺子
// 01234为前顺子 中顺子 后顺子，豹子例如88809 为前豹子   90111为前顺子 后豹子 17770为中豹子
// 88880为前豹子和中豹子 77777为前豹子中豹子后豹子 识别方式（豹100 代表前中后豹子各买100
// 豹／100/50/80 代表前豹子 100元 中豹子50 元 后豹子 80元  顺100 代表前中后顺子各100元
// 顺／100/0/70 代表前顺子100元 中顺子0 元 后顺子 70元  豹顺100  代表前中后顺子和豹子各买100元 一共下注6注 投注金600元）
console.log('------顺子豹子玩法-------');

var reg81 = /([豹顺]+)(\d+)/i;
var reg82 = /([豹顺]+)\/(\d+)\/(\d+)\/(\d+)/i;

var sample81 = '豹300';
var sample82 = '豹/300/50/80';
console.log(sample81.match(reg81));
console.log(sample82.match(reg82));
var result81 = sample81.match(reg81);
var types81 = result81[1];
var perMoney = result81[2];
console.log('--------------------types81,perMoney',types81,perMoney);

console.log('--------------------');



var betResult = {};
var total = 0;
var betTypeInfo ={};
var betItems =[];

var itemss ={};
itemss.type = 0;
console.log('dddddd',betTypeInfo[itemss.type]);
if(undefined === betTypeInfo[itemss.type]){
    betTypeInfo[itemss.type]=0;
    console.log('dsfsdfdsfasf');
}
betTypeInfo[itemss.type] += 100;
// typeTotal[itemss.type]= 0;
console.log(betTypeInfo[itemss.type]);

// 9） 所有的投注方式赔率可以后台设置和修改，每种下注玩家单注限额可以设置，总下注金额限制可设置。例如 总和大小单双  每个玩家下注金额限制8k元  整个平台下注金额限制2w 即 张三下注 总和大不能超过8k  张三下注大8000 李四下注 大8000  王五只能下注 大4000.这样限制方式是分别针对每一个单项下注方式来设定。例如 龙虎玩法 玩家限额5k 平台总限制2w  豹子玩法 玩家单注限额300 总平台限额1200
// 5. 反水比例
// 1） 合作伙伴反水10% 15% 20% 25%30% 35%40% 每5%为一个等级
// 2） 玩家反水按照当日 玩家输钱金额（》=50）计算 1%-5%每 0.5%为一个等级
//
// 6. 管理员后台
// 方便客服人员给玩家充值和下分，并需要显示每个玩家的信息，包括当日输赢情况，充值下分情况，反水情况。下注情况，历史数据，每个玩家发展下线列表和数据。
// 7. 每个玩家输入推荐人id后，不能再输入其推荐人的id。及每个玩家只能输入一次推荐人id。




//
// 玩家信息显示：
// 昵称    投注      剩余可投注数（整个平台）
// 张三：单1000  （剩余19000）
// 李四：单5000  （剩余14000）
// 王五：豹子100 （剩余 900/900/900）
// 赵六：豹子／100/50/200  （剩余 800/850/700）
//
// 大小单双龙虎   1.9~2.0  0.1一级
// 顺子    10~20  1.0一级
// 豹子   60~90  5.0一级
// 数字（包数字，买数字）    9~10   0.5一级
// 和    9~10   0.5一级
// 计算玩家盈利：投注额×赔率-本金=盈利
// 中奖结果显示的的时候直接在投注对话框显示盈利