/**
 * Created by linyng on 17-5-20.
 */
var liCount = 0; //投注div条数
var isBetZH = false; //是否追号

/*添加到数据库时使用*/
var vBetStr = ""; /*投注串*/
var vStrIssue = ""; /*投注期号*/
var vBetMoney = 0; /*投注金额*/
var vBetCount = 0; /*投注总注数*/
var vStopMoney = 0; /*停止追号金额(奖金)*/


function $_N(name) {
    return document.getElementsByName(name);
}

function GetZH(m, n)	//取从m中取n的组合
{
    var cm = 1, cn = 1, ct = 1;
    if (m < n) { return 0; }
    for (var i = 1; i <= m; i++) cm *= i; //m的阶乘
    for (i = 1; i <= n; i++) cn *= i; //m的阶乘
    for (i = 1; i <= m - n; i++) ct *= i; //m-n的阶乘
    return Math.round(cm / (cn * ct))
}

//添加到投注DIV
function addDiv(strball, strvalue) {
    var addli = document.createElement("li");
    if (liCount % 2 == 0) {
        addli.className = "checkboxli1";
    } else {
        addli.className = "checkboxli";
    }
    addli.id = "li_" + liCount;
    addli.innerHTML = "<span id = 'lispan_" + liCount + "' style='display:none;'>" + strball + "</span><span class='betinfo' onclick='showselect(" + liCount + ")' >" + strvalue + "</span><span class='betinfodel'><a href='javascript:delCheck(" + liCount + ")'>删除</a></span>";
    $("checkboxUL").appendChild(addli);
    liCount++;
}
//删除选中
function delCheck(id) {
    showselect(id);
    var delUL = $("checkboxUL");
    for (var i = 0; i < delUL.childNodes.length; i++) {
        var liname = delUL.childNodes[i].id;
        liname = liname.split('_')[1];
        if (liname == id) {
            delUL.removeChild(delUL.childNodes[i]);
            break;
        }
    }
    for (var i = 0; i < delUL.childNodes.length; i++) {
        if (i % 2 == 0) { delUL.childNodes[i].style.backgroundColor = "#F0F9FE"; }
        else { delUL.childNodes[i].style.backgroundColor = "#fff"; }
    }
    ResultMoney();
}
//清空投注框
function cleanCode() {
    var delUL = $("checkboxUL");
    if (delUL != null) {
        for (var i = delUL.childNodes.length - 1; i >= 0; i--) {
            delUL.removeChild(delUL.childNodes[i]);
        }
        liCount = 0;
        ResultMoney();
    }
    else {
        liCount = 0;
        GetMoney();
    }
}

//显示期号
function showIss() {
    if ($("ddlIssues") != null && $("ddlIssues") != "" && $("ddlIssues") != "undefined") {
        var vCount = $("ddlIssues").value;
        var vName = $("GameName").value;
        GetIssue(vCount, vName);
        IncGetPageWH();
        ResultMoney();
    }
}
/*2011-5-13*/
/*显示追号层*/
function ShowZHDiv() {
    var isZH = $("chkZH").checked;
    var ZHDiv = $("ZHDiv");
    if (isZH) {
        ZHDiv.style.display = "block";
        isBetZH = true;
    } else {
        ZHDiv.style.display = "none";
        isBetZH = false;
    }
    IncGetPageWH();
    $("chkStopZh").checked = false;
    $("txtZHMoney").disabled = true;
    ResultMoney();
}

/*2011-10-24*/
/*隐藏追号和合买层*/
function hiddenDiv() {
    var isBuy = $("BuyType_0").checked;
    if (isBuy) {
        isBetZH = false;
        $("ZHDiv").style.display = "none"
    }
    ResultMoney();
}




//账户中心登录
function AccountUserLogin() {
    var vTemp = $("isWebLogin")
    if (vTemp != "undefined" && vTemp != null && vTemp != "" && vIsUser == "True") {
        parent.location.reload();
        window.location.href = "";
    }
}
/*2011-10-24*/

