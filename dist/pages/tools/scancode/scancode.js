"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ht = require("../../../js/ht.js");

exports.default = Page({
  onLoad: function onLoad(options) {
    //-- 此处options的URL为转码后的URL,例： "%2Fappframework%2Ftest%2Ftest"
    var redirectURL = options.RedirectURL;
    //-- 解码
    redirectURL = decodeURIComponent(redirectURL);

    setTimeout(function () {
      wx.scanCode({
        //调用扫一扫
        success: function success(res) {
          if (!/\?$/.test(redirectURL)) {
            redirectURL += "?";
          } else {
            redirectURL += "&";
          }

          ht.navigate({
            redirectUrl: redirectURL + "ScanCode=" + encodeURIComponent(res.result),
            isDirect: true,
            isHasBack: false
          });
        },
        error: function error(err) {
          ht.navigate({
            redirectUrl: redirectURL,
            isDirect: true,
            isHasBack: false
          });
        }
      });
    }, 500);
  }
});