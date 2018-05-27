/**
 * Created by linyng on 17-5-17.
 */

var players = {};
var users = {};

var pomelo = window.pomelo;
var username;
var playerInfo;
var users;
var rid;
var base = 1500;
var increase = 25;
var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
var LOGIN_ERROR = "There is no server to log in, please wait.";
var LENGTH_ERROR = "Name/Channel is too long or too short. 20 character max.";
var NAME_ERROR = "Bad character in Name/Channel. Can only have letters, numbers, Chinese characters, and '_'";
var DUPLICATE_ERROR = "Please change your name to login.";
var CHATMSGTYPE = {
    CHARACTERS:0,
    IMAGE:1,
    AUDIO:2
}

var httpHost = location.href.replace(location.hash, '');
httpHost = httpHost.substr(0, httpHost.lastIndexOf('/')+1);

util = {
    urlRE: /https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g,
    //  html sanitizer
    toStaticHTML: function(inputHtml) {
        inputHtml = inputHtml.toString();
        return inputHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    //pads n with zeros on the left,
    //digits is minimum length of output
    //zeroPad(3, 5); returns "005"
    //zeroPad(2, 500); returns "500"
    zeroPad: function(digits, n) {
        n = n.toString();
        while(n.length < digits)
            n = '0' + n;
        return n;
    },
    //it is almost 8 o'clock PM here
    //timeString(new Date); returns "19:49"
    timeString: function(date) {
        var minutes = date.getMinutes().toString();
        var hours = date.getHours().toString();
        return this.zeroPad(2, hours) + ":" + this.zeroPad(2, minutes);
    },

    //does the argument only contain whitespace?
    isBlank: function(text) {
        var blank = /^\s*$/;
        return(text.match(blank) !== null);
    }
};

//always view the most recent message when it is added
function scrollDown(base) {
    window.scrollTo(0, base);
    $("#entry").focus();
};

// add message on board
function addMessage(from, target, text, time) {
    var name = (target == '*' ? 'all' : target);
    if(text === null) return;
    if(time == null) {
        // if the time is null or undefined, use the current time.
        time = new Date();
    } else if((time instanceof Date) === false) {
        // if it's a timestamp, interpret it
        time = new Date(time);
    }
    //every message you see is actually a table with 3 cols:
    //  the time,
    //  the person who caused the event,
    //  and the content
    var messageElement = $(document.createElement("table"));
    messageElement.addClass("message");
    // sanitize
    text = util.toStaticHTML(text);
    var content = '<tr>' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">' + util.toStaticHTML(from) + ' says to ' + name + ': ' + '</td>' + '  <td class="msg-text">' + text + '</td>' + '</tr>';
    messageElement.html(content);
    //the log is the stream that we view
    $("#chatHistory").append(messageElement);
    base += increase;
    scrollDown(base);
};

// show tip
function tip(type, name) {
    var tip,title;
    switch(type){
        case 'online':
            tip = name + ' is online now.';
            title = 'Online Notify';
            break;
        case 'offline':
            tip = name + ' is offline now.';
            title = 'Offline Notify';
            break;
        case 'message':
            tip = name + ' is saying now.'
            title = 'Message Notify';
            break;
    }
    var pop=new Pop(title, tip);
};

// init user list
function initUserList(users) {
    for (var key in users){
        var slElement = $(document.createElement("option"));
        slElement.attr("value", users[key].uid);
        slElement.text(users[key].name);
        $("#usersList").append(slElement);
    }
};

// add user in user list
function addUser(user) {
    var slElement = $(document.createElement("option"));
    slElement.attr("value", user.userId);
    slElement.text(user.roleName);
    $("#usersList").append(slElement);
};

// add room in room list
function addRoomList(rooms) {
    rooms.forEach(function (val) {
        var slElement = $(document.createElement("option"));
        slElement.attr("value", val);
        slElement.text(val);
        $("#roomList").append(slElement);
    })
};

// remove user from user list
function removeUser(user) {
    $("#usersList option").each(
        function() {
            if($(this).val() === user) $(this).remove();
        });
};

// set your name
function setName() {
    $("#name").text(username);
};

// set your room
function setRoom() {
    $("#room").text(rid);
};

// show error
function showError(content) {
    $("#loginError").text(content);
    $("#loginError").show();
};


// show chat panel
function showChat() {
    $("#loginView").hide();
    $("#loginError").hide();
    $("#toolbar").show();
    $("#registeView").hide();
    $("entry").focus();
    scrollDown(base);
};

// show game panel
function showGame() {
    $("#loginView").hide();
    $("#loginError").hide();
    $("#toolbar").hide();
    $("#registeView").hide();
    // $("entry").focus();
    scrollDown(base);
};

// query connector
function queryEntry(uid, callback) {
    var route = 'gate.gateHandler.connect';
    pomelo.init({
        host: window.location.hostname,
        port: 3014,
        log: true
    }, function() {
        pomelo.request(route, {
            uid: uid
        }, function(res) {
            pomelo.disconnect();
            if(res.result.code === 500) {
                showError(LOGIN_ERROR);
                return;
            }
            callback(res.data.host, res.data.port);
        });
    });
};

// show login panel
function showLogin() {
    $("#loginView").show();
    $("#chatHistory").hide();
    $("#toolbar").hide();
    $("#loginError").hide();
    $("#loginUser").focus();
};


