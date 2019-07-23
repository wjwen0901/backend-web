const puppeteer = require('puppeteer');
const axios  = require('axios');
const OSS = require('ali-oss');
const path = require("path");
const fs = require("fs");
const BASE_URL_API = "https://qa.mdhcare.cn/mdhcare-backend/";
const BASE_URL = "https://qa.mdhcare.cn/";

// const BASE_URL_API = "https://www.mdhcare.cn/mdhcare-backend/";
// const BASE_URL = "https://z.mdhcare.cn/";
console.log('------进入生成PDF方法-------');

const args = process.argv.splice(2);
console.log(args);

const report = JSON.parse(args[0]);
console.log("report");
console.log(report);
console.log(report.patient);
const name = report.patient.split('-')[1];
const sex = report.patient.split('-')[0];
const reportId = report.reportId;
const informedDate = report.informedDate;
const reportDate = report.reportDate;
const sampleCode = report.sampleCode;


//循环执行生成PDF文件
(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const pathName = "/data/mdh/pdf/customizedreport/";
  console.log('------开始生成PDF-------');
  await page.goto(BASE_URL + 'customized-pdf/#/hpv?name=' + name + '&sex=' + sex + '&informedDate='+ informedDate + '&sampleCode=' + sampleCode + '&reportDate=' + reportDate,
      {
        waitUntil: 'networkidle0',
        timeout: 0
      });
  await page.pdf({
    path: pathName+sampleCode+'.pdf',
    format: 'A4',
    printBackground: true,
  });

  await browser.close();

  let accessid='';
  let host= '';
  let policyBase64= '';
  let signature= '';
  let callbackbody= '';
  let key= '';
  let g_object_name= '';
  let g_object_name_type= '';
  let now= Date.parse(new Date()) / 1000;
  let uniqueKey= '';
  let fileList= [];
  let uploader= {};
  console.log('------完成PDF-------');
  axios.get(BASE_URL_API + 'oss/upload/policy/report-test?userId=1').then(res => {
    let obj = res.data;
    host = obj.host;
    policyBase64 = obj.policy;
    accessid = obj.accessid;
    signature = obj.signature;
    expire = parseInt(obj.expire, 10);
    callbackbody = obj.callback;
    key = obj.dir;
    uniqueKey = obj.uniqueKey;



    var states = fs.statSync(path.join(pathName, sampleCode+'.pdf'))
    if(states.isFile()) {
      let client = new OSS({
        region: 'oss-cn-beijing',
        //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
        accessKeyId: 'LTAI3MjDjTuHs7ou',
        accessKeySecret: 'pJflKHXWtSLHliDPgtzCb9slZ3hjIT',
        bucket: 'mdhcare'
      });

      console.log(client);
      let newName = key + uniqueKey +'.pdf';
      console.log(newName);
      console.log(path.join(pathName, sampleCode+'.pdf'));
      async function put() {
        try {
          // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
          let r1 = await client.put(newName, path.join(pathName, sampleCode+'.pdf'));
          console.log('put success: %j', r1);
          // let r2 = await client.get(newName);
          // console.log('get success: %j', r2);

          //上传成功，保存记录
          const params = {
            fileName: path.join(sampleCode+'.pdf'),
            size: states.size,
            mimeType: 'application/pdf',
            uniqueKey: uniqueKey,
            filePath: newName,
            objectKey: newName,
            reportId: parseInt(reportId)
          }
          console.log('-----------------开始上传---------------------');
          console.log(params);
          axios({
            url: BASE_URL_API + 'import/fileInfo',
            method: 'post',
            params: params
          }).then(res => {
            console.log(res.data)
          })
        } catch (e) {
          console.error('error: %j', err);
        }
      }

      put();
    }

  })
})();
