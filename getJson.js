const { readFileSync, writeFileSync, readdirSync, mkdirSync } = require('fs')
var request = require('request');
const path = "./"
// 获取数据源
const getXueQiuJson = () => {
  const getJsonUrl = 'https://stock.xueqiu.com/v5/stock/screener/quote/list.json?page=2&size=90&order=desc&orderby=percent&order_by=percent&market=CN&type=sh_sz'
  const headers = {
    "content-type": "application/json",
    Cookie: 'device_id=02a63e1623b278ea03ee553f73eff1de; snbim_minify=true; s=c213jh5zcs; Hm_lvt_1db88642e346389874251b5a1eded6e3=1680232331; xq_a_token=173d1b86b97861e4a0ecbe2d031fbd057d337248; xqat=173d1b86b97861e4a0ecbe2d031fbd057d337248; xq_r_token=ee8e80a187bf70af8a22704223d871770297dd64; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTY4Mzg1MTMyOSwiY3RtIjoxNjgyMzE2OTc5MDkxLCJjaWQiOiJkOWQwbjRBWnVwIn0.Zv4hU6jt48JSKR9u7e6uU3j86Zp7xhiKJILnUNmV4Oh7T2kMgd0G85V5OwAsKY3WPEmFU-AJLjNYuPde8feGjboLBv1-dD-7KBdl2O_9eCjD-v_-XQYDuU1xtRHK-SfhAr9UVZvj__bHubwvfH55_nXoFPyM9jMgQ-pwWrv0Q5wdcTGEWaJGetfiWO65Va0gcIpb1rv43XQsLNTc3nZN0E2rzw9v9YbNbjNJfFfa3JK8sUbAdvvZgaYOhBAYy78ASkHyKAqM5fGZ9w8XDdj1nfOBOByso4yNpoNIraTwEXLvZJfxbeQc1LYcKhk5eIKGWW0p75SchnXEd0hzGc7FwA; u=401682316995043; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1682390004'
  }
  request(getJsonUrl, {
    headers,
  }, function(err, response, body){
    //err 当前接口请求错误信息
    //response 一般使用statusCode来获取接口的http的执行状态
    //body 当前接口response返回的具体数据 返回的是一个jsonString类型的数据 
    //需要通过JSON.parse(body)来转换
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
    console.log('File is created successfully.'); 
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