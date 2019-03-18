<template>
  <section class="tab">
    <router-link class="tab-item" tag="div" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <!-- <router-link class="tab-item" tag="div" to="/search">
      <span class="tab-link">搜索</span>
    </router-link> -->
  </section>
</template>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .tab
      display flex
    .tab-item
        flex 1
        text-align center
      .tab-link
        padding-bottom 5px
        line-height 44px
        color $color-text-l
        font-size $font-size-medium
      &.router-link-active
        .tab-link
          border-bottom 2px solid
          color $color-theme
</style>
