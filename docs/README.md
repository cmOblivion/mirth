# Mirth.js

## 介绍

Mirth是一个开源的基于node.js的web框架，由cm开发，基于MIT开源协议，Github仓库地址：[Mirth](https://github.com/cmOblivion/mirth/)，于2022年4月初开始开发。

## 文档

[详细文档](https://cmoblivion.github.io/#/doc)

## 快速开始

使用npm安装mirth

```bash
npm i mirthjs
```

然后便可使用mirth：

```js
const mirth = require('mirthjs');

var server = new mirth.Server()
    .route({
        render:new mirth.response.Response({msg:'Hello World!'})
    })
    .start();
```

然后便可在本地端口80上看到Hello World!了。

可以看到代码不算短，但是极具扩展性。

比如这样：var server = new mirth.Server()

```js
var server = new mirth.Server()
    .static()
    .start();
```

即可做出一个在localhost/static上的静态文件服务器。

或者这样：

```js
var server = new mirth.Server()
    .install('db')
    .start();
```

便可使用server.db来访问连接到mongodb。

具体一定要依据文档！！！

*仍在开发中，欢迎参与开发*

*我的qq：1351898374*
