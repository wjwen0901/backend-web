<template>
  <div class="points-page">
    <el-breadcrumb>
      <el-breadcrumb-item>积分管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="points-box">
      <div class="operate">
        <el-input placeholder="请输入手机号" v-model="condition" size="small" style="width:300px">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
      </div>
      <div class="points-table">
        <el-table :data="pointsList" style="width: 100%">
          <el-table-column prop="orderUserName" label="姓名" width="220" />
          <el-table-column prop="cellphone" label="手机号" width="250" />
          <el-table-column prop="amount" label="积分余额" width="220" />
          <el-table-column prop="lastTime" label="最近使用时间" />
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="viewDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-sizes="[20, 50, 100, 150]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      condition: '',
      pointsList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      // 请求积分列表数据
      this.axios.get('manage/token/list', {
        params: this.condition ? {
          condition: this.condition,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        } : {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        const data = res.data
        if (data.code === 200) {
          this.pointsList = data.data.list
          console.log(this.pointsList)
          this.pageSize = data.data.pageSize
          this.pageNum = data.data.pageNum
          this.totalPage = data.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.getData()
    },
    handleCurrentChange (num) {
      this.pageNum = num
      this.getData()
    },
    viewDetail (row) {
      this.$router.push({
        path: '/points/detail',
        query: { userId: row.userId }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.points-box {
  margin: 20px 0px;
  padding: 20px;
  background: #ffffff;
}

.operate {
  margin-bottom: 16px;
}

.page-box {
  margin-top: 16px;
  text-align: right;
}
</style>
