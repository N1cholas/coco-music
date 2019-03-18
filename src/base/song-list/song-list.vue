<template>
  <ul class="song-list">
    <li @click="selectSong(item, index)" class="song-item" v-for="(item, index) in data" :key="index">
      <p class="name">{{item.name}}</p>
      <p class="singer">{{getSinger(item)}}</p>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  methods: {
    getSinger (song) {
      return `${song.singer} · ${song.album}`
    },
    selectSong (song, index) {
      this.$emit('selectSong', song, index)
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  .song-list
    padding 20px 30px
    overflow hidden
    position absolute
    top 0
    left 0
    right 0
    color $color-text
    .song-item
      // height 64px
      margin 20px 0
      line-height 20px
      font-size $font-size-medium
      .singer
        margin-top 4px
        color $color-text-l
</style>
