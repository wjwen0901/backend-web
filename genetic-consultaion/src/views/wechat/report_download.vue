<template>
  <el-container>
    <el-header>个人健康报告下载</el-header>
    <el-main>
      <el-form :rules="rules" :model="informedConsent" ref="informedConsent" label-width="110px" label-position="left" size="mini">
        <el-form-item label="您的姓名" prop="name">
          <el-input class="width-100-p" v-model="informedConsent.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="cellphone">
          <el-input class="width-100-p" v-model="informedConsent.cellphone"></el-input>
        </el-form-item>
        <el-form-item label="身份证后四位" prop="idCode">
          <el-input class="width-100-p" v-model="informedConsent.idCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="float-l" type="primary" @click="toViewReport">查看报告</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'report-download',
  data () {
    var checkName = (rule, value, callback) => {
      if (!this.informedConsent.name) {
        return callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    }
    var checkCellphone = (rule, value, callback) => {
      if (!this.informedConsent.cellphone) {
        callback(new Error('请输入手机号码'))
      } else if (!(/^1\d{10}$/.test(parseInt(this.informedConsent.cellphone)))) {
        callback(new Error('请输入11位数字'))
      } else {
        callback()
      }
    }
    var checkIdcode = (rule, value, callback) => {
      if (!this.informedConsent.idCode) {
        callback(new Error('请输入身份证后四位'))
      } else if (!(/^\d{4}$/.test(parseInt(this.informedConsent.idCode)))) {
        callback(new Error('请输入4位数字'))
      } else {
        callback()
      }
    }
    return {
      informedConsent: {
        name: window.localStorage.fullName === undefined ? '' : window.localStorage.fullName,
        cellphone: window.localStorage.cellphone === undefined ? '' : window.localStorage.cellphone,
        idCode: window.localStorage.idCode === undefined ? '' : window.localStorage.idCode
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
      totalPage: 0
    }
  },
  methods: {
    toViewReport () {
      this.axios.get('report/patient', {
        params: this.informedConsent
      }).then(res => {
        this.$router.push({path: '/report/view/', query: {path: res.data}})
      }).catch(err => {
        console.log(err)
        if (err.status === 'userError') {
          this.$alert('暂未查询到您的检测信息，请检查是否输入正确', '温馨提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${action}`
              })
            }
          })
        }
        if (err.status === 'reportError') {
          this.$alert('您的检测正在实验中，报告生成我们会推送到您的微信，请耐心等待', '温馨提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${action}`,
                customClass: 'confirm-message'
              })
            }
          })
        }
        console.log(err)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    background: #fff;
  }
  .el-main {
    background: #f2f2f2;
  }
  .el-header {
    margin-top: 20px;
    text-align: left;
    height: 40px !important;
  }
  .confirm-message {
    width: 70% !important;
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
</style>
