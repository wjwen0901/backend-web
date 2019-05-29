<template>
  <el-container class="pay-info">
  </el-container>
</template>

<script>
export default {
  name: 'pay-info',
  data () {
    return {
    }
  },
  methods: {
    initData () {
      window.location = this.$route.query.url
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
  }
</style>
