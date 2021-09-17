<template>
  <div class="address-box">
    <div v-if="status === 1">
      <el-button size="small" style="width: 80px;margin-bottom: 10px" @click="status = 2,info = {}" type="success">新增</el-button>
      <el-table border :data="addressData" size="small">
      <el-table-column label="选择" width="80" align="center">
        <template slot-scope="{row}">
          <el-radio v-model="radioIndex"
                    @change="checkAddress(row)" :label="row.id"><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column label="收样人" prop="receiver" align="center" width="300"></el-table-column>
      <el-table-column label="电话" prop="cellphone" align="center" width="200"></el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="{row}">
          {{row.province}}{{row.city}}{{row.county}}{{row.address}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="{row}">
          <el-button size="small" type="text" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="address-form" v-else-if="status === 2">
      <el-form size="small" label-width="100px" ref="address" :model="info" :rules="rules">
      <el-form-item label="收样人" prop="receiver">
        <el-input v-model="info.receiver"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="cellphone">
        <el-input v-model="info.cellphone"></el-input>
      </el-form-item>
      <el-form-item label="省/市/县" prop="provinceAddress">
        <el-cascader v-model="info.provinceAddress" :options="options" @change="handleChangeAddress"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="info.address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="status = 1">取消</el-button>
        <el-button size="small" @click="submit('address')" type="primary">确定</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import {regionData, CodeToText, TextToCode} from 'element-china-area-data';
export default {
  props:['isCheck'],
  data(){
    /*手机号码校验*/
    const validatePhone = (rule, value, callback) => {
      if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的电话号码'));
      } else {
        callback();
      }
    };
    return{
      radioIndex:'',
      addressData:[],
      id:'',
      options:regionData,
      status:1, //显示内容 1：列表 2：编辑 3：新增
      info:{
        receiver:'',
        cellphone:'',
        province:'',
        city:'',
        county:'',
        address:'',
        provinceAddress:[]
      },
      rules:{
        receiver:[{ required: true, message: '请输入收样人', trigger: 'blur' }],
        cellphone:[{ required: true, message: '请输入电话', trigger: 'blur' },
          {validator: validatePhone, trigger: 'blur'}],
        provinceAddress:[{ required: true, message: '请选择省/市/县', trigger: 'change' }],
        address:[{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods:{
    /*设置默认值*/
    setIndex(val){
      this.radioIndex = val
    },
    /*编辑逻辑*/
    handleEdit(val){
      this.status = 2
      this.id=val.id
      this.info = val
      this.info.provinceAddress=[(TextToCode[val.province].code,
        TextToCode[val.province][val.city].code,
        TextToCode[val.province][val.city][val.county].code)]
      console.log(this.info)
      console.log(TextToCode[val.province][val.city][val.county].code)
    },
    /*提交，判断编辑和新增*/
    submit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.id){
            this.doEdit()
          }else{
            this.doAdd()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /*省市区*/
   handleChangeAddress(val) {
     this.info.province = CodeToText[val[0]]
     this.info.city = CodeToText[val[1]]
     this.info.county = CodeToText[val[2]]
    },
    /*编辑接口*/
    doEdit(){
      this.axios.put('solution/receiver',{
       id:this.id,
       ...this.info
      }).then(res => {
        if(res.data === '修改成功'){
          this.$message({message: '修改成功', type: 'success'})
          this.status = 1
          this.getList()
        }else{
          this.$message({message: '修改失败', type: 'warning'})
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /*新增接口*/
    doAdd(){
      this.axios.post('solution/receiver',{
        ...this.info
      }).then(res => {
        if (res.data.msg === '修改成功') {
          this.$message({message: '新增成功', type: 'success'})
          this.status = 1
          this.getList()
        } else {
          this.$message({message: '新增失败', type: 'warning'})
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /*获取地址列表*/
    getList(){
      this.axios.get('solution/receiver').then(res => {
        this.addressData = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    /*选中地址*/
    checkAddress(val){
      this.radioIndex = val.id
      this.$emit('address',val)
    }
  }
}
</script>

<style scoped lang="scss">
.address-box{
  margin-bottom: 20px;
  .el-radio{
    margin-left: 10px
  }
  .address-form{
    display: flex;
    justify-content: center;
    .el-form-item:last-child{
      margin-top: 40px;
    }
  }
  .el-cascader,
  .el-input{
    width: 300px;
  }
  .el-button{
    width: 80px;
  }
}
</style>
