<template>
  <el-container>
    <div v-if="CustomizedKey === '11d67f337e411b48e6d8cd0d0ad67a35'" class="nick">
      <div>
        <h4 class="c-logo">奥格妮克</h4>
        <div class="c-header">个人检测报告</div>
        <el-form :rules="rules" :model="informedConsent" ref="informedConsent" label-width="0px" label-position="left">
          <el-form-item prop="name">
            <input type="text" class="nick-input" v-model="informedConsent.name" placeholder="请输入姓名"/>
            <!--<el-input class="nick-input" v-model="informedConsent.name" placeholder="请输入姓名"></el-input>-->
          </el-form-item>
          <el-form-item prop="cellphone">
            <input type="text" class="nick-input" v-model="informedConsent.cellphone" placeholder="请输入手机号"/>
            <!--<el-input class="nick-input" v-model="informedConsent.cellphone" placeholder="请输入手机号"></el-input>-->
          </el-form-item>
          <el-form-item prop="idCode">
            <input type="text" class="nick-input" v-model="informedConsent.idCode" placeholder="请输入身份证后4位"/>
            <!--<el-input class="nick-input" v-model="informedConsent.idCode" placeholder="请输入身份证后四位"></el-input>-->
          </el-form-item>
          <el-form-item class="nick-button">
            <el-button class="float-l" @click="toViewReport">查看报告</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-else>
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
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'report-download',
  data () {
    const checkName = (rule, value, callback) => {
      if (!this.informedConsent.name) {
        return callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    }
    const checkCellphone = (rule, value, callback) => {
      if (!this.informedConsent.cellphone) {
        callback(new Error('请输入手机号码'))
      } else if (!(/^1\d{10}$/.test(parseInt(this.informedConsent.cellphone)))) {
        callback(new Error('请输入11位数字'))
      } else {
        callback()
      }
    }
    const checkIdcode = (rule, value, callback) => {
      if (!this.informedConsent.idCode) {
        callback(new Error('请输入身份证后四位'))
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
      totalPage: 0,
      CustomizedKey: this.$route.query.k
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
        // if (err.status === 'userError') {
        this.$alert('暂未查询到您的检测信息，如有报告生成我们会推送到您的微信', '温馨提示', {
          confirmButtonText: '确定',
          callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${action}`
            // })
          }
        })
        // }
        // if (err.status === 'reportError') {
        //   this.$alert('您的检测正在实验中，报告生成我们会推送到您的微信，请耐心等待', '温馨提示', {
        //     confirmButtonText: '确定',
        //     callback: action => {
        //       this.$message({
        //         type: 'info',
        //         message: `action: ${action}`,
        //         customClass: 'confirm-message'
        //       })
        //     }
        //   })
        // }
        // console.log(err)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    background: #fff;
    min-height: 100%;
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
    background-color: rgb(101, 194, 196);
    padding: 10px 20px;
    text-align: center;
    color: #fff;
    font-weight: 400;
    .el-form-item {
      margin-bottom: 16px;
    }
    .nick-input {
      width: 100%;
      -webkit-appearance: none;
      background: none;
      border-radius: 4px;
      border: 1px solid #fff;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #606266;
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
      color: #fff;
    }
    .c-header {
      padding: 40px 10px 20px 10px;
      font-size: 18px;
    }
    .c-logo {
      position: absolute;
      bottom: 0;
      left: 50%;
      margin: 10px 0px;
      transform: translate(-50%, 0%);
      font-size: 16px;
      letter-spacing: 4px;
      font-weight: 400;

    }
    .nick-button .el-button{
      background: none;
      color: #fff;
      border: 1px solid #fff;
      width: 100%;
    }
  }

</style>
