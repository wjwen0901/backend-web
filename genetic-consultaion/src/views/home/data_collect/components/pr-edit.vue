<template>
  <div class="pr-box">
    <el-form ref="formData" :rules="formDataRules" :model="formData" label-position="right" label-width="140px" size="mini" class="edit-form">
      <h4>患者信息</h4>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名：" prop="patient.truename">
            <el-input v-model="formData.patient.truename"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别：" prop="patient.sex">
            <el-radio-group v-model="formData.patient.sex">
              <el-radio :label="'男'">男</el-radio>
              <el-radio :label="'女'">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="出生年月：" prop="patient.birthday">
            <el-date-picker
              v-model="formData.patient.birthday"
              type="date"
              value-format="timestamp"
              placeholder="选择出生年月"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号：" prop="patient.idCode">
            <el-input v-model="formData.patient.idCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <h4>报告邮寄信息</h4>
      <el-form-item label="报告接收人：" label-width="140px" prop="orderReceiver.receiver">
        <el-input v-model="formData.orderReceiver.receiver"></el-input>
      </el-form-item>
      <el-form-item label="报告接收人电话：" label-width="140px" prop="orderReceiver.cellphone">
        <el-input v-model="formData.orderReceiver.cellphone"></el-input>
      </el-form-item>
      <el-form-item label="报告邮寄地址：" label-width="140px" prop="orderRevceiveAllAddreaa">
        <el-cascader
          v-model="formData.orderRevceiveAllAddreaa"
          :options="addressOptions"
          @change="handleChangAddress($event,'orderReceiver')"></el-cascader>
      </el-form-item>
      <el-form-item label="报告邮寄详细地址：" label-width="140px" prop="orderReceiver.address">
        <el-input type="textarea" v-model="formData.orderReceiver.address"></el-input>
      </el-form-item>
      <h4>样本信息</h4>
      <el-form-item label="订单编号：">
        <el-input v-model="formData.orderNo"></el-input>
      </el-form-item>
      <el-form-item label="送检项目：" prop="solutionId">
        <el-select v-model="formData.solutionId"
                   clearable
                   filterable
                   @clear="clearProject">
          <el-option
            v-for="item in projects"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="样本编号：" prop="samplingVo.sampleCode">
        <el-input v-model="formData.samplingVo.sampleCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="实验室样本编号：">
        <el-input v-model="formData.labSampleCode"></el-input>
      </el-form-item>
      <el-form-item label="样本类型：" prop="sampleTypes">
        <el-checkbox-group v-model="formData.sampleTypes">
          <el-checkbox v-for="item in sampleTypesSelectList" :label="item" :key="item"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <template v-if="formData.sampleTypes.includes('外周血（EDTA 采血管）')">
        <el-form-item label="外周血（EDTA采血管）数量：" label-width="250px">
          <el-row>
            <el-col :span="11">
              <el-row type="flex" justify="baseline"><el-input v-model="formData.doDelete.peripheralBloodNumber"></el-input>&nbsp;&nbsp;管</el-row>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-row type="flex" justify="baseline"><el-input v-model="formData.doDelete.peripheralBloodCapacity"></el-input>&nbsp;&nbsp;ml</el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="外周血（EDTA采血管）采样日期：" label-width="250px" prop="doDelete.sampleTimeEdta">
          <el-date-picker type="date" value-format="timestamp" v-model="formData.doDelete.sampleTimeEdta"></el-date-picker>
        </el-form-item>
      </template>
      <template v-if="formData.sampleTypes.includes('外周血（Streck 采血管）')">
        <el-form-item label="外周血（Streck采血管）数量：" label-width="250px">
          <el-row>
            <el-col :span="11">
              <el-row type="flex" justify="baseline"><el-input v-model="formData.doDelete.peripheralBloodCapacityStreck"></el-input>&nbsp;&nbsp;管</el-row>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-row type="flex" justify="baseline"><el-input v-model="formData.doDelete.peripheralBloodCapacityCapacityStreck"></el-input>&nbsp;&nbsp;ml</el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="外周血（Streck采血管）采样日期：" label-width="250px" prop="doDelete.sampleTimeStreck">
          <el-date-picker type="date" value-format="timestamp" v-model="formData.doDelete.sampleTimeStreck"></el-date-picker>
        </el-form-item>
      </template>
      <template v-if="formData.sampleTypes.includes('口腔拭子')">
        <el-form-item label="口腔拭子：" label-width="250px">
          <el-row>
            <el-col :span="11">
              <el-row type="flex" justify="baseline"><el-input v-model="formData.doDelete.oralSwabsNumber"></el-input>&nbsp;&nbsp;管</el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="口腔拭子采样日期：" label-width="250px">
          <el-date-picker type="date" value-format="timestamp" v-model="formData.doDelete.oralSwabsTime"></el-date-picker>
        </el-form-item>
      </template>
      <el-form-item  v-if="formData.sampleTypes.includes('组织样本')" label="组织样本信息：" prop="sampleTypeByOragin">
        <el-checkbox v-model="formData.sampleTypeByOragin" v-for="(item,index) in sampleTypeByOraginList" :key="index" :label="item"></el-checkbox>
      </el-form-item>
      <template v-if="formData.sampleTypeByOragin.includes('手术组织石蜡切片（白片）') && formData.sampleTypes.includes('组织样本')">
        <el-form-item label="手术组织石蜡切片（白片）数量：" label-width="290px">
          <el-row type="flex" justify="center"><el-input v-model="formData.doDelete.paraffinNumber"></el-input>&nbsp;片</el-row>
        </el-form-item>
        <el-form-item label="手术组织石蜡切片（白片）样本手术日期：" label-width="290px" prop="doDelete.paraffinTime">
          <el-date-picker type="date" value-format="timestamp" v-model="formData.doDelete.paraffinTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="手术组织石蜡切片取样部位：" label-width="290px" prop="doDelete.paraffinSamplePart">
          <el-input v-model="formData.doDelete.paraffinSamplePart"></el-input>
        </el-form-item>
      </template>
      <template v-if="formData.sampleTypeByOragin.includes('穿刺组织石蜡切片（白片）') && formData.sampleTypes.includes('组织样本')">
        <el-form-item label="穿刺组织石蜡切片（白片）数量：" label-width="290px">
          <el-row type="flex" justify="center">
            <el-input v-model="formData.doDelete.tissueNumber"></el-input>&nbsp;片
          </el-row>
        </el-form-item>
        <el-form-item label="穿刺组织石蜡切片（白片）样本手术日期：" label-width="290px" prop="doDelete.tissueTime">
          <el-date-picker type="date" value-format="timestamp" v-model="formData.doDelete.tissueTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="穿刺组织石蜡切片取样部位：" label-width="290px" prop="doDelete.tissueSamplePart">
          <el-input v-model="formData.doDelete.tissueSamplePart"></el-input>
        </el-form-item>
      </template>
        <template v-if="formData.sampleTypeByOragin.includes('蜡块（手术组织）') && formData.sampleTypes.includes('组织样本')">
          <el-row>
            <el-form-item label="蜡块（手术组织）数量：" label-width="180px">
              <el-input style="width:350px" v-model="formData.doDelete.blockNumber"></el-input>&nbsp;&nbsp;块
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="蜡块（手术组织）样本手术日期：" label-width="250px" prop="doDelete.blockTime">
              <el-date-picker type="date" value-format="timestamp" v-model="formData.doDelete.blockTime"></el-date-picker>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="蜡块（手术组织）取样部位："  label-width="250px" prop="doDelete.blockSamplePart">
              <el-input v-model="formData.doDelete.blockSamplePart"></el-input>
            </el-form-item>
        </el-row>
      </template>
       <template v-if="formData.sampleTypeByOragin.includes('蜡块（穿刺组织）') && formData.sampleTypes.includes('组织样本')">
          <el-row>
            <el-form-item label="蜡块（穿刺组织）数量：" label-width="180px">
              <el-input style="width:350px" v-model="formData.doDelete.blockPuncturedNumber"></el-input>&nbsp;&nbsp;块
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="蜡块（穿刺组织）样本手术日期：" label-width="250px" prop="doDelete.blockPuncturedTime">
              <el-date-picker type="date" value-format="timestamp" v-model="formData.doDelete.blockPuncturedTime"></el-date-picker>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="蜡块（穿刺组织）取样部位："  label-width="250px" prop="doDelete.blockPuncturedSamplePart">
              <el-input v-model="formData.doDelete.blockPuncturedSamplePart"></el-input>
            </el-form-item>
        </el-row>
      </template>
        <el-row v-if="(formData.sampleTypeByOragin.includes('蜡块（手术组织）') || formData.sampleTypeByOragin.includes('蜡块（穿刺组织）')) && formData.sampleTypes.includes('组织样本')">
           <el-form-item label="是否样本归还：" prop="doDelete.isReturn">
              <el-radio-group v-model="formData.doDelete.isReturn">
                <el-radio :label="'是'">是</el-radio>
                <el-radio :label="'否'">否</el-radio>
              </el-radio-group>
            </el-form-item>
        </el-row>
      <!-- </template> -->
      <template v-if="formData.sampleTypeByOragin.includes('新鲜手术组织') && formData.sampleTypes.includes('组织样本')">
        <el-form-item label="新鲜手术组织数量：">
          <el-row>
            <el-col :span="11">
              <el-row type="flex" justify="baseline"><span>RNAlater</span>&nbsp;<el-input style="width:150px" v-model="formData.doDelete.freshSurgicalNumber"></el-input>&nbsp;&nbsp;管</el-row>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-row type="flex" justify="baseline"><span>10%福尔马林</span>&nbsp;<el-input style="width:150px" v-model="formData.doDelete.freshSurgicalFuNumber"></el-input>&nbsp;&nbsp;管</el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="新鲜手术组织样本手术日期：" label-width="211px" prop="doDelete.freshSurgicalTime">
          <el-date-picker type="date" value-format="timestamp" v-model="formData.doDelete.freshSurgicalTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="新鲜手术组织取样部位："  label-width="200px" prop="doDelete.freshSurgicalSamplePart">
          <el-input v-model="formData.doDelete.freshSurgicalSamplePart"></el-input>
        </el-form-item>
      </template>
      <template v-if="formData.sampleTypeByOragin.includes('新鲜穿刺组织') && formData.sampleTypes.includes('组织样本')">
        <el-form-item label="新鲜穿刺组织数量：">
          <el-row>
            <el-col :span="11">
              <el-row type="flex" justify="baseline"><span>RNAlater</span>&nbsp;<el-input style="width:150px" v-model="formData.doDelete.puncturedNumber"></el-input>&nbsp;&nbsp;管</el-row>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-row type="flex" justify="baseline"><span>10%福尔马林</span>&nbsp;<el-input style="width:150px" v-model="formData.doDelete.puncturedFuNumber"></el-input>&nbsp;&nbsp;管</el-row>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="新鲜穿刺组织样本手术日期：" label-width="211px" prop="doDelete.puncturedTime">
          <el-date-picker type="date" value-format="timestamp" v-model="formData.doDelete.puncturedTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="新鲜穿刺组织取样部位："  label-width="200px" prop="doDelete.puncturedSamplePart">
          <el-input v-model="formData.doDelete.puncturedSamplePart"></el-input>
        </el-form-item>
      </template>
      <template v-if="formData.sampleTypeByOragin.includes('胸腹水')">
        <el-form-item label="胸腹水数量：">
            <el-row>
              <el-col :span="11">
                <el-row type="flex" justify="baseline"><el-input v-model="formData.doDelete.chestWaterNumber"></el-input>&nbsp;&nbsp;瓶</el-row>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-row type="flex" justify="baseline"><el-input v-model="formData.doDelete.chestWaterCapacity"></el-input>&nbsp;&nbsp;ml</el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="胸腹水样本手术日期："  label-width="211px" prop="doDelete.chestWaterTime">
            <el-date-picker type="date" value-format="timestamp" v-model="formData.doDelete.chestWaterTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="胸腹水取样部位："  label-width="200px" prop="doDelete.chestWaterPart">
            <el-input v-model="formData.doDelete.chestWaterPart"></el-input>
          </el-form-item>
      </template>
      <template v-if="formData.doDelete.isReturn==='是' && formData.sampleTypes.includes('组织样本')">
        <h4>剩余组织样本归还</h4>
        <el-form-item label="归还联系人：" label-width="140px" prop="waxOrderReceiver.receiver">
          <el-input v-model="formData.waxOrderReceiver.receiver"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话：" label-width="140px" prop="waxOrderReceiver.cellphone">
          <el-input v-model="formData.waxOrderReceiver.cellphone"></el-input>
        </el-form-item>
        <el-form-item label="归还地址：" label-width="140px" prop="waxOrderReceiver.allAddress">
          <el-cascader
            v-model="formData.waxOrderReceiver.allAddress"
            :options="addressOptions"
            @change="handleChangAddress($event,'waxOrderReceiver')"></el-cascader>
        </el-form-item>
        <el-form-item label="归还详细地址：" label-width="140px" prop="waxOrderReceiver.address">
          <el-input type="textarea" v-model="formData.waxOrderReceiver.address"></el-input>
        </el-form-item>
      </template>
      <h4>送检信息</h4>
      <!-- v-loadData="loadData" -->
      <el-form-item label="送检医院：" prop="inspectVo.hospitalId">
        <el-select v-model="formData.inspectVo.hospitalId"
                   filterable
                   remote
                   reserve-keyword
                   :remote-method="remoteMethod"
                   :loading="selectLoading"
                   clearable
                   @clear="clearQuery(true)">
          <el-option
            v-for="item in hospitalList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="送检科室：" prop="inspectVo.deptId">
        <el-select v-model="formData.inspectVo.deptId"
                   filterable
                   remote
                   reserve-keyword
                   :remote-method="queryDept"
                   clearable
                   @clear="clearQuery(false)">
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="送检医生：" prop="inspectVo.doctor">
        <el-input v-model="formData.inspectVo.doctor"></el-input>
      </el-form-item>
      <h4>疾病信息</h4>
      <el-row>
        <el-col :span="11">
          <el-form-item label="肿瘤类型：" prop="diseaseVo.tumorName">
            <el-select v-model="formData.diseaseVo.tumorName">
              <el-option
                v-for="item in tumorTypesList"
                :key="item.value"
                :label="item.desc"
                :value="item.desc">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="临床分期：">
            <el-select v-model="formData.diseaseVo.clinicalStages">
              <el-option
                v-for="item in clinicalStagingList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="病理类型：">
        <el-select v-model="formData.diseaseVo.pathologiclName"
                   filterable
                   clearable>
          <el-option
            v-for="item in pathologicTypesList"
            :key="item.value"
            :label="item.desc"
            :value="item.desc">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="病理信息-其他：" v-if="formData.diseaseVo.pathologiclName === '其他'" prop="diseaseVo.pathologicTypesOther">
        <el-input v-model="formData.diseaseVo.pathologicTypesOther" placeholder="请输入病理类型-其他"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item label="初次确诊时间：" prop="diseaseVo.firstConfirmedDate">
            <el-date-picker value-format="timestamp" type="date" v-model="formData.diseaseVo.firstConfirmedDate"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="癌症家族史：" prop="diseaseVo.familyHistory">
            <el-radio-group v-model="formData.diseaseVo.familyHistory">
              <el-radio :label="'有'">有</el-radio>
              <el-radio :label="'无'">无</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.diseaseVo.familyHistory === '有'">
          <el-button size="mini" type="primary" class="add-relation" @click="addRelation">新增亲属关系</el-button>
      </el-row>
      <el-row v-for="(item,index) in formData.familyInformations" :key="index" class="relation-box">
        <el-col :span="6">
          <el-form-item label="亲属关系：" label-width="100px"
                        :prop="'familyInformations.'+index+'.kinship'"
                        :rules="{required: true, message: '请输入亲属关系', trigger: 'blur' }">
            <el-input v-model="item.kinship"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="确诊年龄：" label-width="100px"
                        :prop="'familyInformations.'+index+'.confirmedAge'"
                        :rules="[
                          {required: true, message: '请输入确诊年龄', trigger: 'blur' },
                          { pattern: /^(?:[1-9][0-9]?|1[01][0-9]|150)$/, message: '请输入正确的确诊年龄' }
                        ]">
            <el-input v-model="item.confirmedAge"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="癌种：" label-width="90px"
                        :prop="'familyInformations.'+index+'.canker'"
                        :rules="{required: true, message: '请输入癌种', trigger: 'blur' }">
            <el-input v-model="item.canker"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="deleteItem(index)"></el-button>
        </el-col>
      </el-row>
      <!--判断是否补寄过-->
      <template v-if="isEdit">
        <h4>补寄样本信息</h4>
        <el-form-item label="样本编号：" prop="sampleVoBJ.sampleCode">
          <el-input v-model="formData.sampleVoBJ.sampleCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="样本类型：" prop="sampleTypesBj">
          <el-checkbox-group v-model="formData.sampleTypesBj">
            <el-checkbox v-for="(item,index) in sampleTypesSelectList" :key="index" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <template v-if="formData.sampleTypesBj.includes('外周血（EDTA 采血管）')">
          <el-form-item label="外周血（EDTA采血管）数量：" label-width="250px">
            <el-row>
              <el-col :span="11">
                <el-row type="flex" justify="baseline"><el-input v-model="formData.doDeleteBj.peripheralBloodNumber"></el-input>&nbsp;&nbsp;管</el-row>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-row type="flex" justify="baseline"><el-input v-model="formData.doDeleteBj.peripheralBloodCapacity"></el-input>&nbsp;&nbsp;ml</el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="外周血（EDTA采血管）采样日期：" label-width="250px">
            <el-date-picker type="date" value-format="timestamp" v-model="formData.doDeleteBj.sampleTimeEdta"></el-date-picker>
          </el-form-item>
        </template>
        <template v-if="formData.sampleTypesBj.includes('外周血（Streck 采血管）')">
          <el-form-item label="外周血（Streck采血管）数量：" label-width="250px">
            <el-row>
              <el-col :span="11">
                <el-row type="flex" justify="baseline"><el-input v-model="formData.doDeleteBj.peripheralBloodCapacityStreck"></el-input>&nbsp;&nbsp;管</el-row>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-row type="flex" justify="baseline"><el-input v-model="formData.doDeleteBj.peripheralBloodCapacityCapacityStreck"></el-input>&nbsp;&nbsp;ml</el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="外周血（Streck采血管）采样日期：" label-width="250px">
            <el-date-picker type="date" value-format="timestamp" v-model="formData.doDeleteBj.sampleTimeStreck"></el-date-picker>
          </el-form-item>
        </template>
        <template v-if="formData.sampleTypesBj.includes('口腔拭子')">
          <el-form-item label="口腔拭子：" label-width="250px">
            <el-row>
              <el-col :span="11">
                <el-row type="flex" justify="baseline"><el-input v-model="formData.doDeleteBj.oralSwabsNumber"></el-input>&nbsp;&nbsp;管</el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="口腔拭子采样日期：" label-width="250px">
            <el-date-picker type="date" value-format="timestamp" v-model="formData.doDeleteBj.oralSwabsTime"></el-date-picker>
          </el-form-item>
        </template>
        <el-form-item  v-if="formData.sampleTypesBj.includes('组织样本')" label="组织样本信息：" prop="sampleTypeByOraginBj">
          <el-checkbox v-model="formData.sampleTypeByOraginBj" v-for="(item,index) in sampleTypeByOraginList" :key="index" :label="item"></el-checkbox>
        </el-form-item>
        <template v-if="formData.sampleTypeByOraginBj.includes('手术组织石蜡切片（白片）')">
          <el-form-item label="手术组织石蜡切片（白片）数量：" label-width="290px">
            <el-row type="flex" justify="center"><el-input v-model="formData.doDeleteBj.paraffinNumber"></el-input>&nbsp;片</el-row>
          </el-form-item>
          <el-form-item label="手术组织石蜡切片（白片）样本手术日期：" label-width="290px" prop="doDeleteBj.paraffinTime">
            <el-date-picker type="date" value-format="timestamp" v-model="formData.doDeleteBj.paraffinTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="手术组织石蜡切片取样部位：" label-width="290px" prop="doDeleteBj.paraffinSamplePart">
            <el-input v-model="formData.doDeleteBj.paraffinSamplePart"></el-input>
          </el-form-item>
        </template>
        <template v-if="formData.sampleTypeByOraginBj.includes('穿刺组织石蜡切片（白片）')">
          <el-form-item label="穿刺组织石蜡切片（白片）数量：" label-width="290px">
            <el-row type="flex" justify="center">
              <el-input v-model="formData.doDeleteBj.tissueNumber"></el-input>&nbsp;片
            </el-row>
          </el-form-item>
          <el-form-item label="穿刺组织石蜡切片（白片）样本手术日期：" label-width="290px" prop="doDeleteBj.tissueTime">
            <el-date-picker type="date" value-format="timestamp" v-model="formData.doDeleteBj.tissueTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="穿刺组织石蜡切片取样部位：" label-width="290px" prop="doDeleteBj.paraffinSamplePart">
            <el-input v-model="formData.doDeleteBj.tissueSamplePart"></el-input>
          </el-form-item>
        </template>
        <template v-if="formData.sampleTypeByOraginBj.includes('蜡块（手术组织）')">
          <el-row>
            <el-form-item label="蜡块（手术组织）数量：" label-width="180px">
              <el-input style="width:350px" v-model="formData.doDeleteBj.blockNumber"></el-input>&nbsp;&nbsp;块
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="蜡块（手术组织）样本手术日期：" label-width="250px" prop="doDeleteBj.blockTime">
              <el-date-picker type="date" value-format="timestamp" v-model="formData.doDeleteBj.blockTime"></el-date-picker>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="蜡块（手术组织）取样部位："  label-width="250px" prop="doDeleteBj.blockSamplePart">
              <el-input v-model="formData.doDeleteBj.blockSamplePart"></el-input>
            </el-form-item>
        </el-row>
      </template>
       <template v-if="formData.sampleTypeByOraginBj.includes('蜡块（穿刺组织）')">
          <el-row>
            <el-form-item label="蜡块（穿刺组织）数量：" label-width="180px">
              <el-input style="width:350px" v-model="formData.doDeleteBj.blockPuncturedNumber"></el-input>&nbsp;&nbsp;块
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="蜡块（穿刺组织）样本手术日期：" label-width="250px" prop="doDeleteBj.blockPuncturedTime">
              <el-date-picker type="date" value-format="timestamp" v-model="formData.doDeleteBj.blockPuncturedTime"></el-date-picker>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="蜡块（穿刺组织）取样部位："  label-width="250px" prop="doDeleteBj.blockPuncturedSamplePart">
              <el-input v-model="formData.doDeleteBj.blockPuncturedSamplePart"></el-input>
            </el-form-item>
        </el-row>
      </template>
        <el-row v-if="formData.sampleTypeByOraginBj.includes('蜡块（手术组织）') || formData.sampleTypeByOraginBj.includes('蜡块（穿刺组织）')">
           <el-form-item label="是否样本归还：" prop="doDeleteBj.isReturn">
              <el-radio-group v-model="formData.doDeleteBj.isReturn">
                <el-radio :label="'是'">是</el-radio>
                <el-radio :label="'否'">否</el-radio>
              </el-radio-group>
            </el-form-item>
        </el-row>
        <template v-if="formData.sampleTypeByOraginBj.includes('新鲜手术组织')">
          <el-form-item label="新鲜手术组织数量：">
            <el-row>
              <el-col :span="11">
                <el-row type="flex" justify="baseline"><span>RNAlater</span>&nbsp;<el-input style="width:150px" v-model="formData.doDeleteBj.freshSurgicalNumber"></el-input>&nbsp;&nbsp;管</el-row>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-row type="flex" justify="baseline"><span>10%福尔马林</span>&nbsp;<el-input style="width:150px" v-model="formData.doDeleteBj.freshSurgicalFuNumber"></el-input>&nbsp;&nbsp;管</el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="新鲜手术组织样本手术日期：" label-width="211px" prop="doDeleteBj.freshSurgicalTime">
            <el-date-picker type="date" value-format="timestamp" v-model="formData.doDeleteBj.freshSurgicalTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="新鲜手术组织取样部位："  label-width="200px" prop="doDeleteBj.freshSurgicalSamplePart">
            <el-input v-model="formData.doDeleteBj.freshSurgicalSamplePart"></el-input>
          </el-form-item>
        </template>
        <template v-if="formData.sampleTypeByOraginBj.includes('新鲜穿刺组织')">
          <el-form-item label="新鲜穿刺组织数量：">
            <el-row>
              <el-col :span="11">
                <el-row type="flex" justify="baseline"><span>RNAlater</span>&nbsp;<el-input style="width:150px" v-model="formData.doDeleteBj.puncturedNumber"></el-input>&nbsp;&nbsp;管</el-row>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-row type="flex" justify="baseline"><span>10%福尔马林</span>&nbsp;<el-input style="width:150px" v-model="formData.doDeleteBj.puncturedFuNumber"></el-input>&nbsp;&nbsp;管</el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="新鲜穿刺组织样本手术日期：" label-width="211px" prop="doDeleteBj.puncturedTime">
            <el-date-picker type="date" value-format="timestamp" v-model="formData.doDeleteBj.puncturedTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="新鲜穿刺组织取样部位："  label-width="200px" prop="doDeleteBj.puncturedSamplePart">
            <el-input v-model="formData.doDeleteBj.puncturedSamplePart"></el-input>
          </el-form-item>
        </template>
        <template v-if="formData.sampleTypeByOraginBj.includes('胸腹水')">
        <el-form-item label="胸腹水数量：">
            <el-row>
              <el-col :span="11">
                <el-row type="flex" justify="baseline"><el-input v-model="formData.doDeleteBj.chestWaterNumber"></el-input>&nbsp;&nbsp;瓶</el-row>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-row type="flex" justify="baseline"><el-input v-model="formData.doDeleteBj.chestWaterCapacity"></el-input>&nbsp;&nbsp;ml</el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="胸腹水样本手术日期："  label-width="211px" prop="doDeleteBj.chestWaterTime">
            <el-date-picker type="date" value-format="timestamp" v-model="formData.doDeleteBj.chestWaterTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="胸腹水取样部位："  label-width="200px" prop="doDeleteBj.chestWaterPart">
            <el-input v-model="formData.doDeleteBj.chestWaterPart"></el-input>
          </el-form-item>
       </template>
        <template v-if="formData.doDeleteBj.isReturn==='是'">
          <h4>补寄剩余组织样本归还</h4>
          <el-form-item label="归还联系人：" label-width="140px" prop="waxOrderReceiverBj.receiver">
            <el-input v-model="formData.waxOrderReceiverBj.receiver"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话：" label-width="140px" prop="waxOrderReceiverBj.cellphone">
            <el-input v-model="formData.waxOrderReceiverBj.cellphone"></el-input>
          </el-form-item>
          <el-form-item label="归还地址：" label-width="140px" prop="waxOrderReceiverBj.allAddress">
            <el-cascader
              v-model="formData.waxOrderReceiverBj.allAddress"
              :options="addressOptions"
              @change="handleChangAddress($event,'waxOrderReceiverBj')"></el-cascader>
          </el-form-item>
          <el-form-item label="归还详细地址：" label-width="140px" prop="waxOrderReceiverBj.address">
            <el-input type="textarea" v-model="formData.waxOrderReceiverBj.address"></el-input>
          </el-form-item>
        </template>
      </template>
      <el-row class="button-box">
        <el-button size="small" @click="$router.push('/informed/list')">取消</el-button>
        <el-button @click="submitForm('formData')" type="primary" size="small">提交</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  props:['data'],
  data(){
    return{
      searchKey:'',
      pageNum:1,
      projects:[],//送检项目下拉
      orderNo:'',
      pageSize:100,
      finished:false,
      selectLoading:false,//下拉加载
      hospitalList:[],//送检医院
      deptList:[],//送检科室
      tumorTypesList:[],//肿瘤类型
      pathologicTypesList:[],//病理类型
      clinicalStagingList:['Ⅰ期','Ⅱ期','Ⅲ期','Ⅳ期'],//临床分期
      sampleTypesSelectList:['外周血（EDTA 采血管）','外周血（Streck 采血管）','口腔拭子','组织样本'],
      sampleTypeByOraginList:['手术组织石蜡切片（白片）','穿刺组织石蜡切片（白片）','蜡块（手术组织）','蜡块（穿刺组织）','新鲜手术组织','新鲜穿刺组织','胸腹水'],
      addressOptions:regionData,//省市区数据
      CodeToText: CodeToText,
      TextToCode: TextToCode,
      isEdit:false,//默认不显示补寄
      formData: {
        fileId:0,
        solutionId:0,
        orderId:0,
        groupId:0,
        labSampleCode:'',
        sampleTypesBj:[],//补寄样本类型
        sampleTypeByOraginBj:[],//补寄组织样本类型
        orderRevceiveAllAddreaa:[],//报告接收完整地址
        sampleTypes:[],//样本类型集合
        sampleTypeByOragin:[],//组织样本信息
        familyInformations:[],//家族史
        doDeleteBj:{
          chestWaterPart:'',//胸腹水取样部位
          chestWaterNumber:'',//胸腹水数量
          chestWaterCapacity:'',//胸腹水容量
          chestWaterTime:'',//胸腹水样本手术日期
          blockPuncturedSamplePart:'',//蜡块（穿刺组织）取样部位
          blockPuncturedTime:'',//蜡块（穿刺组织）样本手术日期
          blockPuncturedNumber:'',//蜡块（穿刺组织）数量
          tissueSamplePart:'',//穿刺组织石蜡切片取样部位
          tissueTime:'',//穿刺组织石蜡切片手术日期
          paraffinSamplePart:'',//手术组织石蜡切片取样部位
          paraffinTime:'',//手术组织切片手术日期
          puncturedSamplePart:'',//新鲜穿刺取样部位
          puncturedTime:'',//新鲜穿刺样本手术日期
          puncturedFuNumber:'',//新鲜穿刺福尔马林数量
          puncturedNumber:'',//新鲜穿刺数量
          freshSurgicalSamplePart:'',//新鲜手术组织取样部位
          freshSurgicalTime:'',//心想手术样本手术日期
          freshSurgicalFuNumber:'',//新鲜手术组是福尔马琳数量
          freshSurgicalNumber:'',//新鲜手术组织数量
          blockSamplePart:'',//蜡块取样部位
          blockTime:'',//蜡块样本手术日期
          blockNumber:'',//蜡块数量
          tissueNumber:'',//穿刺组织石蜡切片（白片）数量
          paraffinNumber:'',//手术组织石蜡切片（白片）数量
          oralSwabsTime:'',//口腔拭子采样日期
          oralSwabsNumber:'',//口腔拭子数量
          peripheralBloodCapacityStreck:'',//外周血（Streck 采血管）数量
          peripheralBloodCapacityCapacityStreck:'',//外周血（Streck 采血管）容量
          sampleTimeStreck:'',//外周血（Streck 采血管）采样日期
          sampleTimeEdta:'',//外周血（EDTA 采血管）采样日期
          peripheralBloodNumber:'',//外周血（EDTA 采血管）数量
          peripheralBloodCapacity:'',//外周血（EDTA 采血管）容量
          isReturn:''//是否样本归还
        },
        doDelete:{
          chestWaterPart:'',//胸腹水取样部位
          chestWaterNumber:'',//胸腹水数量
          chestWaterCapacity:'',//胸腹水容量
          chestWaterTime:'',//胸腹水样本手术日期
          blockPuncturedSamplePart:'',//蜡块（穿刺组织）取样部位
          blockPuncturedTime:'',//蜡块（穿刺组织）样本手术日期
          blockPuncturedNumber:'',//蜡块（穿刺组织）数量
          tissueSamplePart:'',//穿刺组织石蜡切片取样部位
          tissueTime:'',//穿刺组织石蜡切片手术日期
          paraffinSamplePart:'',//手术组织石蜡切片取样部位
          paraffinTime:'',//手术组织切片手术日期
          puncturedSamplePart:'',//新鲜穿刺取样部位
          puncturedTime:'',//新鲜穿刺样本手术日期
          puncturedFuNumber:'',//新鲜穿刺福尔马林数量
          puncturedNumber:'',//新鲜穿刺数量
          freshSurgicalSamplePart:'',//新鲜手术组织取样部位
          freshSurgicalTime:'',//心想手术样本手术日期
          freshSurgicalFuNumber:'',//新鲜手术组是福尔马琳数量
          freshSurgicalNumber:'',//新鲜手术组织数量
          blockSamplePart:'',//蜡块取样部位
          blockTime:'',//蜡块样本手术日期
          blockNumber:'',//蜡块数量
          tissueNumber:'',//穿刺组织石蜡切片（白片）数量
          paraffinNumber:'',//手术组织石蜡切片（白片）数量
          oralSwabsTime:'',//口腔拭子采样日期
          oralSwabsNumber:'',//口腔拭子数量
          peripheralBloodCapacityStreck:'',//外周血（Streck 采血管）数量
          peripheralBloodCapacityCapacityStreck:'',//外周血（Streck 采血管）容量
          sampleTimeStreck:'',//外周血（Streck 采血管）采样日期
          sampleTimeEdta:'',//外周血（EDTA 采血管）采样日期
          peripheralBloodNumber:'',//外周血（EDTA 采血管）数量
          peripheralBloodCapacity:'',//外周血（EDTA 采血管）容量
          isReturn:''//是否样本归还
        },
        waxOrderReceiverBj:{
          receiver:'',
          allAddress:'',//全地址
          cellphone:'',
          province:'',
          city:'',
          county:'',
          address:''
        },
        waxOrderReceiver:{
          receiver:'',
          allAddress:'',//全地址
          cellphone:'',
          province:'',
          city:'',
          county:'',
          address:''
        },
        patient:{
          truename:'',
          sex:'',
          birthday:0,
          idCode:''
        },
        orderReceiver:{
          receiver:'',
          cellphone:'',
          province:'',
          city:'',
          county:'',
          address:''},
        samplingVo:{
          orderNo:'',//订单编号
          sampleCode:'',
          sampleTypes:[]
        },
        sampleVoBJ:{
          orderNo:'',//订单编号
          sampleCode:'',
          sampleTypes:[]
        },
        inspectVo:{
          doctor:'',
          hospitalId:'',
          deptId:'',
          // hospitalName:'',
          // deptName:''
        },
        diseaseVo:{
          pathologicalId:0,
          tumorId:0,
          tumorName:'',
          pathologiclName:'',
          clinicalStages:'',
          firstConfirmedDate:0,
          familyHistory:'',
          familyInformations:[],
          pathologicTypesOther:''
        }
      },
      formDataRules:{
        solutionId:[
          { required: true, message: '请选择送检项目', trigger: 'change' }
        ],
        "doDelete.sampleTimeEdta":[
          { required: true, message: '请选择外周血（EDTA采血管）采样日期', trigger: 'change' }
        ],
        "doDelete.sampleTimeStreck":[
          { required: true, message: '请选择外周血（Streck采血管）采样日期', trigger: 'change' }
        ],
        "patient.truename":[
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        "patient.sex":[
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        "patient.birthday":[
          { required: true, message: '请选择出生年月', trigger: 'change' }
        ],
        "patient.idCode":[
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号' }
        ],
        "orderReceiver.receiver":[
          { required: true, message: '请输入报告接收人', trigger: 'blur' }
        ],
        "orderReceiver.cellphone":[
          { required: true, message: '请输入报告接收人电话', trigger: 'blur' },
          { pattern: /^1[2-9]\d{9}$/, message: '请输入正确的电话号码' }
        ],
        orderRevceiveAllAddreaa:[
          { required: true, message: '请选择报告邮寄地址', trigger: 'change' }
        ],
        "orderReceiver.address":[
          { required: true, message: '请输入报告邮寄详细地址', trigger: 'blur' }
        ],
        "samplingVo.sampleCode":[
          { required: true, message: '请输入样本编号', trigger: 'blur' }
        ],
        sampleTypes:[
          { required: true, message: '请选择样本类型', trigger: 'change' }
        ],
        sampleTypeByOragin:[
          { required: true, message: '请选择组织样本信息', trigger: 'change' }
        ],
        "doDelete.chestWaterTime":[
           { required: true, message: '请选择胸腹水样本手术日期', trigger: 'change' }
        ],
        "doDelete.chestWaterPart":[
           { required: true, message: '请输入胸腹水取样部位', trigger: 'blur' }
        ],
        "doDelete.paraffinTime":[
          { required: true, message: '请选择手术组织石蜡切片（白片）手术日期', trigger: 'change' }
        ],
        "doDelete.blockPuncturedTime":[
          { required: true, message: '请选择蜡块（穿刺组织）手术日期', trigger: 'change' }
        ],
        "doDelete.paraffinSamplePart":[
          { required: true, message: '请输入手术组织石蜡切片取样部位', trigger: 'blur' }
        ],
        "doDelete.tissueTime":[
          { required: true, message: '请选择穿刺组织石蜡切片（白片）手术日期', trigger: 'change' }
        ],
        "doDelete.paraffinSamplePart":[
          { required: true, message: '请输入穿刺组织石蜡切片取样部位', trigger: 'blur' }
        ],
        "doDelete.blockTime":[
          { required: true, message: '请选择蜡块样本手术日期', trigger: 'change' }
        ],
        "doDelete.blockPuncturedSamplePart":[
          { required: true, message: '请输入蜡块（穿刺组织）取样部位', trigger: 'blur' }
        ],
        "doDelete.blockSamplePart":[
          { required: true, message: '请输入蜡块样本取样部位', trigger: 'blur' }
        ],
        "doDelete.isReturn":[
          { required: true, message: '请选择是否样本归还', trigger: 'change' }
        ],
        "waxOrderReceiver.receiver":[
          { required: true, message: '请输入归还联系人', trigger: 'blur' }
        ],
        "waxOrderReceiver.cellphone":[
          { required: true, message: '请输入归还联系人电话', trigger: 'blur' },
          { pattern: /^1[2-9]\d{9}$/, message: '请输入正确的电话号码' }
        ],
        "waxOrderReceiver.allAddress":[
          { required: true, message: '请选择归还地址', trigger: 'change' }
        ],
        "waxOrderReceiver.address":[
          { required: true, message: '请输入归还详细地址', trigger: 'change' }
        ],
        "doDelete.freshSurgicalTime":[
          { required: true, message: '请选择新鲜手术样本手术日期', trigger: 'change' }
        ],
        "doDelete.freshSurgicalSamplePart":[
          { required: true, message: '请输入新鲜手术取样部位', trigger: 'blur' }
        ],
        "doDelete.puncturedTime":[
          { required: true, message: '请选择新鲜穿刺组织样本手术日期', trigger: 'change' }
        ],
        "doDelete.puncturedSamplePart":[
          { required: true, message: '请输入新鲜穿刺组织取样部位', trigger: 'blur' }
        ],
        "inspectVo.hospitalId":[
          { required: true, message: '请选择送检医院', trigger: 'change' }
        ],
        "inspectVo.deptId":[
          { required: true, message: '请选择送检科室', trigger: 'change' }
        ],
        "inspectVo.doctor":[
          { required: true, message: '请输入送检大夫', trigger: 'blur' }
        ],
        "diseaseVo.tumorName":[
          { required: true, message: '请选择肿瘤类型', trigger: 'change' }
        ],
        "diseaseVo.firstConfirmedDate":[
          { required: true, message: '请选择初次确诊时间', trigger: 'change' }
        ],
        "diseaseVo.familyHistory":[
          { required: true, message: '请选择是否有癌症家族史', trigger: 'change' }
        ],
        "diseaseVo.pathologicTypesOther":[
          { required: true, message: '请输入病理类型-其他', trigger: 'blur' }
        ],
        "samplingVo.orderNo":[
          { required: true, message: '请输入订单编号', trigger: 'blur' }
        ],
        "doDelete.tissueSamplePart":[
          { required: true, message: '请输入穿刺组织石蜡切片取样部位', trigger: 'blur' }
        ]
      }
    }
  },
  watch:{
    "formData.diseaseVo.tumorName":{
      handler:function (a,b) {
        const temp = ['局部期前列腺癌','转移性激素敏感性前列腺癌','去势抵抗性前列腺癌','其他']
        if(a==='前列腺癌'){
          this.clinicalStagingList = this.clinicalStagingList.concat(temp)
        }else{
          this.clinicalStagingList = ['Ⅰ期','Ⅱ期','Ⅲ期','Ⅳ期']
          if(temp.includes(this.formData.diseaseVo.clinicalStages)){
            this.formData.diseaseVo.clinicalStages = ''
          }
        }
        //当肿瘤类型改变，病理类型值清空
        if(b){
          this.formData.diseaseVo.pathologiclName = ''
        }
        //根据不同的肿瘤类型查找不同的病理类型
        const subSelectItem = this.tumorTypesList.find((item)=>{
          if(item.desc === a){
            return item.subSelect

          }
        })
        this.pathologicTypesList = subSelectItem?subSelectItem.subSelect:[]
      }
    },
    "formData.diseaseVo.familyHistory":{
      handler:function (a,b) {
        if(!b)return
        if(a==='有'){
          this.formData.familyInformations = [{}]
        }else{
          this.formData.familyInformations = []
        }
      }
    }
  },
  mounted() {
    //初始话参数处理
    this.getTumorTypesList()
    this.getInformated()
    this.getOrderNo()
    this.getProject()
    this.setCreatedParam()
    this.getHospital('',true)
    this.getDeptList()
  },
  methods:{
    /*提交*/
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.formData.sampleVoBJ)
          if(this.formData.sampleVoBJ.sampleCode && this.formData.sampleVoBJ.orderNo){
            this.deleteParam('doDeleteBj','sampleTypesBj','sampleTypeByOraginBj','waxOrderReceiverBj')
          }else{
            this.deleteParam('doDelete','sampleTypes','sampleTypeByOragin','waxOrderReceiver')
          }
        } else {
          return false;
        }
      });
    },
    /*删除参数 deleteItem:删除的对象 type样本类型 orangeType:组织样本类型，receiver:归还地址*/
    deleteParam(deleteItem,type,orangeType,receiver){
      if(!this.formData[type].includes('外周血（EDTA 采血管）')){
        this.formData[deleteItem].peripheralBloodCapacity = ''
        this.formData[deleteItem].peripheralBloodNumber = ''
        this.formData[deleteItem].sampleTimeEdta = ''
      }
      if(!this.formData[type].includes('外周血（Streck 采血管）')){
        this.formData[deleteItem].sampleTimeStreck = ''
        this.formData[deleteItem].peripheralBloodCapacityCapacityStreck = ''
        this.formData[deleteItem].peripheralBloodCapacityStreck = ''
      }
      if(!this.formData[type].includes('口腔拭子')){
        this.formData[deleteItem].oralSwabsNumber = ''
        this.formData[deleteItem].oralSwabsTime = ''
      }
      if(!this.formData[type].includes('组织样本')){
        this.formData[orangeType] = []
        this.formData[receiver]={}
      }
      if(!this.formData[orangeType].includes('手术组织石蜡切片（白片）')){
        this.formData[deleteItem].paraffinNumber = ''
        this.formData[deleteItem].paraffinTime = ''
        this.formData[deleteItem].paraffinSamplePart = ''
      }
      if(!this.formData[orangeType].includes('穿刺组织石蜡切片（白片）')){
        this.formData[deleteItem].tissueNumber = ''
        this.formData[deleteItem].tissueTime = ''
        this.formData[deleteItem].tissueSamplePart = ''
      }
      if(!this.formData[orangeType].includes('蜡块（手术组织）')){
        this.formData[deleteItem].blockNumber = ''
        this.formData[deleteItem].blockTime = ''
        this.formData[deleteItem].blockSamplePart = ''
      }
      if(!this.formData[orangeType].includes('蜡块（穿刺组织）')){
        this.formData[deleteItem].blockPuncturedNumber = ''
        this.formData[deleteItem].blockPuncturedTime = ''
        this.formData[deleteItem].blockPuncturedSamplePart = ''
      }
      if(!this.formData[orangeType].includes('新鲜手术组织')){
        this.formData[deleteItem].freshSurgicalNumber = ''
        this.formData[deleteItem].freshSurgicalTime = ''
        this.formData[deleteItem].freshSurgicalSamplePart = ''
      }
      if(!this.formData[orangeType].includes('新鲜穿刺组织')){
        this.formData[deleteItem].puncturedNumber = ''
        this.formData[deleteItem].puncturedTime = ''
        this.formData[deleteItem].puncturedSamplePart = ''
      }
      if(!this.formData[orangeType].includes('胸腹水')){
        this.formData[deleteItem].chestWaterNumber = ''
        this.formData[deleteItem].chestWaterTime = ''
        this.formData[deleteItem].chestWaterCapacity = ''
      }
      this.formData.samplingVo.sampleTypes =  this.samplingVoParam('sampleTypes','doDelete').concat(this.samplingVoParamSub('sampleTypeByOragin','doDelete','waxOrderReceiver'))
      if(this.formData.sampleVoBJ){
        this.formData.sampleVoBJ.sampleTypes =  this.samplingVoParam('sampleTypesBj','doDeleteBj').concat(this.samplingVoParamSub('sampleTypeByOraginBj','doDeleteBj','waxOrderReceiverBj'))
      }
      delete this.formData.orderRevceiveAllAddreaa
      delete this.formData.sampleTypes
      delete this.formData.sampleTypeByOragin
      delete this.formData.doDelete
      delete this.formData.sampleTypesBj
      delete this.formData.sampleTypeByOraginBj
      delete this.formData.doDeleteBj
      delete this.formData.waxOrderReceiver
      delete this.formData.waxOrderReceiverBj
      this.formData.orderNo = this.orderNo
      this.formData.samplingVoBj = JSON.parse(JSON.stringify(this.formData.sampleVoBJ))
      delete this.formData.sampleVoBJ
      this.formData.diseaseVo.familyInformations = this.formData.familyInformations
      delete this.formData.familyInformations
      console.log(JSON.stringify(this.formData))
      this.setPost()
    },
    /*删除行*/
    deleteItem(index){
      if(this.formData.familyInformations.length!==1){
        this.formData.familyInformations.splice(index, 1)
      }
      this.$forceUpdate()
    },
    /*清除送检项目*/
    clearProject(){
      this.formData.solutionId=''
    },
    /*获取送检项目下拉*/
    getProject() {
      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.projects = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    /*提交接口*/
    setPost(){
      this.axios.put('/informed/pr/'+ this.$route.query.informedId,{
        ...this.formData
      }).then(res => {
        if (res.data.message === '保存成功') {
          this.$message({
            message: '编辑成功',
            type: 'success'
          });
          this.$router.push('/informed/list')
        } else {
          this.$message({
            message: '编辑失败',
            type: 'warning'
          });
        }
      })
    },
    /*获取订单信息*/
    getOrderNo(){
      this.axios.get('informed/' + this.$route.query.informedId, {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
      }).then(res => {
        this.orderNo = res.data.orderNo
        this.formData.orderNo = res.data.orderNo
      })
    },
    /*详情*/
    getInformated() {
      this.axios.get('/ru6c/informed/PRinfo', {
        params: {
          sampleCode: this.data.sampleCode}
      }).then(res => {
        this.formData.labSampleCode = res.data.labSampleCode
        this.formData.samplingVo = res.data.sampleVo ?res.data.sampleVo:{}
        this.formData.patient = res.data.patient
        this.formData.inspectVo = res.data.inspectVo
        this.formData.diseaseVo = res.data.diseaseVo
        this.formData.orderReceiver =res.data.orderReceiver
        this.formData.orderNo = this.orderNo
        if(res.data.diseaseVo.familyInformations){
          this.formData.familyInformations = res.data.diseaseVo.familyInformations
        }
        //邮寄地址处理
        this.addressSee(res.data.orderReceiver,'orderRevceiveAllAddreaa')
        if(res.data.sampleVoBJ){
          this.isEdit = true
          this.formData.sampleVoBJ = res.data.sampleVoBJ
          this.getDetail(res.data,'sampleVoBJ','sampleTypesBj','sampleTypeByOraginBj','doDeleteBj','waxOrderReceiverBj')
        }
        if(res.data.sampleVo){
          this.getDetail(res.data,'sampleVo','sampleTypes','sampleTypeByOragin','doDelete','waxOrderReceiver')
        }
      })
    },
    /*地址回显处理*/
    addressSee(data,type,subType){
      const orderProvince = TextToCode[data.province].code
      const orderCityTemp = data.province === data.city?'市辖区':data.city
      const orderCity = this.TextToCode[data.province][orderCityTemp].code
      const orderCounty = this.TextToCode[data.province][orderCityTemp][data.county].code
      if(subType){
        this.formData[type][subType]= [orderProvince,orderCity,orderCounty]
      }else{
        this.formData[type]= [orderProvince,orderCity,orderCounty]
      }
    },
    /*页面回显处理,data:接口返回的数据， type:最外层对象名称，sampleType：样本类型名称，sampleOrangeType:组织样本类型名称，deleteItem:删除的对象名称,reveiver:邮寄地址*/
    getDetail(data,type,sampleType,sampleOrangeType,deleteItem,reveiver){
      const sampleTypes = data[type].sampleTypes.filter(item=>{
        return this.sampleTypesSelectList.includes(item.sampleType)
      })
      this.formData[sampleType] = sampleTypes.map(item=>{
        return item.sampleType
      })
      const sampleOrangeTyeps =  data[type].sampleTypes.filter(item=>{
        return this.sampleTypeByOraginList.includes(item.sampleType)
      })
      if(sampleOrangeTyeps.length!==0){
        this.formData[sampleType].push('组织样本')
      }
      this.formData[sampleOrangeType] = sampleOrangeTyeps.map(item=>{
        return item.sampleType
      })
      for(let i=0;i<data[type].sampleTypes.length;i++){
        const obj = data[type].sampleTypes[i]
        switch (obj.sampleType) {
          case '外周血（EDTA 采血管）':
            this.formData[deleteItem].peripheralBloodNumber = obj.saveTypes[0].quantity
            this.formData[deleteItem].peripheralBloodCapacity = obj.capacity
            this.formData[deleteItem].sampleTimeEdta = obj.samplingDate
            break
          case '外周血（Streck 采血管）':
            this.formData[deleteItem].sampleTimeStreck = obj.samplingDate
            this.formData[deleteItem].peripheralBloodCapacityCapacityStreck = obj.capacity
            this.formData[deleteItem].peripheralBloodCapacityStreck = obj.saveTypes[0].quantity
            break
          case '口腔拭子':
            this.formData[deleteItem].oralSwabsNumber = obj.saveTypes[0].quantity
            this.formData[deleteItem].oralSwabsTime = obj.samplingDate
            break
          case '手术组织石蜡切片（白片）':
            this.formData[deleteItem].paraffinNumber = obj.saveTypes[0].quantity
            this.formData[deleteItem].paraffinTime = obj.sampleOpera
            this.formData[deleteItem].paraffinSamplePart = obj.samplingLoca
            break
          case '穿刺组织石蜡切片（白片）':
            this.formData[deleteItem].tissueNumber = obj.saveTypes[0].quantity
            this.formData[deleteItem].tissueTime = obj.sampleOpera //tissueTime
            this.formData[deleteItem].tissueSamplePart = obj.samplingLoca //paraffinSamplePart
            break
          case '蜡块（手术组织）':
            this.formData[deleteItem].blockNumber = obj.saveTypes[0].quantity
            this.formData[deleteItem].blockTime = obj.sampleOpera
            this.formData[deleteItem].blockSamplePart = obj.samplingLoca
            if(Object.keys(obj.waxOrderReceiver).length !== 0) {
              this.formData[deleteItem].isReturn = '是'
              this.formData[reveiver] = obj.waxOrderReceiver
              if(reveiver === 'waxOrderReceiverBj'){
              //归还地址处理
              this.addressSee(this.formData[reveiver],'waxOrderReceiverBj','allAddress')
              }else{
              this.addressSee(this.formData[reveiver],'waxOrderReceiver','allAddress')
              }
            }else{
              this.formData[deleteItem].isReturn = '否'
            }
            break
          case '蜡块（穿刺组织）':
            this.formData[deleteItem].blockPuncturedNumber = obj.saveTypes[0].quantity
            this.formData[deleteItem].blockPuncturedTime = obj.sampleOpera
            this.formData[deleteItem].blockPuncturedSamplePart = obj.samplingLoca
            if(Object.keys(obj.waxOrderReceiver).length !== 0) {
              this.formData[deleteItem].isReturn = '是'
              this.formData[reveiver] = obj.waxOrderReceiver
              if(reveiver === 'waxOrderReceiverBj'){
              //归还地址处理
              this.addressSee(this.formData[reveiver],'waxOrderReceiverBj','allAddress')
              }else{
              this.addressSee(this.formData[reveiver],'waxOrderReceiver','allAddress')
              }
            }else{
              this.formData[deleteItem].isReturn = '否'
            }
            break
          case '新鲜手术组织':
            this.formData[deleteItem].freshSurgicalTime = obj.sampleOpera
            this.formData[deleteItem].freshSurgicalSamplePart = obj.samplingLoca
            obj.saveTypes.forEach(item => {
              if(item.saveType === '10%福尔马林'){
                this.formData[deleteItem].freshSurgicalFuNumber = item.quantity
              }else if(item.saveType === 'RNAlater'){
                this.formData[deleteItem].freshSurgicalNumber = item.quantity
              }
            });
            break
          case '新鲜穿刺组织':
            this.formData[deleteItem].puncturedTime = obj.sampleOpera
            this.formData[deleteItem].puncturedSamplePart = obj.samplingLoca
            obj.saveTypes.forEach(item => {
              if(item.saveType === '10%福尔马林'){
                this.formData[deleteItem].puncturedFuNumber = item.quantity
              }else if(item.saveType === 'RNAlater'){
                this.formData[deleteItem].puncturedNumber = item.quantity
              }
            });
            break
          case '胸腹水':
            this.formData[deleteItem].chestWaterTime = obj.sampleOpera
            this.formData[deleteItem].chestWaterPart = obj.samplingLoca
            this.formData[deleteItem].chestWaterNumber = obj.saveTypes[0].quantity
            this.formData[deleteItem].chestWaterCapacity = obj.capacity
            break
        }
      }
    },
    /*日期格式转化*/
    formatDate(date) {
      let dateStr = new Date(date);
      const YY = dateStr.getFullYear() + '-';
      const MM = (dateStr.getMonth() + 1 < 10 ? '0' + (dateStr.getMonth() + 1) : dateStr.getMonth() + 1) + '-';
      const DD = (dateStr.getDate() < 10 ? '0' + (dateStr.getDate()) : dateStr.getDate());
      return YY + MM + DD;
    },
    /*初始化参数处理*/
    setCreatedParam(){
      this.formData.orderId = this.data.orderId?Number(this.data.orderId):0
      this.formData.groupId = 7
      this.formData.solutionId = this.data.solutionId?Number(this.data.solutionId):0
      this.formData.fileId = this.data.fileId?Number(this.data.fileId):0
    },
    /*参数处理 type样本类型，deleteItem要删除的对象*/
    samplingVoParam(type,deleteItem){
      let list = []
      let param = {}
      for(let i=0;i<this.formData[type].length;i++){
        switch (this.formData[type][i]) {
          case '外周血（EDTA 采血管）':
            param = {
              sampleType:'外周血（EDTA 采血管）',
              samplingDate:this.formData[deleteItem].sampleTimeEdta,
              capacity:this.formData[deleteItem].peripheralBloodCapacity?Number(this.formData[deleteItem].peripheralBloodCapacity):'',
              // quantity:this.formData[deleteItem].peripheralBloodNumber?Number(this.formData[deleteItem].peripheralBloodNumber):'',
              saveTypes:[{quantity:this.formData[deleteItem].peripheralBloodNumber?Number(this.formData[deleteItem].peripheralBloodNumber):''}],
              unit:'管'
            }
            list.push(param)
            break
          case '外周血（Streck 采血管）':
            param = {
              sampleType:'外周血（Streck 采血管）',
              samplingDate:this.formData[deleteItem].sampleTimeStreck ? new Date(this.formData[deleteItem].sampleTimeStreck).getTime():'',
              capacity:this.formData[deleteItem].peripheralBloodCapacityCapacityStreck?Number(this.formData[deleteItem].peripheralBloodCapacityCapacityStreck):'',
              // quantity:this.formData[deleteItem].peripheralBloodCapacityStreck?Number(this.formData[deleteItem].peripheralBloodCapacityStreck):'',
              saveTypes:[{quantity:this.formData[deleteItem].peripheralBloodCapacityStreck?Number(this.formData[deleteItem].peripheralBloodCapacityStreck):''}],
              unit:'管'
            }
            list.push(param)
            break
          case '口腔拭子':
            param = {
              sampleType:'口腔拭子',
              samplingDate:this.formData[deleteItem].oralSwabsTime ? new Date(this.formData[deleteItem].oralSwabsTime).getTime():'',
              // quantity:this.formData[deleteItem].oralSwabsNumber?Number(this.formData[deleteItem].oralSwabsNumber):'',
              saveTypes:[{quantity:this.formData[deleteItem].oralSwabsNumber?Number(this.formData[deleteItem].oralSwabsNumber):''}],
              unit:'管'
            }
            list.push(param)
            break
        }
      }
      return list
    },
    samplingVoParamSub(type,deleteItem,receiver){
      let list = []
      let param = {}
      for(let i=0;i<this.formData[type].length;i++){
        switch (this.formData[type][i]) {
          case '手术组织石蜡切片（白片）':
            param = {
              sampleType:'手术组织石蜡切片（白片）',
              sampleOpera:this.formData[deleteItem].paraffinTime,
              samplingLoca:this.formData[deleteItem].paraffinSamplePart,
              // quantity: this.formData[deleteItem].paraffinNumber?Number(this.formData[deleteItem].paraffinNumber):'',
              saveTypes:[{quantity:this.formData[deleteItem].paraffinNumber?Number(this.formData[deleteItem].paraffinNumber):''}],
              unit:'片'
            }
            list.push(param)
            break
          case '穿刺组织石蜡切片（白片）':
            param = {
              sampleType:'穿刺组织石蜡切片（白片）',
              sampleOpera:this.formData[deleteItem].tissueTime,
              samplingLoca:this.formData[deleteItem].tissueSamplePart,
              // quantity:this.formData[deleteItem].tissueNumber?Number(this.formData[deleteItem].tissueNumber):'',
              saveTypes:[{quantity:this.formData[deleteItem].tissueNumber?Number(this.formData[deleteItem].tissueNumber):''}],
              unit:'片'
            }
            list.push(param)
            break
          case '蜡块（手术组织）':
            param = {
              sampleType:'蜡块（手术组织）',
              sampleOpera:this.formData[deleteItem].blockTime,
              samplingLoca:this.formData[deleteItem].blockSamplePart,
              // quantity:this.formData[deleteItem].blockNumber?Number(this.formData[deleteItem].blockNumber):'',
              saveTypes:[{quantity:this.formData[deleteItem].blockNumber?Number(this.formData[deleteItem].blockNumber):''}],
              unit:'块',
              waxOrderReceiver:this.formData[deleteItem].isReturn==='是'?this.formData[receiver]:{}
            }
            list.push(param)
            break
          case '蜡块（穿刺组织）':
            param = {
              sampleType:'蜡块（穿刺组织）',
              sampleOpera:this.formData[deleteItem].blockPuncturedTime,
              samplingLoca:this.formData[deleteItem].blockPuncturedSamplePart,
              // quantity:this.formData[deleteItem].blockNumber?Number(this.formData[deleteItem].blockNumber):'',
              saveTypes:[{quantity:this.formData[deleteItem].blockPuncturedNumber?Number(this.formData[deleteItem].blockPuncturedNumber):''}],
              unit:'块',
              waxOrderReceiver:this.formData[deleteItem].isReturn==='是'?this.formData[receiver]:{}
            }
            list.push(param)
            break
          case '新鲜手术组织':
            //RNAlater和福尔马林如果只填写一个另一个默认为0都需要传递
            const arrLaterOne = []
            arrLaterOne.push({quantity:this.formData[deleteItem].freshSurgicalNumber?Number(this.formData[deleteItem].freshSurgicalNumber):0,
                              saveType:'RNAlater'})
            arrLaterOne.push({quantity:this.formData[deleteItem].freshSurgicalFuNumber?Number(this.formData[deleteItem].freshSurgicalFuNumber):0,
                              saveType:'10%福尔马林'}) 
            param = {
              sampleType:'新鲜手术组织',
              sampleOpera:this.formData[deleteItem].freshSurgicalTime,
              samplingLoca:this.formData[deleteItem].freshSurgicalSamplePart,
              // quantity:Number(this.formData[deleteItem].freshSurgicalNumber) || Number(this.formData[deleteItem].freshSurgicalFuNumber),
              saveTypes:arrLaterOne,
              unit:'片',
              // saveType:this.formData[deleteItem].freshSurgicalNumber?'RNA Later':'福尔马林'
            }
            list.push(param)
            break
          case '新鲜穿刺组织':
            //RNAlater和福尔马林如果只填写一个另一个默认为0都需要传递
            const arrLaterTwo = []
            arrLaterTwo.push({quantity:this.formData[deleteItem].puncturedNumber?Number(this.formData[deleteItem].puncturedNumber):0,
                              saveType:'RNAlater'})
            arrLaterTwo.push({quantity:this.formData[deleteItem].puncturedFuNumber?Number(this.formData[deleteItem].puncturedFuNumber):0,
                              saveType:'10%福尔马林'}) 
            param = {
              sampleType:'新鲜穿刺组织',
              sampleOpera:this.formData[deleteItem].puncturedTime,
              samplingLoca:this.formData[deleteItem].puncturedSamplePart,
              // quantity:Number(this.formData[deleteItem].puncturedNumber) ||Number(this.formData[deleteItem].puncturedFuNumber),
              unit:'片',
              saveTypes:arrLaterTwo
              // saveType:this.formData[deleteItem].freshSurgicalNumber?'RNA Later':'福尔马林'
            }
            list.push(param)
            break
          case '胸腹水':
             param = {
              sampleType:'胸腹水',
              sampleOpera:this.formData[deleteItem].chestWaterTime ? new Date(this.formData[deleteItem].chestWaterTime).getTime():'',
              samplingLoca:this.formData[deleteItem].chestWaterPart,
              capacity:this.formData[deleteItem].chestWaterCapacity?Number(this.formData[deleteItem].chestWaterCapacity):'',
              saveTypes:[{quantity:this.formData[deleteItem].chestWaterNumber?Number(this.formData[deleteItem].chestWaterNumber):''}],
              unit:'瓶'
            }
              list.push(param)
              break
        }
      }
      return list
    },
    /*获取肿瘤类型*/
    getTumorTypesList(){
      this.axios.get('/tumor/pathologicy/7').then(res => {
        this.tumorTypesList = res.data.data
        const subSelectItem = this.tumorTypesList.find((item)=>{
          if(item.desc === this.formData.diseaseVo.tumorName){
            return item.subSelect
          }
        })
        this.pathologicTypesList = subSelectItem?subSelectItem.subSelect:[]
        //病理类型
      }).catch(function (err) {
        console.log(err)
      })
    },
    /*省市区级联*/
    handleChangAddress(val,type){
      this.formData[type].province = this.CodeToText[val[0]]
      this.formData[type].city = this.CodeToText[val[1]]
      this.formData[type].county = this.CodeToText[val[2]]
    },
    /*新增亲属关系*/
    addRelation(){
      this.formData.familyInformations.push({kinship:'',confirmedAge:'',canker:''})
      this.$forceUpdate()
    },
    /*获取医院列表*/
    getHospital(val,type) {
      this.axios.get('/hospital/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          keywords: val,
        }
      }).then(res => {
        if(type){
          if (res.data.isLastPage) this.finished = true  //此处有问题 需要后台反馈
          this.hospitalList = this.hospitalList.concat(res.data.list)
        }else{
          this.hospitalList = res.data.list
        }

      })
    },
    /*清除下拉框 type:false代表科室 true代表医院*/
    clearQuery(type){
      if(type){
        this.getHospital('',false)
      }else{
        this.getDeptList('')
      }
    },
    /*防抖处理*/
    loadData(val) {
      if(val){
        let timeout = null
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          if (this.finished) return
          this.pageNum += 1
          this.getHospital(this.searchKey,true)
        }, 500)
      }
    },
    /*获取科室列表*/
    getDeptList(val) {
      this.axios.get('/hospital-dept', {
        params: {
          keywords: val
        }
      }).then(res => {
        if (res.data) {
          this.deptList = res.data
        }
      })
    },
    /*科室搜索*/
    queryDept(query){
      this.getDeptList(query)
    },
    /*医院下拉远程搜索*/
    remoteMethod(query){
      this.searchKey = query
      if (query !== '') {
        this.getHospital(query,false)
      } else {
        this.hospitalList = [];
      }
    }
  }
}
</script>

<style scoped lang="scss">
.pr-box{
  .edit-form {
  }
  .add-relation{
    margin-bottom: 20px
  }
  .button-box{
    text-align: center;
    margin-top: 50px;
  }
}
</style>
<style lang="scss">
.pr-box{
  /*.el-input--mini .el-input__inner{*/
  /*  width: 250px;*/
  /*}*/
  .el-select{
    width: 100%;
  }
  .relation-box{
    .el-input--mini .el-input__inner{
      width: 120px;
    }
  }
}
</style>
