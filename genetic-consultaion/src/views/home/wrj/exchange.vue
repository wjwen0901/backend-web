<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
      <el-breadcrumb-item>积分兑换</el-breadcrumb-item>
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
          label="兑换商品"
          width="240"
          prop="rewardName"
        >
        </el-table-column>
        <el-table-column
          label="申请时间"
          width="160">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          width="160">
          <template slot-scope="scope">
            {{scope.row.updateTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="快递单号"
          width="160">
          <template slot-scope="scope">
            （{{scope.row.mailName}}）{{scope.row.mailNo}}
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
          prop="statusStr"
          label="状态"
          width="100">
          <template slot-scope="scope">
            <el-tag size="mini" :class="tagClassOf(scope.row.statusStr)" disable-transitions>{{ scope.row.statusStr || '—' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="toExpress(scope.row)" type="text" size="small">绑定物流</el-button>
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

      <el-dialog title="绑定物流信息" :visible.sync="dialogExpressFormVisible">
        <div>
          <h4>收件人信息</h4>
          <p v-if="expressItem.receiver">地址：：{{expressItem.receiver.province}}{{expressItem.receiver.city}}{{expressItem.receiver.county}}{{expressItem.receiver.address}}</p>
          <div v-if="expressItem.riceRewardId != 9">
            <h4>礼品寄送快递</h4>
            <el-form ref="form" :model="expressItem" label-width="80px">
              <el-form-item label="快递方式">
                <el-input v-model="expressItem.mailName"></el-input>
              </el-form-item>
              <el-form-item label="快递单号">
                <el-input type="text" v-model="expressItem.mailNo"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onExpressSubmit">确定</el-button>
                <el-button @click="dialogExpressFormVisible = false">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            <h4>生成折扣券</h4>
            <el-form ref="form" :model="expressItem" label-width="80px">
              <el-form-item label="输入折扣">
                <el-input type="number" v-model="expressItem.discount"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onExpressSubmit">确定</el-button>
                <el-button @click="dialogExpressFormVisible = false">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>

import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { tagClassOf } from '@/utils/pc'
export default {
  components: {},
  name: 'UserList',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      express: {},
      dialogExpressFormVisible: false,
      condition: null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      reverse: true,
      expressItem: {},
    }
  },
  methods: {
    tagClassOf,
    _initData () {
      this.getData()
    },
    getData () {
      this.resourceList = []
      this.axios.get('rice/list', {
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
    onExpressSubmit () {

      this.expressItem.operatorId = this.userId
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      if (this.expressItem.riceRewardId != 9) {
        instance({
          method: 'post',
          url: 'rice/confirm',
          data: this.expressItem,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          _this.$message({
            message: '提交成功',
            type: 'success'
          })
          _this._initData()
          _this.dialogExpressFormVisible = false
        })

      } else {
        instance({
          method: 'post',
          url: 'cashout/discount',
          data: {
            userId: this.expressItem.userId,
            discount: this.expressItem.discount,
            productId: 1901,
          },
          params:{
            count: 1
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (res.data.length == 10) {
            _this.expressItem.mailName = '安易筛0.0001折扣码'
            _this.expressItem.mailNo = res.data
            instance({
              method: 'post',
              url: 'rice/confirm',
              data: this.expressItem,
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
              }
            }).then(function (response) {
              _this.$message({
                message: '提交成功',
                type: 'success'
              })
              _this._initData()
              _this.dialogExpressFormVisible = false
            })
          } else {
            // @ts-ignore
            this.$toast.fail('券面限额为' + this.discountMap.product.max + '元');
          }
        })
      }
    },
    toExpress (express) {
      this.expressItem = express
      this.expressItem.discount = 0.0001
      this.dialogExpressFormVisible = true
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
