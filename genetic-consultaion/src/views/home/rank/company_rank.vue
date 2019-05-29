<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/rank/list' }">实验室排名</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{companyName}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="rank-container">
          <el-form ref="form" :model="standard" label-width="100px" v-if="menuInfo == '新增'">
            <el-form-item label="选择实验室">
              <el-select v-model="companyId" filterable placeholder="请选择">
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-table
            :data="terms"
            size="mini"
            border
            style="width: 100%">
            <el-table-column
              prop="name"
              label="评分项">
            </el-table-column>
            <el-table-column
              prop="score"
              label="得分">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="toDetail(scope.row.id, scope.row.name)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="选择评分标准" :visible.sync="dialogPieceFormVisible">
      <div>
        <el-form ref="form" :model="standard" label-width="100px">
          <el-form-item label="评分项：">
            {{standard.name}}
          </el-form-item>
          <el-form-item label="评分标准：">
            <el-table
              ref="multipleTable"
              tooltip-effect="dark"
              :data="standardPieces"
              size="mini"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="rule"
                label="评分标准">
              </el-table-column>
              <el-table-column
                prop="score"
                label="分数">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="pieceSubmit(standard.id)">确定</el-button>
            <el-button @click="dialogPieceFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'EditInformed',
  data () {
    return {
      menuInfo: this.$route.params.id === undefined ? '新增' : '编辑',
      companyName: this.$route.query.name,
      rank: {},
      rankList: [],
      terms: [],
      deptList: [],
      standard: {},
      standardPieces: [],
      dialogPieceFormVisible: false,
      multipleSelection: [],
      pieceIds: [],
      updateRanks: {},
      companyList: [],
      companyId: null
    }
  },
  props: {},
  methods: {
    _initData () {
      if (this.$route.params.id !== undefined) {
        this.companyId = this.$route.params.id
        this.axios.get('term', {
          params: {
            condition: this.condition
          }
        }).then(res => {
          const rankTemp = res.data
          const _this = this
          this.axios.get('assess/company/' + this.$route.params.id).then(res => {
            _this.rankList = res.data
            rankTemp.forEach((value) => {
              _this.rankList.some((value1) => {
                if (value.id === value1.termId) {
                  value.score = value1.score
                  return true
                } else {
                  value.score = 0
                }
              })
              _this.terms.push(value)
            })
          }).catch(err => {
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.axios.get('term', {
          params: {
            condition: this.condition
          }
        }).then(res => {
          this.terms = res.data
        }).catch(err => {
          console.log(err)
        })
        this.axios.get('company').then(res => {
          this.companyList = res.data
        }).catch(err => {
          console.log(err)
        })
      }
    },
    toDetail (id, name) {
      this.standard.id = id
      this.standard.name = name

      this.axios.get('term/piece/' + id).then(res => {
        this.standardPieces = res.data
        this.axios.get('assess/piece', {
          params: {
            termId: id,
            companyId: this.companyId
          }
        }).then(res1 => {
          let p = res1.data
          let _this = this
          console.log(p)
          p.forEach((value) => {
            _this.pieceIds.push(value.id)
          })
          console.log(_this.pieceIds)
          this.standardPieces.forEach(row => {
            if (_this.pieceIds.includes(row.id)) {
              console.log(row.id)
              this.$refs.multipleTable.toggleRowSelection(row)
            }
          })
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
      this.dialogPieceFormVisible = true
    },
    handleSelectionChange (val) {
      console.log(val)
      this.multipleSelection = val
    },
    pieceSubmit (id) {
      if (this.$route.params.id !== undefined) {
        this.updateRanks.companyId = parseInt(this.$route.params.id)
        const editPieceIds = []
        if (this.multipleSelection.length !== 0) {
          this.multipleSelection.forEach(value => {
            editPieceIds.push(value.id)
          })
        }
        this.updateRanks.editPieceIds = [{'termId': id, 'pieceIds': editPieceIds}]
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'put',
          url: 'assess/company',
          data: this.updateRanks,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this._initData()
          _this.dialogPieceFormVisible = false
        })
      } else {
        this.updateRanks.companyId = this.companyId
        const editPieceIds = []
        if (this.multipleSelection.length !== 0) {
          this.multipleSelection.forEach(value => {
            editPieceIds.push(value.id)
          })
        }
        this.updateRanks.uploadPieceIds = editPieceIds
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'post',
          url: 'assess/company',
          data: this.updateRanks,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this._initData()
          _this.dialogPieceFormVisible = false
        })
      }
    },
    cancel () {
      this.$router.push('/rank')
    }
  },
  filters: {},
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
  .rank-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .el-input {
      width: 100%;
    }
  }
  .rank-container .header {
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
