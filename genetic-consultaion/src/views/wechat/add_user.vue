<template>
  <div>
    <div class="mdh-mobile-form">
      <div class="title-info">
        您好，完善信息即可成为元鹊业务员
      </div>
      <h5>完善个人信息</h5>
      <div>
        <div class="mdh-input-row">
          <label>真实姓名</label>
          <input type="text" v-model="name" placeholder="请输入姓名">
          <span class="error-tip" v-if="nameError">姓名不可为空</span>
        </div>
        <div class="mdh-input-row cellphone-row">
          <label>手机号码</label>
          <input type="text" v-model="cellphone" placeholder="请输入手机号">
          <el-button type="success" size="mini" plain class="send-code" v-if="!hasCode" @click="getVerification">发送验证码</el-button>
          <el-button type="success" size="mini" plain class="send-code" disabled v-if="hasCode">重发验证码{{resetSendCode}}s</el-button>
          <span class="error-tip" v-if="cellphoneError">手机号不可为空</span>
          <span class="error-tip" v-if="cellphoneTypeError">手机号格式不正确</span>
        </div>
        <div class="mdh-input-row">
          <label>验证码</label>
          <input type="text" v-model="verificationCode" placeholder="请输入验证码">
          <span class="error-tip" v-if="verificationCodeError">验证码不可为空</span>
        </div>
      </div>
      <div class="btn-row">
        <el-button type="primary" @click="toAdd">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'new_user',
  data () {
    return {
      userId: this.$route.query.userId,
      name: this.$route.query.truename !== undefined ? this.$route.query.truename : '',
      cellphone: this.$route.query.cellphone !== undefined ? this.$route.query.cellphone : '',
      verificationCode: '',
      nameError: false,
      cellphoneError: false,
      cellphoneTypeError: false,
      verificationCodeError: false,
      createdByUserId: this.$route.query.createdBy,
      hasCode: false,
      resetSendCode: 60
    }
  },
  methods: {
    toAdd () {
      if (this.name.trim() === '') {
        this.nameError = true
        return false
      }
      if (this.cellphone.trim() === '') {
        this.cellphoneError = true
        return false
      }
      if (this.verificationCode.trim() === '') {
        this.verificationCodeError = true
        return false
      }
    },
    getVerification () {
      if (!this.cellphone.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)) {
        this.cellphoneTypeError = true
        return false
      }
      this.axios.get('verification', {
        params: {
          cellphone: this.cellphone
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
    addSalesman () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      this.userResource.roleCode = this.roleCode
      let _this = this
      instance({
        method: 'post',
        url: 'user',
        data: this.userResource,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        _this.$message({
          message: '新增成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .my-message {
    width: 80%;
    min-width: auto;
    background-color: rgba(0, 0, 0, .6);
    border-color: rgba(0, 0, 0, .6);
  }
  .mdh-mobile-form {
    margin: 0;
    width: 100%;
    padding: 0;
    .form-group-title {
      padding-left: 10px;
      font-size: 14px;
      color: #333333;
    }
  }
  .mdh-input-row{
    position: relative;
    width: 100%;
    background: #fff;
    height: 40px;
    padding: 0;
    label {
      position: absolute;
      left: 0;
      top: 0;
      width: 80px;
      padding-left: 16px;
      line-height: 40px;
      font-size: 14px;
    }
    input {
      height: 40px;
      width: calc(100% - 90px);
      padding: 0px 0px 0px 90px;
      border: 0;
      line-height: 40px;
      font-size: 14px;
      color: #333333;
    }
    &:after {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 1px;
      width: 100%;
      content: '';
      /*border-bottom: 1px solid #c8c7cc;*/
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #c8c7cc;
    }
  }
  .mdh-upload-row {
    position: relative;
    width: 100%;
    background: #fff;
    padding: 0;
    label {
      width: 80px;
      padding-left: 16px;
      line-height: 40px;
      font-size: 14px;
    }
    .upload-row {
      position: relative;
      padding: 0px 16px;
    }
  }
  .btn-row {
    padding: 20px 16px;
    .el-button {
      width: 100%;
      background-color: #1ABC9C;
      border-color: #1ABC9C;
    }
  }
  input::-webkit-input-placeholder{
    color:#c0c0c0;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#c0c0c0;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#c0c0c0;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color:#c0c0c0;
  }
  input:focus {
    outline:none;
    border: 0;
  }
  .error-tip {
    color: #F56C6C;
    position: absolute;
    right: 30px;
    top: 0;
    font-size: 10px;
    line-height: 40px;
  }

  .title-info {
    margin: 20px auto;
    width: 80%;
    padding: 10px 20px;
    font-size: 14px;
    text-align: center;
    border: 1px solid #1ABC9C;
    border-radius: 10px;
  }
  h5 {
    display: inline-block;
    margin: 10px 20px;
    padding: 6px 0px;
    font-size: 14px;
    line-height: 14px;
    color: #1ABC9C;
  }
  .order-no {
    padding: 10px 10px;
    font-size: 14px;
  }
  .cellphone-row {
    position: relative;
    input {
      padding-right: 90px;
    }
    .send-code {
      position: absolute;
      right: 10px;
      top: 6px;
    }
  }
</style>
