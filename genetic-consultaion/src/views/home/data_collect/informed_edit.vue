<template>
  <div class="pc-page pc-informed-edit">
    <div class="user-container">
      <div class="pc-page-title informed-title">
        <div>
          <h2>编辑知情同意</h2>
          <span class="desc">核对受检者信息、送检信息与原件内容</span>
        </div>
        <div class="page-meta" v-if="informedContent.sampleCode || informedContent.truename">
          <span v-if="informedContent.truename">{{ informedContent.truename }}</span>
          <span v-if="informedContent.sampleCode" class="num">{{ informedContent.sampleCode }}</span>
        </div>
      </div>

      <div
        class="workbench-grid"
        :class="{ 'is-preview-only': !canEditInformed }"
        v-loading="loading"
        element-loading-text="加载知情同意">
        <div class="form-column" v-if="canEditInformed">
          <el-form
            v-if="groupId !== 7"
            ref="informedForm"
            :model="informedContent"
            label-width="112px"
            size="mini"
            class="edit-form">
            <section class="form-section">
              <div class="section-header">
                <h4>基本信息</h4>
                <el-button type="text" size="small" @click="$router.push({name: 'InformedAll', params: { sampleNo: $route.query.sampleCode, orderId: $route.query.orderId }})">查看病理信息</el-button>
              </div>
              <el-form-item label="姓名">
                <el-col :span="9">
                  <el-input v-model="informedContent.truename"></el-input>
                </el-col>
                <el-col class="line field-inline-label" :span="3">性别</el-col>
                <el-col :span="12">
                  <el-radio-group v-model="informedContent.sex">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-col>
              </el-form-item>
              <el-form-item label="出生日期">
                <el-col :span="9">
                  <el-date-picker
                    v-model="informedContent.dateOfBirth"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-col>
                <el-col class="line field-inline-label" :span="3">年龄</el-col>
                <el-col :span="12">
                  <el-input v-model="informedContent.age"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="地址">
                <el-cascader class="width-100-p"
                             :options="regionData"
                             v-model="areaInfo"
                             @change="addressHandleChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="informedContent.cellphone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="informedContent.email"></el-input>
              </el-form-item>
              <el-form-item label="发送短信">
                <el-radio-group v-model="smsStatus">
                  <el-radio @click.native.prevent="updateSmsStatus(0)" :label="0">发送</el-radio>
                  <el-radio @click.native.prevent="updateSmsStatus(1)" :label="1">不发送</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="证件类型">
                <el-col :span="9">
                  <el-select v-model="informedContent.idType" filterable placeholder="请选择">
                    <el-option
                      v-for="item in idType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col class="line field-inline-label" :span="3">号码</el-col>
                <el-col :span="12">
                  <el-input v-model="informedContent.idCode"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="informedContent.address"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="informedContent.remark"></el-input>
              </el-form-item>
            </section>

            <section class="form-section">
              <div class="section-header">
                <h4>送检信息</h4>
              </div>
              <el-form-item label="订单编号">
                <el-input v-model="informedContent.orderNo"></el-input>
              </el-form-item>
              <el-form-item label="送检项目">
                <el-select class="width-100-p" v-model="informedContent.solutionId" filterable placeholder="请选择">
                  <el-option
                    v-for="item in projects"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="送检医院">
                <el-autocomplete
                  class="inline-input"
                  v-model="informedContent.hospitalName"
                  :fetch-suggestions="hospitalQuerySearch"
                  placeholder="请输入内容"
                  :trigger-on-focus="false"
                  @select="hospitalHandleSelect"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="送检科室">
                <el-select class="width-100-p" v-model="informedContent.deptId" filterable placeholder="请选择">
                  <el-option
                    v-for="item in depts"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="诊室">
                <el-input v-model="informedContent.room"></el-input>
              </el-form-item>
              <el-form-item label="送检医生">
                <el-input v-model="informedContent.doctor"></el-input>
              </el-form-item>
              <el-form-item label="条码编号">
                <el-input v-model="informedContent.sampleCode"></el-input>
              </el-form-item>
              <el-form-item label="实验室样本编号">
                <el-input v-model="informedContent.labSampleCode"></el-input>
              </el-form-item>
              <el-form-item label="样本类型">
                <el-input v-model="informedContent.sampleType"></el-input>
              </el-form-item>
              <el-form-item label="采样日期">
                <el-date-picker
                  v-model="informedContent.samplingDate"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </section>

            <section class="form-section" v-if="groupId !== 7">
              <div class="section-header">
                <h4>病理信息</h4>
              </div>
              <el-form-item label="疾病类型">
                <el-select class="width-100-p" v-model="informedContent.cancerType" filterable placeholder="请选择">
                  <el-option
                    v-for="item in diseaseList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="其他癌种" v-if="informedContent.cancerType == '其他癌种'">
                <el-input v-model="otherDisease"></el-input>
              </el-form-item>
              <el-form-item label="组织分型">
                <el-select class="width-100-p" v-model="zuzhifenxing" filterable placeholder="请选择">
                  <el-option
                    v-for="item in zuzhifenxingList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="FIGO分期">
                <el-select class="width-100-p" v-model="figo" filterable placeholder="请选择">
                  <el-option
                    v-for="item in figoList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="治疗阶段">
                <el-select class="width-100-p" v-model="jieduan" filterable placeholder="请选择">
                  <el-option
                    v-for="item in jieduanList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分子分型">
                <el-select class="width-100-p" v-model="fenzifenxing" filterable placeholder="请选择">
                  <el-option
                    v-for="item in fenzifenxingList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="TNM分期">
                <el-select class="width-100-p" v-model="tnm" filterable placeholder="请选择">
                  <el-option
                    v-for="item in figoList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="病程">
                <el-select class="width-100-p" v-model="bingcheng" filterable placeholder="请选择">
                  <el-option
                    v-for="item in bingchengList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否为复发检测">
                <el-radio-group v-model="informedContent.isRelapse">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="肿瘤家族史(兼容旧版)">
                <el-input type="textarea" v-model="familyTumorHistory"></el-input>
              </el-form-item>
            </section>

            <section class="form-section">
              <div class="section-header">
                <h4>肿瘤遗传史</h4>
              </div>
              <el-form-item label="患癌亲属">
                <el-radio-group v-model="hasFamilyTumorHistory">
                  <el-radio label="有">有</el-radio>
                  <el-radio label="无">无</el-radio>
                </el-radio-group>
              </el-form-item>

              <div v-if="hasFamilyTumorHistory == '有'">
                <div class="cell-group" v-for="family in familyHistory">
                  <el-form-item label="与患者关系">
                    <el-input v-model="family.familyTumorRelation"></el-input>
                  </el-form-item>
                  <el-form-item label="亲属何种癌种">
                    <el-input v-model="family.familyTumorHistory"></el-input>
                  </el-form-item>
                  <el-form-item label="发病年龄">
                    <el-input v-model="family.familyTumorAge"></el-input>
                  </el-form-item>
                  <el-divider></el-divider>
                </div>
                <el-button type="text" @click="addFamilyHistory">添加一个人</el-button>
              </div>
            </section>

            <section class="form-section">
              <div class="section-header">
                <h4>个人健康状态</h4>
              </div>
              <el-form-item label="吸烟史">
                <el-radio-group v-model="personalHealthy.smoking">
                  <el-radio label="偶尔">偶尔</el-radio>
                  <el-radio label="经常">经常</el-radio>
                  <el-radio label="不抽烟">不抽烟</el-radio>
                  <el-radio label="已戒烟">已戒烟</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="饮酒史">
                <el-radio-group v-model="personalHealthy.drinking">
                  <el-radio label="少量">少量</el-radio>
                  <el-radio label="经常">经常</el-radio>
                  <el-radio label="不饮酒">不饮酒</el-radio>
                  <el-radio label="已戒酒">已戒酒</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="睡眠状况">
                <el-checkbox-group v-model="personalHealthy.sleeping">
                  <el-checkbox label="长期熬夜"></el-checkbox>
                  <el-checkbox label="长期失眠"></el-checkbox>
                  <el-checkbox label="长期压力"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="血糖血压">
                <el-checkbox-group v-model="personalHealthy.blood_suger">
                  <el-checkbox label="高血糖"></el-checkbox>
                  <el-checkbox label="高血压"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </section>

            <section class="form-section">
              <div class="section-header">
                <h4>既往史</h4>
              </div>
              <el-form-item label="肺">
                <el-checkbox-group v-model="diseaseHistory.lung">
                  <el-checkbox label="肺结节"></el-checkbox>
                  <el-checkbox label="肺结核"></el-checkbox>
                  <el-checkbox label="长期石棉接触史"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="胃">
                <el-checkbox-group v-model="diseaseHistory.stomach">
                  <el-checkbox label="胃炎"></el-checkbox>
                  <el-checkbox label="胃息肉"></el-checkbox>
                  <el-checkbox label="幽门螺旋杆菌感染"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="结直肠">
                <el-checkbox-group v-model="diseaseHistory.colorectal">
                  <el-checkbox label="肠炎"></el-checkbox>
                  <el-checkbox label="肠息肉"></el-checkbox>
                  <el-checkbox label="大便改变（2周以上腹泻，大便变细，便血、粘液便等）"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="肝">
                <el-checkbox-group v-model="diseaseHistory.liver">
                  <el-checkbox label="乙肝感染"></el-checkbox>
                  <el-checkbox label="丙肝感染"></el-checkbox>
                  <el-checkbox label="脂肪肝"></el-checkbox>
                  <el-checkbox label="肝硬化"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="食管">
                <el-checkbox-group v-model="diseaseHistory.esophagus">
                  <el-checkbox label="高盐食物"></el-checkbox>
                  <el-checkbox label="酸返流"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="胰腺">
                <el-checkbox-group v-model="diseaseHistory.pancreas">
                  <el-checkbox label="胰腺炎"></el-checkbox>
                  <el-checkbox label="糖尿病"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="乳腺">
                <el-checkbox-group v-model="diseaseHistory.breast">
                  <el-checkbox label="乳腺纤维瘤"></el-checkbox>
                  <el-checkbox label="乳腺小叶增生"></el-checkbox>
                  <el-checkbox label="乳腺结节／包块"></el-checkbox>
                  <el-checkbox label="BRCA基因突变"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="卵巢">
                <el-checkbox-group v-model="diseaseHistory.ovary">
                  <el-checkbox label="卵巢囊肿"></el-checkbox>
                  <el-checkbox label="BRCA基因突变"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </section>

            <section class="form-section">
              <div class="section-header">
                <h4>用药史 <span class="section-hint">近 14 天如服用药物或保健品请注明</span></h4>
              </div>
              <el-form-item label="保健品名称">
                <el-input v-model="drugHistory.drugHealth"></el-input>
              </el-form-item>
              <el-form-item label="药物名称">
                <el-input v-model="drugHistory.drugTreatment"></el-input>
              </el-form-item>
            </section>

            <section class="form-section form-section--muted">
              <div class="section-header">
                <h4>旧版兼容信息 <span class="section-hint">用于历史知情字段回填</span></h4>
              </div>
              <el-form-item label="癌种(旧版)">
                <el-input v-model="normalFamilyTumorHistory"></el-input>
              </el-form-item>
              <el-form-item label="患者关系(旧版)">
                <el-input v-model="familyTumorRelation"></el-input>
              </el-form-item>
              <el-form-item label="发病年龄(旧版)">
                <el-input v-model="familyTumorAge"></el-input>
              </el-form-item>
              <div class="subsection-title">个人史</div>
              <el-form-item label="吸烟史">
                <el-radio-group v-model="diseaseHistory.smoking">
                  <el-radio label="有">有</el-radio>
                  <el-radio label="无">无</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="饮酒史">
                <el-radio-group v-model="diseaseHistory.drinking">
                  <el-radio label="有">有</el-radio>
                  <el-radio label="无">无</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="胃炎">
                <el-radio-group v-model="diseaseHistory.gastritis">
                  <el-radio label="有">有</el-radio>
                  <el-radio label="无">无</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="肠炎">
                <el-radio-group v-model="diseaseHistory.enteritis">
                  <el-radio label="有">有</el-radio>
                  <el-radio label="无">无</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="幽门螺旋杆菌感染">
                <el-radio-group v-model="diseaseHistory.hp">
                  <el-radio label="有">有</el-radio>
                  <el-radio label="无">无</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="乙肝感染">
                <el-radio-group v-model="diseaseHistory.hepatitisB">
                  <el-radio label="有">有</el-radio>
                  <el-radio label="无">无</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="是否长期接触毒害物质">
                <el-checkbox-group v-model="diseaseHistory.poison">
                  <el-checkbox label="氡"></el-checkbox>
                  <el-checkbox label="铀"></el-checkbox>
                  <el-checkbox label="镍"></el-checkbox>
                  <el-checkbox label="铬"></el-checkbox>
                  <el-checkbox label="铍"></el-checkbox>
                  <el-checkbox label="石棉"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </section>
          </el-form>

          <section class="form-section pr-section" v-else-if="groupId === 7">
            <div class="section-header">
              <h4>病理报告信息</h4>
            </div>
            <prEdit :data="{
              orderId: $route.query.orderId,
              solutionId: $route.query.solutionId,
              fileId: $route.query.fileId,
              sampleCode: $route.query.sampleCode
            }"></prEdit>
          </section>
        </div>

        <aside class="preview-column">
          <div class="preview-panel">
            <div class="section-header">
              <h4>知情同意原件</h4>
            </div>
            <div class="doc-frame" v-if="imagePath">
              <object :data="imagePath" type="application/pdf" v-if="imagePath.indexOf('.pdf') > -1">
                <embed :src="imagePath">
              </object>
              <img :src="imagePath" v-else class="doc-img">
            </div>
            <div class="doc-empty" v-else>
              <p class="empty-title">尚无原件</p>
              <p class="empty-hint">客户未上传或文件正在加载</p>
            </div>
          </div>
        </aside>
      </div>

      <div class="footer-btn" v-if="canEditInformed">
        <div class="footer-summary">
          <span>编辑完成后请保存，原件不可辨认时标记为不可读</span>
        </div>
        <div class="footer-actions">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button size="small" @click="unread" :loading="submitting">图形不可读</el-button>
          <el-button size="small" type="primary" @click="edit" :loading="submitting">保存信息</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import prEdit from './components/pr-edit'
