<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/hospital' }">医院管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="hospital-container">
          <el-form ref="hospitalForm" :model="hospital" label-width="80px" size="mini" class="edit-form">
            <el-form-item label="医院名称">
              <el-input v-model="hospital.name" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="医院级别">
              <el-radio-group v-model="hospital.grader">
                <el-radio :label="0">三级</el-radio>
                <el-radio :label="1">二级</el-radio>
                <el-radio :label="2">一级</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="医院等级">
              <el-radio-group v-model="hospital.classes">
                <el-radio :label="0">甲等</el-radio>
                <el-radio :label="1">乙等</el-radio>
                <el-radio :label="2">合格</el-radio>
                <el-radio :label="3">未定等</el-radio>
                <el-radio :label="4">其他</el-radio>
                <el-radio :label="5">未知</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="连锁属性">
              <el-radio-group v-model="hospital.chain">
                <el-radio :label="0">品牌连锁</el-radio>
                <el-radio :label="1">医联体</el-radio>
                <el-radio :label="2">专科医院</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="国准代码">
              <el-input v-model="hospital.standardCode" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="hospital.phone" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="邮编">
              <el-input v-model="hospital.zipcode" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-cascader class="width-100-p"
                           :options="regionData"
                           v-model="areaInfo"
                           @change="addressHandleChange">
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="hospital.address"></el-input>
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
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'EditInformed',
  data () {
    return {
      menuInfo: this.$route.params.id === undefined ? '新增' : '编辑',
      hospital: {},
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode
    }
  },
  props: {},
  methods: {
    _initData () {
      if (this.$route.params.id !== undefined) {
        this.axios.get('hospital/' + this.$route.params.id).then(res => {
          this.hospital = res.data
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
          url: 'hospital?userId=' + window.localStorage.userId,
          data: this.hospital,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function () {
          _this.$message({
            message: '新增成功',
            type: 'success'
          })
          _this.$router.push('/hospital')
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
          url: 'hospital/' + this.$route.params.id,
          data: this.hospital,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function () {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this.$router.push('/hospital')
        }).catch(function () {
          _this.$message({
            message: '修改失败',
            type: 'error'
          })
        })
      }
    },
    cancel () {
      this.$router.push('/hospital')
    },
    addressHandleChange (value) {
      this.hospital.province = this.CodeToText[value[0]]
      this.hospital.city = this.CodeToText[value[1]]
      this.hospital.county = this.CodeToText[value[2]]
    }
  },
  filters: {},
  computed: {
    areaInfo: {
      get: function () {
        if (this.hospital.county === undefined || this.hospital.county === '' || this.hospital.county === null) {
          return []
        }
        let city = this.hospital.city
        if (this.hospital.city.indexOf('天津') > -1 || this.hospital.city.indexOf('北京') > -1) {
          city = '市辖区'
        }
        return [this.TextToCode[this.hospital.province].code, this.TextToCode[this.hospital.province][city].code, this.TextToCode[this.hospital.province][city][this.hospital.county].code]
      },
      set: function () {
      }
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
  .hospital-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .el-input {
      width: 100%;
    }
  }
  .hospital-container .header {
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
