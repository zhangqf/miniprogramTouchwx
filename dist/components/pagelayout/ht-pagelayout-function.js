"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ht = require("../../js/ht.js");
var storage = require("../../js/storage.js");
exports.default = Component({
  properties: {
    moduleFunctionData: {
      type: Object,
      value: null,
      observer: function observer(newVal, oldVal, changedPath) {

        if (oldVal == null) this.computerAddEmpty();
      }
    }
  },
  data: {

    _emptyFunctionArray: [],

    _enumData: {
      PageLayoutNavigateModuleFunctionTypeEnum_Grid: 10,
      PageLayoutNavigateModuleFunctionTypeEnum_SingleRow: 20,
      PageLayoutNavigateModuleFunctionTypeEnum_MultiRow: 30,

      PageLayoutNavigateModuleFunctionJumpLink_Direct: 10,
      PageLayoutNavigateModuleFunctionJumpLink_Apploading: 20,
      PageLayoutNavigateModuleFunctionJumpLink_Openloading: 30,
      PageLayoutNavigateModuleFunctionJumpLink_Urltype: 110,
      PageLayoutNavigateModuleFunctionJumpLink_Miniprogramtype: 210,
      PageLayoutNavigateModuleFunctionJumpLink_Callphonetype: 810
    }
  },
  methods: {
    goFucntionLink: function goFucntionLink(e) {
      var url = e.currentTarget.dataset.url;
      var jumpType = e.currentTarget.dataset.jumptype;
      var linkjumptype = e.currentTarget.dataset.linkjumptype;
      var appid = e.currentTarget.dataset.appid;
      var appPath = e.currentTarget.dataset.appPath;
      var phone = e.currentTarget.dataset.phone;
      var isNew = e.currentTarget.dataset.isnew;
      var isHot = e.currentTarget.dataset.ishot;
      var isOnlyEmp = e.currentTarget.dataset.isonlyemp;
      var isComingSoon = e.currentTarget.dataset.iscomingsoon;
      var comingSoonText = e.currentTarget.dataset.comingsoontext;
      var isBindEmp = storage.isBindEmp();

      if (isOnlyEmp && !isBindEmp) {
        this.triggerEvent("eventPopupEmpRegister", {});
        return;
      }

      if (isComingSoon) {
        if (comingSoonText != "") {
          wx.showToast({
            title: comingSoonText,
            //icon: 'success',
            duration: 2000
          });
          return;
        }
      }

      if (jumpType == this.data._enumData.PageLayoutNavigateModuleFunctionJumpLink_Urltype) {
        if (url == "" || url == null || url == undefined) return;

        //跳转链接
        if (linkjumptype == this.data._enumData.PageLayoutNavigateModuleFunctionJumpLink_Direct) {
          ht.navigate({
            redirectUrl: url,
            isDirect: true
          });
          return;
        } else if (linkjumptype == this.data._enumData.PageLayoutNavigateModuleFunctionJumpLink_Apploading) {
          //apploading跳转
          ht.navigate({
            redirectUrl: url
          });
          return;
        } else if (linkjumptype == this.data._enumData.PageLayoutNavigateModuleFunctionJumpLink_Openloading) {
          //openloading跳转
          wx.showToast({
            title: "openloading跳转",
            icon: "success",
            duration: 2000
          });
          return;
        }
      } else if (jumpType == this.data._enumData.PageLayoutNavigateModuleFunctionJumpLink_Miniprogramtype) {
        if (appPath == "" || appPath == null || appPath == undefined) return;

        //跳转小程序
        ht.navigateToMiniprogram({
          appid: appid,
          path: appPath,
          success: function success(res) {
            // 打开成功
          }
        });
        return;
      }
      if (jumpType == this.data._enumData.PageLayoutNavigateModuleFunctionJumpLink_Callphonetype) {
        if (phone == "" || phone == null || phone == undefined) return;

        //拨打电话
        ht.navigateToCallPhone(phone);
        return;
      }
    },

    //计算要多添加的div的个数
    computerAddEmpty: function computerAddEmpty() {

      //一行中排列的个数
      var showItemNumByRow = this.data.moduleFunctionData.showItemNumByRow;
      // 实际总个数
      var totalNumber = this.data.moduleFunctionData.listItem.length;
      // 需要补充的空格
      var totalNumberEmpty = (showItemNumByRow - totalNumber % showItemNumByRow) % showItemNumByRow;

      var emptyArray = [];

      for (var i = 0; i < totalNumberEmpty; i++) {
        emptyArray.push(i);
      }

      this.setData({
        _emptyFunctionArray: emptyArray
      });
    }
  }
});