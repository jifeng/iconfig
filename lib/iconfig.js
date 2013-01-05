/*!
 * response-patch - lib/iconfig.test.js
 * Author: jifeng <wade428@163.com>
 */

"use strict";

/**
 * Module dependencies.
 */

var iservice = require('iservice-client');
var clone = require('clone');

var config = {};
var _configFromIservice = {};
var _ready = false;
var client = {};
var backup = {};


function defineItem(key) {
  Object.defineProperty(config, key, {
    get: function () {
      var value = _configFromIservice[key];
      //因为value的值可能是false,所以不用!value
      if (value === undefined) {
        console.log('could not fetch ' + key + ' of config from iservice');
        value = backup[key];
      }
      return value;
    },
    set: function (val) {
      backup[key] = val;
    }
  });
}

function defineConfig() {
  _configFromIservice = client.getTree();
  for (var key in _configFromIservice) {
    if (backup[key] !== undefined) {
      defineItem(key);  
    }
  }
}

module.exports = function (options) {
  config = options.config;
  var appname = options.appname;
  iservice.init(options.iservice);
  client = iservice.createConfig(appname);
  backup = clone(config);
  
  client.ready = function (callback) {
    if (_ready) {
      return process.nextTick(callback);
    }
    //数据已经到位，无论是从zk中得到还是缓存中得到
    client.on('ready', function () {
      return process.nextTick(callback);
    });
  };

  //当iservice的配置发生改变
  client.on('change', function () {
    defineConfig();
  });

  //iservice已正常启动
  client.on('ready', function () {
    defineConfig();
    _ready = true;
  });

  //iservice出现错误
  client.on('error', function (err) {});
  return client;
};






