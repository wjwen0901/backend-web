<template>
  <div>
    <div class="company-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>主数据</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/firm' }">厂商管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ menuInfo }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form
        ref="companyForm"
        :model="company"
        :rules="rules"
        label-width="100px"
        size="small"
        v-loading="loading"
        element-loading-text="加载中"
        class="edit-form">
        <el-form-item label="厂商名称" prop="name">
          <el-input v-model="company.name" placeholder="请输入厂商全称"></el-input>
        </el-form-item>
        <el-form-item label="机构代码">
          <el-input v-model="company.code" placeholder="统一社会信用代码"></el-input>
        </el-form-item>
        <el-form-item label="注册地址">
          <el-input v-model="company.address" placeholder="营业执照上的注册地址"></el-input>
        </el-form-item>
        <el-form-item label="开户银行">
          <el-input v-model="company.bank" placeholder="如 工商银行 北京分行"></el-input>
        </el-form-item>
        <el-form-item label="银行账号">
          <el-input v-model="company.bankAccount" placeholder="对公账号"></el-input>
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
import { apiSubmit } from '@/utils/pc'

export default {
  name: 'FirmEdit',
  data () {
    return {
      menuInfo: this.$route.params.id === undefined ? '新增厂商' : '编辑厂商',
      company: {},
      loading: false,
      submitting: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      rules: {
        name: [{ required: true, message: '请输入厂商名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    _initData () {
      const id = this.$route.params.id
      if (id === undefined) return
      this.loading = true
      this.axios.get('company/' + id, { params: { userId: this.userId } })
        .then(res => { this.company = res.data || {} })
        .catch(err => {
          console.log(err)
          this.$message.error('厂商信息加载失败')
        })
        .then(() => { this.loading = false })
    },
    submit () {
      this.$refs.companyForm.validate(valid => {
        if (!valid) return
        this.submitting = true
        const id = this.$route.params.id
        const isEdit = id !== undefined
        if (!isEdit) this.company.type = 0
        const promise = isEdit
          ? apiSubmit(this.axios, 'put', 'company/' + id, this.company, { userId: this.userId })
          : apiSubmit(this.axios, 'post', 'company', this.company, { userId: this.userId })
        promise
          .then(() => {
            this.$message.success(isEdit ? '厂商已更新' : '厂商已新增')
            this.$router.push('/firm')
          })
          .catch(err => {
            console.log(err)
            this.$message.error(isEdit ? '更新失败，请稍后重试' : '新增失败，请稍后重试')
          })
          .then(() => { this.submitting = false })
      })
    },
    cancel () {
      this.$router.push('/firm')
    }
  },
  created () {
    this._initData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.company-container {
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
</style>
