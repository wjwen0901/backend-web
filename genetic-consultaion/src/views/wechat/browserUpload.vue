<template>
  <el-container>
      <div class="sccg">
            <img src="../../assets/yidehaokang/icon4.png" alt="">
            <div class="sccg-tip">上传成功</div>
            <div class="numwj">{{num}}个文件</div>
            <div class="caozuo">
                <div class="jixu" @click="jixusc">继续上传</div>
                <div class="fanhuiwx" @click="toweixin">返回微信</div>
            </div>
      </div>
      
  </el-container>
</template>
<script>
export default {
  name: 'browser-upload',
  data () {
    return {
        url:this.$route.query.path,
        num:this.$route.query.num
    }
  },
  methods: {
    jixusc(){
        window.location.href=this.url;
    },
    toweixin(){
        window.location.href='weixin://';
    }
  },
  created () {
    this.loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.loading.close()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .sccg{
      width:100%;height: 100%;
      position: fixed;
      top:0;left:0;background: #ffffff;
      text-align: center;
      img{
          width: 195px;
          margin-top: 42px;margin-left: 50%;
          transform: translateX(-60%);
          margin-bottom: 20px;
      }
      .sccg-tip{
        font-size:18px;
        font-family:Source Han Sans SC;
        color:rgba(85,85,85,1);
        line-height:18px;
      }
      .numwj{
        margin-top: 33px;
        font-size:16px;
        font-family:Source Han Sans SC;
        color:rgba(85,85,85,1);
        line-height:24px;
        margin-bottom: 89px;
      }
      .caozuo{
          width: 100%;margin: 0 auto;
          display: flex;justify-content: space-around ;align-items: center;
          .jixu{
              font-size:18px;
            font-family:Source Han Sans SC;
            font-weight:400;
            color:rgba(136,136,136,1);
            line-height:24px;
            padding-bottom: 6px;
            border-bottom: 1px solid #C6C6C6;
          }
          .fanhuiwx{
            font-size:18px;
            font-family:Source Han Sans SC;
            font-weight:400;
            color:#90C07B;
            line-height:24px;
            padding-bottom: 6px;
            border-bottom: 1px solid #90C07B;
          }
      }
  }
</style>
