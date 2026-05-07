<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/qrcode-manager/list' }">二维码管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑二维码</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        size="small"
        v-loading="loading"
        element-loading-text="加载二维码"
        class="edit-form">
        <el-form-item label="公众号" prop="subscripType">
          <el-select placeholder="请选择公众号" v-model="ruleForm.subscripType" disabled class="full-w">
            <el-option v-for="item in subscripTypeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="申请人" prop="userId">
          <el-select v-model="ruleForm.userId" filterable placeholder="请选择申请人" class="full-w">
            <el-option v-for="item in userArr" :key="item.id" :label="item.fullName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="详细描述" prop="remark">
          <el-input type="textarea" v-model.lazy.trim="ruleForm.remark" :rows="2"></el-input>
        </el-form-item>

        <el-form-item label="推送类型" prop="pushType">
          <el-select v-model="ruleForm.pushType" placeholder="请选择推送类型" class="full-w">
            <el-option v-for="item in pushTypeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="推送内容" prop="content" v-if="ruleForm.pushType === 'text'">
          <el-input type="textarea" v-model.lazy.trim="ruleForm.content" :rows="3"></el-input>
        </el-form-item>

        <el-form-item label="上传图片" prop="file" v-if="ruleForm.pushType === 'image'">
          <div class="image-row">
            <span v-if="pushTypeImg" class="image-current">{{ pushTypeImg }}</span>
            <span v-else class="muted">未上传</span>
            <input type="file" ref="inputer" name="file" @change="uploadImg1" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
          </div>
        </el-form-item>

        <template v-if="ruleForm.pushType === 'article'">
          <el-form-item label="文本标题" prop="title">
            <el-input v-model.lazy.trim="ruleForm.title" placeholder="请输入文本标题"></el-input>
          </el-form-item>
          <el-form-item label="推送内容" prop="content">
            <el-input type="textarea" v-model.lazy.trim="ruleForm.content" :rows="3"></el-input>
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
          <el-button type="primary" :loading="submitting" @click="submitForm('ruleForm')">保存修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import UploadImg from '@/components/Upload'

export default {
  name: 'QmEdit',
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
      qrcodeId: this.$route.query.qrcodeId,
      pushMsgId: '',
      pushTypeImg: '',
      loading: false,
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
        filePath: [{ validator: checkUrl, trigger: ['blur', 'change'] }]
      }
    }
  },
  methods: {
    getData () {
      this.loading = true
      this.axios.get('/wechat/qrcode/' + this.qrcodeId)
        .then(res => {
          const wechatQrcode = (res.data && res.data.wechatQrcode) || {}
          const pushMsg = (res.data && res.data.pushMsg) || {}
          this.ruleForm.subscripType = wechatQrcode.subscripType || ''
          this.ruleForm.userId = wechatQrcode.userId || ''
          this.ruleForm.remark = wechatQrcode.remark || ''
          this.ruleForm.pushType = pushMsg.pushType || ''
          this.ruleForm.content = pushMsg.content || ''
          this.ruleForm.filePath = pushMsg.filePath || ''
          this.ruleForm.file = pushMsg.file || ''
          this.ruleForm.title = pushMsg.title || ''
          this.ruleForm.sendUrl = pushMsg.sendUrl || ''
          this.pushMsgId = pushMsg.id || ''
          this.pushTypeImg = pushMsg.imgPath || ''
        })
        .catch(err => {
          console.log(err)
          this.$message.error('二维码加载失败，请稍后重试')
        })
        .then(() => { this.loading = false })
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        this.submitting = true
        this.ruleForm.qrcodeId = this.qrcodeId
        this.ruleForm.pushMsgId = this.pushMsgId

        const onDone = msg => {
          this.$message.success(msg || '已修改')
          this.$router.push({ name: 'QmList' })
        }
        const onErr = err => {
          console.log(err)
          this.$message.error('修改失败，请稍后重试')
        }

        if (this.ruleForm.pushType === 'image') {
          const params = new FormData()
          params.append('qrcodeId', this.ruleForm.qrcodeId)
          params.append('pushMsgId', this.ruleForm.pushMsgId)
          params.append('subscripType', this.ruleForm.subscripType)
          params.append('userId', this.ruleForm.userId)
          params.append('remark', this.ruleForm.remark)
          params.append('pushType', this.ruleForm.pushType)
          params.append('content', this.ruleForm.content)
          params.append('file', this.ruleForm.file)
          params.append('title', this.ruleForm.title)
          params.append('filePath', this.ruleForm.filePath)
          params.append('sendUrl', this.ruleForm.sendUrl)

          this.axios.post('wechat/qrcode/message', params, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
            .then(() => onDone('修改成功'))
            .catch(onErr)
            .then(() => { this.submitting = false })
        } else {
          this.axios.post('wechat/qrcode/message', this.ruleForm)
            .then(() => onDone('修改成功'))
            .catch(onErr)
            .then(() => { this.submitting = false })
        }
      })
    },
    cancel () {
      this.$router.push({ name: 'QmList' })
    },
    uploadImg1 () {
      const inputer = this.$refs.inputer
      this.ruleForm.file = inputer.files[0]
      if (this.ruleForm.file) this.pushTypeImg = ''
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
    this.getData()
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

.muted { color: var(--pc-ink-400); font-size: var(--pc-fs-12); }

.image-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .image-current {
    color: var(--pc-ink-600);
    font-size: var(--pc-fs-12);
    background: var(--pc-ink-100);
    padding: 2px 8px;
    border-radius: var(--pc-r-2);
    word-break: break-all;
  }
}

.send-row {
  display: flex;
  gap: 8px;
  align-items: center;

  .send-input { flex: 1; }
  .upload-btn { flex-shrink: 0; }
}
</style>
