<template>
  <section class="singer">
    <list-view ref="scrollList" @select="selectSinger" :data="singerList"></list-view>
    <router-view></router-view>
  </section>
</template>
<script>
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  components: {
    ListView
  },
  created () {
    this._getSingerList()
  },
  data () {
    return {
      singerList: []
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singerList = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger (list) {
      // 生成数据对象
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }

        let key = item.Findex

        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }

        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })

      // 排序
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/['a-zA-Z']/)) {
          ret.push(val)
        } else if (val.title.match(HOT_NAME)) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret)
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .singer
    position fixed
    left 0
    right 0
    top 88px
    bottom 0
</style>
