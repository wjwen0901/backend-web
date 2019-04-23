<template>
  <el-container class="pay-info" v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="mdh-default">
      <div class="logo-cover"></div>
      <div class="content">
        <el-main>
          <el-button @click="toPay()">确认支付</el-button>
        </el-main>
      </div>
      <div class="footer-info">
        &copy; 2019 MDHcare.cn 版权所有  丨  ICP证：京ICP备17067248号
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'pay-info',
  data () {
    return {
      loading: true
    }
  },
  methods: {
    initData () {
      window.location.href = this.$route.query.url
    },
    toPay () {
      window.location.href = this.$route.query.url
    }
  },
  created () {
    this.initData()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .pay-info.el-container {
    background: #f8f8f8;
    min-height: 100%;
  }
  .pay-info .el-header {
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
  }
  .mdh-default {
    position: relative;
    width: 100%;
    text-align: center;
    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      max-width: 600px;
      p {
        margin: 0;
        padding: 0;
        font-size: 18px;
        color: #464444;
      }
    }
    img {
      margin-top: 40px;
      width: 100px;
    }
    .el-main {
      margin-top: 10px;
      background: #fff;
      text-align: left;
      padding: 20px 15px;
      .cashier-reason {
        padding: 15px 0;
        font-size: 14px;
        line-height: 20px;
      }
      .cashier-reason span {
        color: #999;
      }
    }
    .send-code {
      padding: 12px 10px;
    }
    .btns {
      .left-content {
        width: 50%;
        float: left;
      }
      .right-content {
        width: 50%;
        float: left;
      }
      .el-button {
        display: block;
        margin-left: 10px;
      }
    }
    .footer-info {
      position: absolute;
      width: calc(100% - 40px);
      bottom: 10px;
      text-align: center;
      font-size: 12px;
      color: #999999;
    }
    .logo-cover {
      position: absolute;
      top: 200px;
      left: 50%;
      transform: translateX(-50%);
      width: 140px;
      height: 140px;
      background: none;
    }
  }
</style>
