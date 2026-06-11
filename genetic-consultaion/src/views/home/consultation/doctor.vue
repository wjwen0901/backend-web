<template>
  <div class="pc-page">
    <div class="consultation-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>互医管理</el-breadcrumb-item>
          <el-breadcrumb-item>医生管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 位医生</div>
      </div>

      <!-- H5 问诊总开关：控制调用方(易见康/吉因加)是否进入 H5 问诊 -->
      <div class="switch-bar">
        <div class="switch-main">
          <span class="switch-label">H5 问诊总开关</span>
          <el-switch
            v-model="h5Enabled"
            :disabled="switchLoading"
            active-color="#18806a"
            active-text="已开启 · 调用方进入问诊"
            inactive-text="已关闭 · 走原下单流程"
            @change="onSwitchChange">
          </el-switch>
        </div>
        <span class="switch-hint">关闭后，易见康 / 吉因加点击送检将跳过问诊直接进入原下单流程，立即生效</span>
      </div>

      <div class="opera-bar">
        <div class="filters">
          <el-input
            v-model="filterName"
            placeholder="搜索医生姓名"
            size="small"
            clearable
            class="search-input"
            @keyup.enter.native="handleSearch"
            @clear="handleSearch">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
          <el-select v-model="filterCategory" placeholder="产品类型" size="small" clearable @change="handleSearch">
            <el-option v-for="c in categoryOptions" :key="c.value" :label="c.label" :value="c.value"></el-option>
          </el-select>
          <el-select v-model="filterStatus" placeholder="状态" size="small" clearable @change="handleSearch">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
        </div>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">新增医生</el-button>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载医生列表"
        style="width: 100%">
        <el-table-column prop="id" label="ID" width="60">
          <template slot-scope="scope"><span class="num">{{ scope.row.id }}</span></template>
        </el-table-column>
        <el-table-column label="头像" width="64">
          <template slot-scope="scope">
            <img v-if="scope.row.avatar" :src="scope.row.avatar" class="avatar-cell">
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="title" label="职称" width="110"></el-table-column>
        <el-table-column prop="hospital" label="所属互联网医院" min-width="170" show-overflow-tooltip></el-table-column>
        <el-table-column prop="department" label="科室" width="110"></el-table-column>
        <el-table-column label="执业证编号" width="150">
          <template slot-scope="scope"><span class="num">{{ scope.row.licenseNo }}</span></template>
        </el-table-column>
        <el-table-column label="产品类型" width="100">
          <template slot-scope="scope">
            <el-tag size="mini" disable-transitions>{{ categoryLabel(scope.row.productCategory) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="从业" width="60">
          <template slot-scope="scope"><span class="num">{{ scope.row.yearsOfPractice }}年</span></template>
        </el-table-column>
        <el-table-column label="服务" width="70">
          <template slot-scope="scope"><span class="num">{{ scope.row.serviceCount }}</span></template>
        </el-table-column>
        <el-table-column label="好评率" width="70">
          <template slot-scope="scope"><span class="num">{{ scope.row.rating }}%</span></template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-tag size="mini" :class="scope.row.status === 1 ? 'el-tag--succ' : ''" disable-transitions>
              {{ scope.row.status === 1 ? '启用' : '已停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status === 1" type="text" size="mini" class="danger" @click="toDisable(scope.row)">停用</el-button>
            <el-button v-else type="text" size="mini" @click="toEnable(scope.row)">启用</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="empty">
            <p class="empty-title">{{ filterName ? '没有匹配的医生' : '尚无医生数据' }}</p>
            <p class="empty-hint">{{ filterName ? '试试调整筛选条件' : '新增医生后会在这里显示，问诊会按产品类型从启用医生中均衡分配' }}</p>
          </div>
        </template>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>

    <el-dialog :title="doctor.id ? '编辑医生' : '新增医生'" :visible.sync="dialogVisible" width="640px">
      <el-form ref="doctorForm" :model="doctor" :rules="rules" label-width="100px" size="small">
        <el-form-item label="头像">
          <el-upload
            action="#"
            :http-request="uploadAvatar"
            :show-file-list="false"
            accept="image/jpeg,image/png">
            <img v-if="doctor.avatar" :src="doctor.avatar" class="avatar-preview">
            <el-button v-else size="small" :loading="avatarUploading">上传头像</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="doctor.name" placeholder="医生真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select v-model="doctor.title" placeholder="请选择职称" class="width-100-p">
            <el-option v-for="t in ['主治医师', '副主任医师', '主任医师']" :key="t" :label="t" :value="t"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="互联网医院" prop="hospital">
          <el-input v-model="doctor.hospital" placeholder="所属互联网医院名称"></el-input>
        </el-form-item>
        <el-form-item label="科室" prop="department">
          <el-input v-model="doctor.department" placeholder="如：肿瘤内科 / 医学遗传科"></el-input>
        </el-form-item>
        <el-form-item label="执业证编号" prop="licenseNo">
          <el-input v-model="doctor.licenseNo" placeholder="C 端展示时自动脱敏"></el-input>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select v-model="doctor.productCategory" placeholder="用于医生分配匹配" class="width-100-p" clearable>
            <el-option v-for="c in categoryOptions" :key="c.value" :label="c.label" :value="c.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="从业年限">
          <el-input-number v-model="doctor.yearsOfPractice" :min="0" :max="60"></el-input-number>
        </el-form-item>
        <el-form-item label="好评率(%)">
          <el-input-number v-model="doctor.rating" :min="0" :max="100"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ConsultationDoctor',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      filterName: '',
      filterCategory: '',
      filterStatus: '',
      submitting: false,
      avatarUploading: false,
      dialogVisible: false,
      h5Enabled: false,
      switchLoading: false,
      doctor: {},
      // 医生的 general = 全科兜底：精确分类无可用医生时承接所有分类的问诊
      categoryOptions: [
        { value: 'oncology', label: '肿瘤检测' },
        { value: 'genetic', label: '遗传检测' },
        { value: 'general', label: '全科 / 兜底（general）' }
      ],
      rules: {
        name: [{ required: true, message: '请输入医生姓名', trigger: 'blur' }],
        title: [{ required: true, message: '请选择职称', trigger: 'change' }],
        hospital: [{ required: true, message: '请输入互联网医院名称', trigger: 'blur' }],
        department: [{ required: true, message: '请输入科室', trigger: 'blur' }],
        licenseNo: [{ required: true, message: '请输入执业证编号', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getSwitch () {
      this.axios.get('saas/consultation/switch').then(res => {
        const body = res.data || {}
        if (body.code === 200 && body.data) {
          this.h5Enabled = !!body.data.enabled
        }
      }).catch(() => {
        // 读取失败不打断页面，开关保持默认关闭态显示
      })
    },
    onSwitchChange (val) {
      if (this.switchLoading) return
      this.switchLoading = true
      this.axios.post('saas/consultation/switch', { enabled: val }).then(res => {
        const body = res.data || {}
        if (body.code === 200) {
          this.$message.success(val ? 'H5 问诊已开启' : 'H5 问诊已关闭')
        } else {
          this.h5Enabled = !val
          this.$message.error(body.message || '开关设置失败')
        }
      }).catch(() => {
        this.h5Enabled = !val
        this.$message.error('开关设置失败，请稍后重试')
      }).then(() => {
        this.switchLoading = false
      })
    },
    getData () {
      this.loading = true
      this.axios.get('saas/consultation/doctor/list', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.filterName || undefined,
          productCategory: this.filterCategory || undefined,
          status: this.filterStatus === '' ? undefined : this.filterStatus
        }
      }).then(res => {
        const body = res.data || {}
        if (body.code !== 200) {
          this.$message.error(body.message || '医生列表加载失败')
          return
        }
        const page = body.data || {}
        this.list = page.list || []
        this.totalPage = page.total || 0
      }).catch(() => {
        this.$message.error('医生列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSearch () {
      this.pageNum = 1
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    },
    categoryLabel (value) {
      const hit = this.categoryOptions.find(c => c.value === value)
      return hit ? hit.label : (value || '—')
    },
    toAdd () {
      this.doctor = { yearsOfPractice: 0, rating: 99 }
      this.dialogVisible = true
    },
    toEdit (row) {
      this.doctor = Object.assign({}, row)
      this.dialogVisible = true
    },
    submitForm () {
      this.$refs.doctorForm.validate(valid => {
        if (!valid) return
        this.submitting = true
        this.axios.post('saas/consultation/doctor/save', this.doctor).then(res => {
          const body = res.data || {}
          if (body.code === 200) {
            this.$message.success(this.doctor.id ? '医生已更新' : '医生已新增')
            this.dialogVisible = false
            this.getData()
          } else {
            this.$message.error(body.message || '保存失败')
          }
        }).catch(() => {
          this.$message.error('保存失败，请稍后重试')
        }).then(() => {
          this.submitting = false
        })
      })
    },
    toDisable (row) {
      this.$confirm('停用后该医生不再参与问诊分配，确认停用？', '停用医生', {
        confirmButtonText: '停用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('saas/consultation/doctor/' + row.id).then(res => {
          const body = res.data || {}
          if (body.code === 200) {
            this.$message.success('医生已停用')
            this.getData()
          } else {
            this.$message.error(body.message || '停用失败')
          }
        }).catch(() => {
          this.$message.error('停用失败，请稍后重试')
        })
      }).catch(() => {})
    },
    toEnable (row) {
      this.axios.post('saas/consultation/doctor/save', { id: row.id, status: 1 }).then(res => {
        const body = res.data || {}
        if (body.code === 200) {
          this.$message.success('医生已启用')
          this.getData()
        } else {
          this.$message.error(body.message || '启用失败')
        }
      }).catch(() => {
        this.$message.error('启用失败，请稍后重试')
      })
    },
    uploadAvatar (req) {
      const file = req.file
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error('头像不能超过 5MB')
        return
      }
      this.avatarUploading = true
      // 复用现有 OSS policy 直传（fileType=consultation-avatar，桶 public-read 可直显）
      this.axios.get('oss/upload/policy/consultation-avatar').then(res => {
        const p = res.data || {}
        if (!p.policy) {
          throw new Error(p.message || 'policy missing')
        }
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
        const key = p.dir + p.uniqueKey + '.' + ext
        const form = new FormData()
        form.append('key', key)
        form.append('policy', p.policy)
        form.append('OSSAccessKeyId', p.accessid)
        form.append('success_action_status', '200')
        form.append('signature', p.signature)
        form.append('file', file)
        return window.fetch('https://' + p.host, { method: 'POST', body: form }).then(resp => {
          if (!resp.ok) {
            throw new Error('oss ' + resp.status)
          }
          this.$set(this.doctor, 'avatar', 'https://' + p.host + '/' + key)
          this.$message.success('头像已上传')
        })
      }).catch(() => {
        this.$message.error('头像上传失败，请重试')
      }).then(() => {
        this.avatarUploading = false
      })
    }
  },
  created () {
    this.getSwitch()
    this.getData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.consultation-container {
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
    strong {
      color: var(--pc-ink-800);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
  }
}

.switch-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  margin-bottom: 14px;
  background: var(--pc-bg-soft, #f6f8f8);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);

  .switch-main {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .switch-label {
    font-size: var(--pc-fs-14);
    font-weight: 600;
    color: var(--pc-ink-800);
  }
  .switch-hint {
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-400);
  }
}

.opera-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .filters {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .search-input {
    width: 240px;
  }
}

.avatar-cell {
  width: 32px;
  height: 32px;
  border-radius: var(--pc-r-2);
  object-fit: cover;
  display: block;
}

.avatar-preview {
  width: 64px;
  height: 64px;
  border-radius: var(--pc-r-4);
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.width-100-p {
  width: 100%;
}

.empty {
  padding: 40px 0 24px;
  text-align: center;
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

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
  .danger { color: var(--pc-neg-600); }
}
</style>
