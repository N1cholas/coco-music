<template>
  <section class="slider-wrapper" ref="sliderWrapper">
    <div class="slider" ref="slider">
      <slot></slot>
    </div>
    <div class="dots-wrapper">
      <span class="dots" :class="{active: currentPage === index}" v-for="(item, index) in sliderDots" :key="index"></span>
    </div>
  </section>
</template>
<script>
import { addClass } from 'common/js/dom'
import BScroll from 'better-scroll'

export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._initSliderWidth()
      // 在轮播初始化之前初始化点
      this._initSliderDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    })

    window.addEventListener('resize', () => {
      if (!this.slider) return

      this._initSliderWidth(true)
      this.slider.refresh()
    })
  },
  deactivated () {
    clearTimeout(this.timer)
  },
  activated () {
    if (this.autoPlay) {
      this._play()
    }
  },
  data () {
    return {
      sliderDots: [],
      currentPage: 0
    }
  },
  methods: {
    _initSliderWidth (isResize) {
      this.sliderChildren = this.$refs.slider.children

      let width = 0
      let sliderWidth = this.$refs.sliderWrapper.clientWidth

      for (let i = 0, len = this.sliderChildren.length; i < len; i++) {
        let children = this.sliderChildren[i]
        addClass(children, 'slider-item')

        children.style.width = sliderWidth + 'px'

        width += sliderWidth
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }

      this.$refs.slider.style.width = width + 'px'
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.sliderWrapper, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      this.slider.on('scrollEnd', () => {
        this.currentPage = this.slider.getCurrentPage().pageX

        if (this.loop) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initSliderDots () {
      this.sliderDots = new Array(this.sliderChildren.length)
    },
    _play () {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  .slider-wrapper
    min-height 1px
    position relative
    overflow hidden
    .slider
      overflow hidden
      white-space nowrap
      .slider-item
        float left
        a
          display block
          text-decoration none
          img
            width 100%
            display block
    .dots-wrapper
      position absolute
      left 0
      right 0
      bottom 12px
      text-align center
      font-size 0
      .dots
        width 8px
        height 8px
        margin 0 4px
        display inline-block
        background $color-text-l
        border-radius 50%
        &.active
          width 20px
          border-radius 5px
          background $color-text-ll
</style>
