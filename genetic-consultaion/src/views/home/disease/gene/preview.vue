<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/gene' }">基因信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="gene-container"> 
          <el-form ref="solutionForm" :model="gene" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="left">
            <el-form-item label="基因*">
              <el-input v-model="gene.gene" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="其他名称">
              <el-input v-model="gene.alias" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="外显子数">
              <el-input v-model="gene.exon" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="内含子数">
              <el-input v-model="gene.intron" placeholder="请输入名称"></el-input>
            </el-form-item> 
          </div>
          <div class="right">
            <el-form-item label="NM号">
              <el-input v-model="gene.nm" placeholder="请输入名称"></el-input>
            </el-form-item> 
            <el-form-item label="相关基因">
               <el-select
                v-model="relatedgene"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="geneRemote"
                :loading="geneLoading">
                <el-option
                  v-for="item in geneOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>  
              <el-form-item label="靶向用药">
                <el-select
                v-model="medicaId"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="medica"
                :loading="medicaLoading">
                <el-option
                  v-for="item in medicaOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              </el-form-item>
              <el-form-item label="检测产品">
                <el-select
                v-model="productId"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="product"
                :loading="productLoading">
                <el-option
                  v-for="item in productOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              </el-form-item>
          </div>   
          </el-form>
          <ul class="gene-list" >
            其他
          </ul> 
          <div class="gene-contents"> 
              <p class="title">标题：<input placeholder="请输入标题" v-model="title" type="text"></p>
          </div>
          <div class="edit_container">
              <quill-editor 
                v-model="content" 
                ref="myQuillEditor" 
                :options="editorOption" 
                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
              </quill-editor>
              <button @click="saveHtml">保存</button>
          </div>
          <div class="gene-select">
              <p>数据来源</p>
                <el-select v-model="source" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="source1" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              </div>
           <div class="gene-btns">
                <el-button type="primary" @click="addData" :disabled = "openIsDisabled">发布</el-button>
                <el-button type="primary" :disabled = " openIsDisabled ">预览</el-button>
                <el-button type="primary" @click="disableds">暂存</el-button>
                <el-button @click="cancel" :disabled = " openIsDisabled ">取消</el-button> 
           </div>
        </div> 
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'GeneEdit',
  data () {
    return { 
      gene: {
        gene:'',
        alias:'',
        exon:'',
        intron:'',
        nm:'', 
        source: {}
      },
      source:'',
      source1:'',
      testproduct:'',
      targeting:'',
      content:'', 
      proDepts: [],
      list:[{name:'其他',id:1}],
      cur:0,
      value: [],
      openIsDisabled:false,
      title:'',
      //检测基因
      relatedgene:[],
      geneOption: [],
      geneList: [],
      geneLoading: false,
      geneState: [],
      //靶向用药
      medicaId:[],
      medicaOption: [],
      medicaList: [],
      medicaLoading: false,
      medicaState: [], 
      //检测产品
      productId:[],
      productOption: [],
      productList: [],
      productLoading: false,
      productState: [], 
      sessionData:{}
    }
  }, 
  mounted () {
    //相关基因
    this.geneList = this.geneState.map(item => {
      return { value: item, label: item };
    });
    //靶向用药
    this.medicaList = this.medicaState.map(item => {
      return { value: item, label: item };
    });
    //相关产品
    this.productList = this.productState.map(item => {
      return { value: item, label: item };
    });
    console.log(JSON.parse(window.sessionStorage.getItem("data")))
     this.sessionData = JSON.parse(window.sessionStorage.getItem("data"))
     console.log(this.sessionData.name)
  },
  methods: {
     addData(){
     let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
      let _this = this
      instance({
        url:'gene/addGene',
        method:'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        data:{ 
          "geneTem":{
            gene:this.sessionData.gene,
            exon:this.sessionData.exon,
            intron:this.sessionData.intron,
            nm:this.sessionData.nm,
            alias:this.sessionData.alias,
            diseaseIds:this.sessionStorage.diseaseIds,
            productIds:this.sessionData.productId,
            druggeryIds:this.sessionStorage.druggeryIds}
        }
      }).then(res=>{
        this.$message('发布成功') 
      })
    },
    //基因
    geneGetdata(gene){
      this.axios({
        url:'http://39.106.167.28/mdhcare-pc/product/getProductByName',
        params:{
          param:gene
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
    //靶向用药
    medicaGetdata(medica){
      this.axios({
        url:'druggery/all',
        params:{
          keyWord:medica
        }
      }).then(res=>{
        this.medicaOption= res.data.products.list.map((item,index)=>{
         return {
            "id" : item.id,
            "name":item.name
          }
        });
        this.medicaState = res.data.proDepts.list.map((item,index)=>{
         return item.name
       })
      })
    },
    medica(query) {
      this.medicaGetdata(query)
        if (query !== '') {
          this.medicaLoading = true;
          setTimeout(() => {
            this.medicaLoading = false;
          }, 200);
        } else {
          this.medicaOption = [];
        }
    },
    //检测产品
    productGetdata(product){
      this.axios({
        url:'http://39.106.167.28/mdhcare-pc/product/getProductByName',
        params:{
          param:product
        }
      }).then(res=>{
        this.productOption= res.data.products.list.map((item,index)=>{
         return {
            "id" : item.id,
            "name":item.name
          }
        });
        this.productState = res.data.proDepts.list.map((item,index)=>{
         return item.name
       })
      })
    },
    product(query) {
      this.productGetdata(query)
        if (query !== '') {
          this.productLoading = true;
          setTimeout(() => {
            this.productLoading = false;
          }, 200);
        } else {
          this.productOption = [];
        }
    },
    //暂存按钮
    disableds(){
      console.log(this.gene.gene,this.gene.alias,this.gene.exon,this.gene.intron,this.gene.nm,this.content) 
      this.openIsDisabled = !this.openIsDisabled
    },
    //富文本
    onEditorReady(editor) { }, // 准备编辑器,
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){}, // 内容改变事件
        saveHtml:function(event){
          alert(this.content)
        },
    _initData () {
      if (this.$route.params.id !== undefined) {
        this.axios.get('gene/' + this.$route.params.id).then(res => {
          this.gene = res.data
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
          url: 'gene',
          data: {
            gene: this.gene,
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
            _this.$router.push('/gene')
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
          url: 'gene/' + this.$route.params.id,
          data: {
            gene: this.gene,
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
          _this.$router.push('/gene')
        }).catch(function () {
          _this.$message({
            message: '修改失败',
            type: 'error'
          })
        })
      }
    },
    cancel () {
      this.$router.push('/gene')
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
  .gene-select{
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: space-around;
  }
  .title{ 
      background: #f3f3f3;
      padding-left: 5px;
        input{
          width: 93%;
          border:0;
          outline: none;
          height: 28px;      
          background: #f3f3f3; 
        }
    }
  .gene-list{
    width: 100%;
    height: 50px;
    background: #f3f3f3;
    display: flex;
    line-height: 50px;
    li{
      width: 25%;
    }
  }
  .gene-contents{
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }
  .gene-btns{
    width: 100%;
    text-align: center;
    .el-button{
      margin:0 2%;
    }
  }
  .gene-container {
    width: 100%;
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .left{
      width: 50%;
      float: left;
      height: 100%;
    }
    .right{
      width:50%;
      float: right;
      height: 100%;
    }
    .el-input {
      width: 100%;
    }
    .edit-form {
      max-width: 800px;
      .url-name {
        width: 160px;
        float: left;
      }
      .url {
        margin-left: 20px;
        width: calc(100% - 180px);
        float: left;
      }
    }
  }
  .gene-container .header {
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
