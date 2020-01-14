

const config = require("./config.js");



function getOpenID() {
    return wx.getStorageSync("OpenId");
}

function setOpenID(OpenId) {
    return wx.setStorageSync("OpenId", OpenId);
}



function isBindEmp() {
    var isBindEmp = wx.getStorageSync("IsBindEmp");

    return isBindEmp == true;
}


function setBindEmp() {
    wx.setStorageSync("IsBindEmp", true);
}

// Cookie管理
function setCookie(cookiesString) {

    const cookies = cookiesString.split(/,(?=[A-Z|\.])/g)
    
    const arrCookies = {};
  
    cookies.map((value, index) => {
        /* 
        取Cookie的主键，第一个=号之前的字符串
        如果savedCookies中有此主键，覆盖，没有，则添加
        */
        const items = value.split(";");
        if (items && items.length == 0)
            return;

        const data = items[0].split("=");
        if (data && data.length == 0)
            return;

        var key = data[0];

        arrCookies[key] = value;

    });

    var arrCookiesExist = getCookie();


    if (arrCookiesExist && arrCookiesExist != null) {

        Object.assign(arrCookies, arrCookiesExist);
    }

    wx.setStorageSync("cookie", arrCookies);
    wx.setStorageSync("cookieTimeStamp", Date.parse(new Date()));
}


function getCookie() {
    return wx.getStorageSync("cookie")
}

function getCookieString() {
    var arrCookiesExist = getCookie();
  
    var arrCookiesExistValue = Object.values(arrCookiesExist);
 
    var result = "";

    for (var i = 0; i < arrCookiesExistValue.length; i++) {
        if (result.length > 0)
            result += ";";
    
        if(Object.prototype.toString.call(arrCookiesExistValue[i]) != "[object Function]"){
            result += arrCookiesExistValue[i].replace(/,/g, ";");
        }
       
    }
    
    return result;
   
}

function removeLocalCookie() {
    wx.removeStorageSync("cookie");
    wx.removeStorageSync("cookieTimeStamp");
    
}


function checkCookieTimeout() {

    var cookie = getCookie();
    if (cookie == null || cookie == "undefined") {
      
        return false;
    }

    var cookieTimeStamp = wx.getStorageSync("cookieTimeStamp");
    var nowTimeStamp = Date.parse(new Date());

    if (nowTimeStamp - cookieTimeStamp >= config.CookeTimeout * 60 * 1000) {
        removeLocalCookie();
        return false;
    }

    return true
}


module.exports = {
    setCookie,
    getCookie,
    getCookieString,
    removeLocalCookie,
    checkCookieTimeout,
    getOpenID,
    setOpenID,
    isBindEmp,
    setBindEmp
}
