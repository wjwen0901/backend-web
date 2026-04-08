<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/drug' }">指南管理</el-breadcrumb-item>
          <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="drug-container">
          <el-form ref="solutionForm"  label-width="100px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="中文标题*">
                <span>{{datas.title}}</span>
              </el-form-item>
              <el-form-item label="制定者*">
                <span v-for="(item,index) in datas.framers" :key='index'>{{item}}</span>
              </el-form-item>
              <el-form-item label="发布日期*">
                  <span v-for="(item,index) in datas.publishDate" :key="index">{{item}}</span>
              </el-form-item>
              <el-form-item label="检测产品">
                <span v-for="(item,index) in Name.products" :key="index">{{item.productName}}&nbsp;&nbsp;</span>
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="英文标题*">
                 <span v-for="(item,index) in datas.titleEn" :key="index">{{item}}&nbsp;&nbsp;</span>
              </el-form-item>
              <el-form-item label="出处*">
                <span v-for="(item,index) in datas.provenance" :key="index">{{item}}&nbsp;&nbsp;</span>
              </el-form-item>
              <el-form-item label="相关疾病">
                <span v-for="(item,index) in Name.diseases" :key="index">{{item.diseaseName}}&nbsp;&nbsp;</span>
              </el-form-item>
              <el-form-item label="相关基因">
                <span v-for="(item,index) in Name.genes" :key="index">{{item.geneName}}&nbsp;&nbsp;</span>
              </el-form-item>
            </div>
            <div class="form-line">
              <ul class="form-list" >
                <li v-for="(item,index) in list" :key="index" @click="cur=index" :class="{active:cur==index}">
                 {{item.id}}.{{item.name}}
                </li>
              </ul>
              <div class="from-contents" v-show="cur==0">
                <span v-for="(item,index) in datas.files" :key="index" class="path" @click="openPath(item.path)">
                  {{item.file_source}}
                </span>
              </div>
              <div class="from-contents" v-show="cur==1">
                <p v-html="datas.other"></p>
              </div>
               <div class="from-select">
              </div>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "DiseaseEdit",
  data() {
    return {
      cur: 0,
      list: [{ name: "指南", id: 1 }, { name: "其他", id: 2 }],
      datas: {},
      framser: [],
      proven: [],
      titlEn: [],
      path:''
    };
  },
  props: {},
  methods: {
    getDatas() {
      this.axios({
        url: "guideManage/byId",
        params: {
          id: this.$route.query.id,
          state: this.$route.query.state,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        console.log(res.data)
        this.datas = res.data.guide;
        this.Name = res.data;
      });
    },
    openPath(val){
       this.axios({
          url: "oss/upload/show",
          params: {
            objectKey: val,
            bucket: "mdhcare",
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          }
        }).then(res => {
          window.open(res.data)
        });
    },
    _initData() {
      if (this.$route.params.id !== undefined) {
        this.axios.get("drug/" + this.$route.params.id, {
            params: {
              userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
            }
          })
          .then(res => {
            this.drug = res.data;
            this.sampleMeta = res.data.sampleMeta;
            this.proDepts = res.data.deptName;
            if (res.data.expand !== undefined) {
              let _this = this;
              res.data.expand.forEach(function(item) {
                if (item.type === 0) {
                  _this.reportType.push(item.name);
                  if (item.remark !== undefined) {
                    _this.reportTypeOtherRemark = item.remark;
                  }
                } else {
                  _this.consultancy.push(item.name);
                  if (item.remark !== undefined) {
                    _this.consultancyOtherRemark = item.remark;
                  }
                }
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      this.axios
        .get("hospital-dept", {
          params: {
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          }
        })
        .then(res => {
          this.deptList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    edit() {
      if (this.$route.params.id === undefined) {
        let instance = this.axios.create({
          headers: {
            Authorization: window.localStorage.token,
            "Content-Type": "application/json"
          }
        });
        let _this = this;
        instance({
          method: "post",
          url: "drug",
          params: {
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          },
          data: {
            drug: this.drug,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          },
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
          }
        })
          .then(function(res) {
            if (res.data.state === "exist alreay!") {
              _this.$message({
                message: "产品名称重复",
                type: "error"
              });
            } else {
              _this.$message({
                message: "新增成功",
                type: "success"
              });
              _this.$router.push("/drug");
            }
          })
          .catch(function() {
            _this.$message({
              message: "新增失败",
              type: "error"
            });
          });
      } else {
        let instance = this.axios.create({
          headers: {
            Authorization: window.localStorage.token,
            "Content-Type": "application/json"
          }
        });
        let _this = this;
        instance({
          method: "put",
          url: "drug/" + this.$route.params.id,
          params: {
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          },
          data: {
            drug: this.drug,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            solutionExpands: this.expandParams,
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          },
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
          }
        })
          .then(function() {
            _this.$message({
              message: "修改成功",
              type: "success"
            });
            _this.$router.push("/drug");
          })
          .catch(function() {
            _this.$message({
              message: "修改失败",
              type: "error"
            });
          });
      }
    },
    cancel() {
      this.$router.push("/drug");
    }
  },
  computed: {
    expandParams: function() {
      let result = [];
      let _this = this;
      if (this.reportType !== null) {
        _this.reportType.forEach(function(item) {
          let expandParams = {
            name: item,
            type: 0
          };
          if (_this.reportTypeOtherRemark !== "" && item === 3) {
            expandParams.remark = _this.reportTypeOtherRemark;
          }
          result.push(expandParams);
        });
      }
      if (this.consultancy !== null) {
        this.consultancy.forEach(function(item) {
          let expandParams = {
            name: item,
            type: 1
          };
          if (_this.consultancyOtherRemark !== "" && item === 4) {
            expandParams.remark = _this.consultancyOtherRemark;
          }
          result.push(expandParams);
        });
      }
      return result;
    }
  },
  created() {
    let loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this._initData();
    loading.close();
  },
  mounted() {
    this.getDatas();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.path{
  cursor:pointer;
}
.active {
  color: goldenrod;
}
.edit-form {
  max-width: none;
}
.float-l {
  float: left;
}
.drug-container {
  margin: 20px 0px;
  padding: 20px;
  background: #ffffff;
  .el-input {
    width: 100%;
  }
  .edit-form {
    width: calc(100% - 40px);
    .form-left {
      width: 40%;
      float: left;
    }
    .form-right {
      padding-left: 60px;
      width: 40%;
      float: left;
    }
    .form-line {
      width: calc(80% + 60px);
      float: left;
      .btns {
        margin-left: -80px;
      }
    }
    .url-name {
      width: 200px;
      float: left;
    }
    .url {
      margin-left: 20px;
      width: 600px;
      float: left;
    }
  }
}
.form-list {
  width: 100%;
  display: flex;
  height: 100px;
  line-height: 100px;
  background: #f3f3f3;
  li {
    width: 20%;
    text-align: center;
  }
}
.from-select {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: space-around;
}
.from-contents {
  width: 100%;
  height: 200px;
  margin-bottom: 10px;
}
.from-btns {
  width: 100%;
  text-align: center;
  .el-button {
    margin: 0 2%;
  }
}
.drug-container .header {
  margin-bottom: 20px;
  font-size: 18px;
}
.width-100-p {
  width: 100%;
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
