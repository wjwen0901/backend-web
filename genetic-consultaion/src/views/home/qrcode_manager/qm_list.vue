<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>二维码管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="qrcode-box">
        <div class="select-right">
            <el-select v-model="subscripType" filterable placeholder="请选择公众号查询" @change="getData">
              <el-option v-for="item in subscripTypeArr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
            </el-select>
            <div class="search-box">
              <el-input placeholder="请输入申请人查询" v-model="keyword" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
              </el-input>
            </div>
        </div>
        <el-table :data="tableData" border size="mini" style="width: 100%">
            <el-table-column fixed prop="subscripType" label="公众号" width="150"> </el-table-column>
            <el-table-column prop="fullName" label="申请人" width="120"></el-table-column>
            <el-table-column prop="createTime" label="申请时间"  width="200">
              <template slot-scope="scope">
                {{scope.row.createTime | formatDate}}
              </template>
            </el-table-column>
            <el-table-column prop="scanNo" label="访问次数" width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="toDetailList(scope.row)">{{scope.row.scanNo}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="描述" width="300"></el-table-column>
            <el-table-column  label="操作" width="300">
                <template slot-scope="scope">
                    <el-button @click="getQrcode(scope.row)" type="text" size="small">下载二维码</el-button>
                    <el-button @click="open(scope.row)" type="text" size="small">查看链接</el-button>
                    <el-button type="text" size="small" @click="toEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
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
    <el-dialog title="查看二维码链接" :visible.sync="dialogVisible" width="50%">
      <span>{{codeUrl}}</span>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="copy" class="tag-read" v-bind:data-clipboard-text="codeUrl">一键复制</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Clipboard from 'clipboard';  
  export default {
    name:'qm_list',
    data() {
      return {
        tableData: [],
        pageNum: 1,
        pageSize:10,
        totalPage: 0,
        keyword:null,
        subscripType:null,
        subscripTypeArr:[{name:'易得好康',value:'mdhcare'},{name:'易见康',value:'ru6c'},{name:'见山会诊',value:'gensultation'},{name:'测试',value:'test'}],
        dialogVisible: false,
        codeUrl:''
      }
    },
    methods: {
      _initData () {
        this.getData();
      },
      getData(){
        this.axios.get('wechat/qrcode/page', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            keyword: this.keyword,
            subscripType: this.subscripType
          }
        }).then(res => {
          this.tableData=res.data.list;
          this.pageSize = res.data.pageSize;
          this.pageNum = res.data.pageNum;
          this.totalPage = res.data.total;
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
      getQrcode(row){
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'post',
          url: 'barcode/createWechat',
          params: {
            qrcodeId : row.id,
            subscripType : row.subscripType?row.subscripType:'mdhcare',
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (res) {
          window.open(_this.axios.defaults.baseURL + '/barcode/down?isPatientCode=false&filename=' + res.data + '&Authorization=' + window.localStorage.token)
        })
      },
      toDetailList(row){
        this.$router.push({name:'DetailList',query:{qrcodeId:row.id,subscripType:row.subscripType}})
      },
      toEdit(row){
        this.$router.push({name:'QmEdit',query:{qrcodeId:row.id}})
      },
      open(row) {
        this.codeUrl=row.codeUrl;
        this.dialogVisible=true;
      },
      copy(done) {
        this.dialogVisible=false;
        var clipboard = new Clipboard('.tag-read')  
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
}
</style>