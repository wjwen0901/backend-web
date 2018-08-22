<template>
  <div class="pdf-zoom">
    <a v-on:click.stop.prevent="zoomIn" class="icon" :disabled="isDisabled">
      <i class="el-icon-zoom-in"></i>
    </a>
    <a v-on:click.stop.prevent="zoomOut" class="icon" :disabled="isDisabled"><i class="el-icon-zoom-out"></i></a>
    <a v-on:click.stop.prevent="fitWidth" class="icon" :disabled="isDisabled"><i class="el-icon-plus"></i></a>
    <a v-on:click.stop.prevent="fitAuto" class="icon" :disabled="isDisabled"><i class="el-icon-minus"></i></a>
  </div>
</template>

<script>
// import ZoomInIcon from '../assets/icon-zoom-in.svg'
// import ZoomOutIcon from '../assets/icon-zoom-out.svg'
// import ExpandIcon from '../assets/icon-expand.svg'
// import ShrinkIcon from '../assets/icon-shrink.svg'

export default {
  name: 'PDFZoom',

  components: {
    // ZoomInIcon,
    // ZoomOutIcon,
    // ExpandIcon,
    // ShrinkIcon
  },

  props: {
    scale: {
      type: Number
    },
    increment: {
      type: Number,
      default: 0.25
    }
  },

  computed: {
    isDisabled () {
      return !this.scale
    }
  },

  methods: {
    zoomIn () {
      this.updateScale(this.scale + this.increment)
    },

    zoomOut () {
      if (this.scale <= this.increment) return
      this.updateScale(this.scale - this.increment)
    },

    updateScale (scale) {
      this.$emit('change', {scale})
    },

    fitWidth () {
      this.$emit('fit', 'width')
    },

    fitAuto () {
      this.$emit('fit', 'auto')
    }
  }
}
</script>

<style>
.pdf-zoom a {
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
</style>
