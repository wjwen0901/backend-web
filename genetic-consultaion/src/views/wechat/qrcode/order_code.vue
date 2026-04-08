<template>
  <el-container class="pay-info">
    <div class="mdh-default">
      <div class="content">
        <div class="header">
          <div class="c-logo">确认信息</div>
          <div class="c-header">
            <p><span>送检医院：</span>{{hospitalName}}</p>
            <p><span>送检项目：</span>{{solutionName}}</p>
          </div>
        </div>
        <el-main>
          <h4>填写受检者信息</h4>
          <el-form :rules="rules" :model="patient" ref="patient" label-width="100px" label-position="left"  size="mini">
            <el-form-item label="采样盒编号">
              <el-input v-model="patient.sampleCode"
                        placeholder="请输入采样盒/采集管编号">
              </el-input>
            </el-form-item>
            <el-form-item prop="name" label="受检者姓名">
              <el-input v-model="patient.name"
                        placeholder="请输入受检者姓名">
              </el-input>
            </el-form-item>
            <el-form-item label="知情上传时间">
              <el-date-picker
                v-model="patient.createTime"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio v-model="patient.sex" label="男">男</el-radio>
              <el-radio v-model="patient.sex" label="女">女</el-radio>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input v-model="patient.age" type="number" max="999"
                        placeholder="请输入受检者年龄">
              </el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="patient.cellphone"
                        placeholder="请输入受检者手机号">
              </el-input>
            </el-form-item>
            <el-form-item label="确认手机号">
              <el-input v-model="patient.code"
                        placeholder="再次输入受检者手机号">
              </el-input>
            </el-form-item>
            <el-form-item label="联系地址">
              <el-cascader class="width-100-p"
                           :options="regionData"
                           v-model="areaInfo"
                           @change="addressHandleChange">
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="patient.address"></el-input>
            </el-form-item>
          </el-form>
          <el-button class="submit-btn" @click="toPay()">确认无误，提交订单</el-button>
        </el-main>
      </div>
      <!--      <div class="footer-info">-->
      <!--        &copy; 2019 MDHcare.cn 版权所有  丨  ICP证：京ICP备17067248号-->
      <!--      </div>-->
    </div>
  </el-container>
</template>

<script>
  import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
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
        hospitalId: this.$route.query.hospitalId,
        hospitalName: this.$route.query.hospitalName,
        solutionId: this.$route.query.solutionId,
        solutionName: this.$route.query.solutionName,
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
        barcode: {},
        regionData: regionData,
        CodeToText: CodeToText,
        TextToCode: TextToCode
      }
    },
    methods: {
      initData () {
      },
      toPay () {
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'post',
          url: 'informed/channel',
          params: {
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          },
          data: {
            userId: parseInt(this.$route.query.userId),
            truename: this.patient.name,
            cellphone: this.patient.cellphone,
            codeId: this.$route.query.codeId,
            sampleCode: this.patient.sampleCode,
            solutionId: parseInt(this.solutionId),
            hospitalId: parseInt(this.hospitalId),
            sex: this.patient.sex,
            province: this.patient.province,
            city: this.patient.city,
            county: this.patient.city,
            address: this.patient.address,
            createTime: this.patient.createTime
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (res) {
          _this.$message.info('提交成功')
          // _this.$router.go(0)
        }).catch(function (err) {
          console.log(err)
          this.$message.error('网络异常请重新提交')
        })
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
      },
      addressHandleChange (value) {
        this.patient.province = this.CodeToText[value[0]]
        this.patient.city = this.CodeToText[value[1]]
        this.patient.county = this.CodeToText[value[2]]
      }
    },
    computed: {
      areaInfo: {
        get: function () {
          if (this.patient.county === undefined || this.patient.county === '' || this.patient.county === null) {
            return []
          }
          let city = this.patient.city
          if (this.patient.city.indexOf('天津') > -1 || this.patient.city.indexOf('北京') > -1 || this.patient.city.indexOf('上海') > -1) {
            city = '市辖区'
          }
          return [this.TextToCode[this.patient.province].code, this.TextToCode[this.patient.province][city].code, this.TextToCode[this.patient.province][city][this.patient.county].code]
        },
        set: function () {
        }
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
