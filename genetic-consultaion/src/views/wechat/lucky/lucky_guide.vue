<template>
  <el-container class="report-download">
    <div class="mdh-default" :class="signLuckyGuideSuccess ? 'hidden' : ''">
      <div class="header">

      </div>
      <div class="content">
        <img src="../../../assets/gensultation-logo-1.png"/>
        <p>签到获取29篇妇产科相关指南</p>
        <el-main>
          <el-form :model="user" ref="patientForm" :rules="rules" label-width="0px" label-position="left">
            <el-form-item prop="fullName">
              <el-input class="width-100-p"
                        v-model="user.fullName"
                        placeholder="请输入姓名">
              </el-input>
            </el-form-item>
            <el-form-item prop="cellphone">
              <el-input class="width-100-p"
                        v-model="user.cellphone"
                        placeholder="请输入手机号">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="submit-btn" @click="toSign">点击签到</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </div>
      <div class="footer-info">
        &copy; 2019 MDHcare.cn 版权所有  丨  ICP证：京ICP备17067248号
      </div>
    </div>
    <div class="mdh-default lucky" :class="!signLuckyGuideSuccess ? 'hidden' : ''">
      <div class="header">

      </div>
      <div class="content">
        <img src="../../../assets/gensultation-logo-1.png"/>
        <el-main>
          <h4>29篇会议相关指南(点击查看/下载)：</h4>
          <ul class="guide-list">
            <li>
              <h5>宫腔镜手术相关-1篇</h5>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190307/e22cce47411c679dd1a417b36f37d32a.pdf')">宫腔镜手术并发症的预防：临床实践指南（法国） </el-link>
            </li>
            <li>
              <h5>绝经激素治疗-1篇</h5>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190227/a925a259c0db2f2e3a255ac8535b81a4.pdf')">中国绝经管理与绝经激素治疗指南（2018） </el-link>
            </li>
            <li>
              <h5>卵巢癌-3篇</h5>
              <el-link type="primary" @click="toGuideDetail('database-guide/20190905/1/354366813468880896.pdf')">《2019NCCN卵巢癌包括输卵管癌及原发性腹膜癌临床实践指南（第1版）》解读 </el-link>
              <el-link type="primary" @click="toGuideDetail('database-guide/20190905/1/354367964511727616.pdf')">2018 ESMO/ESGO共识会议建议：卵巢癌的病理和分子生物学、早期以及晚期疾病，边缘性肿瘤和复发性疾病 </el-link>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190227/0c0082ac61d650caff478d8706bce91e.pdf')">PARP抑制剂治疗复发性卵巢癌专家共识</el-link>
            </li>
            <li>
              <h5>盆腔炎-1篇</h5>
              <el-link type="primary" @click="toGuideDetail('database-guide/20190905/1/354368837086343168.pdf')">康妇消炎栓治疗盆腔炎症性疾病临床应用专家共识 </el-link>
            </li>
            <li>
              <h5>剖宫产术后子宫瘢痕-2篇</h5>
              <el-link type="primary" @click="toGuideDetail('database-guide/20190905/1/354369575468396544.pdf')">剖宫产术后瘢痕子宫孕妇中期妊娠引产的专家共识 </el-link>
              <el-link type="primary" @click="toGuideDetail('database-guide/20190905/1/354370370746183680.pdf')">剖宫产术后子宫瘢痕憩室诊治专家共识（2018） </el-link>
            </li>
            <li>
              <h5>妊娠滋养细胞疾病-1篇</h5>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190227/11913de38349dca8ab3ff645862fb773.pdf')">妊娠滋养细胞疾病诊断与治疗指南（第四版）</el-link>
            </li>
            <li>
              <h5>神经内分泌瘤-2篇</h5>
              <el-link type="primary" @click="toGuideDetail('database-guide/20190905/1/354371334177812480.pdf')">NCCN临床实践指南：神经内分泌肿瘤和肾上腺瘤（2019.V1） </el-link>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190227/1c2d468037600ba2f788b951afd86271.pdf')">胃肠胰神经内分泌肿瘤多学科综合治疗协作组诊疗模式专家共识 </el-link>

            </li>
            <li>
              <h5>胎盘植入-2篇</h5>
              <el-link type="primary" @click="toGuideDetail('database-guide/20190905/1/354372355876712448.pdf')">2019 SOGC临床实践指南：胎盘植入的筛查，诊断和管理（No.383） </el-link>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190228/648eaf8b3a68ad7f146a0b4d9ac71b27.pdf')">胎盘植入诊治指南（2015） </el-link>
            </li>
            <li>
              <h5>羊水栓塞-1篇</h5>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190227/0203c83b84529cd5d00d6a040b3a7bba.pdf')">羊水栓塞临床诊断与处理专家共识（2018） </el-link>

            </li>
            <li>
              <h5>阴道炎症的诊治规范-1篇</h5>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190301/d21472fe6b15780a49113b69fe4943a4.pdf')">《2015年美国疾病控制和预防中心关于阴道炎症的诊治规范》解读 </el-link>

            </li>
            <li>
              <h5>子宫颈癌防控与诊疗-4篇</h5>
              <el-link type="primary" @click="toGuideDetail('database-guide/20190905/1/354377954949591040.pdf')">2019“NCCN子宫颈癌临床实践指南（第3版）”解读</el-link>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190227/f1ca8727ae269d0894c424e925db0607.pdf')">妊娠合并子宫颈癌管理的专家共识 </el-link>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190227/e7319fcb4d3ddd9d6d55742184f1d3bf.pdf')">中国子宫颈癌综合防控指南 </el-link>
              <el-link type="primary" @click="toGuideDetail('database-guide/20190905/1/354374473924734976.pdf')">子宫颈癌等人乳头瘤病毒相关疾病免疫预防专家共识 </el-link>

            </li>
            <li>
              <h5>子宫内膜癌-1篇</h5>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190307/d31580c0ed7707d300406a8a9698c9f8.pdf')">2015年ACOG临床实践指南-子宫内膜癌</el-link>

            </li>
            <li>
              <h5>子宫内膜异位症-2篇</h5>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190227/52b459cf689c07fdef3543b74248b456.pdf')">2017 ESGE/ESHRE/WES建议：手术治疗子宫内膜异位症 </el-link>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190227/1de679096890c1bfcd801e75d6a88e66.pdf')">2018 KSE指南：子宫内膜异位症的临床评估和管理 </el-link>

            </li>
            <li>
              <h5>子痫前期-3篇</h5>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190301/378ad4b45c7f7e38e1c04081c9d4dc0b.pdf')">《妊娠期高血压疾病：国际妊娠期高血压研究学会分类、诊断和管理指南（2018）》解读</el-link>
              <el-link type="primary" @click="toGuideDetail('database-guide/20190905/1/354377337564819456.pdf')">美国妇产科医师学会（ACOG）“妊娠期高血压和子痫前期指南2019版”要点解读（第一部分）</el-link>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190304/bef66f55bbf613d20a75f337f78920a3.pdf')">妊娠期高血压疾病诊治指南（2015）解读</el-link>
            </li>
            <li>
              <h5>HPV感染相关专家共识-4篇</h5>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190228/6b4a5457054ad6aeadb188a846d123da.pdf')">2015 女性下生殖道人乳头瘤病毒感染诊治专家共识</el-link>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190301/9320ee61206d889fca4a9c350a4303cf.pdf')">2017年WHO HPV疫苗立场文件的解读</el-link>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190304/d035db64bb27ac9cc3c19eb63a73c95a.pdf')">专家解读：美国宫颈癌初筛之高危HPV 检测新认识· 观点篇</el-link>
              <el-link type="primary" @click="toGuideDetail('database/guide/20190227/3b8ec8f2e4a73fe26c530a1562f69aa6.pdf')">HPV感染疾病相关问题专家共识（2017）</el-link>
            </li>
          </ul>
          <br>
          <h4>指南解读或查看更多:</h4>
          <div class="download">

            <img src="../../../assets/miniprogram.png"/>
            <p>
              长按识别二维码,关注见山会诊
            </p>
          </div>
          <br>
          <br>
          <h4>打包下载:</h4>
          <div class="">
            <p>
              <a target="_blank" href="https://pan.baidu.com/s/1FRyct54UBR7lslrqdeDxfw">点击下载</a>
              &nbsp;&nbsp;&nbsp;&nbsp;提取码：anuw
            </p>
          </div>
        </el-main>
      </div>
    </div>
  </el-container>
