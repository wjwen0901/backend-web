<template>
  <el-container>
    <!--<object :data="imagePath" v-if="imagePath.includes('.pdf')" type="application/pdf" width="100%" height="100%">-->
      <!--<iframe class="pdf-viewer" :src="imagePath" width="100%" height="100%" style="border: none;">-->
        <!--您的浏览器不支持在线预览PDF，请下载后查看: <a :href="imagePath">点击下载</a>-->
      <!--</iframe>-->
      <!--<embed :src="imagePath">-->
    <!--</object>-->
    <!--<img :src="imagePath" class="img-report" v-else>-->
    <el-button v-if="printId !== undefined"></el-button>
    <PDFViewer
      v-bind="{url}"
      @document-errored="onDocumentErrored"
      v-if="url.includes('.pdf')"
    >
    <!--<PDFViewer-->
      <!--v-bind="{url}"-->
      <!--@document-errored="onDocumentErrored"-->
    <!--&gt;-->
      <!--<PDFUploader-->
        <!--v-if="enableUploader"-->
        <!--:documentError="documentError"-->
        <!--@updated="urlUpdated"-->
        <!--slot="header"-->
        <!--class="header-item"-->
      <!--/>-->
    </PDFViewer>
    <img v-else :src="url" class="img-report">
  </el-container>
</template>

<script>
import PDFUploader from '../../../components/PDFUploader.vue'
import PDFViewer from '../../../components/PDFViewer.vue'
export default {
  name: 'report-download',
  components: {
    PDFUploader,
    PDFViewer
  },
  data () {
    return {
      // url: 'http://localhost:3100/static/%E5%8C%BB%E5%AD%A6%E6%A3%80%E6%B5%8B%E4%BA%A7%E5%93%81-%E5%AE%A3%E4%BC%A0%E5%86%8C-%E5%8D%95%E9%A1%B5-%E5%8D%B0%E5%88%B7.pdf',
      url: '',
      documentError: undefined,
      enableUploader: 'true',
      printId: this.$route.query.printId
    }
  },
  methods: {
    initData () {
      console.log(this.$route.query.path)
      this.url = this.axios.defaults.baseURL.includes('https://')
        ? this.$route.query.path.replace('http://', 'https://') : this.$route.query.path
      // this.url = this.$route.query.path
      console.log(this.url)
    },
    urlUpdated (url) {
      this.documentError = undefined
      this.url = url
    },
    onDocumentErrored (e) {
      this.documentError = e.text
    }
  },
  created () {
    let loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.initData()
    loading.close()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /*body {*/
    /*margin: 0;*/
    /*padding: 0;*/
    /*background-color: #606f7b;*/
  /*}*/
  .el-container, #app {
    /*background: #fff;*/
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #62637a;
    margin: 0;
    padding: 0;
    background-color: #606f7b;
  }
  .img-report {
    width: 100%;
    height: -webkit-fill-available;
  }
  .header-item {
    margin: 0 2.5em;
  }
  .pdf-content {
    width: 100%;
  }
  label.form {
    color: white;
    font-family: Monaco, 'Courier New', Courier, monospace;
    font-weight: bold;
    margin-bottom: 2em;
    display: block;
  }
  input {
    padding: 0.45em;
    font-size: 1em;
  }
  .error {
    border: 1px solid red;
    background: pink;
    color: red;
    padding: 0.5em 3em;
    display: inline;
  }

  a.icon {
    cursor: pointer;
    display: block;
    border: 1px #333 solid;
    background: white;
    color: #333;
    font-weight: bold;
    padding: 0.25em;
    width: 1em;
    height: 1em;
    font-size: 1.5em;
  }

  .box-shadow {
    box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11), 0 5px 15px 0 rgba(0, 0, 0, 0.08);
  }
  .overflow-hidden {
    overflow: hidden;
  }

  @media print {
    body {
      background-color: transparent;
    }
    #el-container {
      margin: 0;
      padding: 0;
    }
  }
</style>
