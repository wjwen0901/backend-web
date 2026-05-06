<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>积分详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="points-box">
      <div class="operate">
        <el-input placeholder="请输入订单号" v-model="condition" size="small" style="width:300px">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
        <div class="action">
          <el-radio-group v-model="radio" size="small">
            <el-radio-button label="patientName" value="patientName">患者姓名</el-radio-button>
            <el-radio-button label="orderNo" value="orderNo">订单号</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="points-table">
        <!-- <el-table :data="groupedPoints" style="width: 100%" row-key="groupKey" :show-header="false">
          <el-table-column>
            <template slot-scope="scope">

            </template>
</el-table-column>
</el-table> -->

        <div v-for="(item, index) in groupedPoints" :key="index" class="group-container">
          <div class="group-header">
            <div class="group-title">
              {{(radio === 'orderNo' ? '订单号：' :'患者：') }}
              <span class="group-key">{{ item.groupKey }}</span>
              {{radio === 'orderNo' ?"【" + item.items[0].itemTitle + "】" : '' }} （ {{ item.items.length }}条记录）
            </div>
            <el-button class="collapse-btn" type="text"  @click="toggleCollapse(item.groupKey)">
              {{ collapsedGroups[item.groupKey] ? '展开' : '折叠' }}
            </el-button>
          </div>
          <el-table v-show="!collapsedGroups[item.groupKey]" :data="item.items" class="group-table"
            style="width: 100%" >
            <el-table-column prop="itemTitle" label="订单" min-width="300" />
            <el-table-column prop="orderNo" label="订单编号" width="210" />
            <el-table-column prop="sampleCode" label="样本编码" width="210" />
            <el-table-column prop="userName" label="用户" width="120" />
            <el-table-column prop="patientName" label="患者姓名" width="120" />
            <el-table-column prop="amount" label="积分余额" width="120" />
            <el-table-column prop="tokenNum" label="分配积分" width="120" />
            <el-table-column prop="tokenTime" label="分配时间" width="180">
              <template slot-scope="scope2">
                {{ scope2.row.tokenTime ? new Date(scope2.row.tokenTime).toLocaleString() : '- -' }}
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope2">
                <el-button type="text" v-if="scope2.row.unable != 1" @click="openTokenDialog(scope2.row)">修改积分</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
          <span>{{ tokenForm.orderNo }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span>{{ tokenForm.userName }}</span>
        </el-form-item>
        <el-form-item label="旧积分数量">
          <span>{{ tokenForm.oldTokenNum || '- -' }}</span>
        </el-form-item>
        <el-form-item label="新积分数量">
          <el-input-number size="small" v-model="tokenForm.newTokenNum" :min="0" placeholder="请输入积分" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input size="small" v-model="tokenForm.description" placeholder="分配积分" />
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
export default {
  data() {
    return {
      visiableToken: false,
      collapsedGroups: {},
      tokenForm: {
        userId: '',
        newTokenNum: '',
        oldTokenNum: '',
        orderId: '',
        description: '重新分配积分',
        orderNo: '',
        userName: '',
        tokenDetailId: '' // 修改的哪条记录id
      },
      radio: 'orderNo',
      pointsDetailList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      condition: '',
      query_user_id: this.$route.query.userId ? this.$route.query.userId : null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  mounted() {
    this.getData()
  },
  computed: {
    groupedPoints() {
      const groupKey = this.radio === 'patientName' ? 'patientName' : 'orderNo'
      const groups = {}
      this.pointsDetailList.forEach(item => {
        const key = item[groupKey] || '未知'
        if (!groups[key]) groups[key] = []
        groups[key].push(item)
      })
      return Object.keys(groups).map(k => ({
        groupKey: k,
        items: groups[k]
      }))
    }
  },
  methods: {
    // 折叠分组
    toggleCollapse(groupKey) {
      this.$set(this.collapsedGroups, groupKey, !this.collapsedGroups[groupKey])
    },
    // 分配积分弹窗
    openTokenDialog(item) {
      console.log(item)
      this.tokenForm = {
        userId: item.userId || '',
        newTokenNum: '',
        oldTokenNum: item.tokenNum,
        orderId: item.orderId || '',
        description: '重新分配积分',
        orderNo: item.orderNo || '',
        userName: item.userName || '',
        tokenDetailId: item.tokenDetailId || ''
      }
      this.visiableToken = true
    },
    // 分配积分接口
    allocateToken() {
      this.axios.post('/manage/token/change', {
        userId: this.tokenForm.userId,
        newTokenNum: this.tokenForm.newTokenNum,
        oldTokenNum: this.tokenForm.oldTokenNum,
        orderId: this.tokenForm.orderId,
        description: this.tokenForm.description,
        tokenDetailId: this.tokenForm.tokenDetailId
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

    getData() {
      if (!this.query_user_id) {
        this.$message('数据错误，请返回重试')
        return
      }
      this.loading = true
      this.axios.get('manage/token/list/' + this.query_user_id, {
        params: this.condition ? {
          condition: this.condition,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        } : {
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
    handleSizeChange(val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getData()
    }
  }
}
</script>
<style scoped lang="scss">
.points-box {
  margin: 20px 0px;
}

.group-container {
  margin-bottom: 12px;
  padding: 12px;
  background-color: #fff;
  border-radius: 6px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: #f0f4fa;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.group-title {
  flex: 1;
  color: #333;
  font-size: 16px;
}

.group-key {
  font-weight: 500;
  color: #137E73;
  font-size: 16px;
}

.collapse-btn {
  margin-left: 12px;
  color: #409EFF;
  font-weight: 500;
  transition: color 0.2s;
  border-radius: 4px;
}

.collapse-btn:hover {
  color: #66b1ff;
  background: #eaf3ff;
}

.operate {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 6px;
  background-color: #fff;
}
</style>
<style lang="scss">
/* TODO(Sprint 3): 透明行 !important 删除会让 Element 默认 zebra 回来，需先确认积分明细的视觉是否依赖透明行（建议 Playwright 截图对比后处理） */
.el-table__row {
  background-color: transparent !important;
}
</style>
