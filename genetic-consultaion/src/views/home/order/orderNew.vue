<template>
  <div class="pc-page pc-order">
    <div class="pc-page-title">
      <h2>订单管理</h2>
      <span class="desc">共 {{ totalPage }} 单 · 当前页 {{ filteredOrderList.length }} 单</span>
    </div>

    <div class="pc-data-panel order-box">
      <div class="pc-filter-strip">
      <!-- 状态分段 -->
      <div class="pc-seg" ref="seg" v-if="statusSegments.length">
        <div class="pc-seg__item"
             :class="{ 'is-active': activeStatusStr === '' }"
             @click="setStatusFilter('', $event)">
          全部 <span class="count">{{ orderList.length }}</span>
        </div>
        <div class="pc-seg__item"
             v-for="s in statusSegments"
             :key="s.label"
             :class="{ 'is-active': activeStatusStr === s.label }"
             @click="setStatusFilter(s.label, $event)">
          {{ s.label }} <span class="count">{{ s.count }}</span>
        </div>
        <div class="pc-seg__bar" :style="{ width: barW + 'px', transform: 'translateX(' + barX + 'px)' }"></div>
      </div>

      <!-- 工具条 -->
      <div class="pc-toolbar">
        <el-input placeholder="请输入下单人姓名/手机号/检测项目" v-model="condition" size="small" class="search-input" @keyup.enter.native="getData">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
        <span class="grow"></span>
        <el-button size="small" icon="el-icon-refresh" @click="getData">刷新</el-button>
        <el-button type="warning" size="small" icon="el-icon-download" @click="exportData">导出</el-button>
      </div>

      <!-- 批量操作条 -->
      <div class="pc-batchbar" v-if="checkIds.length">
        <span>已选 <b>{{ checkIds.length }}</b> 项</span>
        <span class="batchbar-actions">
          <el-button size="mini" @click="exportData">批量导出</el-button>
          <el-button size="mini" type="danger" plain @click="clearChecked">取消选择</el-button>
        </span>
      </div>
      </div>
      <div class="order-table">
        <table class="business-table">
          <thead>
            <tr>
              <th class="col-check">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleAllCheck"></el-checkbox>
              </th>
              <th class="col-product">检测项目 / 订单</th>
              <th class="col-status">状态</th>
              <th class="col-money">金额 / 积分</th>
              <th class="col-person">客户</th>
              <th class="col-time">时间</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>
          <tbody v-if="filteredOrderList && filteredOrderList.length !== 0">
            <tr v-for="(item, index) in filteredOrderList" :key="item.id || index" class="business-row">
              <td class="col-check">
                <el-checkbox v-model="item.isChecked" @change="handelCheckIs($event, item)"></el-checkbox>
              </td>
              <td class="col-product product-cell">
                <div class="product-title" :title="item.itemTitle || item.solutionName || '未命名检测项目'">
                  {{ item.itemTitle || item.solutionName || '未命名检测项目' }}
                </div>
                <div class="product-meta">
                  <span>订单 {{ item.orderNo || '——' }}</span>
                  <span v-if="item.sampleCode">样本 {{ item.sampleCode }}</span>
                  <span v-if="item.solutionName && item.solutionName !== item.itemTitle">{{ item.solutionName }}</span>
                </div>
              </td>
              <td class="col-status status-cell">
                <el-tag size="small" :class="tagClassForStatusStr(item.statusStr)">
                  {{ item.statusStr || '——' }}
                </el-tag>
                <div class="status-counts">
                  知情 {{ item.informedNum || 0 }} / 报告 {{ item.reportNum || 0 }}
                </div>
              </td>
              <td class="col-money money-cell">
                <div class="money-main">{{ formatCurrency(item.payment) }}</div>
                <div class="money-sub">原价 {{ formatCurrency(item.directPrice || item.totalFee) }}</div>
                <div class="money-token">{{ item.tokenNum || '无积分记录' }}</div>
              </td>
              <td class="col-person person-cell">
                <div class="person-main">{{ item.pName || '未填写受检者' }}</div>
                <div class="person-sub">{{ item.pCellphone || '无手机号' }}</div>
                <div class="person-orderer">下单 {{ item.fullName || '-' }}<span v-if="item.cellphone"> · {{ item.cellphone }}</span></div>
              </td>
              <td class="col-time time-cell">
                <div><span class="time-label">下单</span>{{ formatOrderTime(item.createTime) }}</div>
                <div><span class="time-label">支付</span>{{ formatOrderTime(item.payTime, '未支付') }}</div>
              </td>
              <td class="col-actions action-cell">
                <el-button type="text" size="small"
                  @click="toInformedDetail(item.id, item.expressCode, item.expressId)">详情</el-button>
                <el-button v-if="item.statusStr === '收款码待付款'" type="text" size="small" class="priceText"
                    @click="changePrice(item.payment, item.orderNo, item.itemTitle, item.id)">改价</el-button>
                <el-button type="text" size="small" @click="toUploadInformed(item.id)">知情</el-button>
                <el-button type="text" size="small" @click="toUploadReport(item.id)"
                  v-if="item.reportNum === 0 && roleCode === 'manager'">报告</el-button>
                <el-button type="text" size="small" @click="openTokenDialog(item)">积分</el-button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7">
                <div class="business-empty">
                  <i class="el-icon-document"></i>
                  <h3>{{ emptyTitle }}</h3>
                  <p>{{ emptyReason }}</p>
                  <el-button v-if="activeStatusStr || condition" type="primary" size="small" @click="resetFilters">清空筛选</el-button>
                  <el-button v-else size="small" @click="getData">刷新订单</el-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-sizes="[20, 50, 100, 150, 2000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="改 价" :visible.sync="visiablePrice" center class="price-dialog" width="60%">
      <div class="price-dialog-meta">
        <span><i class="el-icon-tickets"></i>订单编号：{{ orderNo }}</span>
        <span><i class="el-icon-collection-tag"></i>检测项目：{{ itemTitle }}</span>
      </div>
      <el-row type="flex" justify="center" class="priceDiag">
        <el-col :span="6">
          <div class="priceBox">
            <span class="priceTitle">当前价格</span>
            <span class="linerText">
              {{ formatCurrency(nowPrice) }}</span>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="priceBox">
            <span class="priceTitle">-</span>
            <span class="linerText">-</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="priceBox">
            <span class="priceTitle">添加价格</span>
            <div>
              <el-input class="liner" v-model="addPrice" size="small" placeholder="请输入价格"
                style="width:140px;"></el-input>
            </div>
            <span v-if="addPrice && !/^(\-|\+)?\d+(\.\d+)?$/.test(addPrice)" class="price-tip">* 请输入正确的金额</span>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="priceBox">
            <span class="priceTitle">=</span>
            <span class="linerText">=</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="priceBox">
            <span class="priceTitle">改后价格</span>
            <span class="linerText">
              {{ formatCurrency(afterPrice) }}</span>
            <span class="price-tip" v-if="afterPrice < 0" style="transform: translateY(-30px);">* 赔钱啦~怎么变成负数啦~</span>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visiablePrice = false" size="small">取 消</el-button>
        <el-button type="primary" @click="changePriceApi" size="small" :disabled="priceBut">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配积分" :visible.sync="visiableToken" center width="40%">
      <el-form :model="tokenForm" label-width="100px">
        <el-form-item label="订单编号">
          <span>{{ tokenForm.orderNo }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span>{{ tokenForm.userName }}</span>
        </el-form-item>
        <el-form-item label="产品价格">
          <span>{{ tokenForm.directPrice || '- -' }}</span>
        </el-form-item>
        <el-form-item label="实际支付">
          <span>{{ tokenForm.payment }}</span>
        </el-form-item>
        <el-form-item label="分配积分">
          <div style="display: flex; flex-direction: column;gap:12px">
            <el-input-number size="small" v-model="tokenForm.tokenNum" :min="0" placeholder="请输入积分"
              style="width: 100%;" />
            <div class="tokenRatio">
              <div style="display: flex; align-items: center;">
                <span style="margin: 0 8px;">使用常用比例</span>
                <el-button-group size="small" style="flex:1">
                  <el-button style="width: calc(100% / 3);" size="small" @click="setTokenByRatio(35)">35%</el-button>
                  <el-button style="width: calc(100% / 3);" size="small" @click="setTokenByRatio(50)">50%</el-button>
                  <el-button style="width: calc(100% / 3);" size="small" @click="setTokenByRatio(65)">65%</el-button>
                </el-button-group>
              </div>

              <div style="display: flex; align-items: center;">
                <span style="margin: 0 8px;">自定义比例</span>
                <el-input-number style="flex:1" size="small" v-model="customRatio" :min="0" :max="100">
                </el-input-number>
                <span style="margin: 0 8px;">%</span>
                <el-button type="primary" @click="setTokenByRatio(customRatio)" size="small">计算</el-button>

              </div>
            </div>
          </div>
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
import NP from 'number-precision'
import { tagClassOf } from '@/utils/pc'
import { limitPageRows } from '@/utils/pagination'
export default {
  data () {
    return {
      orderId: '',
      itemTitle: '',
      orderNo: '',
      priceBut: true,
      addPrice: '', // 添加价格
      nowPrice: '', // 之前的价格
      afterPrice: '', // 改后价格
      visiablePrice: false,
      visiableToken: false,
      tokenForm: {
        userId: '',
        userName: '',
        tokenNum: '',
        orderId: '',
        orderNo: '',
        description: '分配积分',
        directPrice: '', // 产品价格
        payment: '' // 实际支付
      },
      customRatio: null,
      isIndeterminate: false,
      checkAll: false, // 全选
      checkIs: false,
      checkboxes: {},
      checkIds: [], // 选中的ID
      orderList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      dialogFormVisible: false,
      multipleSelection: [],
      reportIds: [],
      companyId: '',
      companyList: [],
      companySelLoading: false,
      sendEmailFormVisible: false,
      companyEmail: [],
      emailList: [],
      roleCode: window.localStorage.role,
      condition: null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      activeStatusStr: '',
      barX: 0,
      barW: 0
    }
  },
  computed: {
    statusSegments () {
      const counts = {}
      this.orderList.forEach(o => {
        const k = o.statusStr || '——'
        counts[k] = (counts[k] || 0) + 1
      })
      return Object.keys(counts).map(label => ({ label, count: counts[label] }))
    },
    filteredOrderList () {
      if (!this.activeStatusStr) return this.orderList
      return this.orderList.filter(o => (o.statusStr || '——') === this.activeStatusStr)
    },
    emptyTitle () {
      if (this.activeStatusStr) return '没有该状态订单'
      if (this.condition) return '没有匹配订单'
      return '还没有订单'
    },
    emptyReason () {
      if (this.activeStatusStr) return '当前筛选为「' + this.activeStatusStr + '」，可以清空筛选查看全部订单。'
      if (this.condition) return '关键词没有命中下单人、手机号、订单号、受检者或检测项目。'
      return '订单同步后会出现在这里，先确认渠道、支付状态或刷新列表。'
    }
  },
  mounted () {
    this.getData()
    this.getCompanyList()
    this.$nextTick(() => this.moveBar())
  },
  created () {

  },
  destroyed () {
    window.sessionStorage.removeItem('checkPage')
  },
  watch: {
    orderList: { // 监听事件,监听复选框是否全部选中,全部选中则全选的复选框勾选上
      handler (val) {
        var i = 0
        this.orderList.forEach(item => {
          if (item.isChecked === true) {
            i++
          }
          if (i === this.orderList.length) {
            this.checkAll = true
          } else {
            this.checkAll = false
          }
        })
      },
      deep: true
    },
    // 计算
    addPrice (val) {
      if (val && !/^(\-|\+)?\d+(\.\d+)?$/.test(val)) {
        this.priceBut = true
        return
      }
      this.priceBut = false
      if (val) {
        // this.afterPrice = NP.plus(this.addPrice,this.nowPrice)//加法
        this.afterPrice = NP.minus(this.nowPrice, this.addPrice)// 减法
      } else {
        this.afterPrice = this.nowPrice
      }
    },
    afterPrice (val) {
      if (val < 0) {
        this.priceBut = true
        return
      }
      this.priceBut = false
    },
    pageNum (newNum, oldNum) {
      const arrId = window.sessionStorage.getItem('checkPage')
      const obj = JSON.parse(arrId)
      let newSeesion = Object.assign({}, obj, { [oldNum]: { data: this.orderList } })
      window.sessionStorage.setItem('checkPage', JSON.stringify(newSeesion))
    },
    checkIds (val) {
      if (val && val.length !== 0) {
        this.isIndeterminate = true
      } else {
        this.isIndeterminate = false
      }
    }
  },
  methods: {
    formatCurrency (value) {
      if (value === null || value === undefined || value === '') return '-'
      const num = Number(value)
      if (isNaN(num)) return '-'
      return '¥' + num.toFixed(2)
    },
    formatOrderTime (value, emptyText) {
      if (!value) return emptyText || '-'
      const date = new Date(value)
      if (isNaN(date.getTime())) return emptyText || '-'
      const pad = n => n < 10 ? '0' + n : '' + n
      return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes())
    },
    resetFilters () {
      this.condition = null
      this.activeStatusStr = ''
      this.pageNum = 1
      this.getData()
      this.$nextTick(() => this.moveBar())
    },
    // 根据比例设置积分
    setTokenByRatio (ratio) {
      if (!this.tokenForm.directPrice || isNaN(this.tokenForm.directPrice)) {
        this.$message({ message: '产品价格无效', type: 'warning' })
        return
      }
      if (!ratio || isNaN(ratio)) {
        this.$message({ message: '比例无效', type: 'warning' })
        return
      }
      this.tokenForm.tokenNum = Math.floor(this.tokenForm.directPrice * ratio / 100)
    },
    // 分配积分弹窗
    openTokenDialog (item) {
      console.log(item)
      this.tokenForm = {
        userId: item.userId || '',
        userName: item.fullName || '',
        tokenNum: '',
        orderId: item.id || '',
        orderNo: item.orderNo || '',
        description: '分配积分',
        directPrice: item.directPrice || '', // 产品价格
        payment: item.payment // 实际支付
      }
      this.visiableToken = true
    },
    // 分配积分接口
    allocateToken () {
      if (!this.tokenForm.tokenNum) {
        this.$message({ message: '请输入积分', type: 'warning' })
        return
      }
      this.axios.post('/manage/token/allocate', {
        userId: this.tokenForm.userId,
        tokenNum: this.tokenForm.tokenNum,
        orderId: this.tokenForm.orderId,
        description: this.tokenForm.description
      }).then(res => {
        if (res.data && res.data.data === 'sucess') {
          this.$message({ message: '分配成功', type: 'success' })
          this.visiableToken = false
          this.getData()
        } else {
          this.$message({ message: '分配失败', type: 'warning' })
        }
      }).catch(() => {
        this.visiableToken = false
      })
    },
    // 改价接口
    changePriceApi () {
      this.axios.post('order/edit', {
        id: this.orderId,
        payment: this.afterPrice,
        orderDiscountFee: this.addPrice
      }).then(res => {
        if (res.data.code == 200) {
          this.$message({ message: '改价成功', type: 'success' })
          this.visiablePrice = false
        } else {
          this.$message({ message: '改价失败', type: 'warning' })
        }
      }).catch(err => {
        console.log(err)
        this.visiablePrice = false
      })
    },
    // 价格弹窗
    changePrice (val, orderNo, itemTitle, id) {
      this.orderId = id
      this.nowPrice = val
      this.orderNo = orderNo
      this.itemTitle = itemTitle
      this.afterPrice = this.nowPrice
      this.addPrice = ''
      this.visiablePrice = true
    },
    // 复选框
    handelCheckIs (val, item) {
      item.isChecked = val
      if (val) {
        this.checkIds.push(item.id)
      } else {
        this.checkIds.map((child, index) => {
          if (child === item.id) {
            this.checkIds.splice(index, 1)
          }
        })
      }
      this.$forceUpdate()
    },
    // 全选
    handleAllCheck (val) {
      let arrId = []
      this.orderList.map(item => {
        item.isChecked = val
        arrId.push(item.id)// 记录当前页面全选的id
      })
      if (val) { // 当勾选全选时候，赋值ID
        // 去除重复再赋值
        this.checkIds = Array.from(new Set(this.checkIds.concat(arrId)))
      } else { // 否则移除已选中的id值
        let list = this.checkIds.filter(items => {
          if (!arrId.includes(items)) return items
        })
        this.checkIds = list
      }
      console.log(this.checkIds)
    },
    // statusStr → 设计系统 6 类语义 Tag class（Clinical）
    tagClassForStatusStr (val) {
      return tagClassOf(val)
    },
    setStatusFilter (label, ev) {
      this.activeStatusStr = label
      this.$nextTick(() => this.moveBar(ev && ev.currentTarget))
    },
    moveBar (target) {
      const seg = this.$refs.seg
      if (!seg) return
      if (!target) target = seg.querySelector('.is-active')
      if (!target) return
      const r = target.getBoundingClientRect()
      const p = seg.getBoundingClientRect()
      this.barX = r.left - p.left + seg.scrollLeft
      this.barW = r.width
    },
    clearChecked () {
      this.checkIds = []
      this.checkAll = false
      this.orderList.forEach(item => { item.isChecked = false })
    },
    headerClassName ({ row, rowIndex }) {
      return 'header-row'
    },
    // 导出
    exportData () {
      // 处理选中ID
      if (this.checkIds.length !== 0) {
        console.log('&&&' + this.checkIds)
        this.exportPutData(this.checkIds)
      } else {
        this.$confirm('此操作将导出当前全部数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.exportPutData([])
        }).catch(() => {
          console.log('取消')
        })
      }
    },
    // 导出数据后台接口
    exportPutData (val) {
      this.axios.get('order/user/export', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          ids: val.toString(),
          condition: this.condition ? this.condition.trim() : ''
        },
        responseType: 'blob'
      }).then(res => {
        const blob = new Blob(
          [res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const aEle = document.createElement('a') // 创建a标签
        const href = window.URL.createObjectURL(blob) // 创建下载的链接
        aEle.href = href
        const today = new Date()
        aEle.download = '订单列表' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.xls' // 下载后文件名
        document.body.appendChild(aEle)
        aEle.click() // 点击下载
        document.body.removeChild(aEle) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }).catch(err => {
        console.log(err)
      })
    },
    getData () {
      this.loading = true
      this.axios.get('order/user', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          condition: this.condition ? this.condition.trim() : ''
        }
      }).then(res => {
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.orderList = limitPageRows(res.data.list, this.pageSize)
        this.totalPage = res.data.total
        this.loading = false
        // 翻页复选框处理
        const obj = window.sessionStorage.getItem('checkPage')
        const arr = JSON.parse(obj)
        if (arr && arr[this.pageNum]) {
          this.orderList = limitPageRows(arr[this.pageNum].data, this.pageSize)
        } else {
          this.orderList.forEach(item => { // 处理后端传过来的数据,如果没有可以判断是否勾选复选框的字段,则需给数据作处理,加上一个isChecked字段,判断复选框勾选
            this.$set(item, 'isChecked', false) // 添加判断的字段
          })
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    getCompanyList () {
      this.axios.get('company/CustCompany', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.companyList = res.data
      }).catch(err => {
        this.$message.error(err.data.message)
        console.log(err)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.orderPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.orderPageNum = val
      this.getData()
    },
    toRecheck (reportId, informedId) {
      this.axios.get('report/recheck/' + reportId, {
        params: {
          informedId: informedId,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.informed = res.data.informed
        this.report = res.data.report
        this.dialogFormVisible = true
      }).catch(err => {
        console.log(err)
      })
    },
    toUploadInformed (id) {
      this.$router.push({ path: '/informed/upload', query: { orderId: id } })
    },
    toUploadReport (id) {
      this.$router.push({ path: '/report/upload', query: { orderId: id } })
    },
    toInformedDetail (id, expressCode, expressId) {
      this.$router.push({ path: '/order/' + id, query: { expressCode: expressCode, expressId: expressId } })
    }
  }
}
</script>
<style scoped lang="scss">
.pc-order .search-input { width: 340px; }
.pc-order .grow { flex: 1; }
.pc-order .batchbar-actions { display: flex; gap: 8px; }

.order-box {
  display: flex;
  flex-direction: column;
  background: var(--pc-white);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-6);
  padding: 16px 20px;
  box-shadow: var(--pc-sh-1);
  margin: 0 0 16px;

  .page-box {
    text-align: right;
    margin: 12px 0 0;
  }

  .order-table {
    margin-top: 12px;
    overflow-x: auto;

    .business-table {
      width: 100%;
      border-spacing: 0;
      table-layout: fixed;
      font-size: 12.5px;
      color: var(--pc-ink-700);
      border-collapse: collapse;

      th {
        height: 38px;
        padding: 0 10px;
        background: var(--pc-ink-50);
        color: var(--pc-ink-600);
        font-weight: 600;
        text-align: left;
        border-bottom: 1px solid var(--pc-ink-200);
      }

      td {
        padding: 11px 10px;
        border-bottom: 1px solid var(--pc-ink-200);
        vertical-align: middle;
      }

      .business-row {
        transition: background var(--pc-dur-2) var(--pc-ease);
      }

      .business-row:hover {
        background: var(--pc-ink-50);
      }

      .col-check { width: 44px; text-align: center; }
      .col-product { width: 34%; }
      .col-status { width: 112px; }
      .col-money { width: 132px; text-align: right; }
      .col-person { width: 176px; }
      .col-time { width: 178px; }
      .col-actions { width: 170px; text-align: right; }

      .product-title,
      .person-main {
        color: var(--pc-ink-900);
        font-weight: 600;
      }

      .product-title {
        line-height: 1.45;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .product-meta,
      .status-counts,
      .money-sub,
      .money-token,
      .person-sub,
      .person-orderer,
      .time-cell {
        color: var(--pc-ink-500);
        font-size: 11.5px;
      }

      .product-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 10px;
        margin-top: 5px;
        line-height: 1.35;
      }

      .status-cell .el-tag {
        margin-bottom: 5px;
      }

      .money-main {
        color: var(--pc-ink-900);
        font-family: var(--pc-font-mono);
        font-weight: 700;
        font-size: 13px;
      }

      .money-sub,
      .money-token {
        margin-top: 3px;
      }

      .person-sub,
      .person-orderer {
        margin-top: 3px;
      }

      .person-orderer {
        font-weight: 600;
      }

      .time-cell {
        line-height: 1.7;
      }

      .time-label {
        display: inline-block;
        width: 30px;
        color: var(--pc-ink-400);
      }

      .action-cell {
        white-space: normal;
      }

      .action-cell .el-button {
        margin-left: 8px;
        padding: 3px 0;
      }

      .business-empty {
        padding: 42px 0 46px;
        text-align: center;
        color: var(--pc-ink-500);
      }

      .business-empty i {
        display: inline-flex;
        width: 34px;
        height: 34px;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        border-radius: var(--pc-r-6);
        background: var(--pc-info-100);
        color: var(--pc-info-600);
        font-size: 18px;
      }

      .business-empty h3 {
        margin: 0 0 6px;
        color: var(--pc-ink-900);
        font-size: 14px;
      }

      .business-empty p {
        margin: 0 0 14px;
      }
    }
  }
}

.priceDiag {
  margin: var(--pc-space-24) 0 56px;
  border: 1px dashed var(--pc-ink-200);
  padding: 48px var(--pc-space-16) 32px;
  background: var(--pc-ink-50);
  border-radius: var(--pc-r-8);
  height: 250px;
}

.priceBox {
  display: flex;
  flex-direction: column;
  align-items: center;

  .liner {
    margin-top: 35px;
  }

  .linerText {
    margin-top: 10px;
    font-size: 16px;
    line-height: 5.5;
  }

  .priceTitle {
    font-size: 18px;
  }

  .price-tip {
    font-size: 12px;
    color: var(--pc-pos-600);
    line-height: 40px;
  }
}

.priceText {
  color: var(--pc-info-600);
  text-decoration: underline;
}

.price-dialog-meta {
  display: grid;
  gap: 8px;
  margin: 18px 0 0;
  color: var(--pc-ink-700);
  font-size: 13px;
}

.price-dialog-meta i {
  margin-right: 6px;
  color: var(--pc-info-600);
}

.tokenRatio {
  background-color: var(--pc-ink-50);
  padding: var(--pc-space-12);
  border-radius: var(--pc-r-6);
}
</style>
<style lang="scss">
.price-dialog {
  .el-dialog__body {
    background: var(--pc-ink-50);
  }

  .el-dialog__header {
    background: var(--pc-ink-50);
  }
}
</style>
