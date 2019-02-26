<template>
  <section class="slider" ref="slider">
    <div class="slider-wrapper" ref="sliderWrapper">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dots-item"
       v-for="(item, index) in dots"
       :key="index"
       :class="{active: index === currentPage}"
      ></span>
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
      default: 1000
    }
  },
  data () {
    return {
      // 轮播子元素
      sliderChildren: [],
      // 轮播小圆点
      dots: [],
      currentPage: 0,
      slider: null
    }
  },
  mounted () {
    setTimeout(() => {
      this._initSliderWidth()
      this._initBScroll()
      this._initDots()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)
  },
  methods: {
    _initSliderWidth () {
      this.sliderChildren = this.$refs.sliderWrapper.children

      let slideWidth = this.$refs.slider.clientWidth
      let width = 0

      for (let i = 0, len = this.sliderChildren.length; i < len; i++) {
        let children = this.sliderChildren[i]

        addClass(children, 'slider-item')

        children.style.width = slideWidth + 'px'

        width += slideWidth
      }

      if (this.loop) {
        width += 2 * slideWidth
      }

      this.$refs.sliderWrapper.style.width = width + 'px'
    },
    _initBScroll () {
      this.slider = new BScroll(this.$refs.slider, {
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
        // console.log(this.slider)
        this.currentPage = this.slider.getCurrentPage().pageX
        if (this.loop) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots () {
      let dotsNum = this.sliderChildren.length
      // 循环轮播会加多两个slide
      if (this.loop) dotsNum -= 2

      this.dots = new Array(dotsNum)
    },
    _play () {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .slider
    height 150px
    position relative
    .slider-wrapper
      height 100%
      overflow hidden
      white-space nowrap
      .slider-item
        height 100%
        float left
        a
          display block
          height 100%
          text-decoration none
          img
            display block
            height 100%
    .dots
      position absolute
      left 0
      right 0
      bottom 12px
      text-align center
      font-size 0
      .dots-item
        width 8px
        height 8px
        margin 0 4px
        display inline-block
        border-radius 50%
        background $color-text-l
        &.active
          width 20px
          border-radius 4px
          background $color-text-ll
</style>
