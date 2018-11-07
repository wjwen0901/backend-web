<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/product' }">产品管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="product-container">
          <el-form ref="productForm" :model="product" label-width="80px" size="mini" class="edit-form">
            <el-form-item label="产品名称">
              <el-input v-model="product.name"></el-input>
            </el-form-item>
            <el-form-item label="适用科室">
              <el-select class="width-100-p" v-model="proDepts" multiple filterable placeholder="请选择">
                <el-option
                  v-for="item in deptList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="检测周期">
              <el-input-number v-model="product.period" :min="1" :max="100" label="请输入"></el-input-number>个工作日
            </el-form-item>
            <el-form-item label="适用人群">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="product.crowd">
              </el-input>
            </el-form-item>
            <el-form-item label="样本类型">
              <el-select class="width-100-p" v-model="sampleMeta" multiple filterable placeholder="请选择">
                <el-option
                  v-for="item in sampleTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="知情同意">
              <el-radio-group v-model="product.informed">
                <el-radio :label="0">必须_可通用</el-radio>
                <el-radio :label="1">必须_专有模板</el-radio>
                <el-radio :label="2">不需要</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="既往病历">
              <el-radio-group v-model="product.anamnesis">
                <el-radio :label="0">必须_可通用</el-radio>
                <el-radio :label="1">必须_专有模板</el-radio>
                <el-radio :label="2">不需要</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报告类型">
              <el-checkbox-group v-model="reportType">
                <el-checkbox :label="0">API接口</el-checkbox>
                <el-checkbox :label="1">PDF/word电子版</el-checkbox>
                <el-checkbox :label="2">打印版寄送</el-checkbox>
                <el-checkbox :label="3">其他</el-checkbox>
              </el-checkbox-group>
              <el-input v-model="reportTypeOtherRemark" v-show="reportType !== undefined && reportType.indexOf(3) > -1" placeholder="其他说明"></el-input>
            </el-form-item>
            <el-form-item label="咨询服务">
              <el-checkbox-group v-model="consultancy">
                <el-checkbox :label="0">免费咨询一次</el-checkbox>
                <el-checkbox :label="1">终身咨询免费</el-checkbox>
                <el-checkbox :label="2">结果永久存储</el-checkbox>
                <el-checkbox :label="3">报告免费更新</el-checkbox>
                <el-checkbox :label="4">其他</el-checkbox>
              </el-checkbox-group>
              <el-input v-model="consultancyOtherRemark" v-show="consultancy !== undefined && consultancy.indexOf(4)>=0" placeholder="其他说明"></el-input>
            </el-form-item>
            <el-form-item label="详细资料">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="product.detail">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="edit">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'EditInformed',
  data () {
    return {
      menuInfo: this.$route.params.id === undefined ? '新增' : '编辑',
      product: {},
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
        this.axios.get('solution/' + this.$route.params.id).then(res => {
          this.product = res.data
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
          url: 'solution',
          data: {
            solution: this.product,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            solutionExpands: this.expandParams
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function () {
          _this.$message({
            message: '新增成功',
            type: 'success'
          })
          _this.$router.push('/product')
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
          url: 'solution/' + this.$route.params.id,
          data: {
            solution: this.product,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            solutionExpands: this.expandParams
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
        })
      }
    },
    cancel () {
      this.$router.push('/product')
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
  .product-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .el-input {
      width: 100%;
    }
  }
  .product-container .header {
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
    height: 700px;
    background: #ffffff;
    overflow: auto;
    img {
      width: 100%;
    }
  }
</style>
