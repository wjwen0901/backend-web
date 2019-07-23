<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/guide' }">指南管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="guide-container">
          <el-form ref="solutionForm" :model="guide" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="中文标题">
                <el-input v-model="guide.name"></el-input>
              </el-form-item>
              <el-form-item label="英文标题">
                <el-input v-model="guide.nameen"></el-input>
              </el-form-item>
              <el-form-item label="制定者">
                <el-input v-model="guide.alias"></el-input>
              </el-form-item>
              <el-form-item label="OMIM">
                <el-input v-model="guide.omim"></el-input>
              </el-form-item>
              <el-form-item label="疾病类型">
                <el-input v-model="guide.distype"></el-input>
              </el-form-item>
              <el-form-item label="检测产品">
                <el-select class="width-100-p" v-model="guide.solutionIds" value-key="id" filterable multiple placeholder="请选择">
                  <el-option
                    v-for="item in solutionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="遗传方式">
                <el-input v-model="guide.mode"></el-input>
              </el-form-item>
              <el-form-item label="突变类型">
                <el-input v-model="guide.muttype"></el-input>
              </el-form-item>
              <el-form-item label="发病年龄">
                <el-input v-model="guide.age"></el-input>
              </el-form-item>
              <el-form-item label="发病概率">
                <el-input v-model="guide.morbidity"></el-input>
              </el-form-item>
              <el-form-item label="致病基因">
                <el-select class="width-100-p"  v-model="guide.geneDetails" multiple filterable placeholder="请选择">
                  <el-option
                    v-for="item in geneList"
                    :key="item.id"
                    :label="item.gene"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="靶向药物">
                <el-select class="width-100-p" v-model="guide.drugIds" multiple filterable placeholder="请选择">
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
              <el-form-item label="疾病介绍">
                <el-input type="textarea" v-model="guide.content"></el-input>
              </el-form-item>
              <el-form-item label="临床指南">
              </el-form-item>
              <el-form-item label="数据来源">
                <el-input placeholder="请输入网站名称" v-model="guide.source.sourceName" class="url-name"></el-input>
                <el-input placeholder="请输入访问链接" v-model="guide.source.sourceUrl" class="url"></el-input>
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
      menuInfo: this.$route.params.id === undefined ? '新增' : '编辑',
      guide: {
        source: {
          sourceName: '',
          sourceUrl: ''
        }
      },
      sampleMeta: [],
      proDepts: [],
      reportType: [],
      consultancy: [],
      deptList: [],
      solutionList: [],
      geneList: [],
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
          url: 'guide/findGuideDetail',
          params: {id: this.$route.params.id},
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (res) {
          _this.guide = res.data.guide
          _this.guide.source = {}
          console.log(_this.guide)
        })
      }
      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId
        }
      }).then(res => {
        this.solutionList = res.data
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
          url: 'guide',
          data: {
            guide: this.guide,
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
            _this.$router.push('/guide')
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
          url: 'guide/' + this.$route.params.id,
          data: {
            guide: this.guide,
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
          _this.$router.push('/guide')
        }).catch(function () {
          _this.$message({
            message: '修改失败',
            type: 'error'
          })
        })
      }
    },
    cancel () {
      this.$router.push('/guide')
    }
  },
  filters: {},
  computed: {
    // expandParams: function () {
    //   let result = []
    //   let _this = this
    //   if (this.reportType !== null) {
    //     _this.reportType.forEach(function (item) {
    //       let expandParams = {
    //         'name': item,
    //         'type': 0
    //       }
    //       if (_this.reportTypeOtherRemark !== '' && item === 3) {
    //         expandParams.remark = _this.reportTypeOtherRemark
    //       }
    //       result.push(expandParams)
    //     })
    //   }
    //   if (this.consultancy !== null) {
    //     this.consultancy.forEach(function (item) {
    //       let expandParams = {
    //         'name': item,
    //         'type': 1
    //       }
    //       if (_this.consultancyOtherRemark !== '' && item === 4) {
    //         expandParams.remark = _this.consultancyOtherRemark
    //       }
    //       result.push(expandParams)
    //     })
    //   }
    //   console.log(result)
    //   return result
    // }
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
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped> 
  .float-l {
    float: left;
  }
  .guide-container {
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
  .guide-container .header {
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
