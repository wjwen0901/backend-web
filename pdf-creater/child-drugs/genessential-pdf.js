const puppeteer = require('puppeteer'); 
const axios  = require('axios'); 
var path = require("path");
var fs = require("fs"); 
const args = process.argv.splice(2);  
const filesName =JSON.parse(args[1]);

//循环执行生成PDF文件
filesName.forEach((item,index)=>{
  (async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto('https://qa.mdhcare.cn/mdhcare-backend/customizedreport/#/pdf_report/' + item,
      {
        waitUntil: 'networkidle0',
        timeout: 0
      });
    await page.pdf({
      path:'/data/mdh/customizedreport/'+item+'.pdf',
      format: 'A4',
      printBackground: true,
    });
  
    await browser.close();
  })();

//获取路径
var dirs = []; 
var pathName = "/data/mdh/customizedreport";
fs.readdir(pathName, function(err, files){
  (function iterator(i){
    if(i == files.length) {
      console.log(dirs);
      return ;
    }
    fs.stat(path.join(pathName, files[i]), function(err, data){     
      if(data.isFile()){               
          dirs.push(files[i]);
      }
      iterator(i+1);
     });   
  })(0);
}); 
//判断文件是否相同
dirs.forEach((n,m)=>{
  var name = n.slice(2)
  upload();
  if(item !== name){
    toUpload();
  }
})
});  

 
const userId= args[0];  
const accessid=''; 
const host= '';
const policyBase64= '';
const signature= '';
const callbackbody= ''; 
const key= ''; 
const g_object_name= '';
const g_object_name_type= '';
const now= Date.parse(new Date()) / 1000;
const uniqueKey= '';
const fileList= [];
const uploader= {};
 

function toUpload ()  { 
    setUploadParam(uploader, '', false)
}
function sendRequest() {
  const xmlhttp = new XMLHttpRequest();
  const param = userId > 0 ? "?userId=" + userId : ""; 
  const serverUrl ="https://qa.mdhcare.cn/mdhcare-backend/oss/upload/policy/report"+param; 
  xmlhttp.open("GET", serverUrl, false);
  xmlhttp.setRequestHeader("Authorization"); 
  xmlhttp.send();
  return xmlhttp.responseText;
}
 function getSignature () {
  const body = sendRequest();
  const obj = JSON.parse(body);
  host = obj.host;
  policyBase64 = obj.policy;
  accessid = obj.accessid;
  signature = obj.signature;
  expire = parseInt(obj.expire, 10);
  callbackbody = obj.callback;
  key = obj.dir;
  uniqueKey = obj.uniqueKey;
  return true;
}
function calculateObjectName(filename) {
  if (g_object_name_type === "local_name") {
    g_object_name += `${filename}`;
  } else if (g_object_name_type === "random_name") {
    const suffix = getSuffix(filename);
    g_object_name = key + randomString(10) + suffix;
  }
  return "";
}
 function getUploadedObjectName(filename) {
  if (g_object_name_type === "local_name") {
    let tmpName = g_object_name;
    tmpName = tmpName.replace(`${filename}`, filename);
    return tmpName;
  } else if (g_object_name_type === "random_name") {
    return g_object_name;
  }
  return "";
}
function randomString(len = 32) {
  const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  const maxPos = chars.length;
  let pwd = "";
  for (let i = 0; i < len; i += 1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};
function getSuffix(filename) {
  const pos = filename.lastIndexOf(".");
  let suffix = "";
  if (pos !== -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
};
function setUploadParam(up, filename, ret) {
  getSignature();
  g_object_name = key;
  if (filename !== "") {
    calculateObjectName(filename);
  }
  const newMultipartParams = {
    key:g_object_name + uniqueKey + "." + filename.split(".").pop(),
    policy: policyBase64,
    OSSAccessKeyId: accessid,
    // 让服务端返回200,不然，默认会返回204
    success_action_status: "200",
    signature: signature,
    callback: callbackbody,
    uniqueKey: uniqueKey
  };
  up.setOption({
    url: "https://" + host,
    multipart_params: newMultipartParams
  });
  up.start();
};
 function deleteUploadFile (id) {
  uploader.removeFile(id)
  for (let i = 0; i < fileList.length; i++) {
    if (id === fileList[i].id) {
      console.log(id === fileList[i].id)
      fileList.splice(i, 1)
    }
  }
};
function upload () {
  const that = this;
  const uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    browse_button: 'selectfiless',
    multi_selection: true,
    containers: 'containers',
    flash_swf_url: '/Moxie.swf',
    silverlight_xap_url: '/Moxie.xap',
    max_retries: 3,
    filters: {
      // mime_types: [{
      // title: '允许上传文件类型',
      // extensions: 'jpg,gif,png,bmp,pdf'
      // }],
      // 最大只能上传10GB的文件
      max_file_size: '10gb',
      // 不允许队列中存在重复文件
      prevent_duplicates: true
    },
    init: {
      // PostInit: () => {
      //   document.getElementById('postfiles').onclick = () => {
      //     that.setUploadParam(uploader, '', false)
      //     return false
      //   }
      // },
      FilesAdded: (up, files) => {
        that.fileList = up.files
        that.fileNum = up.files.length
      },
      BeforeUpload: (up, file) => {
        that.setUploadParam(up, file.name, true)
      },
      UploadProgress: (up, file) => {
      },
      FileUploaded: (up, file, info) => {
        const d = document.getElementById(file.id)
        if (info.status === 200) {
          d.setAttribute('class', 'el-upload-list__item is-success') 
          const params = { 
            fileName: file.name,
            size: file.size,
            mimeType: file.type,
            uniqueKey: up.settings.multipart_params.uniqueKey,
            filePath: up.settings.multipart_params.key,
            objectKey: up.settings.multipart_params.key
          }
          axios.post('https://qa.mdhcare.cn/mdhcare-backend/customize/childrenDrug', params).then(res => {
            console.log(res.data)
          })   
        } else {
          d.setAttribute('class', 'el-upload-list__item is-warning')
        }
      },
      UploadComplete: (up) => {
        up.refresh()
      },
      Error: (up, err) => {
        console.log('上传失败：', err, that.onError, up)
        if (err.code === -600) {
          $message({
            message: '文件大小超出限制，限制大小为5GB',
            type: 'error',
            customClass: 'my-message'
          })
        } else if (err.status === 403) {
          $message({
            message: '页面失效，请刷新页面后重新上传文件!',
            type: 'error',
            customClass: 'my-message'
          })
        } else {
          $message({
            message: '上传失败，请刷新页面后重新上传文件！',
            type: 'error',
            customClass: 'my-message'
          })
        }
        if (that.onError) {
          that.onError(err.message, up, err)
        }
      }
    }
  })
  uploader.init()
  uploader = uploader
}