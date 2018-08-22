<template>
  <el-container>
    <el-header>知情同意列表</el-header>
    <el-table
      :data="informedList"
      style="width: 100%"
      size="mini">
      <el-table-column
        prop="name">
        <template slot-scope="scope">
          <a @click="chooseHospital(scope.row.id,scope.row.name)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>
<script>
export default {
  name: 'informed_list',
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
        this.hospitalList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    chooseHospital (id, name) {
      window.localStorage.thisHospitalId = id
      window.localStorage.thisHospitalName = name
      this.$router.push('/wechat/informed/upload')
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

<style scoped>
  .search-input {
    margin-top: 10px;
  }
</style>
