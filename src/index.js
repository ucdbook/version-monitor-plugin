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
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const jsName = 'versionMonitor.js';

const addAllAssetsToCompilation = async (compilation, htmlPluginData) => {
  htmlPluginData.assets.js.unshift(`/${jsName}`);
  return htmlPluginData;
};

 class VersionMonitorPlugin {
   constructor(a) {
     this.options = {};
     this.options.speed = 60000;
   }
   apply(compiler) {
     const outputPath = compiler.options.output.path;
     // emit 是异步 hook，使用 tapAsync 触及它，还可以使用 tapPromise/tap(同步)
     compiler.hooks.emit.tapAsync('VersionMonitorPlugin', (compilation, callback) => {
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
      compilation.assets[jsName] = {
        source: function() {
          return versionMonitorJsContent;
        },
        size: function() {
          return versionFileContent.length;
        }
      };



      let beforeGenerationHook;
      //let alterAssetTagsHook;

      if (HtmlWebpackPlugin.version >= 4) {
        const hooks = HtmlWebpackPlugin.getHooks(compilation);

        beforeGenerationHook = hooks.beforeAssetTagGeneration;
        //alterAssetTagsHook = hooks.alterAssetTags;
      } else {
        const { hooks } = compilation;

        beforeGenerationHook = hooks.htmlWebpackPluginBeforeHtmlGeneration;
        //alterAssetTagsHook = hooks.htmlWebpackPluginAlterAssetTags;

        beforeGenerationHook.tapPromise('VersionMonitorPlugin', htmlPluginData => addAllAssetsToCompilation(compilation, htmlPluginData));
      }

      callback();
     });


   }
 }
 module.exports = VersionMonitorPlugin;
