<template>
  <div class="container">
    <el-button type="success" class="expend-pdf" @click="getPdf('#pdf-doc','营养健康')">导出PDF</el-button>
    <div class="pdf-content" id="pdf-doc">
      <section class="page-1">
        <div class="title">
          <h3>焕彩基因</h3>
          <h3>美肤方案</h3>
        </div>
        <div class="footer">
          <p>北京凯能婷干细胞科技研究院有限公司</p>
          <p>中科院专家支持</p>
        </div>
      </section>
      <section class="page-2">
        <table>
          <thead>
            <tr>
              <th colspan="2" width="50%">用户资料</th>
              <th colspan="2">实验室资料</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td width="96">姓名</td>
              <td>{{data.UserName}}</td>
              <td width="96">样本类型</td>
              <td>口腔拭子</td>
            </tr>
            <tr>
              <td>性别</td>
              <td>{{data.Sex}}</td>
              <td>样本编号</td>
              <td>{{data.Barcode}}</td>
            </tr>
            <tr>
              <td>报告日期</td>
              <td>{{new Date() | formatDate}}</td>
              <td>样本接收日期</td>
              <td>{{parseInt(data.UpdateTime.slice(6, data.UpdateTime.length - 2)) | formatDate}}</td>
            </tr>
          </tbody>
        </table>
        <div class="hello-people">
          <p class="dear">亲爱的用户：</p>
          <p>非常感谢您使用我们研发的焕彩基因美肤方案检测服务。我们采用了您提供的唾液样本，运用高科技手段全面分析了您的肤质基因信息，
            在这里呈现的是从几百页的报告中萃取的精华，给您全面的报告。</p>
          <p>我们的报告涵盖肤质特性和肤质相关营养代谢能力。在近百敏感基因位点中，深度解析您的基因如何影响您的皮肤肤质，皮肤营养和防病能力。</p>
          <p>我们诚挚地感谢您对我们的信任，希望您对我们的服务满意。如果对报告的内容有任何的问题和不解，请随时和我们联系：或者在我们的微信公众号随时与营养顾问进行沟通。</p>
          <p>再次感谢您选择我们的服务，愿您更美丽更健康！祝您和您的家人快乐！</p>
          <p class="thanks-all">凯能婷全体员工</p>
        </div>
      </section>
      <section class="page-3">
        <div class="header">
          <h3><i class="el-icon-question"></i>如何影响我们的健康和皮肤?</h3>
        </div>
        <div class="content">
          <p>DNA是基因的物质基础，从遗传学上讲, 正是基因的细微差别造就了不同的你和我，这些微小的差别也决定了营养在每个人体内的不同效应,并影响身体如何代谢所吃的食物，以及对皮肤的影响。
          </p>
          <p></p>
          <p>
          分子营养学揭示了身体的基因，细胞和蛋白质的关系，帮助我们：
          </p>
          <p>
          －预测每个人身体和皮肤对营养素的不同反应
          </p>
          <p>
          －判断哪一些人无法吸收某一些营养素
          </p>
          <p>
          －判断如何通过膳食调整来避免遗传高风险的疾病
          </p>
          <p>
          －发现有治疗功能的营养素
          </p>
        </div>
      </section>
      <section class="page-4">
        <div class="header">
          <h3><i class="el-icon-question"></i>您该做些什么？</h3>
        </div>
        <div class="content">
          <p>个性化的营养取决于食物与基因的双向关系。一 方面,我们吃的食物可以影响基因的表达; 另一方面,我们的基因可以影响身体对食物作出的反应。</p>
          <p>基因也影响着每个人对于慢性病不同的患病风险，和后天的环境及生活方式一起决定我们的健康状况。可以说，人的基因组就像继承于父母的一手牌，而每个人的生活方式就代表了你如何出牌（包括吃什么，睡了多少，运动多少，是否补充足够营养），最终的高下决定了你离疾病有多远。</p>
          <p>
            我们根据您的基因检测结果为您定制的运动饮食和营养方案，正是基于对您摄取营养成分时在分子层级的反应，结合您的肤质特征和个体特征，为您量身定制的个性化方案。
          </p>
          <p>
            我们无法改变我们的基因，但是适合的饮食，合理的运动和充分的营养，改变不当的习惯，可以让我们更好的拥抱健康。
          </p>
          <img src="../../../assets/genssential/bg-page4.jpg"/>
        </div>
      </section>
      <section class="page-5">
        <div class="header">
          <img src="../../../assets/genssential/page5-1.png"/>
        </div>
        <div class="content">
          <p>
            <span class="title">皮肤( Skin )</span>
            是人体最大的器官，主要承担着保护身体、排汗、感觉冷热和压力的功能。皮肤覆盖全身，具有两个方面的屏障作用：一方面防止体内水分，电解质和其他物质的丢失；另一方面阻止外界有害物质的侵入。保持着人体内环境的稳定上，在生理上起着重要的保护功能，同时皮肤也参与人体的代谢过程。
          </p>
          <p>
            由于皮肤直接暴露在外界环境中，随着环境的污染和岁月的流逝，肌肤会出现各种各样的问题，失去弹性，皱纹生成，易晒黑，皮肤干燥，色素沉积等。护肤已成为一门<span class="key-point">科学</span>，而科学性护肤的奥秘隐藏在您的DNA中。
          </p>
          <p>
            <span class="key-point">每个人都是独特的！</span>
            您的肤质基因检测结果为定制您专属的护肤运动饮食和营养方案提供了最可信赖最科学的依据。我们倡导由内而外，内外兼修的科学靓肤美白理念。探寻皮肤本质需求，及早呵护您的肌肤，让您神采奕奕。
          </p>
        </div>
      </section>
      <section class="page-6">
        <h3>您的美肤基因报告综合摘要</h3>
        <h4>Your DNA Test Highlights</h4>
      </section>
      <section class="page-7">
        <h3>您的美肤潜质概览：</h3>
        <table>
          <thead>
          <tr>
            <th>检测类别</th>
            <th>检测项目</th>
            <th>检测结果</th>
          </tr>
          </thead>
          <tbody v-if="data.ReportResult[1].GroupName.indexOf('肤质') > -1">
          <tr v-for="(item, index) in data.ReportResult[1].Items" v-bind:key="item.id">
            <td width="96" ><span v-if="index === 0">肤质类</span></td>
            <td>{{item.ItemName}}</td>
            <td>{{item.ItemNameKey}}{{item.LevelNames.split(',')[item.Level-1]}}</td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr v-for="(item, index) in data.ReportResult[0].Items" v-bind:key="item.id">
            <td width="96" ><span v-if="index === 0">肤质类</span></td>
            <td>{{item.ItemName}}</td>
            <td>{{item.ItemNameKey}}{{item.LevelNames.split(',')[item.Level-1]}}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="page-8">
        <h3>美肤营养素需求：</h3>
        <table>
          <thead>
          <tr>
            <th>检测类别</th>
            <th>检测项目</th>
            <th>检测结果</th>
          </tr>
          </thead>
          <tbody v-if="data.ReportResult[0].GroupName.indexOf('美肤') > -1">
          <tr v-for="(item, index) in data.ReportResult[0].Items" v-bind:key="item.id">
            <td width="96" ><span v-if="index === 0">美肤营养类</span></td>
            <td>{{item.ItemName}}</td>
            <td>{{item.ItemNameKey}}{{item.LevelNames.split(',')[item.Level-1]}}</td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr v-for="(item, index) in data.ReportResult[1].Items" v-bind:key="item.id">
            <td width="96" ><span v-if="index === 0">美肤营养类</span></td>
            <td>{{item.ItemName}}</td>
            <td>{{item.ItemNameKey}}{{item.LevelNames.split(',')[item.Level-1]}}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="page-9">
        <h3>您的美肤基因报告分析解读</h3>
        <h4>Your DNA Test Summary</h4>
      </section>
      <section class="page-info-total" v-if="data.ReportResult[1].GroupName.indexOf('肤质') > -1">
        <img src="../../../assets/genssential/G003-banner.jpg">
        <div class="content">
          <h3>综合评价和建议</h3>
          <p>
            {{data.ReportResult[1].GroupDesc.replace('{BusinessName}','Genessential')}}
          </p>
        </div>
      </section>
      <section class="page-info-total" v-else>
        <img src="../../../assets/genssential/G003-banner.jpg">
        <div class="content">
          <h3>综合评价和建议</h3>
          <p>
            {{data.ReportResult[0].GroupDesc.replace('{BusinessName}','Genessential')}}
          </p>
        </div>
      </section>
      <section class="page-service-title">
        <h3>服务条款</h3>
        <h4>Service Terms</h4>
      </section>
      <section class="page-service">
        <h3>服务条款</h3>
        <p>
          <span class="service-no">1.</span>
          本产品是一项美肤基因检测服务，通过基因检测来评估您患皮肤类疾病的相关风险，对不同营养素的需求反应，以揭示遗传对疾病和营养的影响。
        </p>
        <p>
          <span class="service-no">2.</span>
          对某种疾病高风险并不意味着您已经或者必然会患有某种疾病，低风险也不意味着您一定不会患某种疾病，对自身基因及风险的全面了解有助于您建立更全面有效的健康规划。
        </p>
        <p>
          <span class="service-no">3.</span>
          基因检测涉及的风险评估性预测，不是确定性的诊断测试，并不能确定使用者是否会患某种疾病或已患有某种疾病，只为疾病的预防、诊断、个性化治疗及饮食营养等提供参考依据，<span class="red">不可作为诊断性结论</span>。
        </p>
        <p>
          <span class="service-no">4.</span>
          我们承诺采用最新行业技术但不保证结果的100%准确率，对非技术原因造成的结果误差概不负责。
        </p>
      </section>
    </div>

  </div>
