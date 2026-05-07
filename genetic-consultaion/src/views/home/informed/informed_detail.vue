<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>知情同意</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/informed/list' }">知情列表</el-breadcrumb-item>
          <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="user-container">

          <el-form ref="informedForm" :model="informedContent" label-width="80px" size="mini" class="edit-form">
            <el-form-item label="订单编号">
              {{informedContent.orderNo}}
            </el-form-item>
            <el-form-item label="送检医院">
              {{informedContent.hospitalName}}
            </el-form-item>
            <el-form-item label="送检科室">
              {{informedContent.deptName}}
              <el-select class="width-100-p" v-model="informedContent.deptId" filterable placeholder="请选择">
                <el-option
                  v-for="item in depts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="送检医生">
              {{informedContent.doctor}}
            </el-form-item>
            <el-form-item label="条码编号">
              {{informedContent.sampleCode}}
            </el-form-item>
            <el-form-item label="送检项目">
              <el-select class="width-100-p" v-model="informedContent.solutionId" filterable placeholder="请选择">
                <el-option
                  v-for="item in projects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话">
              {{informedContent.cellphone}}
            </el-form-item>
            <el-form-item label="证件">
              {{informedContent.idCode}}
            </el-form-item>
            <el-form-item label="姓名">
              <el-col :span="9">
                {{informedContent.truename}}
              </el-col>
              <el-col class="line" :span="3" style="padding-left:10px;">性别</el-col>
              <el-col :span="12">
                {{informedContent.sex}}
              </el-col>
            </el-form-item>
            <el-form-item label="年龄">
              <el-col :span="9">
                {{informedContent.age}}
              </el-col>
              <el-col class="line" :span="3" style="padding-left:10px;">邮箱</el-col>
              <el-col :span="12">
                {{informedContent.email}}
              </el-col>
            </el-form-item>

            <el-form-item label="地址">
              <el-cascader class="width-100-p"
                :options="regionData"
                v-model="areaInfo"
                @change="addressHandleChange">
              </el-cascader>
              <div v-if="informedContent.province && areaInfo.length === 0"
                   style="color: #e6a23c; font-size: 12px; line-height: 1.4; margin-top: 4px;">
                当前存储值：{{ informedContent.province }} / {{ informedContent.city }} / {{ informedContent.county }}
                （未在最新地区库中匹配，请重新选择并保存即可自动修正）
              </div>
            </el-form-item>
            <el-form-item label="详细地址">
              {{informedContent.address}}
            </el-form-item>
            <el-form-item label="备注">
              {{informedContent.remark}}
            </el-form-item>
          </el-form>
        </div>
      </el-col>
<!--      <el-col :span="12">-->
<!--        <div class="img-content">-->
<!--          &lt;!&ndash;<img :src="imagePath">&ndash;&gt;-->
<!--          <img :src="imagePath" v-if="informedContent.mimeType != 'application/pdf'">-->
<!--          <object :data="imagePath" type="application/pdf" width="100%" height="700px" v-else>-->
<!--            <embed :src="imagePath">-->
<!--          </object>-->
<!--        </div>-->
<!--      </el-col>-->

    </el-row>
  </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'EditInformed',
  data () {
    return {
      smsStatus: 0,
      informedContent: {
        smsStatus: 0
      },
      projects: [],
      hospitals: [],
      depts: [],
      idType: [
        {'id': 0, 'name': '身份证'},
        {'id': 1, 'name': '军官证'},
        {'id': 2, 'name': '通行证'},
        {'id': 3, 'name': '社保卡'}
      ],
      imagePath: '',
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode,
      role: window.localStorage.role
    }
  },
  props: {},
  methods: {
    _initData () {
      this.axios.get('informed/' + this.$route.params.informedId).then(res => {
        this.informedContent = res.data
        if (res.data.tid !== undefined) {
          this.informedContent.orderNo = res.data.tid
        }
        if (this.informedContent.smsStatus === undefined) {
          this.informedContent.smsStatus = 0
          this.smsStatus = 0
        } else {
          this.smsStatus = 1
        }
        this.axios.get('oss/upload/show', {
          params: {
            objectKey: res.data.path
          }
        }).then(res1 => {
          this.imagePath = this.axios.defaults.baseURL.includes('https://')
            ? res1.data.replace('http://', 'https://') : res1.data
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })

      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.projects = res.data
      }).catch(err => {
        console.log(err)
      })
      this.axios.get('hospital-dept').then(res => {
        this.depts = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    edit () {
      delete this.informedContent.createTime
      this.axios.put('informed/' + this.$route.params.informedId, this.informedContent).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.push('/informed/list')
      }).catch(err => {
        this.$message.error('修改失败')
        console.log(err)
      })
    },
    cancel () {
      this.$router.push('/informed/list')
    },
    unread () {
      delete this.informedContent.createTime
      this.axios.put('informed/unread/' + this.$route.params.informedId, this.informedContent).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.push('/informed/list')
      }).catch(err => {
        this.$message.error('修改失败')
        console.log(err)
      })
    },
    addressHandleChange (value) {
      this.informedContent.province = this.CodeToText[value[0]]
      this.informedContent.city = this.CodeToText[value[1]]
      this.informedContent.county = this.CodeToText[value[2]]
    },
    hospitalQuerySearch (queryString, cb) {
      console.log(queryString)
      this.axios.get('hospital/page', {
        params: {
          pageNum: 1, // 页码
          pageSize: 8, // 每页长度
          keywords: queryString
        }
      }).then(res => {
        let result = []
        if (res.data.endRow === 0) {
          cb(result)
        } else {
          res.data.list.forEach(function (item) {
            result.push({
              'value': item.name,
              'id': item.id
            })
          })
          cb(result)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    hospitalHandleSelect (item) {
      this.informedContent.hospitalId = item.id
    },
    updateSmsStatus (status) {
      this.smsStatus = status
      this.informedContent.smsStatus = status
    }
  },
  filters: {},
  computed: {
    areaInfo: {
      get: function () {
        const c = this.informedContent
        if (c.county === undefined || c.county === '' || c.county === null) {
          return []
        }
        try {
          // 直辖市兼容：历史 C 端写入 province===city（如"北京市/北京市/朝阳区"），
          // 新 C 端对齐 element-china-area-data 后会写入"市辖区"，两种都能回显。
          const cityTemp = c.city === c.province ? '市辖区' : c.city
          const provNode = this.TextToCode[c.province]
          if (!provNode) return []
          const cityNode = provNode[cityTemp]
          if (!cityNode) return []
          const countyNode = cityNode[c.county]
          if (!countyNode) return []
          return [provNode.code, cityNode.code, countyNode.code]
        } catch (e) {
          console.warn('[informed_detail] 省市区回显失败', c.province, c.city, c.county, e)
          return []
        }
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
  .el-autocomplete {
    width: 100%;
  }
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
  }
  .user-container .header {
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
