<template>
  <el-container class="report-download">
    <div class="mdh-default" :class="signSuccess ? 'hidden' : ''">
      <div class="header">

      </div>
      <div class="content">
        <img src="../../../assets/gensultation-logo-1.png"/>
        <p>在线签到领奖</p>
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
    <div class="mdh-default" :class="!signSuccess ? 'hidden' : ''">
      <div class="header">

      </div>
      <div class="content">
        <img src="../../../assets/gensultation-logo-1.png"/>
        <p>签到成功！展示截图可领奖～</p>
        <div class="qrcode">
          <img src="../../../assets/miniprogram.png"/>
          <p>见山会诊小程序正在内测</p>
          <p>欢迎老师们给出指导建议～</p>
        </div>
      </div>
      <div class="footer-info">
        &copy; 2019 MDHcare.cn 版权所有  丨  ICP证：京ICP备17067248号
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
        signSuccess: false
      }
    },
    methods: {
      toSign () {
        console.log(this.$refs.patientForm)
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
              _this.signSuccess = true
            }).catch(function (err) {
              _this.signSuccess = true
            })
          }
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
        font-size: 18px;
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
      text-align: center;
      font-size: 12px;
      color: #999999;
    }
  }

  .hidden {
    display: none;
  }

</style>
