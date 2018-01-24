const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');
const querystring = require('querystring');
const moment = require('moment');
const axios = require('axios');



const postData = querystring.stringify({
  'erectDate' : moment().format('YYYY-MM-DD'),
  'nothing' : moment().format('YYYY-MM-DD'),
  'pjname' : '1316'
});


// const req = http.request({
// 	method: "POST",  
//     host: "srh.bankofchina.com",  
//     path: "/search/whpj/search.jsp",  
// } ,(res) => {
// 	//console.log(res);
// 	res.setEncoding('utf-8'); //防止中文乱码
// 	//用来存储请求网页的整个html内容
// 	var html = '';        
// 	//监听data事件，每次取一块数据
// 	res.on('data', (chunk) => {   
// 	    html += chunk;
// 	});
// 	//监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
// 	res.on('end' , () => {

// 		//采用cheerio模块解析html
// 		var $ = cheerio.load(html); 

// 		var table = $('.BOC_main');

// 		fs.writeFile('age.xml' ,table.html(),(err)=>{
// 			if (!err) {
// 		        console.log('抓取成功');
// 		    }
// 		});
// 	})
// });

// req.write(postData);
// req.end();

const HTTP = axios.create({
    baseURL: 'http://srh.bankofchina.com/search/whpj',
    params: {},
    data: {},
    transformRequest: [function (data) {
        // Do whatever you want to transform the data
        let ret = ''
        for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }],
});
 
// 添加请求拦截器
HTTP.interceptors.request.use(function (config) {
    if(config.method.toLocaleLowerCase() === 'post'){
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    }
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

HTTP.post('/search.jsp' ,{
	'erectDate' : moment().format('YYYY-MM-DD'),
	'nothing' 	: moment().format('YYYY-MM-DD'),
	'pjname' 	: '1316'
}).then((res)=>{
		//采用cheerio模块解析html
		var $ = cheerio.load(res.data); 

		var table = $('.BOC_main');

		fs.writeFile('age.xml' ,table.html(),(err)=>{
			if (!err) {
		        console.log('抓取成功');
		    }
		});
}).catch((err)=>{
	console.log(err);
});