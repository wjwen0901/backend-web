<template>
  <el-container>
    <el-header>
      <el-input
        class="search-input"
        placeholder="请输入医院名称"
        v-model="keywords">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-header>
    <el-main>
      <div class="mdh-input-row" v-for="hospital in hospitalList" v-bind:key="hospital.id"
           @click="chooseHospital(hospital.id, hospital.name)">
        <label>{{hospital.name}}</label>
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
      hospitalList: []
    }
  },
  methods: {
    getHospitalList () {
      this.axios.get('hospital', {
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
          this.hospitalList = newHospital
        } else {
          this.hospitalList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    chooseHospital (id, name) {
      if (parseInt(id) === 0) {
        this.axios.post('hospital', {name: name}).then(res => {
          this.$router.push({path: '/wechat/informed/upload', query: {hid: res.data.id, hname: name, openid: this.$route.query.openid}})
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$router.push({path: '/wechat/informed/upload', query: {hid: id, hname: name, openid: this.$route.query.openid}})
      }
    }
  },
  watch: {
    keywords: {
      handler: function (val, oldval) {
        this.getHospitalList()
      }
    }
  },
  created () {
    this.getHospitalList()
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
