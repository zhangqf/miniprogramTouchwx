

function getAppID() {
	return wx.getAccountInfoSync().miniProgram.appId;
  }
  

module.exports = {


	//===================================================================
	//-- 生产环境
	// 	appPath: "https://www.chn-hyd.com/HTS6",
	//  imageRootPath:"https://www.chn-hyd.com",
	// 	tenancyName: "demo",
	// 	userName: "admin",
	//  defaultPageLayoutName:"index_wx",

	//===================================================================
	//-- 测试环境
	appPath: "http://www.chn-ht.com/Sunp",
    imageRootPath:"http://www.chn-ht.com",
	tenancyName: "default",
	userName: "admin",
    defaultPageLayoutName:"123",



	//===================================================================
	//-- 不变内容
	apiPath: "/api/services/app",

	CookeTimeout: 120,		//-- 单位：分钟
	LoadingTimeout: 1500,	//-- 单位：毫秒

    getAppID, 

}
