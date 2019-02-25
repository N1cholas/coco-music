<template>
  <header class="m-header">
    <section class="logo"></section>
    <h1 class="title">coco-music</h1>
  </header>
</template>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .m-header
    height 44px
    text-align center
    // 清楚幽灵空白符
    font-size 0
    .logo
      width 30px
      height 32px
      display inline-block
      vertical-align top
      margin-top 6px
      margin-right 9px
      bg-image('logo')
      background-size cover
    .title
      line-height 44px
      display inline-block
      vertical-align top
      font-size $font-size-large
</style>
