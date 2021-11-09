<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>知情管理</el-breadcrumb-item>
      <el-breadcrumb-item>知情列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div>
        <el-button class="add-solution" size="small" type="primary" @click="toExport">导出</el-button>
        <div class="search-box">
          <el-input placeholder="请输入条码编号/受检者姓名/手机号" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        @selection-change="handleSelectionChange"
        :data="informedList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          fixed
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column
          prop="sampleCode"
          label="条码编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="truename"
          label="受检者姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="上传时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fullName"
          label="上传人姓名">
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="上传人联系电话">
        </el-table-column>
        <el-table-column
          prop="group"
          label="所属分组">
        </el-table-column>
        <el-table-column
          prop="solutionName"
          label="检测项目">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="实验室">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === 0">{{scope.row.state | stateFilter}}</el-tag>
            <el-tag v-else-if="scope.row.state === 1" type="info">{{scope.row.state | stateFilter}}</el-tag>
            <el-tag v-else-if="scope.row.state === 2" type="danger">{{scope.row.state | stateFilter}}</el-tag>
            <el-tag v-else-if="scope.row.state === 3" type="success">{{scope.row.state | stateFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row.id,scope.row.groupId,scope.row.sampleCode)" type="text" size="small">编辑</el-button>
            <el-button @click="toAllDetail(scope.row)" type="text" size="small">查看病理信息</el-button>
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
  components: {},
  name: 'InformedUpload',
  data () {
    return {
      informedList: [],
      multipleSelection: [],
      pageNum: window.sessionStorage.informedPageNum === undefined ? 1 : window.sessionStorage.informedPageNum,
      pageSize: window.sessionStorage.informedPageSize === undefined ? 20 : parseInt(window.sessionStorage.informedPageSize),
      totalPage: 0,
      condition: ''
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('informed', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchCondition: this.condition
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
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.informedPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.informedPageNum = val
      this.getData()
    },
    toDetail (id,groupId,sampleCode) {
      this.$router.push({
        path:'/informed/edit/'+id,
        query: { informedId: id,groupId: groupId,sampleCode:sampleCode }
      })
      // this.$router.push({
      //   name: 'InformedEdit',
      //   params: { informedId: id,groupId: groupId,sampleCode:sampleCode }
      // })
      _hmt.push(['_trackEvent', '知情同意', '编辑', 'informedId', id]);
    },
    toAllDetail (item) {
      this.$router.push({
        name: 'InformedAll',
        params: { sampleNo: item.sampleCode }
      })
    },
    toExport () {
      let informedIds = []
      this.multipleSelection.forEach(item => {
        informedIds.push(item.id)
      })
      this.axios.get('informed/export?informedIds=' + informedIds + '&userId=' + window.localStorage.userId, {
        responseType:"blob"
      }).then(response => {
        const blob = new Blob(
          [response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const aEle = document.createElement('a');     // 创建a标签
        const href = window.URL.createObjectURL(blob);       // 创建下载的链接
        aEle.href = href;
        const today = new Date();
        aEle.download = "知情同意-" + today.getFullYear() + '-'+ (today.getMonth()+1)+ '-' + today.getDate() + ".xls";  // 下载后文件名
        document.body.appendChild(aEle);
        aEle.click();     // 点击下载
        document.body.removeChild(aEle); // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }).catch(err => {
        console.log(err)
      })
    },
    handleSelectionChange (value) {
      this.multipleSelection = value
    },
  },
  filters: {
    stateFilter: function (state) {
      if (state === 0) return '新增'
      if (state === 1) return '已录入'
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
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .search-box {
      width: 400px;
      float: right;
      margin-bottom: 10px;
    }
  }
</style>
