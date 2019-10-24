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
console.log(args);
console.log(args[0]);

(async() => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const pathName = "/data/mdh/pdf/nuokang/";
    await page.goto(BASE_URL + 'customized-pdf/#/nuokang?objectStr=' + args[0], {
        waitUntil: 'networkidle0',
        timeout: 0
    });
    // console.log(pathName + args[0] + '.pdf')
    await page.pdf({
        path: pathName + args[0] + '.pdf',
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
            // console.log(res)
            let obj = res.data;
            host = obj.host;
            policyBase64 = obj.policy;
            accessid = obj.accessid;
            signature = obj.signature;
            expire = parseInt(obj.expire, 10);
            callbackbody = obj.callback;
            key = obj.dir;
            uniqueKey = obj.uniqueKey;



            var states = fs.statSync(path.join(pathName, args[0] + '.pdf'))
                // console.log(states)
            if (states.isFile()) {
                let client = new OSS({
                    region: 'oss-cn-beijing',
                    //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
                    accessKeyId: 'LTAI3MjDjTuHs7ou',
                    accessKeySecret: 'pJflKHXWtSLHliDPgtzCb9slZ3hjIT',
                    bucket: 'mdhcare',
                    timeout: 180000
                });

                // console.log(client);
                let newName = key + uniqueKey + '.pdf';
                // console.log(newName);
                // console.log(path.join(pathName, args[0] + '.pdf'));
                async function put() {
                    try {
                        // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
                        let r1 = await client.put(newName, path.join(pathName, args[0] + '.pdf'));
                        // console.log('put success: %j', r1);
                        // let r2 = await client.get(newName);
                        // console.log('get success: %j', r2);

                        //上传成功，保存记录
                        const params = {
                                fileName: path.join(args[0] + '.pdf'),
                                size: states.size,
                                mimeType: 'application/pdf',
                                uniqueKey: uniqueKey,
                                filePath: newName,
                                objectKey: newName,
                                userId: 1,
                                name: '易得好康超级管理员',
                                cellphone: '100000001'
                            }
                            // console.log('--------------------------------------');
                            // console.log(params);
                        axios({
                            url: BASE_URL_API + 'report/upload',
                            method: 'post',
                            params: params
                        }).then(res => {
                            console.log(res.data)
                        })
                    } catch (err) {
                        console.error('error: %j', err);
                    }
                }

                put();
            }

        })
        // console.log('http://localhost:3100/#/customize/genessential/' + args[1] == 'skin' ? 'pdf-nuokang' : 'sport-report' + '/' + args[0]);
        // console.log('/Users/leamoliu/mdhcare/data/mdh/pdf/genessential/' + args[0] + '.pdf');
        // console.log('end');
})();