<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>维汝健</el-breadcrumb-item>
            <el-breadcrumb-item>快递查询</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="express-box">
            <div class="express-table">
                <table class="i-table">
                    <tr class="i-title">
                        <th colspan="2">订单信息</th>
                        <th colspan="2">寄件信息</th>
                        <th colspan="2">收件信息</th>
                        <th colspan="2">操作</th>
                    </tr>
                    <br/>
                    <template v-if="expressList && expressList.length !== 0">
                        <template v-for="(item, index) in expressList">
                        <div :key="index+'&'" class="space"></div>
                        <tr :key="index" class="i-line">
                            <td colspan="2" class="i-line-order">&nbsp;
                                <svg t="1662520533569" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3508" width="16" height="16"><path d="M128 891.663059h768a128 128 0 0 0 128-128V260.336941a128 128 0 0 0-128-128H128A128 128 0 0 0 0 260.336941v503.326118a128 128 0 0 0 128 128z m83.425882-475.376941v281.178353c0 31.051294-57.705412 31.171765-57.705411 0V334.697412c0-21.202824 7.589647-31.051294 22.64847-31.834353 12.137412-0.632471 25.057882 5.692235 38.701177 24.244706l202.390588 275.365647v-272.323765c0-37.255529 55.898353-37.225412 55.898353 0v362.767059c0 18.100706-7.559529 26.383059-22.648471 27.196235-13.673412 0.722824-24.786824-6.746353-36.261647-22.64847L211.425882 416.286118z m292.352 149.62447c0-213.232941 272.022588-212.781176 272.022589 0 0 206.667294-272.022588 208.956235-272.022589 0z m52.555294 0c0 128.813176 165.586824 133.782588 165.586824 0 0-73.667765-40.749176-103.695059-83.245176-102.912-42.496 0.783059-82.341647 32.406588-82.341648 102.912z m285.093648 97.249883c15.872 0 28.822588 12.950588 28.822588 28.822588s-12.950588 28.822588-28.822588 28.822588-28.822588-12.950588-28.822589-28.822588 12.950588-28.822588 28.822589-28.822588z" fill="#01806f" p-id="3509"></path></svg>
                                快递单号：{{item.express.expressCode}}</td>
                            <td colspan="2">
                                寄出时间：
                            <svg t="1662445086457" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13873" width="16" height="16"><path d="M827.871087 196.128913C743.498468 111.756293 631.321596 65.290005 512 65.290005c-119.319549 0-231.499491 46.465265-315.871087 130.837884S65.290005 392.680451 65.290005 512s46.465265 231.499491 130.837884 315.871087 196.551538 130.837884 315.871087 130.837884c119.321596 0 231.499491-46.465265 315.871087-130.837884S958.708971 631.319549 958.708971 512 912.243707 280.500509 827.871087 196.128913zM531.556405 917.246651l0-74.145697c0-11.31572-9.174963-20.491707-20.491707-20.491707-11.316743 0-20.491707 9.174963-20.491707 20.491707l0 74.059739C283.276738 906.322857 116.693746 739.164766 106.755396 531.634176l72.351841 0c11.31572 0 20.491707-9.174963 20.491707-20.491707 0-11.31572-9.174963-20.491707-20.491707-20.491707l-72.273047 0c10.769274-206.737528 177.01253-373.005342 383.740848-383.813502l0 72.346725c0 11.316743 9.174963 20.491707 20.491707 20.491707 11.31572 0 20.491707-9.17394 20.491707-20.491707L531.558451 106.752326c207.593012 9.901511 374.807385 176.539762 385.609405 383.89946l-74.142627 0c-11.316743 0-20.491707 9.174963-20.491707 20.491707 0 11.316743 9.174963 20.491707 20.491707 20.491707l74.220399 0C907.275555 739.78796 739.720422 907.317511 531.556405 917.246651z" p-id="13874" fill="#5c5c5c"></path><path d="M532.098757 503.118726 532.098757 258.240529c0-11.316743-9.174963-20.491707-20.491707-20.491707-11.31572 0-20.491707 9.17394-20.491707 20.491707l0 254.66612c0 7.858992 4.429893 14.677281 10.924817 18.114566L693.447539 722.42757c4.002151 4.000104 9.245572 6.001691 14.490016 6.001691s10.487865-2.001587 14.490016-6.001691c8.002254-8.002254 8.002254-20.977777 0-28.980032L532.098757 503.118726z" p-id="13875" fill="#5c5c5c"></path></svg>
                                {{item.express.createTime | formatDate}}
                            </td>
                            <td colspan="3"></td>
                            <td class="detail">
                            </td>
                        </tr>
                        <tr :key="index+'%'" class="i-box">
                            <td colspan="2" class="order">
                                订单编号：{{item.order.orderNo ? item.order.orderNo : item.order.tid}}
                                <br/>
                                患者姓名：{{item.patientName}}
                                <br/>
                                样本编号：{{item.sampleCode}}
                            </td>
                            <td colspan="2">
                                <template v-if="item.sender">
                                    <svg t="1662519787779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1723" width="16" height="16"><path d="M925.6 559.2L152 145.6c-11.2-5.6-24.8 3.2-23.2 15.2l60 714.4c0.8 11.2 12 17.6 22.4 13.6L460.8 784l136.8 155.2c8.8 9.6 24 5.6 27.2-6.4l65.6-245.6 235.2-99.2c11.2-5.6 12-22.4 0-28.8z m-328 305.6l-72-128-368-568 488 504-48 192z" p-id="1724" fill="#01806f"></path></svg>
                                    {{item.sender.receiver}}&nbsp;&nbsp;&nbsp;{{item.sender.cellphone}}<br/>
                                    {{item.sender.province}}{{item.sender.city}}{{item.sender.county}}{{item.sender.address}}
                                </template>
                                <template v-else>
                                    ——
                                </template>
                            </td>
                            <td colspan="2">
                                <template v-if="item.receiver">
                                    <svg t="1662519911022" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3003" width="16" height="16"><path d="M829.44 921.6h-116.053333c-20.48 0-34.133333-13.653333-34.133334-34.133333s13.653333-34.133333 34.133334-34.133334h116.053333c13.653333 0 23.893333-10.24 23.893333-23.893333v-116.053333c0-20.48 13.653333-34.133333 34.133334-34.133334s34.133333 13.653333 34.133333 34.133334v116.053333c0 51.2-40.96 92.16-92.16 92.16zM887.466667 344.746667c-20.48 0-34.133333-13.653333-34.133334-34.133334V194.56c0-13.653333-10.24-23.893333-23.893333-23.893333h-116.053333c-20.48 0-34.133333-13.653333-34.133334-34.133334s13.653333-34.133333 34.133334-34.133333h116.053333C880.64 102.4 921.6 143.36 921.6 194.56v116.053333c0 20.48-13.653333 34.133333-34.133333 34.133334zM136.533333 344.746667c-20.48 0-34.133333-13.653333-34.133333-34.133334V194.56C102.4 143.36 143.36 102.4 194.56 102.4h116.053333c20.48 0 34.133333 13.653333 34.133334 34.133333s-13.653333 34.133333-34.133334 34.133334H194.56c-10.24 0-23.893333 10.24-23.893333 23.893333v116.053333c0 20.48-13.653333 34.133333-34.133334 34.133334zM314.026667 921.6H194.56C143.36 921.6 102.4 880.64 102.4 829.44v-116.053333c0-20.48 13.653333-34.133333 34.133333-34.133334s34.133333 13.653333 34.133334 34.133334v116.053333c0 13.653333 13.653333 23.893333 23.893333 23.893333h116.053333c20.48 0 34.133333 13.653333 34.133334 34.133334s-13.653333 34.133333-30.72 34.133333z" fill="#01806f" p-id="3004" data-spm-anchor-id="a313x.7781069.0.i12" class="selected"></path><path d="M314.026667 344.746667h37.546666v163.84c0 3.413333 0 6.826667 3.413334 10.24 3.413333 3.413333 6.826667 3.413333 17.066666 3.413333h54.613334V334.506667h37.546666v354.986666h-37.546666v-129.706666h-71.68c-13.653333 0-23.893333-3.413333-30.72-13.653334-3.413333-6.826667-6.826667-13.653333-6.826667-23.893333v-177.493333z m174.08 109.226666v-37.546666c6.826667-3.413333 13.653333-6.826667 17.066666-13.653334 3.413333-6.826667 10.24-27.306667 17.066667-54.613333l3.413333-13.653333h40.96l-6.826666 23.893333h139.946666v37.546667H682.666667c-3.413333 44.373333-6.826667 78.506667-13.653334 105.813333-10.24 34.133333-23.893333 68.266667-44.373333 98.986667 17.066667 20.48 44.373333 37.546667 75.093333 47.786666v40.96c-20.48-6.826667-37.546667-13.653333-47.786666-20.48-17.066667-10.24-34.133333-23.893333-51.2-40.96-17.066667 17.066667-34.133333 27.306667-47.786667 37.546667-13.653333 6.826667-30.72 17.066667-54.613333 23.893333V648.533333c13.653333-6.826667 23.893333-10.24 34.133333-13.653333 13.653333-6.826667 30.72-20.48 44.373333-34.133333-20.48-30.72-30.72-58.026667-40.96-85.333334-6.826667-20.48-10.24-40.96-13.653333-64.853333h37.546667c3.413333 23.893333 10.24 44.373333 13.653333 61.44 3.413333 13.653333 6.826667 23.893333 10.24 30.72 3.413333 6.826667 6.826667 17.066667 17.066667 27.306667 10.24-20.48 17.066667-34.133333 23.893333-44.373334 10.24-30.72 17.066667-71.68 20.48-126.293333h-92.16c-6.826667 17.066667-13.653333 27.306667-17.066667 34.133333-6.826667 6.826667-13.653333 13.653333-20.48 17.066667-13.653333 0-20.48 3.413333-27.306666 3.413333z" fill="#FFAF00" p-id="3005"></path></svg>
                                    {{item.receiver.receiver}}&nbsp;&nbsp;&nbsp;{{item.receiver.cellphone}}<br/>
                                    {{item.receiver.province}}{{item.receiver.city}}{{item.receiver.county}}{{item.receiver.address}}
                                </template>
                                <template v-else>
                                    ——
                                </template>
                            </td>
                            <td colspan="2">
                                <el-button type="text" size="small" @click="toExpress(item)">查看物流</el-button>
                                <el-button type="text" size="small" @click="confirmCancel(item.express.expressCode)">取消物流</el-button>
                            </td>
                        </tr>
                    </template>
                    </template>         
                    <tr v-if="!expressList || expressList.length === 0" >
                        <td colspan="8">
                            <el-empty description="暂无数据"></el-empty>
                        </td>
                  </tr>
                </table>
                <div class="page-box">
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
        </div>

        <!-- 物流详情-->
        <el-dialog title="物流详情" :visible.sync="dialogEditFormVisible">
            <div>
                <div class="wrapper">
                    <div class="from-to">
                        <div v-if="express.sender">{{express.sender.city}}</div>
                        <svg t="1582010962554" class="icon" viewBox="0 0 6997 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24477" width="280" height="280"><path d="M876.159 647.79v131.836h5258.013l-502.427-552.788-97.559 88.726 301.904 332.227z" p-id="24478" fill="#8a8a8a"></path></svg>
                        <div v-if="express.receiver">{{express.receiver.city}}</div>
                    <div class="state" v-if="!express.route">等待快递小哥接单</div>
                    </div>
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
</template>

