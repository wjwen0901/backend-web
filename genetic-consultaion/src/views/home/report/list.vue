<template>
  <div>
    <div class="pc-page-title">
      <h2>报告列表</h2>
      <span class="desc">共 {{ totalPage }} 份 · 已打印 {{ printedCount }} · 未打印 {{ unprintedCount }}</span>
    </div>

    <div class="user-container">
      <!-- 状态分段 -->
      <div class="pc-seg" ref="seg">
        <div v-for="t in tabs" :key="t.k"
             class="pc-seg__item"
             :class="{ 'is-active': active === t.k }"
             @click="setTab(t.k, $event)">
          {{ t.label }} <span class="count">{{ t.count }}</span>
        </div>
        <div class="pc-seg__bar" :style="{ width: barW + 'px', transform: 'translateX(' + barX + 'px)' }"></div>
      </div>

      <div class="pc-toolbar">
        <el-input placeholder="请输入条码编号/受检者姓名/手机号" v-model="condition" size="small" class="search-input" @keyup.enter.native="getData">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
        <span class="grow"></span>
        <el-button size="small" icon="el-icon-refresh" @click="getData">刷新</el-button>
      </div>

      <el-table :data="filteredList" size="small" border style="width: 100%;">
        <el-table-column prop="solutionName" label="检测产品" width="200"></el-table-column>
        <el-table-column prop="fileName" label="文件名称"></el-table-column>
        <el-table-column prop="sampleCode" label="条码编号" width="160" align="center" header-align="center"></el-table-column>
        <el-table-column prop="truename" label="受检者" width="100" align="center" header-align="center"></el-table-column>
        <el-table-column prop="cellphone" label="手机号" width="130" align="center" header-align="center"></el-table-column>
        <el-table-column label="上传时间" width="140" align="center" header-align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatDate }}</template>
        </el-table-column>
        <el-table-column label="检测结论" width="90" align="center" header-align="center" v-if="hasIsPositive">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPositive === 1" class="el-tag--pos">阳性</el-tag>
            <el-tag v-else-if="scope.row.isPositive === 0" class="el-tag--neg">阴性</el-tag>
            <span v-else style="color: var(--pc-ink-400);">-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center" header-align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ustate !== undefined" class="el-tag--succ">已打印</el-tag>
            <el-tag v-else class="el-tag--prog">未打印</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row.id)">查看文件</el-button>
            <el-button type="text" size="small" @click="toPrint(scope.row.id)">打印报告</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100, 150]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportList',
  data () {
    return {
      reportList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      condition: '',
      active: 'all',
      barX: 0,
      barW: 0
    }
  },
  computed: {
    printedCount () {
      return this.reportList.filter(r => r.ustate !== undefined).length
    },
    unprintedCount () {
      return this.reportList.filter(r => r.ustate === undefined).length
    },
    posCount () {
      return this.reportList.filter(r => r.isPositive === 1).length
    },
    negCount () {
      return this.reportList.filter(r => r.isPositive === 0).length
    },
    hasIsPositive () {
      return this.reportList.some(r => r.isPositive === 0 || r.isPositive === 1)
    },
    tabs () {
      const base = [
        { k: 'all', label: '全部',   count: this.reportList.length },
        { k: 'unp', label: '未打印', count: this.unprintedCount },
        { k: 'prt', label: '已打印', count: this.printedCount }
      ]
      if (this.hasIsPositive) {
        base.push({ k: 'pos', label: '阳性', count: this.posCount })
        base.push({ k: 'neg', label: '阴性', count: this.negCount })
      }
      return base
    },
    filteredList () {
      let arr = this.reportList
      if (this.active === 'unp') arr = arr.filter(r => r.ustate === undefined)
      else if (this.active === 'prt') arr = arr.filter(r => r.ustate !== undefined)
      else if (this.active === 'pos') arr = arr.filter(r => r.isPositive === 1)
      else if (this.active === 'neg') arr = arr.filter(r => r.isPositive === 0)
      return arr
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('report', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchCondition: this.condition
        }
      }).then(res => {
        this.reportList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
        this.$nextTick(() => this.moveBar())
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    },
    toDetail (id) {
      this.$router.push({ name: 'ReportEdit', params: { reportId: id } })
    },
    toPrint (id) {
      this.axios.get('report/' + id, {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.axios.get('oss/upload/show', {
          params: {
            objectKey: res.data.path,
            bucket: res.data.type,
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          }
        }).then(res1 => {
          window.open(this.axios.defaults.baseURL.includes('https://')
            ? res1.data.replace('http://', 'https://')
            : res1.data)
          this.axios.post('report/callback/print', {}, {
            params: {
              userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
              reportId: id
            }
          }).catch(() => {})
        }).catch(err => { console.log(err) })
      }).catch(err => { console.log(err) })
    },
    setTab (k, ev) {
      this.active = k
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
    }
  },
  filters: {
    stateFilter: function (state) {
      if (state === 0) return '新增'
      if (state === 1) return '已录入'
      if (state === 2) return '无法识别'
      if (state === 3) return '关联知情'
    }
  },
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
  mounted () {
    this.$nextTick(() => this.moveBar())
  }
}
</script>

<style lang="scss" scoped>
/* 大部分容器、segmented、toolbar 样式由 design-system/element-overrides.css 提供 */
.user-container {
  /* 卡片视觉由 #app .user-container 全局规则接管 */
}
.search-input {
  width: 340px;
}
.grow { flex: 1; }
</style>
