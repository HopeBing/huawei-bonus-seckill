const express = require('express');
var request = require('request');
// var https = require('https');
var http = require('http');
var fs = require("fs");
const app = express();
var httpServer = http.createServer(app);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

let ck
let ckArr
let addList

function getTime(type, res) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '请求了' + type + '结果：' + res
}
app.get('/api/qiang', function (req, res) {
    let timer = setInterval(() => {
        let hour = new Date().getHours();
        let minute = new Date().getMinutes();
        if (hour >= 0 && minute >= 0) {
            clearInterval(timer)
            console.log('到点啦');
            let num = 0
            fs.readFile('hwck.txt', 'utf-8', function (err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    data = data.split('\n')
                    ckArr = []
                    data.forEach(item => {
                        ckArr.push(item)
                    })
                    ck = data[0]
                    console.log(ckArr);
                    getAddress()
                }
            });

        } else {
            console.log('当前' + hour + ':' + minute);
        }
    }, 1000);

    function getList() {
        if (!ckArr[0]) {
            res.send({
                code: -1,
                msg: "无ck"
            })
            return
        }
        request({
            url: "https://devcloud.huaweicloud.com/bonususer/v2/prize/queryList?categoryArr=&bonusQueryArr=&name=&prizeShowType=&prizeZone=1&_=1606982736048",
            method: "GET",
            headers: {
                "Cookie": ckArr[0],
                "cftk": getCookie(ckArr[0], 'cftk'),
            },
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let data = JSON.parse(body)
                // console.log(body);
                if (data.status === 'success') {
                    let flag = false
                    let hasMouse = false
                    let arr = []
                    let mouseItem = ''
                    let text="鼠标"
                    data.result.forEach(item => {
                        if (item.bonus == "1") {
                            console.log('检测到' + item.name + '售价' + item.bonus);
                            if (item.name.indexOf(text) != -1) {
                                mouseItem = item
                                hasMouse = true
                            }
                            arr.push(item)
                            flag = true
                        }
                    })
                    if (hasMouse) {
                        console.log('检测到关键字'+text+',已丢弃其他商品，开始抢购'+mouseItem.name);
                        miaoshaBtn(mouseItem.id, mouseItem.version)
                    } else {
                        arr.forEach(item => {
                            miaoshaBtn(item.id, item.version)
                        })
                    }
                    if (flag) return
                    console.log('暂未检测到');
                    setTimeout(() => {
                        getList()
                    }, 200)
                }
            }
        })
    }
    function miaoshaBtn(id, version) {
        for (let index = 0; index < ckArr.length; index++) {
            miaosha(id, version, ckArr[index], index)
        }
    }
    function miaosha(id, version, ckItem, index) {
        var formData = [{ "prize_id": id, "address_id": addList[index], "version": version }]
        formData = JSON.stringify(formData)
        request({
            url: 'https://devcloud.huaweicloud.com/bonususer/v1/user_exchanges/' + getCookie(ckItem, 'user_tag') + '/exchanges?_=' + new Date().getTime(),
            method: "POST",
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                "Cookie": ckItem,
                "cftk": getCookie(ckItem, 'cftk'),
            },
            body: formData
        }, function (error, response, body) {
            console.log(getCookie(ckItem, 'domain_tag') + '抢购结果' + body);
        })
    }
    function getAddress() {
        addList = []
        for (let i = 0; i < ckArr.length; i++) {
            request({
                url: 'https://devcloud.huaweicloud.com/bonususer/v2/address/queryPageList?page_no=1&page_size=5&_=' + new Date().getTime(),
                method: "GET",
                headers: {
                    "Content-type": "application/json;charset=UTF-8",
                    "Cookie": ckArr[i],
                    "cftk": getCookie(ckArr[i], 'cftk'),
                },
            }, function (error, response, body) {
                body = JSON.parse(body)
                // console.log(body);
                if (body.result.result.length > 0) {
                    addList[i] = body.result.result[0].id
                } else {
                    addList[i] = ''
                }
                if(i==ckArr.length-1){
                    getList()
                }
            })
        }
    }
    function getCookie(cookie, cookie_name) {
        var allcookies = cookie;
        //索引长度，开始索引的位置
        var cookie_pos = allcookies.indexOf(cookie_name);
        // 如果找到了索引，就代表cookie存在,否则不存在
        if (cookie_pos != -1) {
            // 把cookie_pos放在值的开始，只要给值加1即可
            //计算取cookie值得开始索引，加的1为“=”
            cookie_pos = cookie_pos + cookie_name.length + 1;
            //计算取cookie值得结束索引
            var cookie_end = allcookies.indexOf(";", cookie_pos);
            if (cookie_end == -1) {
                cookie_end = allcookies.length;
            }
            //得到想要的cookie的值
            var value = unescape(allcookies.substring(cookie_pos, cookie_end));
        }
        return value;
    }
});

//https监听3000端口
// httpsServer.listen(3000);
//http监听3001端口
httpServer.listen(3001);