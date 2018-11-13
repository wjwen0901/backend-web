<template>
  <div class="pdf-viewer">
    <header class="pdf-viewer__header box-shadow">
      <div class="pdf-preview-toggle">
        <a @click.prevent.stop="togglePreview" class="icon"><PreviewIcon /></a>
      </div>

      <PDFZoom
        :scale="scale"
        @change="updateScale"
        @fit="updateFit"
        class="header-item"
        />

      <PDFPaginator
        v-model="currentPage"
        :pageCount="pageCount"
        class="header-item"
        />
      <div class="pdf-preview-toggle pdf-download">
        <!--<a @click.prevent.stop="toggleDownload" class="icon" :href="url" download><DownloadIcon /></a>-->
        <a @click="toggleDownload" class="icon" :href="url" download><DownloadIcon /></a>
      </div>
      <slot name="header"></slot>
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
    <div class="wechat-download-tips" v-show="isWechat">
      <!--<WechatArrowPng/>-->
      <img src="../assets/wechat-arrow.png" class="tips-arrow">
      <div>
        <p>点击右上角</p>
        <p>选择在浏览器中打开</p>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewIcon from '../assets/icon-preview.svg'
import DownloadIcon from '../assets/icon-download.svg'
// import WechatArrowPng from '../assets/wechat-arrow.png'

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
    PDFZoom,
    PreviewIcon,
    DownloadIcon
    // WechatArrowPng
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
      isWechat: false
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

    toggleDownload () {
      let ua = navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) === 'micromessenger') {
        this.isWechat = true
      }
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
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px 20px;
  position: relative;
  z-index: 99;
}
.header-item {
  margin-left: 1.2em;
}

.pdf-viewer .pdf-viewer__document,
.pdf-viewer .pdf-viewer__preview {
  top: 42px;
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
.pdf-preview-toggle a {
  float: left;
  cursor: pointer;
  display: block;
  border: 1px #333 solid;
  background: white;
  color: #333;
  font-weight: bold;
  line-height: 1.2em;
  width: 1.2em;
  height: 1.2em;
  font-size: 1.2em;
}
.pdf-download {
  padding-left: 1.2em;
}
.wechat-download-tips {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .8);
  z-index: 999;
  padding-top:100px;
  text-align: center;
  color: #fff;
  line-height: 1em;
}
.tips-arrow {
  position: absolute;
  top: -10px;
  right: -20px;
  width: 100px;
}
@media print {
  header {
    display: none;
  }
}
</style>
