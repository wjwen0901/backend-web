<template>
  <div class="edit-product">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/product' }">产品管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <div class="solution-container">
      <el-form :inline-message="true" ref="solutionForm" :model="solution" label-width="120px" size="mini" class="edit-form" :rules="rules">
        <el-form-item label="产品所属分组" prop="group">
          <el-select v-model="solution.group" placeholder="请选择">
            <el-option
              v-for="item in groupOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="癌种分类" prop="solutionCategory">
          <el-select v-model="solution.solutionCategory" multiple placeholder="请选择">
            <el-option
              v-for="item in solutionCategoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
              :disabled="solution.solutionCategory.includes('全部')">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验室" prop="company">
          <el-select v-model="solution.company" placeholder="请选择">
            <el-option
              v-for="item in companyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测周期" prop="period">
          <el-input-number v-model="solution.period"></el-input-number> 工作日
        </el-form-item>
        <el-form-item label="产品名称" prop="solutionName">
          <el-input v-model="solution.solutionName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="套餐名称" prop="productName">
          <el-input v-model="solution.productName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="directPrice">
          <el-input v-model="solution.directPrice" style="width: 300px"></el-input> 元
        </el-form-item>
        <el-form-item label="检测内容" prop="testingContent">
          <el-input v-model="solution.testingContent" type="textarea" maxlength="100" show-word-limit style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="检测意义" prop="clinicalSense">
          <el-input v-model="solution.clinicalSense" type="textarea" maxlength="100" show-word-limit style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="使用人群" prop="fitCrowd">
          <el-input v-model="solution.fitCrowd" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="样本类型" prop="sampleType">
          <el-input v-model="solution.sampleType" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="采集摘要" prop="collectionMode">
          <el-input v-model="solution.collectionMode" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="保存方式" prop="keepMode">
          <el-input v-model="solution.keepMode" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="运输方式" prop="transportMode">
          <el-input v-model="solution.transportMode" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="productArea">
          <el-select v-model="solution.productArea" multiple placeholder="请选择">
            <el-option
              v-for="(item,index) in areaOptions"
              :key="index"
              :label="item.name"
              :value="item.name"
              :disabled="solution.productArea.includes('全部')">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="样本收样地址" prop="receiveAddressId">
          <el-button type="text" @click="addressDialogVisible = true">请选择样本接收地址</el-button>
          <span v-if="solution.receiveAddressId" class="check">&nbsp;&nbsp;已选择：{{addressForm.receiver}}&nbsp;&nbsp;&nbsp;&nbsp{{addressForm.cellphone}}</span>
        </el-form-item>
        <el-form-item label="知情" prop="informedInfo">
          <quill-editor
            style="width: 75%"
            v-model="solution.informedInfo"
            ref="myQuillEditor"
            :options="editorOption"
            @change="onEditorChange($event)">
          </quill-editor>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 80px" size="small" @click="$router.push('/product')">取消</el-button>
          <el-button style="width: 80px" size="small" type="primary" @click="handleSave('solutionForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择样本收样地址" :visible.sync="addressDialogVisible" width="60%" class="my-dialog">
      <AddressInfo ref="address" @address="getAddress" :prop="isCheck"></AddressInfo>
    </el-dialog>
  </div>
</template>

