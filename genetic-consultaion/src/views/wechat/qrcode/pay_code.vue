<template>
  <el-container class="pay-info">
    <div class="mdh-default">
      <div class="content">
        <div class="header">
          <div class="c-logo">见山会诊正在向你收款</div>
          <div class="money">
            ¥{{barcode.price}}
          </div>
          <div class="c-header">
            <p><span>送检医院：</span>{{barcode.hospitalName}}</p>
            <p><span>送检项目：</span>{{barcode.solutionName}}</p>
          </div>
        </div>
        <el-main>
          <h4>填写受检者信息</h4>
          <el-form :rules="rules" :model="patient" ref="patient" label-width="100px" label-position="left"  size="mini">
            <el-form-item prop="name" label="受检者姓名">
              <el-input v-model="patient.name"
                        placeholder="请输入受检者姓名">
              </el-input>
            </el-form-item>
            <el-form-item prop="cellphone" label="手机号">
              <el-input v-model="patient.cellphone"
                        placeholder="请输入受检者手机号">
              </el-input>
            </el-form-item>
            <el-form-item prop="cellphone" label="确认手机号">
              <el-input v-model="patient.code"
                        placeholder="再次输入受检者手机号">
              </el-input>
            </el-form-item>
<!--            <el-form-item>-->
<!--              <el-button class="submit-btn" @click="toPay">去支付</el-button>-->
<!--            </el-form-item>-->
          </el-form>
          <el-button class="submit-btn" @click="toPay()">确认信息，去支付</el-button>
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
  name: 'pay-info',
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
        callback(new Error('请确认手机号'))
      } else if (this.patient.code !== this.patient.cellphone) {
        callback(new Error('两次输入不一致'))
      } else {
        callback()
      }
    }
    return {
      patient: {},
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
      hasCode: false,
      resetSendCode: 60,
      loading: true,
      cellphoneTypeError: false,
      barcode: {}
    }
  },
  methods: {
    initData () {
      // window.location = this.$route.query.url
      this.axios.get('barcode/' + this.$route.params.id, {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.barcode = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    toPay () {
      window.location = this.$route.query.url
    },
    getVerification () {
      if (!this.patient.cellphone.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)) {
        this.cellphoneTypeError = true
        return false
      }
      this.axios.get('verification', {
        params: {
          cellphone: this.patient.cellphone,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
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
  },
  created () {
    this.loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.initData()
    this.loading.close()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .pay-info.el-container {
    background: #f8f8f8;
    min-height: 100%;
  }
  .header {
    background: #fff;
    padding: 40px 0px 20px 0px;
    .c-header {
      text-align: left;
      padding: 10px 20px;
      span {
        color: #c0c0c0;
      }
    }
    .money {
      padding: 20px 20px;
      text-align: center;
      font-size: 26px!important;
      font-weight: bold;
    }
    .c-logo {
      font-size: 18px!important;
    }
  }
  .mdh-default {
    position: relative;
    width: 100%;
    text-align: center;
    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      max-width: 600px;
      p {
        margin: 0;
        padding: 0;
        font-size: 14px;
        color: #464444;
      }
    }
    img {
      margin-top: 40px;
      width: 100px;
    }
    .el-main {
      margin-top: 10px;
      background: #fff;
      text-align: left;
      padding: 20px 20px;
      .cashier-reason {
        padding: 15px 0;
        font-size: 14px;
        line-height: 20px;
      }
      .cashier-reason span {
        color: #999;
      }
    }
    .send-code {
      padding: 12px 10px;
    }
    .btns {
      .left-content {
        width: 50%;
        float: left;
      }
      .right-content {
        width: 50%;
        float: left;
      }
      .el-button {
        display: block;
        margin-left: 10px;
      }
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
  .submit-btn {
    width: 100%;
    background: #65c2c4;
    color: #fff;
  }
  .footer-info {
    position: absolute;
    width: 100%;
    bottom: 10px;
    text-align: center;
    font-size: 12px;
    color: #999999;
  }

</style>
