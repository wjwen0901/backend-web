<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>易见康</el-breadcrumb-item>
      <el-breadcrumb-item>报告列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <el-table
        :data="list"
        size="mini"
        border
        lazy
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              v-if="props.row.reportList"
              :data="props.row.reportList"
              size="mini"
              border
              :default-sort = "{prop: 'sample', order: 'descending'}"
              style="width: 100%">
              <el-table-column
                prop="sample"
                label="样本编号"
                width="180">
              </el-table-column>
              <el-table-column
                prop="pName"
                label="姓名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="gender"
                label="性别">
                <template slot-scope="scope">
                  {{scope.row.gender == 'M' ? '男' : '女'}}
                </template>
              </el-table-column>
              <el-table-column
                prop="age"
                label="年龄">
              </el-table-column>
              <el-table-column
                prop="modifyTime"
                label="分析状态">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.reportState === 'ann'" type="warning">{{scope.row.reportState | stateFilter}}</el-tag>
                  <el-tag v-if="scope.row.reportState !== 'ann'" type="success">{{scope.row.reportState | stateFilter}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="modifyTime"
                label="修改时间">
                <template slot-scope="scope">
                  {{scope.row.modifyTime | formatDate}}
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button @click="toDownPDF(scope.row.reportId)" type="text" size="small" :disabled="scope.row.reportState === 'ann'">下载PDF</el-button>
                  <el-button @click="toDownJSON(scope.row.reportId, scope.row.sample)" type="text" size="small" :disabled="scope.row.reportState === 'ann'">下载JSON</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileName"
          label="文件名"
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
          label="样本数量">
          <template slot-scope="scope" >
            <span v-if="scope.row.reportList">{{scope.row.reportList.length}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="分析状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.reportList && scope.row.reportList[scope.row.reportList.length-1].reportState === 'ann'" type="warning">{{scope.row.reportList[scope.row.reportList.length-1].reportState | stateFilter}}</el-tag>
            <el-tag v-if="scope.row.reportList && scope.row.reportList[scope.row.reportList.length-1].reportState !== 'ann'" type="success">{{scope.row.reportList[scope.row.reportList.length-1].reportState | stateFilter}}</el-tag>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          fixed="right"-->
<!--          label="操作"-->
<!--          width="100">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button @click="toDetail(scope.row.id)" type="text" size="small">查看</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
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
import FileSaver from 'file-saver'
import { Loading } from 'element-ui';
export default {
  components: {},
  name: 'InformedUpload',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      condition: ''
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('release/zip/report', {
        params: {
          companyId: window.localStorage.companyId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchCondition: this.condition,
          userId: window.localStorage.userId
        }
      }).then(res => {
        this.list = res.data
        // this.pageSize = res.data.pageSize
        // this.pageNum = res.data.pageNum
        // this.totalPage = res.data.total
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
    toDownPDF (id) {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.axios.get('report/' + id,{
        params: {
          userId: window.localStorage.userId
        }
      }).then(res => {
        this.report = res.data
        console.log(res.data.type)
        this.axios.get('oss/upload/show', {
          params: {
            objectKey: res.data.path,
            bucket: res.data.type,
            userId: window.localStorage.userId
          }
        }).then(res1 => {
          window.open(this.axios.defaults.baseURL.includes('https://')
            ? res1.data.replace('http://', 'https://') : res1.data, '_blank')
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    toDownJSON (id, sample) {
      let loadingInstance = Loading.service({ fullscreen: true, text: '数据比较大，请耐心等候'});
      this.axios.get('report/' + id, {
        params: {
          userId: window.localStorage.userId
        }
      }).then(res => {
        this.report = res.data
        console.log(this.report)
        let ObjectId = this.report.fileName.split('.')[0]

        this.axios.get('analyse/json/' + ObjectId, {
          params: {
            userId: window.localStorage.userId
          }
        }).then(res1 => {
          const blob = new Blob([JSON.stringify(res1.data)], {type: ''})
          FileSaver.saveAs(blob, sample + '.json')
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  filters: {
    stateFilter: function (state) {
      if (state === 'ann') {
        return '分析中'
      } else {
        return '报告完成'
      }
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
  .user-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
</style>
