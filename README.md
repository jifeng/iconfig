iconfig
=======

## 说明
依赖iservice-client的配置管理模块，主要针对的数据格式是json

## 安装

````
npm install iconfig
````

## 用法

````
var iconfig = require('iconfig');
var path = require('path');

var config = {
  switchs : false
}

//在服务器端 switchs: true
var client = iconfig({
  config: config,
  iservice: {
    host: '10.232.13.90',
    cache: path.join(process.env.HOME, 'config_cache')
  },
  appname:'iconfig'
});

client.ready(function () {
  console.log('ready: ' + config.switchs);
});

//iservice的配置发生改变
client.on('change', function () {

});

//记录iservice的错误信息
client.on('error', function (err) {

});
````
