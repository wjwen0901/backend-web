<template>
  <div class="register-container">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="2">
          <a href="#" class="logo">
            <span class="logo-lg"><b>易</b>得好康</span>
          </a>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="form-content">
        <h4 class="title">信息完善</h4>
        <el-form ref="form" :model="user" label-width="80px" :rules="rules">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="user.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="cellphone">
            <el-input placeholder="请输入手机号" v-model="user.cellphone" class="input4">
              <template slot="append">
                <!--获取验证码-->
                <el-button type="success" plain class="send-code" v-if="!hasCode" @click="getVerification">获取验证码</el-button>
                <el-button type="success" plain class="send-code" disabled v-if="hasCode">重发验证码{{resetSendCode}}s</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="user.code"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item label="公司名称">
            <el-autocomplete
              class="inline-input width-100-p"
              v-model="user.companyName"
              :fetch-suggestions="hospitalQuerySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="hospitalHandleSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="地址">
            <el-cascader class="width-100-p"
                         :options="regionData"
                         v-model="areaInfo"
                         @change="addressHandleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="user.address"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
function getCookie (name) { // 获取指定名称的cookie值
  let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
  if (arr != null) {
    console.log(arr)
    return unescape(arr[2])
  }
  return null
}
export default {
  name: 'register',
  data () {
    return {
      user: {},
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode,
      unionId: '',
      hasCode: false,
      resetSendCode: 60,
      rules: {
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        cellphone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: function (rule, value, callback) {
            if (/^1[34578]\d{9}$/.test(value) === false) {
              callback(new Error('请输入正确的手机号'))
            } else {
              callback()
            }
          },
          trigger: 'blur'}
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    addressHandleChange (value) {
      this.user.province = this.CodeToText[value[0]]
      this.user.city = this.CodeToText[value[1]]
      this.user.county = this.CodeToText[value[2]]
    },
    hospitalQuerySearch (queryString, cb) {
      console.log(queryString)

      this.axios.get('company', {
        params: {
          condition: queryString
        }
      }).then(res => {
        let result = []
        if (res.data.length === 0) {
          cb(result)
        } else {
          res.data.forEach(function (item) {
            result.push({
              'value': item.name,
              'id': item.id
            })
          })
          cb(result)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    hospitalHandleSelect (item) {
      this.user.companyId = item.id
    },
    getVerification () {
      if (!this.user.cellphone.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)) {
        this.cellphoneTypeError = true
        return false
      }
      this.axios.get('verification', {
        params: {
          cellphone: this.user.cellphone
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
    onSubmit () {
      if (this.user.id === undefined) {
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'post',
          url: 'user/wechat',
          params: this.user,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          _this.$message({
            message: '新增成功',
            type: 'success'
          })
          window.location.href = 'https://z.mdhcare.cn/login.html'
        }).catch(function () {
          _this.$message({
            message: '验证码错误',
            type: 'error'
          })
        })
      } else {
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'put',
          url: 'user/wechat/' + this.user.id,
          params: this.user,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function () {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          window.location.href = 'https://z.mdhcare.cn/login.html'
        }).catch(function () {
          _this.$message({
            message: '验证码错误',
            type: 'error'
          })
        })
      }
    }
  },
  computed: {
    areaInfo: {
      get: function () {
        if (this.user.county === undefined || this.user.county === '' || this.user.county === null) {
          return []
        }
        return [this.TextToCode[this.user.province].code, this.TextToCode[this.user.province][this.user.city].code, this.TextToCode[this.user.province][this.user.city][this.user.county].code]
      },
      set: function () {
      }
    }
  },
  created () {
    let cookie = JSON.parse(decodeURIComponent(getCookie('cookiepass')))
    console.log(cookie)
    this.user = cookie.user === undefined ? {} : cookie.user
    this.user.unionId = cookie.unionId
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .width-100-p {
    width: 100%;
  }
  .register-container {
    min-height: 100%;
    min-width: 1200px;
  }
  .el-header {
    background-color: #00c2a9;
    color: #fff;
    text-align: center;
    line-height: 60px;
    height: 60px !important;
    margin-top: 0 !important;
  }
  .el-header .logo {
    /*padding-left: 20px;*/
    color: #fff;
    text-decoration: none;
    font-size: 24px;
    float: left;
    width: 100px;
  }
  .el-dropdown {
    color: #fff;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
  .el-submenu .el-menu-item {
    min-width: 100px;
    padding-left: 50px !important;
  }
  i {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
  }
  .form-content {
    width: 600px;
    height: 100%;
    margin: 40px auto;
    background: #fff;
    padding: 20px 40px;
    .title {
      font-size: 20px;
      text-align: center;
    }
  }
  .send-code {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 0px 4px 4px 0px;
  }
</style>
