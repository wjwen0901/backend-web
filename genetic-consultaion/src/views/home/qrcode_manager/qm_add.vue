<template>
  <el-container>
    <el-header>生成二维码</el-header>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <el-form-item label="公众号" prop="subscripType">
        <el-select placeholder="请选择公众号" v-model="ruleForm.subscripType">
          <el-option v-for="item in subscripTypeArr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请人" prop="userId">
        <el-select v-model="ruleForm.userId" filterable placeholder="请选择申请人">
          <el-option v-for="item in userArr" :key="item.id" :label="item.fullName" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="详细描述" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark "></el-input>
      </el-form-item>

      <el-form-item label="推送类型" prop="pushType">
        <el-select v-model="ruleForm.pushType" placeholder="请选择推送类型">
          <el-option v-for="item in pushTypeArr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>

      <!-- 推动内容为文字 -->
      <el-form-item label="推送内容" prop="content" v-if='ruleForm.pushType=="text"'>
          <el-input type="textarea" v-model="ruleForm.content"></el-input>
      </el-form-item>

      <!-- 推送内容为图片 -->
      <el-form-item label="上传图片" prop="file" v-if='ruleForm.pushType=="image"'>
          <input type="file" ref='inputer' name="file" @change="uploadImg">
      </el-form-item>

      <!-- 推送内容为图文链接 -->
      <div v-if='ruleForm.pushType=="article"'>
        <el-form-item label="文本标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入公众号"></el-input>
        </el-form-item>
        <el-form-item label="推送内容" prop="content">
          <el-input type="textarea" v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item label="图片链接" prop="filePath">
          <el-input v-model="ruleForm.filePath" placeholder="http://"></el-input>
        </el-form-item>
        <el-form-item label="访问链接" prop="sendUrl">
          <el-input placeholder="" v-model="ruleForm.sendUrl" class='input-send'></el-input>
          <UploadImg fileId="codeAdd" @key="getKey" css=1 index=0 uploadType="wechat-file" class='upload-btn'></UploadImg>
        </el-form-item>

      </div>


      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即生成</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </el-container>
</template>
<script>
import plupload from 'plupload';
import UploadImg from '@/components/Upload'//引入组件   ====1
export default {
  name: 'qm_add',
  components: {
    UploadImg
  },
  data() {
      var checkUrl = (rule, value, callback) => {
          if (!value) {
              return callback();
          }
          if (value) {
              setTimeout(() => {
                  var reg=/(http|https):\/\/([\w.]+\/?)\S*/;
                  if (!reg.test(value)) {
                      callback(new Error('请输入有效的地址'));
                  } else {
                      callback();
                  }
              }, 500);
          }
      };
      return {
        subscripTypeArr:[{name:'易得好康',value:'mdhcare'},{name:'易见康',value:'ru6c'},{name:'见山会诊',value:'gensultation'},{name:'测试',value:'test'}],
        userid:window.localStorage.userId,
        userArr:[],
        pushTypeArr:[{name:'文本',value:'text'},{name:'图片',value:'image'},{name:'图文素材',value:'article'}],
        ruleForm: {
          subscripType:'',
          userId:'',
          remark:'',
          pushType:'',
          content:'',
          file:'',
          title:'',
          filePath:'',
          sendUrl:''
        },
        rules: {
          subscripType: [
            { required: true, message: '请选择活动公众号', trigger: 'change' }
          ],
          userId: [
            { required: true, message: '请选择申请人', trigger: 'change' }
          ],
          remark: [
            { required: true, message: '请填写详细描述', trigger: 'blur' }
          ],
          pushType: [
            { required: true, message: '请选择推送类型', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请填写推送内容', trigger: 'blur' }
          ],
          file: [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ],
          filePath: [
            { required: true, message: '请上传图片', trigger: 'change' },
            {validator: checkUrl, trigger: ['blur,change']}
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          sendUrl: [
            { required: true, message: '请输入或上传访问链接', trigger: 'change' }
          ]
        },

      };
    },
    methods: {
      _initData () {
        this.getUser();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params=this.ruleForm;
            this.axios.post('wechat/qrcode',params).then(res => {
                this.$message(res.data.msg);
                this.$router.push({name:'QmList'})
            }).catch(err => {
              // console.log(err)
            })
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      uploadImg:function(e){
        var inputer=this.$refs.inputer;
        var formdata = new FormData();
        formdata.append("formData", inputer.files[0]);
        this.ruleForm.file=formdata;
      },
      getUser(){
        this.axios.get('user/byRole', {
          params: {
            userId:this.userid
          }
        }).then(res => {
          this.userArr=res.data.users;
        }).catch(err => {
          // console.log(err)
        })
      },
      // 获取子组件传的值
      getKey(key){
          this.ruleForm.sendUrl=key;
      }

    },
    filters: {
    },
    computed: {
    },
    created () {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this._initData();
      loading.close()
    },
    mounted () {},
    destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    background: #ffffff;
    padding: 0 20px 20px;
    .el-header {
      padding: 20px;
      text-align: left;
      background: #ffffff;
      border-bottom: 1px solid #ccc;
    }
    .demo-ruleForm{
      padding-top: 20px;
    }
    .el-select{
      display: block;
    }
    .input-send{
      width: 92%;float: left;
    }
    .upload-btn{
      width:8%;float: left;
    }
  }
  
</style>
