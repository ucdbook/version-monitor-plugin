# VersionMonitorPlugin 系统版本监视器

webpack plugin

**用于场景：**
当系统是以按需加载构建时，发布新版本，单页面应用的系统在切换模块时，还请求的旧的js路径，因新版本的发布，旧的js文件名已不存在，这时需要提醒用户刷新浏览器。


**plugin逻辑：**
1. 生成version.json文件到发布目录（当前日期）
2. 生成versionMonitor.js文件到发布目录

**versionMonitor.js逻辑：**
1. 监听系统在浏器中资源加载失败，这时去ajax请求version.json中的版本号，进行对比，不一至测提示“系统版本更新”，提示框不可关闭，只有“刷新”按钮；
2. 根据设置的时间定时ajax请求version.json中的版本号，进行对比，不一至测提示“系统版本更新”，操作按钮有：“知道了，我会稍后手动刷新”、“刷新”

**使用：**
```
// webpack.config.js

const VersionMonitorPlugin = require('version-monitor-plugin');
module.exports = {
  ...,
  plugin[
    new VersionMonitorPlugin({
      speed: 1000000,// 定时器
    }),
    ...
  ]
}
```
