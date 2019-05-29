<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/product-cli' }">产品分类管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="product-container">
          <el-form ref="solutionForm" :model="product" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="form-line">
              <el-form-item label="中文名称">
                <el-input v-model="product.name"></el-input>
              </el-form-item>
              <el-form-item label="英文名称">
                <el-input v-model="product.nameEn"></el-input>
              </el-form-item>
              <el-form-item label="产品用途">
                <el-input type="textarea" v-model="product.purpose"></el-input>
              </el-form-item>
              <el-form-item label="产品简介">
                <el-input type="textarea" v-model="product.brief"></el-input>
              </el-form-item>
              <el-form-item label="厂商产品">
                <el-select class="width-100-p"  v-model="product.geneDetails" multiple filterable placeholder="请选择">
                  <el-option
                    v-for="item in solutionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
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
      product: {},
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
      if (this.$route.params.id !== undefined) {
        this.axios.get('product/' + this.$route.params.id).then(res => {
          this.product = res.data.product
        }).catch(err => {
          console.log(err)
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
          url: 'product',
          data: {
            product: this.product,
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
            _this.$router.push('/product')
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
          url: 'product/' + this.$route.params.id,
          data: {
            product: this.product,
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
          _this.$router.push('/product')
        }).catch(function () {
          _this.$message({
            message: '修改失败',
            type: 'error'
          })
        })
      }
    },
    cancel () {
      this.$router.push('/product')
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
  },
  mounted () {},
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .float-l {
    float: left;
  }
  .product-container {
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
  .product-container .header {
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
