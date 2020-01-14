"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ht = require("../../js/ht.js");
exports.default = Component({
  properties: {
    loading: {
      type: Boolean,
      value: false,
      observer: function observer(newVal, oldVal, changedPath) {
        this.initBanner();
      }
    },
    bannerName: {
      type: String,
      value: "",
      observer: function observer(newVal, oldVal, changedPath) {
        this.initBanner();
      }
    }
  },
  data: {
    _bannerData: {},
    _bannerHeight: 0
  },
  methods: {
    initBanner: function initBanner() {
      var pageMain = this;

      if (!pageMain.data.loading) return;
      if (pageMain.data.bannerName == "") return;

      ht.setForm({
        url: "/banner/GetBannerByNameAsync",
        data: {
          value: pageMain.data.bannerName
        },
        success: function success(data) {
          pageMain.setData({
            _bannerData: data
          });

          var sysInfo = wx.getSystemInfoSync();
          var screenWidth = sysInfo.screenWidth;
          wx.getImageInfo({
            //获取图片长宽等信息
            src: data.pages[0].imageURL,
            success: function success(res) {
              var imgw = res.width;
              var imgh = res.height;
              var bannerHeight = screenWidth * imgh / imgw;

              pageMain.setData({
                _bannerHeight: bannerHeight
              });
            }
          });
        }
      });
    },
    goBannerLink: function goBannerLink(e) {
      var url = e.currentTarget.dataset.url;
      if (url != "" && url != null && url != undefined) {
        ht.navigate({
          redirectUrl: url,
          isDirect: true
        });
      }
    }
  },
  lifetimes: {
    attached: function attached() {
      // 在组件实例进入页面节点树时执行
    }
  }
});