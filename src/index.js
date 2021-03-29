/**
 * 系统版本监视器
 * @author yanrong.tian
 * @date 2021/3/06 14:22:00
 */

 var fs = require('fs');
 const path = require('path');

 const currentData = new Date();
 const versionString = `${currentData.getFullYear()}-${currentData.getMonth() + 1}-${currentData.getDate()} ${currentData.getHours()}:${currentData.getMinutes()}:${currentData.getSeconds()}`
 const versionFileContent = JSON.stringify({'versions': versionString});
 let versionMonitorJsContent = fs.readFileSync(path.join(__dirname, './VersionMonitor.js'), 'utf-8');

 class VersionMonitorPlugin {
   constructor(a) {
     this.options = {};
     this.options.speed = 60000;
   }
   apply(compiler) {
     const outputPath = compiler.options.output.path;
     // emit 是异步 hook，使用 tapAsync 触及它，还可以使用 tapPromise/tap(同步)
     compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
       // 在生成文件中，创建一个头部字符串：
       var filelist = 'In this build:\n\n';

       // 遍历所有编译过的资源文件，
       // 对于每个文件名称，都添加一行内容。
       for (var filename in compilation.assets) {
         filelist += '- ' + filename + '\n';
       }

       // 将这个列表作为一个新的文件资源，插入到 webpack 构建中：
       compilation.assets['version.json'] = {
         source: function() {
           return versionFileContent;
         },
         size: function() {
           return versionFileContent.length;
         }
       };

      // ：
      versionMonitorJsContent = versionMonitorJsContent.replace('<% versionString %>', versionString);
      versionMonitorJsContent = versionMonitorJsContent.replace('<% timeoutValue %>', this.options.speed);
      compilation.assets['versionMonitor.js'] = {
        source: function() {
          return versionMonitorJsContent;
        },
        size: function() {
          return versionFileContent.length;
        }
      };

      callback();
     });

    //  compiler.hooks.done.tap('HtmlWebpackPlugin', (
    //     stats /* 在 hook 被触及时，会将 stats 作为参数传入。 */
    //   ) => {
    //     var aa = fs.readFileSync(path.join(outputPath, 'index.html'), 'utf-8');
    //     const html = '<html><head></head><body>dsfdsfd</body></html>';
    //     console.log(11111112, path.join(outputPath, 'index.html'), aa);
    //     fs.writeFileSync(path.join(outputPath, 'index.html'), html, { encoding: 'utf-8' });
    //     console.log('HtmlWebpackPlugin done!');

    //     //applyPluginsAsyncWaterfall('html-webpack-plugin-before-html-processing', true, pluginArgs);
    //   });
   }
 }
 module.exports = VersionMonitorPlugin;
