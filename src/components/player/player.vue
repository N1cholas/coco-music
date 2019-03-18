<template>
  <footer class="player" v-if="playList.length>0">
    <transition name="normal" appear
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <section v-show="fullScreen" class="normal-player">
        <div class="bg">
          <img :src="currentSong.image" alt="bg img">
        </div>
        <header class="top">
          <i @click.stop="back" class="back icon-back"></i>
          <h2 class="title" v-html="currentSong.name"></h2>
          <h3 class="subtitle" v-html="currentSong.singer"></h3>
        </header>
        <section class="middle"
                 @touchstart.prevent="middleTouchStart"
                 @touchmove.prevent="middleTouchMove"
                 @touchend.prevent="middleTouchEnd"
        >
          <div class="cd-wrapper" ref="cdWrapper">
            <img ref="cdImage"
                 :src="currentSong.image"
                 alt="cd img"
                 :class="{'play-pause': !playing || !isCd}">
            <p class="lyric-active" v-html="activeLyric"></p>
          </div>
          <div class="lyric-wrapper" v-if="currentLyric" ref="lyric">
            <scroll ref="lyricScroll" :click="isClick" :data="currentLyric.lines">
              <ul class="lyric">
                <li class="lyric-item"
                    v-for="(item, index) in currentLyric.lines"
                    :key="index"
                    :class="{active: index === currentLyricIndex}"
                    ref="lyricItem"
                    v-html="item.txt">
                </li>
              </ul>
            </scroll>
          </div>
        </section>
        <footer class="bottom">
          <div class="dots-wrapper">
            <span class="dot" :class="{active: isCd}"></span>
            <span class="dot" :class="{active: !isCd}"></span>
          </div>
          <div class="progress-wrapper">
            <p class="text">{{formal(currentTime)}}</p>
            <div class="progress-content">
              <progress-bar :time="currentTime"
                            :duration="currentSong.duration"
                            :percent="percent"
                            @updateProgress="updateProgress"
                            @progressChange="onChangeProgress"></progress-bar>
            </div>
            <p class="text">{{formal(currentSong.duration)}}</p>
          </div>
          <div class="icons-wrapper">
            <i @click.stop="modeChange" class="icon" :class="iconMode"></i>
            <i @click.stop="prevSong" class="icon icon-prev" :class="iconDisable"></i>
            <i @click.stop="togglePlaying" class="icon" :class="[iconTogglePlay.normal,iconDisable]"></i>
            <i @click.stop="nextSong" class="icon icon-next" :class="iconDisable"></i>
            <i @click.stop="showList" class="icon icon-playlist"></i>
            <!-- <i class="icon icon-favorite"></i> -->
          </div>
        </footer>
      </section>
    </transition>
    <transition name="mini">
      <section @click.stop="open" class="mini-player" v-show="!fullScreen">
        <div v-show="currentTime > 0" class="mini-bar" ref="miniBar"></div>
        <div class="cd-wrapper">
          <img :src="currentSong.image" alt="cd img" :class="{'play-pause': !playing}">
        </div>
        <div class="text">
          <p class="name" v-html="currentSong.name"></p>
          <p class="singer" v-html="currentSong.singer"></p>
        </div>
        <div class="icon-wrapper">
          <i @click.stop="prevSong" class="icon icon-prev" :class="iconDisable"></i>
        </div>
        <div class="icon-wrapper">
          <i @click.stop="togglePlaying" class="icon" :class="iconTogglePlay.mini"></i>
        </div>
        <div class="icon-wrapper">
          <i @click.stop="nextSong" class="icon icon-next" :class="iconDisable"></i>
        </div>
        <div class="icon-wrapper">
          <i @click.stop="showList" class="icon icon-playlist"></i>
        </div>
      </section>
    </transition>
    <audio  ref="player"
            :src="currentSong.url"
            @canplay="ready"
            @error="error"
            @timeupdate="updateTime"
            @ended="end">
    </audio>
  </footer>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import ProgressBar from 'base/progress-bar/progress-bar'
import animations from 'create-keyframe-animation'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/utils'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')

