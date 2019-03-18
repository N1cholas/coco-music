<template>
  <section class="music-list">
    <h2 class="title">
      <i @click="backToView" class="back icon-back"></i>
      <span v-html="title"></span>
    </h2>
    <div class="top-image" :style="bgStyle" ref="headerImage">
      <div class="btn-wrapper" v-if="songs.length>0" ref="btnPlay">
        <div class="play-random" @click.stop="rPlay">
          <i class="icon-play"></i><span class="text">随机播放</span>
        </div>
      </div>
      <div class="mask"></div>
    </div>
    <div class="layer" ref="layer"></div>
    <scroll class="list"
            :data="songs"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            @scroll="getScrollY"
            ref="list">
      <song-list @selectSong="selectSong" :data="songs"></song-list>
      <loading class="loading" v-show="!songs.length"></loading>
    </scroll>
  </section>
</template>
<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'
import { playListMixin } from 'common/js/mixin'

const HEIGHT = 44

const transform = prefixStyle('transform')

export default {
  mixins: [playListMixin],
  components: {
    SongList, Scroll, Loading
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: null
    }
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.bgImage})`
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.headerImage = this.$refs.headerImage
    this.layer = this.$refs.layer
    this.list = this.$refs.list

    this.imageHeight = this.headerImage.clientHeight
    this.translateYMax = this.imageHeight - HEIGHT

    this.list.$el.style.top = `${this.imageHeight}px`
  },
  data () {
    return {
      scrollY: -1
    }
  },
  methods: {
    handlePlayList (list) {
      if (list.length > 0) {
        this.$refs.list.$el.style.bottom = '40px'
        this.$refs.list.refresh()
      }
    },
    rPlay () {
      this.randomPlay({
        list: this.songs
      })
    },
    backToView () {
      this.$router.back()
    },
    getScrollY (pos) {
      this.scrollY = pos.y
    },
    selectSong (song, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.min(this.translateYMax, -newY)
      this.layer.style[transform] = `translate3d(0,${-translateY}px,0)`
      if (translateY === this.translateYMax) {
        this.headerImage.style['height'] = HEIGHT + 'px'
        this.headerImage.style['z-index'] = 30
        this.$refs.btnPlay.style['display'] = 'none'
      } else {
        this.headerImage.style['height'] = this.imageHeight + 'px'
        this.headerImage.style['z-index'] = 5
        this.$refs.btnPlay.style['display'] = 'block'
      }
      // 往下滚动
      if (newY > 0) {
        let scale = 1 + Math.abs(newY / this.imageHeight)
        this.headerImage.style[transform] = `scale(${scale})`
        this.headerImage.style['z-index'] = 30
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  .music-list
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background $color-background
    z-index 4
    .title
      width 100%
      position absolute
      z-index 100
      text-align center
      font-size $font-size-large
      color $color-text
      line-height 44px
      .back
        padding 12px
        position absolute
        top 0
        left 0
        color $color-theme
    .top-image
      height 40%
      position relative
      transform-origin top
      top 0
      left 0
      right 0
      text-align center
      background-size cover
      z-index 5
      .mask
        width 100%
        height 100%
        position absolute
        background rgba(7,17,27,.4)
        z-index -1
      .btn-wrapper
        width 100%
        position absolute
        bottom 20px
        .play-random
          width 135px
          padding 7px 0
          margin 0 auto
          box-sizing border-box
          color $color-theme
          border 1px solid
          border-radius 25px
          font-size 0
          .icon-play
            margin-right 5px
            display inline-block
            vertical-align top
            font-size $font-size-medium
          .text
            display inline-block
            vertical-align top
            font-size $font-size-small
    .list
      overflow unset
      z-index 20
      .loading
        width 100%
        position absolute
        top 130px
    .layer
      width 100%
      height 100%
      position absolute
      background $color-background
      z-index 10
</style>
