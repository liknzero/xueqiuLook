const express = require('express');
const moment = require('moment')
const { readFileSync, existsSync, writeFileSync, readdirSync, mkdirSync } = require('fs');
const app = express();

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//写个接口moyu
app.get('/get-json', function (req, res) {
    console.log(req.query)
    const defaultQuery = {
        marketLeft: null,
        marketRight: null,
        time: '',
        size: 10,
        page: 1
    }
    Object.assign(defaultQuery, {
        time: req.query.time || moment().format('YYYY-M-D'),
        page: req.query.page || 1,
        size: req.query.size || 10
    })
    
    const a = defaultQuery.time.split('-')
    a.pop()
    const b = a.join('-') 
    const c = `${b}/${defaultQuery.time}.json`
    let data = {
        record: [],
        total: 0,
        page: defaultQuery.page,
        size: defaultQuery.size
    }
    let code = 0
    if (existsSync(c)) {
        const { page, size } = defaultQuery
        const record = JSON.parse(readFileSync(c, 'utf-8'))
        Object.assign(data, {
            total: record.length,
            record: record.slice((page-1)*size, page*size)
        })
    } else {
        code = 1
    }
    res.status(200)
    res.json({
        code,
        data
    })
});

//配置服务端口
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})