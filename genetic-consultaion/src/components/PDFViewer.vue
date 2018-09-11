<template>
  <div class="pdf-viewer">
    <header class="pdf-viewer__header box-shadow">
      <!--<el-button type="text" @click="downloadInfo">下载</el-button>-->
      <el-button type="success" size="mini" plain icon="el-icon-download" circle
                 class="fl-right"
                 @click="downloadInfo"></el-button>
      <!--<div class="pdf-preview-toggle">-->
        <!--<a @click.prevent.stop="togglePreview" class="icon"><i class="el-icon-date"></i></a>-->
      <!--</div>-->

      <!--<PDFZoom-->
        <!--:scale="scale"-->
        <!--@change="updateScale"-->
        <!--@fit="updateFit"-->
        <!--class="header-item"-->
        <!--/>-->

      <PDFPaginator
        v-model="currentPage"
        :pageCount="pageCount"
        class="header-item"
        />

      <!--<slot name="header"></slot>-->
    </header>

    <PDFData
      class="pdf-viewer__main"
      :url="url"
      @page-count="updatePageCount"
      @page-focus="updateCurrentPage"
      @document-rendered="onDocumentRendered"
      @document-errored="onDocumentErrored"
      >

      <PDFPreview
        slot="preview"
        slot-scope="{pages}"
        v-show="isPreviewEnabled"
        class="pdf-viewer__preview"
        v-bind="{pages, scale, currentPage, pageCount, isPreviewEnabled}"
        />

      <PDFDocument
        class="pdf-viewer__document"
        :class="{ 'preview-enabled': isPreviewEnabled }"
        slot="document"
        slot-scope="{pages}"
        v-bind="{pages, scale, optimalScale, fit, currentPage, pageCount, isPreviewEnabled}"
        @scale-change="updateScale"
        />
    </PDFData>
    <a :href="url" id="JdownApp">点击下载APP</a>
    <a :href="url" id="JdownApp2" class="btn-warn">点击下载APP2</a>
    <div class="wxtip" v-if="JweixinTip" @click="hideTip">
      <span class="wxtip-icon"></span>
      <p class="wxtip-txt">点击右上角<br/>选择在浏览器中打开</p>
    </div>
  </div>
</template>

<script>
// import PreviewIcon from '../assets/icon-preview.svg'

import PDFDocument from './PDFDocument'
import PDFData from './PDFData'
import PDFPaginator from './PDFPaginator'
import PDFPreview from './PDFPreview'
import PDFZoom from './PDFZoom'

function floor (value, precision) {
  const multiplier = Math.pow(10, precision || 0)
  return Math.floor(value * multiplier) / multiplier
}

export default {
  name: 'PDFViewer',

  components: {
    PDFDocument,
    PDFData,
    PDFPaginator,
    PDFPreview,
    PDFZoom
  },

  props: {
    url: String
  },

  data () {
    return {
      scale: undefined,
      optimalScale: undefined,
      fit: undefined,
      currentPage: 1,
      pageCount: undefined,
      isPreviewEnabled: false,
      JweixinTip: false
    }
  },

  methods: {
    onDocumentRendered () {
      this.$emit('document-errored', this.url)
    },

    onDocumentErrored (e) {
      this.$emit('document-errored', e)
    },

    updateScale ({scale, isOptimal = false}) {
      const roundedScale = floor(scale, 2)
      if (isOptimal) this.optimalScale = roundedScale
      this.scale = roundedScale
    },

    updateFit (fit) {
      this.fit = fit
    },

    updatePageCount (pageCount) {
      this.pageCount = pageCount
    },

    updateCurrentPage (pageNumber) {
      this.currentPage = pageNumber
    },

    togglePreview () {
      this.isPreviewEnabled = !this.isPreviewEnabled
    },

    downloadInfo () {
      console.log('ddd')
      let ua = navigator.userAgent
      console.log(ua)
      let isWeixin = !!/MicroMessenger/i.test(ua)
      console.log(isWeixin)
      if (isWeixin) {
        this.JweixinTip = true
      } else {
        window.location.href = this.url
        // window.open(this.url)
      }
    },

    hideTip () {
      this.JweixinTip = false
    }
  },

  watch: {
    url () {
      this.currentPage = undefined
    }
  },
  mounted () {
    document.body.classList.add('overflow-hidden')
  }
}
</script>

<style scoped>
header {
  display: flex;
  /*justify-content: center;*/
  align-items: center;
  flex-wrap: wrap;
  padding: 5px 5px;
  position: relative;
  z-index: 99;
  width: 100%;
  background: #ccc;
}
.header-item {
  margin: 0 1em;
}
.fl-right {
  position: absolute;
  right: 20px;
}
.pdf-viewer {
  width: 100%;
}
.pdf-viewer .pdf-viewer__document,
.pdf-viewer .pdf-viewer__preview {
  top: 70px;
}

.pdf-viewer__preview {
  display: block;
  width: 15%;
  right: 85%;
}

.pdf-viewer__document {
  top: 70px;
  width: 100%;
  left: 0;
}

.pdf-viewer__document.preview-enabled {
  width: 85%;
  left: 15%;
}
.pdf-preview-toggle {
  background: #ffffff;
  padding: 2px;
}
@media print {
  header {
    display: none;
  }
}
.box-shadow {
  -webkit-box-shadow: 0 15px 30px 0 rgba(0,0,0,.11), 0 5px 15px 0 rgba(0,0,0,.08);
  box-shadow: 0 15px 30px 0 rgba(0,0,0,.11), 0 5px 15px 0 rgba(0,0,0,.08);
}
.wxtip{
  background: rgba(0,0,0,0.8);
  text-align: center;
  position: fixed;
  left:0; top: 0; width: 100%; height: 100%; z-index: 998;}
.wxtip-icon{width: 52px; height: 67px; background: rgba(0,0,0,.5); display: block; position: absolute; right: 20px; top: 20px;}
.wxtip-txt{margin-top: 107px; color: #fff; font-size: 16px; line-height: 1.5;}
</style>
