<template>
  <el-container class="report-download">
    <div v-if="CustomizedKey === '11d67f337e411b48e6d8cd0d0ad67a35'" class="nick">
      <div>
        <h4 class="c-logo">奥格妮克健康管理中心</h4>
        <div class="c-header">
          <p>个人健康报告</p>
        </div>
        <el-form :rules="rules" :model="patient" ref="patient" label-width="0px" label-position="left">
          <el-form-item prop="name">
            <input type="text" class="nick-input" v-model="patient.name" placeholder="请输入姓名"/>
          </el-form-item>
          <el-form-item prop="cellphone">
            <input type="text" class="nick-input" v-model="patient.cellphone" placeholder="请输入手机号"/>
          </el-form-item>
          <el-form-item prop="idCode">
            <input type="text" class="nick-input" v-model="patient.code" placeholder="请输入验证码"/>
            <el-button class="send-code" v-if="!hasCode" @click="getVerification">获取验证码</el-button>
            <el-button class="send-code" v-else>重发验证码{{resetSendCode}}s</el-button>
          </el-form-item>
          <!--<el-form-item prop="idCode">-->
            <!--<input type="text" class="nick-input" v-model="patient.idCode" placeholder="请输入身份证后4位"/>-->
            <!--&lt;!&ndash;<el-input class="nick-input" v-model="patient.idCode" placeholder="请输入身份证后四位"></el-input>&ndash;&gt;-->
          <!--</el-form-item>-->
          <el-form-item class="nick-button">
            <el-button @click="toViewReport">查看报告</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="mdh-default" v-else-if="CustomizedKey === 'd9edd1f365c990ad260d80015136f25e'">
      <div class="header">

      </div>
      <div class="content">
        <h4 class="title">禄和健康</h4>
        <p>个人健康报告下载</p>
        <el-main>
          <el-form :rules="rules" :model="patient" ref="patient" label-width="0px" label-position="left">
            <el-form-item prop="name">
              <el-input class="width-100-p"
                        v-model="patient.name"
                        placeholder="请输入姓名">
              </el-input>
            </el-form-item>
            <el-form-item prop="cellphone">
              <el-input class="width-100-p"
                        v-model="patient.cellphone"
                        placeholder="请输入手机号">
              </el-input>
            </el-form-item>
            <el-form-item prop="idCode">
              <el-input class="width-100-p"
                        v-model="patient.code"
                        placeholder="请输入验证码">
                <!--获取验证码-->
                <el-button slot="append" class="send-code" v-if="!hasCode" @click="getVerification">获取验证码</el-button>
                <el-button slot="append" class="send-code" v-else>重发验证码{{resetSendCode}}s</el-button>
                <!--<template slot="append">-->
                <!--&lt;!&ndash;获取验证码&ndash;&gt;-->
                <!--<el-button class="send-code" v-if="!hasCode" @click="getVerification">获取验证码</el-button>-->
                <!--<el-button class="send-code" disabled v-if="hasCode">重发验证码{{resetSendCode}}s</el-button>-->
                <!--</template>-->
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="submit-btn" @click="toViewReport">查看报告</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </div>
      <div class="footer-info">
        &copy; 2019 lh-health.com 版权所有
      </div>
    </div>
    <div class="mdh-default luhe" v-else-if="CustomizedKey === '0415144e2cf30ef54365aa82bdaea535'">
      <div class="header">

      </div>
      <div class="content">
        <h4 class="c-logo">北京市通州区潞河医院</h4>
        <h4 class="c-phone">联系方式：010-53359495</h4>
        <p>药物性耳聋基因筛查</p>
        <p class="sub-title">报告查询</p>
        <el-main>
          <el-form :rules="rules" :model="patient" ref="patient" label-width="0px" label-position="left">
            <el-form-item prop="name">
              <el-input class="width-100-p"
                        v-model="patient.name"
                        placeholder="请输入姓名">
              </el-input>
            </el-form-item>
            <el-form-item prop="cellphone">
              <el-input class="width-100-p"
                        v-model="patient.cellphone"
                        placeholder="请输入手机号">
              </el-input>
            </el-form-item>
            <el-form-item prop="idCode">
              <el-input class="width-100-p"
                        v-model="patient.code"
                        placeholder="请输入验证码">
                <!--获取验证码-->
                <el-button slot="append" class="send-code" v-if="!hasCode" @click="getVerification">获取验证码</el-button>
                <el-button slot="append" class="send-code" v-else>重发验证码{{resetSendCode}}s</el-button>
                <!--<template slot="append">-->
                <!--&lt;!&ndash;获取验证码&ndash;&gt;-->
                <!--<el-button class="send-code" v-if="!hasCode" @click="getVerification">获取验证码</el-button>-->
                <!--<el-button class="send-code" disabled v-if="hasCode">重发验证码{{resetSendCode}}s</el-button>-->
                <!--</template>-->
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="submit-btn" @click="toViewReport">查看报告</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </div>
      <div class="footer-info">
        &copy; 2019 MDHcare.cn 版权所有  丨  ICP证：京ICP备17067248号
      </div>
    </div>
    <div class="mdh-default" v-else>
      <div class="header">

      </div>
      <div class="content">
        <img src="../../assets/genssential/logo.png" v-if="CustomizedKey === 'ccee2e12c11657274ce6756275466f05'"/>
        <img src="../../assets/ru6c-logo.png" v-else/>
        <p>个人健康报告下载</p>
        <el-main>
          <el-form :rules="rules" :model="patient" ref="patient" label-width="0px" label-position="left">
            <el-form-item prop="name">
              <el-input class="width-100-p"
                        v-model="patient.name"
                        placeholder="请输入姓名">
              </el-input>
            </el-form-item>
            <el-form-item prop="cellphone">
              <el-input class="width-100-p"
                        v-model="patient.cellphone"
                        placeholder="请输入手机号">
              </el-input>
            </el-form-item>
            <el-form-item prop="idCode">
              <el-input class="width-100-p"
                        v-model="patient.code"
                        placeholder="请输入验证码">
                <!--获取验证码-->
                <el-button slot="append" class="send-code" v-if="!hasCode" @click="getVerification">获取验证码</el-button>
                <el-button slot="append" class="send-code" v-else>重发验证码{{resetSendCode}}s</el-button>
                <!--<template slot="append">-->
                  <!--&lt;!&ndash;获取验证码&ndash;&gt;-->
                  <!--<el-button class="send-code" v-if="!hasCode" @click="getVerification">获取验证码</el-button>-->
                  <!--<el-button class="send-code" disabled v-if="hasCode">重发验证码{{resetSendCode}}s</el-button>-->
                <!--</template>-->
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="submit-btn" @click="toViewReport">查看报告</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </div>
      <div class="footer-info">
        &copy; 2019 MDHcare.cn 版权所有  丨  ICP证：京ICP备17067248号
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'report-download',
  data () {
    const checkName = (rule, value, callback) => {
      if (!this.patient.name) {
        return callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    }
    const checkCellphone = (rule, value, callback) => {
      if (!this.patient.cellphone) {
        callback(new Error('请输入手机号码'))
      } else if (!(/^1\d{10}$/.test(parseInt(this.patient.cellphone)))) {
        callback(new Error('请输入11位数字'))
      } else {
        callback()
      }
    }
    const checkIdcode = (rule, value, callback) => {
      if (!this.patient.code) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      patient: {
        name: window.localStorage.fullName === undefined ? '' : window.localStorage.fullName,
        cellphone: window.localStorage.cellphone === undefined ? '' : window.localStorage.cellphone
      },
      rules: {
        name: [
          {required: true, validator: checkName, trigger: 'blur'}
        ],
        cellphone: [
          {required: true, validator: checkCellphone, trigger: 'blur'}
        ],
        idCode: [
          {required: true, validator: checkIdcode, trigger: 'blur'}
        ]
      },
      showTable: false,
      reportList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      CustomizedKey: this.$route.query.k,
      hasCode: false,
      resetSendCode: 60
    }
  },
  methods: {
    toViewReport () {
      this.$refs.patient.validate((valid) => {
        if (valid) {
          this.patient.name = this.patient.name.trim()
          if (this.$route.query.k === '11d67f337e411b48e6d8cd0d0ad67a35') {
            this.axios.get('report/list', {
              params: this.patient
            }).then(res => {
              this.$router.push({path: '/report/personal', query: {name: this.patient.name, cellphone: this.patient.cellphone}})
            }).catch(err => {
              console.log(err)
              this.$message({
                type: 'error',
                message: '暂未查询到您的检测报告',
                center: true,
                duration: 30000,
                showClose: true
              })
            })
          } else {
            this.axios.get('report/patient', {
              params: this.patient
            }).then(res => {
              this.$router.push({path: '/report/view/', query: {path: res.data}})
            }).catch(err => {
              console.log(err)
              this.$message({
                type: 'error',
                message: err.message,
                center: true,
                duration: 30000,
                showClose: true
              })
            })
          }
        } else {
          console.log('信息不完整')
          return false
        }
      })
    },
    getVerification () {
      if (!this.patient.cellphone.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)) {
        this.cellphoneTypeError = true
        return false
      }
      let param = {
        cellphone: this.patient.cellphone
      }
      console.log(this.$route.query.k)
      if (this.$route.query.k === 'd9edd1f365c990ad260d80015136f25e') {
        param = {
          cellphone: this.patient.cellphone,
          companyId: 9
        }
      }
      this.axios.get('verification', {
        params: param
      }).then(res => {
        if (res.data === 'success') {
          this.hasCode = true
          this.resetSendCode = 60
          let timeStop = setInterval(() => {
            this.resetSendCode--
            if (this.resetSendCode > 0) {
              this.hasCode = true
            } else {
              this.hasCode = false
              clearInterval(timeStop)
            }
          }, 1000)
        }
      }).catch(err => {
        console.log(err)
      })
    }
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
    text-align: left;
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
  .el-upload.el-upload--text {
    width: 100% !important;
  }
  .width-100-p {
    width: 100%;
  }
  .upload-btn {
    width: 150px;
  }
  .nick {
    width: 100%;
    min-height: 100%;
    /*background-color: rgba(101, 194, 196, .1);*/
    padding: 30px 20px;
    text-align: center;
    color: rgb(101, 194, 196);
    font-weight: 400;
    .el-form-item {
      margin-bottom: 16px;
      .send-code {
        position: absolute;
        right: 10%;
        top: 0;
        padding: 12px;
        border: 1px solid rgb(101, 194, 196);
        border-radius: 0px 4px 4px 0px;
        background: rgb(101, 194, 196);
        color: #fff;
      }
    }
    .nick-input {
      width: 80%!important;
      -webkit-appearance: none;
      background: none;
      border-radius: 4px;
      border: 1px solid rgb(101, 194, 196);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #333333;
      display: inline-block;
      font-size: inherit;
      height: 40px;
      line-height: 40px;
      outline: 0;
      padding: 0 15px;
      -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      width: 100%;
    }
    input::placeholder {
      color: #ddd;
    }
    .c-header {
      margin: 60px auto 30px;
      width: 60%;
      padding: 6px 0px;
      font-size: 20px;
      font-weight: bold;
      display: block;
      /*border: 1px solid rgba(101, 194, 196, .8);*/
      border-radius: 6px;
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
    .nick-button .el-button{
      margin: 40px auto;
      width: 80%!important;
      background: rgb(101, 194, 196);
      color: #fff;
      /*border: 1px solid rgba(255, 255, 255, .8);*/
      width: 100%;
    }
  }
  .mdh-default {
    position: relative;
    width: 100%;
    padding: 60px 20px 20px 20px;
    text-align: center;
    z-index: 1;
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
      background:  url("../../assets/download-bg.jpg") repeat-y;
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
        font-size: 18px;
        color: #464444;
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
      text-align: center;
      font-size: 12px;
      color: #999999;
    }
  }
  .luhe {
    .content {
      padding: 40px 20px 60px 20px;
      .sub-title {
        font-size: 16px;
      }
    }
    .c-logo {
      position: absolute;
      width: 100%;
      bottom: 30px;
      left: 50%;
      margin: 10px 0px;
      transform: translate(-50%, 0%);
      font-size: 16px;
      font-weight: 400;
      color: #65c2c4;
    }
    .c-phone {
      position: absolute;
      width: 100%;
      bottom: 10px;
      left: 50%;
      margin: 10px 0px;
      transform: translate(-50%, 0%);
      font-size: 14px;
      font-weight: 400;
      color: #65c2c4;
    }
  }
</style>
