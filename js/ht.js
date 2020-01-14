const config = require("./config.js");
const storage = require("./storage.js");
const _defaultsDeep = require('lodash.defaultsdeep');


const promiseSetForm = function(options) {

    return new Promise(function(resolve, reject) {

        options.resolve = resolve;
        options.reject = reject;

        setForm(options);
    });
}


const setForm = function(options) {
    const defaults = {
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
        success: function() {},
        fail: function() {},
        complete: function() {},

        resolve: function() {},
        reject: function() {},


    };

    _defaultsDeep(options, defaults)

    if (options.isLoading)
        wx.showLoading({
            title: options.loadingText,
        });

    if (options.isApi)
        options.url = config.appPath + config.apiPath + options.url
    else
        options.url = config.appPath + options.url;


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

        success: function(res) {

            if (res.statusCode == 200 && res.data && res.data.success) {

                //-- 保存Cookie
                for (let key in res.header) {

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
                        title: res.data.message,
                    });
                }
            }
        },

        fail: function(res) {

            options.fail && options.fail();


            wx.showLoading({
                title: res.errMsg,
            });
        },
        complete: function(res) {

            options.complete && options.complete(XMLHttpRequest);

            setTimeout(function() {
                wx.hideLoading();
            }, config.LoadingTimeout);
        }
    });

}

const request = function(key) {

    //该函数获取所有栈内的路由
    let pages = getCurrentPages();
    //数组中最后一个即当前路由，options是参数
    let { options } = pages.pop();

    if (Object.keys(options).includes(key)) {
        return options[key];
    } else {
        return;
    }
}


const login = function(options) {
    const defaults = {
        //-- 回调函数
        aleardyLogin: function() {}, //-- 已登录
        loginSuccess: function() {}, //-- 登录成功
        loginFail: function() {}, //-- 登录失败
    };

    _defaultsDeep(options, defaults)


    var openID = storage.getOpenID();
    var isLoginCookieActive = storage.checkCookieTimeout();


    wx.checkSession({

        success() {

            if (isLoginCookieActive) {


                options.aleardyLogin();

            } else {


                callLogin(options)
            }
        },
        fail() {


            callLogin(options)
        }
    })
}

const callLogin = function(options) {

    _wxlogin()
        .then(res => {

            setForm({
                isApi: false,
                url: "/Weixin/Home/MiniProgramLoginAsync",
                data: {
                    Code: res.code,
                    TenancyName: config.tenancyName,
                    UserName: config.userName,
                    AppID: config.getAppID(),
                },
                success(data) {

                    storage.setOpenID(data.openID);

                    if (data.bindEmpID) storage.setBindEmp();

                    options.loginSuccess && options.loginSuccess(data);

                },
                fail() {
                    options.loginFail();
                }
            })
        })
        .then(res => {

            options.loginFail();
        })
}

const _wxlogin = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            complete: (res) => {

                wx.hideLoading();
                if (res.errMsg == "login:ok") {

                    resolve(res)
                } else {

                    reject(res.errMsg)
                }
            }

        })
    })
}


const getUserInfo = function(options) {

    const defaults = {

        success: function() {},
        fail: function() {},

    }

    _defaultsDeep(options, defaults);

    wx.getSetting({

        success(res) {

            if (res.authSetting["scope.userInfo"]) {


                wx.getUserInfo({
                    withCredentials: false,
                    success: function(data) {

                        options.success && options.success(data);
                    }
                })
            } else {

                options.fail();
            }
        }
    })
}

const grantUserInfo = function(options) {

    const defaults = {

        EncryptedData: "",
        IV: "",

        success: function() {},
        fail: function() {},

    }

    _defaultsDeep(options, defaults);

    var openid = storage.getOpenID();


    setForm({
        url: "/WeixinMiniProgram/GrantAsync",
        data: {
            EncryptedData: options.EncryptedData,
            IV: options.IV,
            OpenID: openid,
        },
        success(data) {

            options.success && options.success(data);
        },
        fail() {

            options.fail();
        }
    })
}



const registerEmp = function(options) {

    const defaults = {

        EncryptedData: "",
        IV: "",

        success: function() {},
        fail: function() {},

    }

    _defaultsDeep(options, defaults);

    var openid = storage.getOpenID();


    setForm({
        url: "/WeixinMiniProgram/RegisterAsync",
        data: {
            encryptedData: options.EncryptedData,
            iv: options.IV,
            OpenID: openid,
        },
        success(data) {

            options.success && options.success(data);
        },
        fail() {

            options.fail();
        }
    })
}


const navigateToCallPhone = function(options) {

    const defaults = {

    }

    _defaultsDeep(options, defaults);

    //拨打电话
    wx.showActionSheet({
        itemList: options.phone,
        success: function(res) {
            wx.makePhoneCall({
                phoneNumber: options.phone,
                success: function() {},
                fail: function() {}
            });
            if (!res.cancel) {

            }
        }
    });

}


const navigateToMiniprogram = function(options) {

    const defaults = {

        appid: "",
        path: "",
        extraData: {},
    }

    _defaultsDeep(options, defaults);

    //小程序
    wx.navigateToMiniProgram({
        appId: options.appid,
        path: options.path,
        extraData: options.extraData,

    });

}

const navigate = function(options) {

    const defaults = {

        redirectUrl: "",
        isDirect: false,
        isHasBack: true,
    }

    _defaultsDeep(options, defaults);


    var url = "../webview/webview";

    url += "?RedirectURL=" + encodeURIComponent(options.redirectUrl);
    if (options.isDirect) {
        url += "&IsDirect=1";
    }

    if (options.isHasBack) {
        wx.navigateTo({
            url: url,
        });
    } else {
        wx.redirectTo({
            url: url
        })
    }

}






const getAppLoadingURL = function(url) {

    //http://www.chn-ht.com/Sunp/Weixin/Home/AppLoading?TenancyName=default&UserName=admin&AppID=wx7a02105dbb1b3df3&OpenID=o9VzM4gRVN2ZAXq1aQinNItivhUM&MiniProgram=1&RedirectURL=http%3A%2F%2Fwww.chn-ht.com%2FSunp%2FAppTicket%2FTicket%2FBuyTicket

    //-- URL 必须为标准短路径格式 /appframework/test/test

    var openid = storage.getOpenID();


    //-- 增加网站前缀
    if (!(/^http/.test(url))) {
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

}

module.exports = {
    setForm,
    promiseSetForm,

    request,

    login,

    getUserInfo,
    grantUserInfo,

    registerEmp,

    navigate,
    navigateToMiniprogram,

    navigateToCallPhone,

    getAppLoadingURL

}