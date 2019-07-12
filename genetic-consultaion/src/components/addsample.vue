<template>
    <div class="ap-selection">
        <div class="aa"   v-if="type==0">
            <div class="ap-cycle">
            <span>样本类型：</span>
            <el-input  
            style="width:500px"
            @change="ipt1"
            v-model="sampleType" placeholder="请输入样本类型"></el-input>
        </div>
        <div class="ap-cycle">
            <span>采集要求：</span>
            <el-input  
            @change="ipt2"
            style="width:500px"
            v-model="collectionMode" placeholder="请输入采集要求"></el-input>
        </div>
        <div class="ap-cycle">
            <span>保存条件：</span>
            <el-input  
            @change="ipt3"
            style="width:500px"
            v-model="keepMode" placeholder="请输入保存条件"></el-input>
        </div>
        <div class="ap-cycle">
            <span>运输条件：</span>
            <el-input  
            @change="ipt4"
            style="width:500px"
            v-model="transportMode" placeholder="请输入运输条件"></el-input>
        </div>
        </div>
        <!-- 编辑 -->
        <div class="aa" v-if="type==1">
            <div class="big"  v-for="(item,index) in lists" :key="index">
            <div class="ap-cycle">
            <span>样本类型：</span>
            <el-input  
            style="width:500px"
            @change="ipt1"
            v-model="sampleType" :placeholder="item.sampleType"></el-input>
        </div>
        <div class="ap-cycle">
            <span>采集要求：</span>
            <el-input  
            @change="ipt2"
            style="width:500px"
            v-model="collectionMode" :placeholder="item.collectionMode"></el-input>
        </div>
        <div class="ap-cycle">
            <span>保存条件：</span>
            <el-input  
            @change="ipt3"
            style="width:500px"
            v-model="keepMode" :placeholder="item.keepMode"></el-input>
        </div>
        <div class="ap-cycle">
            <span>运输条件：</span>
            <el-input  
            @change="ipt4"
            style="width:500px"
            v-model="transportMode" :placeholder="item.transportMode"></el-input>
        </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
     props:{ 
        index:Number,
        type:null,
        lists:Array
    },
    data(){
        return{
            sampleType:'',
            keepMode:'',
            transportMode:'',
            collectionMode:'',
            obj:{},
            list:[]
        }
    },
    created(){  
    },
    methods:{
        ipt1(val){
            this.obj.sampleType=val;
        },
        ipt2(val){
            this.obj.collectionMode=val;
        },
        ipt3(val){
            this.obj.keepMode=val;
        },
        ipt4(val){
            this.obj.transportMode=val; 
            this.$emit('ipt',this.obj)
        } 
    }
}
</script>

<style lang='scss' >
.aa{
    width: 100%;
}
.big{
    width: 100%;
    height: 300px;
    border:1px solid #ccc;
    padding:  0 20px;
    display: block; 
    margin-top:20px;
}
.ap-cycle{
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
}
</style>