<script>
import AddressInfo from "../../../components/address";
export default {
  components:{
    AddressInfo
  },
  watch:{
    addressDialogVisible(val){
      if(val){
        this.$nextTick(() => {
          this.$refs['address'].setIndex(this.solution.receiveAddressId)
        })
      }
    },
    'solution.solutionCategory': {
      handler: function(val) {
        if(val.includes('全部') && val.length !== 1){
          this.solution.solutionCategory = ['全部']
        }
      }
    },
    'solution.productArea': {
      handler: function(val) {
        if(val.includes('全部') && val.length !== 1){
          this.solution.productArea = ['全部']
        }
      }
    }
  },
   data(){
     /*金额校验*/
     const validateMoney = (rule, value, callback) => {
       if (!/^([1-9]\d*|0)(\.\d*[0-9])?$/.test(value)) {
         callback(new Error('请输入正确的金额'));
       } else {
         callback();
       }
     };
     return{
       menuInfo: this.$route.params.id === undefined ? '新增' : '编辑',
       isCheck:'',
       editorOption:{},
       addressDialogVisible:false,
       addressForm:{},//选中的地址
       solution: {
         group:'',
         solutionCategory:'',
         company:'',
         period:'',
         solutionName:'',
         productName:'',
         directPrice:'',
         testingContent:'',
         clinicalSense:'',
         informedInfo:'',
         fitCrowd:'',
         sampleType:'',
         collectionMode:'',
         keepMode:'',
         transportMode:'',
         productArea:'',
         receiveAddressId:'',
         imgPath:''
       },
       groupOptions:[],//产品所属分组下拉框
       solutionCategoryOptions:[],//癌种分类下拉框
       companyOptions:[],//实验室下拉框
       areaOptions:[{name:'全部'},{name:'北京市'},{name:'河南省'},{name:'河北省'},{name:'陕西省'},{name:'青海省'}
         ,{name:'广西壮族自治区'},{name:'江苏省'},{name:'甘肃省'},{name:'浙江省'},{name:'湖北省'}
         ,{name:'安徽省'},{name:'山西省'},{name:'云南省'},{name:'海南省'},{name:'浙江省'}
         ,{name:'四川省'},{name:'山东省'},{name:'天津市'},{name:'湖南省'},{name:'江西省'},{name:'重庆市'}
         ,{name:'内蒙古自治区'},{name:'贵州省'},{name:'广东省'},{name:'上海市'},{name:'辽宁省'},{name:'福建省'}
         ,{name:'黑龙江省'},{name:'吉林省'},{name:'新疆维吾尔自治区'},{name:'宁夏回族自治区'}],//省份下拉框
       rules: {
         group:[{ required: true, message: '请选择产品所属分组', trigger: 'change' }],
         solutionCategory:[{ required: true, message: '请选择癌种分类', trigger: 'change' }],
         company:[{ required: true, message: '请选择实验室', trigger: 'change' }],
         period:[{ required: true, message: '请输入检测周期', trigger: 'blur' }],
         solutionName:[{ required: true, message: '请输入产品名称', trigger: 'blur' }],
         productName:[{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
         directPrice:[{ required: true, message: '请输入价格', trigger: 'blur' },
           {validator: validateMoney, trigger: 'blur'}],
         testingContent:[{ required: true, message: '请输入检测内容', trigger: 'blur' }],
         clinicalSense:[{ required: true, message: '请输入检测意义', trigger: 'blur' }],
         informedInfo:[{ required: true, message: '请输入知情', trigger: 'blur' }],
         fitCrowd:[{ required: true, message: '请输入使用人群', trigger: 'blur' }],
         sampleType:[{ required: true, message: '请输入样本类型', trigger: 'blur' }],
         collectionMode:[{ required: true, message: '请输入采集摘要', trigger: 'blur' }],
         keepMode:[{ required: true, message: '请输入保存方式', trigger: 'blur' }],
         transportMode:[{ required: true, message: '请输入运输方式', trigger: 'blur' }],
         productArea:[{ required: true, message: '请选择省份', trigger: 'change' }],
         receiveAddressId:[{ required: true, message: '请选择样本收样地址', trigger: 'blur' }]
       }
     }
   },
  created() {
    if(this.$route.params.id) this.doDetail()
    this.getGroupOptions()
    this.getSolutionCategoryOptions()
    this.getCompanyOptions()
    this.$nextTick(() => {
      this.$refs['solutionForm'].clearValidate()
    })
  },
  methods:{
    /*获取选中的地址 val:object*/
    getAddress(val){
      this.addressForm = val
      this.solution.receiveAddressId = val.id
    },
     /*富文本*/
    onEditorChange() {
    },
     /*保存，判断是新增还是编辑*/
     handleSave(formName){
       this.$refs[formName].validate((valid) => {
         if (valid) {
           let that = this
           if(that.$route.params.id){
             that.doEdit()
           }else{
             that.doAdd()
           }
         } else {
           return false;
         }
       });
     },
    /*新增接口*/
    doAdd(){
      this.axios.post('solution', {
        solutionId:this.$route.params.id,
        ...this.solution
      }).then(res => {
        if (res.data === '修改成功') {
          this.$message({message: '新增成功', type: 'success'})
          this.$router.push('/product')
        } else {
          this.$message({message: '新增失败', type: 'warning'})
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /*编辑接口*/
    doEdit(){
      delete this.solution.receive
      this.axios.put('solution', {
        solutionId:this.$route.params.id,
       ...this.solution
      }).then(res => {
        if(res.data.msg === '修改成功'){
          this.$message({message: '修改成功', type: 'success'})
          this.$router.push('/product')
        } else {
          this.$message({message: '修改失败', type: 'warning'})
        }
      }).catch(err => {
        this.$message({message: '修改失败', type: 'error'})
      })
    },
    /*编辑回显*/
    doDetail(){
      this.axios.get('solution/'+ this.$route.params.id).then(res => {
        if(res.data) {
          let that = this
          that.solution = res.data
          that.addressForm = that.solution.receive
          that.solution.receiveAddressId = that.solution.receive.id
        }
      }).catch(err => {
        console.log(err)
      })
    },
     /*获取产品所属分组下拉*/
     getGroupOptions(){
       this.axios.get('solution/group').then(res => {
         this.groupOptions = res.data
       }).catch(err => {
         console.log(err)
       })
     },
    /*获取癌种分类下拉*/
    getSolutionCategoryOptions(){
      this.axios.get('solution/category').then(res => {
        if(res.data){
          this.solutionCategoryOptions = res.data
          //将全部移动到第一位
          const num = this.solutionCategoryOptions.findIndex((v)=>{return v.name === '全部'})
          const all = this.solutionCategoryOptions[num]
          this.solutionCategoryOptions.splice(num,1)
          this.solutionCategoryOptions = [all,...this.solutionCategoryOptions]
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /*获取实验室下拉框*/
    getCompanyOptions(){
      this.axios.get('solution/company').then(res => {
        this.companyOptions = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
 }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .solution-container {
    margin: 20px 0;
    padding: 20px;
    background: #ffffff;
    .el-input {
      width: 100%;
    }
  }
  .solution-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .edit-form {
    /*max-width: 500px;*/
  }
  .check{
    color: #606266;
    font-size: 12px;
  }
  .width-100-p {
    width: 100%
  }
  .img-content {
    margin: 20px 0 20px 20px;
    height: 700px;
    background: #ffffff;
    overflow: auto;
    img {
      width: 100%;
    }
  }
</style>
<style lang="scss">
  .edit-product{
    .el-select {
      width: 300px;
    }
    .el-dialog{
      min-height: 400px;
    }
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 20px;
    }
    .ql-toolbar.ql-snow + .ql-container.ql-snow{
      min-height: 150px;
    }
  }
  .my-dialog{
    .el-dialog__body{
      max-height: 500px;
      overflow-y: auto;
    }
  }
</style>
