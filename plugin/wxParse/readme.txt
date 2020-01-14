

添加人：张峰
添加日期：20191201


=================================================
修改记录：20191201


var article = '<div>我是HTML代码</div>';
/**
* WxParse.wxParse(bindName , type, data, target,imagePadding)
* 1.bindName绑定的数据名(必填)
* 2.type可以为html或者md(必填)
* 3.data为传入的具体数据(必填)
* 4.target为Page对象,一般为this(必填)
* 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
*/
var that = this;
WxParse.wxParse('article', 'html', article, that, 5);


由于取出的图片路径有问题（没有域名）导致取不到相应的图片 故增加了一个参数 config.imageRootPath

WxParse.wxParse('article', 'html', article, that, 5，config.imageRootPath);



=================================================