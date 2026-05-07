<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>信息提取</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/informed/list' }">知情列表</el-breadcrumb-item>
          <el-breadcrumb-item>病理信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta" v-if="informed.patient && informed.patient.truename">
          <span>{{ informed.patient.truename }}</span>
          <span v-if="$route.params.sampleNo" class="num">· {{ $route.params.sampleNo }}</span>
        </div>
      </div>

      <el-row :gutter="20" v-loading="loading" element-loading-text="加载病理信息">
        <el-col :span="14">
          <div class="panel">
            <div class="section-header">
              <h4>受检者信息</h4>
            </div>
            <div class="meta-grid">
              <span class="meta-label">检测项目</span><span class="meta-value">{{ informed.productName || '—' }}</span>
              <span class="meta-label">姓名</span><span class="meta-value">{{ patientName || '—' }}</span>
              <span class="meta-label">性别</span><span class="meta-value">{{ patientSex || '—' }}</span>
              <span class="meta-label">出生日期</span><span class="meta-value num">{{ informed.patient && informed.patient.birthday | formatDate }}</span>
            </div>

            <div class="section-header">
              <h4>送检信息</h4>
            </div>
            <div class="meta-grid">
              <span class="meta-label">医院</span><span class="meta-value">{{ hospitalLabel || '—' }}</span>
              <span class="meta-label">科室</span><span class="meta-value">{{ deptLabel || '—' }}</span>
              <span class="meta-label">医生</span><span class="meta-value">{{ doctorLabel || '—' }}</span>
            </div>

            <div class="section-header">
              <h4>病理信息</h4>
            </div>
            <div v-if="hasPathology" class="meta-grid">
              <template v-if="cancerLabel">
                <span class="meta-label">癌种</span><span class="meta-value">{{ cancerLabel }}</span>
              </template>
              <template v-for="(info, index) in moreInfo">
                <span class="meta-label" :key="'k' + index">{{ info.key }}</span>
                <span class="meta-value" :key="'v' + index">{{ info.value }}</span>
              </template>
            </div>
            <div v-else class="empty-inline">
              <p class="empty-title">病理信息暂未录入</p>
              <p class="empty-hint">实验室录入病理后会显示在这里</p>
            </div>

            <el-form ref="formData" :rules="formRules" :model="formData" label-width="100px" size="small" class="address-form">
              <div class="section-header">
                <h4>报告接收地址</h4>
              </div>
              <el-form-item label="收件人" prop="orderReceiver.receiver">
                <el-input v-model="formData.orderReceiver.receiver" placeholder="请输入收件人姓名"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="orderReceiver.cellphone">
                <el-input v-model="formData.orderReceiver.cellphone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
              <el-form-item label="所在地区" prop="receiverallAddress" v-if="addressOne">
                <el-cascader
                  placeholder="请选择省市区"
                  class="width-100-p"
                  v-model="formData.receiverallAddress"
                  :options="addressOptions"
                  @change="handleChangAddress($event, 'orderReceiver')"></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址" prop="orderReceiver.address">
                <el-input v-model="formData.orderReceiver.address" placeholder="请输入街道 / 门牌号"></el-input>
              </el-form-item>

              <div class="section-header">
                <h4>剩余蜡块接收地址</h4>
              </div>
              <el-form-item label="收件人">
                <el-input v-model="formData.waxOrderReceiver.receiver" placeholder="请输入收件人姓名"></el-input>
              </el-form-item>
              <el-form-item label="联系方式">
                <el-input v-model="formData.waxOrderReceiver.cellphone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
              <el-form-item label="所在地区">
                <el-cascader
                  placeholder="请选择省市区"
                  class="width-100-p"
                  v-model="formData.waxReceiverallAddress"
                  :options="addressOptions"
                  @change="handleChangAddress($event, 'waxOrderReceiver')"></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="formData.waxOrderReceiver.address" placeholder="请输入街道 / 门牌号"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>

        <el-col :span="10">
          <div class="panel">
            <div v-if="!informed.informedUrl && !pathologicFiles.length" class="doc-empty">
              <p class="empty-title">客户尚未签署知情同意</p>
              <p class="empty-hint">签署完成后这里会显示手写签名 + 病理报告文件</p>
            </div>
            <template v-else>
              <div class="section-header">
                <h4>手写签名</h4>
              </div>
              <div class="signature" v-if="informed.informedUrl">
                <img :src="informed.informedUrl">
              </div>
              <div class="doc-empty" v-else>
                <p class="empty-title">尚无签名</p>
              </div>

              <div class="section-header">
                <h4>病理报告文件</h4>
              </div>
              <div class="pathologic-files" v-if="pathologicFiles.length">
                <div class="pathologic-item" v-for="(img, index) in pathologicFiles" :key="index">
                  <img :src="img">
                </div>
              </div>
              <div class="doc-empty" v-else>
                <p class="empty-title">尚无报告文件</p>
              </div>
            </template>
          </div>
        </el-col>
      </el-row>

      <div class="footer-btn">
        <el-button @click="cancel">返回</el-button>
        <el-button type="primary" :loading="submitting" @click="submitAddress('formData')">保存地址</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { formatDate } from '@/utils/pc'

