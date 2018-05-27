$(document).ready(function () {
    //when first time into chat room.
    showLogin();

    $('#login').on('click', login);
    $('#registe').on('click', register);
    $('#setRoleName').on('click', setRoleName);
    $('#getRecords').on('click', getRecords);
    $('#setPhone').on('click', setPhone);
    $('#setPinCode').on('click', setPinCode);
    $('#bet').on('click', bet);
    $('#unBet').on('click', unBet);
    $('#myIncome').on('click', myIncome);
    $('#myBets').on('click', myBets);
    $('#friendIncome').on('click', friendIncome);
    $('#winRateRankList').on('click', winRateRankList);
    $('#todayRichRankList').on('click', todayRichRankList);


    $('#adminLogin').on('click', adminLogin);
    $('#recharge').on('click', recharge);
    $('#cash').on('click', cash);
    $('#setConfig').on('click', setConfig);
    $('#playerCtrl').on('click', playerCtrl);
    $('#backendOpenCode').on('click', backendOpenCode);
    $('#getPlayerBaseInfo').on('click', getPlayerBaseInfo);

    var _adminClient =  new window.adminClient();

    function adminLogin() {
        _adminClient.login('sys', '759d56e7a39f4d1c9a846c9d57f5c2bd', function (err, result) {
            if (!!err) {
                console.log('管理员登录失败,', err);
                return;
            }
            console.log('管理员登录成功');
        })
    }

    function recharge() {
        _adminClient.recharge(2, 10000, 'admin','alipay@126.com',function (err, result) {
            if (!!err) {
                console.log('充值失败:', err);
                return;
            }
            console.log('充值成功');
        })
    }

    function cash() {
        _adminClient.cash(2, 3, 2,'sys','wechat@163.com', function (err, result) {
            if (!!err) {
                console.log('提现失败:', err);
                return;
            }
            console.log('提现成功');
        })
    }
    
    function playerCtrl() {
        _adminClient.playerCtrl(2, {code:1,operate:true}, function (err, result) {
            if (!!err) {
                console.log('玩家控制失败:', err);
                return;
            }
            console.log('玩家控制成功');
        })
    }

    function backendOpenCode() {
        _adminClient.openLottery("20170629070", "8,0,0,0,8", function (err, result) {
            if (!!err) {
                console.log('后台开奖失败:', err.desc);
                return;
            }
            console.log('后台开奖成功');
        })
    }

    function setConfig() {
        _adminClient.setConfig(JSON.stringify({
            "bw": [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5],
            "msg": "三季娱乐，技术封测",
            "norm": {"bz": {"m": 6000, "p": 600000}, "sz": {"m": 2000, "p": 200000}, "num": {"m": 3000, "p": 100000}, "sum": {"m": 2000, "p": 200000}, "size": {"m": 3000, "p": 100000}},
            "odds": {"bz": {"max": 90, "min": 60}, "sz": {"max": 20, "min": 10}, "num": {"max": 10, "min": 9}, "sum": {"max": 10, "min": 9}, "size": {"max": 2, "min": 1}},
            "rank": ["英勇青铜", "不屈白银", "荣耀黄金", "华贵铂金", "璀璨钻石", "最强王者", "武林高手", "绝世奇才", "威震三界", "盖世英雄"],
            "limit": 5,
            "initial": 20000,
            "update":[
                    30,
                    58,
                    77,
                    114,
                    175,
                    266,
                    393,
                    562,
                    779,
                    0
                ],
            "exp":{
                    "lose":1,
                    "win":2,
                    "money":0.01
                },
            "gm":"weixinhao@gm.com"}
            ), function (err, result) {
            if (!!err) {
                console.log('提现失败');
                return;
            }
            console.log('充值成功');
        })
    }


    gameMsgInit();

    //deal with chat mode.
    $("#entry").keypress(function (e) {
        var route = "game.playerHandler.sendChatMsg";
        var target = $("#usersList").val();
        if (e.keyCode != 13 /* Return */) return;
        var msg = $("#entry").attr("value").replace("\n", "");
        if (!util.isBlank(msg)) {
            pomelo.request(route, {
                from: playerInfo.roleName,
                target: {id:playerInfo.id, level:playerInfo.level},
                msgType: CHATMSGTYPE.CHARACTERS,
                content: msg,
            }, function (data) {
                $("#entry").attr("value", ""); // clear the entry field.
                if (target != '*' && target != username) {
                    addMessage(username, target, msg);
                    $("#chatHistory").show();
                }
            });
        }
    });

    var index = 0;
    function autoChat() {
        var route = "game.playerHandler.sendChatMsg";
        index++;
        var msg = playerInfo.roleName + index + ":" +  "当圣火第一次点燃是希望在跟随，当终点已不再永久是心灵在体会，不在乎等待几多轮回，不在乎欢笑伴着泪水，超越梦想一起飞";
        pomelo.request(route, {
            from: playerInfo.roleName,
            target: {id:playerInfo.id, level:playerInfo.level},
            msgType: CHATMSGTYPE.CHARACTERS,
            content: msg,
        }, function (data) {
           // $("#entry").attr("value", ""); // clear the entry field.
           //  if (target != '*' && target != username) {
           //      addMessage(username, target, msg);
           //      $("#chatHistory").show();
           //  }
        });
    }


    function setRoleName() {
        var newRoleName = $('#roleName').val();
        pomelo.request("game.playerHandler.setRoleName", {roleName: newRoleName}, function (res) {
            if (res.result.code != 200) {
                alert('修改名称失败' + res.result.desc);
                return;
            }
            alert('修改名称成功');
        });
    }

    function setPhone() {
        var phone = $('#roleName').val();
        pomelo.request("game.playerHandler.setPhone", {phone: phone}, function (res) {
            if (res.result.code != 200) {
                alert('修改电话失败' +  res.result.desc);
                return;
            }
            alert('修改电话成功');
        });
    }

    function getRecords() {
        var phone = $('#roleName').val();
        pomelo.request("game.playerHandler.getRecords", {skip: 0,limit:10}, function (res) {
            if (res.result.code != 200) {
             //   alert('获取记录失败' +  res.result.desc);
                return;
            }
           // alert('获取记录成功');
        });

        pomelo.request("game.playerHandler.getChatHistory", null, function (res) {
            if (res.result.code != 200) {
                alert('获取聊天记录失败' +  res.result.desc);
                return;
            }

            console.log('getChatHistory'+res.data);
            alert('获取聊天记录成功');
        });

    }

    function setPinCode() {
        var pinCode = $('#roleName').val();
        //pomelo.request("game.playerHandler.bindBankCard", {address:'中国银行',username:'张三',cardNO:'6229423424242300088',alipay:'alipay@126.com'}, function (res) {
        // pomelo.request("game.playerHandler.bindBankCard", {alipay:'alipay@126.com'}, function (res) {
        // pomelo.request("game.playerHandler.bindBankCard", {alipay:'alipay@126.com', pinCode:'wechat@126.com'}, function (res) {
        pomelo.request("game.playerHandler.bindBankCard", {wechat:'wechat@126.com'}, function (res) {
            if (res.result.code != 200) {
                alert('修改提取码失败' + res.result.desc);
                return;
            }
            alert('修改提取码成功');
        });
    }

    function bet(e) {
        var betValue = $('#betValue').val();
        pomelo.request("game.playerHandler.bet", {betData: betValue}, function (res) {
            if (res.result.code != 200) {
                console.log('投注失败', res.result.desc);
                return;
            }
            alert('投注成功');
        });
    }


    function unBet(e) {
        var entityId = $('#betValue').val();
        pomelo.request("game.playerHandler.unBet", {entityId: entityId}, function (res) {
            if (res.result.code != 200) {
                console.log('撤销投注失败');
                return;
            }
            alert('撤销投注成功');
        });
    }

    function myIncome(e) {
        pomelo.request("game.playerHandler.myIncome", {skip: 10, limit: 10}, function (res) {
            if (res.result.code != 200) {
                console.log('獲取收益失敗');
                return;
            }
            console.log(res);
            alert('獲取收益成功');
        });
    }

    function myBets(e) {
        setInterval(autoChat, 50);
        pomelo.request("game.playerHandler.myBets", {skip: 0, limit: 10}, function (res) {
            if (res.result.code != 200) {
                console.log('获取我的投注信息失败'+ res.result.desc);
                return;
            }
            console.log(res);
            alert('获取我的投注信息成功');
        });
    }

    function friendIncome(e) {
        pomelo.request("game.playerHandler.friendIncome", {skip: 10, limit: 10}, function (res) {
            if (res.result.code != 200) {
                console.log('獲取朋友收益失敗');
                return;
            }
            console.log(res);
            alert('獲取朋友收益成功');
        });
    }

    function winRateRankList(e) {
        pomelo.request("rank.rankHandler.winRateRankList", {skip: 10, limit: 10}, function (res) {
            if (res.result.code != 200) {
                console.log('獲取朋友收益失敗');
                return;
            }
            console.log(res);
            alert('獲取朋友收益成功');
        });
    }

    function todayRichRankList(e) {
        pomelo.request("rank.rankHandler.todayRichRankList", {skip: 10, limit: 10}, function (res) {
            if (res.result.code != 200) {
                console.log('獲取朋友收益失敗');
                return;
            }
            console.log(res);
            alert('獲取朋友收益成功');
        });
    }


    function getPlayerBaseInfo() {
        var uid = Number($('#betValue').val());
        pomelo.request("game.playerHandler.getPlayerBaseInfo", {uid: uid}, function (res) {
            if (res.result.code != 200) {
                console.log('獲取朋友收益失敗');
                return;
            }
            console.log(res);
            alert('獲取朋友收益成功');
        });
    }
    /**
     * login
     */
    function login() {
        let username = $('#loginUser').val().trim();
        let password = $('#loginPwd').val().trim();

        $.post(httpHost + 'gate/clientApi/login', {username: username, password:password}, function (resp) {
            if (resp.err) {
                alert('login err='+ JSON.stringify(resp.err));
                return;
            }
            console.log('login resp=', resp.data);
            //query entry of connection
            queryEntry(resp.data.uid, function (host, port) {
                pomelo.init({
                    host: host,
                    port: port,
                    log: true
                }, function () {
                    var route = "connector.entryHandler.login";
                    pomelo.request(route, {token: res.token}, function (res) {
                        if (res.result.code != 200) {
                            alert('进入游戏失败');
                            return;
                        }

                        console.log(res.data);
                        playerInfo = res.data;

                        var str = JSON.stringify(playerInfo);
                        console.log(str);
                        $('#playerInfo').html(str);

                        rolename = playerInfo.roleName;

                        setName();
                        setRoom();
                        showChat();
                    });
                });
            });
        });
    }

    //register
    function register() {
        var phone = $('#reg-name').val().trim();
        var code = $('#reg-phone').val().trim();
        var nickname = $('#reg-inviter').val().trim();
        var password = $('#reg-pwd').val().trim();

        console.log(httpHost + 'gate/clientApi/register');
        $.post(httpHost + 'gate/clientApi/register', {
            username: phone,
            code: code,
            nickname: nickname,
            password: password,
        }, function (resp) {
            if (resp.err) {
                alert('registe err='+ JSON.stringify(resp.err));
                console.log(resp.err);
            } else {
                alert('registe ok！');
                console.log(resp.data);
            }
        });
    }
});