<template>
  <el-container class="report-download">
    <div class="mdh-default" :class="signSuccess ? 'hidden' : ''">
      <div class="header">

      </div>
      <div class="content">
        <img src="../../../assets/gensultation-logo-1.png"/>
        <p>在线签到抽奖</p>
        <el-main>
          <el-form :model="user" ref="patientForm" :rules="rules" label-width="0px" label-position="left">
            <el-form-item prop="fullName">
              <el-input class="width-100-p"
                        v-model="user.fullName"
                        placeholder="请输入姓名">
              </el-input>
            </el-form-item>
            <el-form-item prop="cellphone">
              <el-input class="width-100-p"
                        v-model="user.cellphone"
                        placeholder="请输入手机号">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="submit-btn" @click="toSign">点击签到</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </div>
      <div class="footer-info">
        &copy; 2019 MDHcare.cn 版权所有  丨  ICP证：京ICP备17067248号
      </div>
    </div>
    <div class="luck-container clearfix" :class="!signSuccess ? 'hidden' : ''">
      <div style="height:100%;">s</div>
      <img class="bg-image" :src="IMG_URL + '/luckDraw/bg@2x.png'"/>

      <img class="title-image" :src="IMG_URL + '/luckDraw/title@2x.png'"/>
      <div class="draw-content">
        <img class="bg-circle-wai" :src="IMG_URL + '/luckDraw/zhuanpan_wai@2x.png'"/>
        <div class="turntable" id="turntable" :class="{freeze: freeze}" :style="`transform: translate(-50%, -50%) rotate(${wheelDeg}deg)`">
          <img class="bg-circle-nei" :src="IMG_URL + '/luckDraw/zhuanpan_nei@2x.png'"/>

          <div
            class="prize"
            :class="'prize-'+ (index+1)"
            v-for="(item,index) in prizeList"
            :key="index">
            <span>{{item.name}}</span>
            <img :src="item.icon"/>
          </div>
        </div>
        <div class="begin" @click="onClickRotate">
          <img :src="IMG_URL + '/luckDraw/begin@2x.png'"/>
        </div>
      </div>
      <div class="descript">
        <div class="title">奖品说明</div>
        <div class="detail">
          一等奖：高端陶瓷茶叶罐+高端签字笔+钥匙扣饰品+便携牙刷
        </div>
        <div class="detail">二等奖：高端陶瓷茶叶罐</div>
        <div class="detail">三等奖：高端签字笔</div>
        <div class="detail">四等奖：钥匙扣饰品</div>
        <div class="detail">五等奖：精美自动笔</div>
        <div class="detail">开心奖：便携牙刷</div>
      </div>
    </div>
    <div class="cover" :class="hidden? 'hidden': ''">
      <div class="happy-time">
        <div class="top">

          <img class="bg-img" :src="IMG_URL + '/luckDraw/yellow_bg@2x.png'"/>
          <div class="congratilation">恭喜中奖啦!!!</div>
          <div class="avater">
            <img class="userinfo-avatar" :src="IMG_URL + '/luckDraw/prize' + prizeIndex + '.png'">
          </div>
          <div class="prize">
            <img class="bg-img" :src="IMG_URL + '/luckDraw/prize' + prizeIndex + '_text@2x.png'"/>
          </div>
        </div>
        <div class="info">