/*单期追号倍数是否可操作*/
function hiddenZHAmount(id) {
    var isZH = $("iOpenNumber" + id).checked;
    var ZHAmount = $("iDouble" + id);
    if (isZH) {
        ZHAmount.disabled = false;
    } else {
        ZHAmount.disabled = true;
    }
}
/*追号金额是否可操作*/
function ZHMoney() {
    var chkMoney = $("chkStopZh").checked;
    var txtMoney = $("txtZHMoney");
    if (chkMoney) {
        txtMoney.disabled = false;
        vStopMoney = txtMoney.value;
    } else {
        txtMoney.disabled = true;
        vStopMoney = 0;
    }
}
/*投注倍数*/
function ChangeDoubleAll(cur) {
    cur.value = cur.value.replace('.', ',')
    if (isNaN(cur.value)) {
        cur.value = "1";
    }
    if (ToInteger(cur.value) <= 0) {
        cur.value = "1";
    }
    if (isNotNum(cur.value)) {
        cur.value = "1";
    }
    for (var i = 1; i <= 30; i++) {
        if ($("iDouble" + i) != null && $("iDouble" + i) != "" && $("iDouble" + i) != "undefined") {
            $("iDouble" + i).value = cur.value;
        }
    }
    ResultMoney();
}
/*单期投注倍数*/
function ChangeDouble(cur) {
    cur.value = cur.value.replace('.', ',')
    if (isNaN(cur.value)) {
        cur.value = "1";
        return false;
    }
    if (ToInteger(cur.value) <= 0) {
        cur.value = "1";
        return false;
    }
    if (isNotNum(cur.value)) {
        cur.value = "1";
    }
    ResultMoney();
}
/*ff checkbox还原*/
function hyChk() {
    for (var i = 0; i <= 30; i++) {
        if ($("iOpenNumber" + i) != null) {
            $("iOpenNumber" + i).checked = true;
            $("iDouble" + i).disabled = false;
        }
    }
    $("chkStopZh").checked = false;
    $("chkZH").checked = false;
}

function hyChkGame(id) {
    if (id != "ssc" && id != "xync" && id != "dlc") { showTime(); hyChk(); showIss(); }
    if (id == "ssq") { spcleanCode(); znSituation(); $("radStan").checked = true; $("BuyType_0").checked = true; }
    else if (id == "dlt") { spcleanCode(); znSituation(); $("radBet_0").checked = true; }
    else if (id == "qlc") { $("radStan").checked = true; $("BuyType_0").checked = true; }
    else if (id == "3d") { HZomit(); hyControl(); $("BuyType_0").checked = true; }
    else if (id == "pl3") { HZomit(); $("radZX").checked = true; }
    else if (id == "pl5") { $("PL5Rad_0").checked = true; }
    else if (id == "qxc") { $("QxcRad_0").checked = true; }
    else if (id == "ssc" || id == "xync" || id == "dlc") { Init(); }
    cleanCode();
}
/*追号停止金额*/
function ZHStopMoney() {
    var vMult = parseInt($("txtZHMoney").value);
    if (isNaN(vMult)) {
        vMult = 10000;
    }
    $("txtZHMoney").value = vMult;
    vStopMoney = vMult;
}

function parseInteger(v) {
    return parseInt(parseFloat(v) * 1.0);
}
function ToInteger(v) {
    return Number(parseFloat(v) * 1.0);
}
function isNotNum(str) {
    var pattern = /\d/;
    return !pattern.test(str);
}
/*去掉空格*/
function sTrim(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
}
function ToString(v) {
    var rsl = "";
    var lsv = 0;
    for (var i = 0; i < v.length; i++) {
        if (ToInteger(v[i]) != lsv) {
            rsl += I2(ToInteger(v[i]));
            if (i < (v.length - 1)) rsl += ",";
            lsv = ToInteger(v[i]);
        }
    }
    return rsl;
}
function I2(n) {
    return (n < 10) ? "0" + n : n;
}

