<template>
  <div class="ru6c nick">
    <div class="c-header">报告预览</div>
    <div>
      <div class="result-list">
        <div class="result-info" v-for="result in reportList" v-bind:key="result.category" @click="toRu6cDetail(result)">
          <div class="category">{{result.category}}</div>
          <div class="comment">
            <span>{{result.phenotypes.length}}项</span>
          </div>
        </div>
      </div>
      <div class="nick-button">
        <el-button @click="toViewReport">查看详细报告</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ru6c',
  data () {
    return {
      reportList: [],
      pdfPath: ''
    }
  },
  methods: {
    initData () {
      console.log(this.$route.query)
      this.axios.get('report/list', {
        params: {
          name: this.$route.query.name,
          cellphone: this.$route.query.cellphone
        }
      }).then(res => {
        console.log(res.data)
        this.reportList = res.data.menuList
        this.pdfPath = res.data.path
      })
    },
    toViewReport () {
      this.$router.push({path: '/report/view/', query: {'path': this.pdfPath}})
    },
    toRu6cDetail (result) {
      this.$router.push({path: '/report/ru6c/detail', query: {result: result, path: this.pdfPath}})
    }
  },
  filters: {
    commentCssfilter (arg) {
      console.log(arg)
      let classText = 'comment-high'
      if (arg === '中风险') {
        classText = 'comment-middle'
      } else if (arg === '低风险') {
        classText = 'comment-low'
      } else if (arg === '高风险') {
        classText = 'comment-high'
      }
      return classText
    }
  },
  created () {
    this.initData()
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
  .result-list {
    position: relative;
    width: 100%;
    clear: both;
    .result-info:first-child {
      border-top: 1px solid #dddddd;
    }
    .result-info {
      position: relative;
      padding: 10px 10px;
      /*line-height: 20px;*/
      /*min-height: 40px;*/
      clear: both;
      border-bottom: 1px solid #dddddd;
    }
    .category {
      display: inline-block;
      width: 80%;
      text-align: left;
      line-height: 20px;
      color: #333;
    }
    .comment {
      float: right;
      width: 20%;
      display: inline-block;
      text-align: right;
      line-height: 20px;
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
    /*background-color: rgba(101, 194, 196, .1);*/
    padding: 0px;
    text-align: center;
    color: rgb(101, 194, 196);
    font-weight: 400;
    font-size: 14px;
    .el-form-item {
      margin-bottom: 16px;
    }
    .nick-input {
      width: 80% !important;
      -webkit-appearance: none;
      background: none;
      border-radius: 4px;
      border: 1px solid rgb(101, 194, 196);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #333333;
      display: inline-block;
      font-size: inherit;
      height: 40px;
      line-height: 40px;
      outline: 0;
      padding: 0 15px;
      -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
      transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
      width: 100%;
    }
    input::placeholder {
      color: #fff;
    }
    .c-header {
      padding: 20px 10px 20px 10px;
      font-size: 20px;
      display: block;
      color: #333;
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
    .nick-button .el-button {
      margin: 40px auto;
      width: 80% !important;
      background: rgb(101, 194, 196);
      color: #fff;
      /*border: 1px solid rgba(255, 255, 255, .8);*/
      width: 100%;
    }
  }
  /*.nick {*/
    /*width: calc(100%);*/
    /*min-height: 100%;*/
    /*background-color: rgb(101, 194, 196);*/
    /*text-align: center;*/
    /*color: #fff;*/
    /*font-weight: 400;*/
    /*.el-form-item {*/
      /*margin-bottom: 16px;*/
    /*}*/
    /*.nick-input {*/
      /*width: 100%;*/
      /*-webkit-appearance: none;*/
      /*background: none;*/
      /*border-radius: 4px;*/
      /*border: 1px solid #fff;*/
      /*-webkit-box-sizing: border-box;*/
      /*box-sizing: border-box;*/
      /*color: #606266;*/
      /*display: inline-block;*/
      /*font-size: inherit;*/
      /*height: 40px;*/
      /*line-height: 40px;*/
      /*outline: 0;*/
      /*padding: 0 15px;*/
      /*-webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);*/
      /*transition: border-color .2s cubic-bezier(.645,.045,.355,1);*/
      /*width: 100%;*/
    /*}*/
    /*input::placeholder {*/
      /*color: #fff;*/
    /*}*/
    /*.c-header {*/
      /*padding: 20px 10px 20px 10px;*/
      /*font-size: 18px;*/
      /*display: block;*/
    /*}*/
    /*.nick-button {*/
      /*padding: 80px 10px 20px 10px;*/
    /*}*/
    /*.nick-button .el-button{*/
      /*background: rgba(255, 255, 255, .8);*/
      /*margin-top: 20px;*/
      /*color: rgb(101, 194, 196);*/
      /*!*border: 1px solid rgba(255, 255, 255, .8);*!*/
      /*width: 100%;*/
    /*}*/
  /*}*/

</style>