<script>
import {compareDate} from '../../../utils/sortDate'
export default {
  data(){
    return {
        expressList:[],//列表数据
        pageNum: 1,
        pageSize: 20,
        totalPage: 0,
        express: {},
        routeList: [],
        dialogEditFormVisible: false,
        reverse: true,
    }
  },
  watch:{},
  mounted(){
    this.getExpressList()
  },
  methods: {
    /**获取列表 */
    getExpressList(){
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
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
            condition: this.condition
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
    },
    /**分页 */
    handleSizeChange (val) {
      this.pageSize = val
      this.getExpressList()
    },
    /**分页 */
    handleCurrentChange (val) {
      this.pageNum = val
      this.getExpressList()
    },
    /**查看物流 */
    toExpress (express) {
      if(!express.receiver.cellphone || !express.express.expressCode){
        this.$message.warning("单号或者手机号不能为空")
        return
      }
      this.axios.get('/sf/route', {
        params: {
          mailno: express.express.expressCode,
          subPhone: express.receiver.cellphone.substr(express.receiver.cellphone.length-4,4)
        }
      }).then(res => {
        this.express = res.data
        this.express.route = JSON.parse(res.data.route)
        this.express.route.mailno = express.express.expressCode
        const mailTemp = (res.data.route.routeResps)[0].routes
        this.routeList = mailTemp.sort(compareDate('acceptTime', 'inverted'))
      })
      this.dialogEditFormVisible = true
    },
    /**取消物流弹窗 */
    confirmCancel(val){
        this.$confirm('是否确定取消物流?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.cancelExpress(val)
        }).catch(() => {
          console.log('已取消操作')         
        });
    },
    /**取消物流 */
    cancelExpress(expressNo) {
      this.axios.delete('/sf/order', {
        params: {
          expressNo: expressNo
        }
      }).then(res => {
        if (res.data == 'failure') {
          this.$message({message: '取消失败，请重试或等待快递小哥联系',type: 'warning'})
        } else {
          this.$message({message: '取消成功',type: 'success'})
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
 .express-box{
    display: flex;
    flex-direction: column;
    background: white;
    padding: 20px;
    margin-top: 30px;
    .express-table{
        margin-top: 20px;
        .i-table{
            width: 100%;
            border-spacing: 0;
            text-align: center;
            table-layout:fixed;
            font-size: 13px;
            border-collapse:collapse;
            color: #5c5c5c;
            svg{
                transform: translateY(2px);
            }
            /* TODO(Sprint 2): 与 brca/expressNew 双胞胎复制；待抽 <ExpressListTable> 共享组件 */
            .i-title{
                background: var(--pc-ink-50);
                color: var(--pc-ink-600);
                font-weight: 600;
                line-height: 3;
                border-bottom: 1px solid var(--pc-ink-200);
            }
            .i-line{
                background: #f5f6f9;
                height: 40px;
                text-align: left;
                .detail{
                    text-align: right;
                    transform: translateX(-20px);
                }
                .i-line-order{
                    svg{
                        transform: translateY(3px);
                    }
                }
            }
            .space{
                height: 10px;
            }
            .i-box{
                min-height: 60px;
                td{
                    border:1px solid #f5f6f9;
                    padding: 8px;
                    line-height: 1.5;
                }
                .order{
                    text-align: left;
                    
                }
            }
        }
        .page-box{
            text-align: right;
            margin: 40px 0;
        }
    }
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
            .name {
                padding-left: 40px;
                font-size: 14px;
            }
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
<style lang="scss">
</style>