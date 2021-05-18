<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>报告管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/report/list' }" v-if="role === 'firm-service' || role === 'manager' || role === 'jk-service'">报告</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/report/info/list' }" v-if="role === 'channel'">报告</el-breadcrumb-item>
          <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10" v-if="role === 'manager' || role === 'jk-service'">
        <div class="user-container">
          <el-form ref="reportForm" :model="report" label-width="100px" size="mini" class="edit-form">
            <el-form-item label="样本编号">
              <el-input v-model="report.sampleCode"></el-input>
            </el-form-item>
            <el-form-item label="送检项目">
              <el-select class="width-100-p" v-model="report.solutionId" filterable placeholder="请选择">
                <el-option
                  v-for="item in projects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="送检医院">
              <el-autocomplete
                class="inline-input width-100-p"
                v-model="report.hospitalName"
                :fetch-suggestions="hospitalQuerySearch"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="hospitalHandleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="送检科室">
              <el-select class="width-100-p" v-model="report.deptId" filterable placeholder="请选择">
                <el-option
                  v-for="item in depts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="送检医生">
              <el-input v-model="report.doctor"></el-input>
            </el-form-item>
            <el-form-item label="受检者电话">
              <el-input v-model="report.cellphone"></el-input>
            </el-form-item>
            <el-form-item label="受检者姓名">
              <el-input v-model="report.truename"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="cancel">取消</el-button>
              <el-button @click="unread">文件不可读</el-button>
              <el-button type="primary" @click="edit">保存信息</el-button>
              <el-button type="primary" @click="toCustomizeReport">下载定制报告</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="img-content">
          <object :data="imagePath" type="application/pdf" width="100%" height="700px" v-if="report.mimeType === 'application/pdf'" id="pdfDocument">
            <embed :src="imagePath">
          </object>
          <img :src="imagePath" v-else>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'EditInformed',
  data () {
    return {
      role: window.localStorage.role,
      report: {},
      projects: [],
      objectKey: '',
      idType: [
        {'id': 0, 'name': '身份证'},
        {'id': 1, 'name': '军官证'},
        {'id': 2, 'name': '通行证'},
        {'id': 3, 'name': '社保卡'}
      ],
      imagePath: '',
      depts: [],
      _printIframe: undefined
    }
  },
  props: {},
  mounted () {
  },
  methods: {
    _initData () {
      this.axios.get('report/' + this.$route.params.reportId).then(res => {
        this.report = res.data
        console.log(res.data.type)
        this.axios.get('oss/upload/show', {
          params: {
            objectKey: res.data.path,
            bucket: res.data.type
          }
        }).then(res1 => {
          this.imagePath = this.axios.defaults.baseURL.includes('https://')
            ? res1.data.replace('http://', 'https://') : res1.data

        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })

      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.projects = res.data
      }).catch(err => {
        console.log(err)
      })
      this.axios.get('hospital-dept').then(res => {
        this.depts = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    edit () {
      delete this.report.createTime
      this.axios.put('report/' + this.$route.params.reportId, this.report).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        if (this.role === 'firm-service' || this.role === 'manager' || this.role === 'jk-service') {
          this.$router.push('/report/list')
        } else {
          this.$router.push('/report/info/list')
        }
      }).catch(err => {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
        console.log(err)
      })
    },
    cancel () {
      this.$router.push('/report/list')
    },
    unread () {
      delete this.report.createTime
      this.axios.put('report/unread/' + this.$route.params.reportId, this.report).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.push('/report/list')
      }).catch(err => {
        this.$message.error('修改失败')
        console.log(err)
      })
    },
    hospitalQuerySearch (queryString, cb) {
      console.log(queryString)
      this.axios.get('hospital/page', {
        params: {
          pageNum: 1, // 页码
          pageSize: 8, // 每页长度
          keywords: queryString
        }
      }).then(res => {
        let result = []
        if (res.data.endRow === 0) {
          cb(result)
        } else {
          res.data.list.forEach(function (item) {
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
      this.report.hospitalId = item.id
    },
    toCustomizeReport () {
      this.axios.get('report/combine/' + this.$route.params.reportId, {
        params: {
          hospitalId: this.report.hospitalId,
          solutionId: this.report.solutionId
        }
      }).then(res => {
        let result = this.axios.defaults.baseURL.includes('https://')
          ? res.data.replace('http://', 'https://') : res.data
        window.open(result)

      }).catch(err => {
        console.log(err)
      })
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
<style>
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
  }
  .user-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .edit-form {
    max-width: 400px;
  }
  .width-100-p {
    width: 100%
  }
  .img-content {
    margin: 20px 0px 20px 20px;
    height: 706px;
    background: #ffffff;
    overflow: auto;
  }
</style>
