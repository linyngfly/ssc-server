/**
 * Created by linyng on 17-5-20.
 */
/*选号*/
var NumWW = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0); /*万位*/
var NumQW = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0); /*千位*/
var NumBW = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0); /*百位*/
var NumSW = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0); /*十位*/
var NumGW = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0); /*个位*/
var NumDXSW = ""; /*大小单双十位*/
var vDxSwID = 0;
var NumDXGW = ""; /*大小单双个位*/
var vDxGwID = 0;
var NumberAll = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0); /*筛选*/
var vSxHz = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); /*三星和值包点选号*/
var vRxHz = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); /*二星和值包点选号*/
var vSxHzArr = new Array(); /*三星和值投注号码*/
var vRxHzArr = new Array(); /*二星和值投注号码*/
var vSxBdArr = new Array(); /*三星包点投注号码*/
var vRxBdArr = new Array(); /*二星包点投注号码*/
var vCountZ = 0; 			/*总注数*/
var vCountM = 0.00; 		/*总钱数	*/
var vCountWW = 0; /*万位个数*/
var vCountQW = 0; /*千位个数*/
var vCountBW = 0; /*百位个数*/
var vCountSW = 0; /*十位个数*/
var vCountGW = 0; /*个位个数*/
var vStrBallWW = ""; /*输出万位字符串*/
var vStrBallQW = ""; /*输出千位字符串*/
var vStrBallBW = ""; /*输出百位字符串*/
var vStrBallSW = ""; /*输出十位字符串*/
var vStrBallGW = ""; /*输出个位字符串*/
var vBetStrBall = ""; /*总输出字符串*/
var vZSArr = new Array(); /*三星组三投注号码*/
var vZLArr = new Array(); /*三星组六投注号码*/
var vRXZX = ""; /*二星组选投注串*/
var vBetTyepId = 0; /*记录上次投注类型编号*/
var vMoitId = 0; /*遗漏类型编号*/
var vSSCBetType = "五星"; /*投注类型(五星，三星，二星，一星，和值，包点)*/
var vSSCBetMode = "标准"; /*投注方式(标准，复选，分组....)*/
var vBetCountTool = 0; /*总投注注数(倍投工具)*/
var vCurBonus = "--"; /*投注类型奖金*/
var vIsZh = false; /*是否追号*/
var NowBetTypeID = 0;

var vSum3 = new Array(1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1);
var vSum2 = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1);
var vSum2Zu = new Array(1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1);
var vSum3Zu = new Array(1, 1, 2, 3, 4, 5, 7, 8, 10, 12, 13, 14, 15, 15, 15, 15, 14, 13, 12, 10, 8, 7, 5, 4, 3, 2, 1, 1);