function I3(v) {
    if (v < 10) return "00" + v;
    if (v < 100) return "0" + v;
    return v;
}
/*时间*/
function CompressResultdateshow() {
    var XMLHTTPDATE;
    if (window.ActiveXObject) {
        XMLHTTPDATE = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (window.XMLHttpRequest) {
        XMLHTTPDATE = new XMLHttpRequest();
    }
    XMLHTTPDATE.open("GET", "/game/time.aspx?ab=" + Math.random(), false);
    XMLHTTPDATE.setRequestHeader("Content-Type", "text/xml");
    XMLHTTPDATE.send("");
    if (XMLHTTPDATE.readyState == 4) {
        dastr = XMLHTTPDATE.responseText.replace("-", ",");
        dastr = dastr.replace("-", ",");
        dastr = dastr.replace(" ", ",");
        dastr = dastr.replace(":", ",");
        dastr = dastr.replace(":", ",");
        return dastr;
    }
    delete XMLHTTPDATE;
}
/*计算服务器和本地时差*/
var dOffset;
function timesync() {
    var abcd = CompressResultdateshow();
    var abcdarr = abcd.split(',');
    var system_time_year = abcdarr[0];
    var system_time_month = abcdarr[1];
    var system_time_day = abcdarr[2];
    var system_time_hour = abcdarr[3];
    var system_time_minute = I2(abcdarr[4]);
    var system_time_second = I2(abcdarr[5]);
    var tSystem = new Date(2009, 9, 29, 11, 22, 42);
    var tLocal = new Date();
    tSystem = new Date(Number(system_time_year),
        Number(system_time_month) - 1,
        Number(system_time_day),
        Number(system_time_hour),
        Number(system_time_minute),
        Number(system_time_second));
    dOffset = tSystem.getTime() - tLocal.getTime();
}

function RefreshTime() {
    var t = new Date();
    t.setTime(t.getTime() + dOffset);
    var t_y = I2(t.getFullYear());
    var t_m = I2(t.getMonth() + 1);
    var t_d = I2(t.getDate());
    var t_h = I2(t.getHours());
    var t_n = I2(t.getMinutes());
    var t_s = I2(t.getSeconds());
    var vNowTime = t_y + "-" + t_m + "-" + t_d + " " + t_h + ":" + t_n + ":" + t_s;
    if ($("nowStopTime").innerHTML == vNowTime) {
        location.reload();
    }
}

function showTime() {
    /*结果时间*/
    var endTime = $("nowStopTime").innerHTML;
    endTime = endTime.split(" ");
    var sDate = endTime[0].split("-");
    var sTime = endTime[1].split(":");
    endTime = new Date(sDate[0], sDate[1] - 1, sDate[2], sTime[0], sTime[1], sTime[2]);
    /*开始时间*/
    var startTime = new Date();
    startTime.setTime(startTime.getTime() + dOffset);
    /*总毫秒数*/
    var countMilli = endTime.getTime() - startTime.getTime();
    /*总秒数*/
    var countSecond = countMilli / 1000;
    /*对秒数取整*/
    var iCountSecond = Math.floor(countSecond);
    /*获得天数*/
    var day = countMilli / (60 * 60 * 24 * 1000);
    /*对天数取整*/
    var iDay = Math.floor(day);
    /*获得小时数*/
    var hour = (day - iDay) * 24;
    /*对小时取整*/
    var iHour = Math.floor(hour);
    /*获得分钟数*/
    var minute = (hour - iHour) * 60;
    /*对分钟取整*/
    var iMinute = Math.floor(minute);
    /*获得秒数*/
    var second = (minute - iMinute) * 60;
    /*对秒数取整*/
    var iSecond = Math.floor(second);
    if (iSecond % 10 == 0) { timesync(); }
    $("BalanceTime").innerHTML = "<ul class='Time'><li class='Tiem_2'>" + iDay +
        "</li><li class='Tiem_1'>天</li><li class='Tiem_2'>" + iHour +
        "</li><li class='Tiem_1'>时</li><li class='Tiem_2'>" + iMinute +
        "</li><li class='Tiem_1'>分</li><li class='Tiem_2'>" + iSecond +
        "</li><li class='Tiem_1'>秒</li><ul>";
    setTimeout("showTime()", 1000);
    RefreshTime();

}
/*在现有时间上增加天数*/
function AddDays(NowDate, days) {
    return new Date(NowDate.getTime() + days * 24 * 60 * 60 * 1000);
}
/*成生期号*/
function GetIssue(iCount, id) {
    var vInit = Number(($("nowissues").innerHTML)) - 1;
    var vTemp = sTrim($("nowStopTime").innerHTML).split(" ")[0].split('-');
    var vDate = new Date(vTemp[0], vTemp[1] - 1, vTemp[2]);
    var vStr = "";
    var vTime = new Date();
    for (var i = 1; i <= iCount; i++) {
        vInit = Number(vInit) + 1;

        if (id == "3d" || id == "pl3" || id == "pl5") {
            if (i == 1) { vTime = vDate; }
            else { vTime = AddDays(vTime, 1); }
        }
        else if (id == "ssq") {
            if (i == 1) { vTime = vDate; }
            else {
                if (vTime.getDay() == 2 || vTime.getDay() == 0) { vTime = AddDays(vTime, 2); }
                else if (vTime.getDay() == 4) { vTime = AddDays(vTime, 3); }
            }
        } else if (id == "qlc") {
            if (i == 1) { vTime = vDate; }
            else {
                if (vTime.getDay() == 1 || vTime.getDay() == 3) { vTime = AddDays(vTime, 2); }
                else if (vTime.getDay() == 5) { vTime = AddDays(vTime, 3); }
            }
        } else if (id == "dlt") {
            if (i == 1) { vTime = vDate; }
            else {
                if (vTime.getDay() == 1 || vTime.getDay() == 6) { vTime = AddDays(vTime, 2); }
                else if (vTime.getDay() == 3) { vTime = AddDays(vTime, 3); }
            }
        } else if (id == "qxc") {
            if (i == 1) { vTime = vDate; }
            else {
                if (vTime.getDay() == 5 || vTime.getDay() == 0) { vTime = AddDays(vTime, 2); }
                else if (vTime.getDay() == 2) { vTime = AddDays(vTime, 3); }
            }
        }
        if (IsSpringTime(vTime)) {
            if (id == "3d" || id == "pl3" || id == "pl5") { vTime = new Date(2015, 1, 24); }
            else if (id == "qlc") { vTime = new Date(2015, 1, 25); }
            else if (id == "qxc") { vTime = new Date(2013, 1, 29); }
            else if (id == "ssq") { vTime = new Date(2015, 1, 26); }
            else if (id == "dlt") { vTime = new Date(2013, 1, 30); }
        }
        var t = new Date();
        t.setTime(t.getTime() + dOffset);
        if (vTime.getFullYear() != t.getFullYear() &&
            Number(vInit.toString().substring(0, 4)) != vTime.getFullYear()) {
            vInit = vTime.getFullYear() + "001";
        }
        var vTemp1 = "";
        if (i < 10) { vTemp1 = "0" + i; } else { vTemp1 = i; }
        var vTemp2 = vTime.getFullYear() + "-" + I2(vTime.getMonth() + 1) + "-" + I2(vTime.getDate());
        vStr += "<li>" + vTemp1 + "."
            + "<input type='checkbox' id='iOpenNumber" + i + "' checked='true'"
            + " value='" + vInit + "' onclick='hiddenZHAmount(" + i + "),ResultMoney();'>"
            + " &nbsp;第" + vInit + "期&nbsp;&nbsp;"
            + vTemp2 + "&nbsp;&nbsp;<input type=text id='iDouble" + i + "' value='1' class='inputTxt redzhiss' maxlength='4' onkeyup='ChangeDouble(this);' onclick='ResultMoney();'> 倍"
            + "</li>";
    }
    $("showissues").innerHTML = vStr;
}
/*春节*/
function IsSpringTime(vDate) {
    var IsSpring = false;
    var vTimeB = new Date(2015, 1, 18);
    var vTimeE = new Date(2015, 1, 24);
    if (vTimeB <= vDate && vDate <= vTimeE) {
        IsSpring = true;
    }
    return IsSpring;
}
/*------------确认投注---------------*/
var xmlBet = false;
try { xmlBet = new ActiveXObject("Msxml2.XMLHTTP"); }
catch (e) {
    try { xmlBet = new ActiveXObject("Microsoft.XMLHTTP"); }
    catch (e2) { xmlBet = false; }
}
if (!xmlBet && typeof XMLHttpRequest != 'undefined') { xmlBet = new XMLHttpRequest(); }

function NoBet() {
    alert("该游戏暂停销售！");
    return;
}
/*投注方法*/
function BetToDB(name, iCount) {
    if (name == "ssq" || name == "3d" || name == "qlc" || name == "pl3" || name == "pl5" || name == "dlt" || name == "qxc") {
        GetBetInfoLong(iCount);
    }
    else if (name == "lucky" || name == "ssc" || name == "dlc") { GetBetInfo(iCount); }
    else if (name == "SFC" || name == "RJC" || name == "6BQC" || name == "JQC") { GetSFCInfo(); }
    if (vIsUser != "True") {
        alert("您未登录，请登录后再进行投注！")
        return;
    }
    if (vBetCount < 1) {
        alert("请选择一注号码进行投注！");
        return;
    }
    var vtestbetStr = vBetStr; ///////////////////////////////////////----------------------------------/////////////////////////
    vBetStr = escape(vBetStr);

    vStrIssue = vStrIssue.substring(0, vStrIssue.length - 1);
    var vBetStopZH = 1; /*是否停止追号;1-停止,0-继续 */
    if (name != "SFC" && name != "RJC" && name != "6BQC" && name != "JQC") {
        if (!$("chkStopZh").checked) {
            vBetStopZH = 0;
            vStopMoney = 0;
        }
    }
    var vExtend = 2;
    if (name == "dlt") {
        var checkMoney = $("allMoney").innerHTML;
        var checkBet = $("allBets").innerHTML;
        if (checkMoney / checkBet == 3) { vExtend = 3; }
        else { vExtend = 2; }
    }
    cfm.crtdiv(170, 335, "确认对话框", "投注提交中，请稍后……<br />&nbsp;", " ", "");
    var vSendUrl = "/game/betticket.aspx"; /*链接地址*/
    var vSendStr = "StopZh=" + vBetStopZH + "&BetStr=" + vBetStr + "&IdNum="
        + vStrIssue + "&StopMoney=" + vStopMoney + "&Money=" + vBetMoney + "&GameName=" + name + "&iExtend=" + vExtend + "&Pass=" + vPass; /*参数*/
    var testtest = "StopZh=" + vBetStopZH + "&BetStr=" + vtestbetStr + "&IdNum="
        + vStrIssue + "&StopMoney=" + vStopMoney + "&Money=" + vBetMoney + "&GameName=" + name + "&iExtend=" + vExtend + "&Pass=" + vPass; /*参数*/
    xmlBet.open("POST", vSendUrl, true);
    //alert(testtest);
    xmlBet.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlBet.send(vSendStr);

    xmlBet.onreadystatechange = BetCode;
    cleanCode();
    if (name == "SFC" || name == "RJC" || name == "6BQC" || name == "JQC") { ClearSoccer(); }
}
/*投注返回信息*/
function BetCode() {
    if (xmlBet.readyState == 4) {
        var response = xmlBet.responseText;
        var str = response.split(",");
        var result = str[0];
        if (result == "1") {
            cfm.crtdiv(170, 335, "确认对话框", "委托成功！<br >&nbsp;请在投注记录中查看出票状态", "<img src='/Images/game/oth/confirm.gif' onclick='cfm.close()'/>", "");
        } else if (result == "0") {
            cfm.crtdiv(170, 335, "确认对话框", "投注失败，请查证！<br >&nbsp;", "<img src='/Images/game/oth/confirm.gif' onclick='cfm.close()'/>", "");
        } else if (result == "-1") {
            cfm.crtdiv(170, 335, "确认对话框", "您的余额不足！<br >&nbsp;", "<img src='/Images/game/oth/confirm.gif' onclick='cfm.close()'/>", "");
        } else if (result == "-2") {
            cfm.crtdiv(170, 335, "确认对话框", "验证失败，请查证！<br >&nbsp;", "<img src='/Images/game/oth/confirm.gif' onclick='cfm.close()'/>", "");
        } else if (result == "-3") {
            cfm.crtdiv(170, 335, "确认对话框", "投注异常，请查证！<br >&nbsp;", "<img src='/Images/game/oth/confirm.gif' onclick='cfm.close()'/>", "");
        } else if (result == "-4") {
            cfm.crtdiv(170, 335, "确认对话框", "该合买方案已截止！<br >&nbsp;", "<img src='/Images/game/oth/confirm.gif' onclick='cfm.close()'/>", "");
        } else if (result == "-5") {
            cfm.crtdiv(170, 335, "确认对话框", "投注失败，投注期销售已停止！<br >&nbsp;", "<img src='/Images/game/oth/confirm.gif' onclick='cfm.close()'/>", "");
        } else if (result == "-9") {
            cfm.crtdiv(170, 335, "确认对话框", "登录超时，请重新登录！<br >&nbsp;", "<img src='/Images/game/oth/confirm.gif' onclick='cfm.close()'/>", "");
        }
    }
    vBetCount = 0;
}



/*快开投注信息*/
function GetBetInfo(iCount) {
    vBetStr = ""; /*投注串*/
    vStrIssue = ""; /*投注期号*/
    if (vIsZh) {
        for (var i = 0; i <= iCount; i++) {
            if ($("radZhZDY").checked) {
                if ($("CheZhInfo_" + i) != null && $("CheZhInfo_" + i) != "" && $("CheZhInfo_" + i) != "undefined") {
                    if ($("CheZhInfo_" + i).checked == true) {
                        vStrIssue += sTrim($("liIssue_" + i).innerHTML) + ";";
                        vStrIssue += $("TxtZhInfo_" + i).value + "^";
                    }
                }
            }
            else if ($("radZhTool").checked) {
                if ($("zhToolMul_" + i) != null && $("zhToolMul_" + i) != "" && $("zhToolMul_" + i) != "undefined") {
                    vStrIssue += sTrim($("liToolIssue_" + i).innerHTML) + ";";
                    vStrIssue += $("zhToolMul_" + i).value + "^";
                }
            }
        }
    } else {
        vStrIssue = sTrim($("curIssue").innerHTML) + ";";
        vStrIssue += $("BetBS").value + "^";
    }
    if ($("checkboxUL").childNodes.length > 0) {
        for (var i = 0; i < liCount; i++) {
            if ($("lispan_" + i) != null && $("lispan_" + i) != "" && $("lispan_" + i) != "undefined") {
                vBetStr += $("lispan_" + i).innerHTML + "^";
                vBetCount++;
            }
        }
    }
}
/*长周期投注信息*/
function GetBetInfoLong(iCount) {
    vBetStr = ""; /*投注串*/
    vStrIssue = ""; /*投注期号*/
    if (isBetZH) {
        for (var i = 0; i <= iCount; i++) {
            if ($("iOpenNumber" + i) != null && $("iOpenNumber" + i) != "" && $("iOpenNumber" + i) != "undefined") {
                if ($("iOpenNumber" + i).checked == true) {
                    vStrIssue += "" + $("iOpenNumber" + i).value + ";";
                    vStrIssue += $("iDouble" + i).value + "^";
                }
            }
        }
    } else {
        vStrIssue = sTrim($("nowissues").innerHTML) + ";";
        vStrIssue += $("BetBS").value + "^";
    }
    if ($("checkboxUL").childNodes.length > 0) {
        for (var i = 0; i < liCount; i++) {
            if ($("lispan_" + i) != null && $("lispan_" + i) != "" && $("lispan_" + i) != "undefined") {
                vBetStr += $("lispan_" + i).innerHTML + "^";
                vBetCount++;
            }
        }
    }
}
/*2011-10-25*/
/*长周期投注信息*/
function GetTogeBetInfoLong() {
    vBetStr = ""; /*投注串*/
    vStrIssue = ""; /*投注期号*/
    vStrIssue = sTrim($("nowissues").innerHTML) + ";";
    vStrIssue += $("BetBS").value + "^";
    if ($("checkboxUL").childNodes.length > 0) {
        for (var i = 0; i < liCount; i++) {
            if ($("lispan_" + i) != null && $("lispan_" + i) != "" && $("lispan_" + i) != "undefined") {
                vBetStr += $("lispan_" + i).innerHTML + "^";
                vBetCount++;
            }
        }
    }
}
/**2011-10-25/
 /*跳转到当前页面*/
function CurrentPage() {
    parent.location.reload();
    window.location.href = location.href;
}