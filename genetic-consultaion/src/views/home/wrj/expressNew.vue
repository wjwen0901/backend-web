<!--快递页面改造 待完善2022-09-05-->
<template>
    <div class="express-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>维汝健</el-breadcrumb-item>
            <el-breadcrumb-item>快递查询</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="express">
            <div class="express-inner" v-for="(item,index) in expressList" :key="index">
                <div>
                    <span>订单编号：{{item.order.orderNo}}</span>
                    <span>下单时间：{{item.order.createTime}}</span>
                </div>
                <div>
                    <el-descriptions>
                        <el-descriptions-item>{{item.order.itemTitle}}</el-descriptions-item>
                    </el-descriptions>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data(){
    return {
        expressList:[{
            order:{
                orderNo:'11',
                createTime:'2022-09-08',
                itemTitle:'肿瘤用药基因检测优享版'
            },
            express:{}
        }],//列表数据
    }
  },
  watch:{},
  mounted(){
    
  },
  methods: {
    
  },
}
</script>

<style scoped lang="scss">
 .express-box{
    .express{
        .express-inner{
            display: flex;
            flex-direction: column;
        }
    }
 }
</style>