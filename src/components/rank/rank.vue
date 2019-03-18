<template>
  <div class="rank">
    <scroll :data="topList" ref="topList">
      <ul class="topList">
        <li @click="selectDisc(item)" class="item" v-for="(item, index) in topList" :key="index">
          <div class="img-wrapper">
            <img width="100" height="100" v-lazy="item.picUrl" alt="img photo">
          </div>
          <div class="text">
            <p v-for="(info, index) in item.songList"
               :key="index" class="song-info">
               {{index + 1}} {{info.songname}} - {{info.singername}}
            </p>
          </div>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import {mapMutations} from 'vuex'
import {playListMixin} from 'common/js/mixin'

export default {
  mixins: [playListMixin],
  components: {
    Scroll
  },
  activated () {
    if (this.topList.length > 0) {
      this.$refs.topList.refresh()
    }
  },
  created () {
    this._getTopList()
  },
  data () {
    return {
      topList: []
    }
  },
  methods: {
    handlePlayList (list) {
      if (list.length > 0) {
        this.$refs.topList.$el.style.bottom = '60px'
        this.$refs.topList.refresh()
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    }),
    selectDisc (item) {
      if (item) {
        this.$router.push(`/rank/${item.id}`)
        this.setDisc(item)
      }
    },
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .rank
    width 100%
    position fixed
    top 88px
    bottom 0
    .topList
      padding-bottom 20px
      .item
        display flex
        margin 0 20px
        padding-top 20px
        font-size 0
        .img-wrapper
          flex 0 0 100px
        .text
          flex 1
          padding 0 20px
          display flex
          flex-direction column
          justify-content center
          height 100px
          background $color-highlight-background
          // 文字溢出必备
          overflow hidden
          p
            line-height 30px
            font-size $font-size-small
            color $color-text-l
            no-wrap()
</style>
