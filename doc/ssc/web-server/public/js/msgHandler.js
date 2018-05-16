/**
 * Created by linyng on 17-5-17.
 */

var pomelo = window.pomelo;
var players = {};

function gameMsgInit() {

    //wait message from the server.
    pomelo.on('onChatMessage', function(data) {
        console.log('onChatMessage', data);
        addMessage(data.from, data.target, data.content);
        $("#chatHistory").show();
        if(data.from !== rolename)
            tip('message', data.from);
    });

    pomelo.on('onPlayerWinner', function (data) {
        console.log('onPlayerWinner', data);
    })


    pomelo.on('onPlayerPreWinner', function (data) {
        console.log('onPlayerPreWinner', data);
    })

    //update user list
    pomelo.on('onEnterRoom', function(data) {
        console.log('onEnterRoom', data);
        var user = data;
        tip('online', user.roleName);
        addUser(user);
    });

    //update user list
    pomelo.on('onLeaveRoom', function(data) {
        console.log('onLeaveRoom', data);
        var user = data.uid;
        tip('offline', user);
        removeUser(user);
    });

    pomelo.on('onCountdown', function (data) {
        //  console.log('onCountdown data:', data);
        $('#countdown').html('period: ' + data.period + ' countdown: ' + Math.floor(data.tickCount/60)+':' + data.tickCount%60 +'s');
    });

    pomelo.on('onLottery', function (data) {
        //  console.log('onLottery data:', data);
        $('#lottery').html('period: ' + data.lotteryResult.period + '  lottery: ' + data.lotteryResult.numbers);
    });

    pomelo.on('onNotice', function (data) {
          console.log('onNotice data:', data);
        //$('#lottery').html('period: ' + data.lotteryResult.period + '  lottery: ' + data.lotteryResult.numbers);
    });

    pomelo.on('onParseLottery', function (data) {
          console.log('onParseLottery data:', data);
        //$('#lottery').html('period: ' + data.lotteryResult.period + '  lottery: ' + data.lotteryResult.numbers);
    });

    pomelo.on('onPlayerChange', function (data) {
        players[data.entityId]  = data.player;
        console.log('onPlayerChange data:', data);

        var str = JSON.stringify(data.player);
        console.log(str);
        $('#playerInfo').html(str);
    });

    pomelo.on('onPlayerBet', function (data) {
        console.log('onPlayerBet data:', data.betItem.betTypeInfo,'entityid:', data.betItem.entityId);

        addMessage('投注', '所以玩家', data.betItem.betInfo);
        $("#chatHistory").show();
        if(data.from !== rolename)
            tip('message', data.from);

    });

    function bets(data) {
        console.log('onPlayerBets data:', data);
    }

    pomelo.on('onPlayerBets', bets);


    pomelo.on('onPlayerUnBet', function (data) {
        console.log('onPlayerUnBet data:', data.betItem.betTypeInfo,'entityid:', data.betItem.entityId);

    });

    //投注数/胜率排行, 投注总资金排行
    pomelo.on('rankUpdate', function (data) {
        console.log('rankUpdate data:', data);
        // var ul = document.querySelector('#rank ul');
        // var game = app.getCurArea();
        // var li = "";
        // // data.entities.forEach(function(id) {
        // //     var e = game.getEntity(id);
        // //     if (e) {
        // //         li += '<li><span>' + e.name + '</span><span>' + e.score + '</span></li>';
        // //     }
        // // });
        // ul.innerHTML = li;
    });

    //handle disconect message, occours when the client is disconnect with servers
    pomelo.on('disconnect', function(reason) {
        console.log('网络断开', reason);
    });

    // Handle user leave message, occours when players leave the game
    pomelo.on('onPlayerLeave', function (data) {
        // var game = app.getCurArea();
        // var playerId = data.playerId;
        // console.log('onUserLeave invoke!');
        // game.removePlayer(playerId);
    });


};