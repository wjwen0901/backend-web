<template>
  <el-container class="home-container">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="2">
          <a href="#" class="logo">
            <span class="logo-lg"><b>易</b>得好康</span>
          </a>
        </el-col>
        <!--<el-col :span="2">-->
          <!--<el-button icon="el-icon-menu" circle @click="isCollapseMenu"></el-button>-->
        <!--</el-col>-->
        <el-col :span="14"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4" :offset="18">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" @click="logout">退出</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{username}}</span>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <!--<el-menu class="el-menu-vertical-demo" router :collapse="isCollapse">-->
        <el-menu class="el-menu-vertical-demo"
                 default-active="dashboard"
                 @select="handleSelect"
                 router
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <el-menu-item index="/dashboard">
            <template slot="title">
              <i class="el-icon-view"></i>
              <span slot="title">首页</span>
            </template>
          </el-menu-item>
          <el-submenu index="upload" v-if="sec.includes('upload')">
            <template slot="title"><i class="el-icon-upload"></i><span slot="title">文件上传</span></template>
            <el-menu-item-group>
              <el-menu-item index="/informed/upload" v-if="sec.includes('upload:informed')">上传知情同意</el-menu-item>
              <el-menu-item index="/report/upload" v-if="sec.includes('upload:report')">上传报告</el-menu-item>
              <el-menu-item index="/medical-records/upload" v-if="sec.includes('upload:medical-records')" disabled>上传病历</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="info" v-if="sec.includes('data-collect')">
            <template slot="title"><i class="el-icon-edit-outline"></i><span slot="title">信息提取</span></template>
            <el-menu-item-group>
              <el-menu-item index="/informed/list" v-if="sec.includes('data-collect:informed')">知情同意</el-menu-item>
              <el-menu-item index="/report/list" v-if="sec.includes('data-collect:report')">报告</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/review" v-if="sec.includes('data-review')">
            <i class="el-icon-view"></i>
            <span slot="title">信息复核</span>
          </el-menu-item>
          <el-submenu index="chann" v-if="sec.includes('system')">
            <template slot="title"><i class="el-icon-setting"></i><span slot="title">渠道管理</span></template>
            <el-menu-item-group>
              <!--<template slot="title">用户信息</template>-->
              <el-menu-item index="/channel/barcode">生成二维码</el-menu-item>
              <el-menu-item index="/channel/count">统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3" v-if="sec.includes('system')">
            <template slot="title"><i class="el-icon-setting"></i><span slot="title">系统管理</span></template>
            <el-menu-item-group>
              <!--<template slot="title">用户信息</template>-->
              <el-menu-item index="/user" v-if="sec.includes('system:user-sec')">用户管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      username: window.localStorage.username,
      sec: window.localStorage.sec,
      activeIndex: '/dashboard'
    }
  },
  methods: {
    logout () {
      window.localStorage.clear()
      window.location.href = 'https://z.mdhcare.cn/login.html'
    },
    handleSelect (key, keyPath) {
      this.activeIndex = key
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .home-container {
    min-height: 100%;
  }
  .el-header {
    background-color: #00c2a9;
    color: #fff;
    text-align: center;
    line-height: 60px;
    height: 60px !important;
    margin-top: 0 !important;
  }
  .el-header .logo {
    /*padding-left: 20px;*/
    color: #fff;
    text-decoration: none;
    font-size: 24px;
    float: left;
    width: 100px;
  }
  .el-dropdown {
    color: #fff;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
  .el-submenu .el-menu-item {
    min-width: 100px;
    padding-left: 50px !important;
  }
</style>
