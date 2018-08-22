<template>
  <div class="mdh-input-row">
    <label>{{label}}</label>
    <input type="text" class="mui-input-clear" placeholder="请输入用户名">
  </div>
</template>

<script>
export default {
  name: 'InputCell',
  components: {
  },
  data () {
    return {
      url: '',
      documentError: undefined,
      enableUploader: 'true'
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