<!--          <img class="save-btn" :src="IMG_URL + '/luckDraw/btn_baocun@2x.png'"/>-->
<!--          <div class="tips">展示截图可领奖～</div>-->
          <div class="to-index">展示截图可领奖</div>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
  export default {
    name: 'signin',
    data () {
      const checkName = (rule, value, callback) => {
        if (!this.user.fullName || this.user.fullName.trim() === '') {
          callback(new Error('请输入您的姓名'))
        } else {
          callback()
        }
      }
      const checkCellphone = (rule, value, callback) => {
        if (!this.user.cellphone || this.user.cellphone.trim() === '') {
          callback(new Error('请输入手机号码'))
        } else if (!(/^1\d{10}$/.test(parseInt(this.user.cellphone)))) {
          callback(new Error('请输入11位数字'))
        } else {
          callback()
        }
      }
      return {
        IMG_URL: 'https://z.mdhcare.cn/miniprogram/v2/images',
        user: {
          fullName: '',
          cellphone: ''
        },
        rules: {
          fullName: [
            {required: true, validator: checkName, trigger: 'blur'}
          ],
          cellphone: [
            {required: true, validator: checkCellphone, trigger: 'blur'}
          ]
        },
        signSuccess: false,
        freeze: false,
        rolling: false,
        wheelDeg: 0,
        prizeNumber: 6,
        hidden: true,
        prizeList: [
          {
            icon: "https://z.mdhcare.cn/miniprogram/v2/images/luckDraw/prize1.png",
            name: "一等奖"
          },
          {
            icon: "https://z.mdhcare.cn/miniprogram/v2/images/luckDraw/prize2.png",
            name: "二等奖"
          },
          {
            icon: "https://z.mdhcare.cn/miniprogram/v2/images/luckDraw/prize3.png",
            name: "三等奖"
          },
          {
            icon: "https://z.mdhcare.cn/miniprogram/v2/images/luckDraw/prize4.png",
            name: "四等奖"
          },
          {
            icon: "https://z.mdhcare.cn/miniprogram/v2/images/luckDraw/prize5.png",
            name: "五等奖"
          },
          {
            icon: "https://z.mdhcare.cn/miniprogram/v2/images/luckDraw/prize6.png",
            name: "开心奖"
          }
        ],
        prize: '',
        prizeIndex: 6
      }
    },
    mounted () {
      this.getLuckyInfo()
    },
    methods: {
      toSign () {
        this.$refs.patientForm.validate((valid) => {
          console.log(valid)
          if (valid) {
            let instance = this.axios.create({
              headers: {
                'Authorization': window.localStorage.token,
                'Content-Type': 'application/json'
              }
            })
            let _this = this
            this.user.hospitalId = _this.$route.query.hospitalId
            this.user.deptId = _this.$route.query.deptId
            this.user.createTime = new Date()
            this.user.role = 2
            instance({
              method: 'post',
              url: 'mini/user/sign?type=wx&openId=' + _this.$route.query.openid,
              data: this.user,
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
              }
            }).then(function (response) {
              console.log(response)
              _this.signSuccess = true
            }).catch(function (err) {
              _this.signSuccess = true
            })
          }
        })
      },
      onClickRotate() {
        if (this.rolling) {
          return;
        }
        let _this = this
        this.axios.get('mini/lucky', {
          params: {
            openId: _this.$route.query.openid
          }
        }).then(res => {
          console.log(res)
          window.localStorage.luckyRange = res.data
          _this.rolling = true;
          _this.wheelDeg =
            _this.wheelDeg -
            _this.wheelDeg % 360 +
            6 * 360 +
            (360 - 360 / _this.prizeList.length * res.data);
          setTimeout(() => {
            _this.rolling = false
            _this.prize = _this.prizeList[res.data].name
            _this.hidden = false
            _this.prizeIndex = res.data+1
          }, 4500);
        });

      },
      getLuckyInfo () {
        let _this = this
        this.axios.get('mini/lucky/info', {
          params: {
            openId: this.$route.query.openid
          }
        }).then(res => {
          console.log(res)
          // _this.hidden = false
        }).catch(err => {
          _this.prizeIndex = window.localStorage.luckyRange === undefined ? 6 : window.localStorage.luckyRange
          _this.signSuccess = true
          _this.hidden = false
        });
      }
    },
    watch: {
      prizeIndex () {
        this.freeze = true
        this.wheelDeg = 0

        setTimeout(() => {
          this.freeze = false
        }, 0)
      }
    }
  }
