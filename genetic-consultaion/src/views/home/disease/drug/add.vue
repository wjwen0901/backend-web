<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/drug' }">疾病信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>新增</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="drug-container">
          <el-form ref="solutionForm"  label-width="100px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="中文标题*"> 
                <el-input v-model="drug.drugName" :disabled="drugNames" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="制定者*">
                <el-input v-model="drug.customizer" :disabled="customizers" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="发布日期*"> 
                 <el-date-picker
                    v-model="drug.inaccurate"
                    :disabled="inaccurates"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
              </el-form-item> 
              <el-form-item label="检测产品">
               <el-select 
                  v-model="product"
                  :disabled="products"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="loadings">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="英文标题*">
                <el-input v-model="drug.drugNameEn" :disabled="drugNameEns" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="出处*">
                <el-input v-model="drug.producer" :disabled="producers" placeholder="请输入名称"></el-input>
              </el-form-item> 
              <el-form-item label="相关疾病">
                 <el-select
                  v-model="disease"
                  :disabled="diseases"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="diseaseRemote"
                  :loading="diseaseLoading">
                  <el-option
                    v-for="item in diseaseOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="相关基因">
                 <el-select
                  v-model="gene"
                  :disabled="genes"
                  multiple
                  filterable
                  remote
                  reserve-keyword 
                  placeholder="请输入关键词"
                  :remote-method="geneRemote"
                  :loading="geneLoading">
                  <el-option
                    v-for="item in geneoption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-line">
              <ul class="form-list" >
                <li v-for="(item,index) in list" :key="index" @click="cur=index" :class="{active:cur==index}">
                 {{item.id}}.{{item.name}}
                </li> 
              </ul>
              <div class="from-contents" v-show="cur==0">
                <div class="ap-upload">
                <div class="u-select">
                  <div class="upload-row">
                    <div tabindex="0" class="el-upload el-upload--picture-card" id="selectfiles">
                      <i class="el-icon-plus"></i>
                      <input type="file" name="file" multiple="multiple" class="el-upload__input">
                    </div>
                     <div class="el-upload__tip">只能上传jpg/gif/png/bmp/pdf文件，且不超过5G</div> 
                    <ul class="el-upload-list el-upload-list--text" id="ossfile">
                      <li tabindex="0" class="el-upload-list__item is-ready" :id="file.id" v-for="file in fileList" v-bind:key="file.id" ref="file.id">
                        <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{file.name}} ({{file.size | formatSize}})</a>
                        <label class="el-upload-list__item-status-label">
                          <i class="el-icon-upload-success el-icon-circle-check"></i>
                        </label>
                        <i class="el-icon-close" @click="deleteUploadFile(file.id)"></i>
                        <i class="el-icon-close-tip">按 delete 键可删除</i>
                        <el-progress :percentage="file.percent" v-if="file.percent !== 100"></el-progress>
                      </li>
                    </ul>
                    <div id="container"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="from-contents" v-show="cur==1">
                <div class="edit_container">
                    <quill-editor 
                      v-model="content" 
                      :disabled="countenes"
                      ref="myQuillEditor" 
                      :options="editorOption" 
                      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                      @change="onEditorChange($event)">
                    </quill-editor>
                    <button @click="saveHtml">保存</button>
                </div>
              </div>
               <div class="from-select">
              <p>数据来源</p>
                <el-select v-model="value" :disabled="values" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="value1" :disabled="value1s" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              </div>
           <el-form-item class="from-btns">
                <el-button type="primary" @click="addData" :disabled = "openIsDisabled">发布</el-button>
                <el-button type="primary" @click="preview" :disabled = " openIsDisabled ">预览</el-button>
                <el-button type="primary"  @click="disableds">暂存</el-button>
                <el-button @click="cancel" :disabled = " openIsDisabled ">取消</el-button> 
            </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'DiseaseEdit',
  data () {
    return {
      data: [],
      addRowData: ['add'],
      fda: {},
      cfda: {}, 
      drug: {
        source: {},
        drugName:'',
        customizer:[],
        inaccurate:[], 
        drugNameEn:[],
        producer:[], 
      },
      product: [],
      disease:[],
      gene:[],  
      content:'',
      sampleMeta: [],
      proDepts: [],
      reportType: [],
      consultancy: [],
      deptList: [], 
      reportTypeOtherRemark: '',
      consultancyOtherRemark: '',
      cur: 0,
      list:[{name:'指南',id:1},{name:'其他',id:2}],
      openIsDisabled:false,
      options: [],
      diseaseOption: [],
      geneOption: [],
      value: [],
      lists: [],
      geneList: [],
      diseaseList: [],
      loadings: false,
      geneLoading: false,      
      diseaseLoading: false,
      states: [],
      diseaseState: [],
      geneState: [],
      //禁止
      drugNames:false,
      customizers:false,
      inaccurates:false,
      products:false,
      drugNameEns:false,
      producers:false,
      diseases:false,
      genes:false,
      countenes:false,
      values:false,
      value1s:false
    }
  },
  props: {},
  mounted () {
    this.lists = this.states.map(item => { 
        return { value: item.id, label: item.name };
      });
      this.diseaseList = this.diseaseState.map(item => { 
        return { value: item.id, label: item.name };
      });
      this.geneList = this.geneState.map(item => { 
        return { value: item.id, label: item.name };
      });
  },
  methods: { 
    //预览
    preview(){
      this.$router.push({
        name:'DrugPreview'
      })
      var obj = {};
      obj.intro=this.content,
      obj.title=this.drug.drugName,
      obj.titleEn=this.drug.drugNameEn,
      obj.framers=this.drug.customizer,
      obj.provenance=this.drug.producer,
      obj.publishDate=this.drug.inaccurate,
      obj.diseaseIds=this.disease,
      obj.productIds=this.product 
      obj.geneIds= this.gene
      window.sessionStorage.setItem('drug',JSON.stringify(obj))
    },
    //检测产品、
    getData(product){ 
      this.axios({
        url:'http://39.106.167.28/mdhcare-pc/product/getProductByName',
        params:{
          param:product
        }
      }).then(res=>{ 
        this.options= res.data.products.list.map((item,index)=>{
         return {
            "id" : item.id,
            "name":item.name
          }
        })  
        this.states = res.data.proDepts.list.map((item,index)=>{
         return item.name
       })  
      })
    }, 
    remoteMethod(query) {    
      this.getData(query)
      if (query !== '') {
        this.loadings = true;
        setTimeout(() => {
          this.loadings = false; 
        }, 200);
      } else {
        this.options = [];
      }
    }, 
    //相关疾病
     diseaseGetdata(disease){
      this.axios({
        url:'http://39.106.167.28/mdhcare-pc/product/getProductByName',
        params:{
          param:disease
        }
      }).then(res=>{
        this.diseaseOption= res.data.products.list.map((item,index)=>{
         return {
            "id" : item.id,
            "name":item.name
          }
        });
        this.diseaseState = res.data.proDepts.list.map((item,index)=>{
         return item.name
       }) 
      })
    },
    diseaseRemote(query) {  
      this.diseaseGetdata(query)
      if (query !== '') {
        this.diseaseLoading = true;
        setTimeout(() => {
          this.diseaseLoading = false; 
        }, 200);
      } else {
        this.diseaseOption = [];
      }
    },
    //相关基因
    geneGetdata(gene){
      this.axios({ 
        url:'gene/all',
        params:{
          keyWord:gene
        }
      }).then(res=>{
        this.geneOption= res.data.products.list.map((item,index)=>{
         return {
            "id" : item.id,
            "name":item.name
          }
        });
        this.geneState = res.data.proDepts.list.map((item,index)=>{
         return item.name
       }) 
      })
    },
    geneRemote(query) {   
      this.geneGetdata(query)
      if (query !== '') {
        this.geneLoading = true;
        setTimeout(() => {
          this.geneLoading = false;
        }, 200);
      } else {
        this.geneOption = [];
      }
    },
    addData(){
       let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
      let _this = this
      instance({
        url:'guide/addGuide',
        method:'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        data:{ 
          "guideTem":{ 
              intro:this.content,
              title:this.drug.drugName,
              titleEn:this.drug.drugNameEn,
              framers:this.drug.customizer,
              provenance:this.drug.producer,
              publishDate:this.drug.inaccurate,
              diseaseIds:this.disease,
              geneIds: this.gene
            },
            productIds:this.product 
        }
      }).then(res=>{
        this.$message('发布成功') 
      })
    },
    //暂存
    disableds(){  
      this.openIsDisabled = !this.openIsDisabled;
      this.drugNames = !this.drugNames
      this.customizers = !this.customizers
      this.inaccurates = !this.inaccurates
      this.products = !this.products
      this.drugNameEns = !this.drugNameEns
      this.producers = !this.producers
      this.diseases = !this.diseases
      this.genes = !this.genes
      this.countenes = !this.countenes
      this.values = !this.values
      this.value1s = !this.value1s
      let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
      let _this = this
      instance({
        url:'guide/addTem',
        method:'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        data:{ 
          "guideTem":{ 
              intro:this.content,
              title:this.drug.drugName,
              titleEn:this.drug.drugNameEn,
              framers:this.drug.customizer,
              provenance:this.drug.producer,
              publishDate:this.drug.inaccurate,
              diseaseIds:this.disease,
              geneIds: this.gene
            },
            productIds:this.product 
        }
      }).then(res=>{
        this.$message('暂存成功') 
      })
    },
    onEditorReady(editor) { }, // 准备编辑器,
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){}, // 内容改变事件
        saveHtml:function(event){
          alert(this.content)
    },
    _initData () {
      if (this.$route.params.id !== undefined) {
        this.axios.get('drug/' + this.$route.params.id).then(res => {
          this.drug = res.data
          this.sampleMeta = res.data.sampleMeta
          this.proDepts = res.data.deptName
          if (res.data.expand !== undefined) {
            let _this = this
            res.data.expand.forEach(function (item) {
              if (item.type === 0) {
                _this.reportType.push(item.name)
                if (item.remark !== undefined) {
                  _this.reportTypeOtherRemark = item.remark
                }
              } else {
                _this.consultancy.push(item.name)
                if (item.remark !== undefined) {
                  _this.consultancyOtherRemark = item.remark
                }
              }
            })
          }
          console.log(this.reportType)
          console.log(this.consultancy)
        }).catch(err => {
          console.log(err)
        })
      }
      this.axios.get('hospital-dept').then(res => {
        this.deptList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    edit () {
      if (this.$route.params.id === undefined) {
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'post',
          url: 'drug',
          data: {
            drug: this.drug,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            userId: window.localStorage.userId
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (res) {
          if (res.data.state === 'exist alreay!') {
            _this.$message({
              message: '产品名称重复',
              type: 'error'
            })
          } else {
            _this.$message({
              message: '新增成功',
              type: 'success'
            })
            _this.$router.push('/drug')
          }
        }).catch(function () {
          _this.$message({
            message: '新增失败',
            type: 'error'
          })
        })
      } else {
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'put',
          url: 'drug/' + this.$route.params.id,
          data: {
            drug: this.drug,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            solutionExpands: this.expandParams,
            userId: window.localStorage.userId
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function () {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this.$router.push('/drug')
        }).catch(function () {
          _this.$message({
            message: '修改失败',
            type: 'error'
          })
        })
      }
    },
    cancel () {
      this.$router.push('/drug')
    }
  },
  filters: {},
  computed: {
    expandParams: function () {
      let result = []
      let _this = this
      if (this.reportType !== null) {
        _this.reportType.forEach(function (item) {
          let expandParams = {
            'name': item,
            'type': 0
          }
          if (_this.reportTypeOtherRemark !== '' && item === 3) {
            expandParams.remark = _this.reportTypeOtherRemark
          }
          result.push(expandParams)
        })
      }
      if (this.consultancy !== null) {
        this.consultancy.forEach(function (item) {
          let expandParams = {
            'name': item,
            'type': 1
          }
          if (_this.consultancyOtherRemark !== '' && item === 4) {
            expandParams.remark = _this.consultancyOtherRemark
          }
          result.push(expandParams)
        })
      }
      console.log(result)
      return result
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
  
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .float-l {
    float: left;
  }
  .drug-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .el-input {
      width: 100%;
    }
    .edit-form {
      width: calc(100% - 40px);
      .form-left {
        width: 40%;
        float: left;
      }
      .form-right {
        padding-left: 60px;
        width: 40%;
        float: left;
      }
      .form-line {
        width: calc(80% + 60px);
        float: left;
        .btns {
          margin-left: -80px;
        }
      }
      .url-name {
        width: 200px;
        float: left;
      }
      .url {
        margin-left: 20px;
        width: 600px;
        float: left;
      }
    }
  }
  .form-list{
    width: 100%;
    display: flex;
    height: 100px;
    line-height: 100px;
    background: #f3f3f3;
    li{
      width: 20%;
      text-align: center;
    }
  }
  .from-select{
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: space-around;
  }
  .from-contents{
    width: 100%;
    height: 200px;
    margin-bottom: 10px;
  }
  .from-btns{
    width: 100%;
    text-align: center;
    .el-button{
      margin:0 2%;
    }
  }
  .drug-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .width-100-p {
    width: 100%
  }
  .img-content {
    margin: 20px 0px 20px 20px;
    height: 700px;
    background: #ffffff;
    overflow: auto;
    img {
      width: 100%;
    }
  }
</style>
