"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var config = require("../../../js/config.js");
var ht = require("../../../js/ht.js");

exports.default = Page({
  data: {
    _url: ""
  },

  onLoad: function onLoad(options) {
    //-- 此处options的URL为转码后的URL,例： "%2Fappframework%2Ftest%2Ftest"

    var url = options.RedirectURL;
    var isDirect = options.IsDirect;

    //-- 解码
    url = decodeURIComponent(url);

    //-- 增加网站前缀
    if (!/^http/.test(url)) {
      url = config.appPath + url;
    }

    if (isDirect != "1") {
      url = ht.getAppLoadingURL(url);
    }

    this.setData({
      _url: url
    });
  }
});