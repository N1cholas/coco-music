<template>
  <div class="listview-wrapper" v-if="data.length>0">
    <scroll class="listview"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            :data="data"
            @scroll="scroll"
            ref="listview">
      <ul class="list-content">
        <li class="group" v-for="(group, index) in data" :key="index" ref="grouplist">
          <h2 class="title">{{group.title}}</h2>
          <ul>
            <li class="item" @click="selectItem(item)" v-for="(item, index) in group.items" :key="index">
              <img class="avatar" v-lazy="item.avatar" alt="avatar">
              <p class="name">{{item.name}}</p>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <ul class="shortcut-list">
      <li class="item"
        v-for="(item, index) in shortcurList"
        :key="index"
        :data-index="index"
        :class="{active: currentIndex === index}"
        @touchstart.stop.prevent="onShortcurTouchStart"
        @touchmove.stop.prevent="onShortcurTouchMove">{{item}}</li>
    </ul>
    <div class="fixed-title" ref="fixedTitle" v-show="fixedTitle">{{fixedTitle}}</div>
    <loading class="loading" v-show="!data.length"></loading>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'
import {playListMixin} from 'common/js/mixin'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  mixins: [playListMixin],
  created () {
    // 用于滑动侧栏实现连续滚动
    this.touch = {}
    // 用于联动
    this.listHeight = []
    // 设置bs属性
    this.listenScroll = true
    this.probeType = 3
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
      shortcurList: []
    }
  },
  activated () {
    if (this.data.length > 0) {
      this.$refs.listview.refresh()
    }
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  components: {
    Scroll, Loading
  },
  computed: {
    fixedTitle () {
      if (this.scrollY > 0) return ''

      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    handlePlayList (list) {
      if (list.length > 0) {
        this.$refs.listview.$el.style.bottom = '60px'
        this.$refs.listview.refresh()
      }
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    onShortcurTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')
      this.touch.y1 = e.touches[0].pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcurTouchMove (e) {
      let y2 = e.touches[0].pageY
      let delta = (y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      if (!index && index !== 0) return

      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }

      this.$refs.listview.scrollToElement(this.$refs.grouplist[index], 100)
    },
    _calculateHeight () {
      let list = this.$refs.grouplist
      let height = 0
      this.listHeight.push(height)
      for (let i = 0, len = list.length; i < len; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data (newVal) {
      setTimeout(() => {
        this._calculateHeight()
        this.shortcurList = newVal.map(group => {
          return group.title.substring(0, 1)
        })
        this.$refs.listview.refresh()
      }, 20)
    },
    scrollY (newY) {
      if (newY > 0) {
        this.currentIndex = 0
        return
      }

      let list = this.listHeight

      for (let i = 0, len = list.length - 1; i < len; i++) {
        let h1 = list[i]
        let h2 = list[i + 1]
        if (-newY >= h1 && -newY < h2) {
          this.currentIndex = i
          this.diff = h2 + newY
          return
        }
      }

      this.currentIndex = list.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTitle.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .listview-wrapper
    position relative
    min-height: 1px;
    width: 100%;
    top: 0;
    bottom: 0;
    position: absolute;
    overflow: hidden;
    background #222
    .list-content
      .group
        padding-bottom 30px
        .title
          height 30px
          padding-left 20px
          line-height 30px
          background $color-highlight-background
          color $color-text-l
          font-size $font-size-small
        .item
          padding 20px 30px 0
          display flex
          align-items center
          .avatar
            width 50px
            height 50px
            border-radius 50%
          .name
            margin-left 20px
            font-size $font-size-medium
            color $color-text-l
    .shortcut-list
      width 20px
      padding 20px 0
      position absolute
      right 0
      top 50%
      transform translateY(-50%)
      border-radius 10px
      text-align center
      background rgba(0,0,0,.3)
      font-family Helvetica
      .item
        padding 3px
        line-height 1
        color hsla(0,0%,100%,.5)
        font-size 12px
        &.active
          color $color-theme
    .fixed-title
      height 30px
      padding-left 20px
      line-height 30px
      background $color-highlight-background
      color $color-text-l
      font-size $font-size-small
</style>
