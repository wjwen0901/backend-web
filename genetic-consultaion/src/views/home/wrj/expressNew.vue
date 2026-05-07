<template>
  <div class="pc-page">
    <div class="pc-page-title">
      <h2>维汝健 · 快递查询</h2>
      <span class="desc">共 {{ totalPage }} 条快递记录</span>
    </div>
    <div class="user-container">
      <express-list-table
        :list="expressList"
        :page-num.sync="pageNum"
        :page-size.sync="pageSize"
        :total="totalPage"
        @page-change="getExpressList"
        @cancel-success="getExpressList" />
    </div>
  </div>
</template>

<script>
import ExpressListTable from '@/components/ExpressListTable.vue'

export default {
  name: 'WrjExpressNew',
  components: { ExpressListTable },
  data () {
    return {
      expressList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0
    }
  },
  mounted () {
    this.getExpressList()
  },
  methods: {
    getExpressList () {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.axios.get('sf/list', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.expressList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
        loading.close()
      }).catch(err => {
        console.log(err)
        loading.close()
      })
    }
  }
}
</script>
