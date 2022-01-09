<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
      <el-breadcrumb-item>发票记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div>
<!--        <el-button class="add-user" size="small" type="primary" @click="toAdd">新增</el-button>-->
      </div>
      <el-table
        :data="list"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          label="订单信息"
          width="240"
        >
          <template slot-scope="scope">
            <p>订单编号：{{scope.row.order.orderNo ? scope.row.order.orderNo : scope.row.order.tid}}</p>
            <p>患者姓名：{{scope.row.patientName}}</p>
            <p>样本编号：{{scope.row.sampleCode}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="寄出时间"
          width="160">
          <template slot-scope="scope">
            {{scope.row.express.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="快递单号"
          width="160">
          <template slot-scope="scope">
            {{scope.row.express.expressCode}}
          </template>
        </el-table-column>
        <el-table-column
          label="寄件人">
          <template slot-scope="scope">
            <p>寄件人：{{scope.row.sender.receiver}}&emsp;&emsp;{{scope.row.sender.cellphone}}</p>
            <p>地址：：{{scope.row.sender.province}}{{scope.row.sender.city}}{{scope.row.sender.county}}{{scope.row.sender.address}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="收件人">
          <template slot-scope="scope">
            <div v-if="scope.row.receiver">
              <p>收件人：{{scope.row.receiver.receiver}}&emsp;&emsp;{{scope.row.receiver.cellphone}}</p>
              <p>地址：：{{scope.row.receiver.province}}{{scope.row.receiver.city}}{{scope.row.receiver.county}}{{scope.row.receiver.address}}</p>
            </div>
          </template>
        </el-table-column>


        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="toExpress(scope.row)" type="text" size="small">查看物流</el-button>
            <el-button @click="cancelExpress(scope.row.express.expressCode)" type="text" size="small">取消物流</el-button>
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

      <el-dialog title="物流详情" :visible.sync="dialogEditFormVisible">
        <div>

          <div class="wrapper">
            <div class="from-to">
              <div class="from" v-if="express.sender">{{express.sender.city}}</div>
              <svg t="1582010962554" class="icon" viewBox="0 0 6997 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24477" width="280" height="280"><path d="M876.159 647.79v131.836h5258.013l-502.427-552.788-97.559 88.726 301.904 332.227z" p-id="24478" fill="#8a8a8a"></path></svg>
              <div class="to" v-if="express.receiver">{{express.receiver.city}}</div>
              <div class="state" v-if="!express.route">等待快递小哥接单</div>
            </div>
            <!-- && express.route.mailno-->
            <div class="infos" v-if="express.route">
              <div class="title">运单编号： {{express.route.mailno}}</div>
              <el-timeline :reverse="reverse">
                <el-timeline-item
                  v-for="(item, index) in routeList"
                  :key="index"
                  :timestamp="item.acceptTime">
                  {{item.remark}}
                </el-timeline-item>
              </el-timeline>
              </div>

          </div>

        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>

import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import {compareDate} from '../../../utils/sortDate'
export default {
  components: {},
  name: 'UserList',
  data () {
    return {
      list: [],
      routeList:[],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      express: {},
      dialogEditFormVisible: false,
      condition: null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      reverse: true,
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.resourceList = []
      this.axios.get('sf/list', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          condition: this.condition
        }
      }).then(res => {
        this.list = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
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
    toExpress (express) {
      this.axios.get('/sf/route', {
        params: {
          mailno: express.express.expressCode,
          subPhone: express.receiver.cellphone.substr(express.receiver.cellphone.length-4,4)
        }
      }).then(res => {
        this.express = res.data
        this.express.route = JSON.parse(res.data.route)
        const mailTemp = (res.data.route.routeResps)[0].routes
        this.routeList = mailTemp.sort(compareDate('acceptTime', 'inverted'))
        // if (this.express.route.Head === 'OK') {
        //   if (JSON.stringify(this.express.route.Body.RouteResponse).indexOf('[') == -1) {
        //     let routes = []
        //     routes.push(this.express.route.Body.RouteResponse.Route)
        //     console.log(routes)
        //     this.express.route.Body.RouteResponse.Route = routes
        //   }
        //   this.express.route = this.express.route.Body.RouteResponse
        // }
      })
      this.dialogEditFormVisible = true
    },
    cancelExpress (expressNo) {
      let that = this
      that.axios.delete('/sf/order', {
        params: {
          expressNo: expressNo
        }
      }).then(res => {
        if (res.data == 'failure') {
          this.$message({
            message: '取消失败，请重试或等待快递小哥联系',
            type: 'fail'
          })
        } else {
          this.$message({
            message: '取消成功',
            type: 'success'
          })
        }
      })
    },
  },

  watch: {
    '$route' (to, from) {
      if (this.$route.params.role) {
        this.getData()
      }
    }
  },
  filters: {
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
  },
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .search-box {
    }
    .opera-box {
      padding-bottom: 20px;
    }
  }
  .is-parent {
    margin-bottom: 5px;
    display: block;
    font-weight: bolder;
  }
  .sec-info {
    display: inline-block;
    padding-left: 10px;
    font-weight: normal;
  }
  .add-user {
    margin-bottom: 10px;
  }
  .search-box {
    width: 400px;
    float: right;
    margin-bottom: 10px;
  }
  .width-100-p {
    width: 100%;
  }
  .wrapper{
    min-height: 100%;
    font-size:12px;
    background:#f1f1f1;
    .infos {
      position: relative;
      padding: 10px 20px;
      background: #fff;

      .title {
        position: relative;
        margin-bottom: 20px;
        font-size: 14px;
        padding-left: 40px;
        font-weight: 500;
      }
      .btns {
        position: absolute;
        top: 0;
        right: 0;
        text-align: center;
        button {
          margin-left: 10px;
          float: left;
          width: 50px;
          height: 26px;
          background: rgba(165,209,92,.3);
          color: rgba(47,109,52,1);
          border: none;
          border-radius: 10px;
        }
        button.active {
          background: rgba(165,209,92,1);
          color: rgba(255,255,255,.8);
        }
      }



    }
    /*.tips {*/
    /*    text-align: center;*/
    /*    margin-top: 10px*/
    /*}*/
    .address {
      margin-top: 20px;
      .title {
        .name {
          padding-left: 40px;
          font-size: 14px;
        }
        .icon {

        }

      }
      .infos {
        margin-top: -9px;
        .title {
          font-size: 14px;
          padding-left: 20px;

        }
        .info {
          color: #777777;
        }
      }
    }
    .item {
      position: relative;
      margin-bottom: 5px;
      width: 100%;
      height: 70px;
      background: #fff;
      padding: 10px 10px 10px 40px;
      svg {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translate(0%,-50%);
      }
      .infos {
      }

    }
    .item .price {
      position: absolute;
      left: 20px;
      top: 20px;
      font-size: 20px;
      line-height: 40px;
      z-index: 1;
    }
    .cancel {
      margin-top: 10px;
      text-align: center;
      .nut-button {
        margin: 40px auto;
        width: calc(100% - 80px);
        height: 60px;
        padding: 0 10px;
        display: block;
        border: 1px solid #fff;
        background: rgb(40,95,40);
        border-radius: 30px;
        color: #fff;
      }
    }
    .from-to {
      position: relative;
      display: flex;
      padding: 20px 40px;
      justify-content: space-around;
      font-size: 18px;
      line-height: 64px;
      box-shadow: 0px 0px 10px #f1f1f1;
      background: #fff;
      .state {
        position: absolute;
        top: 0px;
        font-size: 12px;
        color: #555;
      }
      svg {
        width: 180px;
        height: 55px;
      }
    }

  }
</style>
