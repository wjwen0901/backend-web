<template>
  <div class="ru6c nick">
    <div class="c-header">
      <p>亲爱的{{name}} ，您好</p>
    </div>
    <div class="result-concent">
      <h5>全部报告列表</h5>
      <div class="result-list">
        <div class="result-info" @click="toRu6c">
          <div class="have-report">[ Y ] 全基因组精准检测</div>
        </div>
        <div class="result-info">
          <div class="have-report">[ Y ] 肠道微生物检测</div>
        </div>
        <div class="result-info">
          <div class="category">[  ] 免疫细胞及免疫力检测</div>
        </div>
        <div class="result-info">
          <div class="category">[  ] 食物过敏检测（即将推出）</div>
        </div>
        <div class="result-info">
          <div class="category">[  ] 端粒检测（即将推出）</div>
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
    margin: 10px 0;
    font-size: 16px;
    float: left;
  }
}
.result-list {
  position: relative;
  clear: both;
  .result-info {
    margin-bottom: 10px;
    line-height: 20px;
    float: left;
  }
  .have-report {
    border-bottom: 1px solid rgba(255, 255, 255, .8);
  }
}
.el-table .row-class {
  background: none !important;
}
.comment-high {
  color: #F56C6C;
}
.comment-middle {
  color: #E6A23C;
}
.comment-low {
  color: #4A9857;
}
.nick {
  width: 100%;
  min-height: 100%;
  padding-top: 30px;
  background-color: rgb(101, 194, 196);
  text-align: center;
  color: #fff;
  font-weight: 400;
  .c-header {
    margin: 0 auto;
    width: 80%;
    padding: 6px 0px;
    font-size: 18px;
    display: block;
    border: 1px solid rgba(255, 255, 255, .8);
    border-radius: 6px;
  }
  .nick-button {
    padding: 80px 10px 20px 10px;
  }
  .nick-button .el-button{
    background: rgba(255, 255, 255, .8);
    margin-top: 20px;
    color: rgb(101, 194, 196);
    /*border: 1px solid rgba(255, 255, 255, .8);*/
    width: 100%;
  }
}

</style>