</template>

<script>
  export default {
    name: 'signin',
    data () {
      const checkName = (rule, value, callback) => {
        if (!this.user.fullName || this.user.fullName.trim() === '') {
          callback(new Error('请输入您的姓名'))
        } else {
          callback()
        }
      }
      const checkCellphone = (rule, value, callback) => {
        if (!this.user.cellphone || this.user.cellphone.trim() === '') {
          callback(new Error('请输入手机号码'))
        } else if (!(/^1\d{10}$/.test(parseInt(this.user.cellphone)))) {
          callback(new Error('请输入11位数字'))
        } else {
          callback()
        }
      }
      return {
        IMG_URL: 'https://z.mdhcare.cn/miniprogram/v2/images',
        user: {
          fullName: '',
          cellphone: ''
        },
        rules: {
          fullName: [
            {required: true, validator: checkName, trigger: 'blur'}
          ],
          cellphone: [
            {required: true, validator: checkCellphone, trigger: 'blur'}
          ]
        },
        signLuckyGuideSuccess: window.localStorage.signLuckyGuideSuccess === undefined ? true : window.localStorage.signLuckyGuideSuccess
      }
    },
    mounted () {
    },
    methods: {
      toSign () {
        this.$refs.patientForm.validate((valid) => {
          console.log(valid)
          if (valid) {
            let instance = this.axios.create({
              headers: {
                'Authorization': window.localStorage.token,
                'Content-Type': 'application/json'
              }
            })
            let _this = this
            this.user.hospitalId = _this.$route.query.hospitalId
            this.user.deptId = _this.$route.query.deptId
            this.user.createTime = new Date()
            this.user.role = 2
            instance({
              method: 'post',
              url: 'mini/user/sign?type=wx&openId=' + _this.$route.query.openid,
              data: this.user,
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
              }
            }).then(function (response) {
              console.log(response)
              _this.signLuckyGuideSuccess = true
              window.localStorage.signLuckyGuideSuccess = _this.signLuckyGuideSuccess
            }).catch(function (err) {
              _this.signLuckyGuideSuccess = true
              window.localStorage.signLuckyGuideSuccess = _this.signLuckyGuideSuccess
            })
          }
        })
      },
      toGuideDetail (path) {
        let _this = this
        this.axios.get('oss/upload/show', {
          params: {
            objectKey: path
          }
        }).then(res1 => {
          console.log(res1)
          this.$router.push({
            path: '/wechat/lucky/down/',
            query: {
              path: res1.data,
              openid: _this.$route.query.openid,
              phone: _this.user.cellphone
            }
          })
        }).catch(err => {
          console.log(err)
        })

      },
    }
  }
