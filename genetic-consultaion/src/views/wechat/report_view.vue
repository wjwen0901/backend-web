<template>
  <el-container>
    <!--<object :data="imagePath" v-if="imagePath.includes('.pdf')" type="application/pdf" width="100%" height="100%">-->
      <!--<iframe class="pdf-viewer" :src="imagePath" width="100%" height="100%" style="border: none;">-->
        <!--您的浏览器不支持在线预览PDF，请下载后查看: <a :href="imagePath">点击下载</a>-->
      <!--</iframe>-->
      <!--<embed :src="imagePath">-->
    <!--</object>-->
    <!--<img :src="imagePath" class="img-report" v-else>-->
    <PDFViewer
      v-bind="{url}"
      @document-errored="onDocumentErrored"
      v-if="url.includes('.pdf')"
    >
      <PDFUploader
        v-if="enableUploader"
        :documentError="documentError"
        @updated="urlUpdated"
        slot="header"
        class="header-item"
      />
    </PDFViewer>
    <img :src="url" class="img-report" v-else>
  </el-container>
</template>

<script>
import PDFUploader from '../../components/PDFUploader.vue'
import PDFViewer from '../../components/PDFViewer.vue'
export default {
  name: 'report-download',
  components: {
    PDFUploader,
    PDFViewer
  },
  data () {
    return {
      url: '',
      documentError: undefined,
      enableUploader: 'true'
    }
  },
  methods: {
    initData () {
      this.url = this.axios.defaults.baseURL.includes('https://')
        ? this.$route.query.path.replace('http://', 'https://') : this.$route.query.path
      // this.url = this.$route.query.path
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
    this.initData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    background: #fff;
    height: 100%;
  }
  .el-main {
    background: #f2f2f2;
  }
  .img-report {
    width: fit-content;
    height: fit-content;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #606f7b;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #62637a;
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
    #app {
      margin: 0;
      padding: 0;
    }
  }
</style>
