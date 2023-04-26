const { readFileSync, writeFileSync, readdirSync, mkdirSync } = require('fs')
const request = require('request');
const puppeteer = require('puppeteer')

const path = "./"
// 获取数据源
const getXueQiuJson = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://xueqiu.com/hq#exchange=CN&firstName=1&secondName=1_0');
  const cookies = await page.cookies();
  const cookiesUrlArr = ['device_id','snbim_minify','s','Hm_lvt_','xq_a_token','xqat','xq_r_token','xq_id_token','u','Hm_lpvt_']
  const cookiesUrlJoin = []
  const cookiesObj = {}
  cookiesUrlArr.forEach(item => {
    const oneC = cookies.find(k => k.name.includes(item))
    if (oneC) {
      cookiesObj[oneC.name] = oneC.value
    }
  })
  for (let key in cookiesObj) {
    cookiesUrlJoin.push(`${key}=${cookiesObj[key]}`)
  }
  const cookiesUrl = cookiesUrlJoin.join('; ')
  await page.close();
  await browser.close();
  
  console.log(cookiesUrl)
  const getJsonUrl = 'https://stock.xueqiu.com/v5/stock/screener/quote/list.json?page=2&size=90&order=desc&orderby=percent&order_by=percent&market=CN&type=sh_sz'
  const headers = {
    "content-type": "application/json",
    Cookie: cookiesUrl
  }
  request(getJsonUrl, {
    headers,
  }, function(err, response, body){
    //err 当前接口请求错误信息
    //response 一般使用statusCode来获取接口的http的执行状态
    //body 当前接口response返回的具体数据 返回的是一个jsonString类型的数据 
    if(!err && response.statusCode == 200){
      const list = JSON.parse(body).data.list
      onWriteDir(JSON.stringify(list, '', "\t"))
    }
  })
}
// 生成文件目录
const onWriteDir = (jsonString) => {
  const { dirName, fileName } = getDirAndFileName()
  // 获取目录下所有文件夹名称
  const allDirName = readdirSync(path);
  if (!allDirName.includes(dirName)) {
    mkdirSync(`${path}/${dirName}`);
  } 
  writeFileSync(`${path}/${dirName}/${fileName}.json`, jsonString, function (err) { 
    if (err) throw err; 
    success()
  })
}

// 获取当前日期
const getDirAndFileName = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  return {
    dirName: `${year}-${month}`,
    fileName: `${year}-${month}-${date}`
  }
}


// getAllDirName()
getXueQiuJson()