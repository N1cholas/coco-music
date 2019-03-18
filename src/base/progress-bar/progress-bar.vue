<template>
  <section class="progress-bar" @click.stop="progressClick">
    <div class="progress" ref="progress">
      <div class="btn"
           ref="progressBtn"
           @touchstart="touchstart"
           @touchmove="touchmove"
           @touchend="touchend"
      ></div>
      <div class="bar-bg">
        <div class="bar" ref="progressBar"></div>
      </div>
    </div>
  </section>
</template>
<script>
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')
const BTN_WIDTH = 16

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    this.width = this.$refs.progress.clientWidth - BTN_WIDTH
    this.btn = this.$refs.progressBtn
    this.bar = this.$refs.progressBar
  },
  data () {
    return {
      touches: {}
    }
  },
  watch: {
    percent (newPercent) {
      if (!(newPercent >= 0)) return
      // 拖动进度条
      if (this.touches.begin) return

      let offsetWidth = newPercent * this.width

      this._move(offsetWidth)
    }
  },
  methods: {
    progressClick (e) {
      const x = e.clientX - this.$refs.progress.offsetLeft

      const offsetX = Math.min(Math.max(0, x), this.width)

      this._move(offsetX)

      let percent = offsetX / this.width

      this.$emit('progressChange', percent)
    },
    touchstart (e) {
      this.touches.begin = true
      this.touches.left = this.bar.clientWidth
      this.touches.x = e.touches[0].pageX
    },
    touchmove (e) {
      if (!this.touches.begin) return

      let delta = e.touches[0].pageX - this.touches.x

      let offsetWidth = Math.min(Math.max(0, this.touches.left + delta), this.width)

      this._move(offsetWidth)

      this.touches.percent = offsetWidth / this.width

      this.$emit('updateProgress', this.touches.percent)
    },
    touchend (e) {
      this.touches.begin = false

      this.$emit('progressChange', this.touches.percent)
    },
    _move (offsetWidth) {
      this.btn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.bar.style.width = `${offsetWidth}px`
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'
    .progress-bar
      .progress
        height 30px
        display flex
        position relative
        align-items center
        .btn
          width 10px
          height 10px
          border 3px solid #fff
          position absolute
          left 0
          background $color-theme
          border-radius 50%
        .bar-bg
          width 100%
          height 4px
          background rgba(0,0,0,.3)
          border-radius 2px
          overflow hidden
          .bar
            width 0
            height 4px
            background $color-theme
</style>
