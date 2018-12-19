<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/review' }">信息复核</el-breadcrumb-item>
      <el-breadcrumb-item>信息详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="review-container">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-row class="report-detail">
            <span class="report-detail-title">报告信息
            <el-button type="text" @click="toEditReport(report.id)">修改信息</el-button>
            </span>
          </el-row>
          <el-row class="report-detail">
            <span class="report-detail-title">客户姓名:</span>
            <span>{{report.truename}}</span>
          </el-row>
          <el-row class="report-detail">
            <span class="report-detail-title">手机号码:</span>
            <span>{{report.cellphone}}</span>
          </el-row>
          <el-row class="report-detail">
            <span class="report-detail-title">样本编号:</span>
            <span>{{report.sampleCode}}</span>
          </el-row>
          <el-row>
            <div class="img-content">
              <object :data="imagePath" type="application/pdf" width="80%" height="90%" v-if="report.mimeType === 'application/pdf'">
                <embed :src="imagePath">
              </object>
              <img :src="imagePath" v-else>
            </div>
          </el-row>
        </el-col>
        <el-col :span="16">
          <el-row class="report-detail">
            <span class="report-detail-title">知情同意</span>
            <el-table
              :data="informedList"
              size="mini"
              breport
              style="width: 100%">
              <el-table-column
                label="基本信息"
                width="180">
                <template slot-scope="scope">
                  <el-row class="report-detail">
                    <span class="report-detail-title">客户姓名:</span>
                    <span>{{scope.row.truename}}</span>
                  </el-row>
                  <el-row class="report-detail">
                    <span class="report-detail-title">手机号码:</span>
                    <span>{{scope.row.cellphone}}</span>
                  </el-row>
                  <el-row class="report-detail">
                    <span class="report-detail-title">样本编号:</span>
                    <span>{{scope.row.sampleCode}}</span>
                  </el-row>
                  <el-button type="text" @click="toEditInformed(scope.row.id)">修改信息</el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="文件">
                <template slot-scope="scope">
                  <div class="img-content">
                    <object :data="scope.row.imagePath" type="application/pdf" width="100%" height="700px" v-if="scope.row.mimeType === 'application/pdf'">
                      <embed :src="scope.row.imagePath">
                    </object>
                    <img :src="scope.row.imagePath" v-else>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-col>
      </el-row>
      <div class="footer-btn">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviewPass">确定匹配</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'reportList',
  data () {
    return {
      report: {},
      skuPropertiesName: [],
      informedList: [],
      imagePath: ''
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('report/recheck/' + this.$route.params.reportId).then(res => {
        let _this = this
        res.data.informed.forEach(function (item) {
          let informed = item
          _this.axios.get('oss/upload/show', {
            params: {
              objectKey: item.path,
              bucket: item.type
            }
          }).then(res1 => {
            informed['imagePath'] = _this.axios.defaults.baseURL.includes('https://')
              ? res1.data.replace('http://', 'https://') : res1.data
            _this.informedList.push(informed)
          }).catch(err => {
            console.log(err)
          })
        })
      }).catch(err => {
        console.log(err)
      })
      this.axios.get('report/' + this.$route.params.reportId).then(res => {
        this.report = res.data
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
    },
    toEditReport (id) {
      this.$router.push('/report/edit/' + id)
    },
    toEditInformed (id) {
      this.$router.push('/informed/edit/' + id)
    },
    reviewPass () {
      let _this = this
      _this.informedList.forEach(function (item) {
        _this.axios.put('report/pass', {
          reportId: _this.report.id,
          informedId: item.id
        }).then(res => {
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          this.$router.push('/review')
        }).catch(err => {
          this.$message({
            message: '审核失败',
            type: 'error'
          })
          console.log(err)
        })
      })
    }
  },
  filters: {
    stateFilter: function (state) {
      if (state <= 1) return '实验中'
      if (state === 2) return '无法识别'
      if (state === 3) return '报告已出'
    }
  },
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
  .review-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
  }
  .review-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .report-detail {
    margin-bottom: 10px;
    font-size: 14px;
    .report-detail-title {
      font-weight: bold;
      margin-right: 10px;
    }
    .null-title {
      padding-left: 62px;
    }
  }
  .fl-right {
    float: right;
  }
  .img-content {
    /*margin: 20px 0px 20px 20px;*/
    height: 500px;
    background: #ffffff;
    overflow: auto;
  }
  .footer-btn {
    text-align: center;
  }
</style>
