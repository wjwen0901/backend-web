<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/firm' }">厂商管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="company-container">
          <el-form ref="companyForm" :model="company" label-width="80px" size="mini" class="edit-form">
            <el-form-item label="公司名称">
              <el-input v-model="company.name" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="机构代码">
              <el-input v-model="company.code" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="注册地址">
              <el-input v-model="company.address" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="开户银行">
              <el-input v-model="company.bank" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="银行账号">
              <el-input v-model="company.bankAccount" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="edit">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'EditInformed',
  data () {
    return {
      menuInfo: this.$route.params.id === undefined ? '新增' : '编辑',
      company: {},
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode
    }
  },
  props: {},
  methods: {
    _initData () {
      if (this.$route.params.id !== undefined) {
        this.axios.get('company/' + this.$route.params.id, {
          params: {
            userId: window.localStorage.userId
          }
        }).then(res => {
          this.company = res.data
        }).catch(err => {
          console.log(err)
        })
      }
    },
    edit () {
      if (this.$route.params.id === undefined) {
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        this.company.type = 0
        instance({
          method: 'post',
          url: 'company',
          data: this.company,
          params: {
            userId: window.localStorage.userId
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function () {
          _this.$message({
            message: '新增成功',
            type: 'success'
          })
          _this.$router.push('/firm')
        }).catch(function () {
          _this.$message({
            message: '新增失败',
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
          url: 'company/' + this.$route.params.id,
          data: this.company,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function () {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this.$router.push('/firm')
        }).catch(function () {
          _this.$message({
            message: '修改失败',
            type: 'error'
          })
        })
      }
    },
    cancel () {
      this.$router.push('/firm')
    },
    addressHandleChange (value) {
      this.company.province = this.CodeToText[value[0]]
      this.company.city = this.CodeToText[value[1]]
      this.company.county = this.CodeToText[value[2]]
    }
  },
  filters: {},
  computed: {},
  created () {
    let loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this._initData()
    loading.close()
  },
  mounted () {},
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .company-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .el-input {
      width: 100%;
    }
  }
  .company-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .edit-form {
    max-width: 500px;
  }
  .width-100-p {
    width: 100%
  }
  .img-content {
    margin: 20px 0px 20px 20px;
    height: 700px;
    background: #ffffff;
    overflow: auto;
    img {
      width: 100%;
    }
  }
</style>
