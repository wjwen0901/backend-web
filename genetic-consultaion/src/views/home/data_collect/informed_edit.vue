<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>信息提取</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/informed/list' }">知情列表</el-breadcrumb-item>
          <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" v-if="role === 'manager' || role === 'jk-service'">
        <div class="user-container">
          <el-form ref="informedForm" :model="informedContent" label-width="120px" size="mini" class="edit-form">
            <h4>基本信息</h4>

            <el-form-item label="姓名">
              <el-col :span="9">
                <el-input v-model="informedContent.truename"></el-input>
              </el-col>
              <el-col class="line" :span="3" style="padding-left:10px;">性别</el-col>
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
              <el-col class="line" :span="3" style="padding-left:10px;">年龄</el-col>
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
              <el-col class="line" :span="3" style="padding-left:10px;">号码</el-col>
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

            <h4>送检信息</h4>
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
            <h4>病理信息</h4>
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


<!--            <h5>家族史</h5>-->
<!--            <el-form-item :label="item.key" v-for="item in familyHistory">-->
<!--              <el-input v-model="item.value"></el-input>-->
<!--            </el-form-item>-->
<!--            <h5>个人史</h5>-->
<!--            <el-form-item :label="item.key" v-for="item in personHistory">-->
<!--              <el-input v-model="item.value"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item>
              <el-button @click="cancel">取消</el-button>
              <el-button @click="unread">图形不可读</el-button>
              <el-button type="primary" @click="edit">保存信息</el-button>
            </el-form-item>

            <div>
              <h5>肿瘤遗传史：</h5>
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

            </div>
            <div>
              <h5>个人健康状态：</h5>
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
            </div>

            <div>
              <h5>既往史：</h5>
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
            </div>
            <div>
              <h5>用药史（近14天如服用药物或保健品请注明）</h5>
              <el-form-item label="保健品名称">
                <el-input v-model="drugHistory.drugHealth"></el-input>
              </el-form-item>
              <el-form-item label="药物名称">
                <el-input v-model="drugHistory.drugTreatment"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-divider content-position="left">以下为兼容旧版知情</el-divider>
              <h5>家族史（只一人）：</h5>
              <el-form-item label="癌种(旧版)">
                <el-input v-model="normalFamilyTumorHistory"></el-input>
              </el-form-item>
              <el-form-item label="患者关系(旧版)">
                <el-input v-model="familyTumorRelation"></el-input>
              </el-form-item>
              <el-form-item label="发病年龄(旧版)">
                <el-input v-model="familyTumorAge"></el-input>
              </el-form-item>
              <h5>个人史：</h5>
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
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="img-content">
          <div v-if="imagePath.indexOf('.pdf') > -1">
            <img :src="imagePath">
            <object :data="imagePath" type="application/pdf" width="100%" height="700px">
              <embed :src="imagePath">
            </object>
          </div>
          <img :src="imagePath" v-else>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'EditInformed',
  data () {
    return {
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
      drugHistory: {}
    }
  },
  props: {},
  methods: {
    _initData () {
      this.axios.get('informed/' + this.$route.params.informedId, {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
      }).then(res => {
        this.informedContent = res.data
        if (res.data.tid !== undefined) {
          this.informedContent.orderNo = res.data.tid
        }
        if (this.informedContent.smsStatus === undefined) {
          this.informedContent.smsStatus = 1
          this.smsStatus = 1
        }
        // if (this.informedContent.samplingDate !== undefined) {
        //   this.informedContent.samplingDate = new Date(this.informedContent.samplingDate).Format("yyyy-MM-dd hh:mm:ss")
        // }
        // if (this.informedContent.dateOfBirth !== undefined) {
        //   this.informedContent.dateOfBirth = new Date(this.informedContent.dateOfBirth).Format("yyyy-MM-dd hh:mm:ss")
        //   console.log(this.informedContent.dateOfBirth)
        // }
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
                    console.log(this.familyHistory)
                  } else {
                    if (_familyJson.key == '是否有家族史') {
                      this.hasFamilyTumorHistory = _familyJson.value
                    }
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
        this.axios.get('oss/upload/show', {
          params: {
            objectKey: res.data.path,
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          },
        }).then(res1 => {
          this.imagePath = this.axios.defaults.baseURL.includes('https://')
            ? res1.data.replace('http://', 'https://') : res1.data
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })

      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.projects = res.data
      }).catch(err => {
        console.log(err)
      })
      this.axios.get('hospital-dept', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        }
      }).then(res => {
        this.depts = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    edit () {
      // console.log(this.familyHistory)
      // console.log(this.personHistory)
      // return
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
      this.axios.put('informed/' + this.$route.params.informedId + '?userId=' + window.localStorage.userId, this.informedContent).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.push('/informed/list')
      }).catch(err => {
        this.$message.error('修改失败')
        console.log(err)
      })
    },
    cancel () {
      this.$router.push('/informed/list')
    },
    unread () {
      delete this.informedContent.createTime
      this.axios.put('informed/unread/' + this.$route.params.informedId+ '?userId=' + window.localStorage.userId, this.informedContent).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.push('/informed/list')
      }).catch(err => {
        this.$message.error('修改失败')
        console.log(err)
      })
    },
    addressHandleChange (value) {
      this.informedContent.province = this.CodeToText[value[0]]
      this.informedContent.city = this.CodeToText[value[1]]
      this.informedContent.county = this.CodeToText[value[2]]
    },
    hospitalQuerySearch (queryString, cb) {
      console.log(queryString)
      this.axios.get('hospital/page', {
        params: {
          pageNum: 1, // 页码
          pageSize: 8, // 每页长度
          keywords: queryString,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        let result = []
        if (res.data.endRow === 0) {
          cb(result)
        } else {
          res.data.list.forEach(function (item) {
            result.push({
              'value': item.name,
              'id': item.id
            })
          })
          cb(result)
        }
      }).catch(err => {
        console.log(err)
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
        if (this.informedContent.county === undefined || this.informedContent.county === '' || this.informedContent.county === null) {
          return []
        }
        let province = this.TextToCode[this.informedContent.province].code
        let cityTemp = this.informedContent.city === this.informedContent.province ? '市辖区' : this.informedContent.city
        let city = this.TextToCode[this.informedContent.province][cityTemp].code
        let county = this.TextToCode[this.informedContent.province][cityTemp][this.informedContent.county].code
        return [province, city, county]
      },
      set: function () {
      }
    }
  },
  created () {
    let loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this._initData()
    loading.close()
  },
  mounted () {},
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-autocomplete {
    width: 100%;
  }
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
  }
  .user-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .edit-form {
    max-width: 500px;
  }
  .width-100-p {
    width: 100%
  }
  .img-content {
    margin: 20px 0px 20px 20px;
    height: 700px;
    background: #ffffff;
    overflow: auto;
    img {
      width: 100%;
    }
  }

  .el-date-editor.el-input {
    width: 100% !important;
  }

</style>
