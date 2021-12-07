<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>信息提取</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/informed/list' }">知情列表</el-breadcrumb-item>
          <el-breadcrumb-item>病理信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="user-container">
          <div class="infos">
            <div class="title">
              检测项目： {{informed.productName}}
            </div>
            <div class="brief">
              <h5>受检者信息</h5>
              <p>姓名：{{informed.patient ? informed.patient.truename: '-'}}</p>
              <p>性别：{{informed.patient ? informed.patient.sex: '-'}}</p>
              <p>出生日期：{{informed.patient.birthday | formatDate}}</p>
            </div>
            <div class="brief">
              <h5>送检信息</h5>
              <p>医院：{{informed.hospitalName ? informed.hospitalName : informed.informed.hospitalTemp}}</p>
              <p>科室：{{informed.deptName ? informed.deptName : informed.informed.deptTemp}}</p>
              <p>医生：{{informed.informed ? informed.informed.doctor : '-'}}</p>
            </div>
            <el-form ref="formData" :rules="formRules"  :model="formData" label-position="right" label-width="140px" size="mini">
              <h5>报告接收地址</h5>
              <el-form-item label="收件人" prop="orderReceiver.receiver">
                <el-input v-model="formData.orderReceiver.receiver" placeholder="请输入收件人姓名"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="orderReceiver.cellphone">
                <el-input v-model="formData.orderReceiver.cellphone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
              <el-form-item label="报告邮寄地址：" prop="receiverallAddress" label-width="140px">
                <el-cascader
                  placeholder="请选择省市区"
                  style="width: 100%"
                  v-model="formData.receiverallAddress"
                  :options="addressOptions"
                  @change="handleChangAddress($event,'orderReceiver')"></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址" prop="orderReceiver.address">
                <el-input v-model="formData.orderReceiver.address" placeholder="请输入详细地址"></el-input>
              </el-form-item>
              <h5>剩余蜡块接收地址</h5>
              <el-form-item label="收件人">
                <el-input v-model="formData.waxOrderReceiver.receiver" placeholder="请输入收件人姓名"></el-input>
              </el-form-item>
              <el-form-item label="联系方式">
                <el-input v-model="formData.waxOrderReceiver.cellphone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
              <el-form-item label="接收地址：" label-width="140px">
                <el-cascader
                  placeholder="请选择省市区"
                  style="width: 100%"
                  v-model="formData.waxReceiverallAddress"
                  :options="addressOptions"
                  @change="handleChangAddress($event,'waxOrderReceiver')"></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="formData.waxOrderReceiver.address" placeholder="请输入详细地址"></el-input>
              </el-form-item>
              <div style="text-align: center">
                <el-button type="primary" size="small" @click="submitAddress('formData')">确认</el-button>
              </div>
            </el-form>
            <div class="brief">
              <h5>病理信息</h5>
              <p>癌种：{{informed.informed ? informed.informed.cancerType:'-'}}</p>
              <p v-for="info in moreInfo">{{info.key}}：{{info.value}}</p>
            </div>

          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="img-content infos">
          <div class="brief">
            <h5>手写签名</h5>
            <img :src="informed.informedUrl">
          </div>
          <div class="brief">
            <h5>病理报告文件</h5>
            <div v-for="img in informed.pathologicFiles">
              <img :src="img">
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'EditInformed',
  data () {
    return {
      smsStatus: 1,
      informed: {
        patient:{
          birthday:''
        },
        informed:{
          hospitalTemp:''
        }
      },
      projects: [],
      moreInfo: [],
      addressOptions:regionData,//省市区数据
      CodeToText: CodeToText,
      TextToCode: TextToCode,
      formData:{
        receiverallAddress:'',
        waxReceiverallAddress:'',
        orderReceiver:{
          receiver:'',
          cellphone:'',
          subscribe:'ru6c',
          province:'',
          city:'',
          county:'',
          address:''
        },
        waxOrderReceiver:{
          receiver:'',
          cellphone:'',
          subscribe:'ru6c',
          province:'',
          city:'',
          county:'',
          address:''
        }
      },
      formRules:{
        "orderReceiver.receiver":[
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        "orderReceiver.cellphone":[
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[2-9]\d{9}$/, message: '请输入正确的电话号码' }
        ],
        receiverallAddress:[
          { required: true, message: '请选择省市区', trigger: 'change' }
        ],
        "orderReceiver.address":[
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        "waxOrderReceiver.receiver":[
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        "waxOrderReceiver.cellphone":[
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[2-9]\d{9}$/, message: '请输入正确的电话号码' }
        ],
        waxReceiverallAddress:[
          { required: true, message: '请选择省市区', trigger: 'change' }
        ],
        "waxOrderReceiver.address":[
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      imagePath: '',
      role: window.localStorage.role
    }
  },
  props: {},
  methods: {
    /*地址修改*/
    submitAddress(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.formData.receiverallAddress
          delete this.formData.waxReceiverallAddress
          console.log(this.formData)
          this.setAddress()
        } else {
          return false;
        }
      });
    },
    /*修改地址接口*/
    setAddress(){
      this.axios.put('/order/received/'+ this.$route.params.orderId,{
        ...this.formData
      }).then(res => {
        if (res.data === '修改成功') {
          this.$message({message: '编辑成功', type: 'success'});
          this.$router.push('/informed/list')
        } else {
          this.$message({message: '编辑失败', type: 'warning'});
        }
      })
    },
    /*地址回显处理*/
    addressSee(data,type,address){
      if(!data.province) return
      const orderProvince = TextToCode[data.province].code
      const orderCityTemp = data.province === data.city?'市辖区':data.city
      const orderCity = this.TextToCode[data.province][orderCityTemp].code
      const orderCounty = this.TextToCode[data.province][orderCityTemp][data.county].code
      this.formData[address]= [orderProvince,orderCity,orderCounty]
    },
    _initData () {
      this.axios.get('ru6c/informed/info',{
        params: {
          sampleCode: this.$route.params.sampleNo
        }
      }).then(res => {
        this.informed = res.data
        console.log(this.informed.informed.moreInfo)
        if (this.informed.informed.moreInfo) {
          this.moreInfo = JSON.parse(this.informed.informed.moreInfo)
        }
        if(res.data.receiver){
          this.formData.orderReceiver = this.informed.receiver
          this.addressSee(res.data.receiver,'orderReceiver','receiverallAddress')
        }
        if(res.data.waxReceiver){
          this.formData.waxOrderReceiver = this.informed.waxReceiver
          this.addressSee(res.data.waxReceiver,'waxOrderReceiver','waxReceiverallAddress')
        }
      }).catch(err => {
        console.log(err)
      })

      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.projects = res.data
      }).catch(err => {
        console.log(err)
      })
      this.axios.get('hospital-dept').then(res => {
        this.depts = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    /*省市区级联*/
    handleChangAddress(val,type){
      this.formData[type].province = this.CodeToText[val[0]]
      this.formData[type].city = this.CodeToText[val[1]]
      this.formData[type].county = this.CodeToText[val[2]]
    },
    edit () {
      delete this.informedContent.createTime
      this.axios.put('informed/' + this.$route.params.informedId, this.informedContent).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.push('/informed/list')
      }).catch(err => {
        this.$message.error('修改失败')
        console.log(err)
      })
    },
    cancel () {
      this.$router.push('/informed/list')
    },
    unread () {
      delete this.informedContent.createTime
      this.axios.put('informed/unread/' + this.$route.params.informedId, this.informedContent).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.push('/informed/list')
      }).catch(err => {
        this.$message.error('修改失败')
        console.log(err)
      })
    },
    addressHandleChange (value) {
      this.informedContent.province = this.CodeToText[value[0]]
      this.informedContent.city = this.CodeToText[value[1]]
      this.informedContent.county = this.CodeToText[value[2]]
    },
    hospitalQuerySearch (queryString, cb) {
      console.log(queryString)
      this.axios.get('hospital/page', {
        params: {
          pageNum: 1, // 页码
          pageSize: 8, // 每页长度
          keywords: queryString
        }
      }).then(res => {
        let result = []
        if (res.data.endRow === 0) {
          cb(result)
        } else {
          res.data.list.forEach(function (item) {
            result.push({
              'value': item.name,
              'id': item.id
            })
          })
          cb(result)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    hospitalHandleSelect (item) {
      this.informedContent.hospitalId = item.id
    },
    updateSmsStatus (status) {
      this.smsStatus = status
      this.informedContent.smsStatus = status
    }
  },
  filters: {},
  computed: {
    areaInfo: {
      get: function () {
        if (this.informedContent.county === undefined || this.informedContent.county === '' || this.informedContent.county === null) {
          return []
        }
        let province = this.TextToCode[this.informedContent.province].code
        let cityTemp = this.informedContent.city === this.informedContent.province ? '市辖区' : this.informedContent.city
        let city = this.TextToCode[this.informedContent.province][cityTemp].code
        let county = this.TextToCode[this.informedContent.province][cityTemp][this.informedContent.county].code
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
    loading.close()
  },
  mounted () {},
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-autocomplete {
    width: 100%;
  }
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
  }
  .user-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .edit-form {
    max-width: 500px;
  }
  .width-100-p {
    width: 100%
  }
  .img-content {
    margin: 20px 0px 20px 20px;
    padding: 10px;
    height: 100%;
    background: #ffffff;
    overflow: auto;
    img {
      width: 100%;
    }
  }
  .infos {
    color: #333;
    .title {
      position: relative;
      padding: 0 10px;
      font-size: 16px;
      font-weight: 400;
      color: #333;
      .btn {
        position: absolute;
        right: 10px;
        top: 0;
        background: rgba(255,255,255,.3);
      }
    }
    .period {
      font-size: 14px;
      padding-left: 20px;
      margin-bottom: 10px;
    }
    .brief {
      h5 {
        font-size: 16px;
        margin-bottom: 10px;
      }
      p {
        margin: 4px 0;
      }
    }
    .info-cell,.brief {
      position: relative;
      padding: 10px;
      background: rgba(255,255,255,.9) !important;
      border-radius: 6px;
      color: #555;
      dt {
        font-size: 14px;
        padding-bottom: 10px;
      }
      dd {
        padding-bottom: 6px;
        color: #848484;
      }
      .price {
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 14px;
        color: #fff;
      }
      a {
        color: #4467FA;
      }
      img {
        width: 100%;
        border: 1px solid #f2f2f2;
      }
    }
  }
  .el-date-editor.el-input {
    width: 100% !important;
  }

</style>
