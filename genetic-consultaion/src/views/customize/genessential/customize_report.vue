<template>
  <el-container>
    <el-header>定制报告</el-header>
    <el-main class="upload-main">
      <el-form :rules="rules" ref="report" label-width="100px" label-position="left">
        <el-form-item label="检测产品">
          <el-select class="width-100-p" v-model="solutionId" filterable placeholder="请选择">
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="样本编号" prop="sampleNo">
          <el-input class="width-100-px" v-model="sampleNo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="float-l" type="primary" @click="createReport">生成报告</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'customize_repport',
  data () {
    return {
      solutionId: 0,
      sampleNo: '',
      projects: {},
      rules: {
        sampleNo: [
          {required: true, message: '请填写样本编号', trigger: ''}
        ]
      }
    }
  },
  methods: {
    createReport () {
      let loading = this.$loading({
        lock: true,
        text: '正在生成报告，请稍等',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'post',
        url: 'customize/genessential',
        params: {
          solutionId: _this.solutionId,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          sampleNo: _this.sampleNo
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        window.open(res.data)
        loading.close()
      }).catch(function () {
        _this.$message({
          message: '未获取到此样本结果',
          type: 'error'
        })
      })
    },
    initData () {
      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.projects = res.data
        if (res.data.length > 0) {
          this.solutionId = res.data[0].id
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.initData()
  },
  filters: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    background: #fff;
  }
  .upload-main {
    background: #f2f2f2;
    overflow: hidden;
  }
  .el-header {
    margin-top: 20px;
    text-align: left;
    height: 40px !important;
  }
  .float-l {
    float: left;
  }
  .width-100-px{
    width: 200px;
  }
</style>
