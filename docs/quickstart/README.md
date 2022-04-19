# 快速开始Mirth.js

## 安装

使用npm安装：

```bash
npm i mirthjs
```

## 使用

直接看HelloWorld：

```js
const mirth = require('mirthjs');

var server = new mirth.Server()
    .route({
        render:new mirth.response.Response({msg:'Hello World!'})
    })
    .start();
```

使用静态文件路由：

```js
var server = new mirth.Server()
    .static()
    .start();
```

使用数据库：

```js
var server = new mirth.Server()
    .install('db')
    .start();
```

详见文档！！！
