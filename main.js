const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');
const moment = require('moment');
const axios = require('axios');

//创建一个axios实例， 解析post请求和参数编码
const HTTP = axios.create({
    baseURL: 'http://srh.bankofchina.com/search/whpj',
    params: {},
    data: {},
    transformRequest: [(data) => {
        // Do whatever you want to transform the data
        let ret = ''
        for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }],
});
 
// 添加请求拦截器
HTTP.interceptors.request.use((config) => {
    if(config.method.toLocaleLowerCase() === 'post'){
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 1315 --- 港币
// 1316 --- 美元
// 1317 --- 瑞士法郎
// 1318 --- 德国马克
// 1319 --- 法国法郎
// 1375 --- 新加坡元
// 1320 --- 瑞典克朗
// 1321 --- 丹麦克朗
// 1322 --- 挪威克朗
// 1323 --- 日元
// 1324 --- 加拿大元
// 1325 --- 澳大利亚元
// 1326 --- 欧元
// 1327 --- 澳门元
// 1328 --- 菲律宾比索
// 1329 --- 泰国铢
// 1330 --- 新西兰元
// 1331 --- 韩元
// 1843 --- 卢布
// 2890 --- 林吉特
// 2895 --- 新台币
// 1370 --- 西班牙比塞塔
// 1371 --- 意大利里拉
// 1372 --- 荷兰盾
// 1373 --- 比利时法郎
// 1374 --- 芬兰马克
// 3030 --- 印尼卢比
// 3253 --- 巴西里亚尔
// 3899 --- 阿联酋迪拉姆
// 3900 --- 印度卢比
// 3901 --- 南非兰特
// 4418 --- 沙特里亚尔
// 4560 --- 土耳其里拉

//发送请求
HTTP.post('/search.jsp' ,{
    //起始时间
	'erectDate' : moment().format('YYYY-MM-DD'),
    //结束时间
	'nothing' 	: moment().format('YYYY-MM-DD'),
    //牌价选择
	'pjname' 	: '1316',
    //爬取第几页
    'page'      : 1
}).then((res)=>{
		//采用cheerio模块解析html
		var $ = cheerio.load(res.data); 
        //找到页面table元素
		var table = $('.BOC_main').find('table');
        //将整个table的tbody写入到文件
		fs.writeFile('forex.xml' ,table.html(),(err)=>{
			if (!err) {
		        console.log('抓取成功');
		    }
		});
}).catch((err)=>{
	console.log('抓取失败！！！');
});