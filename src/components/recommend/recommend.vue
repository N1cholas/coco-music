<template>
  <section class="recommend">
    <div class="recommend-wrapper">
      <slider v-if="sliderData.length">
        <div v-for="(item, index) in sliderData" :key="index">
          <a :href="item.linkUrl">
            <img :src="item.picUrl" alt="slider image">
          </a>
        </div>
      </slider>
    </div>
  </section>
</template>
<script>
import { getSlider } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'

export default {
  components: {
    Slider
  },
  data () {
    return {
      sliderData: []
    }
  },
  mounted () {
    this._getSlider()
  },
  methods: {
    _getSlider () {
      getSlider().then(res => {
        if (res.code === ERR_OK) {
          this.sliderData = res.data.slider
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .recommend
    width 100%
    position fixed
    top 88px
    bottom 0
    .recommend-wrapper
      height 100%
</style>
