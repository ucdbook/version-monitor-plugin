/**
 * 系统版本监视器
 * @author yanrong.tian
 * @date 2021/3/06 14:22:00
 */

var $alert = document.createElement('div');
var isAlerting = false;
var $closeIconPre, $closeButtonPre;
var closeFn = function() {
  $alert.innerHTML = '';
  isAlerting = false;
};

var VersionMonitor = function() {
  this.version = '<% versionString %>';
  this.loadSourceError = false;
  this.versionFileUrl = './version.json';
  this.timeoutValue = '<% timeoutValue %>';
  this.init();
};
VersionMonitor.prototype = {
  init: function() {
    this.addErrorEventListener();
    this.timeoutVersionListener();
  },

  addErrorEventListener: function() {
    var _this = this;
    window.addEventListener('error', function(e) {
      if(e){
        let target = e.target || e.srcElement;
        let isElementTarget = target instanceof HTMLElement;
        if (isElementTarget) {
          var typeName = e.target.localName;
          var sourceUrl = "";
          if (typeName === "link") {
            sourceUrl = target.href;
          } else if (typeName === "script") {
            sourceUrl = target.src;
          }
          _this.loadSourceError = true;
          _this.fetchNewVersion(_this.alertReload, 'error');
        }
      }
    },true);
  },

  fetchNewVersion: function(callback, from) {
    var _this = this;
    var xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp=new XMLHttpRequest();
    }
    else {
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange=function() {
      if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        const version = JSON.parse(xmlhttp.responseText).versions;
        if(version !== _this.version) {
          _this.version = version;
          callback(from);
        }
      }
    }

    xmlhttp.open("GET",`${this.versionFileUrl}?_t=${+new Date()}`,true);//true代表支持异步执行，false为否

    xmlhttp.send();
  },

  timeoutVersionListener: function() {
    var _this = this;
    setTimeout(function() {
      _this.fetchNewVersion(_this.alertReload, 'timeout');
      _this.timeoutVersionListener();
    }, this.timeoutValue)
  },

  alertReload: function(from) {
    if(isAlerting) {
      return;
    }
    isAlerting = true;
    var html = '<div class="ant-modal-root">'+
      '<div class="ant-modal-mask"></div>'+
      '<div tabindex="-1" class="ant-modal-wrap " role="dialog" aria-labelledby="rcDialogTitle1">'+
        '<div role="document" class="ant-modal" style="width: 420px; top: calc((100vh - 200px)/2);">'+
          '<div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden; outline: none;"></div>'+
          '<div class="ant-modal-content">'+
            '<span class="_tx_close_icon"></span>'+
            '<div class="ant-modal-header">'+
              '<div class="ant-modal-title" id="rcDialogTitle1">系统版本更新</div>'+
            '</div>'+
          '<div class="ant-modal-body">发现系统有新版本发布，请刷新浏览器，更新系统!</div>'+
          '<div class="ant-modal-footer" style="border:none;padding: 5px 24px 20px;">'+
            '<span class="_tx_close_button" style="margin-right: 10px"></span>'+
            '<span class="_tx_ok_button"></span>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div></div>';
    $alert.innerHTML = html;

    var $closeIcon, $closeButton, $okButton;
    if(from === 'timeout') {
      //$closeIcon = $alert.querySelector('._tx_close_icon');
      $closeButton = $alert.querySelector('._tx_close_button');
      $okButton = $alert.querySelector('._tx_ok_button');
      //$closeIcon.innerHTML = '<button type="button" aria-label="Close" class="ant-modal-close"><span class="ant-modal-close-x"><i aria-label="图标: close" class="anticon anticon-close ant-modal-close-icon"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></i></span></button>';
      $closeButton.innerHTML = '<button type="button" class="ant-btn"><span>知道了，我会稍后手动刷新</span></button>';
      $okButton.innerHTML = '<button type="button" class="ant-btn ant-btn-primary"><span>刷 新</span></button>';
    }
    else {
      $okButton = $alert.querySelector('._tx_ok_button');
      $okButton.innerHTML = '<button type="button" class="ant-btn ant-btn-primary"><span>刷 新</span></button>';
    }

    if($okButton) {
      $okButton.addEventListener('click', () => {
        window.location.reload();
      });
    }

    // if($closeIcon) {
    //   if($closeIconPre) {
    //     $closeIconPre.removeEventListener('click', closeFn);
    //   }
    //   $closeIcon.addEventListener('click', closeFn);
    //   $closeIconPre = $closeIcon;
    // }

    if($closeButton) {
      if($closeButtonPre) {
        $closeButtonPre.removeEventListener('click', closeFn);
      }
      $closeButton.addEventListener('click', closeFn);
      $closeButtonPre = $closeButton;
    }

    document.body.appendChild($alert);
  }

};
new VersionMonitor();
