<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>信息提取</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/informed/list' }">知情列表</el-breadcrumb-item>
          <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" v-if="role === 'manager' || role === 'jk-service'">
        <div class="user-container">
          <el-form ref="informedForm" :model="informedContent" label-width="80px" size="mini" class="edit-form">
            <el-form-item label="订单编号">
              <el-input v-model="informedContent.orderNo"></el-input>
            </el-form-item>
            <el-form-item label="送检医院">
              <el-autocomplete
                class="inline-input"
                v-model="informedContent.hospitalName"
                :fetch-suggestions="hospitalQuerySearch"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="hospitalHandleSelect"
              ></el-autocomplete>
              <!--<el-select class="width-100-p" v-model="informedContent.hospitalId" filterable placeholder="请选择">-->
                <!--<el-option-->
                  <!--v-for="item in hospitals"-->
                  <!--:key="item.id"-->
                  <!--:label="item.name"-->
                  <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->
            </el-form-item>
            <el-form-item label="送检科室">
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
              <el-input v-model="informedContent.doctor"></el-input>
            </el-form-item>
            <el-form-item label="条码编号">
              <el-input v-model="informedContent.sampleCode"></el-input>
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
              <el-input v-model="informedContent.cellphone"></el-input>
            </el-form-item>
            <el-form-item label="发送短信">
              <el-radio-group v-model="smsStatus">
                <el-radio @click.native.prevent="updateSmsStatus(0)" :label="0">发送</el-radio>
                <el-radio @click.native.prevent="updateSmsStatus(1)" :label="1">不发送</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件类型">
              <el-col :span="9">
                <el-select v-model="informedContent.idType" filterable placeholder="请选择">
                  <el-option
                    v-for="item in idType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
              <el-col class="line" :span="3" style="padding-left:10px;">号码</el-col>
              <el-col :span="12">
                <el-input v-model="informedContent.idCode"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="姓名">
              <el-col :span="9">
                <el-input v-model="informedContent.truename"></el-input>
              </el-col>
              <el-col class="line" :span="3" style="padding-left:10px;">性别</el-col>
              <el-col :span="12">
                <el-radio-group v-model="informedContent.sex">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-col>
            </el-form-item>
            <el-form-item label="年龄">
              <el-col :span="9">
                <el-input v-model="informedContent.age"></el-input>
              </el-col>
              <el-col class="line" :span="3" style="padding-left:10px;">邮箱</el-col>
              <el-col :span="12">
                <el-input v-model="informedContent.email"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="地址">
              <el-cascader class="width-100-p"
                :options="regionData"
                v-model="areaInfo"
                @change="addressHandleChange">
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="informedContent.address"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="informedContent.remark"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="cancel">取消</el-button>
              <el-button @click="unread">图形不可读</el-button>
              <el-button type="primary" @click="edit">保存信息</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="img-content">
          <!--<img :src="imagePath">-->
          <img :src="imagePath" v-if="informedContent.mimeType != 'application/pdf'">
          <object :data="imagePath" type="application/pdf" width="100%" height="700px" v-else>
            <embed :src="imagePath">
          </object>
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
          userId: window.localStorage.userId
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
        if (this.informedContent.county === undefined || this.informedContent.county === '' || this.informedContent.county === null) {
          return []
        }
        return [this.TextToCode[this.informedContent.province].code, this.TextToCode[this.informedContent.province][this.informedContent.city].code, this.TextToCode[this.informedContent.province][this.informedContent.city][this.informedContent.county].code]
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
