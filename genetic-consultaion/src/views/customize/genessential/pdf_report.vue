<template>
  <div class="container">
    <el-button type="success" class="expend-pdf" @click="getPdf('#pdf-doc','营养健康')">导出PDF</el-button>
    <!--<el-button type="success" class="expend-pdf" @click="pdf()">导出PDF</el-button>-->
    <div class="pdf-content" id="pdf-doc">
      <section class="page-1">
        <div class="title">
          <h3>焕彩基因</h3>
          <h3>美肤方案</h3>
        </div>
        <div class="footer">
          <p>北京凯能婷干细胞科技研究院</p>
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
              <td>{{parseInt(data.UpdateTime.replace('/Date(', '').replace(')/', '')) | formatDate}}</td>
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
          <tbody>
          <tr v-for="(item, index) in data.fuzhi.Items" v-bind:key="item.id">
            <td width="96" ><span v-if="index === 0">肤质类</span></td>
            <td>{{item.ItemName}}</td>
            <td>{{item.LevelNames.split(',')[item.Level-1]}}</td>
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
          <tbody>
          <tr v-for="(item, index) in data.yingyang.Items" v-bind:key="item.id">
            <td width="96" ><span v-if="index === 0">美肤营养类</span></td>
            <td>{{item.ItemName}}</td>
            <td>{{item.LevelNames.split(',')[item.Level-1]}}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="page-9">
        <h3>您的美肤基因报告分析解读</h3>
        <h4>Your DNA Test Summary</h4>
      </section>
      <section class="page-info-total">
        <img src="../../../assets/genssential/G003-banner.jpg">
        <div class="content">
          <h3>综合评价和建议</h3>
          <p>
            {{data.fuzhi.GroupDesc.replace('{BusinessName}','Genessential')}}
          </p>
        </div>
      </section>
      <div v-for="(item, itemIndex) in data.fuzhi.Items" v-bind:key="item.ItemId" v-if="itemIndex >= 0">
        <section class="page-info-item">
          <div class="header">
            <img :src="imgSrc((item.ItemId + '-1'))" v-if="item.ItemId !== undefined && item.ItemId !== ''">
            <div class="title-info">
              <h3 class="title">{{item.ItemName}}</h3>
              <h4 class="sub-title">{{item.ItemNameEng}}</h4>
            </div>
          </div>
          <div class="test-result">
            <div class="title">
              <img class="icon" src="../../../assets/genssential/jieguo.png">
              <h4>我的检测结果</h4>
            </div>
            <p>{{item.detail.LevelDesc}}</p>
            <div class="result-label">{{item.detail.NameKey}}{{item.detail.LevelNames.split(',')[item.detail.Level-1]}}</div>
            <table>
              <thead>
              <tr>
                <th>基因</th>
                <th>位点</th>
                <th>基因型</th>
                <th>结果</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="gene in item.detail.Sites" v-bind:key="gene.Guid">
                <td>{{gene.GeneName}}</td>
                <td>{{gene.RSID}}</td>
                <td>{{gene.GeneType}}</td>
                <td>{{gene.Result}}</td>
              </tr>
              </tbody>
            </table>
            <div class="title" v-if="item.detail.Sites == '' || item.detail.Sites.length <= 6">
              <img class="icon" src="../../../assets/genssential/renqun.png">
              <h5>人群分布</h5>
            </div>
            <div class="population-dis" v-if="item.detail.Sites == '' || item.detail.Sites.length <= 6">
              <h5>Genessential基钥数据库和您一样的人:<span class="percent">{{item.detail.LevelPercentages.split(',')[item.detail.Level-1]}}%</span></h5>
              <ve-ring ref="chart"
                       width="320px"
                       height="240px"
                       :data-select="item.detail.LevelName"
                       :data="item.chartData"
                       :settings="chartSettings"
                       :extend="chartExtend"></ve-ring>
            </div>
          </div>
        </section>
        <section class="page-info-item" v-if="item.detail.Sites != '' && item.detail.Sites.length > 6">
          <div class="test-result">
            <div class="title">
              <img class="icon" src="../../../assets/genssential/renqun.png">
              <h5>人群分布</h5>
            </div>
            <div class="population-dis">
              <h5>Genessential基钥数据库和您一样的人:<span class="percent">{{item.detail.LevelPercentages.split(',')[item.detail.Level-1]}}%</span></h5>
              <ve-ring ref="chart"
                       width="320px"
                       height="240px"
                       :data-select="item.detail.LevelName"
                       :data="item.chartData"
                       :settings="chartSettings"
                       :extend="chartExtend"></ve-ring>
            </div>
          </div>
        </section>
        <div>
          <section class="page-info-item-detail" v-for="(knowledge, index) in item.detail.KnowledgeData.Value" v-bind:key="knowledge.Id">
            <div class="test-result">
              <div class="title" v-if="index===0">
                <img class="icon" src="../../../assets/genssential/zhishi.png">
                <h5>相关知识</h5>
              </div>
              <div class="info-list">
                <h4 class="title">{{knowledge.Title}}</h4>
                <img :src="imgSrc(knowledge.ImageName)" v-if="knowledge.ImageName != ''">
                <div v-for="(content, index) in knowledge.Content" v-bind:key="index">
                  <h5 v-if="content.SubTitle !==''">{{content.SubTitle}}</h5>
                  <div class="info" v-html="content.Details"></div>
                </div>
              </div>
              <div class="title">
                <img class="icon" src="../../../assets/genssential/chengfen.png">
                <h5>专属护肤成分</h5>
              </div>
              <div class="info">
                {{item.detail.SuggestSkin.replace('{BusinessName}','Genessential')}}
              </div>
              <div class="chengfen-labels">
                <h4 class="sub-title">专属为您匹配的活性成分 ：</h4>
                <span v-for="(chenfen, chengfenIndex) in item.detail.SuggestSkinData.split(',')" v-bind:key="chengfenIndex">{{chenfen}}  </span>
              </div>
            </div>
          </section>
        </div>
        <section class="page-info-item-detail">
          <div class="test-result">
            <div class="title">
              <img class="icon" src="../../../assets/genssential/jianyi.png">
              <h5>个性护肤建议</h5>
            </div>
            <h4 class="sub-title">日常护肤 :</h4>
            <div v-html="item.detail.SuggestHome.replace(new RegExp('\n', 'gm'), '<br/>')"></div>
            <h4 class="sub-title">美肤饮食 :</h4>
            <div v-html="item.detail.SuggestFoods"></div>
            <h4 class="sub-title">推荐运动 :</h4>
            <div v-html="item.detail.SuggestSport"></div>
            <h4 class="sub-title">营养素的补充 :</h4>
            <div v-html="item.detail.SuggestNutrient"></div>
          </div>
        </section>
        <section class="page-info-item-detail page-info-gene" v-for="gene in item.detail.Sites" v-bind:key="gene.Guid">
          <div class="test-result">
            <div class="title">
              <img class="icon" src="../../../assets/genssential/jieguo.png">
              <h4>我的基因位点</h4>
            </div>
            <div class="gene-info">
              <span class="gene-name">{{gene.ChromosomeNo}}号染色体&nbsp;&nbsp;基因:{{gene.GeneName}}</span>
              <table>
                <thead>
                <tr>
                  <th>位点</th>
                  <th>基因型</th>
                  <th>结果</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{gene.RSID}}</td>
                  <td>{{gene.GeneType}}</td>
                  <td>{{gene.Result}}</td>
                </tr>
                </tbody>
              </table>
              <h4 class="sub-title">基因功能</h4>
              <p>{{gene.GeneDesc}}</p>
              <div class="gene-imgs">
                <div class="gene-img-content" v-for="imgNo in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]" v-bind:key="imgNo">
                  <img :src="imgSrc(imgNo + (gene.ChromosomeNo == imgNo ? '-q':'-g'), '.png')">
                  <span>{{imgNo}}</span>
                </div>
              </div>
            </div>
            <div class="references">
              <p class="title">参考文献</p>
              <p>{{gene.References}}</p>
            </div>
          </div>
        </section>
      </div>
      <section class="page-info-total">
        <img src="../../../assets/genssential/G001-banner.jpg">
        <div class="content">
          <h3>综合评价和建议</h3>
          <p>
            {{data.yingyang.GroupDesc.replace('{BusinessName}','Genessential')}}
          </p>
        </div>
      </section>
      <div v-for="(item, itemIndex) in data.yingyang.Items" v-bind:key="item.ItemId" v-if="itemIndex >= 0">
        <section class="page-info-item">
          <div class="header">
            <img :src="imgSrc((item.ItemId + '-1'))" v-if="item.ItemId !== undefined && item.ItemId !== ''">
            <div class="title-info">
              <h3 class="title">{{item.ItemName}}</h3>
              <h4 class="sub-title">{{item.ItemNameEng}}</h4>
            </div>
          </div>
          <div class="test-result">
            <div class="title">
              <img class="icon" src="../../../assets/genssential/jieguo.png">
              <h4>我的检测结果</h4>
            </div>
            <p>{{item.detail.LevelDesc}}</p>
            <div class="result-label">{{item.detail.NameKey}}{{item.detail.LevelNames.split(',')[item.detail.Level-1]}}</div>
            <table>
              <thead>
              <tr>
                <th>基因</th>
                <th>位点</th>
                <th>基因型</th>
                <th>结果</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="gene in item.detail.Sites" v-bind:key="gene.Guid">
                <td>{{gene.GeneName}}</td>
                <td>{{gene.RSID}}</td>
                <td>{{gene.GeneType}}</td>
                <td>{{gene.Result}}</td>
              </tr>
              </tbody>
            </table>
            <div class="title" v-if="item.detail.Sites.length <= 6">
              <img class="icon" src="../../../assets/genssential/renqun.png">
              <h5>人群分布</h5>
            </div>
            <div class="population-dis" v-if="item.detail.Sites.length <= 6">
              <h5>Genessential基钥数据库和您一样的人:<span class="percent">{{item.detail.LevelPercentages.split(',')[item.detail.Level-1]}}%</span></h5>
              <ve-ring ref="chart"
                       width="320px"
                       height="240px"
                       :data-select="item.detail.LevelName"
                       :data="item.chartData"
                       :settings="chartSettings"
                       :extend="chartExtend"></ve-ring>
            </div>
          </div>
        </section>
        <section class="page-info-item" v-if="item.detail.Sites.length > 6">
          <div class="test-result">
            <div class="title">
              <img class="icon" src="../../../assets/genssential/renqun.png">
              <h5>人群分布</h5>
            </div>
            <div class="population-dis">
              <h5>Genessential基钥数据库和您一样的人:<span class="percent">{{item.detail.LevelPercentages.split(',')[item.detail.Level-1]}}%</span></h5>
              <ve-ring ref="chart"
                       width="320px"
                       height="240px"
                       :data-select="item.detail.LevelName"
                       :data="item.chartData"
                       :settings="chartSettings"
                       :extend="chartExtend"></ve-ring>
            </div>
          </div>
        </section>
        <div v-if="item.detail.KnowledgeData.Value.length <= 2">
          <section class="page-info-item-detail">
            <div class="test-result">
              <div class="title">
                <img class="icon" src="../../../assets/genssential/zhishi.png">
                <h5>相关知识</h5>
              </div>
              <div class="info-list" v-if="item.detail.KnowledgeData.Value.length == 1">
                <h4 class="title">{{item.detail.KnowledgeData.Value[0].Title}}</h4>
                <img :src="imgSrc(item.detail.KnowledgeData.Value[0].ImageName)" v-if="item.detail.KnowledgeData.Value[0].ImageName != ''">
                <div v-for="(content, index) in item.detail.KnowledgeData.Value[0].Content" v-bind:key="index">
                  <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                  <div class="info" v-html="content.Details"></div>
                </div>
              </div>
              <div class="info-list" v-if="item.detail.KnowledgeData.Value.length == 2">
                <h4 class="title">{{item.detail.KnowledgeData.Value[1].Title}}</h4>
                <img :src="imgSrc(item.detail.KnowledgeData.Value[1].ImageName)" v-if="item.detail.KnowledgeData.Value[1].ImageName != ''">
                <div v-for="(content, index) in item.detail.KnowledgeData.Value[1].Content" v-bind:key="index">
                  <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                  <div class="info" v-html="content.Details"></div>
                </div>
              </div>
            </div>
            <div class="test-result" v-if="item.detail.FoodContentData != '' && item.detail.FoodContentData.Details.length <= 2">
              <div class="title">
                <img class="icon" src="../../../assets/genssential/jianyi.png">
                <h5>给您的建议</h5>
              </div>
              <div class="info">{{item.detail.Suggest}}</div>
              <div  v-if="item.detail.FoodContentData != ''">
                <h4 class="sub-title">饮食 :</h4>
                <div class="info" v-html="item.detail.SuggestFoods"></div>
                <h4 class="sub-title" v-if="item.detail.FoodContentData != ''">{{item.detail.FoodContentData.Title}}<span v-if="item.detail.FoodContentData.Unit != ''">({{item.detail.FoodContentData.Unit}})</span></h4>
                <table v-if="item.detail.FoodContentData != '' && item.detail.FoodContentData.Details.length > 1 && item.detail.FoodContentData.Details[0].FoodName != ''">
                  <thead>
                  <tr>
                    <th>{{item.detail.FoodContentData.Details[0].FoodName}}</th>
                    <th>{{item.detail.FoodContentData.Details[0].Content}}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(food, foodIndex) in item.detail.FoodContentData.Details" v-bind:key="food.FoodName" v-if="foodIndex > 0">
                    <td>{{food.FoodName}}</td>
                    <td>{{food.Content}}</td>
                  </tr>
                  </tbody>
                </table>
                <div class="info" v-if="item.detail.FoodContentData != '' && item.detail.FoodContentData.Details.length == 1 && item.detail.FoodContentData.Details[0].FoodName == ''">{{item.detail.FoodContentData.Details[0].Content}}</div>
              </div>
            </div>
          </section>
          <section class="page-info-item-detail" v-if="item.detail.FoodContentData != '' && item.detail.FoodContentData.Details.length > 2">
            <div class="test-result">
              <div class="title">
                <img class="icon" src="../../../assets/genssential/jianyi.png">
                <h5>给您的建议</h5>
              </div>
              <div class="info">{{item.detail.Suggest}}</div>
              <div  v-if="item.detail.FoodContentData != ''">
                <h4 class="sub-title">饮食 :</h4>
                <div class="info" v-html="item.detail.SuggestFoods"></div>
                <h4 class="sub-title" v-if="item.detail.FoodContentData != ''">{{item.detail.FoodContentData.Title}}<span v-if="item.detail.FoodContentData.Unit != ''">({{item.detail.FoodContentData.Unit}})</span></h4>
                <table v-if="item.detail.FoodContentData != '' && item.detail.FoodContentData.Details.length > 1 && item.detail.FoodContentData.Details[0].FoodName != ''">
                  <thead>
                  <tr>
                    <th>{{item.detail.FoodContentData.Details[0].FoodName}}</th>
                    <th>{{item.detail.FoodContentData.Details[0].Content}}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(food, foodIndex) in item.detail.FoodContentData.Details" v-bind:key="food.FoodName" v-if="foodIndex > 0">
                    <td>{{food.FoodName}}</td>
                    <td>{{food.Content}}</td>
                  </tr>
                  </tbody>
                </table>
                <div class="info" v-if="item.detail.FoodContentData != '' && item.detail.FoodContentData.Details.length == 1 && item.detail.FoodContentData.Details[0].FoodName == ''">{{item.detail.FoodContentData.Details[0].Content}}</div>
              </div>
            </div>
          </section>
        </div>
        <div v-else>
          <section class="page-info-item-detail">
            <div class="test-result">
              <div class="title">
                <img class="icon" src="../../../assets/genssential/zhishi.png">
                <h5>相关知识</h5>
              </div>
              <div class="info-list">
                <h4 class="title">{{item.detail.KnowledgeData.Value[0].Title}}</h4>
                <img :src="imgSrc(item.detail.KnowledgeData.Value[0].ImageName)" v-if="item.detail.KnowledgeData.Value[0].ImageName != ''">
                <div class="info" v-if="item.detail.KnowledgeData.Value[0].Desc != ''">{{item.detail.KnowledgeData.Value[0].Desc}}</div>
                <div v-for="(content, index1) in item.detail.KnowledgeData.Value[0].Content" v-bind:key="index1" v-if="index1 < 2">
                  <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                  <div class="info" v-html="content.Details"></div>
                </div>
              </div>
              <div class="info-list">
                <h4 class="title">{{item.detail.KnowledgeData.Value[1].Title}}</h4>
                <img :src="imgSrc(item.detail.KnowledgeData.Value[1].ImageName)" v-if="item.detail.KnowledgeData.Value[1].ImageName != ''">
                <div class="info" v-if="item.detail.KnowledgeData.Value[1].Desc != ''">{{item.detail.KnowledgeData.Value[1].Desc}}</div>
                <div v-for="(content, index1) in item.detail.KnowledgeData.Value[1].Content" v-bind:key="index1" v-if="index1 < 2">
                  <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                  <div class="info" v-html="content.Details"></div>
                </div>
              </div>
            </div>
          </section>
          <section class="page-info-item-detail" v-if="item.detail.KnowledgeData.Value.length >= 3">
            <div class="test-result">
              <div class="info-list">
                <h4 class="title">{{item.detail.KnowledgeData.Value[2].Title}}</h4>
                <img :src="imgSrc(item.detail.KnowledgeData.Value[2].ImageName)" v-if="item.detail.KnowledgeData.Value[2].ImageName != ''">
                <div class="info" v-if="item.detail.KnowledgeData.Value[2].Desc != ''">{{item.detail.KnowledgeData.Value[2].Desc}}</div>
                <div v-for="(content, index1) in item.detail.KnowledgeData.Value[2].Content" v-bind:key="index1">
                  <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                  <div class="info" v-html="content.Details"></div>
                </div>
              </div>
            </div>
            <div class="test-result" v-if="item.detail.KnowledgeData.Value.length >= 4">
              <div class="info-list">
                <h4 class="title">{{item.detail.KnowledgeData.Value[3].Title}}</h4>
                <img :src="imgSrc(item.detail.KnowledgeData.Value[3].ImageName)" v-if="item.detail.KnowledgeData.Value[3].ImageName != ''">
                <div class="info" v-if="item.detail.KnowledgeData.Value[3].Desc != ''">{{item.detail.KnowledgeData.Value[3].Desc}}</div>
                <div v-for="(content, index1) in item.detail.KnowledgeData.Value[3].Content" v-bind:key="index1">
                  <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                  <div class="info" v-html="content.Details"></div>
                </div>
              </div>
            </div>
          </section>
          <div v-if="item.detail.KnowledgeData.Value.length >= 5">
            <div v-if="JSON.stringify(item.detail.KnowledgeData.Value[4]).length < 430">
              <section class="page-info-item-detail">
                <div class="test-result">
                  <div class="info-list">
                    <h4 class="title">{{item.detail.KnowledgeData.Value[4].Title}}</h4>
                    <img :src="imgSrc(item.detail.KnowledgeData.Value[4].ImageName)" v-if="item.detail.KnowledgeData.Value[4].ImageName != ''">
                    <div class="info" v-if="item.detail.KnowledgeData.Value[4].Desc != ''">{{item.detail.KnowledgeData.Value[4].Desc}}</div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[4].Content" v-bind:key="index1">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                  </div>
                </div>
              </section>
              <section class="page-info-item-detail" v-if="item.detail.KnowledgeData.Value.length >= 6">
                <div class="test-result">
                  <div class="info-list">
                    <h4 class="title">{{item.detail.KnowledgeData.Value[5].Title}}</h4>
                    <img :src="imgSrc(item.detail.KnowledgeData.Value[5].ImageName)" v-if="item.detail.KnowledgeData.Value[5].ImageName != ''">
                    <div class="info" v-if="item.detail.KnowledgeData.Value[5].Desc != ''">{{item.detail.KnowledgeData.Value[5].Desc}}</div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[5].Content" v-bind:key="index1">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                  </div>
                </div>
                <div class="test-result" v-if="item.detail.KnowledgeData.Value.length >= 7">
                  <div class="info-list">
                    <h4 class="title">{{item.detail.KnowledgeData.Value[6].Title}}</h4>
                    <img :src="imgSrc(item.detail.KnowledgeData.Value[6].ImageName)" v-if="item.detail.KnowledgeData.Value[6].ImageName != ''">
                    <div class="info" v-if="item.detail.KnowledgeData.Value[6].Desc != ''">{{item.detail.KnowledgeData.Value[6].Desc}}</div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[6].Content" v-bind:key="index1">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                  </div>
                </div>
              </section>
              <section class="page-info-item-detail" v-if="item.detail.KnowledgeData.Value.length >= 8">
                <div class="test-result">
                  <div class="info-list">
                    <h4 class="title">{{item.detail.KnowledgeData.Value[7].Title}}</h4>
                    <img :src="imgSrc(item.detail.KnowledgeData.Value[7].ImageName)" v-if="item.detail.KnowledgeData.Value[7].ImageName != ''">
                    <div class="info" v-if="item.detail.KnowledgeData.Value[7].Desc != ''">{{item.detail.KnowledgeData.Value[7].Desc}}</div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[7].Content" v-bind:key="index1">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div v-else>
              <section class="page-info-item-detail">
                <div class="test-result">
                  <div class="info-list">
                    <h4 class="title">{{item.detail.KnowledgeData.Value[4].Title}}</h4>
                    <img :src="imgSrc(item.detail.KnowledgeData.Value[4].ImageName)" v-if="item.detail.KnowledgeData.Value[4].ImageName != ''">
                    <div class="info" v-if="item.detail.KnowledgeData.Value[4].Desc != ''">{{item.detail.KnowledgeData.Value[4].Desc}}</div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[4].Content" v-bind:key="index1" v-if="item.detail.KnowledgeData.Value[4].Desc != '' && index1 <= 2">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[4].Content" v-bind:key="index1" v-if="item.detail.KnowledgeData.Value[4].Desc == '' && index1 <= 3">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                  </div>
                </div>
              </section>
              <section class="page-info-item-detail">
                <div class="test-result">
                  <div class="info-list">
                    <h4 class="title">{{item.detail.KnowledgeData.Value[4].Title}}</h4>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[4].Content" v-bind:key="index1" v-if="item.detail.KnowledgeData.Value[4].Desc != '' && index1 > 2">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[4].Content" v-bind:key="index1" v-if="item.detail.KnowledgeData.Value[4].Desc == '' && index1 > 3">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                  </div>
                </div>
                <div class="test-result" v-if="item.detail.KnowledgeData.Value.length >= 6">
                  <div class="info-list">
                    <h4 class="title">{{item.detail.KnowledgeData.Value[5].Title}}</h4>
                    <img :src="imgSrc(item.detail.KnowledgeData.Value[5].ImageName)" v-if="item.detail.KnowledgeData.Value[5].ImageName != ''">
                    <div class="info" v-if="item.detail.KnowledgeData.Value[5].Desc != ''">{{item.detail.KnowledgeData.Value[5].Desc}}</div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[5].Content" v-bind:key="index1">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                  </div>
                </div>
                <div class="test-result" v-if="item.detail.KnowledgeData.Value.length >= 7 && item.detail.KnowledgeData.Value[4].Content.length < 7 && JSON.stringify(item.detail.KnowledgeData.Value[5].Content).length <= 300">
                  <div class="info-list">
                    <h4 class="title">{{item.detail.KnowledgeData.Value[6].Title}}</h4>
                    <img :src="imgSrc(item.detail.KnowledgeData.Value[6].ImageName)" v-if="item.detail.KnowledgeData.Value[6].ImageName != ''">
                    <div class="info" v-if="item.detail.KnowledgeData.Value[6].Desc != ''">{{item.detail.KnowledgeData.Value[6].Desc}}</div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[6].Content" v-bind:key="index1">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                  </div>
                </div>
              </section>
              <section class="page-info-item-detail" v-if="item.detail.KnowledgeData.Value.length >= 8">
                <div class="test-result" v-if="item.detail.KnowledgeData.Value[4].Content.length >= 7 || JSON.stringify(item.detail.KnowledgeData.Value[5].Content).length > 300">
                  <div class="info-list">
                    <h4 class="title">{{item.detail.KnowledgeData.Value[6].Title}}</h4>
                    <img :src="imgSrc(item.detail.KnowledgeData.Value[6].ImageName)" v-if="item.detail.KnowledgeData.Value[6].ImageName != ''">
                    <div class="info" v-if="item.detail.KnowledgeData.Value[6].Desc != ''">{{item.detail.KnowledgeData.Value[6].Desc}}</div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[6].Content" v-bind:key="index1">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                  </div>
                </div>
                <div class="test-result">
                  <div class="info-list">
                    <h4 class="title">{{item.detail.KnowledgeData.Value[7].Title}}</h4>
                    <img :src="imgSrc(item.detail.KnowledgeData.Value[7].ImageName)" v-if="item.detail.KnowledgeData.Value[7].ImageName != ''">
                    <div class="info" v-if="item.detail.KnowledgeData.Value[7].Desc != ''">{{item.detail.KnowledgeData.Value[7].Desc}}</div>
                    <div v-for="(content, index1) in item.detail.KnowledgeData.Value[7].Content" v-bind:key="index1">
                      <h5 v-if="content.SubTitle !==''" class="sub-title">{{content.SubTitle}}</h5>
                      <div class="info" v-html="content.Details"></div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <section class="page-info-item-detail">
            <div class="test-result">
              <div class="title">
                <img class="icon" src="../../../assets/genssential/jianyi.png">
                <h5>给您的建议</h5>
              </div>
              <div class="info">{{item.detail.Suggest}}</div>
              <div  v-if="item.detail.FoodContentData != ''">
                <h4 class="sub-title">饮食 :</h4>
                <div class="info" v-html="item.detail.SuggestFoods"></div>
                <h4 class="sub-title" v-if="item.detail.FoodContentData != ''">{{item.detail.FoodContentData.Title}}<span v-if="item.detail.FoodContentData.Unit != ''">({{item.detail.FoodContentData.Unit}})</span></h4>
                <table v-if="item.detail.FoodContentData != '' && item.detail.FoodContentData.Details.length > 1 && item.detail.FoodContentData.Details[0].FoodName != ''">
                  <thead>
                  <tr>
                    <th>{{item.detail.FoodContentData.Details[0].FoodName}}</th>
                    <th>{{item.detail.FoodContentData.Details[0].Content}}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(food, foodIndex) in item.detail.FoodContentData.Details" v-bind:key="food.FoodName" v-if="foodIndex > 0">
                    <td>{{food.FoodName}}</td>
                    <td>{{food.Content}}</td>
                  </tr>
                  </tbody>
                </table>
                <div class="info" v-if="item.detail.FoodContentData != '' && item.detail.FoodContentData.Details.length == 1 && item.detail.FoodContentData.Details[0].FoodName == ''">{{item.detail.FoodContentData.Details[0].Content}}</div>
              </div>
            </div>
          </section>
        </div>
        <section class="page-info-item-detail page-info-gene" v-for="gene in item.detail.Sites" v-bind:key="gene.Guid">
          <div class="test-result">
            <div class="title">
              <img class="icon" src="../../../assets/genssential/jieguo.png">
              <h4>我的基因位点</h4>
            </div>
            <div class="gene-info">
              <span class="gene-name">{{gene.ChromosomeNo}}号染色体&nbsp;&nbsp;基因:{{gene.GeneName}}</span>
              <table>
                <thead>
                <tr>
                  <th>位点</th>
                  <th>基因型</th>
                  <th>结果</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{gene.RSID}}</td>
                  <td>{{gene.GeneType}}</td>
                  <td>{{gene.Result}}</td>
                </tr>
                </tbody>
              </table>
              <h4 class="sub-title">基因功能</h4>
              <p>{{gene.GeneDesc}}</p>
              <div class="gene-imgs">
                <div class="gene-img-content" v-for="imgNo in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]" v-bind:key="imgNo">
                  <img :src="imgSrc(imgNo + (gene.ChromosomeNo == imgNo ? '-q':'-g'), '.png')">
                  <span>{{imgNo}}</span>
                </div>
              </div>
            </div>
            <div class="references">
              <p class="title">参考文献</p>
              <p>{{gene.References}}</p>
            </div>
          </div>
        </section>
      </div>
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
    this.chartSettings = {
      radius: [40, 60],
      dataType: 'percent',
      label: {
        formatter: '{d}%\n{b}',
        textStyle: {
          align: 'center'
        }
      }
    }
    this.chartExtend = {
      series (v) {
        v.forEach(i => {
          i.barWidth = 10
          i.center = ['50%', '50%']
        })
        return v
      },
      tooltip (v) {
        v.trigger = 'none'
        return v
      },
      title: {
        text: 'Genessential',
        x: 'center',
        y: 'middle',
        textStyle: {
          color: '#717171',
          fontSize: 12
        }
      },
      legend: {
        x: 'center',
        y: 'bottom'
      }
    }
    return {
      htmlTitle: '营养健康',
      data: {},
      KnowledgeDataIndex: 0
    }
  },
  methods: {
    getInfo: function () {
      this.axios.get('customize/genessential', {
        params: {
          sampleNo: this.$route.params.sampleNo
        }
      }).then(res => {
        let datas = res.data
        let that = this
        res.data.ReportResult.map(function (items, indexs, lists) {
          items.Items.map(function (item, index, list) {
            let chartData = {}
            chartData.columns = ['key', 'value']
            chartData.rows = []
            let percents = item.detail.LevelPercentages.split(',')
            let names = item.detail.LevelNames.split(',')
            for (let i = 0; i < percents.length; i++) {
              chartData.rows.push({
                'key': names[i],
                'value': percents[i]
              })
            }
            item.chartData = chartData
            if (index === list.length - 1) {
              if (items.GroupName.indexOf('肤质') >= 0) {
                datas.fuzhi = items
              } else if (items.GroupName.indexOf('美肤营养') >= 0) {
                datas.yingyang = items
              }
              if (indexs === lists.length - 1) {
                that.data = datas
              }
              console.log(that.data)
            }
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    imgSrc (id, extend) {
      return require(`@/assets/genssential/` + id + (extend === undefined ? '.jpg' : extend))
    }
  },
  created () {
    this.getInfo()
  },
  updated () {
    setTimeout(_ => {
      this.$nextTick(() => {
        for (let i = 0; i < this.$refs.chart.length; i++) {
          this.$refs.chart[i].echarts.dispatchAction({
            type: 'pieSelect',
            name: this.$refs.chart[i].$attrs['data-select']
          })
        }
      })
    }, 0)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .container {
    background: #f1f1f1;
    color: #7F7F7F;
    font-family: "Helvetica Neue", Helvetica, "Source Han Sans CN", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
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
    margin-bottom: 10px;
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
    padding: 100px 80px;
    height: calc(1123px - 200px);
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
        line-height: 32px;
        text-align: justify;
      }
    }
  }
  .page-info-item,.page-info-item-detail {
    background: #fff;
    .header {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      > img {
        width: 100%;
        z-index: 0;
        vertical-align: top;
      }
      .title-info {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        z-index: 1;
        .title {
          margin-bottom: 10px;
          text-align: center;
          font-size: 28px;
        }
        .sub-title {
          margin-top: 0;
          font-size: 20px;
          font-weight: 400;
        }
      }
    }
    .test-result {
      position: relative;
      margin-top: 240px;
      .title {
        margin-top: 20px;
        position: relative;
        img {
          position: absolute;
          top: 0;
          left: 0;
        }
        h4 {
          margin: 10px 0px;
          padding-left: 50px;
          font-size: 20px;
          font-weight: 400;
          line-height: 44px;
          color: #333333;
        }
        h5 {
          margin: 0;
          padding-left: 30px;
          font-size: 18px;
          font-weight: 400;
          line-height: 28px;
          color: #333333;
        }
      }
      .sub-title {
        font-size: 16px;
        margin: 15px 0px;
        font-weight: 400;
        color: #333333;
      }
      p {
        padding-left: 50px;
        font-size: 18px;
      }
      .result-label {
        margin: 0 auto;
        width: 300px;
        padding: 10px;
        background: #fc7e31;
        color: #fff;
        font-size: 22px;
        text-align: center;
        border-radius: 30px;
      }
      table {
        margin-top: 20px;
        margin-left: 50px;
        width: 560px;
        border-collapse: collapse;
        thead>tr>th,
        tbody>tr>td {
          padding: 6px 20px;
          border: 1px solid #efefef;
          text-align: center;
          font-size: 14px;
          color: #535353;
        }
        thead>tr>th {
          font-size: 16px;
        }
        tbody>tr>td {
          color: #535353;
        }
      }
      .population-dis {
        position: relative;
        height: 240px;
        h5 {
          position: absolute;
          margin: 0;
          width: 310px;
          top: 50%;
          left: 10px;
          transform: translate(0, -50%);
          text-align: center;
          font-size: 18px;
          font-weight: 400;
          .percent {
            display: block;
            color: #fc7e31;
            font-size: 24px;
            font-weight: 500;
          }
        }
        .ve-ring {
          position: absolute !important;
          top: 0;
          right: 0;
          height: 200px !important;
        }
      }
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
  .page-info-item-detail {
    padding: 40px 80px;
    height: calc(1123px - 80px);
    .test-result {
      margin-top: 0;
      .info {
        text-align: justify;
        margin: 10px 0px;
        font-size: 16px;
        padding-left: 0;
        text-indent: 2em;
      }
    }
    .info-list {
      img {
        margin-top: 10px;
        width: 100%;
      }
      h4 {
        margin: 15px 0px;
        font-size: 18px;
        line-height: 30px;
        font-weight: 400;
        color: #333333;
      }
      h5 {
        display: inline-block;
        margin: 10px 0px;
        padding-left: 20px;
        font-size: 18px;
        line-height: 20px;
        border-left: 4px solid #ff6608;
      }
    }
    .chengfen-labels {
      span {
        display: inline-block;
        line-height: 40px;
        padding: 0 20px;
        background: #ec9b92;
        border-radius: 48px;
        color: #fff;
        font-size: 14px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .page-info-gene {
    .gene-info {
      position: relative;
      margin-top: 60px;
      box-sizing: border-box;
      border: 2px solid #efefef;
      border-radius: 26px;
      padding: 20px;
      table {
        margin: 20px auto;
      }
      h4 {
        padding-left: 10px;
      }
      p {
        padding-left: 10px;
        font-size: 16px;
      }
    }
    .gene-name {
      position: absolute;
      left: 50%;
      top: -22px;
      width: fit-content;
      height: 40px;
      padding: 0 20px;
      transform: translate(-50%, 0);
      border: 2px solid #ff6609;
      font-size: 20px;
      color: #ff6609;
      line-height: 38px;
      font-weight: 500;
      border-radius: 26rem;
      background: #fff;
    }
    .gene-imgs {
      position: relative;
      width: auto;
      height: 180px;
      margin-left: 20px;
      margin-bottom: 10px;
      .gene-img-content {
        position: relative;
        margin-right: 14px;
        display: inline-block;
        span {
          position: absolute;
          bottom: -15px;
          left: 0px;
          font-size: 12px;
        }
      }
    }
    .references {
      margin-top: 20px;
      p {
        padding-left: 0;
        font-size: 14px;
        &.title {
          font-size: 16px;
        }
      }
    }
  }
  @media print {
    .el-button {
      display: none;
    }
  }
</style>
