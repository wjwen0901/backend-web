<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>积分管理</el-breadcrumb-item>
      <el-breadcrumb-item>积分详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="order-box">
      <div class="operate">
        <el-input placeholder="请输入姓名/手机号/订单编号" v-model="condition" size="small" style="width:400px">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
      </div>
      <el-table :data="orderList" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="orderNo" label="订单编号" width="120" />
        <el-table-column prop="change" label="积分变动" width="120" />
        <el-table-column prop="type" label="变动类型" width="120" />
        <el-table-column prop="time" label="变动时间" width="180" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="changePoints(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-sizes="[20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage" />
      </div>
      <el-dialog title="修改积分" :visible.sync="visiablePoints" center width="40%">
        <el-form :model="editForm">
          <el-form-item label="订单编号">
            <span>{{ editForm.orderNo }}</span>
          </el-form-item>
          <el-form-item label="当前积分">
            <span>{{ editForm.change }}</span>
          </el-form-item>
          <el-form-item label="变动类型">
            <span>{{ editForm.type }}</span>
          </el-form-item>
          <el-form-item label="变动时间">
            <span>{{ editForm.time }}</span>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editForm.remark" />
          </el-form-item>
          <el-form-item label="修改积分">
            <el-input v-model="editForm.newChange" placeholder="请输入新的积分" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visiablePoints = false" size="small">取消</el-button>
          <el-button type="primary" @click="changePointsApi" size="small">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      orderList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      userId: this.$route.query.id,
      condition: '',
      visiablePoints: false,
      editForm: {
        orderNo: '',
        change: '',
        type: '',
        time: '',
        remark: '',
        newChange: ''
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.axios.post('points/detail', {
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        condition: this.condition
      }).then(res => {
        if (res.data.code === 200) {
          this.orderList = res.data.data.list
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
    changePoints (row) {
      this.editForm = {
        orderNo: row.orderNo,
        change: row.change,
        type: row.type,
        time: row.time,
        remark: row.remark,
        newChange: ''
      }
      this.visiablePoints = true
    },
    changePointsApi () {
      this.axios.post('points/edit', {
        orderNo: this.editForm.orderNo,
        newChange: this.editForm.newChange,
        remark: this.editForm.remark
      }).then(res => {
        if (res.data.code === 200) {
          this.$message({ message: '修改成功', type: 'success' })
          this.visiablePoints = false
          this.getData()
        } else {
          this.$message({ message: '修改失败', type: 'warning' })
        }
      }).catch(() => {
        this.visiablePoints = false
      })
    }
  }
}
</script>
<style scoped>
.order-box {
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

.i-table {
  width: 100%;
  border-collapse: collapse;
}

.i-title {
  background: #f5f7fa;
}

.i-line td {
  border-bottom: 1px solid #ebeef5;
  padding: 8px;
}
</style>
