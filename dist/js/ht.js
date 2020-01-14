"use strict";

var config = require("./config.js");
var storage = require("./storage.js");
var _defaultsDeep = require("../packages/lodash.defaultsdeep/index.js");

var promiseSetForm = function promiseSetForm(options) {

    return new Promise(function (resolve, reject) {

        options.resolve = resolve;
        options.reject = reject;

        setForm(options);
    });
};

var setForm = function setForm(options) {
    var defaults = {
        isLoading: true,
        loadingText: "正在加载..",
        isApi: true,
        url: "",
        data: [],
        method: "POST",
        dataType: "json",
        header: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        async: false,
        isMsg: false,
        success: function success() {},
        fail: function fail() {},
        complete: function complete() {},

        resolve: function resolve() {},
        reject: function reject() {}

    };

    _defaultsDeep(options, defaults);

    if (options.isLoading) wx.showLoading({
        title: options.loadingText
    });

    if (options.isApi) options.url = config.appPath + config.apiPath + options.url;else options.url = config.appPath + options.url;

    var cookie = storage.getCookie();
    if (cookie) {
        options.header.Cookie = storage.getCookieString();
    }

    wx.request({
        url: options.url,
        data: options.data,
        method: options.method,
        dataType: options.dataType,
        header: options.header,

        success: function success(res) {

            if (res.statusCode == 200 && res.data && res.data.success) {

                //-- 保存Cookie
                for (var key in res.header) {

                    if (key.toLowerCase() == 'set-cookie') {

                        storage.setCookie(res.header[key]);
                    }
                }

                //-- 成功回调
                if (res.data.success) {
                    options.success && options.success(res.data.result);

                    options.resolve && options.resolve(res.data.result);
                }
            } else {

                //-- 失败回调
                options.fail && options.fail();
            }

            //-- ABP返回 失败提示
            if (!res.data.success) {

                if (res.data.message) {

                    wx.showLoading({
                        title: res.data.message
                    });
                }
            }
        },

        fail: function fail(res) {

            options.fail && options.fail();

            wx.showLoading({
                title: res.errMsg
            });
        },
        complete: function complete(res) {

            options.complete && options.complete(XMLHttpRequest);

            setTimeout(function () {
                wx.hideLoading();
            }, config.LoadingTimeout);
        }
    });
};

var request = function request(key) {

    //该函数获取所有栈内的路由
    var pages = getCurrentPages();
    //数组中最后一个即当前路由，options是参数

    var _pages$pop = pages.pop(),
        options = _pages$pop.options;

    if (Object.keys(options).includes(key)) {
        return options[key];
    } else {
        return;
    }
};

var login = function login(options) {
    var defaults = {
        //-- 回调函数
        aleardyLogin: function aleardyLogin() {}, //-- 已登录
        loginSuccess: function loginSuccess() {}, //-- 登录成功
        loginFail: function loginFail() {} //-- 登录失败
    };

    _defaultsDeep(options, defaults);

    var openID = storage.getOpenID();
    var isLoginCookieActive = storage.checkCookieTimeout();

    wx.checkSession({
        success: function success() {

            if (isLoginCookieActive) {

                options.aleardyLogin();
            } else {

                callLogin(options);
            }
        },
        fail: function fail() {

            callLogin(options);
        }
    });
};

var callLogin = function callLogin(options) {

    _wxlogin().then(function (res) {

        setForm({
            isApi: false,
            url: "/Weixin/Home/MiniProgramLoginAsync",
            data: {
                Code: res.code,
                TenancyName: config.tenancyName,
                UserName: config.userName,
                AppID: config.getAppID()
            },
            success: function success(data) {

                storage.setOpenID(data.openID);

                if (data.bindEmpID) storage.setBindEmp();

                options.loginSuccess && options.loginSuccess(data);
            },
            fail: function fail() {
                options.loginFail();
            }
        });
    }).then(function (res) {

        options.loginFail();
    });
};

var _wxlogin = function _wxlogin() {
    return new Promise(function (resolve, reject) {
        wx.login({
            complete: function complete(res) {

                wx.hideLoading();
                if (res.errMsg == "login:ok") {

                    resolve(res);
                } else {

                    reject(res.errMsg);
                }
            }

        });
    });
};