</script>
<style scoped>
  .report-download >>> .el-message {
    width: 100px!important;
    min-width: 100px!important;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    background: #fff;
    min-height: 100%;
  }
  .el-header {
    margin-top: 20px;
    span-align: left;
    height: 40px !important;
  }
  .confirm-message {
    width: 50% !important;
  }
  .float-l {
    float: left;
  }
  .upload-content {
    position: relative;
    float: left;
  }
  .el-upload.el-upload--span {
    width: 100% !important;
  }
  .width-100-p {
    width: 100%;
  }
  .upload-btn {
    width: 150px;
  }
  .mdh-default {
    position: relative;
    width: 100%;
    padding: 60px 20px 20px 20px;
    span-align: center;
    z-index: 1;
    text-align: center;
    .title {
      margin: 0;
      font-size: 32px;
    }
    .c-logo {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 50%;
      margin: 10px 0px;
      transform: translate(-50%, 0%);
      font-size: 16px;
      letter-spacing: 2px;
      font-weight: 400;

    }
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background:  url("../../../assets/download-bg.jpg") repeat-y;
      background-size: cover;
      opacity: .2;
      content: "";
      z-index: -1;
    }
    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% - 100px);
      max-width: 600px;
      padding: 40px 20px;
      background: #fff;
      border-radius: 10px;
      border-shadow: 20px 5px 5px rgba(0, 0, 0, 1);
      p {
        margin: 0;
        padding: 0;
        font-size: 14px;
        line-height: 30px;
        color: #464444;
      }
      .qrcode {
        margin-top: 40px;
        p {
          margin-top: 20px;
          font-size: 14px;
        }
      }
    }
    img {
      width: 160px;
    }
    .el-main {
      background: none;
    }
    .send-code {
      padding: 12px 10px;
    }
    .submit-btn {
      width: 100%;
      background: #65c2c4;
      color: #fff;
    }
    .footer-info {
      position: absolute;
      width: calc(100% - 40px);
      bottom: 10px;
      span-align: center;
      font-size: 12px;
      color: #999999;
    }
  }

  .hidden {
    display: none;
  }

  /* miniprogram/pages/luckDraw/luckDraw.wxss */
  .lucky {
    padding: 20px;
    .content {
      position: relative;
      width: calc(100% - 40px);
      max-width: 600px;
      padding: 20px;
      background: #fff;
      border-radius: 10px;
      border-shadow: 20px 5px 5px rgba(0, 0, 0, 1);
      p {
        margin: 0;
        padding: 0;
        font-size: 14px;
        line-height: 30px;
        color: #464444;
      }
      .qrcode {
        margin-top: 40px;
        p {
          margin-top: 20px;
          font-size: 14px;
        }
      }
    }
    .el-main{
      text-align: left;
      word-break: break-all;
      p {
        font-size: 12px;
        line-height: 20px;
      }
      .tips {
        margin-top: 0;
        font-size: 12px;
        line-height: 20px;
      }
      h4 {
        margin: 10px 0 0 0;
      }
      h5 {
        margin: 20px 0px 0px 0px;
      }
    }
    .guide-list {
      padding-left: 0;
      font-size: 14px;
      .el-link {
        font-size: 12px;
        padding: 5px 0px;
      }
    }
    .download {
      margin-top: 10px;
      text-align: center;
      img {
        margin-top: 10px;
      }
    }
  }
</style>
