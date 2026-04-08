<template>
  <el-container class="item-list">
    <div class="mdh-default">
      <el-header class="header">
        城市合伙人计划
        <div class="success">加盟信息已提交成功</div>
      </el-header>
      <div class="content">
        <div>点击查看全科基因检测产品列表↓</div>
        <div class="btns">
          <div class="left-content">
            <el-button type="text" @click="toView('paediatrics')">儿科</el-button>
            <el-button type="text" @click="toView('obstetrics')">妇产科</el-button>
            <el-button type="text" @click="toView('gastroenterology')">消化科</el-button>
            <el-button type="text" @click="toView('physical')">健康体检类</el-button>
            <el-button type="text" @click="toView('cardiovascular')">心血管内科</el-button>
            <el-button type="text" @click="toView('oncology')">肿瘤科</el-button>
            <el-button type="text" @click="toView('eye')">眼病、肾病、骨病</el-button>
          </div>
          <div class="right-content">
            <el-button type="text" @click="toView('neurological')">神经系统疾病</el-button>
            <el-button type="text" @click="toView('reproduction')">生殖</el-button>
            <el-button type="text" @click="toView('nephrology')">肾内科&特检项目</el-button>
            <el-button type="text" @click="toView('blood')">血液病</el-button>
            <el-button type="text" @click="toView('intestinal')">肠道菌群检测</el-button>
            <el-button type="text" @click="toView('nutrient')">营养元素检测</el-button>
            <el-button type="text" @click="toView('Total-exons')">全外显子检测</el-button>
          </div>
        </div>
      </div>
      <div class="footer-info">
        &copy; 2019 MDHcare.cn 版权所有  丨  ICP证：京ICP备17067248号
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'item-list',
  data () {
    return {
      imagePath: ''
    }
  },
  methods: {
    toView (name) {
      this.axios.get('oss/upload/show', {
        params: {
          objectKey: 'solution/service/' + name + '.pdf',
          bucket: 'mdhcare',
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        // this.imagePath = this.axios.defaults.baseURL.includes('https://')
        //   ? res1.data.replace('http://', 'https://') : res1.data
        this.$router.push({path: '/report/view/', query: {path: res.data}})
        // window.location.href = this.imagePath + '&v=' + (new Date().getTime())
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .item-list.el-container {
    background: #fff;
    min-height: 100%;
  }
  .item-list .el-header {
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
  }
  .mdh-default {
    position: relative;
    width: 100%;
    padding: 60px 20px 20px 20px;
    text-align: center;
    z-index: 1;
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background:  url("../../assets/download-bg.jpg") repeat-y;
      background-size: cover;
      opacity: .2;
      content: "";
      z-index: -1;
    }
    .content {
      position: absolute;
      top: calc(50% + 50px);
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
        font-size: 18px;
        color: #464444;
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
