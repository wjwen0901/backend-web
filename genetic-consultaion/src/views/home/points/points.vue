<template>
  <div class="points-page">
    <el-breadcrumb>
      <el-breadcrumb-item>积分管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="points-box">
      <div class="operate">
        <el-input placeholder="请输入姓名/手机号" v-model="condition" size="small" style="width:300px">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
      </div>
      <div class="points-table">
        <el-table :data="pointsList" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="220" />
          <el-table-column prop="phone" label="手机号" width="250" />
          <el-table-column prop="balance" label="积分余额" width="220" />
          <el-table-column prop="lastUsed" label="最近使用时间"  />
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="viewDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        />
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
      this.axios.post('points/list', {
        condition: this.condition,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        if (res.data.code === 200) {
          this.pointsList = res.data.data.list
          this.totalPage = res.data.data.total
        }
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
        path: '/home/points/detail',
        query: { id: row.id }
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
.operate { margin-bottom: 16px; }
.page-box { margin-top: 16px; text-align: right; }
</style>
