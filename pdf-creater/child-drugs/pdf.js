const puppeteer = require('puppeteer');
const axios = require('axios');
const OSS = require('ali-oss');
const path = require("path");
const fs = require("fs");
// const BASE_URL_API = "https://qa.mdhcare.cn/mdhcare-backend/";
// const BASE_URL = "https://qa.mdhcare.cn/";

const BASE_URL_API = "https://www.mdhcare.cn/mdhcare-wonder/";
const BASE_URL = "http://localhost:8080/";

// const args = process.argv.splice(2);
// let names = args[1].substring(1, args[1].length - 2).split(',');
const filesName = [
    {
        "sample_code": "201909233204",
        "truename": "甄竹枝",
        "create_time": "2019-09-23 16:07:17",
        "path": "report-test/20190930/1/363369632574205952.pdf",
        "reportDate": "2019-09-30 16:07:17"
    },
    {
        "sample_code": "201909237568",
        "truename": "利顺成",
        "create_time": "2019-09-23 16:27:11",
        "path": "report-test/20190930/1/363369667240128512.pdf",
        "reportDate": "2019-09-30 16:27:11"
    },
    {
        "sample_code": "201909232920",
        "truename": "人茜",
        "create_time": "2019-09-23 15:16:55",
        "path": "report-test/20190930/1/363369702795243520.pdf",
        "reportDate": "2019-09-30 15:16:55"
    },
    {
        "sample_code": "201909238194",
        "truename": "水琳",
        "create_time": "2019-09-23 15:30:08",
        "path": "report-test/20190930/1/363369735892496384.pdf",
        "reportDate": "2019-09-30 15:30:08"
    },
    {
        "sample_code": "201909233943",
        "truename": "寇丹静",
        "create_time": "2019-09-23 16:14:39",
        "path": "report-test/20190930/1/363369768817782784.pdf",
        "reportDate": "2019-09-30 16:14:39"
    }];
// const reportId = args[0];



//循环执行生成PDF文件
filesName.forEach((item, index) => {
    (async() => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        const pathName = "/Users/leamo/data/mdh/pdf/customizedreport/";
        await page.goto(BASE_URL + '#/child-drug?objectId=5d22e86d84789278bb5f5335&name=' + item.truename + '&code=' + item.sample_code + '&date=' + item.create_time+ '&reportDate=' + item.reportDate, {
            waitUntil: 'networkidle0',
            timeout: 0
        });
        await page.pdf({
            path: pathName + item.sample_code + '.pdf',
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



            var states = fs.statSync(path.join(pathName, item.sample_code + '.pdf'))
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
                console.log(path.join(pathName, item + '.pdf'));
                async function put() {
                    try {
                        // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
                        let r1 = await client.put(item.path, path.join(pathName, item.sample_code + '.pdf'));
                        console.log('put success: %j', r1);
                        // let r2 = await client.get(newName);
                        // console.log('get success: %j', r2);

                        // //上传成功，保存记录
                        // const params = {
                        //     fileName: path.join(item + '.pdf'),
                        //     size: states.size,
                        //     mimeType: 'application/pdf',
                        //     uniqueKey: uniqueKey,
                        //     filePath: newName,
                        //     objectKey: newName,
                        //     xlsReportId: parseInt(reportId)
                        // }
                        // console.log('--------------------------------------');
                        // console.log(params);
                        // axios({
                        //     url: BASE_URL_API + 'customize/childrenDrug',
                        //     method: 'post',
                        //     params: params
                        // }).then(res => {
                        //     console.log(res.data)
                        // })
                    } catch (e) {
                        console.error('error: %j', err);
                    }
                }

                put();
            }

        })

    })();
});