<template>
  <div class="register-container">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="2">
          <a href="#" class="logo">
            <span class="logo-lg"><b>易</b>得好康</span>
          </a>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
    </el-main>
  </div>
</template>

<script>
function getCookie (name) { // 获取指定名称的cookie值
  let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
  if (arr != null) {
    console.log(arr)
    return unescape(arr[2])
  }
  return null
}
export default {
  name: 'register',
  data () {
    return {
    }
  },
  methods: {
    initData () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
      }, 2000)
    },
    onSubmit () {
    }
  },
  created () {
    this.initData()
    let cookie = JSON.parse(decodeURIComponent(getCookie('cookiepass')))
    window.localStorage.token = cookie.token
    window.localStorage.username = cookie.user.username
    window.localStorage.userId = cookie.user.id
    window.localStorage.fullName = cookie.user.fullName
    window.localStorage.cellphone = cookie.user.cellphone
    window.localStorage.role = cookie.role
    window.localStorage.sec = cookie.sec
    this.$router.push({path: '/'})
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .width-100-p {
    width: 100%;
  }
  .register-container {
    min-height: 100%;
    min-width: 1200px;
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

  .el-main {
    background-color: #E9EEF3;
    color: #333;
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
  .form-content {
    width: 600px;
    height: 100%;
    margin: 40px auto;
    background: #fff;
    padding: 20px;
  }
</style>
