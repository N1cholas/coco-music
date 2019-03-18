<template>
  <transition name="slide">
    <section v-if="playList.length>0 && listShow" class="playlist">
      <h2 class="title">
        <i @click="back" class="back icon-back"></i>
        <span class="text">播放列表</span>
      </h2>
      <scroll class="playlist-scroll" :data="playList" ref="plScroll">
        <ul>
          <li class="item"
              ref="plItem"
              @click="selectSong(index)"
              :class="{active: currentSong.id === item.id}"
              v-for="(item, index) in playList"
              :key="index">
              <p class="songname">{{item.name}} - {{item.singer}}</p>
          </li>
        </ul>
      </scroll>
    </section>
  </transition>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import Scroll from 'base/scroll/scroll'

export default {
  components: {
    Scroll
  },
  computed: {
    ...mapGetters([
      'playList',
      'listShow',
      'currentSong',
      'currentIndex'
    ])
  },
  watch: {
    currentIndex (newVal) {
      if (!this.listShow) return

      const plItem = this.$refs.plItem

      if (newVal < 5) {
        this.$refs.plScroll.scrollTo(0, 0, 300)
      } else if (newVal > 5 && newVal < plItem.length - 6) {
        this.$refs.plScroll.scrollToElement(plItem[newVal - 5], 300)
      } else {
        this.$refs.plScroll.scrollTo(0, this.$refs.plScroll.getY(), 300)
      }
    }
  },
  methods: {
    ...mapMutations({
      setListShow: 'SET_LIST_SHOW',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    back () {
      this.setListShow(false)
    },
    selectSong (index) {
      this.setCurrentIndex(index)
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(0, 100%, 0)

  .playlist
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background $color-highlight-background
    .title
      padding 0 50px
      font-size $font-size-large
      line-height 44px
      color $color-text
      text-align center
      no-wrap()
      .back
        padding 12px
        position absolute
        top 0
        left 0
        font-size 18px
        color $color-theme
        transform rotate(-90deg)
    .playlist-scroll
      top 44px
      bottom 60px
      padding 0 30px
      background $color-background
      box-sizing border-box
      .item
        padding 13px 0
        color $color-text
        font-size $font-size-medium
        &.active
          color $color-theme
</style>
