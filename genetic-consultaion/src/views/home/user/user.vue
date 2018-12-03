<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <el-tabs v-model="activeName" class="tab-list" type="card" @tab-click="handleClick">
        <el-tab-pane label="普通客户" name="business-agent" v-if="roleCode === 'manager'"></el-tab-pane>
        <el-tab-pane label="业务代表" name="business-agent"></el-tab-pane>
        <el-tab-pane label="渠道商" name="channel" v-if="roleCode === 'manager'"></el-tab-pane>
        <el-tab-pane label="实验室客服" name="firm-service" v-if="roleCode === 'manager'"></el-tab-pane>
        <el-tab-pane label="“见康”客服" name="jk-service" v-if="roleCode === 'manager'"></el-tab-pane>
        <el-tab-pane label="医生" name="doctor" v-if="roleCode === 'manager'"></el-tab-pane>
        <el-tab-pane label="患者" name="patient" v-if="roleCode === 'manager'"></el-tab-pane>
        <el-tab-pane label="系统管理" name="manager" v-if="roleCode === 'manager'"></el-tab-pane>
      </el-tabs>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'User',
  data () {
    return {
      activeName: this.$route.params.role,
      roleCode: window.localStorage.role
    }
  },
  methods: {
    handleClick (tab) {
      this.$router.push({
        name: 'UserList',
        params: { role: tab.name }
      })
    }
  },
  filters: {},
  computed: {},
  created () {
  },
  mounted () {},
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
  }
  .user-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }

</style>
