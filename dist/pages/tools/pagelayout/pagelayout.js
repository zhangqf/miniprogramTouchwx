"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ht = require("../../../js/ht.js");
var storage = require("../../../js/storage.js");
var config = require("../../../js/config.js");
var app = getApp();

exports.default = Page({
  data: {
    //-- 页面布局数据
    _pageLayoutData: null,
    //-- 当前导航序号
    _activeNavigateIndex: 0,

    //-- 关注（开启通知）
    _isShowEmpSubscribeImage: false,
    _subscribeImageURL: null,
    //-- 会员注册弹出
    _isShowPopupEmpRegister: false,

    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "rpx",
    POPUP_TOP: (wx.WIN_HEIGHT - 270) / 2 + "px",
    _enumData: {
      PageLayoutNavigateTypeEnum_SystemPage: 10,
      PageLayoutNavigateTypeEnum_JumpMiniProgram: 20,
      PageLayoutNavigateTypeEnum_JumpLink: 30,

      //-- 页面布局链接跳转类型
      PageLayoutLinkJumpTypeEnum_Direct: 10,
      PageLayoutLinkJumpTypeEnum_AppLoadingURL: 20,

      //--页面布局导航模块类型
      PageLayoutNavigateModuleTypeEnum_Emp: 110,
      PageLayoutNavigateModuleTypeEnum_Image: 900,
      PageLayoutNavigateModuleTypeEnum_Banner: 910,
      PageLayoutNavigateModuleTypeEnum_Content: 920,
      PageLayoutNavigateModuleTypeEnum_Function: 930
    }
  },

  onLoad: function onLoad(options) {
    var pageMain = this;
    // 登录
    ht.login({
      aleardyLogin: function aleardyLogin() {
        pageMain.getPageLayoutData(options.PageLayoutName);
      },
      loginSuccess: function loginSuccess(data) {
        pageMain.getPageLayoutData(options.PageLayoutName);
      },
      loginFail: function loginFail() {
        //-- 提示，退出
      }
    });
  },
  eventHandleShowSubImage: function eventHandleShowSubImage(e) {
    this.setData({
      _isShowEmpSubscribeImage: true,
      _subscribeImageURL: e.detail.subscribeImageURL
    });
  },

  cancelShowEmpSubscribeImage: function cancelShowEmpSubscribeImage() {
    this.setData({
      _isShowEmpSubscribeImage: false
    });
  },

  eventHandlePopupEmpRegister: function eventHandlePopupEmpRegister() {
    this.setData({
      _isShowPopupEmpRegister: true
    });
  },
  cancelRegisterEmp: function cancelRegisterEmp() {
    this.setData({
      _isShowPopupEmpRegister: false
    });
  },


  //注册会员
  registerEmp: function registerEmp(e) {
    var pageMain = this;
    pageMain.setData({
      _isShowPopupEmpRegister: false
    });

    ht.registerEmp({
      EncryptedData: e.detail.EncryptedData,
      IV: e.detail.IV,

      success: function success(data) {
        pageMain.selectComponent("#empmoudle").initModuleEmp();
      },
      fail: function fail() {}
    });
  },

  getPageLayoutData: function getPageLayoutData(pageLayoutName) {
    var pageMain = this;

    if (pageLayoutName == "" || pageLayoutName == undefined) {
      pageLayoutName = config.defaultPageLayoutName;
    }

    ht.setForm({
      url: "/pageLayout/GetEntityByNameAsync",
      data: {
        value: pageLayoutName
      },
      success: function success(data) {
        //-- 处理导航图标
        data.listNavigate.forEach(function (navigateItem) {
          if (navigateItem.selectIcon == null || navigateItem.selectIcon == "" || navigateItem.selectIcon == undefined) {
            navigateItem.selectIcon = navigateItem.icon;
          }
        });

        data.listNavigate.forEach(function (ele, i) {
          Object.assign(ele, { isLoading: false, isShow: false });
        });
        pageMain.setData({
          _pageLayoutData: data
        });

        //-- 初始化导航
        pageMain.initNavigateTab(data);
        //-- 显示第一项
        pageMain.changeNavigate(0);
      },
      fail: function fail(data) {}
    });
  },
  // 动态导航配置
  initNavigateTab: function initNavigateTab(data) {
    //   动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: data.displayName
    });

    // 设置页面导航条颜色
    wx.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: data.navigateBackgroundColor,
      animation: {
        //动画效果
        duration: 400, //动画变化的时间 ms
        timingFunc: "easeIn" // 动画变化方式 linear easeOut easeIn easeInOut
      },
      success: function success() {},
      fail: function fail() {},
      complete: function complete() {}
    });

    // 设置底部导航
    wx.setTabBarStyle({
      color: "#FF0000",
      selectedColor: "#00FF00",
      backgroundColor: "#0000FF",
      borderStyle: "white"
    });
  },


  // 设置单个导航的数据
  changeNavigate: function changeNavigate(index) {
    var pageMain = this;

    var currNavigate = pageMain.data._pageLayoutData.listNavigate[index];

    if (currNavigate.navigateType == pageMain.data._enumData.PageLayoutNavigateTypeEnum_SystemPage) {
      this.showNaivgate(index);
    } else if (currNavigate.navigateType == pageMain.data._enumData.PageLayoutNavigateTypeEnum_JumpMiniProgram) {
      ht.navigateToMiniprogram({
        appID: currNavigate.miniProgramAppID,
        path: currNavigate.miniProgramPath
      });
    } else if (currNavigate.navigateType == pageMain.data._enumData.PageLayoutNavigateTypeEnum_JumpLink) {
      if (currNavigate.linkURL != "" && currNavigate.linkURL != null && currNavigate.linkURL != undefined) {
        if (currNavigate.linkJumpType == pageMain.data._enumData.PageLayoutLinkJumpTypeEnum_Direct) {
          //直跳
          ht.navigate({
            redirectUrl: currNavigate.linkURL,
            isDirect: true
          });
        } else if (currNavigate.linkJumpType == pageMain.data._enumData.PageLayoutLinkJumpTypeEnum_AppLoadingURL) {
          //apploading跳转
          ht.navigate({
            redirectUrl: currNavigate.linkURL
          });
        }
      }
    }
  },

  // 页面信息
  showNaivgate: function showNaivgate(index) {
    var pageMain = this;

    var pageLayoutData = pageMain.data._pageLayoutData;
    var navigateData = pageLayoutData.listNavigate[index];

    //-- 全部置为隐藏状态
    pageLayoutData.listNavigate.forEach(function (item, i) {
      item.isShow = false;
    });

    //-- 置为显示状态
    navigateData.isShow = true;

    // //-- 如未加载，置为加载
    navigateData.isLoading = true;

    pageMain.setData({
      _pageLayoutData: pageLayoutData
    });
  },


  //-- 图片模块链接点击跳转
  goImageLink: function goImageLink(e) {
    var url = e.currentTarget.dataset.url;
    if (url != "" && url != null && url != undefined) {
      var linkjumptype = e.currentTarget.dataset.linkjumptype;
      if (linkjumptype == this.data._enumData.PageLayoutLinkJumpTypeEnum_Direct) {
        //直跳
        ht.navigate({
          redirectUrl: url,
          isDirect: true
        });
      } else if (linkjumptype == this.data._enumData.PageLayoutLinkJumpTypeEnum_Direct) {
        //apploading跳转
        ht.navigate({
          redirectUrl: url
        });
      }
    }
  },


  //-- 导航点击事件
  btntarbar: function btntarbar(e) {
    var pageMain = this;

    var index = e.currentTarget.dataset.num;
    var isOnlyEmp = e.currentTarget.dataset.isonlyemp;
    if (isOnlyEmp && !storage.isBindEmp()) {
      pageMain.eventHandlePopupEmpRegister();
    } else {
      pageMain.setData({
        _activeNavigateIndex: index
      });

      pageMain.changeNavigate(index);
    }
  },
  onReady: function onReady() {},
  onShow: function onShow(options) {}
});