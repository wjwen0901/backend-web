<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-tabs v-model="activeName" class="user-tabs" type="card" @tab-click="handleClick">
        <el-tab-pane label="普通客户" name="normal" v-if="roleCode === 'manager'"></el-tab-pane>
        <el-tab-pane label="业务员" name="business-agent"></el-tab-pane>
        <el-tab-pane label="渠道管理员" name="channel" v-if="roleCode === 'manager' || roleCode === 'firm-service'"></el-tab-pane>
        <el-tab-pane label="厂商管理员" name="firm-service" v-if="roleCode === 'manager'"></el-tab-pane>
        <el-tab-pane label="见山会诊管理" name="jk-service" v-if="roleCode === 'manager'"></el-tab-pane>
        <el-tab-pane label="医生" name="doctor" v-if="roleCode === 'manager'"></el-tab-pane>
        <el-tab-pane label="患者" name="patient" v-if="roleCode === 'manager'"></el-tab-pane>
      </el-tabs>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserShell',
  data () {
    return {
      activeName: this.$route.params.role,
      roleCode: window.localStorage.role
    }
  },
  methods: {
    handleClick (tab) {
      if (this.$route.params.role === tab.name) return
      this.$router.push({ name: 'UserList', params: { role: tab.name } })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-container {
  margin: 20px 0;
  padding: 20px 20px 4px;
  background: var(--pc-white);
  border-radius: var(--pc-r-4);
  box-shadow: var(--pc-sh-1);
}

.page-header {
  padding-bottom: 14px;
  margin-bottom: 4px;
  border-bottom: var(--pc-bd-hair);
}

.user-tabs {
  margin: 0 -20px;
  padding: 0 12px;

  ::v-deep .el-tabs__header {
    margin-bottom: 0;
  }
}
</style>
