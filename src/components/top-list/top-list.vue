<template>
  <transition name="slide">
    <music-list :title="title"
                :bg-image="bgImage"
                :songs="songs"></music-list>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex'
import MusicList from 'components/music-list/music-list'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getSongVkey} from 'api/song'

export default {
  components: {
    MusicList
  },
  created () {
    if (!this.disc) {
      this.$router.push('/rank')
      return
    }

    // 延迟请求 保证动画流畅
    setTimeout(() => {
      this._getSongList(this.disc.id)
    }, 300)
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      if (!this.disc) return ''

      return this.disc.topTitle
    },
    bgImage () {
      if (!this.disc) return ''

      return this.disc.picUrl
    },
    ...mapGetters([
      'disc'
    ])
  },
  methods: {
    _getSongList (id) {
      getMusicList(id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizSong(res.songlist)
        }
      })
    },
    _normalizSong (list) {
      let ret = []
      list.forEach(item => {
        let musicData = item.data
        if (musicData.songid && musicData.albumid) {
          getSongVkey(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              const vkey = res.data.items[0].vkey
              ret.push(createSong(musicData, vkey))
            }
          })
        }
      })

      return ret
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