export default {
  name: 'EditInformed',
  components: {prEdit},
  data () {
    return {
      groupId:0,
      smsStatus: 1,
      informedContent: {
        smsStatus: 1
      },
      projects: [],
      hospitals: [],
      depts: [],
      idType: [
        {'id': 0, 'name': '身份证'},
        {'id': 1, 'name': '军官证'},
        {'id': 2, 'name': '通行证'},
        {'id': 3, 'name': '社保卡'}
      ],
      imagePath: '',
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode,
      role: window.localStorage.role,
      relation: '',
      relationList: ['本人','父母','妻子','丈夫','子女','侄子','孙子','其他'],

      disease: '',
      diseaseList: ['卵巢癌', '乳腺癌', '前列腺癌', '胰腺癌', '子宫内膜癌', '输卵管癌', '其他癌种', '表型正常'],

      zuzhifenxing: '',
      zuzhifenxingList: ['上皮细胞肿瘤', '性索-间质肿瘤', '生殖细胞肿瘤'],

      figo: '',
      figoList: ['I期', 'II期', 'III期', 'IV期'],

      jieduan: '',
      jieduanList: ['一线', '二线', '三线', '其他'],

      fenzifenxing: '',
      fenzifenxingList: ['HER2阳性', 'HER2阴性', 'ER 或 PR阳性', '三阴性'],

      bingcheng: '',
      bingchengList: ['局限期前列腺癌', '非转移性激素抵抗性前列腺癌',
        '转移性前列腺癌激素敏感阶段', '转移性前列腺癌激素抵抗阶段'],

      otherDisease: '',
      tnm: '',
      personHistory: {},
      moreInfo: [],
      familyHistory: [{
        familyTumorRelation: '',
        familyTumorHistory: '',
        familyTumorAge: '',
      }],

      hasFamilyTumorHistory:  null,
      familyTumorHistory:'',
      normalFamilyTumorHistory:'',
      familyTumorRelation:'',
      familyTumorAge:'',
      personalHealthy: {
        sleeping: [],
        blood_suger: [],
      },
      diseaseHistory: {
        poison: [],
        breast: [],
        ovary: [],
        lung: [],
        stomach: [],
        colorectal: [],
        liver: [],
        esophagus: [],
        pancreas: [],
      },
      drugHistory: {},
      loading: false,
      submitting: false
    }
  },
  methods: {
    _initData () {
      this.loading = true
      const informedPromise = this.axios.get('informed/' + this.$route.query.informedId).then(res => {
        this.informedContent = res.data || {}
        if (res.data && res.data.tid !== undefined) {
          this.informedContent.orderNo = res.data.tid
        }
        if (this.informedContent.smsStatus === undefined) {
          this.informedContent.smsStatus = 1
          this.smsStatus = 1
        }
        if (this.informedContent.moreInfo) {
          this.moreInfo = JSON.parse(this.informedContent.moreInfo)
          if (this.moreInfo.length > 0) {
            this.moreInfo.forEach(item => {
              if (item.key == '组织分型') {
                this.zuzhifenxing = item.value
              } else if (item.key == 'FIGO分期') {
                this.figo = item.value
              } else if (item.key == '治疗阶段') {
                this.jieduan = item.value
              } else if (item.key == '分子分型') {
                this.fenzifenxing = item.value
              } else if (item.key == 'TNM分期') {
                this.tnm = item.value
              } else if (item.key == '病程') {
                this.bingcheng = item.value
              } else if (item.key == '癌种名称') {
                this.otherDisease = item.value
              } else if (item.key == '肿瘤家族史') {
                this.familyTumorHistory = item.value
              } else if (item.key == '家族史') {
                let familyHistory = item.value
                familyHistory.forEach(item1 => {
                  if (item1.key == '是否有家族史') {
                    this.hasFamilyTumorHistory = item1.value
                  }
                  if (item1.key == '亲属何种癌种') {
                    this.normalFamilyTumorHistory = item1.value
                  }
                  if (item1.key == '与家属关系' || item1.key == '与受检者关系') {
                    this.familyTumorRelation = item1.value
                  }
                  if (item1.key == '发病年龄') {
                    this.familyTumorAge = item1.value
                  }
                })
              } else if (item.key == '个人史') {
                let personHistory = item.value
                personHistory.forEach(item1 => {
                  if (item1.key == '吸烟史') {
                    this.diseaseHistory.smoking = item1.value
                  }
                  if (item1.key == '饮酒史') {
                    this.diseaseHistory.drinking = item1.value
                  }
                  if (item1.key == '胃炎') {
                    this.diseaseHistory.gastritis = item1.value
                  }
                  if (item1.key == '肠炎') {
                    this.diseaseHistory.enteritis = item1.value
                  }
                  if (item1.key == '幽门螺旋杆菌感染') {
                    this.diseaseHistory.hp = item1.value
                  }
                  if (item1.key == '乙肝感染') {
                    this.diseaseHistory.hepatitisB = item1.value
                  }
                  if (item1.key == '是否长期接触毒害物质') {
                    this.diseaseHistory.poison = item1.value
                  }
                })
              } else if (item.key == '肿瘤遗传史') {
                this.familyHistory = []
                for (let _familyJson of item.value) {

                  if (Object.prototype.toString.call(_familyJson) === '[object Array]') {
                    let _family = {}
                    _familyJson.forEach(_item1 => {
                      if (_item1.key == '肿瘤类型') {
                        _family.familyTumorHistory = _item1.value
                      } else if (_item1.key == '患者关系') {
                        _family.familyTumorRelation = _item1.value
                      } else if (_item1.key == '发病年龄') {
                        _family.familyTumorAge = _item1.value
                      }
                    })
                    this.familyHistory.push(_family)
                  } else if (_familyJson.key == '是否有家族史') {
                    this.hasFamilyTumorHistory = _familyJson.value
                  }
                }
              } else if (item.key == '个人健康状态') {
                let _personalHealthy = item.value
                _personalHealthy.forEach(item1 => {
                  if (item1.key == '吸烟史') {
                    this.personalHealthy.smoking = item1.value
                  } else if (item1.key == '饮酒史') {
                    this.personalHealthy.drinking = item1.value
                  } else if (item1.key == '睡眠状况') {
                    this.personalHealthy.sleeping = item1.value
                  } else if (item1.key == '血糖血压') {
                    this.personalHealthy.blood_suger = item1.value
                  }
                })
              } else if (item.key == '既往史') {
                let _diseaseHistory = item.value
                _diseaseHistory.forEach(item1 => {
                  if (item1.key == '胃') {
                    this.diseaseHistory.stomach = item1.value
                  } else if (item1.key == '肺') {
                    this.diseaseHistory.lung = item1.value
                  } else if (item1.key == '结直肠') {
                    this.diseaseHistory.colorectal = item1.value
                  } else if (item1.key == '肝') {
                    this.diseaseHistory.liver = item1.value
                  } else if (item1.key == '食管') {
                    this.diseaseHistory.esophagus = item1.value
                  } else if (item1.key == '胰腺') {
                    this.diseaseHistory.pancreas = item1.value
                  } else if (item1.key == '乳腺') {
                    this.diseaseHistory.breast = item1.value
                  } else if (item1.key == '卵巢') {
                    this.diseaseHistory.ovary = item1.value
                  }
                })
              } else if (item.key == '用药史') {
                let _drugHistory = item.value
                _drugHistory.forEach(item1 => {
                  if (item1.key == '保健品名称') {
                    this.drugHistory.drugHealth = item1.value
                  } else if (item1.key == '药物名称') {
                    this.drugHistory.drugTreatment = item1.value
                  }

                })
              }
            })
          }
        }
        if (res.data && res.data.path) {
          return this.axios.get('oss/upload/show', { params: { objectKey: res.data.path } })
            .then(r => {
              this.imagePath = this.axios.defaults.baseURL.includes('https://')
                ? (r.data || '').replace('http://', 'https://')
                : r.data
            })
            .catch(err => console.log(err))
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('知情同意加载失败，请稍后重试')
      })

      const projectsPromise = this.axios.get('solution', { params: { userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined } })
        .then(res => { this.projects = res.data || [] })
        .catch(err => console.log(err))

      const deptsPromise = this.axios.get('hospital-dept')
        .then(res => { this.depts = res.data || [] })
        .catch(err => console.log(err))

      Promise.all([informedPromise, projectsPromise, deptsPromise])
        .then(() => { this.loading = false })
    },
    edit () {
      this.submitting = true
      delete this.informedContent.createTime
      let moreInfo = []

      if (this.zuzhifenxing) {
        moreInfo.push({
          key: '组织分型',
          value: this.zuzhifenxing
        })
      }
      if (this.figo) {
        moreInfo.push({
          key: 'FIGO分期',
          value: this.figo
        })
      }
      if (this.jieduan) {
        moreInfo.push({
          key: '治疗阶段',
          value: this.jieduan
        })
      }
      if (this.fenzifenxing) {
        moreInfo.push({
          key: '分子分型',
          value: this.fenzifenxing
        })
      }
      if (this.tnm) {
        moreInfo.push({
          key: 'TNM分期',
          value: this.tnm
        })
      }
      if (this.bingcheng) {
        moreInfo.push({
          key: '病程',
          value: this.bingcheng
        })
      }

      if (this.informedContent.cancerType == '其他癌种') {
        moreInfo.push({
          key: '癌种名称',
          value: this.otherDisease
        })
      }
      if (this.familyTumorHistory != null && this.familyTumorHistory != '') {
        moreInfo.push({
          key: '肿瘤家族史',
          value: this.familyTumorHistory
        })
      }
      if (this.normalFamilyTumorHistory) {
        let familyHistory = []
        familyHistory.push({
          key: '是否有家族史',
          value: this.hasFamilyTumorHistory
        })
        if (this.hasFamilyTumorHistory == '有') {
          if (this.normalFamilyTumorHistory) {
            familyHistory.push({
              key: '亲属何种癌种',
              value: this.normalFamilyTumorHistory
            })
          }
          if (this.familyTumorRelation) {
            familyHistory.push({
              key: '与家属关系',
              value: this.familyTumorRelation
            })
          }
          if (this.familyTumorAge) {
            familyHistory.push({
              key: '发病年龄',
              value: this.familyTumorAge
            })
          }
        }
        moreInfo.push({
          key: '家族史',
          value: familyHistory
        })
      }
      if (this.hasFamilyTumorHistory) {
        let familyHistory = []
        familyHistory.push({
          key: '是否有家族史',
          value: this.hasFamilyTumorHistory
        })

        for(let family of this.familyHistory) {
          let _aPerson = []
          if (family.familyTumorHistory !== '') {
            _aPerson.push({
              key: '肿瘤类型',
              value: family.familyTumorHistory
            })
          }
          if (family.familyTumorRelation !== '') {
            _aPerson.push({
              key: '患者关系',
              value: family.familyTumorRelation
            })
          }
          familyHistory.push(_aPerson)
        }
        moreInfo.push({
          key: '肿瘤遗传史',
          value: familyHistory
        })
      }
      if (this.personalHealthy) {
        let personHistory = []
        if (this.personalHealthy.smoking) {
          personHistory.push({
            key: '吸烟史',
            value: this.personalHealthy.smoking
          })
        }
        if (this.personalHealthy.drinking) {
          personHistory.push({
            key: '饮酒史',
            value: this.personalHealthy.drinking
          })
        }
        if (this.personalHealthy.sleeping) {
          personHistory.push({
            key: '睡眠状况',
            value: this.personalHealthy.sleeping
          })
        }
        if (this.personalHealthy.blood_suger) {
          personHistory.push({
            key: '血糖血压',
            value: this.personalHealthy.blood_suger
          })
        }
        moreInfo.push({
          key: '个人健康状态',
          value: personHistory
        })
      }
      if (this.diseaseHistory) {
        let personHistory = []
        if (this.diseaseHistory && this.diseaseHistory.smoking) {
          personHistory.push({
            key: '吸烟史',
            value: this.diseaseHistory.smoking
          })
        }
        if (this.diseaseHistory && this.diseaseHistory.drinking) {
          personHistory.push({
            key: '饮酒史',
            value: this.diseaseHistory.drinking
          })
        }
        if (this.diseaseHistory && this.diseaseHistory.gastritis) {
          personHistory.push({
            key: '胃炎',
            value: this.diseaseHistory.gastritis
          })
        }
        if (this.diseaseHistory && this.diseaseHistory.enteritis) {
          personHistory.push({
            key: '肠炎',
            value: this.diseaseHistory.enteritis
          })
        }
        if (this.diseaseHistory && this.diseaseHistory.hp) {
          personHistory.push({
            key: '幽门螺旋杆菌感染',
            value: this.diseaseHistory.hp
          })
        }
        if (this.diseaseHistory && this.diseaseHistory.hepatitisB) {
          personHistory.push({
            key: '乙肝感染',
            value: this.diseaseHistory.hepatitisB
          })
        }
        if (this.diseaseHistory && this.diseaseHistory.poison) {
          personHistory.push({
            key: '是否长期接触毒害物质',
            value: this.diseaseHistory.poison
          })
        }

        moreInfo.push({
          key: '个人史',
          value: personHistory
        })
      }
      if (this.diseaseHistory) {
        let diseaseHistory = []

        if (this.diseaseHistory.lung) {
          diseaseHistory.push({
            key: '肺',
            value: this.diseaseHistory.lung
          })
        }
        if (this.diseaseHistory.stomach) {
          diseaseHistory.push({
            key: '胃',
            value: this.diseaseHistory.stomach
          })
        }
        if (this.diseaseHistory.colorectal) {
          diseaseHistory.push({
            key: '结直肠',
            value: this.diseaseHistory.colorectal
          })
        }
        if (this.diseaseHistory.liver) {
          diseaseHistory.push({
            key: '肝',
            value: this.diseaseHistory.liver
          })
        }
        if (this.diseaseHistory.esophagus) {
          diseaseHistory.push({
            key: '食管',
            value: this.diseaseHistory.esophagus
          })
        }
        if (this.diseaseHistory.pancreas) {
          diseaseHistory.push({
            key: '胰腺',
            value: this.diseaseHistory.pancreas
          })
        }
        if (this.diseaseHistory.breast) {
          diseaseHistory.push({
            key: '乳腺',
            value: this.diseaseHistory.breast
          })
        }
        if (this.diseaseHistory.ovary) {
          diseaseHistory.push({
            key: '卵巢',
            value: this.diseaseHistory.ovary
          })
        }

        moreInfo.push({
          key: '既往史',
          value: diseaseHistory
        })
      }
      if (this.drugHistory) {
        let _drugHistory = []
        if (this.drugHistory.drugHealth) {
          _drugHistory.push({
            key: '保健品名称',
            value: this.drugHistory.drugHealth
          })
        }
        if (this.drugHistory.drugTreatment) {
          _drugHistory.push({
            key: '药物名称',
            value: this.drugHistory.drugTreatment
          })
        }

        moreInfo.push({
          key: '用药史',
          value: _drugHistory
        })
      }
        this.informedContent.moreInfo = JSON.stringify(moreInfo)
      if(this.groupId===7){
        delete this.informedContent.moreInfo;
        delete this.informedContent.mailInfo;
        delete this.informedContent.sampleInfor;
      }
      this.axios.put('informed/' + this.$route.query.informedId, this.informedContent)
        .then(() => {
          this.$message.success('已保存')
          this.$router.push('/informed/list')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('保存失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    cancel () {
      this.$router.push('/informed/list')
    },
    unread () {
      this.submitting = true
      delete this.informedContent.createTime
      this.axios.put('informed/unread/' + this.$route.query.informedId, this.informedContent)
        .then(() => {
          this.$message.success('已标记图形不可读')
          this.$router.push('/informed/list')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('操作失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    addressHandleChange (value) {
      this.informedContent.province = this.CodeToText[value[0]]
      this.informedContent.city = this.CodeToText[value[1]]
      this.informedContent.county = this.CodeToText[value[2]]
    },
    hospitalQuerySearch (queryString, cb) {
      this.axios.get('hospital/page', {
        params: { pageNum: 1, pageSize: 8, keywords: queryString }
      }).then(res => {
        if (!res.data || res.data.endRow === 0) return cb([])
        cb((res.data.list || []).map(item => ({ value: item.name, id: item.id })))
      }).catch(err => {
        console.log(err)
        cb([])
      })
    },
    hospitalHandleSelect (item) {
      this.informedContent.hospitalId = item.id
    },
    updateSmsStatus (status) {
      this.smsStatus = status
      this.informedContent.smsStatus = status
    },
    addFamilyHistory () {
      this.familyHistory.push({
        familyTumorRelation: '',
        familyTumorHistory: '',
        familyTumorAge: '',
      })
    }
  },
  filters: {},
  computed: {
    areaInfo: {
      get: function () {
        const c = this.informedContent
        if (c.county === undefined || c.county === '' || c.county === null) {
          return []
        }
        try {
          // 直辖市兼容：历史 C 端写入 province===city，新 C 端对齐 element-china-area-data 后会写入"市辖区"
          const cityTemp = c.city === c.province ? '市辖区' : c.city
          const provNode = this.TextToCode[c.province]
          if (!provNode) return []
          const cityNode = provNode[cityTemp]
          if (!cityNode) return []
          const countyNode = cityNode[c.county]
          if (!countyNode) return []
          return [provNode.code, cityNode.code, countyNode.code]
        } catch (e) {
          console.warn('[informed_edit] 省市区回显失败', c.province, c.city, c.county, e)
          return []
        }
      },
      set: function () {
      }
    },
    canEditInformed () {
      return this.role === 'manager' || this.role === 'jk-service'
    }
  },
  created () {
    this.groupId = parseInt(this.$route.query.groupId)
    this._initData()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.pc-informed-edit {
  .user-container {
    margin: 0;
    padding: 0 0 14px;
  }

  .informed-title {
    align-items: flex-start;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: var(--pc-bd-hair);

    > div:first-child {
      display: flex;
      align-items: baseline;
      gap: 12px;
      min-width: 0;
    }
  }

  .page-meta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    font-size: var(--pc-fs-13);
    color: var(--pc-ink-500);

    .num {
      font-family: var(--pc-font-mono);
      font-variant-numeric: tabular-nums;
      color: var(--pc-ink-800);
    }
  }

  .workbench-grid {
    position: relative;
    display: grid;
    grid-template-columns: minmax(540px, 1fr) minmax(360px, 42%);
    gap: 16px;
    align-items: start;

    &.is-preview-only {
      grid-template-columns: minmax(420px, 720px);
    }
  }

  .form-column,
  .preview-column {
    min-width: 0;
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-section,
  .preview-panel {
    background: var(--pc-white);
    border: var(--pc-bd-hair);
    border-radius: var(--pc-r-4);
  }

  .form-section {
    padding: 14px 16px 2px;

    &.form-section--muted {
      background: var(--pc-ink-50);
    }
  }

  .pr-section {
    padding-bottom: 16px;
  }

  .preview-panel {
    position: sticky;
    top: 12px;
    padding: 14px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin: 0 0 12px;
    padding-bottom: 8px;
    border-bottom: var(--pc-bd-hair);

    h4 {
      margin: 0;
      font-size: var(--pc-fs-14);
      font-weight: 600;
      color: var(--pc-ink-800);
    }

    .section-hint {
      margin-left: 6px;
      font-size: var(--pc-fs-12);
      color: var(--pc-ink-400);
      font-weight: 400;
    }
  }

  .subsection-title {
    margin: 2px 0 12px;
    padding-top: 10px;
    border-top: var(--pc-bd-hair);
    font-size: var(--pc-fs-13);
    font-weight: 600;
    color: var(--pc-ink-700);
  }

  .field-inline-label {
    padding-left: 10px;
    color: var(--pc-ink-500);
  }

  .cell-group {
    background: var(--pc-ink-50);
    border: var(--pc-bd-hair);
    border-radius: var(--pc-r-4);
    padding: 10px 12px 0;
    margin-bottom: 10px;
  }

  .doc-frame {
    width: 100%;
    height: calc(100vh - 190px);
    min-height: 520px;
    background: var(--pc-ink-50);
    border: var(--pc-bd-hair);
    border-radius: var(--pc-r-4);
    overflow: hidden;

    object,
    embed {
      width: 100%;
      height: 100%;
    }

    .doc-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: var(--pc-ink-100);
    }
  }

  .doc-empty {
    min-height: 520px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background: var(--pc-ink-50);
    border: var(--pc-bd-hair);
    border-radius: var(--pc-r-4);

    .empty-title {
      margin: 0 0 4px;
      font-size: var(--pc-fs-14);
      color: var(--pc-ink-600);
    }

    .empty-hint {
      margin: 0;
      font-size: var(--pc-fs-12);
      color: var(--pc-ink-400);
    }
  }

  .footer-btn {
    position: sticky;
    bottom: 0;
    z-index: 8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 16px;
    padding: 12px 76px 12px 16px;
    background: var(--pc-white);
    border: var(--pc-bd-hair);
    border-radius: var(--pc-r-4);
    box-shadow: var(--pc-sh-2);
  }

  .footer-summary {
    min-width: 0;
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-500);
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .el-autocomplete,
  .width-100-p {
    width: 100%;
  }

  ::v-deep .el-form-item {
    margin-bottom: 12px;
  }

  ::v-deep .el-date-editor.el-input {
    width: 100%;
  }

  ::v-deep .el-radio,
  ::v-deep .el-checkbox {
    margin-right: 18px;
  }

  ::v-deep .el-divider {
    margin: 8px 0 12px;
  }
}

@media (max-width: 1180px) {
  .pc-informed-edit {
    .workbench-grid,
    .workbench-grid.is-preview-only {
      grid-template-columns: minmax(0, 1fr);
    }

    .preview-panel {
      position: static;
    }

    .doc-frame,
    .doc-empty {
      height: 560px;
      min-height: 420px;
    }
  }
}

@media (max-width: 760px) {
  .pc-informed-edit {
    .informed-title,
    .informed-title > div:first-child,
    .footer-btn {
      align-items: flex-start;
      flex-direction: column;
    }

    .footer-btn {
      padding-right: 16px;
    }

    .footer-actions {
      width: 100%;
      justify-content: flex-end;
      flex-wrap: wrap;
    }
  }
}
</style>