</script>
<style scoped>
  .report-download >>> .el-message {
    width: 100px!important;
    min-width: 100px!important;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    background: #fff;
    min-height: 100%;
  }
  .el-header {
    margin-top: 20px;
    span-align: left;
    height: 40px !important;
  }
  .confirm-message {
    width: 50% !important;
  }
  .float-l {
    float: left;
  }
  .upload-content {
    position: relative;
    float: left;
  }
  .el-upload.el-upload--span {
    width: 100% !important;
  }
  .width-100-p {
    width: 100%;
  }
  .upload-btn {
    width: 150px;
  }
  .mdh-default {
    position: relative;
    width: 100%;
    padding: 60px 20px 20px 20px;
    span-align: center;
    z-index: 1;
    text-align: center;
    .title {
      margin: 0;
      font-size: 32px;
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
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background:  url("../../../assets/download-bg.jpg") repeat-y;
      background-size: cover;
      opacity: .2;
      content: "";
      z-index: -1;
    }
    .content {
      position: absolute;
      top: 50%;
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
      .qrcode {
        margin-top: 40px;
        p {
          margin-top: 20px;
          font-size: 14px;
        }
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
    .submit-btn {
      width: 100%;
      background: #65c2c4;
      color: #fff;
    }
    .footer-info {
      position: absolute;
      width: calc(100% - 40px);
      bottom: 10px;
      span-align: center;
      font-size: 12px;
      color: #999999;
    }
  }

  .hidden {
    display: none;
  }

  /* miniprogram/pages/luckDraw/luckDraw.wxss */
  .luck-container {
    width: 100%;
    height: 100%;

    .bg-image {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .title-image {
      position: absolute;
      left: calc(50% + 13px);
      top: -5px;
      transform: translate(-50%, 0);
      width: 90%;
      z-index: 1;
    }
    .draw-content {
      position: absolute;
      top: 46%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      .bg-circle-wai {
        width: 100%;
      }
      .turntable {
        position: absolute;
        left: 50%;
        top: 49%;
        transform: translate(-50%, -50%);
        transition: transform 4s ease-in-out;
        width: 86%;
        height: 83%;
        overflow: hidden;
        text-align: center;
        &.freeze {
          transition: none;
          background: red;
        }
        .bg-circle-nei {
          width: 100%;
        }
        span{
          font-size: 12px;
          color: #444444;
        }
        .prize {
          position: absolute;
          width: 50%;
          height: 50%;
          text-align: center;
        }
        .prize span{
          padding-top: 10px;
          font-size: 12px;
          color: #444444;
          display: inline-block;
        }
        .prize img{
          position: absolute;
          top: 37%;
          left: 50%;
          width: 70%;
          transform: translate(-50%, -50%);
        }
        .prize-1 {
          top: 0;
          left: 26%;
        }
        .prize-2 {
          top: 10%;
          left: 50%;
          transform: rotate(56deg);
        }
        .prize-2 span{
          padding-top: 20px;
        }
        .prize-2 img{
          top: 50%;
        }
        .prize-3 {
          top: 37%;
          left: 50%;
          transform: rotate(120deg);
        }
        .prize-3 span{
          padding-top: 30px;
        }
        .prize-3 img{
          top: 50%;
          width: 50%;
        }
        .prize-4 {
          top: 50%;
          left: 25%;
          transform: rotate(180deg);
        }
        .prize-4 img{
          top: 50%;
          width: 50%;
        }
        .prize-4 span{
          padding-top: 15px;
        }
        .prize-5 {
          top: 37%;
          left: 0;
          transform: rotate(235deg);
        }
        .prize-5 span{
          padding-top: 15px;
        }
        .prize-5 img{
          top: 50%;
          width: 50%;
        }
        .prize-6 {
          top: 10%;
          left: 0;
          transform: rotate(-60deg);
        }
        .prize-6 span{
          padding-top: 20px;
        }
        .prize-6 img{
          top: 50%;
          width: 50%;
        }
      }
    }
    .begin {
      position: absolute;
      top: 47%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 23%;
      /*height: 96px;*/
    }
    .begin img {
      width: 100%;
    }
    .descript {
      position: absolute;
      bottom: 7%;
      left: 50%;
      transform: translate(-50%, 0);
      width: 70%;
      height: 120px;
      font-size: 14px;
      font-family: Adobe Heiti Std R;
      font-weight:normal;
      color:rgba(205,128,98,1);
      line-height:14px;
      .title {
        margin-bottom: 10px;
      }
      .detail {
        padding-left: 4em;
        text-indent: -4em;
        font-size: 12px;
        line-height: 14px;
      }
    }
    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 188px;
      opacity: .54;
      img {
        width: 100%;
        height: 188px;
      }
    }
  }
  .cover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,.7);
    z-index: 99;
  }
  .cover .happy-time{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 350px;
    transform: translate(-50%, -50%);
    background:#fff;
    z-index: 99;
    border-radius: 50px;
    overflow: hidden;
  }
  .cover .happy-time .top {
    position: relative;
    width: 100%;
    height: 70%;
  }
  .cover .happy-time .top .bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .cover .happy-time .top .avater {
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30%;
    height: 30%;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80%;
      transform: translate(-50%, -50%);
    }
  }

  .cover .happy-time .info {
    text-align: center;
  }
  .cover .happy-time .info .save-btn{
    margin-top: 15px;
    width: 150px;
    height: 43px;
  }
  .cover .happy-time .info .tips {
    margin-top: 10px;
    font-size: 12px;
    font-family:SourceHanSansSC-Light;
    font-weight:300;
    color:rgba(69,69,69,1);
  }
  .cover .happy-time .top .congratilation {
    position: absolute;
    top: 19px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #D57E37;
    font-size: 24px;

  }
  .cover .happy-time .top .prize {
    position: absolute;
    bottom: 15px;
    left: 0;
    width: 100%;
    height: 45px;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    color: #D57E37;
    text-shadow: 1px 2px 0 #E5A06E, -1px -1px 0 #E5A06E;
  }
  .cover .happy-time .top .prize img {
    position: absolute;
    width: 108px;
    left: 50%;
    transform: translate(-50%);
  }
  .to-index {
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
    color: #D57E37;
  }

</style>
