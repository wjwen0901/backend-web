const puppeteer = require('puppeteer');
const axios = require('axios');
const OSS = require('ali-oss');
const path = require("path");
const fs = require("fs");
// const BASE_URL_API = "https://qa.mdhcare.cn/mdhcare-backend/";
// const BASE_URL = "https://qa.mdhcare.cn/";

const BASE_URL_API = "https://www.mdhcare.cn/mdhcare-backend/";
const BASE_URL = "https://z.mdhcare.cn/";

const args = process.argv.splice(2);
let names = args[1].substring(1, args[1].length - 1).split(',');
const filesName = names;
const reportId = args[0];



//循环执行生成PDF文件
filesName.forEach((item, index) => {
    (async() => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        const pathName = "/data/mdh/pdf/customizedreport/";
        await page.goto(BASE_URL + 'customized-pdf/#/child-drug?objectId=' + item, {
            waitUntil: 'networkidle0',
            timeout: 0
        });
        const fileName = item.indexOf('\"') > -1 ? item.replace( new RegExp('"',"g"), "") : item;
        await page.pdf({
            path: pathName + fileName + '.pdf',
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        let accessid = '';
        let host = '';
        let policyBase64 = '';
        let signature = '';
        let callbackbody = '';
        let key = '';
        let g_object_name = '';
        let g_object_name_type = '';
        let now = Date.parse(new Date()) / 1000;
        let uniqueKey = '';
        let fileList = [];
        let uploader = {};
        axios.get(BASE_URL_API + 'oss/upload/policy/report?userId=1').then(res => {
            let obj = res.data;
            host = obj.host;
            policyBase64 = obj.policy;
            accessid = obj.accessid;
            signature = obj.signature;
            expire = parseInt(obj.expire, 10);
            callbackbody = obj.callback;
            key = obj.dir;
            uniqueKey = obj.uniqueKey;



            var states = fs.statSync(path.join(pathName, fileName + '.pdf'))
            if (states.isFile()) {
                let client = new OSS({
                    region: 'oss-cn-beijing',
                    //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
                    accessKeyId: 'LTAI3MjDjTuHs7ou',
                    accessKeySecret: 'pJflKHXWtSLHliDPgtzCb9slZ3hjIT',
                    bucket: 'mdhcare'
                });

                console.log(client);
                let newName = key + uniqueKey + '.pdf';
                console.log(newName);
                console.log(path.join(pathName, fileName + '.pdf'));
                async function put() {
                    try {
                        // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
                        let r1 = await client.put(newName, path.join(pathName, fileName + '.pdf'));
                        console.log('put success: %j', r1);
                        // let r2 = await client.get(newName);
                        // console.log('get success: %j', r2);

                        //上传成功，保存记录
                        const params = {
                            fileName: path.join(item + '.pdf'),
                            size: states.size,
                            mimeType: 'application/pdf',
                            uniqueKey: uniqueKey,
                            filePath: newName,
                            objectKey: newName,
                            xlsReportId: parseInt(reportId)
                        }
                        console.log('--------------------------------------');
                        console.log(params);
                        axios({
                            url: BASE_URL_API + 'customize/childrenDrug',
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
});
