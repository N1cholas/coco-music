<template>
  <transition name="slide">
    <music-list :title="title"
                :bgImage="bgImage"
                :songs="songs"></music-list>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getSongVkey} from 'api/song'

export default {
  created () {
    if (!this.disc) {
      this.$router.push('/recommend')
      return
    }

    // 延迟请求 保证动画流畅
    setTimeout(() => {
      this._getSongList()
    }, 300)
  },
  methods: {
    _getSongList () {
      if (!this.disc) return

      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          getSongVkey(musicData.songmid).then(res => {
            const vkey = res.data.items[0].vkey
            ret.push(createSong(musicData, vkey))
          })
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title () {
      if (!this.disc) return ''
      return this.disc.dissname
    },
    bgImage () {
      if (!this.disc) return ''
      return this.disc.imgurl
    }
  },
  data () {
    return {
      songs: []
    }
  }
}
</script>
<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
