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
        "sample_code": "201910021299",
        "truename": "倪信雄",
        "create_time": "2019-10-02 10:36:19",
        "path": "report-test/20191009/1/366540803306156032.pdf",
        "sex": "男",
        "age": null,
        "reportDate": "2019-10-09 10:36:19"
    },
    {
        "sample_code": "201910021176",
        "truename": "文梁腾",
        "create_time": "2019-10-02 09:32:36",
        "path": "report-test/20191009/1/366540820225978368.pdf",
        "sex": "男",
        "age": null,
        "reportDate": "2019-10-09 09:32:36"
    },
    {
        "sample_code": "201910022025",
        "truename": "殴瑾",
        "create_time": "2019-10-02 10:00:19",
        "path": "report-test/20191009/1/366540838555086848.pdf",
        "sex": "女",
        "age": null,
        "reportDate": "2019-10-09 10:00:19"
    },
    {
        "sample_code": "201910021959",
        "truename": "通影卿",
        "create_time": "2019-10-02 10:06:08",
        "path": "report-test/20191009/1/366540851888779264.pdf",
        "sex": "女",
        "age": null,
        "reportDate": "2019-10-09 10:06:08"
    },
    {
        "sample_code": "201910028442",
        "truename": "鄢慧萍",
        "create_time": "2019-10-02 12:12:12",
        "path": "report-test/20191009/1/366570442074353664.pdf",
        "sex": "女",
        "age": null,
        "reportDate": "2019-10-09 12:12:12"
    },
    {
        "sample_code": "201910029442",
        "truename": "谷健群",
        "create_time": "2019-10-02 11:32:10",
        "path": "report-test/20191009/1/366570458302115840.pdf",
        "sex": "男",
        "age": null,
        "reportDate": "2019-10-09 11:32:10"
    }];
// const reportId = args[0];



//循环执行生成PDF文件
filesName.forEach((item, index) => {
    (async() => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        const pathName = "/Users/leamo/data/mdh/pdf/customizedreport/";
        await page.goto(BASE_URL + '#/ru6c?objectStr=5db1cc6f8478924f045ef3ff&name=' + item.truename
            + '&sex=' + item.sex + '&age=' + item.age
            + '&sampleCode=' + item.sample_code + '&informedDate=' + item.create_time+ '&reportDate=' + item.reportDate, {
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