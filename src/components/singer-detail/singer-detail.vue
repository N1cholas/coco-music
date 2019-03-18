<template>
  <transition name="slide">
    <music-list :title="title"
                :bg-image="bgImage"
                :songs="songList"></music-list>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {getSongVkey} from 'api/song'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  components: {
    MusicList
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getSingerDetail()
  },
  data () {
    return {
      songList: []
    }
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songList = this._normalizeSong(res.data.list)
        }
      })
    },
    _normalizeSong (list) {
      let ret = []

      list.forEach(item => {
        let {musicData} = item

        getSongVkey(musicData.songmid).then(res => {
          const vkey = res.data.items[0].vkey
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData, vkey))
          }
        })
      })

      return ret
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
