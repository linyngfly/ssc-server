/**
 * Created by linyng on 2017/6/18.
 */
var bearcat = require('bearcat');

var Bank = function () {
  this.$id = 'bank';
  this.$init = 'init';
  this.$scope = 'prototype';
};

Bank.prototype.init = function () {

};

Bank.prototype.strip = function () {

};

bearcat.module(Bank, typeof module !== undefined ?module:{});


