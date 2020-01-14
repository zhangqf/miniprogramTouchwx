"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ht = require("../../js/ht.js");
var WxParse = require("../../plugin/wxParse/wxParse.js");
var config = require("../../js/config.js");
exports.default = Component({
  properties: {
    loading: {
      type: Boolean,
      value: false,
      observer: function observer(newVal, oldVal, changedPath) {

        this.initContent();
      }
    },
    contentName: {
      type: String,
      value: "",
      observer: function observer(newVal, oldVal, changedPath) {

        this.initContent();
      }
    }

  },
  data: {},
  methods: {
    initContent: function initContent() {
      var pageMain = this;
      if (!pageMain.data.loading) return;
      if (pageMain.data.contentName == "") return;
      ht.promiseSetForm({
        url: "/content/GetEntityByNameAsync",
        data: {
          value: pageMain.data.contentName
        },
        success: function success(data) {
          WxParse.wxParse("contentData", "html", data.showText, pageMain, 0, config.imageRootPath);
        },
        fail: function fail(data) {}
      });
    }
  },
  lifetimes: {
    attached: function attached() {}
  }
});