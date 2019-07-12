<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/disease' }">疾病信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="disease-container">
          <el-form ref="solutionForm" :model="disease" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="中文名称*">
                <el-input v-model="disease.name"></el-input>
              </el-form-item>
              <el-form-item label="英文名称*">
                <el-input v-model="disease.nameen"></el-input>
              </el-form-item>
              <el-form-item label="其他名称">
                <el-input v-model="disease.alias"></el-input>
              </el-form-item>
              <el-form-item label="OMIM">
                <el-input v-model="disease.omim"></el-input>
              </el-form-item>
              <el-form-item label="疾病类型">
                <el-input v-model="disease.distype"></el-input>
              </el-form-item>
             <el-form-item label="靶向药物">
                 <el-select
                    v-model="disease.deptId"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loadings">
                    <el-option
                      v-for="item in optionss"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option> 
                </el-select>
              </el-form-item>
              <el-form-item label="相关指南">
                 <el-select
                    v-model="disease.guide"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loadings">
                    <el-option
                      v-for="item in optionss"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option> 
                </el-select>
              </el-form-item> 
            </div>
            <div class="form-right">
              <el-form-item label="遗传方式">
                <el-input v-model="disease.mode"></el-input>
              </el-form-item>
              <el-form-item label="突变类型">
                <el-input v-model="disease.muttype"></el-input>
              </el-form-item>
              <el-form-item label="发病年龄">
                <el-input v-model="disease.age"></el-input>
              </el-form-item>
              <el-form-item label="发病概率">
                <el-input v-model="disease.morbidity"></el-input>
              </el-form-item>
              <el-form-item label="科室*">
                 <el-select
                    v-model="disease.department"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loadings">
                    <el-option
                      v-for="item in optionss"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option> 
                </el-select>
              </el-form-item>
              <el-form-item label="检测产品">
                 <el-select
                    v-model="disease.product"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loadings">
                    <el-option
                      v-for="item in optionss"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option> 
                </el-select>
              </el-form-item>
              <el-form-item label="致病基因">
                 <el-select
                    v-model="disease.gene"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loadings">
                    <el-option
                      v-for="item in optionss"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
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
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content0" 
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
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content1" 
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
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content2" 
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
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content3" 
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
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content4" 
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
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content5" 
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
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content6" 
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
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content7" 
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
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content8" 
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
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p> 
                <div class="edit_container"> 
                <quill-editor 
                    v-model="content9" 
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <button @click="saveHtml">保存</button>
                </div>
              </div>
              <div class="select">
                <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="value1" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              </div>  
              <el-form-item class="btns">
                <el-button type="primary" @click="edit" :disabled = "openIsDisabled">发布</el-button>
                <el-button type="primary" :disabled = " openIsDisabled ">预览</el-button>
                <el-button type="primary" @click="ceshi">暂存</el-button>
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
      content:'',
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
      value1: '',
      cur:0,
      content: `<p>hello world</p>`,
      editorOption: {},
      openIsDisabled: false,
      optionss: [], 
      lists: [],
      loadings: false,
      states: []
    }
  },
  props: {},
  methods: {
    remoteMethod(query) {
        if (query !== '') {
          this.loadings = true;
          setTimeout(() => {
            this.loadings = false;
            this.optionss = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.optionss = [];
      }
    },
    ceshi(){ 
      this.openIsDisabled = !this.openIsDisabled
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
  mounted () {
    this.lists = this.states.map(item => {
        return { value: item, label: item };
      });
  },
  filters: {}, 
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
