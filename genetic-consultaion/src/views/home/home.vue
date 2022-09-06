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
      <el-aside width="180px" style="background-color: rgb(238, 241, 246)">
        <!--<el-menu class="el-menu-vertical-demo" router :collapse="isCollapse">-->
        <el-menu class="el-menu-vertical-demo"
                 style="height: 100%;"
                 default-active="dashboard"
                 :default-openeds="openMenu"
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
          <el-submenu index="/brca" v-if="sec.includes('system')">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">BRCA轻松检</span>
            </template>
              <el-menu-item index="/brca/order">订单</el-menu-item>
              <el-menu-item index="/brca/doctor">注册医生</el-menu-item>
              <el-menu-item index="/brca/whitelist">白名单</el-menu-item>
              <el-menu-item index="/brca/commission">佣金账户</el-menu-item>
              <el-menu-item index="/brca/withdraw">提现记录</el-menu-item>
              <el-menu-item index="/brca/invoice">发票记录</el-menu-item>
              <el-menu-item index="/brca/express">快递查询</el-menu-item>
              <el-menu-item index="/brca/exchange">积分兑换</el-menu-item>
              <el-menu-item index="/brca/paper/report">纸质报告</el-menu-item>
          </el-submenu>
          <el-submenu index="/wrj" v-if="sec.includes('wrj:manage')">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">维汝健</span>
            </template>
              <el-menu-item index="/wrj/order">订单</el-menu-item>
              <el-menu-item index="/wrj/invoice">发票记录</el-menu-item>
              <el-menu-item index="/wrj/express">快递查询</el-menu-item>
              <el-menu-item index="/wrj/exchange">积分兑换</el-menu-item>
              <el-menu-item index="/wrj/paper/report">纸质报告</el-menu-item>
          </el-submenu>
          <el-submenu index="/accuragen" v-if="sec.includes('accuragen:manage')">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">安易筛</span>
            </template>
              <el-menu-item index="/accuragen/channel">渠道管理</el-menu-item>
              <el-menu-item index="/accuragen/paper/report">纸质报告</el-menu-item>
          </el-submenu>
          <el-menu-item index="/order" v-if="sec.includes('order')">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">订单管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/patient/list" v-if="sec.includes('patient:list')">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span slot="title">客户管理</span>
            </template>
          </el-menu-item>
          <el-submenu index="/informed" v-if="sec.includes('upload:informed') || sec.includes('data-collect:informed')">
            <template slot="title"><i class="el-icon-edit-outline"></i><span slot="title">知情管理</span></template>
              <el-menu-item index="/informed/upload" v-if="sec.includes('upload:informed')">上传文件</el-menu-item>
              <el-menu-item index="/informed/list" v-if="sec.includes('data-collect:informed')">查看知情</el-menu-item>
              <el-menu-item index="/informed/info/list" v-if="sec.includes('informed:list')">查看知情</el-menu-item>
          </el-submenu>
          <el-submenu index="upload" v-if="sec.includes('upload:report') || sec.includes('data-collect:report') || sec.includes('report:list')">
            <template slot="title"><i class="el-icon-notebook-2"></i><span slot="title">报告管理</span></template>
              <el-menu-item index="/report/customize/genessential" v-if="sec.includes('custome-report:genessential')">定制报告</el-menu-item>
              <el-menu-item index="/report/upload" v-if="sec.includes('upload:report')">上传报告</el-menu-item>
              <el-menu-item index="/report/list" v-if="sec.includes('data-collect:report')">提取报告</el-menu-item>
              <el-menu-item index="/report/info/list" v-if="sec.includes('report:list')">查看报告</el-menu-item>
          </el-submenu>
          <el-menu-item index="/review" v-if="sec.includes('data-review')">
            <i class="el-icon-copy-document"></i>
            <span slot="title">信息复核</span>
          </el-menu-item>
          <el-submenu index="/ru6c" v-if="sec.includes('ru6c-gene')">
            <template slot="title"><i class="el-icon-document"></i><span slot="title">易见康检测</span></template>
              <el-menu-item index="/ru6c/upload">上传文件</el-menu-item>
              <el-menu-item index="/ru6c/list">查看结果</el-menu-item>
          </el-submenu>
          <el-menu-item index="/product" v-if="sec.includes('product')">
            <i class="el-icon-goods"></i>
            <span slot="title">产品管理</span>
          </el-menu-item>
          <el-menu-item index="/hospital" v-if="sec.includes('hospital:list')">
            <template slot="title">
              <i class="el-icon-office-building"></i>
              <span slot="title">医院管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/firm" v-if="sec.includes('firm:list')">
            <template slot="title">
              <i class="el-icon-school"></i>
              <span slot="title">厂商管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/channel" v-if="sec.includes('channel:list')">
            <template slot="title">
              <i class="el-icon-house"></i>
              <span slot="title">渠道商管理</span>
            </template>
          </el-menu-item>
          <el-submenu index="system" v-if="sec.includes('system')">
            <template slot="title"><i class="el-icon-setting"></i><span slot="title">系统管理</span></template>
              <el-menu-item index="/user" v-if="sec.includes('system:user-sec')">账号管理</el-menu-item>
              <el-menu-item index="/invite" v-if="sec.includes('system:user-sec')">邀请用户</el-menu-item>
          </el-submenu>
          <el-submenu index="disease" v-if="sec.includes('system') && role === 'manager' && userId == 1">
            <template slot="title"><i class="el-icon-setting"></i><span slot="title">疾病数据库</span></template>
              <el-menu-item index="/drug" v-if="role === 'manager'">指南管理</el-menu-item>
              <el-menu-item index="/disease" v-if="role === 'manager'">疾病数据维护</el-menu-item>
              <el-menu-item index="/gene" v-if="role === 'manager'">基因数据维护</el-menu-item>
              <el-menu-item index="/product-cl" v-if="role === 'manager'">产品数据维护</el-menu-item>
          </el-submenu>
          <el-submenu index="printer" v-if="sec.includes('system') && role === 'manager' && userId == 1">
            <template slot="title"><i class="el-icon-setting"></i><span slot="title">一体机管理</span></template>
              <el-menu-item index="/printer/list" v-if="role === 'manager'">一体机列表</el-menu-item>
          </el-submenu>
          <el-submenu index="rank" v-if="sec.includes('system') && role === 'manager' && userId == 1">
            <template slot="title"><i class="el-icon-setting"></i><span slot="title">实验室排名</span></template>
              <el-menu-item index="/rank/list">总排名</el-menu-item>
              <el-menu-item index="/standard/list" v-if="role === 'manager'">打分项维护</el-menu-item>
          </el-submenu>

          <!-- 新增公众号二维码模块 -->
          <el-submenu index="/qrcode_manager" v-if="sec.includes('wechat_qrcode')">
            <template slot="title"><i class="el-icon-setting"></i><span slot="title">公众号二维码</span></template>
              <el-menu-item index="/qrcode-manager/add" v-if="sec.includes('wechat_qrcode:create')">生成二维码</el-menu-item>
              <el-menu-item index="/qrcode-manager/list" v-if="sec.includes('wechat_qrcode:list')">查看二维码列表</el-menu-item>
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
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      // sec: window.localStorage.sec === undefined ? 'upload,upload:informed,upload:report,upload:medical-records,informed:list,report:list' : window.localStorage.sec,
      sec:'upload,upload:informed,upload:report,upload:medical-records,order,data-collect,data-collect:informed,data-collect:report,data-review,system,system:user-sec,product,patient:list,hospital:list,firm:list,channel:list,custome-report:genessential,wechat_qrcode,wechat_qrcode:create,wechat_qrcode:list,accuragen:manage,wrj:manage',
      role: window.localStorage.role,
      // username: 'admin',
      // sec: 'upload,upload:informed,upload:report,upload:medical-records,' +
      //   'order,data-collect,data-collect:informed,data-collect:report,data-review,system,system:user-sec,' +
      //   'customer,product,report:list,patient:list,hospital:list,firm:list,channel:list',
      // role: 'manager',
      activeIndex: '/dashboard',
      openMenu: ['fly', 'upload', 'info', 'chann', 'system']
    }
  },
  methods: {
    logout () {
      window.localStorage.clear()
      if (this.axios.defaults.baseURL.includes('qa.mdhcare.cn')) {
        window.location.href = 'http://qa.mdhcare.cn/website/login.html'
      } else if (this.axios.defaults.baseURL.includes('z.mdhcare.cn/z/')) {
        window.location.href = 'https://z.mdhcare.cn/z/login.html'
      } else {
        window.location.href = 'https://z.mdhcare.cn/login.html'
      }
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
    min-width: 1200px;
    height: 100%;
  }
  .el-header {
    background-color: #117e73; //#00c2a9;
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
    overflow: hidden;
    height: 100%;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    overflow: hidden;
    height: 100%;
  }
  .el-submenu .el-menu-item {
    min-width: 100px;
    padding-left: 50px !important;
  }
  i {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
  }
</style>
