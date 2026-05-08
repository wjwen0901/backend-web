<template>
  <div class="invoince-box">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
      <el-breadcrumb-item>发票记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div class="select-box">
        <div>
          <el-button class="add-user" size="small" type="primary" @click="toAdd">新增</el-button>
          <el-button class="add-user" size="small" type="warning" @click="exportData">导出数据</el-button>
          <el-popover
            placement="right"
            width="400"
            v-model="validateSatus">
            <div class="groupTitle">
            <i class="el-icon-s-opportunity"></i>
            <p>请选择需要设置的发票状态</p>
            </div>
            <div class="groupRadio">
            <el-radio-group v-model="setStatus" size="small">
              <el-radio-button v-for="(item,index) in radioList" :key="index" :label="item.id">{{item.name}}</el-radio-button>
            </el-radio-group>
            </div>
            <div class="groupSet">
              <el-button size="mini" type="text" @click="setStatus = setStatusCopy,validateSatus = false">取消</el-button>
              <el-button type="primary" size="mini" @click="confirmStatus">确定</el-button>
            </div>
            <el-button slot="reference" size="small" type="success" >设置发票状态</el-button>
          </el-popover>
        </div>
        <el-input size="small" style="width:300px" v-model="keyword" placeholder="请输入发票抬头" @input="getData(true)"></el-input>
      </div>
      <el-table
        :data="list"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="invoiceType"
          label="发票类型"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="title"
          label="抬头"
          align="center"
         >
        </el-table-column>
        <el-table-column
          prop="dutyNumber"
          label="税号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="金额"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="statusStr"
          label="当前状态"
          align="center"
          width="80">
          <template slot-scope="scope">
            <el-tag size="mini" :class="tagClassOf(scope.row.statusStr)" disable-transitions>{{ scope.row.statusStr || '—' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusStr"
          label="接收信息"
         >
          <template slot-scope="scope">
            <p>接收方式：{{scope.row.receivingMode == '0' ? '纸质发票' : '电子发票'}}</p>
            <div v-if="scope.row.receivingMode == '0' && scope.row.receiver">
              <p>收件人：{{scope.row.receiver.receiver}} | {{scope.row.receiver.cellphone}}</p>
              <p>地址：：{{scope.row.receiver.province}}{{scope.row.receiver.city}}{{scope.row.receiver.county}}{{scope.row.receiver.address}}</p>
            </div>
            <div v-if="scope.row.receivingMode == '1'">
              <p>电子邮箱：{{scope.row.email}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          align="center"
         >
          <template slot-scope="scope">
            {{scope.row.applyTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="邮寄时间"
          align="center"
         >
          <template slot-scope="scope">
            {{scope.row.sendTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="200">
          <template slot-scope="scope">
            <el-button @click="toConfirm(scope.row)" type="text" size="small" v-if="scope.row.status == 1">审核提醒</el-button>
            <el-button @click="toDetail(scope.row.id)" type="text" size="small">查看订单</el-button>
<!--            <el-button @click="showExpress(scope.row.id)" type="text" size="small" v-if="scope.row.status >= 2">查看物流</el-button>-->
            <el-button @click="toExpress(scope.row)" type="text" size="small" v-if="scope.row.status == 1 || scope.row.status == 2">邮寄单据</el-button>
            <el-button @click="toExpress(scope.row)" type="text" size="small" v-if="scope.row.status == 3">重新邮寄单据</el-button>
            <el-button @click="toPdf(scope.row)" type="text" size="small" v-if="scope.row.receivingMode == '1'">发送电子邮件</el-button>
            <el-button v-if="scope.row.invoiceFiles && scope.row.invoiceFiles.length !== 0" type="text" size="small" @click="downloadEmail(scope.row)">下载邮件附件</el-button>
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

      <el-dialog title="订单详情" :visible.sync="dialogEditFormVisible">
        <div>
          <el-table
            :data="invoiceDetail"
            size="mini"
            border
            style="width: 100%">
            <el-table-column
              prop="orderNo"
              label="订单编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="productName"
              label="检测产品"
              width="180">
            </el-table-column>
            <el-table-column
              prop="hospitalName"
              label="送检医院"
              width="180">
            </el-table-column>
            <el-table-column
              prop="orderPrice"
              label="订单金额"
              width="100">
            </el-table-column>
            <el-table-column
              label="下单时间"
              width="140">
              <template slot-scope="scope">
                {{scope.row.create_time | formatDate}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>

      <el-dialog title="寄送发票" :visible.sync="dialogExpressFormVisible">
        <div>
          <h4>收件人信息</h4>
          <p> {{expressItem.dContact}} | {{expressItem.dTel}}</p>
          <p> {{expressItem.dProvince}}{{expressItem.dCity}}{{expressItem.dCounty}}{{expressItem.dAddress}}</p>
          <h4>寄件人信息</h4>
          <el-form ref="form" :model="expressItem" label-width="80px">
            <el-form-item label="寄件人姓名">
              <el-input v-model="expressItem.jContact"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input type="tel" v-model="expressItem.jTel"></el-input>
            </el-form-item>
            <el-form-item label="公司/单位">
              <el-input type="tel" v-model="expressItem.jCompany"></el-input>
            </el-form-item>
            <el-form-item label="省市区">
              <el-cascader class="width-100-p"
                           :options="regionData"
                           v-model="areaInfo"
                           @change="addressHandleChange">
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="expressItem.jAddress"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="expressItem.remark"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onExpressSubmit">确定</el-button>
              <el-button @click="dialogExpressFormVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <el-dialog title="审核通过" :visible.sync="dialogConfirmFormVisible">
        <div>
          <h4>开票人信息</h4>
          <div style="padding: 0px 0px 20px 20px">
            <p>抬头： {{expressItem.title}}</p>
            <p>税号： {{expressItem.dutyNumber ? expressItem.dutyNumber : '-'}}</p>
            <p>金额： {{expressItem.price}}</p>
            <p>收件人： {{expressItem.dContact}} | {{expressItem.dTel}} |  {{expressItem.dProvince}}{{expressItem.dCity}}{{expressItem.dCounty}}{{expressItem.dAddress}}</p>
          </div>
          <h4>输入信息，发送微信提醒给用户</h4>
          <el-form ref="form" :model="expressItem" label-width="120px">
            <el-form-item label="输入通知内容">
              <el-input  size="small" style="width:400px" v-model="expressItem.note" placeholder="您的发票将于14个工作日内开出，请关注快递消息"></el-input>
            </el-form-item>
            <div class="but-box">
              <el-button type="primary" size="small" @click="confirmInvoice">确定</el-button>
              <el-button size="small" @click="dialogConfirmFormVisible = false">取消</el-button>
            </div>
          </el-form>
        </div>
      </el-dialog>

      <!-- 上传pdf弹窗 -->
      <el-dialog title="发送电子邮件" :visible.sync="dialogPdfVisible">
        <div class="upload-email">
          <el-upload
            ref="upload"
            action=""
            drag
            multiple
            accept=".pdf"
            :before-upload="beforeUpload"
            :file-list="fileData"
            :http-request="getOss"
            :on-remove="handelRemove"
            :on-success="handelSuccess"
            :on-error="handelError"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">* 请上传pdf文件</div>
          </el-upload>
          <el-button type="primary" size="small" @click="send" class="send" :disabled="buttonDisable" :loading="buttonLoad">发送</el-button>
        </div>
      </el-dialog>

      <!-- 下载弹窗-->
      <el-dialog title="请选择要下载的文件" :visible.sync="dialogDownloadVisible" class="email-table">
        <div class="email-but">
          <el-button type="warning" icon="el-icon-download" size="small" :disabled="emilPathList.length===0" @click="downloadBatchEmail">下载文件</el-button>
        </div>
        <el-table ref="multipleTable" :row-class-name="tableRowClassName" :header-cell-style="{background:'#00c2a9',color:'white'}" border :data="downloadFileList" @selection-change="handleSelectionChange" :row-key="handleReserve">
          <el-table-column align="center" type="selection" width="80"></el-table-column>
          <el-table-column align="center" label="文件名称" prop="fileName"></el-table-column>
        </el-table>
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
      downloadFileList:[],//需要下载文件列表
      dialogDownloadVisible:false,
      fileData:[],
      dialogPdfVisible:false,
      radioList:[],//发票状态列表
      setStatus:'',//发票状态
      setStatusCopy:'',
      validateSatus:false,
      keyword:'',
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      invoiceDetail: [],
      secList: [],
      dialogEditFormVisible: false,
      dialogExpressFormVisible: false,
      dialogConfirmFormVisible: false,
      resourceList: [],
      resourceSelet: [],
      solutionList: [],
      hospitals: [],
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      companyList: [],
      roleCode: this.$route.role,
      currentUserRole: window.localStorage.role,
      condition: null,
      qrCode: {},
      eleInformed: {},
      expressItem: {},
      informedQrCode: {
        sampleType: '口腔拭子',
        price: 688,
        time: '2020.03'
      },
      options2: [{
        text: 'name1',
        value: 'value1'
      }, {
        text: 'name2',
        value: 'value2'
      }],
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode,
      fileList:[],
      invoiceId:'',
      progressFlag :false,
      loadProgress:0,
      successFileNum:0,
      fileTotal:0,//上传文件的总数目
      buttonDisable: true,
      buttonLoad: false,
      emilPathList:[]
    }
  },
  methods: {
    tagClassOf,
    //设置弹窗表格颜色
    tableRowClassName({row, rowIndex}){
      if (rowIndex%2 === 1) {
          return 'warning-row';
        } else {
          return 'success-row';
        }
    },
    //批量下载
    downloadBatchEmail(){
      this.emilPathList.forEach(item => {
        this.downloadApi(item.path,item.fileName)
      })  
    },
    //下载弹窗复选框
    handleSelectionChange(val){
      this.emilPathList = val
      console.log(val)
    },
    //下载弹窗表格唯一ID
    handleReserve(row){
      return row.path
    },
    //邮件文件下载
    downloadEmail(data){
      this.dialogDownloadVisible = true  
      this.downloadFileList = data.invoiceFiles 
    },
    //下载接口
    downloadApi(url, name){
       this.axios.get('oss/upload/show', {
          params: {
            objectKey: url
          }
        }).then(res => {
            fetch(res.data).then((r) => {
              r.blob().then((blob) => {//普通a标签无法下载，需要转成blob
                const fileUrl = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = fileUrl
                a.download = name;
                a.click()
                window.URL.revokeObjectURL(fileUrl)
                })
            })
        }).catch(err => {
          console.log(err)
        })
    },
    //文件上传失败
    handelError(err, file, fileList){
      this.$message.error("文件上传失败，请联系工作人员！")
    },
    //文件上传成功
    handelSuccess(response, file, fileList){
      this.fileTotal = fileList.length
      if(file.status === 'success'){
        this.successFileNum ++ //记录文件上传成功的次数
      }
    },
    //移除文件
    handelRemove(file,fileArr){
     this.fileTotal = fileArr.length
     const list = this.fileList.filter(item => {
       return item.fileName !== file.name
      })
     this.fileList = list
    },
    //上传文件前的校验
    beforeUpload(file){
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["pdf"];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error('上传文件只能是 pdf格式');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {//此处上传多个文件会出现多个弹窗，有时间需要优化
        this.$message.error('上传文件大小不能超过 10MB');
        return false;
      }
    },
    //发送电子邮箱
    send(){
      this.buttonLoad = true
      let loading = this.$loading({
      lock: true,
      text: '发送邮件中，请稍后',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
      })
      this.axios.post('/email/invoice',{
        invoiceId:this.invoiceId.toString(),
        invoiceFiles:this.fileList
      }).then(res => {
        if(res.data.status === "success"){
          this.$message.success("发送成功")
          this.getData()
        }else{
          this.$message.warning("发送失败")
        }
        this.buttonLoad = false
        this.dialogPdfVisible = false
        loading.close()
      }).catch(err => {
        loading.close()
        this.buttonLoad = false
        console.log(err)
      })
    },
    //上传oss
    getOss(file){
      this.progressFlag = true
       this.axios.get('/oss/upload/policy/invoice')
            .then(res => {
              if (res) {
                  const data = res.data
                  const obj = new FormData()
                  obj.append('OSSAccessKeyId',data.accessid)
                  obj.append('policy',data.policy)
                  obj.append('signature',data.signature)
                  obj.append('key',data.dir + data.uniqueKey + '.pdf')
                  obj.append('success_action_status','200')
                  obj.append('uniqueKey',data.uniqueKey)
                  obj.append('file',file.file)
                  this.axios.post('https://mdhcare.oss-cn-beijing.aliyuncs.com/',obj,{
                    onUploadProgress: progress => {
                    if (progress.lengthComputable) {
                      let num = (progress.loaded / progress.total).toFixed(2) * 100 //上传进度条
                      file.onProgress({percent: num})
                    }
                  },
                })
               .then(res => {
                  const objOne = {
                  path:data.dir + data.uniqueKey + '.pdf',
                  fileName:file.file.name,
                  size:file.file.size
                 }
                 this.fileList.push(objOne)
                 file.onSuccess();//上传成功时候的勾号小图标
                }).catch(reason => {
                 file.onError();
                })
              }
            })
            .catch(reason => {
              file.onError();
            })
    },
    //上传pdf弹窗
    toPdf(row){
      this.dialogPdfVisible = true
      this.invoiceId = row.id
      this.fileData = []
      this.fileList = []
    },
    //设置发票状态
    confirmStatus(){
      this.axios.put('invoice/setting?val='+this.setStatus).then(res => {
        if(res.data.message === '成功'){
          this.setStatusCopy = this.setStatus
          this.$message({message: '设置成功', type: 'success'})
        }else{
          this.$message({message: '设置失败', type: 'warning'})
        }
        this.validateSatus = false
      }).catch(err => {
        console.log(err)
      })
    },
    //获取当前发票状态
    getStatus(){
       this.axios.get('invoice/setting').then(res => {
        res.data.data.proValRange.split('，').map(item => {
          const obj = {
            id: item.split('-')[0],
            name: item.split('-')[1]
          }
          this.radioList.push(obj)
        })
        this.setStatus = res.data.data.valDefault
        this.setStatusCopy = this.setStatus
      }).catch(err => {
        console.log(err)
      })
    },
    _initData () {
      this.getData()
    },
    getData (flag) {
      if(flag){
        this.pageNum=1
        this.pageSize = 20
      }
      this.resourceList = []
      this.axios.get('invoice/list', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          condition: this.keyword
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
    //导出数据
    exportData(){
       this.axios.get('invoice/export/list', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          condition:this.keyword
        },
        responseType: 'blob'
      }).then(res => {
        const blob = new Blob(
          [res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const aEle = document.createElement('a');     // 创建a标签
        const href = window.URL.createObjectURL(blob);       // 创建下载的链接
        aEle.href = href;
        const today = new Date();
        aEle.download = "发票记录" + today.getFullYear() + '-'+ (today.getMonth()+1)+ '-' + today.getDate() + ".xls";  // 下载后文件名
        document.body.appendChild(aEle);
        aEle.click();     // 点击下载
        document.body.removeChild(aEle); // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
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
    toAdd () {
      this.whitelistDoctor = {}
      this.dialogEditFormVisible = true
    },
    onExpressSubmit () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'post',
        url: 'sf/invoice',
        data: this.expressItem,
        params: {
          invoiceId: this.expressItem.invoiceId,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        if(response.data.success === true){
            _this.$message({
               message: '提交成功',
              type: 'success'
            })
             _this._initData()
             _this.dialogExpressFormVisible = false
        }else{
          _this.$message.error({
               message: response.data,
               type: 'error'
            })
        }
      })
    },
    toDetail (id) {
      this.axios.get('invoice/detail/' + id,{
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
      }).then(res => {
        this.invoiceDetail = res.data
      }).catch(err => {
        console.log(err)
      })
      this.dialogEditFormVisible = true
    },
    toExpress (invoice) {
      this.expressItem.invoiceId = invoice.id
      this.expressItem.dContact = invoice.receiver.receiver
      this.expressItem.dTel = invoice.receiver.cellphone
      this.expressItem.dProvince = invoice.receiver.province
      this.expressItem.dCity = invoice.receiver.city
      this.expressItem.dCounty = invoice.receiver.county
      this.expressItem.dAddress = invoice.receiver.address
      this.expressItem.receiverId = invoice.receiverId
      this.dialogExpressFormVisible = true
    },
    showExpress (id) {
      this.axios.get('white/' + id, {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        }
      }).then(res => {
        this.whitelistDoctor = res.data
      }).catch(err => {
        console.log(err)
      })
      this.dialogEditFormVisible = true
    },
    addressHandleChange (value) {
      this.expressItem.jProvince = this.CodeToText[value[0]]
      this.expressItem.jCity = this.CodeToText[value[1]]
      this.expressItem.jCounty = this.CodeToText[value[2]]
    },
    toConfirm (invoice) {
      this.expressItem = invoice
      this.expressItem.invoiceId = invoice.id
      this.expressItem.dContact = invoice.receiver.receiver
      this.expressItem.dTel = invoice.receiver.cellphone
      this.expressItem.dProvince = invoice.receiver.province
      this.expressItem.dCity = invoice.receiver.city
      this.expressItem.dCounty = invoice.receiver.county
      this.expressItem.dAddress = invoice.receiver.address
      this.expressItem.receiverId = invoice.receiverId
      this.dialogConfirmFormVisible = true
    },

    confirmInvoice () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'put',
        url: 'invoice/confirm/' + this.expressItem.invoiceId,
        data: this.expressItem,
        params: {
          note: this.expressItem.note,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
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
        _this.dialogConfirmFormVisible = false
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.params.role) {
        this.roleCode = this.$route.params.role
        this.getData()
      }
    },
    dialogDownloadVisible(val){
      if(!val){
        this.$refs.multipleTable.clearSelection();
        this.emilPathList = []
      }
    },
    validateSatus(newVal,oldVal){   
      if(!newVal){
        this.setStatus = this.setStatusCopy
      }
    },
    //监听上传文件成功的数目,全部上传成功才可以点击发送按钮
    successFileNum(val){
      if(this.fileTotal === val){
        this.buttonDisable = false
      }else{
        this.buttonDisable = true
      }
    },
    //监听数组长度
    fileList(val){
      if(val.length === 0) {
        this.buttonDisable = true
      }else{
        this.buttonDisable = false
      }
    }
  },
  filters: {
  },
  computed: {
    areaInfo: {
      get: function () {
        if (this.expressItem.jCounty === undefined || this.expressItem.jCounty === '' || this.expressItem.jCounty === null) {
          return []
        }
        let province = this.TextToCode[this.expressItem.jProvince].code
        let cityTemp = this.expressItem.jCity === this.expressItem.jProvince ? '市辖区' : this.expressItem.jCity
        let city = this.TextToCode[this.expressItem.jProvince][cityTemp].code
        let county = this.TextToCode[this.expressItem.jProvince][cityTemp][this.expressItem.jCounty].code
        return [province, city, county]
      },
      set: function () {
      }
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
    this.getStatus()
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
    .select-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .opera-box {
      padding-bottom: 20px;
    }
  }
  .upload-email{
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    .send{
      width: 80px;
      margin-top: 150px;
    }
    .el-progress{
      width: 40%;
    }
  }
  .email-but{
    text-align: right;
    margin-bottom: 20px;
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
  .invoince-box{
    .but-box{
      text-align: center;
      margin-top: 40px;
    }
  }
  .groupRadio{
      margin-bottom: 20px;
      text-align: center;
      margin-top: 10px;
  }
  .groupSet{
    text-align: right;
    margin: 0;
  }
  .groupTitle{
    display: flex;
    align-items: baseline;
    p{
      margin-left: 5px;
    }
    i{
      color: gold;
      font-size:15px;
    }
  }
</style>
<style lang="scss">
.invoince-box{
  .el-dialog__body{
    min-height: 400px;
  }
}
.upload-email{
  .el-upload-list__item-name{
    display: flex;
    justify-content: flex-start;
  }
}
.email-table{
  .el-table .warning-row {
    background: #f2f9f8;
  }

  .el-table .success-row {
    background: #e3f2f0;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: rgb(0, 194, 169);
    border-color: white;
  }
}
</style>
