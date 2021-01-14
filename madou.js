var request = require('request');
var fs = require("fs");

// 这里设置开始时间 假如早上8.00开抢 建议设置startHour=7 startMinute=59或者58  反正要提前
// 开始时间的小时
let startHour=7
// 开始时间的分钟
let startMinute=0
// 设置关键词 关键词为你准备抢的东西 如果设置了关键词 检测到两件及以上1码豆商品时 会丢弃其他商品 只抢这个商品 未设置则同时抢（活动规则每次只能抢一个 所以抢到什么看脸）
let keyword='鼠标'
// 监控间隔 单位毫秒 1000毫秒为1秒 默认200毫秒
let timeout=200

let ck
let ckArr
let addList


let timer = setInterval(() => {
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    if (hour >= startHour && minute >= startMinute) {
        clearInterval(timer)
        console.log('到点啦~开始监控');
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
        console.log('无ck');
        return
    }
    request({
        url: "https://devcloud.huaweicloud.com/bonususer/v2/prize/queryList?categoryArr=&bonusQueryArr=&name=&prizeShowType=&prizeZone=1&_="+new Date().getTime(),
        method: "GET",
        headers: {
            "Cookie": ckArr[0],
            "cftk": getCookie(ckArr[0], 'cftk'),
        },
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let data = JSON.parse(body)
            if (data.status === 'success') {
                let flag = false
                let hasMouse = false
                let arr = []
                let mouseItem = ''
                let text = keyword
                data.result.forEach(item => {
                    if (item.bonus == "1") {
                        console.log('检测到' + item.name + '售价' + item.bonus);
                        if (text&&item.name.indexOf(text) != -1) {
                            mouseItem = item
                            hasMouse = true
                        }
                        arr.push(item)
                        flag = true
                    }
                })
                if (hasMouse) {
                    console.log('检测到关键字' + text + ',已丢弃其他商品，开始抢购' + mouseItem.name);
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
                }, timeout)
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
            if (body.result.result.length > 0) {
                addList[i] = body.result.result[0].id
            } else {
                addList[i] = ''
            }
            if (i == ckArr.length - 1) {
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

