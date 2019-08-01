<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/product-cl' }">检测产品管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="gene-container"> 
          <el-form ref="solutionForm" :model="product" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="left">
            <el-form-item label="产品名称*">
              <el-input v-model="product.name" :disabled='names' placeholder="请输入" ></el-input>
            </el-form-item>
            <el-form-item label="英文名称*">
              <el-input v-model="product.nameEn" :disabled='namen' placeholder="请输入" ></el-input>
            </el-form-item>
            <el-form-item label="适用阶段">
              <el-input v-for="(item,index) in list" :key="item+index" v-model="list[index]" style="width:720px"  placeholder="请输入内容"></el-input>
              <!-- <Input  v-on:ipt="ipt" v-for="(item,index) in list" :index='index' :key="item+index"  :value='item'/> -->
              <span class="add" @click="add">+</span> 
            </el-form-item>
            <el-form-item label="适用科室">
              <el-select :disabled='departments' style="width:720px"  v-model="vdepart" value-key="name" filterable multiple  >
                <el-option
                  v-for="item in depart" 
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  label="检测内容*">
              <el-input
              :disabled='briefs'
                type="textarea"
                :rows="2"
                v-model="product.brief"
                placeholder="请输入" >
              </el-input>
            </el-form-item> 
            <el-form-item  label="临床意义">
              <el-input
              placeholder="请输入"
                type="textarea"
                :disabled='purposes'
                v-model="product.purpose"
                :rows="2" >
              </el-input>
            </el-form-item> 
          </div>  
          <div class="chang">
            检测厂商
          </div>
          </el-form>
          <div class="gene-select"> 
              <el-select class="width-100-p" :disabled='proDepts1' style="width:300px"  v-model="product.proDepts"  filterable placeholder="请选择">
                <el-option
                  v-for="item in deptList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select> 
          <el-select v-model="products" :disabled='products1'  value-key="name" filterable multiple placeholder="请选择产品">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
          </div>
           <div class="gene-btns">
                <el-button type="primary" @click="addData" :disabled = "openIsDisabled">发布</el-button>
                <el-button type="primary" @click="preview" :disabled = " openIsDisabled ">预览</el-button>
                <el-button type="primary" @click="disableds">暂存</el-button>
                <el-button @click="cancel" :disabled = "openIsDisabled ">取消</el-button> 
           </div>
        </div> 
      </el-col>
    </el-row>
  </div>
