<template>
  <section class="loading">
    <img src="./loading.gif" alt="loading">
    <p>{{title}}</p>
  </section>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在加载...'
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .loading
    text-align center
    img
      width 24px
      height 24px
    p
      line-height 24px
      font-size $font-size-medium
      color $color-text-l
</style>
