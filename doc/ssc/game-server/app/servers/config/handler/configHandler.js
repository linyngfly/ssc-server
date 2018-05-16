var Code = require('../../../../../shared/code');
var async = require('async');
var bearcat = require('bearcat');
var logger = require('pomelo-logger').getLogger(__filename);

var configHandler = function (app) {
    this.app = app;
    this.serverId = app.get('serverId').split('-')[2];
};
configHandler.prototype.getVersions = function(){
     
}