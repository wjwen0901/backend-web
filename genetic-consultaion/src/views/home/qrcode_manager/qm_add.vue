<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/qrcode-manager/list' }">二维码管理</el-breadcrumb-item>
          <el-breadcrumb-item>新增二维码</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        size="small"
        class="edit-form">
        <el-form-item label="公众号" prop="subscripType">
          <el-select placeholder="请选择公众号" v-model="ruleForm.subscripType" class="full-w">
            <el-option v-for="item in subscripTypeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="申请人" prop="userId">
          <el-select v-model="ruleForm.userId" filterable placeholder="请选择申请人" class="full-w">
            <el-option v-for="item in userArr" :key="item.id" :label="item.fullName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="详细描述" prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark" :rows="2" placeholder="二维码用途 / 关联活动"></el-input>
        </el-form-item>

        <el-form-item label="推送类型" prop="pushType">
          <el-select v-model="ruleForm.pushType" placeholder="请选择推送类型" class="full-w">
            <el-option v-for="item in pushTypeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="推送内容" prop="content" v-if="ruleForm.pushType === 'text'">
          <el-input type="textarea" v-model="ruleForm.content" :rows="3" placeholder="文本推送内容"></el-input>
        </el-form-item>

        <el-form-item label="上传图片" prop="file" v-if="ruleForm.pushType === 'image'">
          <input type="file" ref="inputer" name="file" @change="uploadImg1" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        </el-form-item>

        <template v-if="ruleForm.pushType === 'article'">
          <el-form-item label="文本标题" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请输入文本标题"></el-input>
          </el-form-item>
          <el-form-item label="推送内容" prop="content">
            <el-input type="textarea" v-model="ruleForm.content" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="图片链接" prop="filePath">
            <el-input v-model="ruleForm.filePath" placeholder="http://..."></el-input>
          </el-form-item>
          <el-form-item label="访问链接" prop="sendUrl">
            <div class="send-row">
              <el-input v-model="ruleForm.sendUrl" placeholder="http://..." class="send-input"></el-input>
              <UploadImg fileId="codeAdd" @key="getKey" css="1" :index="0" uploadType="wechat-file" class="upload-btn"></UploadImg>
            </div>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="submitForm('ruleForm')">立即生成</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import UploadImg from '@/components/Upload'

export default {
  name: 'QmAdd',
  components: { UploadImg },
  data () {
    const checkUrl = (rule, value, callback) => {
      if (!value) return callback()
      const reg = /(http|https):\/\/([\w.]+\/?)\S*/
      if (!reg.test(value)) callback(new Error('请输入有效的地址'))
      else callback()
    }
    return {
      subscripTypeArr: [
        { name: '易得好康', value: 'mdhcare' },
        { name: '易见康', value: 'ru6c' },
        { name: '见山会诊', value: 'gensultation' },
        { name: '安易筛', value: 'accuragen' },
        { name: '迈基诺', value: 'mygeno' },
        { name: '诠见康', value: 'qx' }
      ],
      userid: window.localStorage.userId,
      userArr: [],
      pushTypeArr: [
        { name: '文本', value: 'text' },
        { name: '图片', value: 'image' },
        { name: '图文素材', value: 'article' }
      ],
      submitting: false,
      ruleForm: {
        subscripType: '',
        userId: '',
        remark: '',
        pushType: '',
        content: '',
        file: '',
        title: '',
        filePath: '',
        sendUrl: ''
      },
      rules: {
        subscripType: [{ required: true, message: '请选择公众号', trigger: 'change' }],
        userId: [{ required: true, message: '请选择申请人', trigger: 'change' }],
        remark: [{ required: true, message: '请填写详细描述', trigger: 'blur' }],
        pushType: [{ required: true, message: '请选择推送类型', trigger: 'change' }],
        content: [{ required: true, message: '请填写推送内容', trigger: 'blur' }],
        file: [{ required: true, message: '请上传图片', trigger: 'change' }],
        title: [{ required: true, message: '请输入文本标题', trigger: 'blur' }],
        filePath: [
          { required: true, message: '请上传图片', trigger: 'change' },
          { validator: checkUrl, trigger: ['blur', 'change'] }
        ],
        sendUrl: [{ required: true, message: '请输入或上传访问链接', trigger: 'change' }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        this.submitting = true
        const params = new FormData()
        params.append('subscripType', this.ruleForm.subscripType)
        params.append('userId', this.ruleForm.userId)
        params.append('remark', this.ruleForm.remark)
        params.append('pushType', this.ruleForm.pushType)
        params.append('content', this.ruleForm.content)
        params.append('file', this.ruleForm.file)
        params.append('title', this.ruleForm.title)
        params.append('filePath', this.ruleForm.filePath)
        params.append('sendUrl', this.ruleForm.sendUrl)

        this.axios.post('wechat/qrcode', params, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          this.$message.success((res.data && res.data.msg) || '已生成')
          this.$router.push({ name: 'QmList' })
        }).catch(err => {
          console.log(err)
          this.$message.error('生成失败，请稍后重试')
        }).then(() => {
          this.submitting = false
        })
      })
    },
    cancel () {
      this.$router.push({ name: 'QmList' })
    },
    uploadImg1 () {
      const inputer = this.$refs.inputer
      this.ruleForm.file = inputer.files[0]
    },
    getUser () {
      this.axios.get('user/byRole', { params: { userId: this.userid } })
        .then(res => { this.userArr = (res.data && res.data.users) || [] })
        .catch(err => console.log(err))
    },
    getKey (key) {
      this.ruleForm.sendUrl = key
    }
  },
  created () {
    this.getUser()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-container {
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
  max-width: 640px;
}

.full-w { width: 100%; }

.send-row {
  display: flex;
  gap: 8px;
  align-items: center;

  .send-input { flex: 1; }
  .upload-btn { flex-shrink: 0; }
}
</style>
