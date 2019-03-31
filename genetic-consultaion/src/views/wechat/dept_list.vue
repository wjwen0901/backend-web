<template>
  <el-container>
    <el-header>
      <el-input
        class="search-input"
        placeholder="请输入科室名称"
        v-model="keywords">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-header>
    <el-main>
      <div class="mdh-input-row" v-for="dept in deptList" v-bind:key="dept.id"
           @click="chooseDept(dept.id, dept.name)">
        <label>{{dept.name}}</label>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: 'hospital_list',
  data () {
    return {
      keywords: '',
      deptList: []
    }
  },
  methods: {
    getdeptList () {
      this.axios.get('hospital-dept', {
        params: {
          keywords: this.keywords
        }
      }).then(res => {
        if (res.data.length === 0) {
          const newHospital = [{
            name: this.keywords,
            id: 0
          }]
          console.log(newHospital)
          this.deptList = newHospital
        } else {
          this.deptList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    chooseDept (id, name) {
      if (parseInt(id) === 0) {
        this.axios.post('hospital-dept', {name: name}).then(res => {
          this.$router.push({path: '/wechat/informed/upload', query: {did: res.data.id, dname: name, openid: this.$route.query.openid, orderId: this.$route.query.orderId, orderNo: this.$route.query.orderNo, companyId: this.$route.query.companyId}})
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$router.push({path: '/wechat/informed/upload', query: {did: id, dname: name, openid: this.$route.query.openid, orderId: this.$route.query.orderId, orderNo: this.$route.query.orderNo, companyId: this.$route.query.companyId}})
      }
    }
  },
  watch: {
    keywords: {
      handler: function (val, oldval) {
        this.getdeptList()
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
    this.getdeptList()
    loading.close()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    min-height: 100%;
    background: #f2f2f2;
  }
  .el-header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
    background: #f2f2f2;
  }
  .search-input {
    margin-top: 10px;
  }
  .el-main {
    padding: 0;
    padding-top: 60px;
    overflow: scroll;
  }
  .mdh-input-row {
    position: relative;
    width: 100%;
    background: #fff;
    height: 40px;
    padding: 0;
    label {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding-left: 20px;
      line-height: 40px;
      font-size: 14px;
    }
    input {
      height: 40px;
      width: 100%;
      padding: 0;
      padding-left: 80px;
      border: 0;
      line-height: 40px;
    }
    .next-step {
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      padding: 0px 10px;
      line-height: 40px;
      color: #333333;
    }
    &:after {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 1px;
      width: 100%;
      content: '';
      /*border-bottom: 1px solid #c8c7cc;*/
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #c8c7cc;
    }

  }
</style>