</template>
<script> 
export default {
  name: "GeneEdit",
  data() {
    return {
      menuInfo: this.$route.query.id === undefined ? "新增" : "编辑",
      product: {},
      Significance: "",
      vdepart: [],
      name: "",
      names: false,
      content: "",
      screening:'',
      products: [],
      manufacturer: "",
      openIsDisabled: false,
      options: [],
      brief: "",
      briefs: false,
      purpose: "",
      purposes: false,
      list: [""],
      department: [],
      departments: false,
      namen:false,
      products1: false,
      depart: [],
      proDepts: "",
      proDepts1: false,
      deptList: [],
      datas: {},
      departs: "",
      productId: "",
      department1: []
    };
  }, 
  watch: {
    vdepart: {
      handler(newArr, oldArr) {
        window.localStorage.setItem("product", JSON.stringify(newArr));
      }
    }
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    //获取信息
    getData() { 
      this.axios({
        url: "product/productById",
        params: {
          id: this.$route.query.id,
          state: this.$route.query.state
        }
      }).then(res => { 
        console.log(res.data)
        this.productId = res.data.product.productId;
        this.product = res.data.product; 
        this.id = res.data.product.id;
        this.products = res.data.solutions; 
        this.vdepart = res.data.depts.map(item=>{
            this.depart.push({id:item.id,name:item.name})
            return {id:item.id,name:item.name}
          }) 
        if (res.data.screenings == undefined || res.data.screenings.length == 0){
           this.list = ['']
        } else {
          this.list = res.data.screenings.map(item => {
            return item.screeningName
          }) 
        }
        
        console.log(this.list)
        this.products = res.data.solutions.map(item=>{
          this.options.push({id:item.id,name:item.name})
          return {id:item.id,name:item.name}
        })

      });
    },
    //暂存
    disableds() {
      var solutionName = this.products.map(item => {
        return item.id;
      });
      var vdeparts = this.vdepart.map(item => {
        return item.id;
      });
      var screeningName = [];
        this.list.forEach((item) => {
        if (item != '') {
          screeningName.push({screeningName : item})
        }
      })      
      this.openIsDisabled = !this.openIsDisabled;
      this.names = !this.names;
      this.briefs = !this.briefs;
      this.purposes = !this.purposes;
      this.departments = !this.departments;
      this.namen = !this.namen;
      this.products1 = !this.products1;
      this.proDepts1 = !this.proDepts1;
      if (this.$route.query.id == undefined) {
        if (this.product.name == "" && this.product.brief == "") {
          this.$message("请输入带有*的信息");
        } else {
          let instance = this.axios.create({
            headers: {
              Authorization: window.localStorage.token,
              "Content-Type": "application/json"
            }
          });
          let _this = this;
          instance({
            url: "product/addTem",
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            data: { 
              name: _this.product.name,
              brief: _this.product.brief,
              nameEn:_this.product.nameEn,
              purpose: _this.product.purpose,
              deptIds: vdeparts,
              screenings:screeningName,
              solutionIds: solutionName
            }
          }).then(res => {
            this.$message("暂存成功"); 
          });
        }
      } else {
        if (this.product.name == "" && this.product.brief == "") {
          this.$message("请输入带有*的信息");
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
              url: "product/addTem",
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              params:{
                temId:_this.productId
              },
              data: {
                productId: _this.id,
                name: _this.product.name,
                nameEn:_this.product.nameEn,
                brief: _this.product.brief,
                purpose: _this.product.purpose,
                deptIds: vdeparts,
                screenings: screeningName,
                solutionIds: solutionName
              }
            }).then(res => {
              this.$message("暂存成功");
              this.id = res.id;
            });
          } else if (this.state == 1) {
            let instance = this.axios.create({
              headers: {
                Authorization: window.localStorage.token,
                "Content-Type": "application/json"
              }
            });
            let _this = this;
            instance({
              url: "product/editTem",
              method: "put",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              data: {
                id: _this.id,
                productId:_this.productId,
                name: _this.product.name,
                nameEn:_this.product.nameEn,
                brief: _this.product.brief,
                purpose: _this.product.purpose,
                deptIds: vdeparts,
                screenings: screeningName,
                solutionIds: solutionName
              }
            }).then(res => {
              this.$message("修改成功");
            });
          }
        }
      }
    },
    add() {
      console.log(this.list)
      this.list.push('')
    },
    ipt(data, index) { 
      // this.list = data;
      this.list[index] = data;
    },
    //发布
    addData() { 
      //适用科室
      var vdeparts = this.vdepart.map(item => {
        return item.id;
      });
      //厂商
      var solutionName = this.products.map(item => {
        return item.id;
      });
      let screenings = this.list.map(item => {
        return {'screeningName': item}
      })
      if(this.$route.query.id == undefined) {
        if (this.product.name == undefined  && this.product.brief == undefined) {
          this.$message("请输入带有*的信息");
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
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            data: {
              name: _this.product.name,
              brief: _this.product.brief,
              nameEn:_this.product.nameEn,
              purpose: _this.product.purpose,
              deptIds: vdeparts,
              screenings: screenings,
              solutionIds: solutionName
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
        }
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
            data: {
              id: _this.id,
              name: _this.product.name,
              nameEn:_this.product.nameEn,
              brief: _this.product.brief,
              purpose: _this.product.purpose,
              deptIds: vdeparts,
              screenings: screenings,
              solutionIds: solutionName
            }
          })
            .then(res => {
              this.$message("发布成功");
            })
            .catch(err => {
              _this.$message(JSON.parse(err.request.response).msg);
            });
        } else if (this.state == 1) {
          if (this.productId == undefined) {
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
                temId: _this.id
              },
              data: {
                name: _this.product.name,
                nameEn:_this.product.nameEn,
                brief: _this.product.brief,
                purpose: _this.product.purpose,
                deptIds: vdeparts,
                screenings: screenings,
                solutionIds: solutionName
              }
            })
              .then(res => {
                this.$message({
                  type:'success',
                  message:'发布成功'
                });
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
                temId: _this.id
              },
              data: {
                id: _this.productId,
                name: _this.product.name,
                nameEn:_this.product.nameEn,
                brief: _this.product.brief,
                purpose: _this.product.purpose,
                deptIds: vdeparts,
                screenings: _this.list,
                solutionIds: solutionName
              }
            })
              .then(res => {
                 this.$message({
                  type:'success',
                  message:'发布成功'
                });
              })
              .catch(err => {
                _this.$message(JSON.parse(err.request.response).msg);
              });
          }
        }
      }
    },
    //预览
    preview() { 
      console.log(this.list) 
      var screeningName =this.list.map(item=>{
        return {screeningName:item}
      })  
      var obj = {};
      obj.name = this.product.name;
      obj.nameEn = this.product.nameEn;
      obj.brief = this.product.brief;
      obj.purpose = this.product.purpose;
      obj.deptIds = this.vdepart;
      obj.screenings = screeningName;
      obj.solutionIds = this.products;
      obj.productId = this.productId
      window.sessionStorage.setItem("pro", JSON.stringify(obj));
      this.$router.push({
        name: "ProductClPreview",
        query:{
          id:this.$route.query.id,
          state:this.$route.query.state
        }
      });
    },
    getKe() {
      this.axios({
        url: "hospital-dept"
      }).then(res => {
        this.depart = res.data.map(item => {
          item.name = item.name.indexOf("|") >= 0 ? item.name.split("|")[1] : item.name
          return item
        });
      });
    },
    getCompany() {
      this.axios({
        url: "company"
      }).then(res => {
        this.deptList = res.data;
      });
    },
    companyIds() {
      this.axios({
        url: "solution/solutionByCompany",
        params: {
          companyId: this.proDepts
        }
      }).then(res => {
        this.options = res.data.solutions;
      });
    }
  },
  mounted() {
    this.getCompany();
    this.companyIds();
    this.getKe();
    this.getData();
    this.state = this.$route.query.state;
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
.active {
  color: goldenrod;
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
  left: 102%;
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