var getUserInfo = function getUserInfo(options) {

    var defaults = {

        success: function success() {},
        fail: function fail() {}

    };

    _defaultsDeep(options, defaults);

    wx.getSetting({
        success: function success(res) {

            if (res.authSetting["scope.userInfo"]) {

                wx.getUserInfo({
                    withCredentials: false,
                    success: function success(data) {

                        options.success && options.success(data);
                    }
                });
            } else {

                options.fail();
            }
        }
    });
};

var grantUserInfo = function grantUserInfo(options) {

    var defaults = {

        EncryptedData: "",
        IV: "",

        success: function success() {},
        fail: function fail() {}

    };

    _defaultsDeep(options, defaults);

    var openid = storage.getOpenID();

    setForm({
        url: "/WeixinMiniProgram/GrantAsync",
        data: {
            EncryptedData: options.EncryptedData,
            IV: options.IV,
            OpenID: openid
        },
        success: function success(data) {

            options.success && options.success(data);
        },
        fail: function fail() {

            options.fail();
        }
    });
};

var registerEmp = function registerEmp(options) {

    var defaults = {

        EncryptedData: "",
        IV: "",

        success: function success() {},
        fail: function fail() {}

    };

    _defaultsDeep(options, defaults);

    var openid = storage.getOpenID();

    setForm({
        url: "/WeixinMiniProgram/RegisterAsync",
        data: {
            encryptedData: options.EncryptedData,
            iv: options.IV,
            OpenID: openid
        },
        success: function success(data) {

            options.success && options.success(data);
        },
        fail: function fail() {

            options.fail();
        }
    });
};

var navigateToCallPhone = function navigateToCallPhone(options) {

    var defaults = {};

    _defaultsDeep(options, defaults);

    //拨打电话
    wx.showActionSheet({
        itemList: options.phone,
        success: function success(res) {
            wx.makePhoneCall({
                phoneNumber: options.phone,
                success: function success() {},
                fail: function fail() {}
            });
            if (!res.cancel) {}
        }
    });
};

var navigateToMiniprogram = function navigateToMiniprogram(options) {

    var defaults = {

        appid: "",
        path: "",
        extraData: {}
    };

    _defaultsDeep(options, defaults);

    //小程序
    wx.navigateToMiniProgram({
        appId: options.appid,
        path: options.path,
        extraData: options.extraData

    });
};

var navigate = function navigate(options) {

    var defaults = {

        redirectUrl: "",
        isDirect: false,
        isHasBack: true
    };

    _defaultsDeep(options, defaults);

    var url = "../webview/webview";

    url += "?RedirectURL=" + encodeURIComponent(options.redirectUrl);
    if (options.isDirect) {
        url += "&IsDirect=1";
    }

    if (options.isHasBack) {
        wx.navigateTo({
            url: url
        });
    } else {
        wx.redirectTo({
            url: url
        });
    }
};

var getAppLoadingURL = function getAppLoadingURL(url) {

    //http://www.chn-ht.com/Sunp/Weixin/Home/AppLoading?TenancyName=default&UserName=admin&AppID=wx7a02105dbb1b3df3&OpenID=o9VzM4gRVN2ZAXq1aQinNItivhUM&MiniProgram=1&RedirectURL=http%3A%2F%2Fwww.chn-ht.com%2FSunp%2FAppTicket%2FTicket%2FBuyTicket

    //-- URL 必须为标准短路径格式 /appframework/test/test

    var openid = storage.getOpenID();

    //-- 增加网站前缀
    if (!/^http/.test(url)) {
        url = config.appPath + url;
    }

    var redirectURL = config.appPath + "/Weixin/Home/AppLoading";

    redirectURL += "?TenancyName=" + config.tenancyName;
    redirectURL += "&UserName=" + config.userName;
    redirectURL += "&AppID=" + config.getAppID();
    redirectURL += "&OpenID=" + openid;
    redirectURL += "&MiniProgram=1";

    redirectURL += "&RedirectURL=" + encodeURIComponent(url);

    return redirectURL;
};

module.exports = {
    setForm: setForm,
    promiseSetForm: promiseSetForm,

    request: request,

    login: login,

    getUserInfo: getUserInfo,
    grantUserInfo: grantUserInfo,

    registerEmp: registerEmp,

    navigate: navigate,
    navigateToMiniprogram: navigateToMiniprogram,

    navigateToCallPhone: navigateToCallPhone,

    getAppLoadingURL: getAppLoadingURL

};