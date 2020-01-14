
全页面调用
ht.login(){

	var openid = ht.storage.getOpenID();

	var isLoginCookieActive = ht.storage.isLoginCookieActive();

	if (isCookieActive && wx.checkssion()) {
		//-- 已登录
		return;
	}

	//-- 登录
	wx.login()
	//-- 调用接口
	ht.setFrom()
	{
		//-- 保存cooke/cookieTimeout、openid、isBindEmp
		ht.storage.setOpenID(); 
		ht.storage.setLoginCookie();
	}
}


需要显示头像的页面
if (ht.isGrantUserInfo) {
	wx.getuserinfo(false)
	//-- 显示头像、昵称等
}
else {
	//-- 显示授权按钮
	wx.getuserinfo(true)
	//-- 调用接口
	//-- 显示头像、昵称等
}



ht.isGrantUserInfo(){
	if (wx.getsetting)
		return res.scope;
}


需要注册的页面
if (ht.storage.isBindEmp) {
	//-- 调用接口，根据openid获取信息
	//-- 显示会员信息
}
else {
	//-- 显示注册按钮
	//-- 获取手机号，调用接口注册
	//-- 显示会员信息
}

ht.navigateH5()