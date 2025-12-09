<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="order-box">
      <div class="operate">
        <el-input placeholder="请输入下单人姓名/手机号/检测项目" v-model="condition" size="small" class="input-with-select"
          style="width:400px">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
        <el-button type="warning" size="small" @click="exportData">导出</el-button>
      </div>
      <div class="order-table">
        <table class="i-table">
          <tr class="i-title">
            <th width="80px">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleAllCheck"></el-checkbox>
            <th colspan="2">检测项目</th>
            <th>支付价格</th>
            <th>受检者</th>
            <th>下单人</th>
            <th>订单状态</th>
            <th>积分</th>
            <th colspan="2" width="200px">操作</th>
          </tr>
          <br />
          <template v-if="orderList && orderList.length !== 0">
            <template v-for="(item, index) in orderList">
              <div :key="index + '&'" class="space"></div>
              <tr :key="index" class="i-line">
                <td colspan="3">
                  <svg t="1665285503374" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="2676" width="16" height="16">
                    <path
                      d="M512 950.848c-242.368 0-438.848-196.48-438.848-438.848C73.152 269.632 269.632 73.152 512 73.152c242.368 0 438.848 196.48 438.848 438.848 0 242.368-196.48 438.848-438.848 438.848z m-18.976-491.84v-129.856a36.576 36.576 0 0 0-73.152 0v209.248L262.624 315.296a43.872 43.872 0 0 0-79.776 25.28v299.008a36.576 36.576 0 1 0 73.152 0v-206.72l157.28 223.072a43.872 43.872 0 0 0 79.744-25.28v-32.384a146.272 146.272 0 1 0 0-139.264z m128.704 142.752a73.152 73.152 0 1 1 0-146.272 73.152 73.152 0 0 1 0 146.272z m182.848 56.512a36.576 36.576 0 1 0 0-73.12 36.576 36.576 0 0 0 0 73.12z"
                      p-id="2677" fill="#01806f"></path>
                  </svg>
                  订单编号：{{ item.orderNo }}
                </td>
                <td colspan="3">
                  <svg t="1665285864156" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="8826" width="16" height="16">
                    <path d="M512 512m-450.56 0a450.56 450.56 0 1 0 901.12 0 450.56 450.56 0 1 0-901.12 0Z"
                      fill="#01806f" p-id="8827" data-spm-anchor-id="a313x.7781069.0.i10" class=""></path>
                    <path
                      d="M491.52 317.44a30.72 30.72 0 0 1 30.57664 27.77088L522.24 348.16v174.08H757.76a30.72 30.72 0 0 1 30.57664 27.77088L788.48 552.96a30.72 30.72 0 0 1-27.77088 30.57664L757.76 583.68H491.52a30.72 30.72 0 0 1-30.57664-27.77088L460.8 552.96V348.16a30.72 30.72 0 0 1 30.72-30.72z"
                      fill="#ffffff" p-id="8828" data-spm-anchor-id="a313x.7781069.0.i11" class="selected"></path>
                  </svg>
                  报告时间：{{ item.createTime | formatDate }}
                </td>
                <td colspan="3"></td>
                <td class="detail">
                  <el-button type="text" size="small"
                    @click="toInformedDetail(item.id, item.expressCode, item.expressId)">查看详情</el-button>
                </td>
              </tr>
              <tr :key="index + '%'" class="i-box">
                <td>
                  <el-checkbox v-model="item.isChecked" @change="handelCheckIs($event, item)"></el-checkbox>
                </td>
                <td colspan="2">{{ item.itemTitle || '——' }}</td>
                <td>
                  <svg t="1662443559209" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="12023" width="16" height="16">
                    <path
                      d="M512 0C228.8 0 0 228.8 0 512s228.8 512 512 512 512-228.8 512-512S795.2 0 512 0z m0 976C256 976 48 768 48 512S256 48 512 48s464 208 464 464-208 464-464 464z"
                      fill="#F9AC3E" p-id="12024"></path>
                    <path
                      d="M512 96C281.6 96 96 281.6 96 512s185.6 416 416 416 416-185.6 416-416S742.4 96 512 96z m209.6 171.2L544 464v28.8h150.4c14.4 0 25.6 11.2 25.6 25.6S707.2 544 692.8 544H544v54.4h150.4c14.4 0 25.6 11.2 25.6 25.6s-11.2 25.6-25.6 25.6H544v124.8-16c0 19.2-16 33.6-33.6 33.6-19.2 0-33.6-16-33.6-33.6v16-124.8H329.6c-14.4 0-25.6-11.2-25.6-25.6s11.2-25.6 25.6-25.6h147.2V544H329.6c-14.4 0-25.6-11.2-25.6-25.6s11.2-25.6 25.6-25.6h147.2V464l-176-196.8s-19.2-52.8 40-35.2c20.8 6.4 36.8 35.2 36.8 35.2l136 145.6 139.2-145.6s16-30.4 40-35.2c54.4-11.2 28.8 35.2 28.8 35.2z"
                      fill="#F9AC3E" p-id="12025"></path>
                  </svg>
                  {{ item.payment || '-' }}
                </td>
                <td>{{ item.pName }}({{ item.pCellphone || '-' }})</td>
                <td>{{ item.fullName || '-' }}</td>
                <td class="price-box">
                  <el-tag size="small" effect="plain"
                    :style="{ color: getColor(item.statusStr), borderColor: getColor(item.statusStr) }">{{
                      item.statusStr ||
                      '——' }}</el-tag>
                  <el-button v-if="item.statusStr === '收款码待付款'" type="text" size="small" class="priceText"
                    @click="changePrice(item.payment, item.orderNo, item.itemTitle, item.id)">改价</el-button>
                </td>
                <td>{{ item.tokenNum || '-' }}</td>
                <td colspan="2">
                  <el-button type="text" size="small" @click="toUploadInformed(item.id)">上传知情</el-button>
                  <el-button type="text" size="small" @click="toUploadReport(item.id)"
                    v-if="item.reportNum === 0 && roleCode === 'manager'">上传报告</el-button>
                  <el-button type="text" size="small" @click="openTokenDialog(item)">分配积分</el-button>
                  <!-- <el-button type="text" size="small" @click="toInformedDetail(item.id,item.expressCode,item.expressId)">查看</el-button> -->
                </td>
              </tr>
            </template>
          </template>
          <tr v-if="!orderList || orderList.length === 0">
            <td colspan="8">
              <el-empty description="暂无数据"></el-empty>
            </td>
          </tr>
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
      <el-row style="margin-top:20px; font-size: 15px;">
        <svg t="1665285503374" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2676" width="16" height="16">
          <path
            d="M512 950.848c-242.368 0-438.848-196.48-438.848-438.848C73.152 269.632 269.632 73.152 512 73.152c242.368 0 438.848 196.48 438.848 438.848 0 242.368-196.48 438.848-438.848 438.848z m-18.976-491.84v-129.856a36.576 36.576 0 0 0-73.152 0v209.248L262.624 315.296a43.872 43.872 0 0 0-79.776 25.28v299.008a36.576 36.576 0 1 0 73.152 0v-206.72l157.28 223.072a43.872 43.872 0 0 0 79.744-25.28v-32.384a146.272 146.272 0 1 0 0-139.264z m128.704 142.752a73.152 73.152 0 1 1 0-146.272 73.152 73.152 0 0 1 0 146.272z m182.848 56.512a36.576 36.576 0 1 0 0-73.12 36.576 36.576 0 0 0 0 73.12z"
            p-id="2677" fill="#01806f"></path>
        </svg>
        <span>订单编号：</span>
        <span>{{ orderNo }}</span>
      </el-row>
      <el-row style="margin-top:10px; font-size: 15px;">
        <svg t="1665285503374" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2676" width="16" height="16">
          <path
            d="M512 950.848c-242.368 0-438.848-196.48-438.848-438.848C73.152 269.632 269.632 73.152 512 73.152c242.368 0 438.848 196.48 438.848 438.848 0 242.368-196.48 438.848-438.848 438.848z m-18.976-491.84v-129.856a36.576 36.576 0 0 0-73.152 0v209.248L262.624 315.296a43.872 43.872 0 0 0-79.776 25.28v299.008a36.576 36.576 0 1 0 73.152 0v-206.72l157.28 223.072a43.872 43.872 0 0 0 79.744-25.28v-32.384a146.272 146.272 0 1 0 0-139.264z m128.704 142.752a73.152 73.152 0 1 1 0-146.272 73.152 73.152 0 0 1 0 146.272z m182.848 56.512a36.576 36.576 0 1 0 0-73.12 36.576 36.576 0 0 0 0 73.12z"
            p-id="2677" fill="#01806f"></path>
        </svg>
        <span>检测项目：</span>
        <span>{{ itemTitle }}</span>
      </el-row>
      <el-row type="flex" justify="center" class="priceDiag">
        <el-col :span="6">
          <div class="priceBox">
            <span class="priceTitle">当前价格</span>
            <span class="linerText">
              <svg t="1662443559209" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="12023" width="16" height="16">
                <path
                  d="M512 0C228.8 0 0 228.8 0 512s228.8 512 512 512 512-228.8 512-512S795.2 0 512 0z m0 976C256 976 48 768 48 512S256 48 512 48s464 208 464 464-208 464-464 464z"
                  fill="#F9AC3E" p-id="12024"></path>
                <path
                  d="M512 96C281.6 96 96 281.6 96 512s185.6 416 416 416 416-185.6 416-416S742.4 96 512 96z m209.6 171.2L544 464v28.8h150.4c14.4 0 25.6 11.2 25.6 25.6S707.2 544 692.8 544H544v54.4h150.4c14.4 0 25.6 11.2 25.6 25.6s-11.2 25.6-25.6 25.6H544v124.8-16c0 19.2-16 33.6-33.6 33.6-19.2 0-33.6-16-33.6-33.6v16-124.8H329.6c-14.4 0-25.6-11.2-25.6-25.6s11.2-25.6 25.6-25.6h147.2V544H329.6c-14.4 0-25.6-11.2-25.6-25.6s11.2-25.6 25.6-25.6h147.2V464l-176-196.8s-19.2-52.8 40-35.2c20.8 6.4 36.8 35.2 36.8 35.2l136 145.6 139.2-145.6s16-30.4 40-35.2c54.4-11.2 28.8 35.2 28.8 35.2z"
                  fill="#F9AC3E" p-id="12025"></path>
              </svg>
              {{ nowPrice }}</span>
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
              <svg t="1662443559209" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="12023" width="16" height="16">
                <path
                  d="M512 0C228.8 0 0 228.8 0 512s228.8 512 512 512 512-228.8 512-512S795.2 0 512 0z m0 976C256 976 48 768 48 512S256 48 512 48s464 208 464 464-208 464-464 464z"
                  fill="#F9AC3E" p-id="12024"></path>
                <path
                  d="M512 96C281.6 96 96 281.6 96 512s185.6 416 416 416 416-185.6 416-416S742.4 96 512 96z m209.6 171.2L544 464v28.8h150.4c14.4 0 25.6 11.2 25.6 25.6S707.2 544 692.8 544H544v54.4h150.4c14.4 0 25.6 11.2 25.6 25.6s-11.2 25.6-25.6 25.6H544v124.8-16c0 19.2-16 33.6-33.6 33.6-19.2 0-33.6-16-33.6-33.6v16-124.8H329.6c-14.4 0-25.6-11.2-25.6-25.6s11.2-25.6 25.6-25.6h147.2V544H329.6c-14.4 0-25.6-11.2-25.6-25.6s11.2-25.6 25.6-25.6h147.2V464l-176-196.8s-19.2-52.8 40-35.2c20.8 6.4 36.8 35.2 36.8 35.2l136 145.6 139.2-145.6s16-30.4 40-35.2c54.4-11.2 28.8 35.2 28.8 35.2z"
                  fill="#F9AC3E" p-id="12025"></path>
              </svg>
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
              <svg t="1662443559209" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="12023" width="16" height="16">
                <path
                  d="M512 0C228.8 0 0 228.8 0 512s228.8 512 512 512 512-228.8 512-512S795.2 0 512 0z m0 976C256 976 48 768 48 512S256 48 512 48s464 208 464 464-208 464-464 464z"
                  fill="#F9AC3E" p-id="12024"></path>
                <path
                  d="M512 96C281.6 96 96 281.6 96 512s185.6 416 416 416 416-185.6 416-416S742.4 96 512 96z m209.6 171.2L544 464v28.8h150.4c14.4 0 25.6 11.2 25.6 25.6S707.2 544 692.8 544H544v54.4h150.4c14.4 0 25.6 11.2 25.6 25.6s-11.2 25.6-25.6 25.6H544v124.8-16c0 19.2-16 33.6-33.6 33.6-19.2 0-33.6-16-33.6-33.6v16-124.8H329.6c-14.4 0-25.6-11.2-25.6-25.6s11.2-25.6 25.6-25.6h147.2V544H329.6c-14.4 0-25.6-11.2-25.6-25.6s11.2-25.6 25.6-25.6h147.2V464l-176-196.8s-19.2-52.8 40-35.2c20.8 6.4 36.8 35.2 36.8 35.2l136 145.6 139.2-145.6s16-30.4 40-35.2c54.4-11.2 28.8 35.2 28.8 35.2z"
                  fill="#F9AC3E" p-id="12025"></path>
              </svg>
              {{ afterPrice }}</span>
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
export default {
  data() {
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
        directPrice: '' // 产品价格
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
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  mounted() {
    this.getData()
    this.getCompanyList()
  },
  created() {

  },
  destroyed() {
    window.sessionStorage.removeItem('checkPage')
  },
  watch: {
    orderList: { // 监听事件,监听复选框是否全部选中,全部选中则全选的复选框勾选上
      handler(val) {
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
    addPrice(val) {
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
    afterPrice(val) {
      if (val < 0) {
        this.priceBut = true
        return
      }
      this.priceBut = false
    },
    pageNum(newNum, oldNum) {
      const arrId = window.sessionStorage.getItem('checkPage')
      const obj = JSON.parse(arrId)
      let newSeesion = Object.assign({}, obj, { [oldNum]: { data: this.orderList } })
      window.sessionStorage.setItem('checkPage', JSON.stringify(newSeesion))
    },
    checkIds(val) {
      if (val && val.length !== 0) {
        this.isIndeterminate = true
      } else {
        this.isIndeterminate = false
      }
    }
  },
  methods: {
    // 根据比例设置积分
    setTokenByRatio(ratio) {
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
    openTokenDialog(item) {
      console.log(item)
      this.tokenForm = {
        userId: item.userId || '',
        userName: item.fullName || '',
        tokenNum: '',
        orderId: item.id || '',
        orderNo: item.orderNo || '',
        description: '分配积分',
        directPrice: item.directPrice || '' // 产品价格
      }
      this.visiableToken = true
    },
    // 分配积分接口
    allocateToken() {
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
    changePriceApi() {
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
    changePrice(val, orderNo, itemTitle, id) {
      this.orderId = id
      this.nowPrice = val
      this.orderNo = orderNo
      this.itemTitle = itemTitle
      this.afterPrice = this.nowPrice
      this.addPrice = ''
      this.visiablePrice = true
    },
    // 复选框
    handelCheckIs(val, item) {
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
    handleAllCheck(val) {
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
    // 标签颜色
    getColor(val) {
      const map = {
        '待采样': '#14a495',
        '待回寄': '#202020',
        '已取消订单': '#999999',
        '报告已出': '#368c01',
        '寄样中': '#6045a3',
        '收款码待付款': '#101ffb',
        '检测中': '#fe8a5d'
      }
      return map[val]
    },
    headerClassName({ row, rowIndex }) {
      return 'header-row'
    },
    // 导出
    exportData() {
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
    exportPutData(val) {
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
    getData() {
      this.loading = true
      this.axios.get('order/user', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          condition: this.condition ? this.condition.trim() : ''
        }
      }).then(res => {
        this.orderList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
        this.loading = false
        // 翻页复选框处理
        const obj = window.sessionStorage.getItem('checkPage')
        const arr = JSON.parse(obj)
        if (arr && arr[this.pageNum]) {
          this.orderList = arr[this.pageNum].data
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
    getCompanyList() {
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
    handleSizeChange(val) {
      this.pageSize = val
      window.sessionStorage.orderPageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      window.sessionStorage.orderPageNum = val
      this.getData()
    },
    toRecheck(reportId, informedId) {
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
    toUploadInformed(id) {
      this.$router.push({ path: '/informed/upload', query: { orderId: id } })
    },
    toUploadReport(id) {
      this.$router.push({ path: '/report/upload', query: { orderId: id } })
    },
    toInformedDetail(id, expressCode, expressId) {
      this.$router.push({ path: '/order/' + id, query: { expressCode: expressCode, expressId: expressId } })
    }
  }
}
</script>
<style scoped lang="scss">
.order-box {
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px;
  margin-top: 30px;

  .page-box {
    text-align: right;
    margin: 40px 0;
  }

  .operate {
    background: #f5f6f9;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;

    .el-button {
      min-width: 80px;
    }

    .el-input {
      width: 300px;
    }
  }

  .order-table {
    margin-top: 20px;

    .i-table {
      width: 100%;
      border-spacing: 0;
      text-align: center;
      table-layout: fixed;
      font-size: 13px;
      color: #5c5c5c;
      border-collapse: collapse;

      svg {
        transform: translateY(3px);
      }

      .i-title {
        background: #14a495;
        color: white;
        line-height: 3;
      }

      .i-line {
        background: #f5f6f9;
        height: 40px;
        text-align: left;

        .detail {
          text-align: right;
          transform: translateX(-20px);
        }
      }

      .space {
        height: 10px;
      }

      .i-box {
        min-height: 60px;

        td {
          border: 1px solid #f5f6f9;
          padding: 8px;
          line-height: 1.5;
        }
      }
    }
  }
}

.priceDiag {
  margin: 30px 0 70px 0;
  border: 1px dashed #e2f8f6;
  padding: 60px 15px 37px 15px;
  background: #e4edec;
  border-radius: 15px;
  height: 250px;
}

.price-dialog {
  svg {
    transform: translateY(2px);
  }
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
    color: #bc0d0a;
    line-height: 40px;
  }
}

.price-box {
  display: flex;
  flex-direction: column;
  align-items: center;

  .el-tag {
    margin-top: 5px;
  }

  .priceText {
    color: rgb(16, 31, 251);
    text-decoration: underline;
  }
}

.tokenRatio {
  background-color: #f5f6f9;
  padding: 12px;
  border-radius: 8px;
}
</style>
<style lang="scss">
.price-dialog {
  .el-dialog__body {
    background: #f5f6f9;
  }

  .el-dialog__header {
    background: #e4edec;
  }
}
</style>
