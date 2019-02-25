<template>
  <header class="m-header">
    <div class="logo"></div>
    <h1 class="title">coco-music</h1>
  </header>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .m-header
    text-align center
    font-size 0
    height 44px
    .logo
      bg-image('logo')
      width 30px
      height 32px
      display inline-block
      margin-top 6px
      margin-right 9px
      vertical-align top
      background-size cover
    .title
      display inline-block
      font-size $font-size-large
      vertical-align top
      line-height 44px
</style>