</template>

<script>
export default {
  name: 'pdf_report',
  data () {
    return {
      htmlTitle: '营养健康',
      data: {}
    }
  },
  methods: {
    getInfo: function () {
      let instance = this.axios.create({
        baseURL: ''
      })
      let that = this
      instance({
        method: 'get',
        url: 'http://serviceapi.qynode.com/api/report/getresult',
        params: {
          barcode: '70267817_G0H',
          userid: 'd786a2b0'
        }
      }).then(function (res) {
        console.log(res)
        that.data = res.data.Data
      }).catch(function (err) {
        console.log(err)
      })
    }
  },
  created () {
    this.getInfo()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .container {
    background: #f1f1f1;
    color: #7F7F7F;
    .expend-pdf {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translate(110mm, 0);
    }
  }
  .pdf-content {
    width: 794px;
    margin: 0 auto;
  }
  section {
    position: relative;
    margin: 0;
    padding: 150px 80px;
    width: calc(100% - 160px);
    height: calc(1123px - 300px);
  }
  .page-1 {
    background: url("../../../assets/genssential/bg-page1.jpg") no-repeat;
    background-size: 100% auto;
    background-position: bottom;
    .title {
      padding-top: 300px;
      text-align: center;
      font-weight: 500;
      color: #E8B2AE;
      h3 {
        font-size: 70px;
        margin: 0 0 30px 0;
      }
    }
    .footer {
      position: absolute;
      right: 30px;
      bottom: 40px;
      text-align: right;
      font-size: 22px;
      font-weight: 500;
      color: #7395D3;
      p {
        margin: 0 0 10px 0;
      }
    }
  }
  .page-2 {
    background: url("../../../assets/genssential/bg-page2.jpg") no-repeat;
    background-size: 100% auto;
    background-position: bottom;
    table {
      width: 100%;
      border-collapse: collapse;
      thead>tr>th,
      tbody>tr>td {
        padding: 10px;
        border: 1px solid #333;
        /*color: #7F7F7F;*/
      }
      thead>tr>th {
        font-size: 18px;
        text-align: center;
      }
    }
    .hello-people {
      margin-top: 50px;
    }
    p {
      text-align: justify;
      &.dear {
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: bold;
      }
      &.dear {
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: bold;
      }
      &.thanks-all {
        margin-top: 20px;
        text-align: right;
      }
    }
  }
  .page-3 {
    background: url("../../../assets/genssential/bg-page3.jpg") no-repeat;
    background-size: cover;
    background-position: bottom;
  }
  .page-3,.page-4 {
    .header {
      color: #E6CEED;
      font-size: 30px;
      h3 {
        margin: 0;
        i {
          margin-right: 20px;
        }
      }
    }
    .content {
      margin-top: 30px;
      p {
        margin: 22px 0;
      }
    }
  }
  .page-4 {
    background: #fff;
    .header {
      color: #F5B59A;
      font-size: 30px;
      h3 {
        margin: 0;
        i {
          margin-right: 20px;
        }
      }
    }
    img {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
    }
  }
  .page-5 {
    background: url("../../../assets/genssential/bg-page5.jpg") no-repeat;
    background-size: cover;
    background-position: bottom;
    .header {
      img {
        width: 33px;
        margin-bottom: -10px;
      }
    }
    .content {
      p {
        margin: 0px 0px 30px 0px;
      }
      .title {
        color: #FBD280;
        font-size: 32px;
      }
      .key-point {
        color: #FBD280;
      }
    }
  }
  .page-6,.page-9,.page-service-title {
    background: url("../../../assets/genssential/bg-page6.jpg") no-repeat;
    background-size: cover;
    background-position: bottom;
    color: #DA8E9F;
    text-align: center;
    h3 {
      margin-top: 300px;
      margin-bottom: 10px;
      font-size: 44px;
    }
    h4 {
      margin-top: 0px;
      text-align: center;
      font-size: 18px;
    }
  }
  .page-7,.page-8 {
    background: #fff;
    h3 {
      margin-top: 0;
      margin-bottom: 40px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      thead>tr>th,
      tbody>tr>td {
        padding: 10px 20px;
        border: 1px solid #fff;
      }
      thead>tr>th {
        font-size: 18px;
        color: #fff;
        background: #70AD47;
      }
      tbody>tr>td {
        color: #535353;
        background: #D4E2CE;
      }
    }
  }
  .page-service {
    width: calc(100% - 280px);
    height: calc(1123px - 300px);
    padding: 150px 140px;
    background: url("../../../assets/genssential/bg-page-service.jpeg") no-repeat;
    background-size: cover;
    background-position: bottom;
    h3 {
      text-align: center;
      font-size: 24px;
      margin-bottom: 30px;
      color: #333333;
    }
    p {
      margin-left: 30px;
      margin-bottom: 50px;
      text-align: justify;
      text-indent: -30px;
      font-size: 20px;
      /*font-weight: 300;*/
      .service-no {
        margin-right: 10px;
        font-weight: 400;
      }
      .red {
        color: #CA0C13;
      }
    }
  }
  .page-info-total {
    background: #fff;
    > img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .content {
      margin-top: 460px;
      h3 {
        font-size: 24px;
        line-height: 30px;
        text-align: center;
      }
      p {
        font-size: 18px;
      }
    }
  }
</style>