/*初始化状态*/
function Init() {
    for (var i = 0; i < 13; i++) {
        if (i > 2) $("spanBet_" + i).style.display = "none"; else $("spanBet_" + i).style.display = "inline"; $("radSSC_0").checked = true;
    }
    $("zhIssue").value = 2;
    $("chkStopZh").checked = true;
    $("chkZH").checked = false;
    $("radZhZDY").checked = true;
    $("radZhTool").disabled = true;
    openNumber();
}
/*投注介绍*/
function BetIntroInfo() {
    var vStr = ""
    if (vSSCBetType == "五星") {
        if (vSSCBetMode == "标准") {
            vStr = "标准5星：竞猜开奖号码的全部五位，分别选择每位的1个或多个号码投注，奖金100000元。";
        } else if (vSSCBetMode == "复选") {
            vStr = "五星复选：相当于投注了1注五星、1注三星、1注二星、1注一星（共4注，8元），奖金101110元。";
        } else if (vSSCBetMode == "通选") {
            vStr = "五星通选：每行选1号码，三个奖级通吃，五次中奖机会，大奖20000元。";
        }
        $("Random_1").style.display = "inline";
        $("Random_2").style.display = "inline";
    } else if (vSSCBetType == "三星") {
        if (vSSCBetMode == "标准") {
            vStr = "三星标准：单式投注：每个位置选择一个号码；复式投注：每个位置都选择2－10个号码,奖金1000元。";
        } else if (vSSCBetMode == "复选") {
            vStr = "三星复选：一注3个号码，相当于投注了1注三星、1注二星、1注一星（共3注，6元），奖金1110元。";
        } else if (vSSCBetMode == "组三") {
            vStr = "三星组三：有两个位置数字相同，另外一个不同。奖金320元。";
        } else if (vSSCBetMode == "组六") {
            vStr = "三星组六：三个位置的数字都不同，奖金160元。";
        } else if (vSSCBetMode == "组三复式") {
            vStr = "三星组三复式：从0~9共10个数中任意选择两个到十个号码进行投注，中奖规则与组三相同。"
        } else if (vSSCBetMode == "组六复式") {
            vStr = "三星组六复式：从0~9共10个数中任意选择四个到十个号码进行投注，中奖规则与组六相同。"
        }
        if (vSSCBetMode == "组三复式" || vSSCBetMode == "组六复式") {
            $("Random_1").style.display = "none";
            $("Random_2").style.display = "none";
        } else {
            $("Random_1").style.display = "inline";
            $("Random_2").style.display = "inline";
        }
    } else if (vSSCBetType == "二星") {
        if (vSSCBetMode == "标准") {
            vStr = "二星标准：单式投注：每个位置选择一个号码；复式投注：每个位置都选择2－10个号码,奖金100元。";
        } else if (vSSCBetMode == "复选") {
            vStr = "二星复选：一注2个号码，相当于投注了1注二星、1注一星（共2注，4元），奖金110元。";
        } else if (vSSCBetMode == "组选") {
            vStr = "二星组选：十位、个位选择不同号码，奖金50元。";
        } else if (vSSCBetMode == "分组") {
            vStr = "二星分组：十位或个位其中一位至少选择2个号，奖金50元。";
        }
        else {
            vStr = "二组复式：竞猜开奖号码的最后两位，选择2个或以上号码投注，奖金50元。";
        }
        $("Random_1").style.display = "inline";
        $("Random_2").style.display = "inline";
    } else if (vSSCBetType == "一星") {
        if (vSSCBetMode == "标准") {
            vStr = "一星标准：单式投注：每个位置选择一个号码；复式投注：每个位置都选择2－10个号码,奖金10元。";
        }
        $("Random_1").style.display = "inline";
        $("Random_2").style.display = "inline";
    } else if (vSSCBetType == "大小单双") {
        if (vSSCBetMode == "大小单双") {
            vStr = "大小单双：竞猜开奖号码最后两位的大小单双，分别选择十位、个位投注，全部猜中则中奖，奖金4元。";
        }
        $("Random_1").style.display = "inline";
        $("Random_2").style.display = "inline";
    } else if (vSSCBetType == "和值") {
        if (vSSCBetMode == "三星") {
            vStr = "三星和值：竞猜开奖号码后面三位的数字相加之和，选择1个或多个和值号码投注，奖金1000元。";
        } else if (vSSCBetMode == "二星") {
            vStr = "二星和值：竞猜开奖号码最后两位的数字相加之和，选择1个或多个和值号码投注，奖金100元。";
        }
        $("Random_1").style.display = "none";
        $("Random_2").style.display = "none";
    } else if (vSSCBetType == "包点") {
        if (vSSCBetMode == "三组标准") {
            vStr = "三组标准：竞猜开奖号码后面三位的数字相加之和，组3形态奖金320元，组6形态奖金160元。";
        } else if (vSSCBetMode == "二组标准") {
            vStr = "二组标准：竞猜开奖号码后面两位的数字相加之和，奖金50元";
        }
        $("Random_1").style.display = "none";
        $("Random_2").style.display = "none";
    }
    else {
        $("Random_1").style.display = "none";
        $("Random_2").style.display = "none";
    }
    $("BetIntro").innerHTML = "&nbsp;&nbsp;玩法简介：" + vStr;
}
/*二星和值包点投注*/
function RXHZBetStr() {
    var vRXFreqArr = vRXFreq.split(',');
    var vMaxF = 0;
    for (var i = 0; i < 19; i++) {
        if (Number(vRXFreqArr[i]) > vMaxF) {
            vMaxF = Number(vRXFreqArr[i]);
        }
    }
    var vTemp = "<ul class='sxhzbet'><li class='sxhzbetli'>出现频率</li>";
    for (var i = 0; i < 19; i++) {
        vTemp += "<li class='rxhzfreq'><img class='frquimg' src='/Images/Game/g1.gif' height='"
            + (Number(Number(vRXFreqArr[i]) * 10 / vMaxF) + 1) + "px'" +
            "title='" + vRXFreqArr[i] + "' /></li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML = vTemp;
    vTemp = "<ul class='rxhzbet'><li class='rxhzbetli'>二星和值</li>";
    for (var i = 0; i < 19; i++) {
        vTemp += "<li class='bt123 rxbet' id='RXHZNum_" + i + "' onclick='SelHz(" + i + ",\"RX\")'>" + i + "</li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML += vTemp;
    vTemp = "<ul class='zhomitul'><li class='sxhzbetli'>数据遗漏</li>";
    var vTempArr = vRXZHOmit.split(",");
    for (var i = 0; i < 19; i++) {
        var vTemp1 = vTempArr[i];
        if (vTempArr[i] > 20) {
            vTemp1 = "<font color='red'>" + vTempArr[i] + "</font>";
        }
        vTemp += "<li class='rxhzcs'>" + vTemp1 + "</li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML += vTemp;
    vTemp = "<ul class='zhomitul'><li class='sxhzbetli'>包含组合</li>";
    var vTempArr = new Array();
    if (vSSCBetType == "和值") {
        vTempArr = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1);
    } else if (vSSCBetType == "包点") {
        vTempArr = new Array(1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1);
    }
    for (var i = 0; i < 19; i++) {
        vTemp += "<li class='rxhzcs'>" + vTempArr[i] + "</li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML += vTemp;
}
/*三星和值包点投注*/
function SXHZBetStr() {
    var vSXFreqArr = vSXFreq.split(',');
    var vMaxF = 0;
    for (var i = 0; i < 28; i++) {
        if (Number(vSXFreqArr[i]) > vMaxF) {
            vMaxF = Number(vSXFreqArr[i]);
        }
    }
    var vTemp = "<ul class='sxhzbet'><li class='sxhzbetli'>出现频率</li>";
    for (var i = 0; i < 28; i++) {
        vTemp += "<li class='sxhzfreq'><img class='frquimg' src='/Images/Game/Oth/g1.gif' height='"
            + (Number(Number(vSXFreqArr[i]) * 10 / vMaxF) + 1) + "px'" +
            "title='" + vSXFreqArr[i] + "' /></li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML = vTemp;
    vTemp = "<ul class='sxhzbet'><li class='sxhzbetli'>三星和值</li>";
    for (var i = 0; i < 28; i++) {
        vTemp += "<li class='bt123' id='SXHZNum_" + i + "' onclick='SelHz(" + i + ",\"SX\")'>" + i + "</li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML += vTemp;
    vTemp = "<ul class='zhomitul'><li class='sxhzbetli'>数据遗漏</li>";
    var vTempArr = vSXZHOmit.split(",");
    for (var i = 0; i < 28; i++) {
        var vTemp1 = vTempArr[i];
        if (vTempArr[i] > 20) {
            vTemp1 = "<font color='red'>" + vTempArr[i] + "</font>";
        }
        vTemp += "<li class='sxhzcs'>" + vTemp1 + "</li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML += vTemp;
    vTemp = "<ul class='zhomitul'><li class='sxhzbetli'>包含组合</li>";
    var vTempArr = new Array();
    if (vSSCBetType == "和值") {
        vTempArr = new Array(1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1);
    } else if (vSSCBetType == "包点") {
        vTempArr = new Array(1, 1, 2, 3, 4, 5, 7, 8, 10, 12, 13, 14, 15, 15, 15, 15, 14, 13, 12, 10, 8, 7, 5, 4, 3, 2, 1, 1);
    }
    for (var i = 0; i < 28; i++) {
        vTemp += "<li class='sxhzcs'>" + vTempArr[i] + "</li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML += vTemp;
}
/*二星和值包点投注*/
function chan() {
    var vRXFreqArr = vRXFreq.split(',');
    var vMaxF = 0;
    for (var i = 0; i < 19; i++) {
        if (Number(vRXFreqArr[i]) > vMaxF) {
            vMaxF = Number(vRXFreqArr[i]);
        }
    }
    var vTemp = "<ul class='sxhzbet'><li class='sxhzbetli'>出现频率</li>";
    for (var i = 0; i < 19; i++) {
        vTemp += "<li class='rxhzfreq'><img class='frquimg' src='/Images/Game/Oth/g1.gif' height='"
            + (Number(Number(vRXFreqArr[i]) * 10 / vMaxF) + 1) + "px'" +
            "title='" + vRXFreqArr[i] + "' /></li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML = vTemp;
    vTemp = "<ul class='rxhzbet'><li class='rxhzbetli'>二星和值</li>";
    for (var i = 0; i < 19; i++) {
        vTemp += "<li class='bt123 rxbet' id='RXHZNum_" + i + "' onclick='SelHz(" + i + ",\"RX\")'>" + i + "</li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML += vTemp;
    vTemp = "<ul class='zhomitul'><li class='sxhzbetli'>数据遗漏</li>";
    var vTempArr = vRXZHOmit.split(",");
    for (var i = 0; i < 19; i++) {
        var vTemp1 = vTempArr[i];
        if (vTempArr[i] > 20) {
            vTemp1 = "<font color='red'>" + vTempArr[i] + "</font>";
        }
        vTemp += "<li class='rxhzcs'>" + vTemp1 + "</li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML += vTemp;
    vTemp = "<ul class='zhomitul'><li class='sxhzbetli'>包含组合</li>";
    var vTempArr = new Array();
    if (vSSCBetType == "和值") {
        vTempArr = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1);
    } else if (vSSCBetType == "包点") {
        vTempArr = new Array(0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0);
    }
    for (var i = 0; i < 19; i++) {
        vTemp += "<li class='rxhzcs'>" + vTempArr[i] + "</li>";
    }
    vTemp += "</ul>";
    $("SXHZBet").innerHTML += vTemp;
}
/*遗漏显示*/
function OmitShow(id) {
    if (vMoitId != id) {
        $("omitli_" + id).className = "sscomittop";
        $("omitli_" + vMoitId).className = "sscomittop1";
        vMoitId = id;
    }
    if (vSSCBetType == "五星") {
        for (var i = 0; i < 12; i++) {
            if (i == id) { $("sscomit_" + i).style.display = "block"; }
            else { $("sscomit_" + i).style.display = "none"; }
        }
    } else if (vSSCBetType == "三星") { ShowOmit_1(id, 2); }
    else if (vSSCBetType == "二星") { ShowOmit_1(id, 6); }
    else if (vSSCBetType == "一星") { ShowOmit_1(id, 9); }
    else if (vSSCBetType == "大小单双") { ShowOmit_1(id, 11); }
}
/*显示不同投注类型遗漏*/
function ShowOmit_1(id, iv) {
    for (var i = 0; i < 14; i++) {
        if (id == 0) {
            $("sscomit_0").style.display = "block";
            $("sscomit_" + i).style.display = "none";
        }
        else {
            if (i == (id + iv)) { $("sscomit_" + i).style.display = "block"; }
            else { $("sscomit_" + i).style.display = "none"; }
        }
    }
}
/*显示不同投注类型的遗漏标头*/
function ShowOmitHead(id, vStr) {
    for (var j = 0; j < 5; j++) {
        if (j < id) { $("omitli_" + j).style.display = "inline"; }
        else { $("omitli_" + j).style.display = "none"; }
        $("omitli_1").innerHTML = vStr;
        $("omitli_" + j).className = "sscomittop1";
    }
    $("omitli_0").className = "sscomittop";
    $("sscomit_0").style.display = "block";
    for (var i = 1; i < 14; i++) { $("sscomit_" + i).style.display = "none"; }
    vMoitId = 0;
}
/*还原筛选样式*/
function hySXCss(vtype) {
    for (var i = 0; i < 12; i++) {
        if (vtype == "All") {
            $("WWSX_" + i).className = "sx_sscSel";
            $("QWSX_" + i).className = "sx_sscSel";
            $("BWSX_" + i).className = "sx_sscSel";
            $("SWSX_" + i).className = "sx_sscSel";
            $("GWSX_" + i).className = "sx_sscSel";
        }
    }
}
/*改变投注类型*/
function ChangeBetType(id) {
    NowBetTypeID = id;
    $("spanBet_20").style.display = "none";
    $("spanBet_21").style.display = "none";
    if (vBetTyepId != id) {
        $("betType_" + id).className = "tag_bgsel";
        $("betType_" + vBetTyepId).className = "tag_bgli";
        vBetTyepId = id;
    }
    if (id == 0 || id == 1 || id == 2 || id == 3) {
        $("BetSSCX").style.display = "inline";
        $("BetSSCdxds").style.display = "none";
        $("BetSSCHZ").style.display = "none";
        $("BetSSCDiv_Oth").style.display = "inline";
        $("SSCWJTZ").style.display = "none";
        vSSCBetMode = "标准";
    } else if (id == 4) {
        $("BetSSCX").style.display = "none";
        $("BetSSCdxds").style.display = "inline";
        $("BetSSCHZ").style.display = "none";
        $("BetSSCDiv_Oth").style.display = "inline";
        $("SSCWJTZ").style.display = "none";
        vSSCBetMode = "大小单双";
    } else if (id == 5 || id == 6) {
        if (id == 5) { vSSCBetMode = "三星"; }
        else if (id == 6) { vSSCBetMode = "三组标准"; }
        $("BetSSCDiv_Oth").style.display = "none";
        $("BetSSCHZ").style.display = "inline";
        $("SSCHZSX").style.display = "inline";
        $("SSCHZRX").style.display = "none";
        $("SSCWJTZ").style.display = "none";
    }
    else if (id == 7) {
        vSSCBetMode = "五星通选";
        $("BetSSCX").style.display = "none";
        $("BetSSCdxds").style.display = "none";
        $("BetSSCHZ").style.display = "none";
        $("BetSSCDiv_Oth").style.display = "inline";
        $("SSCWJTZ").style.display = "inline";
    }
    /*显示隐藏投注方式*/
    if (id == 0) {
        for (var i = 0; i < 13; i++) {
            if (i > 2) { $("spanBet_" + i).style.display = "none"; }
            else { $("spanBet_" + i).style.display = "inline"; }
        }
        $("radSSC_0").checked = true;
        vSSCBetType = "五星";
        for (var j = 1; j < 6; j++) {
            $("BetW_" + j).style.display = "inline";
            $("omit" + j).style.display = "inline";
            $("sscSX_" + j).style.display = "block";
        }
        ShowOmitHead(3, "分位遗漏");
    }
    if (id == 1) {
        for (var i = 0; i < 13; i++) {
            if (i > 1 && i != 3 && i != 4) { $("spanBet_" + i).style.display = "none"; }
            else { $("spanBet_" + i).style.display = "inline"; }
        }
        $("spanBet_20").style.display = "inline";
        $("spanBet_21").style.display = "inline";
        $("radSSC_0").checked = true;
        vSSCBetType = "三星";
        for (var j = 1; j < 6; j++) {
            if (j > 2) {
                $("BetW_" + j).style.display = "inline";
                $("omit" + j).style.display = "inline";
                $("sscSX_" + j).style.display = "block";
            } else {
                $("BetW_" + j).style.display = "none";
                $("omit" + j).style.display = "none";
                $("sscSX_" + j).style.display = "none";
            }
        }
        ShowOmitHead(5, "标准遗漏");
    }
    if (id == 2) {
        for (var i = 0; i < 13; i++) {
            if (i > 1 && i != 5 && i != 6 && i != 12) { $("spanBet_" + i).style.display = "none"; }
            else { $("spanBet_" + i).style.display = "inline"; }
        }
        $("radSSC_0").checked = true;
        vSSCBetType = "二星";
        for (var j = 1; j < 6; j++) {
            if (j > 3) {
                $("BetW_" + j).style.display = "inline";
                $("omit" + j).style.display = "inline";
                $("sscSX_" + j).style.display = "block";
            } else {
                $("BetW_" + j).style.display = "none";
                $("omit" + j).style.display = "none";
                $("sscSX_" + j).style.display = "none";
            }
        }
        ShowOmitHead(4, "标准遗漏");
    }
    if (id == 3) {
        for (var i = 0; i < 13; i++) {
            if (i != 0) { $("spanBet_" + i).style.display = "none"; }
            else { $("spanBet_" + i).style.display = "inline"; }
        }
        $("radSSC_0").checked = true;
        vSSCBetType = "一星";
        for (var j = 1; j < 6; j++) {
            if (j > 4) {
                $("BetW_" + j).style.display = "inline";
                $("omit" + j).style.display = "inline";
                $("sscSX_" + j).style.display = "block";
            } else {
                $("BetW_" + j).style.display = "none";
                $("omit" + j).style.display = "none";
                $("sscSX_" + j).style.display = "none";
            }
        }
        ShowOmitHead(3, "标准遗漏");
    }
    if (id == 4) {
        for (var i = 0; i < 13; i++) {
            if (i != 7) { $("spanBet_" + i).style.display = "none"; }
            else { $("spanBet_" + i).style.display = "inline"; }
        }
        $("radSSC_7").checked = true;
        vSSCBetType = "大小单双";
        ShowOmitHead(3, "形态遗漏");
    }
    if (id == 5) {
        for (var i = 0; i < 13; i++) {
            if (i != 8 && i != 9) { $("spanBet_" + i).style.display = "none"; }
            else { $("spanBet_" + i).style.display = "inline"; }
        }
        $("radSSC_8").checked = true;
        vSSCBetType = "和值";
        SXHZBetStr();
    }
    if (id == 6) {
        for (var i = 0; i < 13; i++) {
            if (i != 10 && i != 11) { $("spanBet_" + i).style.display = "none"; }
            else { $("spanBet_" + i).style.display = "inline"; }
        }
        $("radSSC_10").checked = true;
        vSSCBetType = "包点";
        SXHZBetStr();
    }
    if (id == 7) {
        vSSCBetType = "文件";
        $("radSSC_13").checked = true;
        $("allBet1").style.display = "none";
        $("allBet2").style.display = "inline";
        $("BetIntro").style.display = "none";
    }
    else {
        $("allBet1").style.display = "inline";
        $("allBet2").style.display = "none";
        $("BetIntro").style.display = "inline";

    }
    BetIntroInfo();
    if (id == 6 || id == 5) {
        CleanHz();
    }
    else if (id == 4) {
        CleanDx();
    }
    else {
        Clean();
    }
}
/*改变投注方式*/
function ChangeBetMode(id) {
    vSSCBetMode = id.value;
    if (vSSCBetMode == "二星" || vSSCBetMode == "二组标准") {
        RXHZBetStr();
        $("SSCHZSX").style.display = "none";
        $("SSCHZRX").style.display = "inline";
    }
    else if (vSSCBetMode == "三星" || vSSCBetMode == "三组标准") {
        SXHZBetStr();
        $("SSCHZSX").style.display = "inline";
        $("SSCHZRX").style.display = "none";
    } else if (vSSCBetType == "三星") {
        if (vSSCBetMode == "组六复式" || vSSCBetMode == "组三复式") {
            for (var j = 1; j < 6; j++) {
                if (j > 4) {
                    $("BetW_" + j).style.display = "inline";
                    $("omit" + j).style.display = "inline";
                    $("sscSX_" + j).style.display = "block";
                } else {
                    $("BetW_" + j).style.display = "none";
                    $("omit" + j).style.display = "none";
                    $("sscSX_" + j).style.display = "none";
                }
            }
            $("Num5_text").style.display = "none";
            $("omit5").style.display = "none";
        }
        else {
            for (var j = 1; j < 6; j++) {
                if (j > 2) {
                    $("BetW_" + j).style.display = "inline";
                    $("omit" + j).style.display = "inline";
                    $("sscSX_" + j).style.display = "block";
                } else {
                    $("BetW_" + j).style.display = "none";
                    $("omit" + j).style.display = "none";
                    $("sscSX_" + j).style.display = "none";
                }
            }
            $("Num5_text").style.display = "block";
            $("omit5").style.display = "block";
        }
    }
    else {
        if (vSSCBetType == "二星") {
            if (vSSCBetMode == "组选复式") {
                for (var j = 1; j < 6; j++) {
                    if (j > 4) {
                        $("BetW_" + j).style.display = "inline";
                        $("omit" + j).style.display = "inline";
                        $("sscSX_" + j).style.display = "block";
                    } else {
                        $("BetW_" + j).style.display = "none";
                        $("omit" + j).style.display = "none";
                        $("sscSX_" + j).style.display = "none";
                    }
                }
                $("Num5_text").style.display = "none";
                $("omit5").style.display = "none";
            }
            else {
                for (var j = 1; j < 6; j++) {
                    if (j > 3) {
                        $("BetW_" + j).style.display = "inline";
                        $("omit" + j).style.display = "inline";
                        $("sscSX_" + j).style.display = "block";
                    } else {
                        $("BetW_" + j).style.display = "none";
                        $("omit" + j).style.display = "none";
                        $("sscSX_" + j).style.display = "none";
                    }
                }
                $("Num5_text").style.display = "block";
                $("omit5").style.display = "block";
            }
        }
        else {
            $("Num5_text").style.display = "block";
            $("omit5").style.display = "block";
        }
    }
    BetIntroInfo();
    CleanAll();
}
/*投注选号*/
function SelectNum(iType, id) {
    if (iType == 1) { NumWW[id] = NumWW[id] == 0 ? 1 : 0; }
    if (iType == 2) { NumQW[id] = NumQW[id] == 0 ? 1 : 0; }
    if (iType == 3) { NumBW[id] = NumBW[id] == 0 ? 1 : 0; }
    if (iType == 4) { NumSW[id] = NumSW[id] == 0 ? 1 : 0; }
    if (iType == 5) { NumGW[id] = NumGW[id] == 0 ? 1 : 0; }
    ShowBall();
}

/*大小单双转换为数字*/
function DxdxToNum(vStr) {
    var vNum = "";
    if (vStr == "单") { vNum = 5; }
    else if (vStr == "双") { vNum = 4; }
    else if (vStr == "小") { vNum = 1; }
    else if (vStr == "大") { vNum = 2; }
    return vNum;
}
/*大小单双选号*/
function SelectDX(iType, id, vStr) {
    if (iType == 1) {
        CleanDx_SW();
        if (id == 0) { $("dxSW_" + id).className = "bt123_red"; NumDXSW = vStr; }
        if (vDxSwID != id) {
            $("dxSW_" + id).className = "bt123_red";
            $("dxSW_" + vDxSwID).className = "bt123";
            NumDXSW = vStr;
            vDxSwID = id;
        }
    }
    if (iType == 2) {
        CleanDx_GW();
        if (id == 0) { $("dxGW_" + id).className = "bt123_red"; NumDXGW = vStr; }
        if (vDxGwID != id) {
            $("dxGW_" + id).className = "bt123_red";
            $("dxGW_" + vDxGwID).className = "bt123";
            NumDXGW = vStr;
            vDxGwID = id;
        }
    }
    if (NumDXSW != "" && NumDXGW != "") {
        $("AllCount").innerHTML = 1;
        $("BetMoney").innerHTML = "￥" + 2 + ".00";
    }
}
/*大小单双数字转换为汉字*/
function DxdxToCh(vStr) {
    var vCh = "";
    if (vStr == 5) { vCh = "单"; }
    else if (vStr == 4) { vCh = "双"; }
    else if (vStr == 1) { vCh = "小"; }
    else if (vStr == 2) { vCh = "大"; }
    return vCh;
}

/*大小单双选号*/
function SelectDX_1(vStr) {
    CleanDx();
    vTemp = vStr.split('@');
    NumDXSW = DxdxToCh(vTemp[0]); NumDXGW = DxdxToCh(vTemp[1]);
    if (NumDXSW == "大") { $("dxSW_0").className = "bt123_red"; }
    else if (NumDXSW == "小") { $("dxSW_1").className = "bt123_red"; }
    else if (NumDXSW == "单") { $("dxSW_2").className = "bt123_red"; }
    else if (NumDXSW == "双") { $("dxSW_3").className = "bt123_red"; }
    if (NumDXGW == "大") { $("dxGW_0").className = "bt123_red"; }
    else if (NumDXGW == "小") { $("dxGW_1").className = "bt123_red"; }
    else if (NumDXGW == "单") { $("dxGW_2").className = "bt123_red"; }
    else if (NumDXGW == "双") { $("dxGW_3").className = "bt123_red"; }
    $("AllCount").innerHTML = 1;
    $("BetMoney").innerHTML = "￥" + 2 + ".00";
}
/*和值包点选号*/
function SelHz(id, iType) {
    if (iType == "SX") {
        vSxHz[id] = vSxHz[id] == 0 ? 1 : 0;
    } else if (iType == "RX") {
        vRxHz[id] = vRxHz[id] == 0 ? 1 : 0;
    }
    HzShowBall();
}
/*显示投注号码*/
function ShowBall() {
    vCountZ = 0; 			/*总注数*/
    vCountM = 0.00; 		/*总钱数	*/
    vCountWW = 0; /*万位个数*/
    vCountQW = 0; /*千位个数*/
    vCountBW = 0; /*百位个数*/
    vCountSW = 0; /*十位个数*/
    vCountGW = 0; /*个位个数*/
    vStrBallWW = ""; /*输出万位字符串*/
    vStrBallQW = ""; /*输出千位字符串*/
    vStrBallBW = ""; /*输出百位字符串*/
    vStrBallSW = ""; /*输出十位字符串*/
    vStrBallGW = ""; /*输出个位字符串*/
    for (var i = 0; i < 10; i++)//百位
    {
        var obj = $("Num1_" + i);
        if (NumWW[i] == 1) { obj.className = "bt123_red"; vStrBallWW += i + ""; vCountWW += 1; }
        else { obj.className = "bt123"; }
        obj = $("Num2_" + i);
        if (NumQW[i] == 1) { obj.className = "bt123_red"; vStrBallQW += i + ""; vCountQW += 1; }
        else { obj.className = "bt123"; }
        obj = $("Num3_" + i);
        if (NumBW[i] == 1) { obj.className = "bt123_red"; vStrBallBW += i + ""; vCountBW += 1; }
        else { obj.className = "bt123"; }
        obj = $("Num4_" + i);
        if (NumSW[i] == 1) { obj.className = "bt123_red"; vStrBallSW += i + ""; vCountSW += 1; }
        else { obj.className = "bt123"; }
        obj = $("Num5_" + i);
        if (NumGW[i] == 1) { obj.className = "bt123_red"; vStrBallGW += i + ""; vCountGW += 1; }
        else { obj.className = "bt123"; }
    }
    if (vSSCBetType == "五星") {
        vCountZ = vCountWW * vCountQW * vCountBW * vCountSW * vCountGW;
        if (vSSCBetMode == "复选") { vCountM = vCountZ * 8; }
        else { vCountM = vCountZ * 2; }
    } else if (vSSCBetType == "三星") {
        if (vSSCBetMode == "组三" || vSSCBetMode == "组六") { vCountZ = SXCountBetTote(vSSCBetMode); }
        else if (vSSCBetMode == "组三复式") { vCountZ = GetZSFsCount(vCountGW); }
        else if (vSSCBetMode == "组六复式") { vCountZ = GetZLFsCount(vCountGW); }
        else { vCountZ = vCountBW * vCountSW * vCountGW; }
        if (vSSCBetMode == "复选") { vCountM = vCountZ * 6; }
        else { vCountM = vCountZ * 2; }
    } else if (vSSCBetType == "二星") {
        if (vSSCBetMode == "组选" || vSSCBetMode == "分组" || vSSCBetMode == "组选复式") { vCountZ = RXCountBetTote(); }
        else { vCountZ = vCountSW * vCountGW; }
        if (vSSCBetMode == "复选") { vCountM = vCountZ * 4; }
        else { vCountM = vCountZ * 2; }
    } else if (vSSCBetType == "一星") {
        vCountZ = vCountGW;
        vCountM = vCountZ * 2;
    }
    $("AllCount").innerHTML = vCountZ;
    $("BetMoney").innerHTML = "￥" + vCountM + ".00";
}
/*显示和值包点投注号码*/
function HzShowBall() {
    CountZ = 0; 			/*总注数*/
    CountM = 0.00; 		/*总钱数*/
    var CountArr = 0;
    if (vSSCBetType == "和值") {
        if (vSSCBetMode == "三星") {
            vSxHzArr = new Array();
            for (var i = 0; i < 28; i++) {
                var t = i;
                var obj = $("SXHZNum_" + t);
                if (vSxHz[i] == 1) {
                    obj.className = "bt123_red";
                    vSxHzArr[CountArr] = t;
                    CountArr++;
                    CountZ += vSum3[i];
                }
                else { obj.className = "bt123"; }
            }
        }
        else if (vSSCBetMode == "二星") {
            vRxHzArr = new Array();
            for (var i = 0; i < 19; i++) {
                var t = i;
                var obj = $("RXHZNum_" + t);
                if (vRxHz[i] == 1) {
                    obj.className = "bt123_red rxbet";
                    vRxHzArr[CountArr] = t;
                    CountArr++;
                    CountZ += vSum2[i]
                }
                else { obj.className = "bt123 rxbet"; }
            }
        }
    } else if (vSSCBetType === "包点") {
        if (vSSCBetMode == "三组标准") {
            vSxBdArr = new Array();
            for (var i = 0; i < 28; i++) {
                var t = i;
                var obj = $("SXHZNum_" + t);
                if (vSxHz[i] == 1) {
                    obj.className = "bt123_red";
                    vSxBdArr[CountArr] = t;
                    CountArr++;
                    CountZ += vSum3Zu[i]
                }
                else { obj.className = "bt123"; }
            }
        } else if (vSSCBetMode == "二组标准") {
            vRxBdArr = new Array();
            for (var i = 0; i < 19; i++) {
                var t = i;
                var obj = $("RXHZNum_" + t);
                if (vRxHz[i] == 1) {
                    obj.className = "bt123_red rxbet";
                    vRxBdArr[CountArr] = t;
                    CountArr++;
                    CountZ += vSum2Zu[i]
                }
                else { obj.className = "bt123 rxbet"; }
            }
        }
    }
    CountM = CountZ * 2;
    $("AllCount").innerHTML = CountZ;
    $("BetMoney").innerHTML = "￥" + CountM + ".00";
}
/*筛选*/
function SelectSX(iType, id) {
    var tmp = sTrim(id.innerHTML.replace(" ", ""));
    tmp = tmp.substring(0, 1);
    switch (tmp) {
        case "全": for (var i = 0; i < 10; i++) NumberAll[i] = 1; break;
        case "0": for (var i = 0; i < 10; i++) { i % 3 == 0 ? NumberAll[i] = 1 : NumberAll[i] = 0; } break;
        case "1": for (var i = 0; i < 10; i++) { i % 3 == 1 ? NumberAll[i] = 1 : NumberAll[i] = 0; } break;
        case "2": for (var i = 0; i < 10; i++) { i % 3 == 2 ? NumberAll[i] = 1 : NumberAll[i] = 0; } break;
        case "大": for (var i = 0; i < 10; i++) { i > 4 ? NumberAll[i] = 1 : NumberAll[i] = 0; } break;
        case "小": for (var i = 0; i < 10; i++) { i < 5 ? NumberAll[i] = 1 : NumberAll[i] = 0; } break;
        case "奇": for (var i = 0; i < 10; i++) { i % 2 == 1 ? NumberAll[i] = 1 : NumberAll[i] = 0; } break;
        case "偶": for (var i = 0; i < 10; i++) { i % 2 == 0 ? NumberAll[i] = 1 : NumberAll[i] = 0; } break;
        case "质": var zs = "1,2,3,5,7,"; for (var i = 0; i < 10; i++) { zs.indexOf(i + ",") == -1 ? NumberAll[i] = 0 : NumberAll[i] = 1; } break;
        case "合": var zs = "0,4,6,8,9,"; for (var i = 0; i < 10; i++) { zs.indexOf(i + ",") == -1 ? NumberAll[i] = 0 : NumberAll[i] = 1; } break;
        case "反": for (var i = 0; i < 10; i++) {
            if (iType == "WW") { NumberAll[i] = NumWW[i]; }
            else if (iType == "QW") { NumberAll[i] = NumQW[i]; }
            else if (iType == "BW") { NumberAll[i] = NumBW[i]; }
            else if (iType == "SW") { NumberAll[i] = NumSW[i]; }
            else if (iType == "GW") { NumberAll[i] = NumGW[i]; }
            NumberAll[i] == 0 ? NumberAll[i] = 1 : NumberAll[i] = 0;
        } break;
        case "清": for (var i = 0; i < 10; i++) { NumberAll[i] = 0; } break;
    }
    switch (iType) {
        case "WW":
            for (var i = 0; i < 10; i++) { NumWW[i] = NumberAll[i]; }
            for (var i = 0; i < 12; i++) {
                if (id == $("WWSX_" + i)) { if (tmp != "清") { id.className = "sx_sscSel_1"; } }
                else { $("WWSX_" + i).className = "sx_sscSel"; }
            }
            break;
        case "QW":
            for (var i = 0; i < 10; i++) { NumQW[i] = NumberAll[i]; }
            for (var i = 0; i < 12; i++) {
                if (id == $("QWSX_" + i)) { if (tmp != "清") { id.className = "sx_sscSel_1"; } }
                else { $("QWSX_" + i).className = "sx_sscSel"; }
            }
            break;
        case "BW":
            for (var i = 0; i < 10; i++) { NumBW[i] = NumberAll[i]; }
            for (var i = 0; i < 12; i++) {
                if (id == $("BWSX_" + i)) { if (tmp != "清") { id.className = "sx_sscSel_1"; } }
                else { $("BWSX_" + i).className = "sx_sscSel"; }
            }
            break;
        case "SW":
            for (var i = 0; i < 10; i++) { NumSW[i] = NumberAll[i]; }
            for (var i = 0; i < 12; i++) {
                if (id == $("SWSX_" + i)) { if (tmp != "清") { id.className = "sx_sscSel_1"; } }
                else { $("SWSX_" + i).className = "sx_sscSel"; }
            }
            break;
        case "GW":
            for (var i = 0; i < 10; i++) { NumGW[i] = NumberAll[i]; }
            for (var i = 0; i < 12; i++) {
                if (id == $("GWSX_" + i)) { if (tmp != "清") { id.className = "sx_sscSel_1"; } }
                else { $("GWSX_" + i).className = "sx_sscSel"; }
            }
            break;
    }
    ShowBall();
}
/*添加号码到投注框*/
function AddNum() {
    vBetStrBall = "";
    ShowBall();
    if (vSSCBetType == "五星") {
        if (vCountZ < 1) {
            alert("五星投注每一位至少选择一个号码进行投注！")
            return;
        }
        if (vSSCBetMode == "标准") {
            vBetStrBall = vStrBallWW + "," + vStrBallQW + "," + vStrBallBW + "," + vStrBallSW + "," + vStrBallGW;
            if (vCountZ > 1) {
                addDiv("自选|五标复式|" + vBetStrBall, "自选|五标复式|" + vBetStrBall);
            } else {
                addDiv("自选|五标单式|" + vBetStrBall, "自选|五标单式|" + vBetStrBall);
            }
        } else if (vSSCBetMode == "复选" || vSSCBetMode == "通选") {
            var vTempWW = [], vTempQW = [], vTempBW = [], vTempSW = [], vTempGW = [];
            for (var i = 0; i < vStrBallWW.length; i++) { vTempWW[i] = vStrBallWW.substring(i, i + 1); }
            for (var i = 0; i < vStrBallQW.length; i++) { vTempQW[i] = vStrBallQW.substring(i, i + 1); }
            for (var i = 0; i < vStrBallBW.length; i++) { vTempBW[i] = vStrBallBW.substring(i, i + 1); }
            for (var i = 0; i < vStrBallSW.length; i++) { vTempSW[i] = vStrBallSW.substring(i, i + 1); }
            for (var i = 0; i < vStrBallGW.length; i++) { vTempGW[i] = vStrBallGW.substring(i, i + 1); }
            for (var i = 0; i < vTempWW.length; i++) {
                for (var j = 0; j < vTempQW.length; j++) {
                    for (var k = 0; k < vTempBW.length; k++) {
                        for (var m = 0; m < vTempSW.length; m++) {
                            for (var n = 0; n < vTempGW.length; n++) {
                                vBetStrBall = vTempWW[i] + "," + vTempQW[j] + "," + vTempBW[k] + "," + vTempSW[m] + "," + vTempGW[n];
                                if (vSSCBetMode == "复选") addDiv("自选|五星复选|" + vBetStrBall, "自选|五星复选|" + vBetStrBall);
                                if (vSSCBetMode == "通选") addDiv("自选|五星通选|" + vBetStrBall, "自选|五星通选|" + vBetStrBall);
                            }
                        }
                    }
                }
            }
        }
    }
    else if (vSSCBetType == "三星") {
        if (vCountZ < 1) {
            if (vSSCBetMode == "组三复式") {
                alert("组三复式至少选择两个号码进行投注！");
            } else if (vSSCBetMode == "组六复式") {
                alert("组六复式至少选择四个号码进行投注！");
            } else {
                alert("三星投注百位、十位、个位至少选择一个号码进行投注！\n三星组三必须有两位相同，且只能有两位相同！\n三星组六三个码号必须不同！")
            }
            return;
        }
        if (vSSCBetMode == "标准") {
            vBetStrBall = "-,-," + vStrBallBW + "," + vStrBallSW + "," + vStrBallGW;
            if (vCountZ > 1) {
                addDiv("自选|三标复式|" + vBetStrBall, "自选|三标复式|" + vBetStrBall);
            } else {
                addDiv("自选|三标单式|" + vBetStrBall, "自选|三标单式|" + vBetStrBall);
            }
        } else if (vSSCBetMode == "复选") {
            var vTempBW = [], vTempSW = [], vTempGW = [];
            for (var i = 0; i < vStrBallBW.length; i++) { vTempBW[i] = vStrBallBW.substring(i, i + 1); }
            for (var i = 0; i < vStrBallSW.length; i++) { vTempSW[i] = vStrBallSW.substring(i, i + 1); }
            for (var i = 0; i < vStrBallGW.length; i++) { vTempGW[i] = vStrBallGW.substring(i, i + 1); }
            for (var k = 0; k < vTempBW.length; k++) {
                for (var m = 0; m < vTempSW.length; m++) {
                    for (var n = 0; n < vTempGW.length; n++) {
                        vBetStrBall = "-,-," + vTempBW[k] + "," + vTempSW[m] + "," + vTempGW[n];
                        addDiv("自选|三星复选|" + vBetStrBall, "自选|三星复选|" + vBetStrBall);
                    }
                }
            }
        } else if (vSSCBetMode == "组三") {
            for (var i = 0; i < vZSArr.length; i++) {
                addDiv("自选|三星组三|-,-," + vZSArr[i], "自选|三星组三|-,-," + vZSArr[i]);
            }
        } else if (vSSCBetMode == "组六") {
            for (var i = 0; i < vZLArr.length; i++) {
                addDiv("自选|三星组六|-,-," + vZLArr[i], "自选|三星组六|-,-," + vZLArr[i]);
            }
        } else if (vSSCBetMode == "组三复式" || vSSCBetMode == "组六复式") {
            var vZSFSTemp = "";
            for (var i = 0; i < vStrBallGW.length; i++) { vZSFSTemp += vStrBallGW.substring(i, i + 1) + ","; }
            vZSFSTemp = vZSFSTemp.substring(0, vZSFSTemp.length - 1);
            addDiv("自选|三星" + vSSCBetMode + "|" + vZSFSTemp, "自选|三星" + vSSCBetMode + "|" + vZSFSTemp);
        }
    }
    else if (vSSCBetType == "二星") {
        if (vCountZ < 1) {
            alert("二星投注十位、个位至少选择一个号码进行投注！\n组选十位和个位号码不能相同！\n分组十位或个位号码必须为两个或两个以上！")
            return;
        }
        if (vSSCBetMode == "标准") {
            vBetStrBall = "-,-,-," + vStrBallSW + "," + vStrBallGW;
            if (vCountZ > 1) {
                addDiv("自选|二标复式|" + vBetStrBall, "自选|二标复式|" + vBetStrBall);
            } else {
                addDiv("自选|二标单式|" + vBetStrBall, "自选|二标单式|" + vBetStrBall);
            }
        } else if (vSSCBetMode == "复选") {
            var vTempSW = [], vTempGW = [];
            for (var i = 0; i < vStrBallSW.length; i++) { vTempSW[i] = vStrBallSW.substring(i, i + 1); }
            for (var i = 0; i < vStrBallGW.length; i++) { vTempGW[i] = vStrBallGW.substring(i, i + 1); }
            for (var m = 0; m < vTempSW.length; m++) {
                for (var n = 0; n < vTempGW.length; n++) {
                    vBetStrBall = "-,-,-," + vTempSW[m] + "," + vTempGW[n];
                    addDiv("自选|二星复选|" + vBetStrBall, "自选|二星复选|" + vBetStrBall);
                }
            }
        } else if (vSSCBetMode == "组选" || vSSCBetMode == "分组") {
            addDiv(vRXZX, vRXZX);
        }
        else if (vSSCBetMode == "组选复式") {
            var sTempADD = vRXZX.split('^');
            for (var i = 0; i < sTempADD.length - 1; i++) {
                addDiv(sTempADD[i], sTempADD[i]);
            }
        }
    }
    else if (vSSCBetType == "一星") {
        if (vCountZ < 1) {
            alert("请选择一注码号进行投注！")
            return;
        }
        var vTempGW = [];
        for (var i = 0; i < vStrBallGW.length; i++) { vTempGW[i] = vStrBallGW.substring(i, i + 1); }
        for (var i = 0; i < vTempGW.length; i++) {
            vBetStrBall = "-,-,-,-," + vTempGW[i];
            addDiv("自选|一星标准|" + vBetStrBall, "自选|一星标准|" + vBetStrBall);
        }
    } else if (vSSCBetType == "大小单双") {
        if (NumDXSW == "" || NumDXGW == "") {
            alert("请选择一注码号进行投注！")
            return;
        }
        vBetStrBall = "自选|大小单双|" + NumDXSW + "," + NumDXGW;
        var vDxdsNum = "自选|大小单双|" + DxdxToNum(NumDXSW) + "," + DxdxToNum(NumDXGW);
        addDiv(vDxdsNum, vBetStrBall);
    } else if (vSSCBetType == "和值") {
        if (vSSCBetMode == "三星") {
            if (vSxHzArr.length < 1) {
                alert("请选择一注码号进行投注！")
                return;
            }
            for (var i = 0; i < vSxHzArr.length; i++) {
                vBetStrBall = "自选|三星和值|" + vSxHzArr[i];
                addDiv(vBetStrBall, vBetStrBall);
            }
        } else if (vSSCBetMode == "二星") {
            if (vRxHzArr.length < 1) {
                alert("请选择一注码号进行投注！")
                return;
            }
            for (var i = 0; i < vRxHzArr.length; i++) {
                vBetStrBall = "自选|二星和值|" + vRxHzArr[i];
                addDiv(vBetStrBall, vBetStrBall);
            }
        }
    } else if (vSSCBetType == "包点") {

        if (vSSCBetMode == "三组标准") {
            if (vSxBdArr.length < 1) {
                alert("请选择一注码号进行投注！")
                return;
            }
            for (var i = 0; i < vSxBdArr.length; i++) {
                vBetStrBall = "自选|三组和值|" + vSxBdArr[i];
                addDiv(vBetStrBall, vBetStrBall);
            }
        } else if (vSSCBetMode == "二组标准") {
            if (vRxBdArr.length < 1) {
                alert("请选择一注码号进行投注！")
                return;
            }
            for (var i = 0; i < vRxBdArr.length; i++) {
                vBetStrBall = "自选|二组和值|" + vRxBdArr[i];
                addDiv(vBetStrBall, vBetStrBall);
            }
        }
    } else if (vSSCBetType == "文件") {
        var vWJAllCount = 0;
        var codeTxt = $("codetxt").value;
        while (codeTxt.indexOf('.') > 0) {
            codeTxt = codeTxt.replace('.', '@');
        }
        if (codeTxt == "") {
            alert("先输入号码到文本框中！");
            return;
        }
        var codes = codeTxt.split("\n");
        if (vSSCBetMode == "五星标准" || vSSCBetMode == "五星通选") {
            for (var i = 0; i < codes.length; i++) {
                cSingle = sTrim(GBReplace(codes[i]));
                if (cSingle != "") {
                    while (cSingle.indexOf(',') > 0) {
                        cSingle = cSingle.replace(',', '')
                    }
                    if (cSingle.length != 5) {
                        //alert(vSSCBetMode + "文件投注第" + (i + 1) + "行添加失败！");
                    }
                    else {
                        var vWJCode = "";
                        var isTrue = 0;
                        for (var j = 0; j < cSingle.length; j++) {
                            var vWJTemp = cSingle.substring(j, j + 1);
                            if (vWJTemp >= 0 && vWJTemp < 10) {
                                vWJCode += vWJTemp + ",";
                            }
                            else {
                                istrue == 1;
                                //alert(vSSCBetMode + "文件投注第" + (i + 1) + "行添加失败,单个号码不在0-9之间");
                            }
                        }
                        if (isTrue == 0) {
                            vWJCode = vWJCode.substring(0, vWJCode.length - 1);
                            if (vSSCBetMode == "五星标准") {
                                vWJCode = "文件|五标单式|" + vWJCode;
                                vWJAllCount++;
                            }
                            else {
                                vWJCode = "文件|五星通选|" + vWJCode;
                                vWJAllCount++;
                            }
                            addDiv(vWJCode, vWJCode);
                        }
                    }
                }
            }
        }
        if (vSSCBetMode == "三星标准") {
            for (var i = 0; i < codes.length; i++) {
                cSingle = sTrim(GBReplace(codes[i]));
                if (cSingle != "") {
                    while (cSingle.indexOf(',') > 0) {
                        cSingle = cSingle.replace(',', '')
                    }
                    if (cSingle.length != 3) {
                        //alert(vSSCBetMode + "文件投注第" + (i + 1) + "行添加失败！");
                    }
                    else {
                        var vWJCode = "";
                        var isTrue = 0;
                        for (var j = 0; j < cSingle.length; j++) {
                            var vWJTemp = cSingle.substring(j, j + 1);
                            if (vWJTemp >= 0 && vWJTemp < 10) {
                                vWJCode += vWJTemp + ",";
                            }
                            else {
                                isTrue = 1;
                                //alert(vSSCBetMode + "文件投注第" + (i + 1) + "行添加失败,单个号码不在0-9之间");
                            }
                        }
                        if (isTrue == 0) {
                            vWJCode = vWJCode.substring(0, vWJCode.length - 1);
                            vWJCode = "文件|三标单式|-,-," + vWJCode;
                            addDiv(vWJCode, vWJCode);
                            vWJAllCount++;
                        }
                    }
                }
            }
        }
        if (vSSCBetMode == "二星标准" || vSSCBetMode == "二星组选") {
            for (var i = 0; i < codes.length; i++) {
                cSingle = sTrim(GBReplace(codes[i]));
                if (cSingle != "") {

                    while (cSingle.indexOf(',') > 0) {
                        cSingle = cSingle.replace(',', '')
                    }
                    if (cSingle.length != 2) {
                        //alert(vSSCBetMode + "文件投注第" + (i + 1) + "行添加失败！");
                    }
                    else {
                        var vWJCode = "";
                        var isTrue = 0;
                        for (var j = 0; j < cSingle.length; j++) {
                            var vWJTemp = cSingle.substring(j, j + 1);
                            if (vWJTemp >= 0 && vWJTemp < 10) {
                                vWJCode += vWJTemp + ",";
                            }
                            else {
                                isTrue = 1;
                                alert(vSSCBetMode + "文件投注第" + (i + 1) + "行添加失败,单个号码不在0-9之间");
                            }
                        }
                        if (isTrue == 0) {
                            vWJCode = vWJCode.substring(0, vWJCode.length - 1);
                            if (vSSCBetMode == "二星标准") {
                                vWJCode = "文件|二标单式|-,-,-," + vWJCode;
                                addDiv(vWJCode, vWJCode);
                                vWJAllCount++;
                            }
                            else {
                                var vTempArr = vWJCode.split(',');
                                if (vTempArr[0] == vTempArr[1]) {
                                    //alert(vSSCBetMode + "文件投注第" + (i + 1) + "行添加失败,二星组选十位和个位号码不能相同");
                                }
                                else {
                                    vWJCode = "文件|二星组选|-,-,-," + vWJCode;
                                    addDiv(vWJCode, vWJCode);
                                    vWJAllCount++;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (vSSCBetMode == "三星组六") {
            for (var i = 0; i < codes.length; i++) {
                cSingle = sTrim(GBReplace(codes[i]));
                if (cSingle != "") {
                    while (cSingle.indexOf(',') > 0) {
                        cSingle = cSingle.replace(',', '')
                    }
                    if (cSingle.length != 3) {
                        //alert("第" + (i + 1) + "行添加失败！");
                    }
                    else {
                        var vWJCode = "";
                        var isTrue = 0;
                        for (var j = 0; j < cSingle.length; j++) {
                            var vWJTemp = cSingle.substring(j, j + 1);
                            if (vWJTemp >= 0 && vWJTemp < 10) {
                                vWJCode += vWJTemp + ",";
                            }
                            else {
                                isTrue = 1;
                                //alert("第" + (i + 1) + "行添加失败,单个号码不在0-9之间");
                            }
                        }
                        if (isTrue == 0) {
                            vWJCode = vWJCode.substring(0, vWJCode.length - 1);
                            var vTempArr = vWJCode.split(',');
                            if (vTempArr[0] != vTempArr[1] && vTempArr[0] != vTempArr[2] && vTempArr[1] != vTempArr[2]) {
                                vWJCode = "文件|三星组六|-,-," + vWJCode;
                                addDiv(vWJCode, vWJCode);
                                vWJAllCount++;
                            }
                            else {
                                //alert("第" + (i + 1) + "行添加失败,三星组六每一位不能有相同号码");
                            }
                        }
                    }
                }
            }
        }
        if (vSSCBetMode == "三星组三") {
            for (var i = 0; i < codes.length; i++) {
                cSingle = sTrim(GBReplace(codes[i]));
                if (cSingle != "") {
                    while (cSingle.indexOf(',') > 0) {
                        cSingle = cSingle.replace(',', '')
                    }
                    if (cSingle.length != 3) {
                        alert("第" + (i + 1) + "行添加失败！");
                    }
                    else {
                        var vWJCode = "";
                        var isTrue = 0;
                        for (var j = 0; j < cSingle.length; j++) {
                            var vWJTemp = cSingle.substring(j, j + 1);
                            if (vWJTemp >= 0 && vWJTemp < 10) {
                                vWJCode += vWJTemp + ",";
                            }
                            else {
                                isTrue = 1;
                                //alert("第" + (i + 1) + "行添加失败,单个号码不在0-9之间");
                            }
                        }
                        if (isTrue == 0) {
                            vWJCode = vWJCode.substring(0, vWJCode.length - 1);
                            var vTempArr = vWJCode.split(',');
                            if ((vTempArr[0] == vTempArr[1] && vTempArr[0] != vTempArr[2]) || (vTempArr[0] == vTempArr[2] && vTempArr[0] != vTempArr[1]) || (vTempArr[1] == vTempArr[2] && vTempArr[0] != vTempArr[1])) {
                                vWJCode = "文件|三星组三|-,-," + vWJCode;
                                addDiv(vWJCode, vWJCode);
                                vWJAllCount++;
                            }
                            else {
                                //alert("第" + (i + 1) + "行添加失败,三星组三必须且只能有两位数相同");
                            }
                        }
                    }
                }
            }
        }
        $("codetxt").value = "";
    }
    ResultMoney();
    if (vSSCBetType == "文件") {
        alert("请核实投注框里的号码是否和您所粘贴的号码一致！")
    }
    CleanAll();
}
function GBReplace(str) {
    var Arryq = new Array('０', '１', '２', '３', '４', '５', '６', '７', '８', '９', '，', '　', '＋', '＃');
    var Arryb = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '', '#', '#');
    for (var i = 0; i < Arryq.length; i++) {
        var re = eval("/" + Arryq[i] + "/g");
        str = str.replace(re, Arryb[i]);
    }
    str = str.replace(/\+/g, '#');
    return str;
}
/*清空投注区*/
function Clean() {
    for (var i = 0; i < 10; i++) { NumWW[i] = 0; NumQW[i] = 0; NumBW[i] = 0; NumSW[i] = 0; NumGW[i] = 0; }
    vZSArr = new Array();
    vZLArr = new Array();
    vRXZX = "";
    hySXCss("All");
    ShowBall();
}
/*清空大小单双投注区*/
function CleanDx() {
    for (var i = 0; i < 4; i++) { $("dxSW_" + i).className = "bt123"; $("dxGW_" + i).className = "bt123"; }
    NumDXGW = ""; NumDXSW = "";
}
/*清空大小单双投注区(十位)*/
function CleanDx_SW() {
    for (var i = 0; i < 4; i++) { $("dxSW_" + i).className = "bt123"; }
    NumDXSW = ""; vDxSwID = 0;
}
/*清空大小单双投注区(个位)*/
function CleanDx_GW() {
    for (var i = 0; i < 4; i++) { $("dxGW_" + i).className = "bt123"; }
    NumDXGW = ""; vDxGwID = 0;
}
/*清空和值投注*/
function CleanHz() {
    for (var i = 0; i < 28; i++) { vSxHz[i] = 0; }
    for (var i = 0; i < 19; i++) { vRxHz[i] = 0; }
    vSxBdArr = new Array();
    vRxBdArr = new Array();
    vSxHzArr = new Array();
    vRxHzArr = new Array();
    HzShowBall();
}
/*清空所有*/
function CleanAll() {
    Clean();
    CleanDx();
    CleanHz();
}
/*计算组三、组六投注注数并生成投注串*/
function SXCountBetTote(vStr) {
    var vZsZlBetTote = 0; /*注数*/
    vZSArr = new Array();
    vZLArr = new Array();
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            for (var k = 0; k < 10; k++) {
                if (vStr == "组三") {
                    if (NumBW[i] == 1 && NumSW[j] == 1 && NumGW[k] == 1) {
                        if ((i == j && i != k) || (i == k) && (j != k) || (j == k) && (i != j)) {
                            var bw = i; sw = j; gw = k;
                            var newArray = new Array(bw, sw, gw);
                            newArray.sort();
                            var temp2 = newArray[0] + "," + newArray[1] + "," + newArray[2];
                            var temp1 = 0;
                            for (var m = 0; m < vZSArr.length; m++) { if (temp2 == vZSArr[m]) { temp1 = 1; } }
                            if (temp1 != 1) { vZSArr[vZsZlBetTote] = newArray[0] + "," + newArray[1] + "," + newArray[2]; vZsZlBetTote += 1; }
                        }
                    }
                } else if (vStr == "组六") {
                    if (NumBW[i] == 1 && NumSW[j] == 1 && NumGW[k] == 1) {
                        if (i != j && i != k && j != k) {
                            var bw = i; sw = j; gw = k;
                            var newArray = new Array(bw, sw, gw);
                            newArray.sort();
                            var temp2 = newArray[0] + "," + newArray[1] + "," + newArray[2];
                            var temp1 = 0;
                            for (var m = 0; m < vZLArr.length; m++) { if (temp2 == vZLArr[m]) { temp1 = 1; } }
                            if (temp1 != 1) { vZLArr[vZsZlBetTote] = newArray[0] + "," + newArray[1] + "," + newArray[2]; vZsZlBetTote += 1; }
                        }
                    }
                }
            }
        }
    }
    return vZsZlBetTote;
}
/*计算组选、分组投注注数，并生成投注串*/
function RXCountBetTote() {
    var vRXBetTote = 0; /*注数*/
    if (vSSCBetMode == "组选复式") {
        if (vStrBallGW.length > 1) {
            vRXZX = "";
            for (var i = 0; i < vStrBallGW.length; i++) {
                for (var j = i + 1; j < vStrBallGW.length; j++) {
                    vRXZX += "自选|二星组选|-,-,-," + vStrBallGW.substr(i, 1) + "," + vStrBallGW.substr(j, 1) + "^";
                    vRXBetTote++;
                }
            }
        }
    }
    else {
        if (vStrBallSW.length == 1 && vStrBallGW.length == 1 && vStrBallSW != vStrBallGW) {
            vRXBetTote = 1;
            vRXZX = "自选|二星组选|-,-,-," + vStrBallSW + "," + vStrBallGW;
        } else if (vStrBallSW.length > 1 || vStrBallGW.length > 1) {
            vRXBetTote = vStrBallSW.length * vStrBallGW.length;
            vRXZX = "自选|二星分组|-,-,-," + vStrBallSW + "," + vStrBallGW;
        }
    }
    return vRXBetTote;
}
/*机选*/
function randomNum(id) {
    for (var i = 0; i < id; i++) {
        var tempR = new Array();
        if (vSSCBetType == "五星") {
            for (var j = 0; j < 5; j++) {
                var random = parseInt(Math.random() * 10);
                tempR[j] = parseInt(random);
            }
        } else if (vSSCBetType == "三星") {
            if (vSSCBetMode == "组三") {
                while (true) {
                    var num1 = parseInt(Math.random() * 10);
                    var num2 = parseInt(Math.random() * 10);
                    var num3 = parseInt(Math.random() * 10);
                    if ((num1 == num2 && num1 != num3) || (num1 == k) && (num2 != num3) || (num2 == num3) && (num1 != num2)) {
                        tempR = new Array(num1, num2, num3);
                        break;
                    }
                }
            } else if (vSSCBetMode == "组六") {
                for (var j = 0; j < 3; j++) {
                    var random = parseInt(Math.random() * 10);
                    for (var k = 0; k < tempR.length; k++) {
                        if (tempR[k] == random) { random = parseInt(Math.random() * 10); k = -1; }
                    }
                    tempR[j] = parseInt(random);
                }
            } else {
                for (var j = 0; j < 3; j++) {
                    var random = parseInt(Math.random() * 10);
                    tempR[j] = parseInt(random);
                }
            }
        }
        else if (vSSCBetType == "二星") {
            if (vSSCBetMode == "组选" || vSSCBetMode == "分组" || vSSCBetMode == "组选复式") {
                for (var j = 0; j < 2; j++) {
                    var random = parseInt(Math.random() * 10);
                    for (var k = 0; k < tempR.length; k++) {
                        if (tempR[k] == random) { random = parseInt(Math.random() * 10); k = -1; }
                    }
                    tempR[j] = parseInt(random);
                }
            } else {
                for (var j = 0; j < 2; j++) {
                    var random = parseInt(Math.random() * 10);
                    tempR[j] = parseInt(random);
                }
            }
        } else if (vSSCBetType == "一星") {
            var random = parseInt(Math.random() * 10);
            tempR[0] = parseInt(random);
        } else if (vSSCBetType == "大小单双") {
            var vtemp = "";
            for (var j = 0; j < 2; j++) {
                var random = parseInt(Math.random() * 12);
                if (random == 0 || random == 4 || random == 8) { vtemp = "大"; }
                else if (random == 1 || random == 5 || random == 9) { vtemp = "小"; }
                else if (random == 2 || random == 6 || random == 10) { vtemp = "单"; }
                else if (random == 3 || random == 7 || random == 11) { vtemp = "双"; }
                tempR[j] = vtemp;
            }
        }
        var strCode = tempR.join(",");
        if (vSSCBetType == "五星") {
            if (vSSCBetMode == "标准") { addDiv("机选|五标单式|" + strCode, "机选|五标单式|" + strCode); }
            if (vSSCBetMode == "复选") { addDiv("机选|五星复选|" + strCode, "机选|五星复选|" + strCode); }
            if (vSSCBetMode == "通选") { addDiv("机选|五星通选|" + strCode, "机选|五星通选|" + strCode); }
        } else if (vSSCBetType == "三星") {
            if (vSSCBetMode == "标准") { addDiv("机选|三标单式|-,-," + strCode, "机选|三标单式|-,-," + strCode); }
            if (vSSCBetMode == "复选") { addDiv("机选|三星复选|-,-," + strCode, "机选|三星复选|-,-," + strCode); }
            if (vSSCBetMode == "组三") { addDiv("机选|三星组三|-,-," + strCode, "机选|三星组三|-,-," + strCode); }
            if (vSSCBetMode == "组六") { addDiv("机选|三星组六|-,-," + strCode, "机选|三星组六|-,-," + strCode); }
        } else if (vSSCBetType == "二星") {
            if (vSSCBetMode == "标准") { addDiv("机选|二标单式|-,-,-," + strCode, "机选|二标单式|-,-,-," + strCode); }
            if (vSSCBetMode == "复选") { addDiv("机选|二星复选|-,-,-," + strCode, "机选|二星复选|-,-,-," + strCode); }
            if (vSSCBetMode == "组选" || vSSCBetMode == "分组" || vSSCBetMode == "组选复式") {
                addDiv("机选|二星组选|-,-,-," + strCode, "机选|二星组选|-,-,-," + strCode);
            }
        } else if (vSSCBetType == "一星") {
            addDiv("机选|一星标准|-,-,-,-," + strCode, "机选|一星标准|-,-,-,-," + strCode);
        } else if (vSSCBetType == "大小单双") {
            var vDxdsNum = "机选|大小单双|" + DxdxToNum(strCode.split(',')[0]) + "," + DxdxToNum(strCode.split(',')[1]);
            addDiv(vDxdsNum, "机选|大小单双|" + strCode);
        }
    }
    ResultMoney();
}
/*显示选中号码*/
function showselect(id) {
    var vTempCode = $("lispan_" + id).innerHTML.split('|');
    var vType = sTrim(vTempCode[1]);
    var vTemp = vTempCode[2].split(',');
    CleanAll();
    if (vSSCBetType == "五星") {
        if (vType == "五星标准") { $("radSSC_0").checked = true; vSSCBetMode = "标准"; }
        else if (vType == "五星复选") { $("radSSC_1").checked = true; vSSCBetMode = "复选"; }
        else if (vType == "五星通选") { $("radSSC_2").checked = true; vSSCBetMode = "通选"; }
        for (var i = 0; i < vTemp[0].length; i++) {
            NumWW[Number(vTemp[0].substring(i, i + 1))] = 1;
        }
        for (var i = 0; i < vTemp[1].length; i++) {
            NumQW[Number(vTemp[1].substring(i, i + 1))] = 1;
        }
        for (var i = 0; i < vTemp[2].length; i++) {
            NumBW[Number(vTemp[2].substring(i, i + 1))] = 1;
        }
        for (var i = 0; i < vTemp[3].length; i++) {
            NumSW[Number(vTemp[3].substring(i, i + 1))] = 1;
        }
        for (var i = 0; i < vTemp[4].length; i++) {
            NumGW[Number(vTemp[4].substring(i, i + 1))] = 1;
        }
        ShowBall();
    } else if (vSSCBetType == "三星") {
        alert
        if (vType == "三星标准") { $("radSSC_0").checked = true; vSSCBetMode = "标准"; }
        else if (vType == "三星复选") { $("radSSC_1").checked = true; vSSCBetMode = "复选"; }
        else if (vType == "三星组三") { $("radSSC_3").checked = true; vSSCBetMode = "组三"; }
        else if (vType == "三星组六") { $("radSSC_4").checked = true; vSSCBetMode = "组六"; }
        else if (vType == "三星组三复式") { $("radSSC_20").checked = true; vSSCBetMode = "组三复式"; }
        else if (vType == "三星组六复式") { $("radSSC_21").checked = true; vSSCBetMode = "组六复式"; }
        if (vType == "三星组三复式" || vType == "三星组六复式") {
            for (var i = 0; i < vTemp.length; i++) NumGW[Number(vTemp[i])] = 1;
        } else {
            for (var i = 0; i < vTemp[2].length; i++) {
                NumBW[Number(vTemp[2].substring(i, i + 1))] = 1;
            }
            for (var i = 0; i < vTemp[3].length; i++) {
                NumSW[Number(vTemp[3].substring(i, i + 1))] = 1;
            }
            for (var i = 0; i < vTemp[4].length; i++) {
                NumGW[Number(vTemp[4].substring(i, i + 1))] = 1;
            }
        }
        ShowBall();
    }
    else if (vSSCBetType == "二星") {
        if (vType == "二标单式") { $("radSSC_0").checked = true; vSSCBetMode = "标准"; }
        else if (vType == "二星复选") { $("radSSC_1").checked = true; vSSCBetMode = "复选"; }
        else if (vType == "二星组选") { $("radSSC_5").checked = true; vSSCBetMode = "组选"; }
        else if (vType == "二星分组") { $("radSSC_6").checked = true; vSSCBetMode = "分组"; }
        for (var i = 0; i < vTemp[3].length; i++) {
            NumSW[Number(vTemp[3].substring(i, i + 1))] = 1;
        }
        for (var i = 0; i < vTemp[4].length; i++) {
            NumGW[Number(vTemp[4].substring(i, i + 1))] = 1;
        }
        ShowBall();
    }
    else if (vSSCBetType == "一星") {
        if (vType == "一星标准") { $("radSSC_0").checked = true; vSSCBetMode = "标准"; }
        for (var i = 0; i < vTemp[4].length; i++) {
            NumGW[Number(vTemp[4].substring(i, i + 1))] = 1;
        }
        ShowBall();
    } else if (vSSCBetType == "大小单双") {
        SelectDX_1(vTemp.join("@"));
    }
    var checkboxUL = $("checkboxUL");
    for (var i = checkboxUL.childNodes.length - 1; i >= 0; i--) {
        if (i % 2 == 0) {
            checkboxUL.childNodes[i].style.backgroundColor = "#F0F9FE";
        } else {
            checkboxUL.childNodes[i].style.backgroundColor = "#fff";
        }
    }
    $("li_" + id).style.backgroundColor = "#d9f1ff";
}
/*五星分位遗漏投注*/
function WxFwOmitBet(vType, vStr) {
    CleanAll();
    var vTemp = vStr.split(',');
    if (vType == "QR") {
        NumWW[vTemp[0]] = 1;
        NumQW[vTemp[1]] = 1;
    } else if (vType == "HR") {
        NumSW[vTemp[0]] = 1;
        NumGW[vTemp[1]] = 1;
    } else if (vType == "QS") {
        NumWW[vTemp[0]] = 1;
        NumQW[vTemp[1]] = 1;
        NumBW[vTemp[2]] = 1;
    }
    else if (vType == "ZS") {
        NumQW[vTemp[0]] = 1;
        NumBW[vTemp[1]] = 1;
        NumSW[vTemp[2]] = 1;
    }
    else if (vType == "HS") {
        NumBW[vTemp[0]] = 1;
        NumSW[vTemp[1]] = 1;
        NumGW[vTemp[2]] = 1;
    }
    ShowBall();
}
/*三星标准遗漏投注*/
function SxBzOmitBet(vType, vStr) {
    CleanAll();
    var vTemp = vStr.split(',');
    if (vType == "DW" || vType == "BZ" || vType == "ZS") {
        NumBW[vTemp[0]] = 1;
        NumSW[vTemp[1]] = 1;
        NumGW[vTemp[2]] = 1;
    } else if (vType == "DD") {
        if (vTemp[0] != "-") { NumBW[vTemp[0]] = 1; }
        else if (vTemp[1] != "-") { NumSW[vTemp[1]] = 1; }
        else if (vTemp[2] != "-") { NumGW[vTemp[2]] = 1; }
    } else if (vType == "SD") {
        if (vTemp[0] == "-") { NumSW[vTemp[1]] = 1; NumGW[vTemp[2]] = 1; }
        else if (vTemp[1] == "-") { NumBW[vTemp[0]] = 1; NumGW[vTemp[2]] = 1; }
        else if (vTemp[2] == "-") { NumBW[vTemp[0]] = 1; NumBW[vTemp[1]] = 1; }
    }
    ShowBall();
}
/*三星形态遗漏投注*/
function SxXtOmitBet(vType, vStr) {
    CleanAll();
    var vTemp = vStr.split(',');
    if (vType == "DX") {
        for (var i = 0; i < 10; i++) {
            if (vTemp[0] == "大" && i > 4) { NumBW[i] = 1; }
            else if (vTemp[0] == "小" && i < 5) { NumBW[i] = 1; }
            if (vTemp[1] == "大" && i > 4) { NumSW[i] = 1; }
            else if (vTemp[1] == "小" && i < 5) { NumSW[i] = 1; }
            if (vTemp[2] == "大" && i > 4) { NumGW[i] = 1; }
            else if (vTemp[2] == "小" && i < 5) { NumGW[i] = 1; }
        }
    } else if (vType == "JO") {
        for (var i = 0; i < 10; i++) {
            if (vTemp[0] == "奇" && i % 2 != 0) { NumBW[i] = 1; }
            else if (vTemp[0] == "偶" && i % 2 == 0) { NumBW[i] = 1; }
            if (vTemp[1] == "奇" && i % 2 != 0) { NumSW[i] = 1; }
            else if (vTemp[1] == "偶" && i % 2 == 0) { NumSW[i] = 1; }
            if (vTemp[2] == "奇" && i % 2 != 0) { NumGW[i] = 1; }
            else if (vTemp[2] == "偶" && i % 2 == 0) { NumGW[i] = 1; }
        }
    } else if (vType == "ZH") {
        for (var i = 0; i < 10; i++) {
            if (vTemp[0] == "质" && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumBW[i] = 1; }
            else if (vTemp[0] == "合" && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumBW[i] = 1; }
            if (vTemp[1] == "质" && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumSW[i] = 1; }
            else if (vTemp[1] == "合" && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumSW[i] = 1; }
            if (vTemp[2] == "质" && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumGW[i] = 1; }
            else if (vTemp[2] == "合" && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumGW[i] = 1; }
        }
    } else if (vType == "012") {
        for (var i = 0; i < 10; i++) {
            if (vTemp[0] == "0" && i % 3 == 0) { NumBW[i] = 1; }
            else if (vTemp[0] == "1" && i % 3 == 1) { NumBW[i] = 1; }
            else if (vTemp[0] == "2" && i % 3 == 2) { NumBW[i] = 1; }
            if (vTemp[1] == "0" && i % 3 == 0) { NumSW[i] = 1; }
            else if (vTemp[1] == "1" && i % 3 == 1) { NumSW[i] = 1; }
            else if (vTemp[1] == "2" && i % 3 == 2) { NumSW[i] = 1; }
            if (vTemp[2] == "0" && i % 3 == 0) { NumGW[i] = 1; }
            else if (vTemp[2] == "1" && i % 3 == 1) { NumGW[i] = 1; }
            else if (vTemp[2] == "2" && i % 3 == 2) { NumGW[i] = 1; }
        }
    }
    ShowBall();
}
/*三星万能遗漏投注*/
function SxWnOmitBet(vStr) {
    CleanAll();
    var vTemp = new Array();
    for (var i = 0; i < vStr.length; i++) {
        vTemp[i] = vStr.substring(i, i + 1);
    }
    for (var i = 0; i < vTemp.length; i++) {
        NumBW[vTemp[i]] = 1;
        NumSW[vTemp[i]] = 1;
        NumGW[vTemp[i]] = 1;
    }
    ShowBall();
}
/*二星标准遗漏投注*/
function RxBzOmitBet(vType, vStr) {
    CleanAll();
    var vTemp = vStr.split(',');
    if (vType == "OTH") {
        NumSW[vTemp[0]] = 1;
        NumGW[vTemp[1]] = 1;
    } else if (vType == "DD") {
        if (vTemp[0] != "-") { NumSW[vTemp[0]] = 1; }
        else if (vTemp[1] != "-") { NumGW[vTemp[1]] = 1; }
    }
    ShowBall();
}
/*二星形态遗漏投注*/
function RxXtOmitBet(vType, vStr) {
    CleanAll();
    var vTemp = vStr.split(',');
    if (vType == "DXJO") {
        for (var i = 0; i < 10; i++) {
            if (vTemp[0] == "大奇" && i > 4 && i % 2 == 1) { NumSW[i] = 1; }
            else if (vTemp[0] == "大偶" && i > 4 && i % 2 == 0) { NumSW[i] = 1; }
            else if (vTemp[0] == "小奇" && i < 5 && i % 2 == 1) { NumSW[i] = 1; }
            else if (vTemp[0] == "小偶" && i < 5 && i % 2 == 0) { NumSW[i] = 1; }

            if (vTemp[1] == "大奇" && i > 4 && i % 2 == 1) { NumGW[i] = 1; }
            else if (vTemp[1] == "大偶" && i > 4 && i % 2 == 0) { NumGW[i] = 1; }
            else if (vTemp[1] == "小奇" && i < 5 && i % 2 == 1) { NumGW[i] = 1; }
            else if (vTemp[1] == "小偶" && i < 5 && i % 2 == 0) { NumGW[i] = 1; }
        }
    } else if (vType == "JOZH") {
        for (var i = 0; i < 10; i++) {
            if (vTemp[0] == "奇质" && i % 2 == 1 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumSW[i] = 1; }
            else if (vTemp[0] == "奇合" && i % 2 == 1 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumSW[i] = 1; }
            else if (vTemp[0] == "偶质" && i % 2 == 0 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumSW[i] = 1; }
            else if (vTemp[0] == "偶合" && i % 2 == 0 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumSW[i] = 1; }

            if (vTemp[1] == "奇质" && i % 2 == 1 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumGW[i] = 1; }
            else if (vTemp[1] == "奇合" && i % 2 == 1 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumGW[i] = 1; }
            else if (vTemp[1] == "偶质" && i % 2 == 0 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumGW[i] = 1; }
            else if (vTemp[1] == "偶合" && i % 2 == 0 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumGW[i] = 1; }
        }
    } else if (vType == "DXZH") {
        for (var i = 0; i < 10; i++) {
            if (vTemp[0] == "大质" && i > 4 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumSW[i] = 1; }
            else if (vTemp[0] == "大合" && i > 4 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumSW[i] = 1; }
            else if (vTemp[0] == "小质" && i < 5 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumSW[i] = 1; }
            else if (vTemp[0] == "小合" && i < 5 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumSW[i] = 1; }

            if (vTemp[1] == "大质" && i > 4 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumGW[i] = 1; }
            else if (vTemp[1] == "大合" && i > 4 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumGW[i] = 1; }
            else if (vTemp[1] == "小质" && i < 5 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumGW[i] = 1; }
            else if (vTemp[1] == "小合" && i < 5 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumGW[i] = 1; }
        }
    } else if (vType == "012") {
        for (var i = 0; i < 10; i++) {
            if (vTemp[0] == "0" && i % 3 == 0) { NumSW[i] = 1; }
            else if (vTemp[0] == "1" && i % 3 == 1) { NumSW[i] = 1; }
            else if (vTemp[0] == "2" && i % 3 == 2) { NumSW[i] = 1; }
            if (vTemp[1] == "0" && i % 3 == 0) { NumGW[i] = 1; }
            else if (vTemp[1] == "1" && i % 3 == 1) { NumGW[i] = 1; }
            else if (vTemp[1] == "2" && i % 3 == 2) { NumGW[i] = 1; }
        }
    }
    ShowBall();
}
/*一星标准遗漏投注*/
function YxBzOmitBet(vType, vStr) {
    CleanAll();
    if (vType == "YX") {
        NumGW[Number(vStr)] = 1;
    } else if (vType == "DXJO") {
        for (var i = 0; i < 10; i++) {
            if (vStr == "大奇" && i > 4 && i % 2 == 1) { NumGW[i] = 1; }
            else if (vStr == "大偶" && i > 4 && i % 2 == 0) { NumGW[i] = 1; }
            else if (vStr == "小奇" && i < 5 && i % 2 == 1) { NumGW[i] = 1; }
            else if (vStr == "小偶" && i < 5 && i % 2 == 0) { NumGW[i] = 1; }
        }
    } else if (vType == "JOZH") {
        for (var i = 0; i < 10; i++) {
            if (vStr == "奇质" && i % 2 == 1 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumGW[i] = 1; }
            else if (vStr == "奇合" && i % 2 == 1 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumGW[i] = 1; }
            else if (vStr == "偶质" && i % 2 == 0 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumGW[i] = 1; }
            else if (vStr == "偶合" && i % 2 == 0 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumGW[i] = 1; }
        }
    } else if (vType == "DXZH") {
        for (var i = 0; i < 10; i++) {
            if (vStr == "大质" && i > 4 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumGW[i] = 1; }
            else if (vStr == "大合" && i > 4 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumGW[i] = 1; }
            else if (vStr == "小质" && i < 5 && (i == 1 || i == 2 || i == 3 || i == 5 || i == 7)) { NumGW[i] = 1; }
            else if (vStr == "小合" && i < 5 && (i == 0 || i == 4 || i == 6 || i == 8 || i == 9)) { NumGW[i] = 1; }
        }
    } else if (vType == "012") {
        for (var i = 0; i < 10; i++) {
            if (vStr == "0" && i % 3 == 0) { NumGW[i] = 1; }
            else if (vStr == "1" && i % 3 == 1) { NumGW[i] = 1; }
            else if (vStr == "2" && i % 3 == 2) { NumGW[i] = 1; }
        }
    }
    ShowBall();
}
/*三星和值包点遗漏投注*/
function SxHzOmitBet(vType, vStr) {
    CleanAll();
    if (vType == "HZ") { vSxHz[Number(vStr)] = 1; }
    else if (vType == "HW") {
        for (var i = 0; i < 28; i++) {
            if (i < 10 && i.toString().substring(0, 1) == vStr) { vSxHz[i] = 1; }
            if (i > 9 && i.toString().substring(1, 2) == vStr) { vSxHz[i] = 1; }
        }
    }
    else if (vType == "HZD") {
        var vTemp = vStr.split('-');
        for (var i = Number(vTemp[0]); i < Number(vTemp[1]) + 1; i++) {
            vSxHz[i] = 1;
        }
    }
    HzShowBall();
}
/*二星和值包点遗漏投注*/
function RxHzOmitBet(vType, vStr) {
    CleanAll();
    if (vType == "HZ") { vRxHz[Number(vStr)] = 1; }
    else if (vType == "HW") {
        for (var i = 0; i < 19; i++) {
            if (i < 10 && i.toString().substring(0, 1) == vStr) { vRxHz[i] = 1; }
            if (i > 9 && i.toString().substring(1, 2) == vStr) { vRxHz[i] = 1; }
        }
    }
    else if (vType == "HZD") {
        var vTemp = vStr.split('-');
        for (var i = Number(vTemp[0]); i < Number(vTemp[1]) + 1; i++) {
            vRxHz[i] = 1;
        }
    }
    HzShowBall();
}
/*显示追号层*/
function ShowZhDiv() {
    vIsZh = $("chkZH").checked;
    if (vIsZh) {
        ShowToolOrZh(1);
        $("SSCHzDiv").style.display = "block";
        $("sscCurDiv").style.display = "none";
        $("span_BS").style.display = "none";
        $("chkStopZh").checked = true;
        BetMaxIssue();
        ChangeZhIssue();
    } else {
        $("zhIssue").value = 2;
        $("SSCHzDiv").style.display = "none";
        $("sscCurDiv").style.display = "inline";
        $("span_BS").style.display = "inline";
        $("allIssues").innerHTML = 1;
        $("zhInfo").innerHTML = "";
        ResultMoney();
        return;
    }
}
/*显示倍投工具或追号层*/
function ShowToolOrZh(id) {
    if (id == 1) {
        AddZhInfo(2);
        ShowZh();
    } else if (id == 2) {
        ResultMoney();
        $("radZhTool").checked = true;
        $("zh_ZDY").style.display = "none";
        $("allIssues").innerHTML = "0";
        $("zh_Tool").style.display = "block";
        $("zhIssue").value = 2;
        $("BtToolBS").value = 1;
    }
}
/*显示追号层*/
function ShowZh() {
    $("radZhZDY").checked = true;
    $("zh_ZDY").style.display = "block";
    $("zh_Tool").style.display = "none";
    $("BtToolIssue").value = 2;
    $("toolInfo").innerHTML = "";
}
/*最大投注期数*/
function BetMaxIssue() {
    var vCurIssue = sTrim($("curIssue").innerHTML); /*当前期*/
    $("maxIssue").innerHTML = 241 - Number(vCurIssue.substring(6, 9));
    $("BTmaxIssue").innerHTML = 241 - Number(vCurIssue.substring(6, 9));
}
/*改变追号期数*/
function ChangeZhIssue() {
    var vIssue = parseInt($("zhIssue").value);
    var vMax = Number($("maxIssue").innerHTML);
    if (vIssue < 1 || isNaN(vIssue)) { vIssue = 2; }
    else if (vIssue > vMax) { vIssue = vMax; }
    $("zhIssue").value = vIssue;
    AddZhInfo(vIssue);
}
/*快捷追号*/
function KJZh(vMaxIssue) {
    AddZhInfo(vMaxIssue);
}
/*添加追号信息*/
function AddZhInfo(vMaxIssue) {
    $("zhInfo").innerHTML = "";
    var vCurIssue = sTrim($("curIssue").innerHTML); /*当前期*/
    for (var i = 0; i < vMaxIssue; i++) {
        var vTemp = vCurIssue.toString().split("");
        var vYmd = "20" + vTemp[0] + vTemp[1] + "-" + vTemp[2] + vTemp[3] + "-" + vTemp[4] + vTemp[5];
        var vIssue = vTemp[6] + vTemp[7] + vTemp[8];
        var vZhInfo = document.createElement("ul");
        vZhInfo.className = "sscbetul";
        vZhInfo.id = "zhul_" + i;
        vZhInfo.innerHTML = "<li class='ssczhli1'><input checked='true'  id='CheZhInfo_" + i + "' onclick='StopZh(" + vMaxIssue + "," + i + ")' type='checkbox' ></li>" +
            "<li class='ssczhli2' id='liIssue_" + i + "'>" + vCurIssue + "</li>" +
            "<li class='ssczhli3'><input id='TxtZhInfo_" + i + "' type='text'onkeyup='ChangeBetAmount(" + i + ")' value='1' maxlength='4' class='inputTxt ssczhiss'></li>" +
            "<li class='ssczhli4' id='CurTR_" + i + "'>￥0</li>" +
            "<li class='ssczhli4' id='CumTR_" + i + "'>￥0</li>" +
            "<li class='ssczhli5' id='Bonus_" + i + "'>--</li>" +
            "<li class='ssczhli5' id='Profit_" + i + "'>--</li>";
        $("zhInfo").appendChild(vZhInfo);
        if (Number(vIssue) >= 120) {
            vCurIssue = GetZhIssue(vYmd, 1) + "001";
        } else {
            vCurIssue = Number(vCurIssue) + 1;
        }
    }
    ResultMoney();
}
/*计算金额*/
function ResultMoney() {
    var iIssueCount = 0; /*总共多少期*/
    var total = 0; /*总投注注数*/
    var alltotal = 0; /*总投注注数乘以总投注倍数*/
    var sTemp = 0;
    if ($("radZhZDY").checked) { sTemp = $("zhIssue").value; }
    else if ($("radZhTool").checked) { sTemp = $("BtToolIssue").value; }
    var len = $("checkboxUL").childNodes.length;
    if (len <= 0) { $("chkZH").disabled = true; }
    else { $("chkZH").disabled = false; }
    if (len > 1) { $("radZhTool").checked = false; $("radZhZDY").checked = true; }

    if (len > 0) {
        for (var i = 0; i < liCount; i++) {
            var vLiSpan = $("lispan_" + i);
            if (vLiSpan != null && vLiSpan != "" && vLiSpan != "undefined") {
                var vTempCode = vLiSpan.innerHTML.split('|');
                var vTemp = vTempCode[2].split(',');
                var vTempCount = 1;
                if (vTempCode[1] == "五星复选") { vTempCount = 4; }
                else if (vTempCode[1] == "三星复选") { vTempCount = 3; }
                else if (vTempCode[1] == "二星复选") { vTempCount = 2; }
                else if (vTempCode[1] == "二组和值") { vTempCount = vSum2Zu[vTempCode[2]]; }
                else if (vTempCode[1] == "三组和值") { vTempCount = vSum3Zu[vTempCode[2]]; }
                else if (vTempCode[1] == "三星和值") { vTempCount = vSum3[vTempCode[2]]; }
                else if (vTempCode[1] == "二星和值") { vTempCount = vSum2[vTempCode[2]]; }
                else if (vTempCode[1] == "三星组三复式") { var izsfsLen = vTempCode[2].split(',').length; vTempCount = GetZSFsCount(izsfsLen); }
                else if (vTempCode[1] == "三星组六复式") { var izsfsLen = vTempCode[2].split(',').length; vTempCount = GetZLFsCount(izsfsLen); }
                else { for (var j = 0; j < vTemp.length; j++) { vTempCount *= vTemp[j].length; } }
                total += vTempCount;
                if (len > 1) { vCurBonus = "--"; $("radZhTool").disabled = true; ShowZh(); }
                else {
                    $("radZhTool").disabled = false;
                    if (vTempCode[1] == "五标单式") { vCurBonus = "100000"; }
                    else if (vTempCode[1] == "五标复式") { vCurBonus = "100000"; }
                    else if (vTempCode[1] == "五星复选") { vCurBonus = "101110"; }
                    else if (vTempCode[1] == "五星通选") { vCurBonus = "20000"; }
                    else if (vTempCode[1] == "三标单式") { vCurBonus = "1000"; }
                    else if (vTempCode[1] == "三标复式") { vCurBonus = "1000"; }
                    else if (vTempCode[1] == "三星复选") { vCurBonus = "1110"; }
                    else if (vTempCode[1] == "三星组三" || vTempCode[1] == "三星组三复式") { vCurBonus = "320"; }
                    else if (vTempCode[1] == "三星组六" || vTempCode[1] == "三星组六复式") { vCurBonus = "160"; }
                    else if (vTempCode[1] == "二标单式") { vCurBonus = "100"; }
                    else if (vTempCode[1] == "二标复式") { vCurBonus = "100"; }
                    else if (vTempCode[1] == "二星复选") { vCurBonus = "110"; }
                    else if (vTempCode[1] == "二星组选") { vCurBonus = "50"; }
                    else if (vTempCode[1] == "二星分组") { vCurBonus = "50"; }
                    else if (vTempCode[1] == "一星标准") { vCurBonus = "10"; }
                    else if (vTempCode[1] == "大小单双") { vCurBonus = "4"; }
                }
                vBetCountTool = vTempCount;
            }
        }
    } else { $("radZhTool").disabled = true; ShowZh(); }
    if (vIsZh) {
        for (var i = 0; i <= sTemp; i++) {
            if ($("radZhZDY").checked) {
                var vCheZhInfo = $("CheZhInfo_" + i);
                if (vCheZhInfo != null && vCheZhInfo != "" && vCheZhInfo != "undefined") {
                    var vHCurTR = $("CurTR_" + i);
                    var vHCumTR = $("CumTR_" + i);
                    var vHBonus = $("Bonus_" + i);
                    var vHProfit = $("Profit_" + i);
                    if (vCheZhInfo.checked == true) {
                        iIssueCount = iIssueCount + 1;
                        var vZHinfo = $("TxtZhInfo_" + i).value;
                        alltotal += total * vZHinfo;
                        var vCumTR = alltotal * 2;
                        vHCurTR.innerHTML = "￥" + total * vZHinfo * 2;
                        vHCumTR.innerHTML = "￥" + vCumTR;
                        if (vCurBonus != "--") {
                            vHBonus.innerHTML = "￥" + vZHinfo * Number(vCurBonus);
                            vHProfit.innerHTML = "￥" + (vZHinfo * Number(vCurBonus) - Number(vCumTR));
                        }
                        else { vHBonus.innerHTML = "--"; vHProfit.innerHTML = "--"; }
                    } else {
                        vHCurTR.innerHTML = "--"; vHCumTR.innerHTML = "--";
                        vHBonus.innerHTML = "--"; vHProfit.innerHTML = "--";
                    }
                    if (len <= 0) {
                        vHBonus.innerHTML = "--"; vHProfit.innerHTML = "--";
                        $("chkZH").checked = false;
                        ShowZhDiv();
                    }
                }
            } else if ($("radZhTool").checked) {
                var vzhToolMul = $("zhToolMul_" + i);
                if (vzhToolMul != null && vzhToolMul != "" && vzhToolMul != "undefined") {
                    iIssueCount = iIssueCount + 1;
                    alltotal += total * vzhToolMul.value;
                }
            }
        }
    } else {
        alltotal += total * $("BetBS").value; iIssueCount = 1;
    }
    $("BetCount").innerHTML = alltotal;
    $("allBets").innerHTML = alltotal;
    $("allIssues").innerHTML = iIssueCount;
    $("allMoney").innerHTML = alltotal * 2;
    vBetMoney = alltotal * 2; /*总投注金额*/
}

/*日期转换成20110620 /vDay为浮动的天数，vYmd格式是2011-06-20*/
function GetZhIssue(vYmd, vDay) {
    vDay--;
    var vTemp = vYmd.toString().split("-");
    vTemp[1] = vTemp[1] - 1;
    vTemp[2] = vTemp[2] * 1 + vDay;
    var vDayNow = new Date(vTemp[0], vTemp[1], vTemp[2]) - 0 + 24 * 60 * 60 * 1000
    var dt = new Date(vDayNow);
    var vYY = dt.getFullYear().toString().substring(2, 4);
    var vMM = dt.getMonth() + 1;
    var vDD = dt.getDate();
    if ((vMM == 2 && vDD > 17) && (vMM == 2 && vDD < 25)) { vMM = 2; vDD = 25 } /*春节*/
    var vMonth, vDate;
    if (vMM * 1 < 10) { vMonth = "0" + vMM } else { vMonth = vMM; }
    if (vDD * 1 < 10) { vDate = "0" + vDD } else { vDate = vDD; }
    return vYY + "" + vMonth + vDate;
}
/*某一期停止追号*/
function StopZh(vMax, id) {
    var vCountzH = 0;
    for (var i = 0; i < vMax; i++) {
        if ($("CheZhInfo_" + i).checked == true) { vCountzH++; }
    }
    if (vCountzH < 2) {
        $("CheZhInfo_" + id).checked = true;
    }
    ResultMoney();
}
/*变改投注倍数*/
function ChangeBetAmount(iCur) {
    var vAmount = parseInt($("TxtZhInfo_" + iCur).value);
    if (vAmount < 1 || isNaN(vAmount)) { vAmount = 1; }
    if (vAmount > 5000) { vAmount = 5000; }
    $("TxtZhInfo_" + iCur).value = vAmount;
    for (var i = iCur; i < 240; i++) {
        if ($("TxtZhInfo_" + i) != null && $("TxtZhInfo_" + i) != "" && $("TxtZhInfo_" + i) != "undefined") {
            $("TxtZhInfo_" + i).value = vAmount;
        }
    }
    ResultMoney();
}
/*生成期号*/
var xmlIssue = false;
try {
    xmlIssue = new ActiveXObject("Msxml2.XMLHTTP");
}
catch (e) {
    try {
        xmlIssue = new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch (e2) {
        xmlIssue = false;
    }
}
if (!xmlIssue && typeof XMLHttpRequest != 'undefined') {
    xmlIssue = new XMLHttpRequest();
}
var tSystiem = new Date();
function DlcIssue() {
    var now = new Date();
    var url1 = "/Game/ShortIssues.aspx?time=" + now + "&type=" + vMd5 + "&iType=Ssc";
    xmlIssue.open("GET", url1, true);
    xmlIssue.onreadystatechange = nowDlcIssue;
    xmlIssue.send("");
}
function nowDlcIssue() {
    if (xmlIssue.readyState == 4) {
        var response = xmlIssue.responseText;
        var str = response.split("$");
        var vFrist = $("CurIss").innerHTML;
        if (sTrim(vFrist) != "第-期" && vFrist != "第期" && vFrist != "第" + str[0] + "期" && str[0] != "" && str[0].length == vFrist.length - 2) {
            cfm.crtdiv(180, 335, "", " 您好，重庆时时彩" + vFrist + "已截止<br />当前销售期为" + str[0] +
                "期<br />投注时请确认您选择的期号！<br >", "<img src='/Images/game/oth/confirm.gif' onclick='cfm.close()'/>", "");
        }
        $("CurIss").innerHTML = "第" + str[0] + "期";
        $("curIssue").innerHTML = str[0];
        var Sys_endTime = str[1].replace(" ", ",").replace(":", ",").replace("-", ",").replace(":", ",").replace("-", ",");
        var sys_Timt_Array = Sys_endTime.split(',');
        var sys_year = Number(sys_Timt_Array[0]);
        var sys_month = Number(sys_Timt_Array[1]);
        var sys_day = Number(sys_Timt_Array[2]);
        var sys_hour = Number(sys_Timt_Array[3]);
        var sys_minute = Number(sys_Timt_Array[4]);
        var sys_second = Number(sys_Timt_Array[5]);
        tSystiem.setFullYear(sys_year, (sys_month - 1), sys_day);
        tSystiem.setHours(sys_hour, sys_minute, 0, 0);
    }
}
/*获得开奖号码*/
var xmlOpenNum = false;
try { xmlOpenNum = new ActiveXObject("Msxml2.XMLHTTP"); }
catch (e) {
    try { xmlOpenNum = new ActiveXObject("Microsoft.XMLHTTP"); }
    catch (e2) { xmlOpenNum = false; }
}
if (!xmlOpenNum && typeof XMLHttpRequest != 'undefined') { xmlOpenNum = new XMLHttpRequest(); }
function openNumber() {
    var now = new Date();
    url = "/Game/GetNum.aspx?iType=3&time=" + now;
    xmlOpenNum.open("GET", url, true);
    xmlOpenNum.onreadystatechange = nowOpenUpdate;
    xmlOpenNum.send(null);
    setTimeout("openNumber()", 10000);
}
function nowOpenUpdate() {
    if (xmlOpenNum.readyState == 4) { var response = xmlOpenNum.responseText; $("OpenNum").innerHTML = response; }
}
/*倒计时*/
function SSCshowTime() {
    setTimeout("SSCshowTime()", 1000);
    //结果时间
    var endTime = tSystiem.getTime();
    //开始时间
    var dCurrent = new Date();
    var dCTime = dCurrent.getTime() + dOffset;
    var iMinute = parseInt((endTime - dCTime) / 1000 / 60);
    var iSecond = parseInt((endTime - dCTime) / 1000) % 60;
    if (iMinute == 0 && iSecond == 0) {
        $("BalanceTime").innerHTML = "加载中";
        $("chkZH").checked = false;
        ShowZhDiv();
    }
    if (isNaN(iMinute) || isNaN(iSecond) || iSecond % 10 == 0) {
        timesync();
        DlcIssue();
    }
    if (iMinute < 10) { iMinute = "0" + iMinute; }
    if (iSecond < 10) { iSecond = "0" + iSecond }
    $("BalanceTime").innerHTML = "<li>" + iMinute + "<b>分</b></li><li><span>" + iSecond + "</span><b>秒</b></li>";
}
/*倍投工具*/
function BetTool() {
    var tool = new SerialBetTool();
    var inputs = document.getElementsByName("redTool");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked == true) {
            tool.ProjectType = parseInt(inputs[i].value, 10);  /*方案类型：1=全程利润比率；2=两步利利润比率；3=全程利润金额；4=两步利润金额*/
            break;
        }
    }
    tool.TicketBuyMoney = vBetCountTool * 2;   /*购买金额*/
    tool.OriginalMultiple = parseInt($("BtToolBS").value, 10); /*起始倍数*/
    tool.BonusMoney = Number(vCurBonus);  //this.Parent.BonusMoney;//单票中奖金额
    tool.AllProfitsRate = parseFloat($("txtProfit_1").value, 10) / 100;  //全程利润比率
    tool.AllProfitsMoney = parseInt($("txtProfit_5").value, 10);  //全程利润金额
    tool.AllIssueCount = parseInt($("BtToolIssue").value, 10);  //总投注期数
    tool.SplitIssueCount = tool.ProjectType == 2 ? parseInt($("txtProfit_2").value, 10) : parseInt($("txtProfit_6").value, 10); //分隔投注期数
    tool.ForepartProfitsRate = parseFloat($("txtProfit_3").value, 10) / 100;  //前面部分利润比率
    tool.AfterpartProfitsRate = parseFloat($("txtProfit_4").value, 10) / 100;  //后面部分利润比率
    tool.ForepartProfitsMoney = parseInt($("txtProfit_7").value, 10);  //前面部分利润金额
    tool.AfterpartProfitsMoney = parseInt($("txtProfit_8").value, 10);  //后面部分利润金额
    var listResult = new SerialBetModel();
    listResult = tool.Count();
    var vMax = Number($("BTmaxIssue").innerHTML);
    if (listResult != null) {
        var vCurIssue = sTrim($("curIssue").innerHTML); /*当前期*/
        if (listResult.length > vMax) {
            listResult.length = vMax;
        }
        $("toolInfo").innerHTML = "";
        for (var i = 0; i < listResult.length; i++) {
            var vTemp = vCurIssue.toString().split("");
            var vYmd = "20" + vTemp[0] + vTemp[1] + "-" + vTemp[2] + vTemp[3] + "-" + vTemp[4] + vTemp[5];
            var vIssue = vTemp[6] + vTemp[7] + vTemp[8];
            var vZhInfo = document.createElement("ul");
            vZhInfo.className = "sscbetul";
            vZhInfo.id = "zhul_" + i;
            vZhInfo.innerHTML = "<li class='ssczhli7' id='liToolIssue_" + i + "'>" + vCurIssue + "</li>" +
                "<li class='ssczhli6'><input type='hidden' id='jsqahslt' name='ahslt' value='" + vCurIssue + "'/>" +
                "<input type='hidden' name='jsqahbeishu' id='zhToolMul_" + i + "' value='" + listResult[i].Multiple + "'/>" + listResult[i].Multiple + "</li>" +
                "<li class='ssczhli7' id='jsqa" + vCurIssue + "'>￥" + listResult[i].CurrentBuyMoney + "</li>" +
                "<li class='ssczhli7' id='jsqz" + vCurIssue + "'>￥" + listResult[i].AllBuyMoney + "</li>" +
                "<li class='ssczhli7'>￥" + listResult[i].BonusMoney + "</li>" +
                "<li class='ssczhli8'>￥" + listResult[i].ProfitsMoney + "</li>" +
                "<li class='ssczhli8'>" + parseInt(listResult[i].ProfitsRate * 100, 10) + "%</li>";
            $("toolInfo").appendChild(vZhInfo);
            if (Number(vIssue) >= 120) {
                vCurIssue = GetZhIssue(vYmd, 1) + "001";
            } else {
                vCurIssue = Number(vCurIssue) + 1;
            }
        }
        $("BtToolIssue").value = listResult.length;
        ResultMoney();
    } else {
        alert(tool.ErrorMessage);
    }
}
/*txet发生改变*/
function ChangeTool(id, value, vType) {
    var vTemp = parseInt(id.value);
    id.value = vTemp;
    if (vType == "Issue") {
        var vMax = Number($("BTmaxIssue").innerHTML);
        if (vTemp > vMax) { id.value = vMax; }
    }
    if (vTemp < value || isNaN(vTemp)) { id.value = value; }
}
var timetti = 10;
var timettmode = "0-0-0-0-0";
var strtext = "0,0,0,0,0";
var arrTmp = strtext.split(",");
var strcodestring = "";
var strcodearr = "";
var vFlashIssue = "";

function threestate1(thparam) {
    var xingtai = "";
    if (thparam[2] == thparam[3] && thparam[3] == thparam[4])
        xingtai = "豹子";
    if (thparam[2] == thparam[3] || thparam[2] == thparam[4] || thparam[3] == thparam[4])
        xingtai = "组三";
    if (thparam[2] != thparam[3] && thparam[2] != thparam[4] && thparam[3] != thparam[4])
        xingtai = "组六";
    return xingtai;

}
function threestate2(thparam) {
    var xingtai = ""
    xingtai = (parseInt(thparam[3]) + parseInt(thparam[4])) + ""
    return xingtai;
}
function threestate3(thparam) {
    var xingtai = ""
    xingtai = (parseInt(thparam[2]) + parseInt(thparam[3]) + parseInt(thparam[4])) + ""
    return xingtai;
}
function threestate4(thparam) {
    var xingtai = ""
    if (parseInt(thparam[3]) > 4)
        xingtai += "大";
    else
        xingtai += "小";

    if (parseInt(thparam[4]) > 4)
        xingtai += "大";
    else
        xingtai += "小";

    return xingtai;
}
function threestate5(thparam) {
    var xingtai = ""
    var daisstr = "13579";
    if (parseInt(thparam[3]) > 4)
        xingtai += "大";
    else
        xingtai += "小";

    if (daisstr.indexOf(thparam[4]) >= 0)
        xingtai += "单";
    else
        xingtai += "双";

    return xingtai;
}
function threestate6(thparam) {
    var xingtai = ""
    var daisstr = "13579";

    if (daisstr.indexOf(thparam[3]) >= 0)
        xingtai += "单";
    else
        xingtai += "双";

    if (parseInt(thparam[4]) > 4)
        xingtai += "大";
    else
        xingtai += "小";
    return xingtai;
}
function threestate7(thparam) {
    var xingtai = ""
    var daisstr = "13579";

    if (daisstr.indexOf(thparam[3]) >= 0)
        xingtai += "单";
    else
        xingtai += "双";

    if (daisstr.indexOf(thparam[4]) >= 0)
        xingtai += "单";
    else
        xingtai += "双";
    return xingtai;
}

var xmlHttpFlash = false;

try {
    xmlHttpFlash = new ActiveXObject("Msxml2.XMLHTTP");
}
catch (e) {
    try {
        xmlHttpFlash = new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch (e2) {
        xmlHttpFlash = false;
    }
}
if (!xmlHttpFlash && typeof XMLHttpRequest != 'undefined') {
    xmlHttpFlash = new XMLHttpRequest();
}
function callback() {
    setTimeout("callback()", 10000)
    var now = new Date();
    var url = "/Game/GetNum.aspx?iType=11&name=" + Math.random();
    xmlHttpFlash.open("GET", url, true);
    xmlHttpFlash.onreadystatechange = updatePage;
    xmlHttpFlash.send(null);
}

var FlashStr = "";
var FlashGo = 0;
function updatePage() {
    if (xmlHttpFlash.readyState == 4) {
        FlashStr = xmlHttpFlash.responseText;
        if (FlashGo == 0) {
            FlashRun();
            FlashGo = 1;
        }
    }
}

function FlashRun() {
    var str = FlashStr.split("|");
    strtext = str[1];
    var vOpenIss = str[0];
    arrTmp = strtext.split(",");
    var nowIssues = $("curIssue").innerHTML;
    var vGoFlash = false;
    if (vOpenIss == nowIssues - 1) {
        vGoFlash = true;
        vFlashIssue = vOpenIss;
    }
    else if (nowIssues.substring(nowIssues.length - 3, nowIssues.length) == "001" && vOpenIss.substring(vOpenIss.length - 3, vOpenIss.length) == "120") {
        vGoFlash = true;
        vFlashIssue = vOpenIss;
    }
    else {
        vGoFlash = false;
        timetti = 7;
    }
    if (vGoFlash == true && timetti == 10) {
        getFlash("myflaone").SetVariable('qinum', str[0]);
        timettmode = strtext;
        timetti = 1;
        getFlash("myflaone").SetVariable('wucode', "h");
        getFlash("myflaone").SetVariable('xingt1', "");
        getFlash("myflaone").SetVariable('xingt2', "");
        getFlash("myflaone").SetVariable('xingt3', "");
        getFlash("myflaone").SetVariable('xingt4', "");
        getFlash("myflaone").SetVariable('xingt5', "");
        getFlash("myflaone").SetVariable('xingt6', "");
        getFlash("myflaone").SetVariable('xingt7', "");
        getFlash("myflaone").SetVariable('codestr', timettmode);
        getFlash("myflaone").SetVariable('code1', '');
        getFlash("myflaone").SetVariable('code2', '');
        getFlash("myflaone").SetVariable('code3', '');
        getFlash("myflaone").SetVariable('code4', '');
        getFlash("myflaone").SetVariable('code5', '');
    }
    else if (timetti == 7) {
        if (vOpenIss == nowIssues - 1) {
            vGoFlash = true;
            timetti = 10;
            vFlashIssue = vOpenIss;
        }
        else if (nowIssues.substring(nowIssues.length - 3, nowIssues.length) == "001" && vOpenIss.substring(vOpenIss.length - 3, vOpenIss.length) == "120") {
            vGoFlash = true;
            timetti = 10;
            vFlashIssue = vOpenIss;
        }
        else {
            getFlash("myflaone").SetVariable('code1', '');
            getFlash("myflaone").SetVariable('code2', '');
            getFlash("myflaone").SetVariable('code3', '');
            getFlash("myflaone").SetVariable('code4', '');
            getFlash("myflaone").SetVariable('code5', '');
            getFlash("myflaone").SetVariable('qinum', "等待开奖...");
            getFlash("myflaone").SetVariable('fengcode', "");
            getFlash("myflaone").SetVariable('wucode', "h");
            getFlash("myflaone").SetVariable('sweizhi', 1);
            getFlash("myflaone").TGotoFrame('ssc', 1);
            getFlash("myflaone").TPlay('ssc');
        }
    }
    if (timetti <= 5) {
        if (timetti == 2) {
            getFlash("myflaone").SetVariable('wucode', "y");
        }
        getFlash("myflaone").SetVariable('fengcode', arrTmp[timetti - 1]);
        getFlash("myflaone").SetVariable('sweizhi', timetti);
        getFlash("myflaone").TGotoFrame('ssc', 1);
        getFlash("myflaone").TPlay('ssc');
        if (timetti == 5) {
            getFlash("myflaone").SetVariable('xingt1', threestate1(arrTmp));
            getFlash("myflaone").SetVariable('xingt2', threestate2(arrTmp));
            getFlash("myflaone").SetVariable('xingt3', threestate3(arrTmp));
            getFlash("myflaone").SetVariable('xingt4', threestate4(arrTmp));
            getFlash("myflaone").SetVariable('xingt5', threestate5(arrTmp));
            getFlash("myflaone").SetVariable('xingt6', threestate6(arrTmp));
            getFlash("myflaone").SetVariable('xingt7', threestate7(arrTmp));
        }
        timetti++;
    }
    setTimeout("FlashRun()", 1000);
}
function getFlash(movieName) {
    if (window.document[movieName]) {
        return window.document[movieName];
    }
    if (navigator.appName.indexOf("Microsoft Internet") == -1) {
        if (document.embeds && document.embeds[movieName])
            return document.embeds[movieName];
    }
    else {
        return document.getElementById(movieName);
    }
}
/*组三复式注数*/
function GetZSFsCount(n) {
    var vN = 1;
    var vM = 1;
    for (var i = n; i > 0; i--) { vN = vN * i; }
    for (var i = n - 2; i > 0; i--) { vM = vM * i; }
    if (n < 2) { return 0; }
    return vN / vM;
}
/*组六复式注数*/
function GetZLFsCount(n) {
    var vN = 1;
    var vM = 1;
    for (var i = n; i > 0; i--) { vN = vN * i; }
    for (var i = n - 3; i > 0; i--) { vM = vM * i; }
    if (n < 4) { return 0; }
    return vN / (vM * 6);
}