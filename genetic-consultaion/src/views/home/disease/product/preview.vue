<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item :to="{ path: '/product-cl' }">检测产品管理</el-breadcrumb-item>
          <el-breadcrumb-item>预览</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="gene-container">
          <el-form ref="solutionForm" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="left">
            <el-form-item label="产品名称*">
              <span>{{sessionData.name}}</span>
            </el-form-item>
            <el-form-item label="英文名称*">
              <span>{{sessionData.nameEn}}</span>
            </el-form-item>
            <el-form-item label="适用阶段">
               <span v-for="(item,index) in sessionData.screenings" :key="index">{{item.screeningName}}&nbsp;&nbsp;</span>
               <!-- <span>{{sessionData.screenings}}</span> -->
            </el-form-item>
            <el-form-item label="适用科室">
              <span v-for="(item,index) in sessionData.deptIds" :key="index">{{item.name}}&nbsp;&nbsp;</span>
            </el-form-item>
            <el-form-item label="检测内容*">
               <span>{{sessionData.brief}}</span>
            </el-form-item>
            <el-form-item label="临床意义">
              <span>{{sessionData.purpose}}</span>
            </el-form-item>
          </div>
          <div class="chang">
            检测厂商
          </div>
          </el-form>
          <div class="gene-select">
            <p v-for="(item,index) in sessionData.solutionIds" :key="index">{{item.name}}</p>
          </div>
          <div class="gene-btns">
                <el-button type="primary" @click="addData" >保存</el-button>
                <el-button @click="cancel" >取消</el-button>
           </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Input from "../../../../components/inputs";
export default {
  name: "GeneEdit",
  data() {
    return {
      Significance: "",
      name: "",
      content: "",
      products: "",
      manufacturer: "",
      openIsDisabled: false,
      options: [],
      sum: 1,
      list: [],
      department: "",
      depart: [],
      proDepts: "",
      deptList: [],
      datas: [],
      departs: [],
      screening: [],
      sessionData: {},
      state:null,
      productId:null
    };
  },
  components: {
    Input
  },
  methods: {
    cancel(){
      this.$router.go(-1)
    },
    getData() {
      this.axios({
        url: "product/productById",
        params: {
          id: this.$route.query.id,
          state: this.$route.query.state,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        },
      }).then(res => {
        this.id = res.data.product.id;
        this.productId = res.data.product.id;
        this.datas = res.data.product;
        this.departs = res.data.depts.map((item, index) => {
          return item.name;
        });
        this.screening = res.data.screenings.map((item, index) => {
          return item.screeningName;
        });
      });
    },
    //保存
    addData() {
      var deptId = this.sessionData.deptIds.map(item=>{
        return item.id
      })
      var sessionId = this.sessionData.solutionIds.map(item=>{
        return item.id
      })
      if(this.$route.query.id == undefined) {
          let instance = this.axios.create({
            headers: {
              Authorization: window.localStorage.token,
              "Content-Type": "application/json"
            }
          });
          let _this = this;
          instance({
            url: "product",
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            params: {
              userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
            },
            data: {
              name: _this.sessionData.name,
              nameEn:_this.sessionData.nameEn,
              brief: _this.sessionData.brief,
              purpose: _this.sessionData.purpose,
              deptIds: deptId,
              screenings: _this.sessionData.screenings,
              solutionIds:sessionId
            }
          })
            .then(res => {
              this.$message({
                message: "发布成功",
                type: "success"
              });
            })
            .catch(err => {
              _this.$message(JSON.parse(err.request.response).msg);
            });
      } else {
        if (this.state == 0) {
          let instance = this.axios.create({
            headers: {
              Authorization: window.localStorage.token,
              "Content-Type": "application/json"
            }
          });
          let _this = this;
          instance({
            url: "product",
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            params: {
              userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
            },
            data: {
              id: _this.id,
              name: _this.sessionData.name,
              nameEn:_this.sessionData.nameEn,
              brief: _this.sessionData.brief,
              purpose: _this.sessionData.purpose,
              deptIds: deptId,
              screenings: _this.sessionData.screenings,
              solutionIds:sessionId
            }
          })
            .then(res => {
              this.$message("发布成功");
            })
            .catch(err => {
              _this.$message(JSON.parse(err.request.response).msg);
            });
        } else if (this.state == 1) {
          if (this.productId == "") {
            let instance = this.axios.create({
              headers: {
                Authorization: window.localStorage.token,
                "Content-Type": "application/json"
              }
            });
            let _this = this;
            instance({
              url: "product",
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              params: {
                temId: _this.id,
                userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
              },
              data: {
                name: _this.sessionData.name,
                nameEn:_this.sessionData.nameEn,
                brief: _this.sessionData.brief,
                purpose: _this.sessionData.purpose,
                deptIds: deptId,
                screenings: _this.sessionData.screenings,
                solutionIds:sessionId
              }
            }).then(res => {
                this.$message("发布成功");
              })
              .catch(err => {
                _this.$message(JSON.parse(err.request.response).msg);
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
              url: "product",
              method: "put",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              params: {
                temId: _this.id,
                userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
              },
              data: {
                id: _this.productId,
                name: _this.sessionData.name,
                nameEn:_this.sessionData.nameEn,
                brief: _this.sessionData.brief,
                purpose: _this.sessionData.purpose,
                deptIds: deptId,
                screenings: _this.sessionData.screenings,
                solutionIds:sessionId
              }
            })
              .then(res => {
                this.$message("发布成功");
              })
              .catch(err => {
                _this.$message(JSON.parse(err.request.response).msg);
              });
          }
        }
      }
    }
  },
  mounted() {
    this.getData();
    this.sessionData = JSON.parse(window.sessionStorage.getItem("pro"));
    this.state = this.$route.query.state;
    this.productId = this.sessionData.productId
    console.log(this.sessionData)
  }
  // created () {
  //   let loading = this.$loading({
  //     lock: true,
  //     text: 'Loading',
  //     spinner: 'el-icon-loading',
  //     background: 'rgba(0, 0, 0, 0.7)'
  //   })
  //   this._initData()
  //   loading.close()
  // },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.active{
  color:goldenrod;
}
.edit-form {
  max-width: none;
}
.float-l {
  float: left;
}
.gene-select {
  width: 100%;
  text-align: center;
  display: flex;
  margin: 40px;
  .el-select {
    margin-left: 100px;
  }
}
.add {
  position: absolute;
  top: 10%;
  left: 30%;
}
.gene-list {
  width: 100%;
  height: 50px;
  background: #f3f3f3;
  display: flex;
  line-height: 50px;
  li {
    width: 25%;
  }
}
.chang {
  padding-bottom: 15px;
  border-bottom: 1px solid #ccc;
}
.gene-contents {
  width: 100%;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
.gene-btns {
  width: 100%;
  text-align: center;
  .el-button {
    margin: 0 2%;
  }
}
.gene-container {
  width: 100%;
  margin: 20px 0px;
  padding: 20px;
  background: #ffffff;
  .left {
    width: 100%;
    float: left;
    height: 100%;
  }
  .el-input {
    width: 100%;
  }
  .edit-form {
    max-width: 800px;
    .url-name {
      width: 160px;
      float: left;
    }
    .url {
      margin-left: 20px;
      width: calc(100% - 180px);
      float: left;
    }
  }
}
.gene-container .header {
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
