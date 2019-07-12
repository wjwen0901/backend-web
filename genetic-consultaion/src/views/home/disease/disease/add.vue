<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/disease' }">疾病信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>新增</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="disease-container">
          <el-form ref="solutionForm"  :model="disease" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="中文名称*">
                <el-input v-model="disease.name" :disabled="cname"  placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="英文名称*">
                <el-input v-model="disease.nameen" :disabled="ename" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="其他名称">
                <el-input v-model="disease.alias" :disabled="qname" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="OMIM">
                <el-input v-model="disease.omim" :disabled="omims" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="疾病类型">
                <el-input v-model="disease.distype" :disabled="jdistype" placeholder="请输入名称"></el-input>
              </el-form-item>
             <el-form-item label="靶向用药">
                <el-select
                v-model="medicaId"
                :disabled="bmedicaId"
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
              <el-form-item label="相关指南">
               <el-select
                v-model="guideId"
                :disabled="xgudeId"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="guide"
                :loading="guideLoading">
                <el-option
                  v-for="item in guideOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="遗传方式">
                <el-input v-model="disease.mode" :disabled="ymode" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="突变类型">
                <el-input v-model="disease.muttype" :disabled="tmuttype" placeholder="请输入名称"></el-input> 
              </el-form-item>
              <el-form-item label="发病年龄">
                <el-input v-model="disease.age" :disabled="fage" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="发病概率">
                <el-input v-model="disease.morbidity" :disabled="fmorbidity" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="适用科室">
              <el-select class="width-100-p" v-model="prodepts"  :disabled="sprodepts" multiple filterable placeholder="请选择">
                <el-option
                  v-for="item in deptList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="检测产品">
                <el-select
                v-model="productId"
                :disabled="jproductId"
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
              <el-form-item label="相关基因">
               <el-select
                v-model="relatedgene"
                :disabled="xrelatedgene"
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
            </div>
            <div class="form-line">
              <ul class="list">
                <li v-for="(item,index) in list " :key="index"  @click="cur=index" :class="{active:cur==index}">
                  {{item.id}}.{{item.name}}
                </li>
              </ul> 
              <div class="content" v-show="cur==0">
                <p>12简介</p>
                <p class="title">标题：<input placeholder="请输入标题" :disabled='btitle0' v-model="title" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content0" 
                    :disabled='fcontent0'
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="content" v-show="cur==1">
                <p>简3介</p>
                <p class="title">标题：<input placeholder="请输入标题" :disabled='btitle1' type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content1" 
                    :disabled='fcontent1'
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="content" v-show="cur==2">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" :disabled='btitle2' type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content2" 
                    :disabled='fcontent2'
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="content" v-show="cur==3">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" :disabled='btitle3' type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content3" 
                    :disabled='fcontent3' 
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="content" v-show="cur==4">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" :disabled='btitle4' type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content4" 
                    :disabled='fcontent4'
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="content" v-show="cur==5">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" :disabled='btitle5' type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content5" 
                    :disabled='fcontent5'
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="content" v-show="cur==6">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" :disabled='btitle6' type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content6"
                    :dsiabled='fcontent6' 
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="content" v-show="cur==7">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" :disabled='btitle7' type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content7" 
                    :disabled='fcontent7'
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="content" v-show="cur==8">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" :disabled='btitle8' type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content8" 
                    :disabled='fcontent8'
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="content" v-show="cur==9">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" :disabled='btitle9' type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content9" 
                    :disabled='fcontent9'
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="select">
                <el-select v-model="value" :disabled="values" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="value1" :disabled="values1" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              </div>  
              <el-form-item class="btns">
                <el-button type="primary" @click="addData" :disabled = "openIsDisabled">发布</el-button>
                <el-button type="primary" @click="preview" :disabled = " openIsDisabled ">预览</el-button>
                <el-button type="primary" @click="disabeleds">暂存</el-button>
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
      //禁止
      cname:false,
      ename:false,
      qname:false,
      omims:false,
      jdistype:false,
      bmedicaId:false,
      xgudeId:false,
      tmuttype:false,
      ymode:false,
      fage:false,
      fmorbidity:false,
      sprodepts:false,
      jproductId:false,
      xrelatedgene:false,
      fcontent0:false,
      fcontent1:false,
      fcontent2:false,
      fcontent3:false,
      fcontent4:false,
      fcontent5:false,
      fcontent6:false,
      fcontent7:false,
      fcontent8:false,
      fcontent9:false,
      btitle0:false,
      btitle1:false,
      btitle2:false,
      btitle3:false,
      btitle4:false,
      btitle5:false,
      btitle6:false,
      btitle7:false,
      btitle8:false,
      btitle9:false,
      values1:false,
      values:false,
      data: [],
      addRowData: ['add'], 
      disease: {
        name:'',
        nameen:'',
        alias:'',
        omim:'',
        distype:'',
        deptId:'',
        guide:'',
        mode:'',
        muttype:'',
        age:'',
        morbidity:'',
        department:'',
        product:'',
        gene:''
      },    
      title:'',
      content0:'',
      content1:'',
      content2:'',
      content3:'',
      content4:'',
      content5:'',
      content6:'',
      content7:'',
      content8:'',
      content9:'',
      deptList: [],   
      guideList: [],
      guides: [], 
      loading: false,
      list:[{name:'简介',id:1},{name:'表现',id:2},{name:'预防',id:3},{name:'检测产品',id:1},
      {name:'简介',id:1},{name:'简介',id:1},{name:'简介',id:1},{name:'简介',id:1},
      {name:'简介',id:1},{name:'简介',id:1}],
      options: [],
      value: '', 
      cur:0,
      content: `<p>hello world</p>`,
      editorOption: {},
      openIsDisabled: false, 
      //靶向用药
      medicaId:[],
      medicaOption: [],
      medicaList: [],
      medicaLoading: false,
      medicaState: [], 
      //检测基因
      relatedgene:[],
      geneOption: [],
      geneList: [],
      geneLoading: false,
      geneState: [],
      //检测产品
      productId:[],
      productOption: [],
      productList: [],
      productLoading: false,
      productState: [], 
      //相关指南
      guideId:[],
      guideOption: [],
      guideList: [],
      guideLoading: false,
      guideState: [], 
      //科室
      prodepts:[],
      one:false
    }
  },
  props: {},
  mounted () {
    //靶向用药
    this.medicaList = this.medicaState.map(item => {
      return { value: item, label: item };
    });
    //相关基因
    this.geneList = this.geneState.map(item => {
      return { value: item, label: item };
    });
    //相关产品
    this.productList = this.productState.map(item => {
      return { value: item, label: item };
    });
    //相关指南
    this.guideList = this.guideState.map(item => {
      return { value: item, label: item };
    });
    //获取科室列表
    this.getList()
  },
  methods: { 
    //预览
    preview(){
      this.$router.push({
        name:'DrugPreview'
      })
      var obj = {};
      obj.name= this.disease.name,
      obj.nameen=this.disease.nameen,
      obj.muttype= this.disease.muttype,
      obj.mode= this.disease.mode,
      obj.alias= this.disease.alias,
      obj.age= this.disease.age,
      obj.omim= this.disease.omim,
      obj.morbidity= this.disease.morbidity,
      obj.distype=this.disease.distype,
      obj.content="Cornelia de Lange综合征是一种临床异质性发育障碍，伴随多系统受累的畸形。主要临床特征包括面部畸形、手脚畸形、生长延迟、认知障碍、多毛症、胃食管功能障碍和心脏、眼科和泌尿生殖系统异常表征。",
      obj.deptId= [],
      obj.genes=this.relatedgene,
      obj.druggeryIds= [],
      obj.guides= this.guideId,
      obj.diseaseId="5beb9d57e7910c2484a8ef54"
      obj.productIds= this.productId
      window.sessionStorage.setItem('disease',JSON.stringify(obj))
    },
    //科室
    getList(){
      this.axios({
        url:'hospital-dept'
      }).then(res=>{
        this.prodepts=res.data;
        console.log(res.data)
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
    //相关指南
    guideGetdata(guide){
      this.axios({
        url:'http://39.106.167.28/mdhcare-pc/product/getProductByName',
        params:{
          param:guide
        }
      }).then(res=>{
        this.guideOption= res.data.products.list.map((item,index)=>{
         return {
            "id" : item.id,
            "name":item.name
          }
        });
        this.guideState = res.data.proDepts.list.map((item,index)=>{
         return item.name
       })
      })
    },
    guideRemote(query) {
      this.guideGetdata(query)
        if (query !== '') {
          this.guideLoading = true;
          setTimeout(() => {
            this.guideLoading = false;
          }, 200);
        } else {
          this.guideOption = [];
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
    //发布
    addData(){
      let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
      let _this = this
      instance({
        url:'disease/addDisease',
        method:'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        data:{
            "disease": { 
                name: this.disease.name,
                nameen:this.disease.nameen,
                muttype: this.disease.muttype,
                mode: this.disease.mode,
                alias: this.disease.alias,
                age: this.disease.age,
                omim: this.disease.omim,
                morbidity: this.disease.morbidity,
                distype:this.disease.distype,
                content:"Cornelia de Lange综合征是一种临床异质性发育障碍，伴随多系统受累的畸形。主要临床特征包括面部畸形、手脚畸形、生长延迟、认知障碍、多毛症、胃食管功能障碍和心脏、眼科和泌尿生殖系统异常表征。",
                deptId: [],
                genes:this.relatedgene,
                druggeryIds: [],
                guides: this.guideId,
                diseaseId:"5beb9d57e7910c2484a8ef54"
            },
            productIds: this.productId
        }
      }).then(res=>{
        this.$message('发布成功') 
      })
    },
    //暂存按钮
    disabeleds(){
    this.openIsDisabled = !this.openIsDisabled;
      this.cname=!this.cname
      this.ename= !this.ename
      this.qname= !this.qname
      this.omims= !this.omims
      this.jdistype= !this.jdistype
      this.bmedicaId= !this.bmedicaId
      this.xgudeId= !this.xgudeId
      this.tmuttype= !this.tmuttype
      this.ymode= !this.ymode
      this.fage= !this.fage
      this.fmorbidity= !this.morbidity
      this.sprodepts= !this.sprodepts
      this.jproductId= !this.jproductId
      this.xrelatedgene= !this.latedgene
      this.fcontent0= !this.fcontent0
      this.fcontent1= !this.fcontent1
      this.fcontent2= !this.fcontent2
      this.fcontent3= !this.fcontent3
      this.fcontent4= !this.fcontent4
      this.fcontent5= !this.fcontent5
      this.fcontent6= !this.fcontent6
      this.fcontent7= !this.fcontent7
      this.fcontent8= !this.fcontent8
      this.fcontent9= !this.fcontent9
      this.btitle0= !this.btitle0
      this.btitle1= !this.btitle1
      this.btitle2= !this.btitle2
      this.btitle3= !this.btitle3
      this.btitle4= !this.btitle4
      this.btitle5= !this.btitle5
      this.btitle6= !this.btitle6
      this.btitle7= !this.btitle7
      this.btitle8= !this.btitle8
      this.btitle9= !this.btitle9
      this.values1 = !this.values1;
      this.values = !this.values;
      let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
      let _this = this
      instance({
        url:'disease/addTem',
        method:'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        data:{
            "disease": { 
                name: this.disease.name,
                nameen:this.disease.nameen,
                muttype: this.disease.muttype,
                mode: this.disease.mode,
                alias: this.disease.alias,
                age: this.disease.age,
                omim: this.disease.omim,
                morbidity: this.disease.morbidity,
                distype:this.disease.distype,
                content:"Cornelia de Lange综合征是一种临床异质性发育障碍，伴随多系统受累的畸形。主要临床特征包括面部畸形、手脚畸形、生长延迟、认知障碍、多毛症、胃食管功能障碍和心脏、眼科和泌尿生殖系统异常表征。",
                deptId: [],
                genes:this.relatedgene,
                druggeryIds: [],
                guides: this.guideId,
                diseaseId:"5beb9d57e7910c2484a8ef54"
            },
            productIds: this.productId
        }
      }).then(res=>{
        this.$message('发布成功') 
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
      let instance = this.axios.create({
        baseURL: process.env.DISEASE_PC_API,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      if (this.$route.params.id !== undefined) {
        instance({
          method: 'get',
          url: 'diseaseData/getDisease',
          params: {
            id: this.$route.params.id
            
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (res) {
          _this.disease = res.data.disease
          if (_this.disease.deptId === undefined) {
            _this.disease.deptId = []
          } else {
            _this.disease.deptId = _this.disease.deptId.map(Number)
          }
          _this.guides = []
          if (_this.disease.guides !== undefined) {
            _this.guides = _this.disease.guides
          }
          if (_this.disease.catalog === undefined) {
            _this.disease.catalog = []
          }
        })
      }
      instance({
        method: 'get',
        url: 'guide/getGuides',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        },
        params: {
          pageNum: 1,
          pageSize: 10,
          param: ''
        }
      }).then(function (res) {
        _this.guideList = res.data
      })

      this.axios.get('hospital-dept').then(res => {
        this.deptList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    edit () {
      this.disease.deptId = this.disease.deptId.map(String)
      this.disease.guides = this.guides
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
          url: 'disease/eidtDisease',
          data: {
            disease: this.disease,
            userId: window.localStorage.userId
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (res) {
          _this.$message({
            message: '新增成功',
            type: 'success'
          })
          _this.$router.push('/disease')
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
          url: 'disease/eidtDisease',
          data: this.disease,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function () {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this.$router.push('/disease')
        }).catch(function () {
          _this.$message({
            message: '修改失败',
            type: 'error'
          })
        })
      }
    },
    cancel () {
      this.$router.push('/disease')
    },
    remoteMethod (query) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        let instance = this.axios.create({
          baseURL: process.env.DISEASE_PC_API,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'get',
          url: 'guide/getGuides',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          },
          params: {
            pageNum: 1,
            pageSize: 10,
            param: query
          }
        }).then(function (res) {
          _this.guideList = res.data
          console.log(_this.guideList)
        })
      }, 200)
    },
    toAddCatelog () {
      this.disease.catalog.push({'name': '', 'content': ''})
    },
    deleteCatelog (index) {
      this.disease.catalog.splice(index, 1)
    }
  },  
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        }, 
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
  *{
    list-style: none;
  }
  .float-l {
    float: left;
  }
  .list{ 
    width: 100%;
    height: 150px;
    line-height: 75px;
    display: flex;
    background:#ccc;
    flex-wrap: wrap; 
    li{
      width: 180px;
    }
  }
  .select{
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: space-around;
    margin-top: 100px;
  }
  .content{
    width: 100%;
    height: 100px;
    .title{ 
      height: 30px;
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
  }
  .disease-container {
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
          margin-top: 60px;
          text-align: center;
          .el-button{
            margin: 0 20px;
          }
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
  .disease-container .header {
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
