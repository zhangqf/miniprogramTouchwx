"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ht = require("../../js/ht.js");
var storage = require("../../js/storage.js");
exports.default = Component({
  properties: {
    loading: {
      type: Boolean,
      value: false,
      observer: function observer(newVal, oldVal, changedPath) {
        this.initModuleEmp();
      }
    },

    moduleEmpData: {
      type: Object,
      value: null,
      observer: function observer(newVal, oldVal, changedPath) {
        if (oldVal == null) this.initModuleEmp();
      }
    }
  },
  data: {
    _canIUse: wx.canIUse("button.open-type.getUserInfo"),

    _empInfo: null,

    _avatarUrl: "",
    _imageUrl: "",
    _empDisplayName: "",

    _empStatusGrant: false,
    _empStatusRegister: false,

    _enumData: {
      PageLayoutNavigateModuleEmpItemTypeEnum_Balance: 110,
      PageLayoutNavigateModuleEmpItemTypeEnum_Point: 120,
      PageLayoutNavigateModuleEmpItemTypeEnum_Growth: 130,
      PageLayoutNavigateModuleEmpItemTypeEnum_EmpLevel: 210,
      PageLayoutNavigateModuleEmpItemTypeEnum_CouponNum: 310,
      PageLayoutNavigateModuleEmpItemTypeEnum_Custom: 999
    }
  },
  methods: {
    initModuleEmp: function initModuleEmp() {
      var pageMain = this;
      if (!pageMain.data.loading) return;
      if (pageMain.data.moduleEmpData == null) return;

      var isGetEmpMoney = false;
      var isGetEmpPoint = false;
      var isGetEmpGrowth = false;
      var isGetCouponNum = false;
      var isShowPerfectEmpInfo = false;
      var isShowSignIn = false;
      var isShowWeixinEmpSubscribe = false;

      if (this.data.moduleEmpData.isShowPerfectEmpInfo) isShowPerfectEmpInfo = true;
      if (this.data.moduleEmpData.isShowSignIn) isShowSignIn = true;
      if (this.data.moduleEmpData.isShowWeixinEmpSubscribe) isShowWeixinEmpSubscribe = true;

      this.data.moduleEmpData.listItem.forEach(function (empItem) {
        switch (empItem.itemType) {
          case pageMain.data._enumData.PageLayoutNavigateModuleEmpItemTypeEnum_Balance:
            isGetEmpMoney = true;
            break;
          case pageMain.data._enumData.PageLayoutNavigateModuleEmpItemTypeEnum_Point:
            isGetEmpPoint = true;
            break;
          case pageMain.data._enumData.PageLayoutNavigateModuleEmpItemTypeEnum_Growth:
            isGetEmpGrowth = true;
            break;
          case pageMain.data._enumData.PageLayoutNavigateModuleEmpItemTypeEnum_CouponNum:
            isGetCouponNum = true;
            break;
        }
      });

      ht.setForm({
        url: "/weixinEmpMerge/QueryMergeDataAsync",
        data: {
          isGetEmpMoney: isGetEmpMoney,
          isGetEmpPoint: isGetEmpPoint,
          isGetEmpGrowth: isGetEmpGrowth,
          isGetCouponNum: isGetCouponNum,
          isShowPerfectEmpInfo: isShowPerfectEmpInfo,
          isShowSignIn: isShowSignIn,
          isShowWeixinEmpSubscribe: isShowWeixinEmpSubscribe
        },
        success: function success(data) {
          if (data.endDay != null) {
            data.endDay = data.endDay.replace(/-/g, ".").substring(0, 10);
          }
          if (data.phone != null) {
            data.phoneFilter = data.phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
          }
          var avatarUrl = "../../images/pagelayout/avatar.png";
          if (data.logo != null && data.logo != undefined && data.logo != "") {
            avatarUrl = data.logo;
          }
          if (data.avatarUrl != null && data.avatarUrl != undefined && data.avatarUrl != "") {
            avatarUrl = data.avatarUrl;
          }
          if (data.empLogo != null && data.empLogo != undefined && data.empLogo != "") {
            avatarUrl = data.empLogo;
          }

          var imageURL = "";

          if (data.imageURL != null && data.imageURL != undefined && data.imageURL != "") {
            imageURL = data.imageURL;
          }
          if (data.empLevelImageURL != null && data.empLevelImageURL != undefined && data.empLevelImageURL != "") {
            imageURL = data.empLevelImageURL;
          }

          var empDisplayName = "";
          if (data.title != null && data.title != undefined && data.title != "") {
            empDisplayName = data.title;
          }
          if (data.empAlias != null && data.empAlias != undefined && data.empAlias != "") {
            empDisplayName = data.empAlias;
          }
          if (data.empDisplayName != null && data.empDisplayName != undefined && data.empDisplayName != "") {
            empDisplayName = data.empDisplayName;
          }

          pageMain.setData({
            _empInfo: data,
            _avatarUrl: avatarUrl,
            _imageUrl: imageURL,
            _empDisplayName: empDisplayName
          });

          pageMain.checkEmpStatus(data);
        }
      });
    },
    checkEmpStatus: function checkEmpStatus(empInfo) {
      var pageMain = this;

      if (empInfo.isBindEmp) {
        storage.setBindEmp();
        pageMain.setData({
          _empStatusGrant: true,
          _empStatusRegister: true
        });
      } else if (empInfo.avatarUrl != null && empInfo.avatarUrl != "" && empInfo.avatarUrl != undefined) {
        pageMain.setData({
          _empStatusGrant: true,
          _empStatusRegister: false
        });
      }
    },

    // 授权用户信息
    grantUserInfo: function grantUserInfo(e) {
      var _this = this;

      if (e.detail.errMsg == "getUserInfo:ok") {
        // 授权成功
        setTimeout(function () {
          _this.setData({
            _avatarUrl: e.detail.userInfo.avatarUrl,
            _empDisplayName: e.detail.userInfo.nickName,
            _empStatusGrant: true
          });
        }, 500);

        ht.grantUserInfo({
          EncryptedData: e.detail.encryptedData,
          IV: e.detail.iv
        });
      } else {
        // 授权失败
      }
    },
    //注册会员
    registerEmp: function registerEmp(e) {
      this.triggerEvent("eventRegister", {
        EncryptedData: e.detail.encryptedData,
        IV: e.detail.iv
      });
      return;
    },
    // //-- 注册成功后，刷新数据
    // eventHandleRegisterFinish() {
    //   this.initModuleEmp();
    // },

    //头像跳转
    clickEmpLogo: function clickEmpLogo(e) {
      if (e.target.dataset.url != "" && e.target.dataset.url != null && e.target.dataset.url != undefined) {
        ht.navigate({
          redirectUrl: e.target.dataset.url
        });
      }
    },
    linkToEmpQRcode: function linkToEmpQRcode(e) {
      ht.navigate({
        redirectUrl: "/AppHR/EmpInfo/QRCode"
      });
    },

    linkToPerfectEmp: function linkToPerfectEmp() {
      ht.navigate({
        redirectUrl: "/AppHR/EmpInfo/EmpInfo"
      });
    },
    linkToEmpSignIn: function linkToEmpSignIn() {
      ht.navigate({
        redirectUrl: "/AppInteract/SignIn/Index"
      });
    },

    linkToEmpSubscribe: function linkToEmpSubscribe() {
      if (this.data._empInfo.subscribeImageURL != "" && this.data._empInfo.subscribeImageURL != null && this.data._empInfo.subscribeImageURL != undefined) {
        this.triggerEvent("eventEmpSubscribe", {
          subscribeImageURL: this.data._empInfo.subscribeImageURL
        });
      }
    }
  },

  lifetimes: {
    attached: function attached() {},
    ready: function ready() {}
  }
});