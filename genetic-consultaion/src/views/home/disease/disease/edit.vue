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
                <el-input v-model="disease.name" :disabled="cname" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="英文名称*">
                <el-input v-model="disease.nameen" :disabled="ename" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="其他名称">
                <el-input v-model="disease.alias" :disabled="qname" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="OMIM">
                <el-input v-model="disease.omim" :disabled="omims" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="疾病类型">
                <el-input v-model="disease.distype" :disabled="jdistype" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="靶向用药">
                <el-select
                  v-model="newMedica"
                  :disabled="bmedicaId"
                  multiple
                  value-key="name"
                  filterable
                  style="width:410px"
                  remote
                  reserve-keyword
                  :remote-method="medica"
                  :loading="medicaLoading">
                  <el-option
                    v-for="item in medicaOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="相关指南">
                <el-select
                  v-model="guideId"
                  style="width:410px"
                  :disabled="xgudeId"
                  multiple
                  value-key="name"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="guideRemote"
                  :loading="guideLoading">
                  <el-option
                    v-for="item in guideOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="遗传方式">
                <el-input v-model="disease.mode" :disabled="ymode" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="突变类型">
                <el-input v-model="disease.muttype" :disabled="tmuttype" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="发病年龄">
                <el-input v-model="disease.age" :disabled="fage" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="发病概率">
                <el-input v-model="disease.morbidity" :disabled="fmorbidity" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="适用科室">
                <el-select class="width-100-p" v-model="newDept" value-key="name" :disabled="sprodepts" multiple
                           filterable placeholder="请选择">
                  <el-option
                    v-for="item in deptList"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="检测产品">
                <el-select
                  v-model="newProduct"
                  :disabled="jproductId"
                  multiple
                  value-key="name"
                  filterable
                  style="width:410px"
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  :remote-method="product"
                  :loading="productLoading">
                  <el-option
                    v-for="item in productOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="相关基因">
                <el-select
                  v-model="relatedgene"
                  :disabled="xrelatedgene"
                  style="width:410px"
                  multiple
                  value-key="name"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  :remote-method="geneRemote"
                  :loading="geneLoading">
                  <el-option
                    v-for="item in geneOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-line">
              <ul class="list">
                <li v-for="(item,index) in list " :key="index" @click="cur=index" :class="{active:cur==index}">
                  {{item.id}}.{{item.name}}
                </li>
              </ul>
              <div class="content" v-show="cur==0">
                <p class="title">标题：<span>症状</span></p>
                <div class="edit_container">
                  <quill-editor
                    v-model="content2"
                    :disabled='fcontent2'
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                </div>
              </div>
              <div class="content" v-show="cur==1">
                <p class="title">标题：<span>表现</span></p>
                <div class="edit_container">
                  <quill-editor
                    v-model="content3"
                    :disabled='fcontent3'
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                </div>
              </div>
              <div class="content" v-show="cur==2">
                <p class="title">标题：<span>诊断方法</span></p>
                <div class="edit_container">
                  <quill-editor
                    v-model="content4"
                    :disabled='fcontent4'
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                </div>
              </div>
              <div class="content" v-show="cur==3">
                <p class="title">标题：<span>病因及危险因素</span></p>
                <div class="edit_container">
                  <quill-editor
                    v-model="content5"
                    :disabled='fcontent5'
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                </div>
              </div>
              <div class="content" v-show="cur==4">
                <p class="title">标题：<span>预防</span></p>
                <div class="edit_container">
                  <quill-editor
                    v-model="content6"
                    :dsiabled='fcontent6'
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                </div>
              </div>
              <div class="content" v-show="cur==5">
                <p class="title">标题：<span>筛选</span></p>
                <div class="edit_container">
                  <quill-editor
                    v-model="content7"
                    :disabled='fcontent7'
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                </div>
              </div>
              <div class="content" v-show="cur==6">
                <p class="title">标题：<span>治疗方案</span></p>
                <div class="edit_container">
                  <quill-editor
                    v-model="content8"
                    :disabled='fcontent8'
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                </div>
              </div>
              <div class="content" v-show="cur==7">
                <p class="title">标题：<span>其他</span></p>
                <div class="edit_container">
                  <quill-editor
                    v-model="content9"
                    :disabled='fcontent9'
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                </div>
              </div>
              <!-- <div class="select">
                <el-select v-model="value" :disabled="values" placeholder="请选择">
                <el-option
                  v-for="item in valueList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="value1" :disabled="values1" filterable multiple placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              </div>   -->
              <el-form-item class="btns">
                <el-button type="primary" @click="addData" :disabled="openIsDisabled">发布</el-button>
                <el-button type="primary" @click="preview" :disabled=" openIsDisabled ">预览</el-button>
                <el-button type="primary" @click="disabeleds">暂存</el-button>
                <el-button @click="cancel" :disabled=" openIsDisabled ">取消</el-button>
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
      valueList: [],
      newDept: [],
      newMedica: [],
      newProduct: [],
      menuInfo: this.$route.query.id === undefined ? '新增' : '编辑',
      // 禁止
      cname: false,
      ename: false,
      qname: false,
      omims: false,
      jdistype: false,
      bmedicaId: false,
      xgudeId: false,
      tmuttype: false,
      ymode: false,
      fage: false,
      fmorbidity: false,
      sprodepts: false,
      jproductId: false,
      xrelatedgene: false,
      fcontent0: false,
      fcontent1: false,
      fcontent2: false,
      fcontent3: false,
      fcontent4: false,
      fcontent5: false,
      fcontent6: false,
      fcontent7: false,
      fcontent8: false,
      fcontent9: false,
      btitle0: false,
      btitle1: false,
      btitle2: false,
      btitle3: false,
      btitle4: false,
      btitle5: false,
      btitle6: false,
      btitle7: false,
      btitle8: false,
      btitle9: false,
      values1: false,
      values: false,
      data: [],
      addRowData: ['add'],
      disease: {},
      title: '',
      content2: '',
      content3: '',
      content4: '',
      content5: '',
      content6: '',
      content7: '',
      content8: '',
      content9: '',
      deptList: [],
      guideList: [],
      guides: [],
      loading: false,
      list: [
        {name: '症状', id: 1},
        {name: '表现', id: 2},
        {name: '诊断方法', id: 3},
        {name: '病因及危险因素', id: 4},
        {name: '预防', id: 5},
        {name: '筛查', id: 6},
        {name: '治疗方案', id: 7},
        {name: '其他', id: 8}
      ],
      options: [],
      value: '',
      cur: 0,
      content: `<p>hello world</p>`,
      editorOption: {},
      openIsDisabled: false,
      //靶向用药
      medicaId: [],
      medicaOption: [],
      medicaList: [],
      medicaLoading: false,
      medicaState: [],
      //检测基因
      relatedgene: [],
      geneOption: [],
      geneList: [],
      geneLoading: false,
      geneState: [],
      //检测产品
      productId: [],
      productOption: [],
      productList: [],
      productLoading: false,
      productState: [],
      //相关指南
      guideId: [],
      guideOption: [],
      guideList: [],
      guideLoading: false,
      guideState: [],
      //科室
      prodepts: [],
      one: false,
      datas: {},
      state: '',
      dataone: {}
    };
  },
  mounted() {
    //靶向用药
    this.medicaList = this.medicaState.map(item => {
      return {value: item, label: item};
    });
    //相关基因
    this.geneList = this.geneState.map(item => {
      return {value: item, label: item};
    });
    //相关产品
    this.productList = this.productState.map(item => {
      return {value: item, label: item};
    });
    //相关指南
    this.guideList = this.guideState.map(item => {
      return {value: item, label: item};
    });
    this.state = this.$route.query.state;
    this.companyIds();
    this.getCompany();
    this.getDatas();

    //获取科室列表
    this.getList();
  },
  methods: {
    getCompany() {
      this.axios({
        url: 'company'
      }).then(res => {
        this.valueList = res.data;
      });
    },
    companyIds() {
      this.axios({
        url: 'solution/solutionByCompany',
        params: {
          companyId: this.proDepts
        }
      }).then(res => {
        this.options = res.data.solutions;
      });
    },
    //预览
    preview() {
      var obj = {};
      (obj.name = this.disease.name),
        (obj.nameen = this.disease.nameen),
        (obj.muttype = this.disease.muttype),
        (obj.mode = this.disease.mode),
        (obj.alias = this.disease.alias),
        (obj.age = this.disease.age),
        (obj.omim = this.disease.omim),
        (obj.morbidity = this.disease.morbidity),
        (obj.distype = this.disease.distype),
        (obj.catalog = [
          {症状: this.content2},
          {表现: this.content3},
          {诊断方法: this.content4},
          {病因及危险因素: this.content5},
          {预防: this.content6},
          {筛查: this.content7},
          {治疗方案: this.content8},
          {其他: this.content9}
        ]),
        (obj.deptId = this.newDept),
        (obj.genes = this.relatedgene),
        (obj.druggeryIds = this.newMedica);
      (obj.guides = this.guideId), (obj.productIds = this.newProduct);
      obj.diseaseId = this.diseaseId;
      window.sessionStorage.setItem('disease', JSON.stringify(obj));
      this.$router.push({
        name: 'DiseasePreview',
        query: {
          id: this.$route.query.id,
          state: this.$route.query.state
        }
      });
    },
    //发布
    addData() {
      var guideIds = this.guideId.map((item, index) => {
        return {guideId: item};
      });
      var druggeryIds = this.newMedica.map(item => {
        return item.id;
      });
      var productIds = this.newProduct.map(item => {
        return item.id;
      });
      var deptId = this.newDept.map(item => {
        return item.id;
      });
      var genes = this.relatedgene.map(item => {
        return item.id;
      });
      if (this.$route.query.id == undefined) {
        if (
          this.disease.name == undefined &&
          this.disease.nameen == undefined
        ) {
          this.$message('请输入带有*的信息');
        } else {
          let instance = this.axios.create({
            headers: {
              Authorization: window.localStorage.token,
              'Content-Type': 'application/json'
            }
          });
          let _this = this;
          instance({
            url: 'disease/addDisease',
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            data: {
              disease: {
                name: _this.disease.name,
                nameen: _this.disease.nameen,
                muttype: _this.disease.muttype,
                mode: _this.disease.mode,
                alias: _this.disease.alias,
                age: _this.disease.age,
                omim: _this.disease.omim,
                morbidity: _this.disease.morbidity,
                distype: _this.disease.distype,
                catalog: [
                  {症状: _this.content2},
                  {表现: _this.content3},
                  {诊断方法: _this.content4},
                  {病因及危险因素: _this.content5},
                  {预防: _this.content6},
                  {筛查: _this.content7},
                  {治疗方案: _this.content8},
                  {其他: _this.content9}
                ],
                content: '',
                //科室
                deptId,
                //基因
                genes,
                //靶向
                druggeryIds,
                //指南
                guides: guideIds
              },
              productIds
            }
          })
            .then(res => {
              this.$message({
                type: 'success',
                message: '发布成功'
              });
            })
            .catch(err => {
              this.$message(JSON.parse(err.request.response).mag);
            });
        }
      } else {
        if (this.disease.name == '' && this.disease.nameen == '') {
          this.$message('请输入带有*的信息');
        } else {
          var guideIds = this.guideId.map((item, index) => {
            return {guideId: item};
          });
          if (this.state == 0) {
            let instance = this.axios.create({
              headers: {
                Authorization: window.localStorage.token,
                'Content-Type': 'application/json'
              }
            });
            let _this = this;
            instance({
              url: 'disease/eidtDisease',
              method: 'put',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              },
              data: {
                disease: {
                  id: _this.id,
                  name: _this.disease.name,
                  nameen: _this.disease.nameen,
                  muttype: _this.disease.muttype,
                  mode: _this.disease.mode,
                  alias: _this.disease.alias,
                  age: _this.disease.age,
                  omim: _this.disease.omim,
                  morbidity: _this.disease.morbidity,
                  distype: _this.disease.distype,
                  catalog: [
                    {症状: _this.content2},
                    {表现: _this.content3},
                    {诊断方法: _this.content4},
                    {病因及危险因素: _this.content5},
                    {预防: _this.content6},
                    {筛查: _this.content7},
                    {治疗方案: _this.content8},
                    {其他: _this.content9}
                  ],
                  //科室
                  deptId,
                  //基因
                  genes,
                  //靶向
                  druggeryIds,
                  //指南
                  guides: guideIds
                },
                productIds
              }
            })
              .then(res => {
                this.$message('发布成功');
              })
              .catch(err => {
                this.$message(JSON.parse(err.request.response).mag);
              });
          } else if (this.state == 1) {
            if (this.diseaseId == undefined) {
              let instance = this.axios.create({
                headers: {
                  Authorization: window.localStorage.token,
                  'Content-Type': 'application/json'
                }
              });
              let _this = this;
              instance({
                url: 'disease/addDisease',
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest'
                },
                params: {
                  temId: _this.id
                },
                data: {
                  disease: {
                    name: _this.disease.name,
                    nameen: _this.disease.nameen,
                    muttype: _this.disease.muttype,
                    mode: _this.disease.mode,
                    alias: _this.disease.alias,
                    age: _this.disease.age,
                    omim: _this.disease.omim,
                    morbidity: _this.disease.morbidity,
                    distype: _this.disease.distype,
                    catalog: [
                      {症状: _this.content2},
                      {表现: _this.content3},
                      {诊断方法: _this.content4},
                      {病因及危险因素: _this.content5},
                      {预防: _this.content6},
                      {筛查: _this.content7},
                      {治疗方案: _this.content8},
                      {其他: _this.content9}
                    ],
                    content: '',
                    //科室
                    deptId,
                    //基因
                    genes,
                    //靶向
                    druggeryIds,
                    //指南
                    guides: guideIds
                  },
                  productIds
                }
              })
                .then(res => {
                  this.$message('发布成功');
                })
                .catch(err => {
                  this.$message(JSON.parse(err.request.response).mag);
                });
            } else {
              let instance = this.axios.create({
                headers: {
                  Authorization: window.localStorage.token,
                  'Content-Type': 'application/json'
                }
              });
              let _this = this;
              instance({
                url: 'disease/eidtDisease',
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest'
                },
                params: {
                  temId: _this.id
                },
                data: {
                  disease: {
                    id: _this.diseaseId,
                    name: _this.disease.name,
                    nameen: _this.disease.nameen,
                    muttype: _this.disease.muttype,
                    mode: _this.disease.mode,
                    alias: _this.disease.alias,
                    age: _this.disease.age,
                    omim: _this.disease.omim,
                    morbidity: _this.disease.morbidity,
                    distype: _this.disease.distype,
                    catalog: [
                      {症状: _this.content2},
                      {表现: _this.content3},
                      {诊断方法: _this.content4},
                      {病因及危险因素: _this.content5},
                      {预防: _this.content6},
                      {筛查: _this.content7},
                      {治疗方案: _this.content8},
                      {其他: _this.content9}
                    ],
                    //科室
                    deptId,
                    //基因
                    genes,
                    //靶向
                    druggeryIds,
                    //指南
                    guides: guideIds
                  },
                  productIds
                }
              })
                .then(res => {
                  this.$message('发布成功');
                })
                .catch(err => {
                  this.$message(JSON.parse(err.request.response).mag);
                });
            }
          }
        }
      }
    },
    //科室
    getList() {
      this.axios({
        url: "hospital-dept"
      }).then(res => {
        this.deptList = res.data.map(item => {
          item.name = item.name.indexOf("|") >= 0 ? item.name.split("|")[1] : item.name
          return item
        });
      });
    },
    //基因
    geneGetdata(gene) {
      this.axios({
        url: "gene/all",
        params: {
          keyWord: gene
        }
      }).then(res => {
        this.geneOption = res.data.genes.map((item, index) => {
          return {
            id: item.id,
            name: item.gene
          };
        });
      });
    },
    geneRemote(query) {
      this.geneGetdata(query);
      if (query !== "") {
        this.geneLoading = true;
        setTimeout(() => {
          this.geneLoading = false;
        }, 200);
      } else {
        this.geneOption = [];
      }
    },
    //相关指南
    guideGetdata(guide) {
      let instance = this.axios.create({
        baseURL: process.env.PRODUCT,
        headers: {
          "Content-Type": "application/json"
        }
      });
      let _this = this;
      instance({
        method: "get",
        url: "guide/getGuides",
        params: {
          param: guide
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json"
        }
      }).then(function (res) {
        _this.guideOption = res.data.guides.map((item, index) => {
          return {
            id: item.id,
            name: item.title
          };
        });
      });
    },
    guideRemote(query) {
      this.guideGetdata(query);
      if (query !== "") {
        this.guideLoading = true;
        setTimeout(() => {
          this.guideLoading = false;
        }, 200);
      } else {
        this.guideOption = [];
      }
    },
    //靶向用药
    medicaGetdata(medica) {
      this.axios({
        url: "druggery/all",
        params: {
          keyWord: medica
        }
      }).then(res => {
        this.medicaOption = res.data.druggeries.map((item, index) => {
          return {
            id: item.id,
            name: item.drugName
          };
        });
      });
    },
    medica(query) {
      this.medicaGetdata(query);
      if (query !== "") {
        this.medicaLoading = true;
        setTimeout(() => {
          this.medicaLoading = false;
        }, 200);
      } else {
        this.medicaOption = [];
      }
    },
    //检测产品
    productGetdata(product) {
      let instance = this.axios.create({
        baseURL: process.env.PRODUCT,
        headers: {
          "Content-Type": "application/json"
        }
      });
      let _this = this;
      instance({
        method: "get",
        url: "product/getProductByName",
        params: {
          param: product
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json"
        }
      }).then(function (res) {
        _this.productOption = res.data.products.list.map((item, index) => {
          return {
            id: item.id,
            name: item.name
          };
        });
      });
    },
    product(query) {
      this.productGetdata(query);
      if (query !== "") {
        this.productLoading = true;
        setTimeout(() => {
          this.productLoading = false;
        }, 200);
      } else {
        this.productOption = [];
      }
    },
    getDatas() {
      this.axios({
        url: "disease/byId",
        params: {
          id: this.$route.query.id,
          state: this.$route.query.state
        }
      }).then(res => {
        this.diseaseId = res.data.disease.diseaseId;
        this.id = res.data.disease.id;
        this.disease = res.data.disease;
        this.content2 = res.data.disease.catalog[0].症状;
        this.content3 = res.data.disease.catalog[1].表现;
        this.content4 = res.data.disease.catalog[2].诊断方法;
        this.content5 = res.data.disease.catalog[3].病因及危险因素;
        this.content6 = res.data.disease.catalog[4].预防;
        this.content7 = res.data.disease.catalog[5].筛查;
        this.content8 = res.data.disease.catalog[6].治疗方案;
        this.content9 = res.data.disease.catalog[7].其他;
        if (res.data.disease.guides !== undefined) {
          //指南
          this.guideId = res.data.disease.guides.map(item => {
            let guide = {}
            if (item.guideId === undefined) {
              guide = {
                id: item._id.toString(),
                name: item.title
              }
            } else {
              guide = {
                id: item.guideId.id,
                name: item.guideId.name
              }
            }
            this.guideOption.push(guide)
            return guide
          });
        }
        if (res.data.products !== undefined) {
          this.newProduct = res.data.products.map(item => {
            this.productOption.push({
              id: item.productId,
              name: item.productName
            });
            return {id: item.productId, name: item.productName};
          });
        }
        console.log(res.data.depts)
        if (res.data.depts !== undefined) {
          this.newDept = res.data.depts.map(item => {
            let _dept = {'id': item.deptId, 'name': item.deptName}
            this.deptList.push(_dept);
            console.log(_dept)
            return _dept;
          });
        }
        console.log(this.newDept)
        if (res.data.relationDruggery !== undefined) {
          this.newMedica = res.data.relationDruggery.map(item => {
            this.medicaOption.push({
              id: item.druggeryId,
              name: item.druggeryName
            });
            return {id: item.druggeryId, name: item.druggeryName};
          });
        }
        if (res.data.relationGene !== undefined) {
          this.relatedgene = res.data.relationGene.map(item => {
            this.geneOption.push({id: item.geneId, name: item.geneName});
            return {id: item.geneId, name: item.geneName};
          });
        }
      });
    },
    //暂存按钮
    disabeleds() {
      var guideIds = this.guideId.map((item, index) => {
        return {guideId: item};
      });
      var druggeryIds = this.newMedica.map(item => {
        return item.id;
      });
      var productIds = this.newProduct.map(item => {
        return item.id;
      });
      var deptId = this.newDept.map(item => {
        return item.id;
      });
      var genes = this.relatedgene.map(item => {
        return item.id;
      });
      this.openIsDisabled = !this.openIsDisabled;
      this.cname = !this.cname;
      this.ename = !this.ename;
      this.qname = !this.qname;
      this.omims = !this.omims;
      this.jdistype = !this.jdistype;
      this.bmedicaId = !this.bmedicaId;
      this.xgudeId = !this.xgudeId;
      this.tmuttype = !this.tmuttype;
      this.ymode = !this.ymode;
      this.fage = !this.fage;
      this.fmorbidity = !this.morbidity;
      this.sprodepts = !this.sprodepts;
      this.jproductId = !this.jproductId;
      this.xrelatedgene = !this.latedgene;
      this.fcontent0 = !this.fcontent0;
      this.fcontent1 = !this.fcontent1;
      this.fcontent2 = !this.fcontent2;
      this.fcontent3 = !this.fcontent3;
      this.fcontent4 = !this.fcontent4;
      this.fcontent5 = !this.fcontent5;
      this.fcontent6 = !this.fcontent6;
      this.fcontent7 = !this.fcontent7;
      this.fcontent8 = !this.fcontent8;
      this.fcontent9 = !this.fcontent9;
      this.btitle0 = !this.btitle0;
      this.btitle1 = !this.btitle1;
      this.btitle2 = !this.btitle2;
      this.btitle3 = !this.btitle3;
      this.btitle4 = !this.btitle4;
      this.btitle5 = !this.btitle5;
      this.btitle6 = !this.btitle6;
      this.btitle7 = !this.btitle7;
      this.btitle8 = !this.btitle8;
      this.btitle9 = !this.btitle9;
      this.values1 = !this.values1;
      this.values = !this.values;
      if (this.$route.query.id == undefined) {
        let instance = this.axios.create({
          headers: {
            Authorization: window.localStorage.token,
            "Content-Type": "application/json"
          }
        });
        let _this = this;
        instance({
          url: "disease/addTem",
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          data: {
            diseaseTem: {
              name: _this.disease.name,
              nameen: _this.disease.nameen,
              muttype: _this.disease.muttype,
              mode: _this.disease.mode,
              alias: _this.disease.alias,
              age: _this.disease.age,
              omim: _this.disease.omim,
              morbidity: _this.disease.morbidity,
              distype: _this.disease.distype,
              catalog: [
                {症状: _this.content2},
                {表现: _this.content3},
                {诊断方法: _this.content4},
                {病因及危险因素: _this.content5},
                {预防: _this.content6},
                {筛查: _this.content7},
                {治疗方案: _this.content8},
                {其他: _this.content9}
              ],
              content: "",
              //科室
              deptId,
              //基因
              genes,
              //靶向
              druggeryIds,
              //指南
              guides: guideIds
            },
            productIds
          }
        }).then(res => {
          this.$message({
            type: "success",
            message: "暂存成功"
          }).catch(err => {
            this.$message(JSON.parse(err.request.response).mag);
          });
        });
      } else {
        if (this.state == 0) {
          let instance = this.axios.create({
            headers: {
              Authorization: window.localStorage.token,
              "Content-Type": "application/json"
            }
          });
          let _this = this;
          instance({
            url: "disease/addTem",
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            data: {
              diseaseTem: {
                diseaseId: _this.id,
                name: _this.disease.name,
                nameen: _this.disease.nameen,
                muttype: _this.disease.muttype,
                mode: _this.disease.mode,
                alias: _this.disease.alias,
                age: _this.disease.age,
                omim: _this.disease.omim,
                morbidity: _this.disease.morbidity,
                distype: _this.disease.distype,
                catalog: [
                  {症状: _this.content2},
                  {表现: _this.content3},
                  {诊断方法: _this.content4},
                  {病因及危险因素: _this.content5},
                  {预防: _this.content6},
                  {筛查: _this.content7},
                  {治疗方案: _this.content8},
                  {其他: _this.content9}
                ],
                content: "",
                //科室
                deptId,
                //基因
                genes,
                //靶向
                druggeryIds,
                //指南
                guides: guideIds
              },
              productIds
            }
          }).then(res => {
            this.$message({
              type: "success",
              message: "暂存成功"
            }).catch(err => {
              this.$message(JSON.parse(err.request.response).mag);
            });
          });
        } else if (this.state == 1) {
          let instance = this.axios.create({
            headers: {
              Authorization: window.localStorage.token,
              "Content-Type": "application/json"
            }
          });
          let _this = this;
          instance({
            url: "disease/eidtTem",
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            data: {
              disease: {
                id: _this.id,
                diseaseId: _this.diseaseId,
                name: _this.disease.name,
                nameen: _this.disease.nameen,
                muttype: _this.disease.muttype,
                mode: _this.disease.mode,
                alias: _this.disease.alias,
                age: _this.disease.age,
                omim: _this.disease.omim,
                morbidity: _this.disease.morbidity,
                distype: _this.disease.distype,
                catalog: [
                  {症状: _this.content2},
                  {表现: _this.content3},
                  {诊断方法: _this.content4},
                  {病因及危险因素: _this.content5},
                  {预防: _this.content6},
                  {筛查: _this.content7},
                  {治疗方案: _this.content8},
                  {其他: _this.content9}
                ],
                content: "",
                //科室
                deptId,
                //基因
                genes,
                //靶向
                druggeryIds,
                //指南
                guides: guideIds
              },
              productIds
            }
          }).then(res => {
            this.$message({
              type: "success",
              message: "暂存成功"
            }).catch(err => {
              this.$message(JSON.parse(err.request.response).mag);
            });
          });
        }
      }
    },
    onEditorReady(editor) {
    }, // 准备编辑器,
    onEditorBlur() {
    }, // 失去焦点事件
    onEditorFocus() {
    }, // 获得焦点事件
    onEditorChange() {
    }, // 内容改变事件
    saveHtml: function (event) {
      alert(this.content);
    },
    _initData() {
      let instance = this.axios.create({
        baseURL: process.env.DISEASE_PC_API,
        headers: {
          "Content-Type": "application/json"
        }
      });
      let _this = this;
      if (this.$route.params.id !== undefined) {
        instance({
          method: "get",
          url: "diseaseData/getDisease",
          params: {
            id: this.$route.params.id
          },
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
          }
        }).then(function (res) {
          _this.disease = res.data.disease;
          if (_this.disease.deptId === undefined) {
            _this.disease.deptId = [];
          } else {
            _this.disease.deptId = _this.disease.deptId.map(Number);
          }
          _this.guides = [];
          if (_this.disease.guides !== undefined) {
            _this.guides = _this.disease.guides;
          }
          if (_this.disease.catalog === undefined) {
            _this.disease.catalog = [];
          }
        });
      }

      this.axios
        .get("hospital-dept")
        .then(res => {
          this.deptList = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    edit() {
      this.disease.deptId = this.disease.deptId.map(String)
      this.disease.guides = this.guides
      if (this.$route.params.id === undefined) {
        let instance = this.axios.create({
          headers: {
            Authorization: window.localStorage.token,
            "Content-Type": "application/json"
          }
        })
        let _this = this
        instance({
          method: "post",
          url: "disease/eidtDisease",
          data: {
            disease: this.disease,
            userId: window.localStorage.userId
          },
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
          }
        })
          .then(function (res) {
            _this.$message({
              message: "新增成功",
              type: "success"
            })
            _this.$router.push("/disease")
          })
          .catch(function () {
            _this.$message({
              message: "新增失败",
              type: "error"
            })
          })
      } else {
        let instance = this.axios.create({
          headers: {
            Authorization: window.localStorage.token,
            "Content-Type": "application/json"
          }
        })
        let _this = this
        instance({
          method: "put",
          url: "disease/eidtDisease",
          data: this.disease,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
          }
        })
          .then(function () {
            _this.$message({
              message: "修改成功",
              type: "success"
            })
            _this.$router.push("/disease")
          })
          .catch(function () {
            _this.$message({
              message: "修改失败",
              type: "error"
            })
          })
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    remoteMethod(query) {
    },
    toAddCatelog() {
      this.disease.catalog.push({name: "", content: ""})
    },
    deleteCatelog(index) {
      this.disease.catalog.splice(index, 1)
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  created() {
    let loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    })
    this._initData()
    loading.close()
  },
  destroyed() {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .active {
    color: goldenrod;
  }

  .edit-form {
    max-width: none;
  }

  * {
    list-style: none;
  }

  .float-l {
    float: left;
  }

  .list {
    width: 100%;
    height: 150px;
    line-height: 75px;
    display: flex;
    background: #ccc;
    flex-wrap: wrap;

    li {
      width: 180px;
    }
  }

  .select {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: space-around;
    margin-top: 100px;
  }

  .content {
    width: 100%;
    height: 100px;

    .title {
      height: 30px;
      background: #f3f3f3;
      padding-left: 5px;

      input {
        width: 93%;
        border: 0;
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
          margin-top: 120px;
          text-align: center;

          .el-button {
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
    width: 100%;
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
