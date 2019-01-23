<template>
  <el-container>
    <el-header>定制报告</el-header>
    <el-main class="upload-main">
      <el-form :rules="rules" :model="report" ref="report" label-width="100px" label-position="left">
        <el-form-item label="检测产品">
          焕彩基因美肤方案
        </el-form-item>
        <el-form-item label="样本编号" prop="sampleNo">
          <el-input class="width-100-p" v-model="sampleNo"></el-input>
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
      sampleNo: '',
      rules: {
        sampleNo: [
          {required: true, message: '请填写样本编号', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    createReport () {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      loading.close()
    }
  },
  created () {
    this.axios.get('customize/genessential', {
      params: {
        userId: window.localStorage.userId,
        sampleNo: this.sampleNo
      }
    }).then(res => {
      this.reportList = res.data.list
      this.pageSize = res.data.pageSize
      this.pageNum = res.data.pageNum
      this.totalPage = res.data.total
    }).catch(err => {
      console.log(err)
    })
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
  .width-100-p {
    width: 100%
  }
</style>
