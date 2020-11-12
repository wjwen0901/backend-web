<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>详情列表管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="qrcode-box">
        <el-table :data="tableData" border size="mini" style="width: 100%">
            <el-table-column prop="subscripType" label="公众号" width="150"></el-table-column>
            <el-table-column prop="wechatUserLog.createTime" label="访问时间"  width="200">
              <template slot-scope="scope">
                {{scope.row.wechatUserLog.createTime | formatDate}}
              </template>
            </el-table-column>
            <el-table-column prop="nickname" label="微信昵称" width="120"></el-table-column>
            <el-table-column prop="headimgurl" label="微信头像" width="120">
              <template slot-scope="scope">
                  <!-- <el-avatar :src="scope.row.headimgurl"></el-avatar> -->
                  <img v-bind:src='scope.row.headimgurl' alt="" class='avatar'>
              </template>
            </el-table-column>
            <el-table-column prop="subscribeTime" label="关注时间"  width="200">
              <template slot-scope="scope">
                {{scope.row.subscribeTime*1000 | formatDate}}
              </template>
            </el-table-column>
            <el-table-column prop="sampleNum" label="样本数量" width="100"></el-table-column>
            <el-table-column prop="wechatUserLog.openId" label="openid" width="300"></el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name:'detail_list',
    data(){
      return {
        tableData: [],
        qrcodeId:this.$route.query.qrcodeId,
        subscripType:this.$route.query.subscripType,
        pageNum: 1,
        pageSize:10,
        totalPage: 0,
      }
    },
    methods: {
      _initData () {
        this.getData();
      },
      getData(){
        this.axios.get('wechat/qrcode/scanlog/page', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            qrcodeId : this.qrcodeId ,
          }
        }).then(res => {
          var that=this;
          res.data.userLogs.forEach(function(item){
            item.subscripType=that.subscripType;
          });
          this.tableData=res.data.userLogs;
          this.totalPage = res.data.totalNum;
        }).catch(err => {
          // console.log(err)
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        // window.sessionStorage.orderPageSize = val
        this.getData()
      },
      handleCurrentChange (val) {
        this.pageNum = val
        // window.sessionStorage.orderPageNum = val
        this.getData()
      },
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
    filters:{},
    computed:{},
    mounted () {},
    destroyed () {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.qrcode-box{
  margin:20px 0;
  padding: 20px;
  background: #ffffff;
  .select-right{
    float: right;
    margin-bottom: 20px;
  }
  .pagination-box{
    padding: 20px 0 0;
  }
  .search-box {
    width: 400px;
    float: right;
    margin-left:20px;
  }
  .avatar{
    width:80px;
    border-radius: 50%;
  }
}
</style>