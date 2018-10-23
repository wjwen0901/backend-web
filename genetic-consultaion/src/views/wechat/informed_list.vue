<template>
  <el-container>
    <el-table
      :data="informedList"
      style="width: 100%"
      size="mini">
      <el-table-column
        prop="tid">
        <template slot-scope="scope">
          <div class="order-title">
            <div>
              受检者姓名：
              <span v-if="scope.row.patientName !== undefined">{{scope.row.patientName}}
                <span v-if="scope.row.cellphone!== undefined && scope.row.cellphone!== ''">({{scope.row.cellphone}})</span>
              </span>
              <span v-else>暂未提取姓名</span>
            </div>
            <div>
              送检医院：{{scope.row.hospitalName}}
            </div>
            <div>
              送检科室：{{scope.row.deptName}}
            </div>
            <div>
              送检医生：{{scope.row.doctor}}
            </div>
            <div>
              检测产品：
              <el-button type="text" class="text-btn" @click="toProDetail(scope.row.yzDetailUrl)">{{scope.row.solutionName}}</el-button>
            </div>
            <div>
              创建时间：{{scope.row.createTime | formatDate}}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>
<script>
export default {
  name: 'informed_list',
  data () {
    return {
      informedList: [],
      pageNum: 1,
      pageSize: 100,
      totalPage: 0
    }
  },
  methods: {
    getData () {
      this.axios.get('informed/wechat', {
        params: {
          openId: this.$route.query.openid,
          orderId: this.$route.query.orderId
        }
      }).then(res => {
        this.informedList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    toProDetail (yzUrl) {
      window.location.href = yzUrl
    }
  },
  watch: {},
  created () {
    this.getData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .search-input {
    margin-top: 10px;
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
    .el-button {
      font-size: 12px;
      padding: 0;
    }
  }
  .item-title {
    position: relative;
    padding: 8px 0px;
    font-size: 14px;
    font-weight: bold;
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
    .el-button {
      margin-left: 10px;
      float: right;
    }
  }

</style>