export default {
  components: {
    ProgressBar, Scroll
  },
  computed: {
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'playMode',
      'sequenceList',
      'listShow'
    ]),
    iconTogglePlay () {
      return {
        normal: this.playing ? 'icon-pause' : 'icon-play',
        mini: this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      }
    },
    iconDisable () {
      return this.songReady ? '' : ''
    },
    iconMode () {
      return this.playMode === playMode.sequence ? 'icon-sequence'
        : this.playMode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  data () {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLyricIndex: 0,
      activeLyric: '',
      isCd: true,
      touch: {},
      isClick: Object.freeze(false)
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (oldSong && (newSong.id === oldSong.id)) return

      if (this.currentLyric) this.currentLyric.stop()

      this.getSongLyric()

      setTimeout(() => {
        this.$refs.player.play()
        this.currentLyric.play()
      }, 500)
    },
    playing (flag) {
      this.$nextTick(() => {
        const player = this.$refs.player
        flag ? player.play() : player.pause()
      })
    },
    currentTime (newTime) {
      // mini 播放器 进度条
      const width = window.innerWidth
      const percent = newTime / this.currentSong.duration
      this.$refs.miniBar.style.width = percent * width + 'px'
    }
  },
  methods: {
    showList () {
      this.setListShow(!this.listShow)
      this.setFullScreen(false)
    },
    middleTouchStart (e) {
      this.touch.init = true
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
    },
    middleTouchMove (e) {
      if (this.touch.init) {
        let startX1 = this.touch.startX
        let startY1 = this.touch.startY

        let startX2 = e.touches[0].pageX
        let startY2 = e.touches[0].pageY

        let deltrX = Math.abs(startX2 - startX1)
        let deltrY = Math.abs(startY2 - startY1)

        if (deltrY > deltrX) return

        if (deltrX > window.innerWidth * 0.1) {
          let dir = startX2 - startX1
          let offsetWidth = 0
          let opacity = 0

          if (dir < 0) {
            offsetWidth = 0
            opacity = 0
            this.isCd = false
          } else {
            offsetWidth = window.innerWidth
            opacity = 1
            this.isCd = true
          }

          this.$refs.lyric.style[transform] = `translate3d(${offsetWidth}px,0,0)`
          this.$refs.cdWrapper.style.opacity = opacity
        }
      }
    },
    middleTouchEnd () {
      this.touch.init = false
    },
    getSongLyric () {
      return this.currentSong.getLyric().then(lyric => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
      }).catch(() => {
        this.currentLyric = null
        this.currentLyricIndex = 0
        this.activeLyric = ''
      })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLyricIndex = lineNum

      this.activeLyric = txt

      const scroll = this.$refs.lyricScroll

      if (lineNum > 5) {
        scroll.scrollToElement(this.$refs.lyricItem[lineNum - 5], 300)
      } else {
        scroll.scrollTo(0, 0, 300)
      }
    },
    end () {
      if (this.playMode === playMode.loop) {
        this.loop()
      } else {
        this.nextSong()
      }
    },
    loop () {
      this.$refs.player.currentTime = 0
      this.$refs.player.play()
      this.currentLyric.seek(0)
      this.currentLyric.play()
    },
    modeChange () {
      this.setPlayMode(this._circle(this.playMode + 1, 3))
      if (this.playMode === playMode.random) {
        let list = shuffle(this.sequenceList)
        let index = list.findIndex(item => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
        this.setPlayList(list)
      }
    },
    onChangeProgress (percent) {
      if (!percent) return

      const currentTime = this.currentSong.duration * percent

      this.$refs.player.currentTime = currentTime

      if (!this.playing) {
        this.togglePlaying()
      }

      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    updateProgress (percent) {
      this.currentTime = this.currentSong.duration * percent
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
      if (this.playing) {
        this.togglePlaying()
        setTimeout(() => {
          this.nextSong()
        }, 1000)
      }
    },
    formal (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60 | 0)
      return `${minute}:${second}`
    },
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    updateTime (el) {
      this.currentTime = el.target.currentTime
    },
    nextSong () {
      this.playSong(+1)
    },
    prevSong () {
      this.playSong(-1)
    },
    playSong (delta) {
      if (!this.songReady) return

      if (this.playList.length === 1) {
        this.loop()
      } else {
        if (!this.playing) {
          this.togglePlaying()
        }

        this.setCurrentIndex(this._circle(this.currentIndex + delta, this.playList.length))
        this.songReady = false
      }
    },
    togglePlaying (e) {
      this.setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN',
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST',
      setListShow: 'SET_LIST_SHOW'
    }),
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = [
        {
          translate: [x, y],
          scale
        },
        {
          translate: [0, 0],
          scale: 1.1
        },
        {
          translate: [0, 0],
          scale: 1
        }
      ]

      animations.registerAnimation({
        name: 'in',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdImage, 'in', done)
    },
    afterEnter () {
      animations.unregisterAnimation('in')
      this.$refs.cdImage.style.animation = ''
    },
    leave (el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          translate: [0, 0],
          scale: 1
        },
        100: {
          translate: [x, y],
          scale
        }
      }

      animations.registerAnimation({
        name: 'out',
        animation,
        presets: {
          easing: 'linear',
          duration: 400
        }
      })

      animations.runAnimation(this.$refs.cdImage, 'out', done)
    },
    afterLeave (el) {
      animations.unregisterAnimation('out')
      this.$refs.cdImage.style.animation = ''
    },
    _getPosAndScale () {
      const width = window.innerWidth * 0.78
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 89
      const x = (window.innerWidth / 2) - paddingLeft
      const y = window.innerHeight - paddingBottom - paddingTop - (width / 2)
      const scale = 40 / width
      return {
        x: -x,
        y,
        scale
      }
    },
    _circle (index, length) {
      return ((index % length) + length) % length
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  @keyframes cd-rotate {
    0% {
      transform rotate(0)
    }
    100% {
      transform rotate(360deg)
    }
  }

  .player
    .normal-player
      position fixed
      top 0
      bottom 0
      left 0
      right 0
      background $color-background
      .bg
        width 100%
        height 100%
        position absolute
        z-index -1
        img
          width 100%
          height 100%
          filter blur(20px)
      .top
        position relative
        text-align center
        color $color-text
        overflow hidden
        .back
          padding 12px
          position absolute
          top 0
          left 0
          transform rotate(-90deg)
          font-size $font-size-large
          color $color-theme
        .title
          padding 0 50px
          font-size $font-size-large
          line-height 44px
          no-wrap()
        .subtitle
          font-size $font-size-medium
          line-height 20px
      .middle
        position absolute
        top 89px
        bottom 150px
        left 0
        right 0
        .cd-wrapper
          transition all .4s
          text-align center
          img
            width 78%
            border-radius 50%
            border 10px solid hsla(0,0%,100%,.1)
            animation cd-rotate 20s infinite linear
            &.play-pause
              animation-play-state paused
          .lyric-active
            margin 25px 20px 0
            color: $color-text-l
            font-size: $font-size-medium
        .lyric-wrapper
          position absolute
          left 0
          right 0
          top 0
          bottom 0
          transition all .4s
          transform translate3d(100%, 0, 0)
          .lyric
            margin 0 20px
            text-align center
            color: $color-text-l
            font-size: $font-size-medium
            .lyric-item
              line-height 32px
              &.active
                color $color-text
      .bottom
        width 100%
        height 150px
        position fixed
        bottom 0
        .dots-wrapper
          margin-top 25px
          text-align center
          font-size 0
          .dot
            width 8px
            height 8px
            margin 0 4px
            display inline-block
            vertical-align top
            border-radius 4px
            background $color-text-l
            &.active
              width 20px
              background $color-text
        .progress-wrapper
          height 30px
          margin 10px 0
          padding 0 37px
          display flex
          .text
            flex 0 0 30px
            text-align center
            line-height 30px
            font-size $font-size-small
            color $color-text
          .progress-content
            flex 1
        .icons-wrapper
          padding 0 20px
          display flex
          justify-content space-around
          .icon
            flex 1
            text-align center
            font-size 30px
            &.disable
              background rgba(255,205,49,.5)
      &.normal-enter-active, &.normal-leave-active
        transition all .4s
        .top, .bottom
          transition all .4s cubic-bezier(.45,0,.63,1.32)
      &.normal-enter, &.normal-leave-to
        opacity 0
        .top
          transform translate3d(0, -64px, 0)
        .bottom
          transform translate3d(0, 150px, 0)
    .mini-player
      padding 10px 20px
      display flex
      position fixed
      left 0
      right 0
      bottom 0
      background $color-highlight-background
      color $color-theme
      .mini-bar
        width 0
        height 2px
        position absolute
        top 0
        left 0
        background $color-theme
      .cd-wrapper
        margin-right 10px
        flex 0 0 40px
        font-size 0
        img
          width 40px
          height 40px
          border-radius 50%
          animation cd-rotate 20s infinite linear
          &.play-pause
            animation-play-state paused
      .text
        flex 1
        line-height 20px
        overflow hidden
        .name
          font-size $font-size-medium
          no-wrap()
        .singer
          font-size $font-size-small
          color $color-text-l
          no-wrap()
      .icon-wrapper
        flex 0 0 30px
        margin-left 10px
        font-size 30px
        .icon
          display inline-block
          margin-top 5px
      &.mini-enter-active, &.mini-leave-active
        transition all .3s
      &.mini-enter, &.mini-leave-to
        opacity 0
        transform translate3d(0, 60px, 0)
    audio
      visibility hidden
</style>
