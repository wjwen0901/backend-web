<template>
    <div>
        <el-input v-model="value" style="width:720px" @change="changes"  placeholder="请输入内容"></el-input> 
    </div>
</template>

<script>
export default {
    data(){
        return{ 
            obj:{}, 
            // value:''
        }
    },
    props:{
        value:String,
        index: Number
    },
    methods:{ 
        changes(val){
            this.$emit('ipt',this.value, this.index)
        }
    }
}
</script>

<style>

</style>
