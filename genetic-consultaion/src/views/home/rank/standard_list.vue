<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>评分标准列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="product-container">
      <div>
        <el-button class="add-solution" size="small" type="primary" @click="toAdd">新增</el-button>
        <div class="search-box">
          <el-input placeholder="请输入评分名称" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="standardList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="评分标准">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建日期"
          width="180">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="toPiece(scope.row.id, scope.row.name)">评分项维护</el-button>
            <el-button type="text" size="small" @click="toDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100, 150]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
    <el-dialog :title="standard === {} ? '新增' : '编辑'" :visible.sync="dialogAddFormVisible">
      <div>
        <el-form ref="form" :model="standard" label-width="100px">
          <el-form-item label="评分标准标题">
            <el-input v-model="standard.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="standard.id === undefined" type="primary" @click="onAddSubmit()">确定</el-button>
            <el-button v-else type="primary" @click="onEditSubmit(standard)">确定</el-button>
            <el-button @click="dialogAddFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="评分标准细分编辑" :visible.sync="dialogPieceFormVisible">
      <div>
        <el-form ref="form" :model="standard" label-width="100px">
          <el-form-item label="评分项：">
             {{standard.name}}
          </el-form-item>
          <el-form-item label="评分标准：">
            <el-table
              :data="standardPieces"
              size="mini"
              border
              style="width: 100%">
              <el-table-column
                prop="id"
                label="评分标准">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.rule"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="分数">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.score"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="editPieace(scope.row)">确认修改</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="addPieceStatus"
              :data="addPieces"
              size="mini"
              border
              style="width: 100%">
              <el-table-column
                prop="id"
                label="评分标准">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.rule"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="分数">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.score"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="deletePieace(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" @click="toAddPieace(standard.id)">新增</el-button>
            <el-button type="primary" @click="addPieace()" v-if="addPieceStatus">提交数据</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="standard.id === undefined" type="primary" @click="onAddSubmit()">确定</el-button>
            <el-button v-else type="primary" @click="onEditSubmit(standard.id)">确定</el-button>
            <el-button @click="dialogPieceFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'StandardList',
  data () {
    return {
      standardList: [],
      standardPieces: [],
      addPieces: [],
      standard: {},
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      paramSelect: '',
      condition: null,
      dialogAddFormVisible: false,
      dialogPieceFormVisible: false,
      addPieceStatus: false
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('term', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          condition: this.condition,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.standardList = res.data
        this.totalPage = res.data.length
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.productPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.productPageNum = val
      this.getData()
    },
    toAdd () {
      this.standard = {}
      this.dialogAddFormVisible = true
    },
    onAddSubmit () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'post',
        url: 'term',
        data: _this.standard,
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        _this.$message({
          message: '新增成功',
          type: 'success'
        })
        _this._initData()
        _this.dialogAddFormVisible = false
      })
    },
    toDetail (data) {
      this.standard = data
      this.dialogAddFormVisible = true
    },
    onEditSubmit () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'put',
        url: 'term',
        data: _this.standard,
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        },
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
        _this.dialogAddFormVisible = false
      })
    },
    editPieace (standardPiece) {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      console.log(_this.standard)
      instance({
        method: 'put',
        url: 'term/piece',
        data: standardPiece,
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        },
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
        _this.dialogAddFormVisible = false
      })
    },
    toPiece (id, name) {
      this.standard.id = id
      this.standard.name = name
      this.axios.get('term/piece/' + id, {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.standardPieces = res.data
      }).catch(err => {
        console.log(err)
      })
      this.dialogPieceFormVisible = true
    },
    toAddPieace (tid) {
      this.addPieceStatus = true
      const piece = {
        termId: tid
      }
      this.addPieces.push(piece)
    },
    addPieace () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      this.addPieces.forEach((value, index) => {
        console.log(value)
        if (value !== undefined && value.score !== undefined && value.rule !== undefined) {
          instance({
            method: 'post',
            url: 'term/piece',
            data: value,
            params: {
              userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
            },
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/json'
            }
          }).then(function (response) {
            if (index === _this.addPieces.length - 1) {
              _this.$message({
                message: '修改成功',
                type: 'success'
              })
              _this._initData()
              _this.dialogPieceFormVisible = false
              _this.addPieceStatus = false
            }
          })
        }
      })
    },
    toDelete (id) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.axios.delete('term/' + id, {
            params: {
              userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
            }
          }).then(res => {
            this.getData()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }).catch(err => {
            console.log(err)
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          })
        })
        .catch(_ => {})
    }
  },
  filters: {
  },
  computed: {},
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
  .product-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .header {
      margin-bottom: 20px;
      font-size: 18px;
    }
    .search-box {
      width: 400px;
      float: right;
      margin-bottom: 10px;
    }
    .add-solution {
    }
  }
</style>
