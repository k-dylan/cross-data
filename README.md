# cross-data

跨域数据共享方案,突破浏览器同源限制，共享localStorage数据；

## 安装

```bash
npm install --save cross-data 
# or
yarn add cross-data
```

## 实现效果

![cross-data](http://cdn.jsclub.cc/FhQ-oJ4Q_VoVJtNRH8CuOX_4f5rK.gif)

## 使用方法

1. 创建hub.html
   
   ```html
   <!DOCTYPE html>
   <html lang="en">
   
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <meta http-equiv="X-UA-Compatible" content="ie=edge">
       <title>Hub</title>
   
   </head>
   
   <body>
   
       <script src="../dist/hub.js"></script>
   
       <script>
           new Hub(safeDomain, prefix);
   
       </script>
   </body>
   
   </html>
   ```

2. 项目中添加client
   
   ```javascript
   import Client from 'cross-data/dist/client.js';
   
   const client = new Client({
       iframeUrl: 'https://test.example.com/hub.html'  // hub.html文件的目录
   })
   
   // 写数据
   client.set(key, value).then(res => {
       console.log('操作成功')
   })
   // 读数据
   client.get(key).then(data => {
       console.log(data)
   })
   ```

## API介绍

1. new hub() 参数
   
   | 参数名        | 类型     | 说明          | 默认值  |
   | ---------- | ------ | ----------- | ---- |
   | safeDomain | RegExp | 域名白名单，正则表达式 | /.*/ |
   | prefix     | String | key前缀       | 空    |

2. client API方法
   
   - set(key, value):  设置数据
   
   - get(key): 获取数据
   
   - remove(key): 删除数据
   
   - clear():  清空所有数据
   
   > 以上api都返回一个Promise对象
