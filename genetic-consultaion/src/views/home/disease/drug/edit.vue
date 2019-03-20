<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/drug' }">疾病信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="drug-container">
          <el-form ref="solutionForm" :model="drug" label-width="100px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="商品名">
                <el-input v-model="drug.commodityName"></el-input>
              </el-form-item>
              <el-form-item label="中文药品名">
                <el-input v-model="drug.drugName"></el-input>
              </el-form-item>
              <el-form-item label="英文药品名">
                <el-input v-model="drug.drugNameEn"></el-input>
              </el-form-item>
              <el-form-item label="相关基因">
                <el-select class="width-100-p" v-model="drug.genes" multiple filterable placeholder="请选择">
                  <el-option
                    v-for="item in deptList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="生产商">
                <el-input v-model="drug.producer"></el-input>
              </el-form-item>
              <el-form-item label="性状">
                <el-input v-model="drug.inaccurate"></el-input>
              </el-form-item>
              <el-form-item label="相关疾病">
                <el-select class="width-100-p" v-model="drug.diseases" multiple filterable placeholder="请选择">
                  <el-option
                    v-for="item in deptList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-line">
              <el-form-item label="药物机理">
                <el-input type="textarea" v-model="drug.drugMechanism"></el-input>
              </el-form-item>
              <el-form-item label="FDA批准">
                <el-table
                  :data="drug.fda"
                  size="mini"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="indication"
                    label="适应症">
                    <template slot-scope="scope">
                      {{scope.row.create_time | formatDate}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="usage"
                    label="推荐用法">
                  </el-table-column>
                  <el-table-column
                    prop="meteing"
                    label="计量推荐"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="untowardEffect"
                    label="常见不良反应">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="toDelete(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                  :data="addRowData"
                  :show-header="false"
                  size="mini"
                  border
                  style="width: 100%">
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-input v-model="fda.indication" placeholder="适应症"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-input v-model="fda.framer" placeholder="推荐用法"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-input placeholder="计量推荐" v-model="fda.meteing"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-input v-model="fda.untowardEffect" placeholder="常见不良反应"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="toDelete(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button type="text" class="float-l">添加行</el-button>
              </el-form-item>
              <el-form-item label="CFDA批准">
                <el-table
                  :data="drug.cfda"
                  size="mini"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="indication"
                    label="适应症">
                    <template slot-scope="scope">
                      {{scope.row.create_time | formatDate}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="usage"
                    label="推荐用法">
                  </el-table-column>
                  <el-table-column
                    prop="meteing"
                    label="计量推荐"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="untowardEffect"
                    label="常见不良反应">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="toDelete(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                  :data="addRowData"
                  :show-header="false"
                  size="mini"
                  border
                  style="width: 100%">
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-input v-model="cfda.indication" placeholder="适应症"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-input v-model="cfda.framer" placeholder="推荐用法"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-input placeholder="计量推荐" v-model="cfda.meteing"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template slot-scope="scope">
                      <el-input v-model="cfda.untowardEffect" placeholder="常见不良反应"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="toDelete(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button type="text" class="float-l">添加行</el-button>
              </el-form-item>
              <el-form-item label="数据来源">
                <el-input placeholder="请输入网站名称" v-model="drug.source.sourceName" class="url-name"></el-input>
                <el-input placeholder="请输入访问链接" v-model="drug.source.sourceUrl" class="url"></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="edit">保存</el-button>
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
      menuInfo: this.$route.params.id === undefined ? '新增' : '编辑',
      drug: {
        source: {}
      },
      sampleMeta: [],
      proDepts: [],
      reportType: [],
      consultancy: [],
      deptList: [],
      sampleTypes: [
        {'id': 0, 'name': '血液'},
        {'id': 1, 'name': '唾液'}
      ],
      reportTypeOtherRemark: '',
      consultancyOtherRemark: ''
    }
  },
  props: {},
  methods: {
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
  mounted () {},
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
        text-align: center;
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