export default {
  name: 'InformedAll',
  data () {
    return {
      addressOne: true,
      informed: {
        patient: { birthday: '' },
        informed: { hospitalTemp: '' }
      },
      moreInfo: [],
      addressOptions: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode,
      formData: {
        receiverallAddress: '',
        waxReceiverallAddress: '',
        orderReceiver: { receiver: '', cellphone: '', subscribe: 'ru6c', province: '', city: '', county: '', address: '' },
        waxOrderReceiver: { receiver: '', cellphone: '', subscribe: 'ru6c', province: '', city: '', county: '', address: '' }
      },
      formRules: {
        'orderReceiver.receiver': [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        'orderReceiver.cellphone': [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[2-9]\d{9}$/, message: '请输入正确的电话号码' }
        ],
        receiverallAddress: [{ required: true, message: '请选择省市区', trigger: 'change' }],
        'orderReceiver.address': [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        'waxOrderReceiver.cellphone': [
          { pattern: /^1[2-9]\d{9}$/, message: '请输入正确的电话号码' }
        ]
      },
      role: window.localStorage.role,
      loading: false,
      submitting: false
    }
  },
  filters: { formatDate },
  computed: {
    patientName () { return this.informed.patient ? this.informed.patient.truename : '' },
    patientSex () { return this.informed.patient ? this.informed.patient.sex : '' },
    hospitalLabel () { return this.informed.hospitalName || (this.informed.informed && this.informed.informed.hospitalTemp) || '' },
    deptLabel () { return this.informed.deptName || (this.informed.informed && this.informed.informed.deptTemp) || '' },
    doctorLabel () { return this.informed.informed ? this.informed.informed.doctor : '' },
    cancerLabel () { return this.informed.informed ? this.informed.informed.cancerType : '' },
    pathologicFiles () { return this.informed.pathologicFiles || [] },
    hasPathology () { return !!this.cancerLabel || this.moreInfo.length > 0 }
  },
  methods: {
    _initData () {
      this.loading = true
      this.axios.get('ru6c/informed/info', {
        params: { sampleCode: this.$route.params.sampleNo }
      }).then(res => {
        this.informed = res.data || {}
        if (this.informed.informed && this.informed.informed.moreInfo) {
          try {
            this.moreInfo = JSON.parse(this.informed.informed.moreInfo)
          } catch (err) {
            console.log('moreInfo parse failed', err)
          }
        }
        if (res.data && res.data.receiver) {
          this.formData.orderReceiver = this.informed.receiver
          this.addressSee(res.data.receiver, 'orderReceiver', 'receiverallAddress')
        }
        if (res.data && res.data.waxReceiver) {
          this.formData.waxOrderReceiver = this.informed.waxReceiver
          this.addressSee(res.data.waxReceiver, 'waxOrderReceiver', 'waxReceiverallAddress')
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('病理信息加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    addressSee (data, type, address) {
      if (!data || !data.province) return
      try {
        const provNode = this.TextToCode[data.province]
        if (!provNode) return
        if (!data.city) {
          this.addressOne = false
          return
        }
        const cityTemp = data.province === data.city ? '市辖区' : data.city
        const cityNode = provNode[cityTemp]
        if (!cityNode) return
        const countyNode = cityNode[data.county]
        if (!countyNode) return
        this.formData[address] = [provNode.code, cityNode.code, countyNode.code]
      } catch (err) {
        console.warn('[informed_all] 省市区回显失败', data.province, data.city, data.county, err)
      }
    },
    handleChangAddress (val, type) {
      if (!val || !val.length) return
      this.formData[type].province = this.CodeToText[val[0]]
      this.formData[type].city = this.CodeToText[val[1]]
      this.formData[type].county = this.CodeToText[val[2]]
    },
    submitAddress (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        this.submitting = true
        const payload = Object.assign({}, this.formData)
        delete payload.receiverallAddress
        delete payload.waxReceiverallAddress
        this.axios.put('/order/received/' + this.$route.params.orderId, payload)
          .then(res => {
            if (res.data === '修改成功') {
              this.$message.success('地址已保存')
              this.$router.push('/informed/list')
            } else {
              this.$message.warning('保存失败')
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.error('保存失败，请稍后重试')
          })
          .then(() => { this.submitting = false })
      })
    },
    cancel () {
      this.$router.push('/informed/list')
    }
  },
  created () {
    this._initData()
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
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 14px;
  margin-bottom: 16px;
  border-bottom: var(--pc-bd-hair);

  .page-meta {
    font-size: var(--pc-fs-13);
    color: var(--pc-ink-500);
    .num { font-variant-numeric: tabular-nums; margin-left: 4px; }
  }
}

.panel {
  background: var(--pc-ink-50);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-header {
  margin: 16px 0 10px;
  padding-bottom: 6px;
  border-bottom: var(--pc-bd-hair);

  &:first-child { margin-top: 0; }

  h4 {
    margin: 0;
    font-size: var(--pc-fs-14);
    font-weight: 600;
    color: var(--pc-ink-800);
  }
}

.meta-grid {
  display: grid;
  grid-template-columns: 90px 1fr;
  row-gap: 6px;
  column-gap: 8px;
  margin-bottom: 12px;
  font-size: var(--pc-fs-13);

  .meta-label {
    color: var(--pc-ink-500);
  }
  .meta-value {
    color: var(--pc-ink-800);
    word-break: break-all;
    &.num { font-variant-numeric: tabular-nums; }
  }
}

.address-form {
  margin-top: 4px;
}

.signature {
  background: var(--pc-white);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  padding: 10px;
  margin-bottom: 12px;

  img {
    width: 100%;
    display: block;
  }
}

.pathologic-files {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pathologic-item {
  background: var(--pc-white);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  padding: 10px;

  img {
    width: 100%;
    display: block;
  }
}

.doc-empty {
  padding: 30px 0 20px;
  text-align: center;
  background: var(--pc-white);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  margin-bottom: 12px;

  .empty-title {
    margin: 0 0 4px;
    font-size: var(--pc-fs-14);
    color: var(--pc-ink-600);
  }
  .empty-hint {
    margin: 0;
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-400);
  }
}

.empty-inline {
  padding: 16px 0 12px;
  text-align: center;
  background: var(--pc-white);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  margin-bottom: 12px;

  .empty-title {
    margin: 0 0 4px;
    font-size: var(--pc-fs-13);
    color: var(--pc-ink-500);
  }
  .empty-hint {
    margin: 0;
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-400);
  }
}

.footer-btn {
  margin-top: 20px;
  padding-top: 16px;
  border-top: var(--pc-bd-hair);
  text-align: center;
}

.width-100-p { width: 100%; }
</style>
