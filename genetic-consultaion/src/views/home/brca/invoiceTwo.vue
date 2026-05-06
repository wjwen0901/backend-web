<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
            <el-breadcrumb-item>发票记录</el-breadcrumb-item>
        </el-breadcrumb>
    <div class="invoice-box">
        <div class="operate">
                <el-input v-model="keyword" placeholder="请输入发票抬头" size="small" @input="getInvoiceList(true)"></el-input>
                <div>
                    <el-button type="warning" size="small" @click="exportData">导出数据</el-button>
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
        </div>
        <div class="invoince-table">
            <table class="i-table"  v-cloak>
                <tr class="i-title">
                    <th>抬头</th>
                    <th>税号</th>
                    <th>金额</th>
                    <th>状态</th>
                    <th width="300px">接收信息</th>
                    <th width="150px">邮寄时间</th>
                    <th colspan="2" width="200px">操作</th>
                </tr>
                <br/>
                <template v-if="invoiceList && invoiceList.length !==0">
                    <template v-for="(item, index) in invoiceList">
                    <div :key="index+'&'" class="space"></div>
                    <tr :key="index" class="i-line">
                        <td colspan="7">&nbsp;
                            <svg t="1662530622464" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7753" width="16" height="16"><path d="M926.421333 157.12v341.333333H797.013333l0.021334 404.010667-156.266667-77.376-132.138667 66.773333-132.138666-66.773333-155.456 76.8-0.021334-403.434667H94.421333v-341.333333h832z m-193.408 202.645333h-448v439.125334l91.797334-45.333334 131.818666 66.56 131.882667-66.56 92.501333 45.781334V359.765333z m-96.064 244.202667v64h-256v-64h256z m0-147.050667v64h-256v-64h256z m225.472-235.818666h-704v213.333333h62.592l0.021334-138.666667h576l-0.021334 138.666667h65.408v-213.333333z" fill="#01806f" p-id="7754"></path></svg>
                            发票类型：{{item.invoiceType}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            申请时间：
                            <svg t="1662445086457" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13873" width="16" height="16"><path d="M827.871087 196.128913C743.498468 111.756293 631.321596 65.290005 512 65.290005c-119.319549 0-231.499491 46.465265-315.871087 130.837884S65.290005 392.680451 65.290005 512s46.465265 231.499491 130.837884 315.871087 196.551538 130.837884 315.871087 130.837884c119.321596 0 231.499491-46.465265 315.871087-130.837884S958.708971 631.319549 958.708971 512 912.243707 280.500509 827.871087 196.128913zM531.556405 917.246651l0-74.145697c0-11.31572-9.174963-20.491707-20.491707-20.491707-11.316743 0-20.491707 9.174963-20.491707 20.491707l0 74.059739C283.276738 906.322857 116.693746 739.164766 106.755396 531.634176l72.351841 0c11.31572 0 20.491707-9.174963 20.491707-20.491707 0-11.31572-9.174963-20.491707-20.491707-20.491707l-72.273047 0c10.769274-206.737528 177.01253-373.005342 383.740848-383.813502l0 72.346725c0 11.316743 9.174963 20.491707 20.491707 20.491707 11.31572 0 20.491707-9.17394 20.491707-20.491707L531.558451 106.752326c207.593012 9.901511 374.807385 176.539762 385.609405 383.89946l-74.142627 0c-11.316743 0-20.491707 9.174963-20.491707 20.491707 0 11.316743 9.174963 20.491707 20.491707 20.491707l74.220399 0C907.275555 739.78796 739.720422 907.317511 531.556405 917.246651z" p-id="13874" fill="#5c5c5c"></path><path d="M532.098757 503.118726 532.098757 258.240529c0-11.316743-9.174963-20.491707-20.491707-20.491707-11.31572 0-20.491707 9.17394-20.491707 20.491707l0 254.66612c0 7.858992 4.429893 14.677281 10.924817 18.114566L693.447539 722.42757c4.002151 4.000104 9.245572 6.001691 14.490016 6.001691s10.487865-2.001587 14.490016-6.001691c8.002254-8.002254 8.002254-20.977777 0-28.980032L532.098757 503.118726z" p-id="13875" fill="#5c5c5c"></path></svg>
                            {{item.applyTime | formatDate}}
                           </td>
                           <td class="detail">
                                <!-- <el-button type="text" size="small" @click="toDetail(item.id)">查看订单</el-button> -->
                           </td>
                    </tr>
                    <tr :key="index+'%'" class="i-box">
                        <td>{{item.title || '-'}}</td>
                        <td>{{item.dutyNumber || '-'}}</td>
                        <td>
                            <svg t="1662443559209" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12023" width="16" height="16"><path d="M512 0C228.8 0 0 228.8 0 512s228.8 512 512 512 512-228.8 512-512S795.2 0 512 0z m0 976C256 976 48 768 48 512S256 48 512 48s464 208 464 464-208 464-464 464z" fill="#F9AC3E" p-id="12024"></path><path d="M512 96C281.6 96 96 281.6 96 512s185.6 416 416 416 416-185.6 416-416S742.4 96 512 96z m209.6 171.2L544 464v28.8h150.4c14.4 0 25.6 11.2 25.6 25.6S707.2 544 692.8 544H544v54.4h150.4c14.4 0 25.6 11.2 25.6 25.6s-11.2 25.6-25.6 25.6H544v124.8-16c0 19.2-16 33.6-33.6 33.6-19.2 0-33.6-16-33.6-33.6v16-124.8H329.6c-14.4 0-25.6-11.2-25.6-25.6s11.2-25.6 25.6-25.6h147.2V544H329.6c-14.4 0-25.6-11.2-25.6-25.6s11.2-25.6 25.6-25.6h147.2V464l-176-196.8s-19.2-52.8 40-35.2c20.8 6.4 36.8 35.2 36.8 35.2l136 145.6 139.2-145.6s16-30.4 40-35.2c54.4-11.2 28.8 35.2 28.8 35.2z" fill="#F9AC3E" p-id="12025"></path></svg>
                            {{item.price}}</td>
                        <td>
                            <el-tag size="small" effect="plain" :style="{color:getColor(item.statusStr),borderColor:getColor(item.statusStr)}">{{item.statusStr}}</el-tag>
                        </td>
                        <td>
                            <span>{{item.receivingMode === 0 ? '纸质发票':'电子发票'}}</span><br/>
                             <template v-if="item.receivingMode == '0' && item.receiver">
                                    <span>{{item.receiver.receiver}} | {{item.receiver.cellphone}}</span><br/>
                                    <span>{{item.receiver.province}}{{item.receiver.city}}{{item.receiver.county}}{{item.receiver.address}}</span>
                                </template>
                                <template v-else-if="item.receivingMode === 1">
                                    <span>{{item.email}}</span>
                                </template>
                        </td>
                        <td>{{item.sendTime | formatDate}}</td>
                        <td colspan="2">
                            <el-button type="text" size="small" @click="toDetail(item.id)">查看订单</el-button>
                            <el-button v-if="item.status == 1" @click="toConfirm(item,true)" type="text" size="small">审核提醒</el-button>
                            <el-button v-if="item.status == 1 || item.status == 2" @click="toConfirm(item,false)" type="text" size="small">邮寄单据</el-button>
                            <el-button v-if="item.status == 3" @click="toConfirm(item,false)" type="text" size="small">重新邮寄单据</el-button>
                            <el-button v-if="item.receivingMode === 1" @click="toPdf(item)" type="text" size="small">发送电子邮件</el-button>
                            <el-button v-if="item.invoiceFiles && item.invoiceFiles.length !== 0" @click="downloadEmail(item)" type="text" size="small">下载邮件附件</el-button>
                        </td>
                    </tr>
                </template>
                </template>
                <tr v-if="!invoiceList || invoiceList.length === 0" >
                    <td colspan="8">
                        <el-empty description="暂无数据"></el-empty>
                    </td>
                </tr>
            </table>
        </div>
        <div class="page-box">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[20, 50, 100, 150]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage"
                    >
                </el-pagination>
        </div>
        <!-- 审核提醒弹窗-->
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

      <!-- 查看订单-->
      <el-dialog title="订单详情" :visible.sync="dialogEditFormVisible">
        <div>
          <el-table
            :data="invoiceDetail"
            size="mini"
            border
           >
            <el-table-column
              prop="orderNo"
              label="订单编号"
              >
            </el-table-column>
            <el-table-column
              prop="productName"
              label="检测产品"
              >
            </el-table-column>
            <el-table-column
              prop="hospitalName"
              label="送检医院"
              >
            </el-table-column>
            <el-table-column
              prop="orderPrice"
              label="订单金额"
              >
            </el-table-column>
            <el-table-column
              label="下单时间"
              >
              <template slot-scope="scope">
                {{scope.row.create_time | formatDate}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>

      <!-- 寄送发票-->
      <el-dialog title="寄送发票" :visible.sync="dialogExpressFormVisible">
        <div>
          <h4>收件人信息</h4>
          <p> {{expressItem.dContact}} | {{expressItem.dTel}}</p>
          <p> {{expressItem.dProvince}}{{expressItem.dCity}}{{expressItem.dCounty}}{{expressItem.dAddress}}</p>
          <h4>寄件人信息</h4>
          <el-form ref="form" :model="expressItem" label-width="80px" size="small">
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
            <div class="but-box">
              <el-button type="primary" @click="onExpressSubmit" size="small">确定</el-button>
              <el-button @click="dialogExpressFormVisible = false" size="small">取消</el-button>
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
        <el-table size="small" ref="multipleTable" :row-class-name="tableRowClassName" border :data="downloadFileList" @selection-change="handleSelectionChange" :row-key="handleReserve">
          <el-table-column align="center" type="selection" width="80"></el-table-column>
          <el-table-column align="center" label="文件名称" prop="fileName"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
    </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
    data(){
        return{
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
            regionData: regionData,
            CodeToText: CodeToText,
            TextToCode: TextToCode,
            invoiceList: [],
            keyword: '',
            pageNum: 1,
            pageSize: 20,
            totalPage: 0,
            validateSatus: false,
            setStatus: false,
            setStatusCopy: false,
            radioList: [],
            expressItem: {},
            dialogConfirmFormVisible: false,
            invoiceDetail: [],//查看订单需要优化
            dialogEditFormVisible: false,
            dialogExpressFormVisible: false,
            dialogPdfVisible: false,
            invoiceId: 0,
            fileData: [],
            fileList: [],
            fileTotal: 0,
            successFileNum: 0,
            buttonLoad: false,
            buttonDisable: false,
            dialogDownloadVisible: false,
            downloadFileList: [],
            emilPathList: [],


        }
    },
    watch:{
        /**设置发票状态弹窗 */
        validateSatus(val){   
            if(!val){
                this.setStatus = this.setStatusCopy
            }
        },
        /**下载弹窗 */
        dialogDownloadVisible(val){
            if(!val){
                this.$refs.multipleTable.clearSelection();
                this.emilPathList = []
            }
        },
        /**监听上传文件成功的数目,全部上传成功才可以点击发送按钮 */
        successFileNum(val){
            if(this.fileTotal === val){
                this.buttonDisable = false
            }else{
                this.buttonDisable = true
            }
        },
        /**监听数组长度 */
        fileList(val){
            if(val.length === 0) {
                this.buttonDisable = true
            }else{
                this.buttonDisable = false
            }
        }
    },
    computed:{
        areaInfo: {
            get: function () {
                if (this.expressItem.jCounty === undefined || this.expressItem.jCounty === '' || this.expressItem.jCounty === null) {
                return []
                }
                const province = this.TextToCode[this.expressItem.jProvince].code
                const cityTemp = this.expressItem.jCity === this.expressItem.jProvince ? '市辖区' : this.expressItem.jCity
                const city = this.TextToCode[this.expressItem.jProvince][cityTemp].code
                const county = this.TextToCode[this.expressItem.jProvince][cityTemp][this.expressItem.jCounty].code
                return [province, city, county]
            },
            set: function () {
            }
        }
    },
    beforeDestroy() {
        window.addEventListener("resize", this.setScrollBar);
        document.body.style.zoom = 1
        // 移除绑定的onResize事件监听
    },
    mounted(){
        this.onResize()
        window.addEventListener('resize', this.onResize);
        this.getInvoiceList()
        this.getStatus()
    },
    methods:{
        /**设置窗口自动缩小80% */
        onResize() {
            document.body.style.zoom = 0.8
        },
        /**设置弹窗表格颜色 */
        tableRowClassName({row, rowIndex}){
            if (rowIndex%2 === 1) {
                    return 'warning-row';
                } else {
                    return 'success-row';
                }
        },
        /**批量下载 */
        downloadBatchEmail(){
            this.emilPathList.forEach(item => {
                this.downloadApi(item.path,item.fileName)
            }) 
            this.dialogDownloadVisible = false
        },
        /**下载弹窗复选框 */
        handleSelectionChange(val){
            this.emilPathList = val
        },
        /**下载弹窗表格唯一ID */
        handleReserve(row){
            return row.path
        },
        /**邮件文件下载 */
        downloadEmail(data){
            this.dialogDownloadVisible = true  
            this.downloadFileList = data.invoiceFiles 
        },
        /**下载接口 */
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
        /**文件上传失败 */
        handelError(err, file, fileList){
            this.$message.error("文件上传失败，请联系工作人员！")
        },
        /**文件上传成功 */
        handelSuccess(response, file, fileList){
            this.fileTotal = fileList.length
            if(file.status === 'success'){
                this.successFileNum ++ //记录文件上传成功的次数
            }
        },
        /**移除文件 */
        handelRemove(file,fileArr){
            this.fileTotal = fileArr.length
            const list = this.fileList.filter(item => {
            return item.fileName !== file.name
            })
            this.fileList = list
        },
        /**上传文件前的校验 */
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
        /**发送电子邮箱 */
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
                    this.dialogPdfVisible = false
                    this.getData()
                }else{
                    this.$message.warning("发送失败")
                }
                this.buttonLoad = false
                loading.close()
            }).catch(err => {
                loading.close()
                this.buttonLoad = false
                console.log(err)
            })
        },
        /**上传oss */
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
        /** 上传pdf弹窗*/
        toPdf(row){
            this.dialogPdfVisible = true
            this.invoiceId = row.id
            this.fileData = []
            this.fileList = []
        },
        /**确定邮寄单据 */
        onExpressSubmit() {
            this.axios.post('sf/invoice'+'?invoiceId='+this.expressItem.invoiceId,{
                ...this.expressItem
            }).then(res => {
                if(res.data.success){
                    this.$message({message: '提交成功',type: 'success'})
                    this.dialogExpressFormVisible = false
                    this.getInvoiceList()
                }else{
                    this.$message({message: '提交失败',type: 'warning'})
                }
            }).catch(err => {
                console.log(err)
            })        
        },
        /**省市区选择 */
        addressHandleChange (value) {
            this.expressItem.jProvince = this.CodeToText[value[0]]
            this.expressItem.jCity = this.CodeToText[value[1]]
            this.expressItem.jCounty = this.CodeToText[value[2]]
        },
        /**查看订单 */
        toDetail(id) {
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
        /**确定审核 */
        confirmInvoice() {
            this.axios.put('invoice/confirm/'+this.expressItem.invoiceId+'?note='+this.expressItem.note,{
                ...this.expressItem
            }).then(res => {
                if(res.data==='success'){
                    this.$message({message: '提交成功',type: 'success'})
                    this.dialogConfirmFormVisible = false
                    this.getInvoiceList()
                }else{
                    this.$message({message: '提交失败',type: 'warning'})
                }
            }).catch(err => {
                console.log(err)
            })
        },
        /**审核提醒true/邮寄单据false */
        toConfirm (invoice, type) {
            if(type){
                 this.expressItem = invoice
                 this.dialogConfirmFormVisible = true
            }else{
                 this.dialogExpressFormVisible = true
            }
            this.expressItem.invoiceId = invoice.id
            this.expressItem.dContact = invoice.receiver.receiver
            this.expressItem.dTel = invoice.receiver.cellphone
            this.expressItem.dProvince = invoice.receiver.province
            this.expressItem.dCity = invoice.receiver.city
            this.expressItem.dCounty = invoice.receiver.county
            this.expressItem.dAddress = invoice.receiver.address
            this.expressItem.receiverId = invoice.receiverId
        },
        /**导出数据 */
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
        /**设置发票状态 */
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
        /**获取当前发票状态 */
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
        /**初始化列表 */
        getInvoiceList(flag){
            if(flag){
                this.pageNum=1
                this.pageSize = 20
            }
            let loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            this.axios.get('invoice/list', {
                params: {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
                condition: this.keyword
                }
            }).then(res => {
                this.invoiceList = res.data.list
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
            this.getInvoiceList()
        },
        /**分页 */
        handleCurrentChange (val) {
            this.pageNum = val
            this.getInvoiceList()
        },
     /**标签状态颜色 */
        // CRITIQUE[critical]: getColor 自定义十六进制色 map，未走 D3 6 类语义色；
        // 改用 tagClassForStatusStr 模式（参 src/views/home/order/orderNew.vue），命中 el-tag--{warn,info2,prog,succ,pos,neg}
        getColor(val){
            const map = {
                '已发送邮件':'#14a495',
                '未开票':'#999999',
                '已申请':'#202020',
                '已完成': '#368c01',
                '已确定': '#6045a3'
            }
            return map[val]
        },
    }
}
</script>
<style scoped lang="scss">
 .invoice-box{
    display: flex;
    flex-direction: column;
    background: white;
    padding: 20px;
    margin-top: 30px;
    .operate{
        background: #f5f6f9;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
       
        .el-button{
            min-width: 80px;
        }
        .el-input{
            width: 300px;
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
    .page-box{
        text-align: right;
        margin: 40px 0;
    }
    .but-box{
      text-align: center;
      margin: 40px 0;
      .el-button{
        width: 80px;
      }
    }
    .width-100-p {
        width: 100%;
    }
    .invoince-table{
        margin-top: 20px;
        .i-table{
            width: 100%;
            border-spacing: 0;
            text-align: center;
            table-layout:fixed;
            font-size: 13px;
            color: #5c5c5c;
            border-collapse:collapse;
            svg{
                transform: translateY(2px);
            }
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
            }
        }
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
    .invoice-box{
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
            background: #f5f6f9;
        }

    .el-table .success-row {
            background: white;
    }
    /* el-checkbox 主色已由 design-system/element-overrides.css 接管，此处不再覆盖 */
    }
</style>