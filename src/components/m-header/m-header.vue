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
    .logo
      width 30px
      height 32px
      margin-top 6px
      margin-right 9px
      display inline-block
      vertical-align top
      bg-image('logo')
      background-size cover
    .title
      display inline-block
      vertical-align top
      line-height 44px
      font-size $font-size-large
</style>
