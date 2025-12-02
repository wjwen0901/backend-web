<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>积分详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="points-box">
      <div class="points-table">
        <el-table :data="pointsDetailList" style="width: 100%">
          <el-table-column prop="orderUserName" label="订单用户" width="180" />
          <el-table-column prop="patientName" label="患者姓名" width="180" />
          <el-table-column prop="userId" label="用户ID" width="120" />
          <el-table-column prop="orderId" label="订单编号" width="120" />
          <el-table-column prop="amount" label="积分余额" width="120" />
          <el-table-column prop="tokenNum" label="分配积分" width="120" />
          <el-table-column prop="tokenTime" label="分配时间" width="180" >
            <template slot-scope="scope">
              {{ scope.row.tokenTime ? new Date(scope.row.tokenTime).toLocaleString() : '- -' }}
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述"  />
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openTokenDialog(scope.row)">修改积分</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-sizes="[20, 50, 100, 150, 2000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="修改积分" :visible.sync="visiableToken" center width="40%">
      <el-form :model="tokenForm" label-width="100px">
        <el-form-item label="订单编号">
          <span>{{ tokenForm.orderId }}</span>
        </el-form-item>
        <el-form-item label="用户ID">
          <span>{{ tokenForm.userId }}</span>
        </el-form-item>
        <el-form-item label="旧积分数量">
          <span>{{ tokenForm.oldTokenNum || '- -'}}</span>
        </el-form-item>
        <el-form-item label="新积分数量">
          <el-input-number v-model="tokenForm.newTokenNum" :min="0" placeholder="请输入积分" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="tokenForm.description" placeholder="分配积分" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visiableToken = false" size="small">取消</el-button>
        <el-button type="primary" @click="allocateToken" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import NP from 'number-precision'
export default {
  data () {
    return {
      visiableToken: false,
      tokenForm: {
        userId: '',
        newTokenNum: '',
        oldTokenNum: '',
        orderId: '',
        description: '重新分配积分'
      },
      pointsDetailList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      condition: this.$route.query.userId ? this.$route.query.userId : null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 分配积分弹窗
    openTokenDialog (item) {
      console.log(item)
      this.tokenForm = {
        userId: item.userId || '',
        newTokenNum: '',
        oldTokenNum: item.tokenNum,
        orderId: item.orderId || '',
        description: '重新分配积分'
      }
      this.visiableToken = true
    },
    // 分配积分接口
    allocateToken () {
      if (!this.tokenForm.newTokenNum) {
        this.$message({ message: '请输入积分', type: 'warning' })
        return
      }
      this.axios.post('/manage/token/change', {
        userId: this.tokenForm.userId,
        newTokenNum: this.tokenForm.newTokenNum,
        oldTokenNum: this.tokenForm.oldTokenNum,
        orderId: this.tokenForm.orderId,
        description: this.tokenForm.description
      }).then(res => {
        if (res.data && res.data.data === 'sucess') {
          this.$message({ message: '修改成功', type: 'success' })
          this.visiableToken = false
          this.getData()
        } else {
          this.$message({ message: '分配失败', type: 'warning' })
        }
      }).catch(() => {
        this.visiableToken = false
      })
    },

    getData () {
      if (!this.condition) {
        this.$message('数据错误，请返回重试')
        return
      }
      this.loading = true
      this.axios.get('manage/token/list/' + this.condition, {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(result => {
        const res = result.data
        this.pointsDetailList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
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

</style>
