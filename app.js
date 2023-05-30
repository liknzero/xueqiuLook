const express = require("express");
const moment = require("moment");
const {
  readFileSync,
  existsSync,
} = require("fs");
const app = express();

//设置跨域访问
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//写个接口moyu
app.get("/get-json", function (req, res) {
  console.log(req.query);
  const defaultQuery = {
    marketLeft: null,
    marketRight: null,
    name: "",
    peTTM: null,
    dividendYield: null,
    symbol: "",
    time: "",
    size: 10,
    page: 1,
  };
  Object.assign(defaultQuery, {
    name: req.query.name || "",
    symbol: req.query.symbol || "",
    page: req.query.page || 1,
    dividendYield: req.query.dividendYield,
    peTTM: req.query.peTTM,
    size: req.query.size || 10,
    marketLeft: req.query.marketLeft * 100000000,
    marketRight: req.query.marketRight * 100000000,
    time: req.query.time || moment().format("YYYY-M-D"),
  });

  const a = defaultQuery.time.split("-");
  a.pop();
  const b = a.join("-");
  const c = `${b}/${defaultQuery.time}.json`;
  let data = {
    record: [],
    total: 0,
    page: defaultQuery.page,
    size: defaultQuery.size,
  };
  let code = 0;
  if (existsSync(c)) {
    const {
      name,
      symbol,
      peTTM,
      dividendYield,
      page,
      size,
      marketLeft,
      marketRight,
    } = defaultQuery;
    let record = JSON.parse(readFileSync(c, "utf-8"));
    record = record.filter((i) => {
      if (name && !i.name.includes(name)) {
        return false;
      }
      if (symbol && !i.symbol.includes(symbol)) {
        return false;
      }
      if (peTTM && i.pe_ttm > peTTM) {
        return false;
      }
      if (dividendYield && i.dividend_yield < dividendYield) {
        return false;
      }
      if (marketLeft && marketRight) {
        return marketLeft < i.market_capital && i.market_capital < marketRight;
      }
      if (marketLeft) {
        return i.market_capital > marketLeft;
      }
      if (marketRight) {
        return i.market_capital < marketRight;
      }
      return true;
    });
    Object.assign(data, {
      total: record.length,
      record: record.slice((page - 1) * size, page * size),
    });
  } else {
    code = 1;
  }
  res.status(200);
  res.json({
    code,
    data,
  });
});

//配置服务端口
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
