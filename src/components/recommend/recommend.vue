<template>
  <div class="recommend-wrapper">
    <scroll ref="scroll" :data="songMenuList">
      <div class="recommend">
        <slider v-if="sliderData.length">
          <div v-for="(item, index) in sliderData" :key="index">
            <a :href="item.linkUrl">
              <img class="needsclick" @load="imageLoaded" :src="item.picUrl" alt="slider imgs">
            </a>
          </div>
        </slider>
        <div class="list">
          <h1 class="title">热门歌单推荐</h1>
          <ul>
            <li @click="secletDisc(item)" class="item" v-for="(item, index) in songMenuList" :key="index">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="icon">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        <loading v-show="!songMenuList.length"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import { getSliderData, getSongMenuList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import {playListMixin} from 'common/js/mixin'
import Disc from 'components/disc/disc'
import {mapMutations} from 'vuex'

export default {
  mixins: [playListMixin],
  created () {
    this._getSliderData()
    this._getSongMenuList()
  },
  components: {
    Slider, Scroll, Loading, Disc
  },
  activated () {
    if (this.songMenuList.length > 0) {
      this.$refs.scroll.refresh()
    }
  },
  data () {
    return {
      sliderData: [],
      songMenuList: []
    }
  },
  methods: {
    secletDisc (item) {
      if (item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      }
    },
    handlePlayList (list) {
      if (list.length > 0) {
        this.$refs.scroll.$el.style.bottom = '60px'
        this.$refs.scroll.refresh()
      }
    },
    _getSliderData () {
      getSliderData().then(res => {
        if (res.code === ERR_OK) {
          this.sliderData = res.data.slider
        }
      })
    },
    _getSongMenuList () {
      getSongMenuList().then(res => {
        if (res.code === ERR_OK) {
          this.songMenuList = res.data.list
        }
      })
    },
    imageLoaded () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .recommend-wrapper
    width 100%
    position fixed
    top 88px
    bottom 0
    overflow hidden
    .recommend
      .list
        .title
          height 65px
          line-height 65px
          text-align center
          color $color-theme
          font-size $font-size-medium
        .item
          display flex
          align-items center
          padding 0 20px 20px
          .icon
            width 60px
            flex 0 0 60px
            padding-right 20px
            img
              width 60px
              height 60px
          .text
            line-height 20px
            font-size: $font-size-medium
            .name
              margin-bottom 10px
              color $color-text
            .desc
              color $color-text-d
</style>
