<template>
    <div>
        <el-input  v-model="value"  style="width:200px" @blur="aa"  placeholder="请输入内容"></el-input> 
    </div>
</template>

<script>
export default {
    data(){
        return{ 
            obj:{}, 
            value:''
        }
    },
    props:{
        sum:Number
    },
    methods:{ 
        aa(val){
            this.obj.screeningName = this.value; 
            console.log(this.value)
            this.$emit('ipt',this.obj)
        }
    }
}
</script>

<style>

</style>
