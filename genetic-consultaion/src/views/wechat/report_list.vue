<template>
  <el-container>
    <el-header>
      <el-input size="mini" placeholder="请输入内容" v-model="condition" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>
<!--      <el-menu :default-active="activeIndex" class="mdh-el-menu" mode="horizontal" @select="handleSelect">-->
<!--        <el-menu-item index="0">全部</el-menu-item>-->
<!--        <el-menu-item index="1">知情关联</el-menu-item>-->
<!--        <el-menu-item index="2">我的报告</el-menu-item>-->
<!--      </el-menu>-->
    </el-header>
    <el-main>
      <el-table
        :data="reportList"
        style="width: 100%"
        size="mini">
        <el-table-column
          prop="tid"
          show-header=false>
          <template slot-scope="scope">
            <div class="item-title">
              {{scope.row.solutionName}}
            </div>
            <div class="order-title">
              <div>
                受检者：{{scope.row.truename}}({{scope.row.cellphone}})
              </div>
              <div>
                送检单位：{{scope.row.hospitalName}}
              </div>
              <div>
                生成时间：{{scope.row.createTime | formatDate}}
              </div>
            </div>
            <div class="right-btn">
              <el-button type="primary" size="mini" plain @click="toReportDetail(scope.row.id)">查看报告</el-button>
              <el-button type="primary" size="mini" plain @click="toPrintDetail(scope.row.id)" v-if="printId !== undefined">打印报告</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: 'report_list',
  data () {
    return {
      reportList: [],
      pageNum: 1,
      pageSize: 100,
      totalPage: 0,
      orderNo: this.$route.query.orderNo,
      condition: null,
      activeIndex: '0',
      printId: this.$route.query.printId
    }
  },
  methods: {
    getList () {
      this.axios.get('report/wechat', {
        params: {
          openid: this.$route.query.openid,
          orderId: this.$route.query.orderId,
          condition: this.condition,
          resource: parseInt(this.activeIndex)
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
    toReportDetail (id) {
      this.axios.get('report/' + id).then(res => {
        this.report = res.data
        this.axios.get('oss/upload/show', {
          params: {
            objectKey: res.data.path
          }
        }).then(res1 => {
          this.$router.push({path: '/report/view/', query: {path: res1.data, printId: this.$route.query.printId}})
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    handleSelect (key) {
      this.activeIndex = key
      this.getList()
    },
    toPrintDetail (reportId) {
      let loading = this.$loading({
        lock: true,
        text: '正在链接打印机',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.axios.get('wechatPrt', {
        params: {
          printId: this.$route.query.printId,
          openId: this.$route.query.openid,
          reportId: reportId
        }
      }).then(res => {
        if (res.data === 'no report') {
          this.$notify({
            message: '选择报告异常，请再试一次',
            type: 'error',
            customClass: 'my-message'
          })
        } else if (res.data === 'over limit') {
          this.$notify({
            message: '此报告已打印3次，请联系我们增加打印次数',
            type: 'error',
            customClass: 'my-message'
          })
        } else {
          this.$notify({
            message: '打印成功，请在打印口取走您的报告',
            type: 'success',
            center: true,
            customClass: 'my-message'
          })
        }
        loading.close()
      }).catch(err => {
        console.log(err)
        this.$notify({
          message: '此打印机不可用，请回到"我的->咨询服务"联系我们',
          type: 'error',
          customClass: 'my-message'
        })
        loading.close()
      })
    }
  },
  watch: {},
  created () {
    let loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.getList()
    loading.close()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    background: #F7F7F7;
    min-height: 100%;
  }
  .el-header {
    padding: 0;
    height: auto!important;
    z-index: 999;
    .input-with-select {
      padding: 10px 20px;
    }
    .el-menu {
      width: 100%;
    }
    .mdh-el-menu>.el-menu-item {
      height: 40px;
      line-height: 40px;
      width: 33.33%;
      text-align: center;
      border-top: solid 1px #e6e6e6;
      border-right: solid 1px #e6e6e6;
    }
    .el-input-group {
      width: calc(100% - 40px);
    }
  }
  .el-main {
    margin-top: -28px;
    padding: 0;
  }
  .order-title {
    position: relative;
    div {
      line-height: 18px;
    }
    .status {
      position: absolute;
      right: 0;
      bottom: 2px;
    }
  }
  .item-title {
    position: relative;
    padding: 4px 0px;
    font-size: 14px;
    font-weight: 500;
    .money {
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
      color: #E6A23C;
      display: inline-block;
    }
  }
  .right-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    .el-button {
      margin-left: 10px;
      float: right;
    }
  }

</style>
