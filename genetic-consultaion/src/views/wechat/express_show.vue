<template>
  <el-container>
    <div class="mdh-mobile-form">
      <p class="order-no" v-if="orderNo !== undefined">订单编号：{{orderNo}}</p>
      <div class="mdh-input-row">
        <label>快递单号</label>
        <input type="text" v-model="expressCode" placeholder="请输入快递单号">
      </div>
      <div class="show">
        <div class="imgInfo" id="img">
          <img :src="imagePath">
        </div>
      </div>
      <div class="btn-row">
        <el-button type="primary" @click="toUploadExpress">重新上传</el-button>
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'express-show',
  data () {
    return {
      expressCode: '',
      orderNo: this.$route.query.orderNo,
      loading: null,
      companyId: parseInt(this.$route.query.companyId),
      imagePath: null,
      reUpload: null
    }
  },
  props: {
  },
  beforeCreate () {
  },
  mounted () {
  },
  methods: {
    initData () {
      if (this.$route.query.expressId !== undefined) {
        this.axios.get('express/' + this.$route.query.expressId).then(res => {
          this.expressCode = res.data.expressOrder.expressCode
          this.expressId = res.data.expressOrder.id
          this.axios.get('oss/upload/show', {
            params: {
              objectKey: res.data.expressOrder.path
            }
          }).then(res1 => {
            this.imagePath = this.axios.defaults.baseURL.includes('https://')
              ? res1.data.replace('http://', 'https://') : res1.data
            this.reUpload = false
          }).catch(err => {
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    toUploadExpress () {
      this.$router.push({
        path: '/wechat/express/upload',
        query: {
          openid: this.$route.query.openid,
          orderId: this.$route.query.orderId,
          orderNo: this.$route.query.orderNo,
          companyId: this.companyId,
          expressId: this.$route.query.expressId}})
    }
  },
  watch: {
  },
  created () {
    this.loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.initData()
    this.loading.close()
  },
  filters: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .my-message {
    width: 80%;
    height: 100px;
    min-width: auto;
    background-color: rgba(0, 0, 0, .6);
    border-color: rgba(0, 0, 0, .6);
  }
  .el-container {
    min-height: 100%;
  }
  .upload-main {
    overflow: hidden;
  }
  .el-header {
    margin-top: 20px;
    text-align: left;
    height: 40px !important;
  }
  .float-l {
    float: left;
  }
  .width-100-p {
    width: 100%
  }
  .el-select-dropdown {
    width: 70% !important;
    left: 100px !important;
  }
  .el-popper[x-placement^=bottom] {
    width: 70% !important;
    left: 100px !important;
  }
  .el-scrollbar__wrap {
    width: 100%;
  }
  .el-select-dropdown__list {
    width: 100%;
  }
  .el-select-dropdown__item {
    width: 100%;
    height: auto;
  }
  .mui-table-view:after {
    left: 15px;
  }
  .select-option {
    margin: 8px 0px;
    width: 100%;
    height: auto;
    line-height: 18px;
    word-wrap: break-word !important;
    white-space: normal;
  }
  .mdh-mobile-form {
    margin: 0;
    width: 100%;
    padding: 0;
    .form-group-title {
      padding-left: 10px;
      font-size: 14px;
      color: #333333;
    }
  }
  .mdh-input-row{
    position: relative;
    width: 100%;
    background: #fff;
    height: 40px;
    padding: 0;
    label {
      position: absolute;
      left: 0;
      top: 0;
      width: 80px;
      padding-left: 16px;
      line-height: 40px;
      font-size: 14px;
    }
    input {
      height: 40px;
      width: calc(100% - 90px);
      padding: 0px 0px 0px 90px;
      border: 0;
      line-height: 40px;
      font-size: 14px;
      color: #333333;
    }
    .next-step {
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      padding: 0px 10px;
      line-height: 42px;
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
  .mdh-upload-row {
    position: relative;
    width: 100%;
    background: #fff;
    padding: 0;
    label {
      width: 80px;
      padding-left: 16px;
      line-height: 40px;
      font-size: 14px;
    }
    .upload-row {
      position: relative;
      padding: 0px 16px;
    }
  }
  .upload-row {
    position: relative;
    padding: 0px 10px;
  }
  .btn-row {
    padding: 20px 16px;
    .el-button {
      width: 100%;
      background-color: #1ABC9C;
      border-color: #1ABC9C;
    }
  }
  input::-webkit-input-placeholder{
    color:#c0c0c0;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#c0c0c0;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#c0c0c0;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color:#c0c0c0;
  }
  input:focus {
    outline:none;
    border: 0;
  }
  .error-tip {
    color: #F56C6C;
    position: absolute;
    right: 30px;
    top: 0;
    font-size: 10px;
    line-height: 40px;
  }

  .title-info {
    margin: 20px auto;
    width: 80%;
    padding: 10px 20px;
    font-size: 14px;
    text-align: center;
    border: 1px solid #1ABC9C;
    border-radius: 10px;
  }
  .update-btn {
    display: inline-block;
    /*margin-left: 10px;*/
    padding: 6px 0px;
    font-size: 14px;
    line-height: 14px;
    color: #1ABC9C;
  }
  .order-no {
    padding: 10px 15px;
    font-size: 14px;
  }
  .show {
    padding-left: 5px;
  }
</style>
