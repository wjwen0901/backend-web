<template>
  <div class="content">
    <div class="icon-div">
      <i class="el-icon-success"></i>
    </div>
    <p class="sussess-info">操作成功</p>
    <p>进入 <a href="https://h5.youzan.com/v2/showcase/homepage?alias=SqzDcEIP6w&redirect_count=1">元鹊商城</a> 开始下单</p>
  </div>
</template>
<script>
export default {
  name: 'newUserSuccess',
  data () {},
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .content {
    padding-top: 100px;
    text-align: center;
    .icon-div {
      font-size: 100px;
      color: #00c2a9;
    }
    .sussess-info {
      font-size: 20px;
    }
    a {
      color: #00c2a9;
    }
  }
</style>
