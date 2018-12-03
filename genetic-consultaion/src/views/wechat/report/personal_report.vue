<template>
  <div class="ru6c nick">
    <h4 class="c-logo">奥格妮克健康管理中心</h4>
    <div class="c-header">
      <p>亲爱的{{name}} ，您好</p>
    </div>
    <div class="result-concent">
      <h5>全部报告列表</h5>
      <div class="result-list">
        <div class="result-info" @click="toRu6c">
          <div class="have-report">[<span>Y</span>] 全基因组精准检测</div>
        </div>
        <div class="result-info">
          <div>[<span></span>] 肠道微生物检测</div>
        </div>
        <div class="result-info">
          <div class="category">[<span></span>] 免疫细胞及免疫力检测</div>
        </div>
        <div class="result-info">
          <div class="category">[<span></span>] 食物过敏检测（即将推出）</div>
        </div>
        <div class="result-info">
          <div class="category">[<span></span>] 端粒检测（即将推出）</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ru6c',
  data () {
    return {
      name: this.$route.query.name,
      cellphone: this.$route.query.cellphone
    }
  },
  methods: {
    toViewReport () {
      this.$router.push({path: '/report/view/', query: {path: 'https://z.mdhcare.cn/ru6c-demo.pdf'}})
    },
    toRu6c () {
      this.$router.push({path: '/report/ru6c', query: {name: this.name, cellphone: this.cellphone}})
    }
  },
  filters: {
  },
  created () {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.confirm-message {
  width: 50% !important;
}
.width-100-p {
  width: 100%;
}
.upload-btn {
  width: 150px;
}
.result-concent {
  padding: 10px 40px;
  h5 {
    margin: 20px 0px 10px 0px;
    font-size: 18px;
    float: left;
    color: #333;
  }
}
.result-list {
  position: relative;
  clear: both;
  color: #333;
  .result-info {
    margin-bottom: 10px;
    line-height: 20px;
    text-align: left;
    span {
      text-align: center;
      display: inline-block;
      min-width: 30px;
    }
  }
  .have-report {
    color: rgb(101, 194, 196);
  }
}
.el-table .row-class {
  background: none !important;
}
.nick {
  width: 100%;
  min-height: 100%;
  padding-top: 30px;
  /*background-color: rgba(101, 194, 196, .1);*/
  text-align: center;
  color: rgb(101, 194, 196);
  font-weight: 400;
  .c-header {
    margin: 0 auto;
    width: 80%;
    padding: 6px 0px;
    font-size: 18px;
    font-weight: bold;
    display: block;
    border: 1px solid #dddddd;
    border-radius: 6px;
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
  .nick-button {
    padding: 80px 10px 20px 10px;
  }
}

</style>
