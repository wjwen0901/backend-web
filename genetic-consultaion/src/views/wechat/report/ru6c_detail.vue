<template>
  <div class="ru6c nick">
    <div class="c-header">{{category}}</div>
    <div>
      <div class="result-list">
        <div class="result-info" v-for="result in phenotypes" v-bind:key="result.category">
          <div class="category">{{result.phenotype}}</div>
          <div class="comment">
            <span :class="result.comment | commentCssfilter">{{result.comment}}</span>
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
      resultInfo: [
        {
          category: '肿瘤健康风险',
          phenotypes: [
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            }
          ]
        },
        {
          category: '遗传特征及遗传疾病',
          phenotypes: [
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            }
          ]
        },
        {
          category: '免疫系统风险',
          phenotypes: [
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            }
          ]
        },
        {
          category: '胶原蛋白及黑色素等皮肤基因',
          phenotypes: [
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            }
          ]
        },
        {
          category: '瘦身运动基因',
          phenotypes: [
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            }
          ]
        },
        {
          category: '人体天赋基因',
          phenotypes: [
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            }
          ]
        },
        {
          category: '药物过敏检测',
          phenotypes: [
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            },
            {
              phenotype: '选择性IgA缺陷',
              comment: '高风险',
              level: 2
            }
          ]
        }
      ],
      CustomizedKey: this.$route.query.k
    }
  },
  methods: {
    toViewReport () {
      this.$router.push({path: '/report/view/', query: {path: 'https://z.mdhcare.cn/ru6c-demo.pdf'}})
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
    .result-info {
      position: relative;
      padding: 0px 10px;
      clear: both;
    }
    .category {
      float: left;
      display: inline-block;
      width: 80%;
      text-align: left;
      line-height: 40px;
    }
    .comment {
      float: right;
      width: 20%;
      display: inline-block;
      text-align: right;
      line-height: 40px;
    }
    .result-info:not(:first-child) > :before {
      content: '';
      display: block;
      width: 100%;
      height: 0;
      top: 0;
      left: 0;
      border-bottom: 1px solid #fff;
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
    width: calc(100%);
    min-height: 100%;
    background-color: rgb(101, 194, 196);
    text-align: center;
    color: #fff;
    font-weight: 400;
    .el-form-item {
      margin-bottom: 16px;
    }
    .nick-input {
      width: 100%;
      -webkit-appearance: none;
      background: none;
      border-radius: 4px;
      border: 1px solid #fff;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: inherit;
      height: 40px;
      line-height: 40px;
      outline: 0;
      padding: 0 15px;
      -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      width: 100%;
    }
    input::placeholder {
      color: #fff;
    }
    .c-header {
      padding: 20px 10px 20px 10px;
      font-size: 18px;
      display: block;
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
