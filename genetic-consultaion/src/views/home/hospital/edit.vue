<template>
  <div>
    <div class="hospital-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>主数据</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/hospital' }">医院管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ menuInfo }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form
        ref="hospitalForm"
        :model="hospital"
        :rules="rules"
        label-width="100px"
        size="small"
        v-loading="loading"
        element-loading-text="加载中"
        class="edit-form">
        <el-form-item label="医院名称" prop="name">
          <el-input v-model="hospital.name" placeholder="请输入医院全称"></el-input>
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
          <el-input v-model="hospital.standardCode" placeholder="如 SHSH111H"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="hospital.phone" placeholder="医院联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮编">
          <el-input v-model="hospital.zipcode" placeholder="6 位邮政编码"></el-input>
        </el-form-item>
        <el-form-item label="所在地区">
          <el-cascader
            class="width-100-p"
            :options="regionData"
            v-model="areaInfo"
            @change="addressHandleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="hospital.address" placeholder="街道 / 门牌号"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { apiSubmit } from '@/utils/pc'

export default {
  name: 'HospitalEdit',
  data () {
    return {
      menuInfo: this.$route.params.id === undefined ? '新增医院' : '编辑医院',
      hospital: {},
      loading: false,
      submitting: false,
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      rules: {
        name: [{ required: true, message: '请输入医院名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    areaInfo: {
      get () {
        const h = this.hospital
        if (!h.county) return []
        try {
          let cityKey = h.city
          if (cityKey && (cityKey.indexOf('天津') > -1 || cityKey.indexOf('北京') > -1 || cityKey.indexOf('上海') > -1)) {
            cityKey = '市辖区'
          }
          return [
            this.TextToCode[h.province].code,
            this.TextToCode[h.province][cityKey].code,
            this.TextToCode[h.province][cityKey][h.county].code
          ]
        } catch (err) {
          return []
        }
      },
      set () {}
    }
  },
  methods: {
    _initData () {
      const id = this.$route.params.id
      if (id === undefined) return
      this.loading = true
      this.axios.get('hospital/' + id, { params: { userId: this.userId } })
        .then(res => {
          this.hospital = res.data || {}
        })
        .catch(err => {
          console.log(err)
          this.$message.error('医院信息加载失败')
        })
        .then(() => {
          this.loading = false
        })
    },
    submit () {
      this.$refs.hospitalForm.validate(valid => {
        if (!valid) return
        this.submitting = true
        const id = this.$route.params.id
        const isEdit = id !== undefined
        const promise = isEdit
          ? apiSubmit(this.axios, 'put', 'hospital/' + id, this.hospital, { userId: this.userId })
          : apiSubmit(this.axios, 'post', 'hospital', this.hospital, { userId: this.userId })
        promise
          .then(() => {
            this.$message.success(isEdit ? '医院已更新' : '医院已新增')
            this.$router.push('/hospital')
          })
          .catch(err => {
            console.log(err)
            this.$message.error(isEdit ? '更新失败，请稍后重试' : '新增失败，请稍后重试')
          })
          .then(() => {
            this.submitting = false
          })
      })
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
  created () {
    this._initData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.hospital-container {
  margin: 20px 0;
  padding: 20px;
  background: var(--pc-white);
  border-radius: var(--pc-r-4);
  box-shadow: var(--pc-sh-1);
}

.page-header {
  padding-bottom: 14px;
  margin-bottom: 16px;
  border-bottom: var(--pc-bd-hair);
}

.edit-form {
  max-width: 560px;
}

.width-100-p { width: 100%; }
</style>
