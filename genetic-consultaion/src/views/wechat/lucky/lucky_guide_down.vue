<template>
</template>

<script>
  export default {
    name: 'signin',
    methods: {
      initData () {
        window.location = this.$route.query.url
      }
    },
    created () {
      window.location = this.$route.query.url
    }
  }
</script>
<style scoped>
  .report-download >>> .el-message {
    width: 100px!important;
    min-width: 100px!important;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    background: #fff;
    min-height: 100%;
  }
  .el-header {
    margin-top: 20px;
    span-align: left;
    height: 40px !important;
  }
  .confirm-message {
    width: 50% !important;
  }
  .float-l {
    float: left;
  }
  .upload-content {
    position: relative;
    float: left;
  }
  .el-upload.el-upload--span {
    width: 100% !important;
  }
  .width-100-p {
    width: 100%;
  }
  .upload-btn {
    width: 150px;
  }
  .mdh-default {
    position: relative;
    width: 100%;
    padding: 60px 20px 20px 20px;
    span-align: center;
    z-index: 1;
    text-align: center;
    .title {
      margin: 0;
      font-size: 32px;
    }
    .c-logo {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 50%;
      margin: 10px 0px;
      transform: translate(-50%, 0%);
      font-size: 16px;
      letter-spacing: 2px;
      font-weight: 400;

    }
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background:  url("../../../assets/download-bg.jpg") repeat-y;
      background-size: cover;
      opacity: .2;
      content: "";
      z-index: -1;
    }
    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% - 100px);
      max-width: 600px;
      padding: 40px 20px;
      background: #fff;
      border-radius: 10px;
      border-shadow: 20px 5px 5px rgba(0, 0, 0, 1);
      p {
        margin: 0;
        padding: 0;
        font-size: 14px;
        line-height: 30px;
        color: #464444;
      }
      .qrcode {
        margin-top: 40px;
        p {
          margin-top: 20px;
          font-size: 14px;
        }
      }
    }
    img {
      width: 160px;
    }
    .el-main {
      background: none;
    }
    .send-code {
      padding: 12px 10px;
    }
    .submit-btn {
      width: 100%;
      background: #65c2c4;
      color: #fff;
    }
    .footer-info {
      position: absolute;
      width: calc(100% - 40px);
      bottom: 10px;
      span-align: center;
      font-size: 12px;
      color: #999999;
    }
  }

  .hidden {
    display: none;
  }

  /* miniprogram/pages/luckDraw/luckDraw.wxss */
  .lucky {
    .el-main{
      text-align: left;
      word-break: break-all;
      p {
        font-size: 12px;
        line-height: 20px;
      }
      .tips {
        margin-top: 0;
        font-size: 12px;
        line-height: 20px;
      }
      h4 {
        margin: 10px 0 0 0;
      }
    }
    .guide-list {
      padding-left: 0;
      font-size: 12px;
      li {
      }
    }
    .download {
      margin-top: 10px;
    }
  }
</style>
